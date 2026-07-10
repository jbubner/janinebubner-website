export default {
  async fetch(request) {
    try {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      const formData = await request.formData();

      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const company = formData.get("company") || "";
      const eventType =
        formData.get("eventType") ||
        formData.get("requestType") ||
        "";
      const eventDate = formData.get("eventDate") || "";
      const location =
        formData.get("location") ||
        formData.get("eventLocation") ||
        "";
      const budget = formData.get("budget") || "";
      const website = formData.get("website") || "";
      const message = formData.get("message") || "";
      const botField = formData.get("botField") || "";

      if (botField) {
        return Response.redirect(
          new URL("/?sent=true#contact", request.url),
          303
        );
      }

      if (!name || !email || !eventType || !message) {
        return new Response("Missing required fields", { status: 400 });
      }

      const apiKey = process.env.RESEND_API_KEY;
      const toEmail =
        process.env.CONTACT_TO ||
        process.env.MANAGEMENT_EMAIL;

      if (!apiKey || !toEmail) {
        return new Response(
          "Email service is not configured",
          { status: 500 }
        );
      }

      const resendResponse = await fetch(
        "https://api.resend.com/emails",
        {
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
        }
      );

      const result = await resendResponse.text();

      if (!resendResponse.ok) {
        return new Response(`Resend error: ${result}`, {
          status: 500
        });
      }

      return Response.redirect(
        new URL("/?sent=true#contact", request.url),
        303
      );
    } catch (error) {
      return new Response(
        `Function error: ${error?.message || String(error)}`,
        { status: 500 }
      );
    }
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