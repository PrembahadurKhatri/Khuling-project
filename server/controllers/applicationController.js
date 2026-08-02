import asyncHandler from "express-async-handler";
import { Career, Application } from "../models/Career.js";
import sendEmail from "../utils/sendEmail.js";

const COMPANY_NAME = "Khilung Kalika Construction";

// Email delivery is best-effort: a broken SMTP config shouldn't fail the
// application submission or status update itself, just skip the notification.
const sendApplicationEmail = async ({ to, subject, html }) => {
  try {
    await sendEmail({ to, subject, html });
  } catch (err) {
    console.warn("Failed to send application email:", err.message);
  }
};

// One notification per status, sent whenever the admin sets an application to
// that status. Returns null for statuses that don't have a notification.
const buildStatusEmail = (application, jobTitle) => {
  const name = application.name;
  const title = jobTitle || "the position";

  switch (application.status) {
    case "received":
      return {
        subject: `Application Received - ${title}`,
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for applying for the <strong>${title}</strong> position at ${COMPANY_NAME}.
          We've received your application and our team will review it shortly.</p>
          <p>We'll be in touch if your profile matches our requirements.</p>
          <p>${COMPANY_NAME}</p>
        `,
      };
    case "shortlisted":
      return {
        subject: `You've Been Shortlisted - ${title}`,
        html: `
          <p>Hi ${name},</p>
          <p>Congrats! You've been shortlisted for the <strong>${title}</strong> role at ${COMPANY_NAME}.</p>
          ${application.interviewDate ? `<p><strong>Interview Date:</strong> ${new Date(application.interviewDate).toLocaleString()}</p>` : ""}
          ${application.visitDate ? `<p><strong>Site Visit Date:</strong> ${new Date(application.visitDate).toLocaleString()}</p>` : ""}
          <p>We look forward to meeting you. If you have any questions, feel free to reply to this email.</p>
          <p>${COMPANY_NAME}</p>
        `,
      };
    case "interviewing":
      return {
        subject: `Interview Update - ${title}`,
        html: `
          <p>Hi ${name},</p>
          <p>Your application for the <strong>${title}</strong> position at ${COMPANY_NAME} is moving forward
          to the interview stage.</p>
          ${application.interviewDate ? `<p><strong>Interview Date:</strong> ${new Date(application.interviewDate).toLocaleString()}</p>` : ""}
          ${application.visitDate ? `<p><strong>Site Visit Date:</strong> ${new Date(application.visitDate).toLocaleString()}</p>` : ""}
          <p>${COMPANY_NAME}</p>
        `,
      };
    case "rejected":
      return {
        subject: `Application Update - ${title}`,
        html: `
          <p>Hi ${name},</p>
          <p>Sorry, you have been rejected for the <strong>${title}</strong> position at ${COMPANY_NAME}.
          We appreciate the time you took to apply and encourage you to apply again for future openings.</p>
          <p>${COMPANY_NAME}</p>
        `,
      };
    case "hired":
      return {
        subject: `Congratulations - You've Been Selected - ${title}`,
        html: `
          <p>Hi ${name},</p>
          <p>Congratulations! You have been selected for the <strong>${title}</strong> position at ${COMPANY_NAME}.
          Our team will reach out shortly with next steps.</p>
          <p>${COMPANY_NAME}</p>
        `,
      };
    default:
      return null;
  }
};

// @desc   Submit a job application (multipart: resume file + fields)
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
  if (!req.file) {
    res.status(400);
    throw new Error("A CV/resume file is required");
  }

  const application = await Application.create({
    job: career._id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    resumeUrl: req.file.path,
    coverLetter: req.body.coverLetter,
  });

  const email = buildStatusEmail(application, career.title);
  if (email) await sendApplicationEmail({ to: application.email, ...email });

  res.status(201).json({ success: true, data: application });
});

// @desc   Get all applications, optionally filtered by job/status
// @route  GET /api/applications
export const getApplications = asyncHandler(async (req, res) => {
  const { job, status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (job) query.job = job;
  if (status) query.status = status;

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

  const email = buildStatusEmail(application, application.job?.title);
  if (email) await sendApplicationEmail({ to: application.email, ...email });

  res.json({ success: true, data: application });
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
