export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const data = typeof req.body === "string"
    ? Object.fromEntries(new URLSearchParams(req.body))
    : req.body || {};

  const {
    name = "",
    email = "",
    company = "",
    requestType = "",
    eventDate = "",
    eventLocation = "",
    message = "",
    website = ""
  } = data;

  if (website) return res.redirect(303, "/?sent=true#contact");

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO) {
    return res.status(500).send("Missing environment variables.");
  }

  const html = `
    <h2>New inquiry from janinebubner.com</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company)}</p>
    <p><strong>Request Type:</strong> ${escapeHtml(requestType)}</p>
    <p><strong>Event Date:</strong> ${escapeHtml(eventDate)}</p>
    <p><strong>Event Location:</strong> ${escapeHtml(eventLocation)}</p>
    <hr>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Janine Bubner <hello@janinebubner.com>",
      to: process.env.CONTACT_TO,
      reply_to: email || undefined,
      subject: `New website inquiry: ${requestType || "General request"}`,
      html
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    return res.status(500).send(error);
  }

  return res.redirect(303, "/?sent=true#contact");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}