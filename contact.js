import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const {
      name = '',
      email = '',
      company = '',
      requestType = '',
      eventDate = '',
      eventLocation = '',
      message = '',
      website = ''
    } = req.body || {};

    if (website) return res.redirect(303, '/?request=sent#contact');
    if (!name || !message) return res.status(400).send('Missing required fields.');

    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM || 'Janine Bubner Website <onboarding@resend.dev>';

    if (!process.env.RESEND_API_KEY || !to) {
      return res.status(500).send('Contact form is not configured.');
    }

    await resend.emails.send({
      from,
      to,
      replyTo: email || undefined,
      subject: `New website inquiry: ${requestType || 'General request'}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2>New inquiry from janinebubner.com</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company / Organization:</strong> ${escapeHtml(company)}</p>
          <p><strong>Request Type:</strong> ${escapeHtml(requestType)}</p>
          <p><strong>Event Date:</strong> ${escapeHtml(eventDate)}</p>
          <p><strong>Event Location:</strong> ${escapeHtml(eventLocation)}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
      `
    });

    return res.redirect(303, '/?request=sent#contact');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong while sending your request.');
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
