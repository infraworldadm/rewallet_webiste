// Vercel serverless function: POST /api/request
// Sends two branded HTML emails for every white-label request:
//   1) to the reWallet team (MAIL_TO) with all answers
//   2) to the client (their email) as a confirmation with a summary
// Configure these environment variables in Vercel (Project → Settings → Environment Variables):
//   SMTP_HOST, SMTP_PORT (465 or 587), SMTP_USER, SMTP_PASS,
//   MAIL_FROM  (e.g. "reWallet <info@rewallet.online>"), MAIL_TO (default info@rewallet.online),
//   SITE_URL   (default https://rewallet.online)
const nodemailer = require('nodemailer');

const SITE = process.env.SITE_URL || 'https://rewallet.online';
const TEAM = process.env.MAIL_TO || 'info@rewallet.online';

const SECTIONS = [
  ['About you', ['company', 'name', 'role', 'email', 'phone', 'country', 'website', 'orgType']],
  ['Wallet & scope', ['model', 'platforms', 'users', 'launch', 'usecase']],
  ['Chains & assets', ['chains', 'chainsOther', 'tokens', 'tokenContracts', 'nfts']],
  ['Brand & style', ['appName', 'brandColors', 'theme', 'assetsReady', 'modes', 'langs', 'stores']],
  ['Features & integrations', ['features', 'dapps', 'integrations', 'integrationNotes']],
  ['Security & compliance', ['custody', 'security', 'compliance', 'region', 'license', 'residency']],
  ['Infrastructure, updates & support', ['hosting', 'updates', 'requests', 'support', 'budget', 'contactPref', 'notes']],
];
const LABEL = { company: 'Company', name: 'Name', role: 'Role', email: 'Email', phone: 'Phone / WhatsApp', country: 'Country', website: 'Website', orgType: 'Organisation type', model: 'Delivery model', platforms: 'Platforms', users: 'Users (year 1)', launch: 'Target launch', usecase: 'Use case', chains: 'Networks', chainsOther: 'Other networks', tokens: 'Default tokens', tokenContracts: 'Token contracts', nfts: 'NFTs', appName: 'App name', brandColors: 'Brand colours', theme: 'Theme', assetsReady: 'Brand assets', modes: 'Appearance', langs: 'Languages', stores: 'App store publishing', features: 'Features', dapps: 'dApps', integrations: 'Integrations', integrationNotes: 'Integration details', custody: 'Key management', security: 'Security features', compliance: 'Compliance', region: 'Jurisdiction', license: 'Licences', residency: 'Data residency', hosting: 'Hosting', updates: 'Future updates', requests: 'Special requests', support: 'Support level', budget: 'Budget', contactPref: 'Preferred contact', notes: 'Notes' };

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const val = v => esc(Array.isArray(v) ? v.join(', ') : v).replace(/\n/g, '<br>');

