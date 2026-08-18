import Project from "../models/Project.js";
import Blog from "../models/Blog.js";
import { Career } from "../models/Career.js";

// Resolves the public site's canonical origin (no trailing slash), in
// priority order:
//   1. SITE_URL — set this explicitly once the production frontend domain
//      is final; the single clearest source of truth.
//   2. CLIENT_URL — already configured for CORS, reused as a fallback so
//      this works out of the box without a new env var.
//   3. The incoming request's own protocol/host — correct by construction
//      whenever the Express server serves the built frontend itself (see
//      server.js's production static-file block), which is this app's
//      primary deployment shape (one Render service, one origin).
const getSiteUrl = (req) => {
  const explicit = process.env.SITE_URL || process.env.CLIENT_URL?.split(",")[0]?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
};

const escapeXml = (str) =>
  String(str).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);

// Every static public page (excludes dynamic :slug routes, handled below,
// and the admin/auth areas, which robots.txt explicitly disallows).
const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.8", changefreq: "monthly" },
  { path: "/projects", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/gallery", priority: "0.6", changefreq: "monthly" },
  { path: "/team", priority: "0.6", changefreq: "monthly" },
  { path: "/testimonials", priority: "0.6", changefreq: "monthly" },
  { path: "/careers", priority: "0.7", changefreq: "weekly" },
  { path: "/careers/general", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/policy", priority: "0.4", changefreq: "yearly" },
];

const urlEntry = (loc, { priority, changefreq, lastmod }) => {
  const lastmodLine = lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "";
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmodLine}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

// @desc   Dynamic XML sitemap — static pages + every project, every
//         published blog post, every open career listing.
// @route  GET /sitemap.xml
export const getSitemap = async (req, res) => {
  const siteUrl = getSiteUrl(req);

  const [projects, blogs, careers] = await Promise.all([
    Project.find().select("slug updatedAt").lean(),
    Blog.find({ status: "published" }).select("slug updatedAt").lean(),
    Career.find({ status: "open" }).select("slug updatedAt").lean(),
  ]);

  const entries = [
    ...STATIC_PAGES.map((p) => urlEntry(`${siteUrl}${p.path}`, p)),
    ...projects.map((p) =>
      urlEntry(`${siteUrl}/projects/${p.slug}`, { priority: "0.6", changefreq: "monthly", lastmod: p.updatedAt })
    ),
    ...blogs.map((b) =>
      urlEntry(`${siteUrl}/blog/${b.slug}`, { priority: "0.6", changefreq: "monthly", lastmod: b.updatedAt })
    ),
    ...careers.map((c) =>
      urlEntry(`${siteUrl}/careers/${c.slug}`, { priority: "0.6", changefreq: "weekly", lastmod: c.updatedAt })
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  res.type("application/xml").send(xml);
};

// @desc   robots.txt — open to crawling except the admin panel and auth
//         flows, points crawlers at the sitemap above.
// @route  GET /robots.txt
export const getRobotsTxt = (req, res) => {
  const siteUrl = getSiteUrl(req);
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`;
  res.type("text/plain").send(body);
};
