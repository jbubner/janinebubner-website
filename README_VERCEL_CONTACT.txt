VERCEL CONTACT FORM SETUP

Upload all files/folders in this ZIP to GitHub:

- index.html
- summit.html
- imprint.html
- privacy.html
- package.json
- api/contact.js

Then in Vercel:
Project > Settings > Environment Variables

Add:

RESEND_API_KEY
Get it from https://resend.com/api-keys

CONTACT_TO
Your private destination email address. This is not visible on the website.

CONTACT_FROM
Optional but recommended after domain verification:
Janine Bubner Website <hello@janinebubner.com>

After adding variables, redeploy in Vercel.
