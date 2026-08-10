import dotenv from "dotenv";
import { getLogoAttachment } from "./emailTemplate.js";

dotenv.config();

// Sends over HTTPS via SendGrid's API instead of raw SMTP. Render (like many
// hosts) blocks outbound SMTP ports (25/465/587) to prevent spam abuse — that
// silently timed out every email this app tried to send. HTTPS on port 443
// isn't subject to that restriction, since it's indistinguishable from any
// other API call the app makes (Cloudinary, MongoDB Atlas, etc).
const SENDGRID_ENDPOINT = "https://api.sendgrid.com/v3/mail/send";

// EMAIL_FROM is "Display Name <email@example.com>" (or a bare email) —
// SendGrid's JSON API wants those as separate fields. Also strips one layer
// of surrounding quotes: .env files conventionally write
// EMAIL_FROM="Name <email>" with quotes, but a host's dashboard env-var UI
// (Render included) wants the raw value — pasting the quoted form in
// verbatim is an easy mistake, and left unhandled it makes the whole string
// (quotes and all) get treated as a single malformed email address, which
// SendGrid rejects with "Invalid from email address".
const parseFromAddress = (raw) => {
  const cleaned = (raw || "").trim().replace(/^["']|["']$/g, "").trim();
  const match = /^(.*)<(.+)>$/.exec(cleaned);
  if (match) {
    return { name: match[1].trim().replace(/^["']|["']$/g, ""), email: match[2].trim() };
  }
  return { email: cleaned };
};

const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY is not configured");
  }

  // Defense-in-depth timeout, same rationale as the old nodemailer config:
  // a caller that (by mistake) awaits this shouldn't be able to hang for
  // longer than a few seconds even if SendGrid itself is unreachable.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  const from = parseFromAddress(process.env.EMAIL_FROM);

  // Every outgoing email uses wrapEmail() (see emailTemplate.js), whose
  // header references the logo via cid:khilung-logo — attach it here once,
  // centrally, so every call site gets it automatically. Harmless to include
  // even for the rare email that doesn't reference the cid.
  const logoAttachment = getLogoAttachment();

  try {
    const res = await fetch(SENDGRID_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from,
        subject,
        content: [{ type: "text/html", value: html }],
        ...(logoAttachment ? { attachments: [logoAttachment] } : {}),
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // Include the parsed "from" in the error — the most common failure
      // (an unverified or malformed EMAIL_FROM) is otherwise invisible from
      // the SendGrid response alone.
      throw new Error(`SendGrid ${res.status} (from: ${JSON.stringify(from)}): ${body || res.statusText}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

export default sendEmail;
