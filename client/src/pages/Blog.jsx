import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";

const fetchBlogs = async (params) => {
  const { data } = await api.get("/blogs", { params });
  return data;
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

const CategoryBadge = ({ children }) => (
  <span className="inline-flex items-center px-3 text-navy/80 badge-teal py-1 rounded-full  font-semibold tracking-[0.12em] uppercase">
    {children}
  </span>
);

const SkeletonCard = () => (
  <div className="animate-pulse space-y-4">
    <div className="aspect-[4/3] rounded-2xl bg-stone" />
    <div className="h-3 w-20 bg-stone rounded-full" />
    <div className="h-5 w-4/5 bg-stone rounded" />
    <div className="h-4 w-3/5 bg-stone rounded" />
  </div>
);

const Blog = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => fetchBlogs({ limit: 9 }),
  });

  const posts = data?.data || [];
  const [featured, ...rest] = posts;

  return (
    <div>
      <PageHeader
        eyebrow="Blogs"
        title="Insights, stories, and ideas shaping our projects."
        crumb="Home / Blogs"
      />

      <section className="container-wide py-24 md:py-32 relative">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(16,42,76,0.06),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(11,31,58,0.06),transparent_40%)]" />

        {isLoading ? (
          <div>
            <div className="grid md:grid-cols-2 gap-14 pb-24 border-b border-line">
              <div className="aspect-[16/11] bg-stone rounded-2xl animate-pulse" />
              <div className="space-y-5">
                <div className="h-3 w-24 bg-stone rounded-full animate-pulse" />
                <div className="h-10 w-full bg-stone rounded animate-pulse" />
                <div className="h-10 w-4/5 bg-stone rounded animate-pulse" />
                <div className="h-4 w-full bg-stone rounded animate-pulse" />
              </div>
            </div>

            <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : posts.length ? (
          <>
            {/* FEATURED — magazine cover treatment */}
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-14 items-center pb-24 border-b border-line"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-navy/5 aspect-[16/11]">
                <img
                  src={featured.featuredImage}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />

                
              </div>

              <div>
                <div className="flex items-center gap-3 mb-5 ">
                  <CategoryBadge>{featured.category}</CategoryBadge>
                  {featured.createdAt && (
                    <span className="text-xs text-navy/80 font-body tracking-wide">
                      {formatDate(featured.createdAt)}
                    </span>
                  )}
                </div>

                <h2 className="font-body text-4xl md:text-[3.1rem] leading-[1.1] tracking-tight text-navy/90 group-hover:text-navy transition-colors duration-300">
                  {featured.title}
                </h2>

                <p className="mt-6 font-body text-navy/60 leading-relaxed max-w-lg">
                  {featured.excerpt}
                </p>

                <span className="group/btn inline-flex items-center gap-2.5 mt-6 md:mt-8
            px-5 py-2.5 rounded-full
            bg-navy text-white
            text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
            border border-navy/80 shadow-sm
            whitespace-nowrap
            transition-all duration-300 ease-out
            hover:shadow-[0_6px_20px_rgba(10,25,47,0.35)]
            hover:-translate-y-0.5
            hover:bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)]">
                  Read full article
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </span>
              </div>
            </Link>

            {/* GRID */}
            {rest.length > 0 && (
              <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {rest.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-navy/5 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500"
                  >
                    <div className="overflow-hidden aspect-[4/3]">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <CategoryBadge>{post.category}</CategoryBadge>
                        {post.createdAt && (
                          <span className="text-xs text-navy font-body tracking-wide">
                            {formatDate(post.createdAt)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-body text-xl leading-snug tracking-tight text-navy  transition-colors duration-300">
                        {post.title}
                      </h3>

                      <p className="mt-3 font-body text-sm text-navy/60 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="group/btn inline-flex items-center gap-2.5 mt-6 md:mt-8
            px-5 py-2.5 rounded-full
            bg-navy text-white
            text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
            border border-navy/80 shadow-sm
            whitespace-nowrap
            transition-all duration-300 ease-out
            hover:shadow-[0_6px_20px_rgba(10,25,47,0.35)]
            hover:-translate-y-0.5
            hover:bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)]">
                        Continue reading
                        <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 rounded-2xl border border-dashed border-navy/15 bg-navy/[0.02]">
            <h2 className="font-display text-3xl text-navy mb-3">No articles yet</h2>
            <p className="font-body text-navy/60">
              Stay tuned — new insights and stories coming soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;