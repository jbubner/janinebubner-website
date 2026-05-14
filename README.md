# Janine Bubner Website Package

This package contains:

- `index.html` — complete personal brand / speaker website with Creative Practice section
- `api/contact.js` — Vercel serverless function for hidden management email forwarding
- `package.json` — minimal project metadata

## Vercel Setup

1. Upload the files to GitHub or drag/drop this folder into Vercel.
2. In Vercel, add Environment Variables:

```bash
RESEND_API_KEY=your_resend_api_key
MANAGEMENT_EMAIL=your_private_email@example.com
```

3. Deploy.

## Email setup

This uses Resend for email delivery. The contact form never exposes the private email address in the frontend.

For testing, Resend allows:

```js
from: "Janine Bubner Website <onboarding@resend.dev>"
```

For production, verify your own domain in Resend and change the `from` address in `api/contact.js`, for example:

```js
from: "Janine Bubner Management <management@janinebubner.com>"
```

## Replace Hero Image

In `index.html`, search for:

```css
url("https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1800&q=85")
```

Replace it with your own image path, for example:

```css
url("/assets/janine-hero.jpg")
```

Create an `assets` folder and upload your images there.


## V2 Update

This version adds a curated `Creative Practice` section for writing, design, visual art and premium brand collaborations.
