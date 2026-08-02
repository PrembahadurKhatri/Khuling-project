import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";

const fetchBlogs = async (params) => {
  const { data } = await api.get("/blogs", { params });
  return data;
};

const Blog = () => {
  const { data, isLoading } = useQuery({ queryKey: ["blogs"], queryFn: () => fetchBlogs({ limit: 9 }) });
  const posts = data?.data || [];
  const [featured, ...rest] = posts;

  return (
    <div>
      <PageHeader
        eyebrow="Journal"
        title="Notes from the field and the project office."
        crumb="Home / Journal"
      />

      {isLoading ? (
        <p className="container-wide py-24 text-navy/60">Loading posts...</p>
      ) : posts.length ? (
        <section className="container-wide py-24 md:py-28">
          {/* One large feature, not a card grid — matches the homepage journal treatment. */}
          <Link to={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-10 items-center pb-16 border-b border-line">
            <div className="overflow-hidden aspect-[16/10]">
              <img
                src={featured.featuredImage}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
            </div>
            <div>
              <p className="eyebrow mb-3">{featured.category}</p>
              <h2 className="font-display text-3xl md:text-4xl text-navy leading-tight link-underline inline">
                {featured.title}
              </h2>
              <p className="mt-4 text-navy/70 leading-relaxed max-w-md">{featured.excerpt}</p>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="mt-4">
              {rest.map((post, i) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className={`group flex flex-col sm:flex-row gap-6 sm:gap-10 py-8 ${i > 0 ? "border-t border-line" : ""}`}
                >
                  <div className="w-full sm:w-48 h-32 shrink-0 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <p className="eyebrow mb-2">{post.category}</p>
                    <h3 className="font-display text-xl md:text-2xl text-navy link-underline inline">{post.title}</h3>
                    <p className="mt-2 text-navy/70 text-sm max-w-lg leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <p className="container-wide py-24 text-navy/60">No blog posts published yet.</p>
      )}
    </div>
  );
};

export default Blog;
