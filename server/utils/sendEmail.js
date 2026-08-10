import dotenv from "dotenv";

dotenv.config();

// Sends over HTTPS via SendGrid's API instead of raw SMTP. Render (like many
// hosts) blocks outbound SMTP ports (25/465/587) to prevent spam abuse — that
// silently timed out every email this app tried to send. HTTPS on port 443
// isn't subject to that restriction, since it's indistinguishable from any
// other API call the app makes (Cloudinary, MongoDB Atlas, etc).
const SENDGRID_ENDPOINT = "https://api.sendgrid.com/v3/mail/send";

// EMAIL_FROM is "Display Name <email@example.com>" (or a bare email) —
// SendGrid's JSON API wants those as separate fields.
const parseFromAddress = (raw) => {
  const match = /^(.*)<(.+)>$/.exec(raw || "");
  if (match) {
    return { name: match[1].trim().replace(/^"|"$/g, ""), email: match[2].trim() };
  }
  return { email: (raw || "").trim() };
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

  try {
    const res = await fetch(SENDGRID_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: parseFromAddress(process.env.EMAIL_FROM),
        subject,
        content: [{ type: "text/html", value: html }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`SendGrid ${res.status}: ${body || res.statusText}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

export default sendEmail;
