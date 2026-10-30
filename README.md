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
