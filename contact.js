export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const {name,email,company,eventType,eventDate,location,budget,website,message,botField}=req.body||{};
  if(botField) return res.status(200).json({ok:true});
  if(!name||!email||!eventType||!message) return res.status(400).json({error:'Missing required fields'});
  const apiKey=process.env.RESEND_API_KEY; const toEmail=process.env.MANAGEMENT_EMAIL;
  if(!apiKey||!toEmail) return res.status(500).json({error:'Email service is not configured'});
  const html=`<h2>New Janine Bubner Inquiry</h2><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Company:</b> ${escapeHtml(company||'-')}</p><p><b>Type:</b> ${escapeHtml(eventType)}</p><p><b>Date:</b> ${escapeHtml(eventDate||'-')}</p><p><b>Location:</b> ${escapeHtml(location||'-')}</p><p><b>Budget:</b> ${escapeHtml(budget||'-')}</p><p><b>Website:</b> ${escapeHtml(website||'-')}</p><hr><p>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`;
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from:'Janine Bubner Website <onboarding@resend.dev>',to:[toEmail],reply_to:email,subject:`New Janine Bubner Inquiry: ${eventType}`,html})});
  if(!response.ok) return res.status(500).json({error:'Email could not be sent'});
  return res.status(200).json({ok:true});
}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
