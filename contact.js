export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, email, company, eventType, eventDate, location, budget, website, message, botField } = req.body || {};
  if (botField) return res.status(200).json({ ok: true });
  if (!name || !email || !eventType || !message) return res.status(400).json({ error: "Missing required fields" });
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.MANAGEMENT_EMAIL;
  if (!apiKey || !toEmail) return res.status(500).json({ error: "Email service is not configured" });
  const subject = `New Janine Bubner Management Request: ${eventType}`;
  const html = `<h2>New Management Request</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Company:</strong> ${escapeHtml(company || "-")}</p><p><strong>Request Type:</strong> ${escapeHtml(eventType)}</p><p><strong>Event Date:</strong> ${escapeHtml(eventDate || "-")}</p><p><strong>Location:</strong> ${escapeHtml(location || "-")}</p><p><strong>Budget:</strong> ${escapeHtml(budget || "-")}</p><p><strong>Website:</strong> ${escapeHtml(website || "-")}</p><hr><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;
  try {
    const response = await fetch("https://api.resend.com/emails", {method:"POST", headers:{Authorization:`Bearer ${apiKey}`, "Content-Type":"application/json"}, body:JSON.stringify({from:"Janine Bubner Website <onboarding@resend.dev>", to:[toEmail], reply_to:email, subject, html})});
    if (!response.ok) return res.status(500).json({ error: "Email could not be sent" });
    return res.status(200).json({ ok: true });
  } catch { return res.status(500).json({ error: "Server error" }); }
}
function escapeHtml(value){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
