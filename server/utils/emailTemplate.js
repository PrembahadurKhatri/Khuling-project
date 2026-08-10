// Wraps any inner HTML in a branded card — logo header, navy/gold accents
// matching the site palette, footer — instead of sending raw unstyled
// snippets. Used by every outgoing email (auth, applications, contact).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const COMPANY_NAME = "Khilung Kalika Construction";

// CLIENT_URL may be a comma-separated list (see server.js CORS config) —
// use the first one as the canonical public site link in the footer.
const siteUrl = (process.env.CLIENT_URL || "").split(",")[0]?.trim() || "";

// The logo is embedded as a real inline attachment (referenced via
// "cid:khilung-logo" below), not linked by external URL and not a data:
// URI. Two things ruled those out:
//  - Linking to CLIENT_URL/logo.png is fragile — the frontend is on Vercel,
//    whose subdomain changes on many redeploys, and there's no owned custom
//    domain to pin to instead. A dead/stale URL just means a broken image
//    forever until someone notices.
//  - data: URI <img> tags have inconsistent support across email clients —
//    several (Outlook desktop among them) simply don't render them at all.
// A CID-referenced inline attachment is the standard, universally-supported
// way transactional email systems embed a logo — sendEmail.js imports
// getLogoAttachment() below and attaches it to every send.
export const LOGO_CID = "khilung-logo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let logoAttachment = null;
try {
  const logoPath = path.join(__dirname, "../../client/public/logo.png");
  const logoBuffer = fs.readFileSync(logoPath);
  logoAttachment = {
    content: logoBuffer.toString("base64"),
    filename: "logo.png",
    type: "image/png",
    disposition: "inline",
    content_id: LOGO_CID,
  };
} catch (err) {
  console.warn("emailTemplate.js: couldn't load logo.png for embedding:", err.message);
}

export const getLogoAttachment = () => logoAttachment;

const wrapEmail = ({ title, bodyHtml, preheader = "" }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:'Segoe UI',Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(11,31,58,0.08);">

          <tr>
            <td style="background:linear-gradient(135deg,#0b1f3a 0%,#102a4c 50%,#0a192f 100%);padding:28px 32px;text-align:center;">
              ${logoAttachment ? `<img src="cid:${LOGO_CID}" alt="${COMPANY_NAME}" width="44" height="44" style="display:block;margin:0 auto 10px;border-radius:8px;" />` : ""}
              <span style="color:#f5f3ee;font-size:15px;font-weight:700;letter-spacing:0.04em;">${COMPANY_NAME}</span>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px;">
              ${title ? `<h1 style="margin:0 0 16px;font-size:20px;color:#0b1f3a;font-weight:700;">${title}</h1>` : ""}
              <div style="font-size:14px;line-height:1.7;color:#333333;">
                ${bodyHtml}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background:#f5f3ee;border-top:1px solid #e5e1d8;text-align:center;">
              <p style="margin:0;font-size:11px;color:#8a8578;letter-spacing:0.03em;">
                ${COMPANY_NAME}${siteUrl ? ` &middot; <a href="${siteUrl}" style="color:#c99a3f;text-decoration:none;">${siteUrl.replace(/^https?:\/\//, "")}</a>` : ""}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export default wrapEmail;