// reID-style layout: dark header with logo, white card, blue CTA, dark footer
function layout({ preheader, title, intro, body, cta }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>@media only screen and (max-width:620px){.px{padding-left:18px!important;padding-right:18px!important}.ttl{font-size:21px!important}.kv td{display:block!important;width:100%!important;border-bottom:0!important;padding:2px 0!important}.kv tr td:last-child{padding-bottom:10px!important;border-bottom:1px solid #f0f2f5!important}}</style></head>
<body style="margin:0;padding:0;background:#f2f3f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e2329">
<span style="display:none!important;opacity:0;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3f5;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6e8eb">
  <tr><td class="px" style="background:#2b2f36;padding:22px 28px">
    <table role="presentation" width="100%"><tr>
      <td><img src="${SITE}/assets/logo-dark.png" alt="reWallet" height="26" style="display:block;height:26px;border:0"></td>
      <td align="right" style="color:#9aa3ae;font-size:12px">White-label request</td>
    </tr></table>
  </td></tr>
  <tr><td class="px" style="background:linear-gradient(135deg,#1c6dd0,#7000ff);background-color:#1c6dd0;padding:30px 28px;color:#ffffff">
    <div class="ttl" style="font-size:24px;font-weight:700;line-height:1.25">${esc(title)}</div>
    <div style="font-size:14px;opacity:.9;margin-top:8px;line-height:1.5">${intro}</div>
  </td></tr>
  <tr><td class="px" style="padding:26px 28px">${body}
    ${cta ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 6px"><tr><td style="background:#1c6dd0;border-radius:8px"><a href="${cta.href}" style="display:inline-block;padding:13px 26px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px">${esc(cta.label)}</a></td></tr></table>` : ''}
  </td></tr>
  <tr><td class="px" style="background:#2b2f36;padding:20px 28px;color:#9aa3ae;font-size:12px;line-height:1.6">
    reWallet · Decentralized, non-custodial, multi-network wallet<br>
    <a href="${SITE}" style="color:#c9d1d9">rewallet.online</a> · <a href="mailto:${TEAM}" style="color:#c9d1d9">${TEAM}</a> · Dubai, UAE<br>
    © ${new Date().getFullYear()} reWallet. Your wallet. Your keys. Your assets.
  </td></tr>
</table></td></tr></table></body></html>`;
}

function answersHTML(d) {
  return SECTIONS.map(([title, keys]) => {
    const rows = keys.filter(k => d[k] && String(d[k]).trim());
    if (!rows.length) return '';
    return `<div style="margin:0 0 18px">
      <div style="font-size:13px;font-weight:700;color:#1c6dd0;text-transform:uppercase;letter-spacing:.06em;padding-bottom:8px;border-bottom:2px solid #eef1f5">${esc(title)}</div>
      <table class="kv" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
      ${rows.map(k => `<tr><td style="padding:9px 0;border-bottom:1px solid #f0f2f5;color:#707a8a;width:40%;vertical-align:top">${esc(LABEL[k] || k)}</td><td style="padding:9px 0;border-bottom:1px solid #f0f2f5;font-weight:500;vertical-align:top">${val(d[k])}</td></tr>`).join('')}
      </table></div>`;
  }).join('');
}

function answersText(d) {
  return SECTIONS.map(([title, keys]) => {
    const rows = keys.filter(k => d[k] && String(d[k]).trim());
    return rows.length ? `== ${title} ==\n` + rows.map(k => `${LABEL[k] || k}: ${Array.isArray(d[k]) ? d[k].join(', ') : d[k]}`).join('\n') : '';
  }).filter(Boolean).join('\n\n');
}

module.exports = async (req, res) => {
  // allow browsers on other origins and AI agents to call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed' }); }
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return res.status(503).json({ ok: false, error: 'Email not configured' });

  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = {}; } }
  d = d || {};
  if (d._honey) return res.status(200).json({ ok: true }); // spam trap
  const email = String(d.email || '').trim();
  if (!d.company || !d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Missing company, name or a valid email' });
  // keep only known fields, cap lengths
  const clean = {};
  for (const k of Object.keys(LABEL)) if (d[k] != null) clean[k] = Array.isArray(d[k]) ? d[k].slice(0, 30).map(x => String(x).slice(0, 200)) : String(d[k]).slice(0, 2000);

  const port = +(process.env.SMTP_PORT || 465);
  const tx = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  const from = process.env.MAIL_FROM || `reWallet <${process.env.SMTP_USER}>`;
  const ref = 'RW-' + Date.now().toString(36).toUpperCase();

  const team = layout({
    preheader: `New white-label request from ${clean.company}`,
    title: `New request · ${clean.company}`,
    intro: `${esc(clean.name)}${clean.role ? ', ' + esc(clean.role) : ''} · <a href="mailto:${esc(email)}" style="color:#ffffff">${esc(email)}</a>${clean.phone ? ' · ' + esc(clean.phone) : ''}<br>Reference ${ref}`,
    body: answersHTML(clean),
    cta: { href: `mailto:${email}?subject=${encodeURIComponent('Your reWallet request ' + ref)}`, label: `Reply to ${clean.name}` },
  });
  const client = layout({
    preheader: 'We received your reWallet white-label request',
    title: `Thank you, ${clean.name.split(' ')[0]}`,
    intro: `We've received your white-label wallet request for <b>${esc(clean.company)}</b>. Our team will review it and reply within one business day with a tailored proposal, timeline and demo build.`,
    body: `<p style="margin:0 0 18px;font-size:14px;color:#474d57;line-height:1.6">Your reference is <b>${ref}</b>. Here's a copy of what you sent us — just reply to this email if anything needs changing.</p>${answersHTML(clean)}
      <div style="background:#f5f8ff;border:1px solid #d8e4fb;border-radius:10px;padding:14px 16px;font-size:13px;color:#2b4a7a;line-height:1.6"><b>What happens next</b><br>1. Solution review with our team &nbsp;·&nbsp; 2. Proposal &amp; timeline &nbsp;·&nbsp; 3. Branded demo build &nbsp;·&nbsp; 4. Deploy</div>`,
    cta: { href: `${SITE}/#download`, label: 'Try the reWallet beta' },
  });

  try {
    await Promise.all([
      tx.sendMail({ from, to: TEAM, replyTo: email, subject: `White-label request — ${clean.company} (${ref})`, html: team, text: answersText(clean) }),
      tx.sendMail({ from, to: email, replyTo: TEAM, subject: `We received your reWallet request (${ref})`, html: client, text: `Thank you, ${clean.name}.\n\nWe received your white-label request for ${clean.company}. Reference ${ref}. We'll reply within one business day.\n\n${answersText(clean)}\n\nreWallet · rewallet.online` }),
    ]);
    return res.status(200).json({ ok: true, ref });
  } catch (e) {
    console.error('mail error', e && e.message);
    return res.status(502).json({ ok: false, error: 'Could not send email' });
  }
};
