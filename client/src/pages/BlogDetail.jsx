import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api.js";

const fetchBlogBySlug = async (slug) => {
  const { data } = await api.get(`/blogs/${slug}`);
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

const BlogDetail = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => fetchBlogBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="section text-center py-32">
        <div className="inline-block w-9 h-9 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        <p className="font-body text-navy/60 mt-5 text-sm tracking-wide">Loading article…</p>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="section text-center py-32">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/5 border border-navy/10 mb-6">
          <span className="text-2xl">📄</span>
        </div>
        <p className="font-body text-navy/60 text-lg">Post not found.</p>
        <p className="font-body text-navy/40 text-sm mt-2">
          It may have been moved or removed.
        </p>
      </div>
    );
  }

  const post = data.data;

  return (
    <article>
      {/* HERO */}
      <div className="relative h-[48vh] min-h-[360px] max-h-[560px] overflow-hidden bg-navy">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/20 via-transparent to-transparent" />
      </div>

      {/* CONTENT CARD */}
      <div className="section max-w-3xl mx-auto -mt-24 md:-mt-28 relative pb-24">
        <div className="card p-8 md:p-14 shadow-2xl ring-1 ring-navy/5">
          <span className="badge-teal font-body">{post.category}</span>

          <h1 className="font-body text-3xl md:text-[2.75rem] text-navy mt-5 leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          {/* META ROW */}
          <div className="flex items-center flex-wrap gap-3 mt-6 pb-6 border-b border-navy/10">
            <div className="flex items-center gap-2.5">
            
              <span className="font-body text-navy/70 text-sm font-medium">
                {post.author?.name || "Admin"}
              </span>
            </div>
            <span className="w-1 h-1 bg-navy/25 rounded-full" />
            <span className="font-body text-navy/50 text-sm">
              {formatDate(post.publishedAt)}
            </span>
            <span className="w-1 h-1 bg-navy/25 rounded-full" />
            <span className="font-body text-navy/50 text-sm">
              {post.views} views
            </span>
          </div>

          <div
            className="prose-content font-body mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;