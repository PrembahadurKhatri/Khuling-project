import asyncHandler from "express-async-handler";
import { Career, Application } from "../models/Career.js";
import sendEmail from "../utils/sendEmail.js";
import wrapEmail from "../utils/emailTemplate.js";

const COMPANY_NAME = "Khilung Kalika Construction";

// Email delivery is best-effort: a broken/slow SMTP config shouldn't fail —
// or hang — the application submission or status update itself. This is
// deliberately NOT awaited by its callers below (fire-and-forget); nodemailer
// has no timeout configured by default, so awaiting it before responding
// could leave the client's "Submitting..." state stuck for as long as 10
// minutes if the SMTP server is unreachable.
const sendApplicationEmail = ({ to, subject, html }) => {
  sendEmail({ to, subject, html }).catch((err) => {
    console.warn("Failed to send application email:", err.message);
  });
};

// multipart/form-data sends links.* as flat "links.github" etc keys — nest
// them back into an object. Only resume is required; coverLetter and every
// link are optional (see ApplicationFormFields.jsx on the frontend).
const buildApplicationPayload = (body, files) => {
  const { "links.github": github, "links.linkedin": linkedin, "links.other": other, ...rest } = body;
  const payload = { ...rest };
  if ([github, linkedin, other].some((v) => v !== undefined)) {
    payload.links = { github, linkedin, other };
  }
  if (files?.resume?.[0]) payload.resumeUrl = files.resume[0].path;
  if (files?.coverLetter?.[0]) payload.coverLetterUrl = files.coverLetter[0].path;
  return payload;
};

// One notification per status, sent whenever the admin sets an application to
// that status. Returns null for statuses that don't have a notification.
// jobTitle is null for a general application (not tied to a specific posting).
const buildStatusEmail = (application, jobTitle) => {
  const name = application.name;
  const isGeneral = !jobTitle;
  const positionPhrase = isGeneral ? "your general application" : `the <strong>${jobTitle}</strong> position`;
  const rolePhrase = isGeneral ? "your general application" : `the <strong>${jobTitle}</strong> role`;

  const scheduleLines = `
    ${application.interviewDate ? `<p><strong>Interview Date:</strong> ${new Date(application.interviewDate).toLocaleString()}</p>` : ""}
    ${application.visitDate ? `<p><strong>Site Visit Date:</strong> ${new Date(application.visitDate).toLocaleString()}</p>` : ""}
  `;

  switch (application.status) {
    case "received":
      return {
        subject: isGeneral ? "General Application Received" : `Application Received - ${jobTitle}`,
        html: wrapEmail({
          title: "Application received",
          bodyHtml: `
            <p>Hi ${name},</p>
            <p>Thank you for submitting ${positionPhrase} to ${COMPANY_NAME}. We've received it and our team will review it shortly.</p>
            <p>${isGeneral ? "We'll reach out if an opening matches your profile." : "We'll be in touch if your profile matches our requirements."}</p>
          `,
        }),
      };
    case "shortlisted":
      return {
        subject: isGeneral ? "You've Been Shortlisted" : `You've Been Shortlisted - ${jobTitle}`,
        html: wrapEmail({
          title: "You've been shortlisted",
          bodyHtml: `
            <p>Hi ${name},</p>
            <p>Congrats! You've been shortlisted for ${rolePhrase} at ${COMPANY_NAME}.</p>
            ${scheduleLines}
            <p>We look forward to meeting you. If you have any questions, feel free to reply to this email.</p>
          `,
        }),
      };
    case "interviewing":
      return {
        subject: isGeneral ? "Interview Update" : `Interview Update - ${jobTitle}`,
        html: wrapEmail({
          title: "Moving to interview stage",
          bodyHtml: `
            <p>Hi ${name},</p>
            <p>${isGeneral ? "Your general application" : `Your application for ${positionPhrase}`} at ${COMPANY_NAME} is moving forward to the interview stage.</p>
            ${scheduleLines}
          `,
        }),
      };
    case "rejected":
      return {
        subject: isGeneral ? "Application Update" : `Application Update - ${jobTitle}`,
        html: wrapEmail({
          title: "Application update",
          bodyHtml: `
            <p>Hi ${name},</p>
            <p>Sorry, we won't be moving forward with ${positionPhrase} at this time. We appreciate the time you took to apply and encourage you to apply again for future openings.</p>
          `,
        }),
      };
    case "hired":
      return {
        subject: isGeneral ? "Congratulations - You've Been Selected" : `Congratulations - You've Been Selected - ${jobTitle}`,
        html: wrapEmail({
          title: "Congratulations!",
          bodyHtml: `
            <p>Hi ${name},</p>
            <p>Congratulations! You have been selected ${isGeneral ? "for a role" : `for ${positionPhrase}`} at ${COMPANY_NAME}. Our team will reach out shortly with next steps.</p>
          `,
        }),
      };
    default:
      return null;
  }
};

// @desc   Submit a job application (multipart: resume + optional cover letter files, links)
// @route  POST /api/careers/:id/apply
export const applyToCareer = asyncHandler(async (req, res) => {
  const career = await Career.findById(req.params.id);
  if (!career) {
    res.status(404);
    throw new Error("Position not found");
  }
  if (career.status !== "open") {
    res.status(400);
    throw new Error("This position is no longer accepting applications");
  }
  if (!req.files?.resume?.[0]) {
    res.status(400);
    throw new Error("A CV/resume file is required");
  }

  const application = await Application.create({
    ...buildApplicationPayload(req.body, req.files),
    job: career._id,
  });

  res.status(201).json({ success: true, data: application });

  const email = buildStatusEmail(application, career.title);
  if (email) sendApplicationEmail({ to: application.email, ...email });
});

// @desc   Submit a general application, not tied to a specific posting
// @route  POST /api/applications/general
export const submitGeneralApplication = asyncHandler(async (req, res) => {
  if (!req.files?.resume?.[0]) {
    res.status(400);
    throw new Error("A CV/resume file is required");
  }

  const application = await Application.create(buildApplicationPayload(req.body, req.files));

  res.status(201).json({ success: true, data: application });

  const email = buildStatusEmail(application, null);
  if (email) sendApplicationEmail({ to: application.email, ...email });
});

// @desc   Get all applications, optionally filtered by job/status, or general-only
// @route  GET /api/applications
export const getApplications = asyncHandler(async (req, res) => {
  const { job, status, general, page = 1, limit = 20 } = req.query;

  const query = {};
  if (job) query.job = job;
  if (status) query.status = status;
  if (general === "true") query.job = null;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 50);

  const [applications, total] = await Promise.all([
    Application.find(query)
      .populate("job", "title department")
      .sort("-createdAt")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Application.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: applications.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: applications,
  });
});

// @desc   Update an application's status (and, for shortlisting/interviewing, interview/visit
//         dates); notifies the applicant by email for every status change.
// @route  PUT /api/applications/:id
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, interviewDate, visitDate } = req.body;

  const update = { status };
  if (interviewDate !== undefined) update.interviewDate = interviewDate || undefined;
  if (visitDate !== undefined) update.visitDate = visitDate || undefined;

  const application = await Application.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).populate("job", "title department");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  res.json({ success: true, data: application });

  const email = buildStatusEmail(application, application.job?.title);
  if (email) sendApplicationEmail({ to: application.email, ...email });
});

// @desc   Delete an application
// @route  DELETE /api/applications/:id
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }
  res.json({ success: true, message: "Application deleted" });
});
