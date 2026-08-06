import asyncHandler from "express-async-handler";
import Team from "../models/Team.js";

// multipart/form-data sends social.* as flat "social.linkedin" etc keys —
// nest them back into an object, and let an uploaded file win over a pasted
// image URL (the admin form only ever sends one or the other; see
// TeamManage.jsx / components/admin/ImageSourceField.jsx).
const normalizePayload = (body, file) => {
  const {
    "social.linkedin": linkedin,
    "social.facebook": facebook,
    "social.whatsapp": whatsapp,
    "social.instagram": instagram,
    "social.email": email,
    ...rest
  } = body;
  const payload = { ...rest };
  if ([linkedin, facebook, whatsapp, instagram, email].some((v) => v !== undefined)) {
    payload.social = { linkedin, facebook, whatsapp, instagram, email };
  }
  if (file) payload.image = file.path;
  if (typeof payload.isLeadership === "string") {
    payload.isLeadership = payload.isLeadership === "true";
  }
  return payload;
};

// @desc   List team members, sorted for display (leadership first, then order)
// @route  GET /api/team
export const getTeamMembers = asyncHandler(async (req, res) => {
  const members = await Team.find().sort({ isLeadership: -1, order: 1 });
  res.json({ success: true, count: members.length, data: members });
});

// @desc   Create a team member
// @route  POST /api/team
export const createTeamMember = asyncHandler(async (req, res) => {
  const member = await Team.create(normalizePayload(req.body, req.file));
  res.status(201).json({ success: true, data: member });
});

// @desc   Update a team member
// @route  PUT /api/team/:id
export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await Team.findByIdAndUpdate(req.params.id, normalizePayload(req.body, req.file), {
    new: true,
    runValidators: true,
  });
  if (!member) {
    res.status(404);
    throw new Error("Team member not found");
  }
  res.json({ success: true, data: member });
});

// @desc   Delete a team member
// @route  DELETE /api/team/:id
export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await Team.findByIdAndDelete(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Team member not found");
  }
  res.json({ success: true, message: "Team member deleted" });
});
