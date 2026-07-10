module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    const {
      name = "",
      email = "",
      company = "",
      eventType = "",
      eventDate = "",
      location = "",
      budget = "",
      website = "",
      message = "",
      botField = ""
    } = req.body || {};

    if (botField) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !eventType || !message) {
      return res.status(400).send("Missing required fields");
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail =
      process.env.CONTACT_TO ||
      process.env.MANAGEMENT_EMAIL;

    if (!apiKey || !toEmail) {
      return res.status(500).send("Email service is not configured");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from:
          process.env.CONTACT_FROM ||
          "Janine Bubner Website <hello@janinebubner.com>",
        to: [toEmail],
        reply_to: email,
        subject: `New Janine Bubner Management Request: ${eventType}`,
        html: `
          <h2>New Management Request</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company || "-")}</p>
          <p><strong>Event Type:</strong> ${escapeHtml(eventType)}</p>
          <p><strong>Event Date:</strong> ${escapeHtml(eventDate || "-")}</p>
          <p><strong>Location:</strong> ${escapeHtml(location || "-")}</p>
          <p><strong>Budget:</strong> ${escapeHtml(budget || "-")}</p>
          <p><strong>Website:</strong> ${escapeHtml(website || "-")}</p>
          <hr>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `
      })
    });

    const result = await response.text();

    if (!response.ok) {
      return res.status(500).send(result);
    }

    return res.redirect(303, "/?sent=true#contact");
  } catch (error) {
    return res.status(500).send(
      error?.message || "Server error"
    );
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}