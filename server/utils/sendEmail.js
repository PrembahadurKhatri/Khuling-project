import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Nodemailer's defaults (up to a 10-minute socket timeout) are too
  // generous for a request that a caller might still be awaiting — cap
  // everything to a few seconds so a misconfigured/unreachable SMTP server
  // fails fast instead of hanging. Callers are also expected to fire email
  // sends without awaiting them in request handlers (see contactController.js
  // / applicationController.js), so this is a second line of defense.
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 15_000,
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export default sendEmail;
