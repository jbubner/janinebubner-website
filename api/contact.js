export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    const data = req.body || {};

    const name = data.name || "";
    const email = data.email || "";
    const company = data.company || "";
    const requestType = data.requestType || data.eventType || "";
    const eventDate = data.eventDate || "";
    const eventLocation = data.eventLocation || data.location || "";
    const message = data.message || "";

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO || process.env.MANAGEMENT_EMAIL;
    const fromEmail = process.env.CONTACT_FROM || "Janine Bubner Website <onboarding@resend.dev>";

    if (!apiKey) {
      return res.status(500).send("Missing RESEND_API_KEY");
    }

    if (!toEmail) {
      return res.status(500).send("Missing CONTACT_TO");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `New Website Inquiry: ${requestType || "General Request"}`,
        html: `
          <h2>New inquiry from janinebubner.com</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Request Type:</strong> ${requestType}</p>
          <p><strong>Event Date:</strong> ${eventDate}</p>
          <p><strong>Event Location:</strong> ${eventLocation}</p>
          <hr />
          <p>${message}</p>
        `
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).send(errorText);
    }

    return res.redirect(303, "/?sent=true#contact");
  } catch (error) {
    return res.status(500).send(error.message || "Server error");
  }
}