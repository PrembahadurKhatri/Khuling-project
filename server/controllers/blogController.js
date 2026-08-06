import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import { isFallbackAdminId } from "../utils/fallbackAdmin.js";

// @route GET /api/blogs (public: published only, unless authenticated admin)
export const getBlogs = asyncHandler(async (req, res) => {
  const { category, tag, search, page = 1, limit = 9 } = req.query;

  const isStaff = req.user && ["admin", "editor"].includes(req.user.role);
  const query = isStaff ? {} : { status: "published" };
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (search) query.$text = { $search: search };

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 50);

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .sort("-publishedAt")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("author", "name avatar"),
    Blog.countDocuments(query),
  ]);

  res.json({ success: true, count: blogs.length, total, page: pageNum, pages: Math.ceil(total / limitNum), data: blogs });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name avatar");

  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  res.json({ success: true, data: blog });
});

// multipart/form-data sends tags as a single comma-separated string
const normalizePayload = (body, file) => {
  const payload = { ...body };
  if (file) payload.featuredImage = file.path;
  if (typeof payload.tags === "string") {
    payload.tags = payload.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return payload;
};

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create({
    ...normalizePayload(req.body, req.file),
    ...(isFallbackAdminId(req.user._id) ? {} : { author: req.user._id }),
  });
  res.status(201).json({ success: true, data: blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, normalizePayload(req.body, req.file), {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found");
  }
  res.json({ success: true, data: blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found");
  }
  res.json({ success: true, message: "Blog post deleted" });
});
