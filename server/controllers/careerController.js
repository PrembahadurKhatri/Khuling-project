import asyncHandler from "express-async-handler";
import { Career } from "../models/Career.js";

// @desc   Get all career postings with filter, sort, pagination
// @route  GET /api/careers
export const getCareers = asyncHandler(async (req, res) => {
  const { status, department, type, search, sort = "-createdAt", page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;
  if (department) query.department = new RegExp(department, "i");
  if (type) query.type = type;
  if (search) query.title = new RegExp(search, "i");

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 50);

  const [careers, total] = await Promise.all([
    Career.find(query)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Career.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: careers.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: careers,
  });
});

// @desc   Get single career posting by slug
// @route  GET /api/careers/:slug
export const getCareerBySlug = asyncHandler(async (req, res) => {
  const career = await Career.findOne({ slug: req.params.slug });
  if (!career) {
    res.status(404);
    throw new Error("Position not found");
  }
  res.json({ success: true, data: career });
});

// @desc   Create career posting
// @route  POST /api/careers
export const createCareer = asyncHandler(async (req, res) => {
  const career = await Career.create(req.body);
  res.status(201).json({ success: true, data: career });
});

// @desc   Update career posting
// @route  PUT /api/careers/:id
export const updateCareer = asyncHandler(async (req, res) => {
  const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!career) {
    res.status(404);
    throw new Error("Position not found");
  }
  res.json({ success: true, data: career });
});

// @desc   Delete career posting
// @route  DELETE /api/careers/:id
export const deleteCareer = asyncHandler(async (req, res) => {
  const career = await Career.findByIdAndDelete(req.params.id);
  if (!career) {
    res.status(404);
    throw new Error("Position not found");
  }
  res.json({ success: true, message: "Position deleted" });
});
