import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

// @desc   List all categories (used by Project/Service category pickers)
// @route  GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort("name");
  res.json({ success: true, count: categories.length, data: categories });
});

// @desc   Create a category
// @route  POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json({ success: true, data: category });
});

// @desc   Rename a category
// @route  PUT /api/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true, runValidators: true }
  );
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json({ success: true, data: category });
});

// @desc   Delete a category
// @route  DELETE /api/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json({ success: true, message: "Category deleted" });
});
