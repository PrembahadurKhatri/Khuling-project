import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";

// @desc   Get all projects with filter, search, sort, pagination
// @route  GET /api/projects
export const getProjects = asyncHandler(async (req, res) => {
  const { status, category, location, year, client, search, sort = "-createdAt", page = 1, limit = 12 } = req.query;

  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (location) query.location = new RegExp(location, "i");
  if (client) query.client = new RegExp(client, "i");
  if (year) {
    query.startDate = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    };
  }
  if (search) query.$text = { $search: search };

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 50);

  const [projects, total] = await Promise.all([
    Project.find(query)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Project.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: projects.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: projects,
  });
});

// @desc   Get single project by slug
// @route  GET /api/projects/:slug
export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const related = await Project.find({
    category: project.category,
    _id: { $ne: project._id },
  }).limit(3);

  res.json({ success: true, data: project, related });
});

// @desc   Create project
// @route  POST /api/projects
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: project });
});

// @desc   Update project
// @route  PUT /api/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, data: project });
});

// @desc   Delete project
// @route  DELETE /api/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, message: "Project deleted" });
});
