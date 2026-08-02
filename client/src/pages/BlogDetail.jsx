import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api.js";

const fetchBlogBySlug = async (slug) => {
  const { data } = await api.get(`/blogs/${slug}`);
  return data;
};

const BlogDetail = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["blog", slug], queryFn: () => fetchBlogBySlug(slug) });

  if (isLoading) return <p className="section text-center text-gray-500">Loading...</p>;
  if (!data?.data) return <p className="section text-center text-gray-500">Post not found.</p>;

  const post = data.data;

  return (
    <article className="section max-w-3xl mx-auto">
      <p className="text-primary font-semibold uppercase text-sm">{post.category}</p>
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary mt-2">{post.title}</h1>
      <p className="text-gray-400 text-sm mt-2">
        By {post.author?.name || "Admin"} · {new Date(post.publishedAt).toLocaleDateString()} · {post.views} views
      </p>
      <img src={post.featuredImage} alt={post.title} className="rounded-2xl w-full mt-6 mb-8" />
      <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};

export default BlogDetail;
