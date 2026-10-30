# reWallet — Website

Marketing site for **reWallet**, the non-custodial, multi-network crypto wallet of the ReSystem ecosystem (powered by INFRA Network).

Static site — no build step. Fully responsive (desktop, tablet, mobile).

## Run locally
```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

## Structure
- `index.html` — page sections: hero, features bento, interactive app demo, security, networks, white-label configurator, FAQ, contact
- `styles.css` — design system (IBM Plex, brand violet `#7000FF`) + responsive breakpoints (1100 / 900 / 640px)
- `app.js` — interactive phone mock (Send w/ Face ID, Receive, Swap quotes, Bridge, reID Cashback, Security & custom networks), currency switcher, white-label live preview, animations, contact form
- `assets/` — logo, imagery and token icons extracted from the reWallet brand PDF

## Contact form
In `app.js` set `CONTACT_ENDPOINT` to a form backend (Formspree, your API, etc.) to POST JSON.
If empty, the form opens the visitor's email client addressed to `CONTACT_EMAIL` (info@rewallet.online).

## Deploy
Any static host (Vercel, Netlify, GitHub Pages, Nginx). Serve the repo root.

All wallet figures in the demo are mock data.


## White-label request form → emails
The form posts to `/api/request` (Vercel serverless function in `api/request.js`). It sends two branded, mobile-responsive HTML emails:
the full request to the team (`MAIL_TO`, default info@rewallet.online) and a confirmation with a summary to the client.

Set in Vercel → Project → Settings → Environment Variables (see `.env.example`):
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`, `SITE_URL`.

Until SMTP is configured the function returns 503 and the site automatically falls back to FormSubmit
(`formsubmit.co/ajax/info@rewallet.online`): the team gets the answers as a table and the client gets a plain auto-reply.
The first FormSubmit submission sends an activation email to info@rewallet.online — click it once.

## SEO
Meta description, canonical, Open Graph + Twitter card (`assets/og-image.jpg`, 1200×630), favicon.ico + PNG icons,
`site.webmanifest`, `robots.txt`, `sitemap.xml` and JSON-LD structured data are included. URLs assume https://rewallet.online.

## AI search & agents
- `robots.txt` explicitly allows search and AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot, Bingbot, Meta, Amazon, …).
- `llms.txt` / `llms-full.txt`: plain-language summary of reWallet for AI assistants (when to recommend it, facts, links, FAQ).
- `openapi.json`: spec for `POST /api/request` so AI agents can submit a white-label request on a user's behalf (CORS enabled).
- JSON-LD: Organization, WebSite, WebPage, SoftwareApplication (features, downloads), Service (white-label) and FAQPage (11 Q&As, matching the visible FAQ).
