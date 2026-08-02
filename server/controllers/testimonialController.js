import asyncHandler from "express-async-handler";
import Testimonial from "../models/Testimonial.js";

// @desc   Get testimonials (optionally filter to featured only)
// @route  GET /api/testimonials
export const getTestimonials = asyncHandler(async (req, res) => {
  const { featured } = req.query;
  const query = {};
  if (featured !== undefined) query.featured = featured === "true";

  const testimonials = await Testimonial.find(query).sort("-createdAt");
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

// @desc   Create testimonial
// @route  POST /api/testimonials
export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: testimonial });
});

// @desc   Update testimonial
// @route  PUT /api/testimonials/:id
export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }
  res.json({ success: true, data: testimonial });
});

// @desc   Delete testimonial
// @route  DELETE /api/testimonials/:id
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }
  res.json({ success: true, message: "Testimonial deleted" });
});
