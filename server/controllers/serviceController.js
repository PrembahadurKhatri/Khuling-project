import asyncHandler from "express-async-handler";
import Service from "../models/Service.js";

// multipart/form-data sends benefits as a newline-separated string (matching
// the admin form's "one benefit per line" textarea), and a manually uploaded
// file takes precedence over a pasted image URL — the form only ever sends
// one or the other (see ServicesManage.jsx).
const normalizePayload = (body, file) => {
  const payload = { ...body };
  if (file) payload.heroImage = file.path;
  if (typeof payload.benefits === "string") {
    payload.benefits = payload.benefits.split("\n").map((b) => b.trim()).filter(Boolean);
  }
  return payload;
};

export const getServices = asyncHandler(async (req, res) => {
  const filter = {};
  // Services created before the "group" field existed have no value for it
  // at all -- treat those as "construction" too, so the original 8 services
  // keep showing up under Construction without needing a data migration.
  if (req.query.group === "construction") {
    filter.$or = [{ group: "construction" }, { group: { $exists: false } }];
  } else if (req.query.group) {
    filter.group = req.query.group;
  }
  const services = await Service.find(filter).sort("order");
  res.json({ success: true, data: services });
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.json({ success: true, data: service });
});

export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(normalizePayload(req.body, req.file));
  res.status(201).json({ success: true, data: service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, normalizePayload(req.body, req.file), { new: true, runValidators: true });
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.json({ success: true, message: "Service deleted" });
});
