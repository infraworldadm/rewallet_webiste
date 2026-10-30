/* reWallet website — interactions & live app mock (demo data only) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n, d = 2) => (+n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const uri = s => 'data:image/svg+xml,' + encodeURIComponent(s);

  /* ---------- icons (line, 24px) ---------- */
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    send: ic('<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>'),
    recv: ic('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>'),
    swap: ic('<path d="M4 8h15l-4-4M20 16H5l4 4"/>'),
    bridge: ic('<path d="M9.5 14.5 14.5 9.5M8 11l-2 2a3.5 3.5 0 0 0 5 5l2-2M16 13l2-2a3.5 3.5 0 0 0-5-5l-2 2"/>'),
    pay: ic('<path d="M3 9h18M5 9l1.5-4h11L19 9M5 9v10h14V9M9 19v-5h6v5"/>'),
    eye: ic('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    chev: ic('<path d="m6 9 6 6 6-6"/>'),
    right: ic('<path d="m9 18 6-6-6-6"/>'),
    back: ic('<path d="M15 18 9 12l6-6"/>'),
    info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    flip: ic('<path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4"/>'),
    sliders: ic('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
    home: ic('<path d="M3 11 12 4l9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
    gift: ic('<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v7h14v-7M12 8v12M12 8S10.5 4 8 4.5 8.5 8 12 8zm0 0s1.5-4 4-3.5S15.5 8 12 8z"/>'),
    gear: ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>'),
    copy: ic('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>'),
    scan: ic('<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"/>'),
    shield: ic('<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>'),
    check: ic('<path d="m5 12 5 5 9-10"/>'),
    bell: ic('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>'),
    face: ic('<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M9 9v1M15 9v1M12 9v4h-1M9 16c1.6 1.3 4.4 1.3 6 0"/>'),
    store: ic('<path d="M4 10v10h16V10M3 10l2-6h14l2 6zM3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"/>'),
  };
  const SB = `<svg viewBox="0 0 64 14" aria-hidden="true"><g fill="currentColor"><rect x="0" y="9" width="3" height="4" rx="1"/><rect x="4.5" y="6.5" width="3" height="6.5" rx="1"/><rect x="9" y="4" width="3" height="9" rx="1"/><rect x="13.5" y="1.5" width="3" height="11.5" rx="1"/><path d="M28 3.2c2.2 0 4.2.9 5.7 2.3l1.2-1.2A9.7 9.7 0 0 0 28 1.5a9.7 9.7 0 0 0-6.9 2.8l1.2 1.2A8 8 0 0 1 28 3.2zm0 3.4c1.3 0 2.5.5 3.3 1.3l1.2-1.2A6.3 6.3 0 0 0 28 4.9a6.3 6.3 0 0 0-4.5 1.8l1.2 1.2c.9-.8 2-1.3 3.3-1.3zM28 10l1.9-1.9a2.7 2.7 0 0 0-3.8 0z"/><rect x="40" y="1.5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" stroke-opacity=".4"/><rect x="42" y="3.5" width="17" height="7" rx="1.8"/><rect x="62" y="5" width="1.6" height="4" rx=".8" opacity=".4"/></g></svg>`;

  /* ---------- assets / data ---------- */
  const ETHI = uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#627eea"/><path fill="#fff" fill-opacity=".6" d="M16.5 4v8.9l7.5 3.3z"/><path fill="#fff" d="M16.5 4 9 16.2l7.5-3.3z"/><path fill="#fff" fill-opacity=".6" d="M16.5 21.9V28l7.5-10.4z"/><path fill="#fff" d="M16.5 28v-6.1L9 17.6z"/></svg>');
  const USDCI = uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#2775ca"/><path fill="#fff" d="M20.2 18.4c0-2.2-1.3-3-4-3.3-1.9-.3-2.3-.8-2.3-1.7s.7-1.5 1.9-1.5c1.1 0 1.8.4 2.1 1.4a.5.5 0 0 0 .5.3h1a.4.4 0 0 0 .4-.5 3.3 3.3 0 0 0-3-2.7V9.2a.5.5 0 0 0-.5-.5h-.9a.5.5 0 0 0-.5.5v1.2c-1.9.3-3 1.5-3 3.1 0 2.1 1.3 2.9 3.9 3.2 1.8.3 2.4.7 2.4 1.7s-.9 1.7-2.1 1.7c-1.6 0-2.2-.7-2.4-1.6a.5.5 0 0 0-.5-.4h-1a.4.4 0 0 0-.4.5c.3 1.6 1.3 2.7 3.4 3v1.2a.5.5 0 0 0 .5.5h.9a.5.5 0 0 0 .5-.5v-1.2c1.9-.3 3.1-1.6 3.1-3.4z"/><path fill="#fff" d="M12.8 24.6a8.9 8.9 0 0 1 0-17.2V6.2a10.1 10.1 0 0 0 0 19.6zm6.4-18.4v1.2a8.9 8.9 0 0 1 0 17.2v1.2a10.1 10.1 0 0 0 0-19.6z"/></svg>');
  const circ = (c, t) => uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${c}"/><text x="16" y="20.5" font-family="Arial,sans-serif" font-weight="700" font-size="12" fill="#fff" text-anchor="middle">${t}</text></svg>`);
  const TOKEN = {
    USDT: { img: 'assets/usdt.png' }, USDC: { img: USDCI }, ETH: { img: ETHI },
    BNB: { img: 'assets/bnb.png' }, TRX: { img: 'assets/tron.png' }, ARB: { img: circ('#28a0f0', 'AR') },
  };
  const NETS = {
    Ethereum: { img: ETHI, eta: 180, gas: 2.4 },
    'BNB Chain': { img: 'assets/bnb.png', eta: 45, gas: .12 },
    TRON: { img: 'assets/tron.png', eta: 60, gas: .9 },
    Arbitrum: { img: circ('#28a0f0', 'AR'), eta: 30, gas: .05 },
    Optimism: { img: circ('#ff0420', 'OP'), eta: 30, gas: .04 },
    Base: { img: circ('#0052ff', 'B'), eta: 25, gas: .02 },
    Polygon: { img: circ('#8247e5', 'PO'), eta: 60, gas: .01 },
    Avalanche: { img: circ('#e84142', 'AV'), eta: 20, gas: .08 },
  };
  const USD = { USDT: 1, USDC: 1, ETH: 3200, BNB: 600, TRX: 0.16, ARB: 0.8 };
  const CHG = { USDT: 0.01, USDC: 0, ETH: 2.4, BNB: -0.8, TRX: 1.2, ARB: 3.6 };
  const BAL = { USDT: 1320, USDC: 450, ETH: 0.42, BNB: 1.5, TRX: 2400, ARB: 300 };
  const FIAT = { USD: [1, '$'], EUR: [0.92, '€'], GBP: [0.79, '£'], INR: [83.5, '₹'], SAR: [3.75, 'SAR '] };
  const state = { fiat: 'USD', crypto: 'USDT' };
  const fiat = usd => FIAT[state.fiat][1] + fmt(usd * FIAT[state.fiat][0]);
  const dp = k => (USD[k] > 100 ? 4 : 2);
  const tokImg = k => `<span class="tki"><img src="${TOKEN[k].img}" alt=""></span>`;
  const netImg = n => `<span class="tki sm${NETS[n].ink ? ' ink' : ''}"><img src="${NETS[n].img}" alt=""></span>`;
  /* any-to-any; TRON <-> EVM goes through the reWallet router as a multi-hop route */
  const isHop = (f, t) => f !== t && (f === 'TRON') !== (t === 'TRON');
  const routeTxt = (f, t) => isHop(f, t) ? `${f} → Router → ${t}` : `${f} → ${t}`;
  const routeEta = (f, t) => NETS[f].eta + (isHop(f, t) ? 25 : 0);
  const routeGas = (f, t) => NETS[f].gas + (isHop(f, t) ? NETS[t].gas : 0);
  const eta = s => (s < 60 ? `~${s} sec` : `~${Math.round(s / 60)} min`);

  const DEFAULT = {
    name: 'reWallet', logo: 'preset0',
    nets: ['Ethereum', 'BNB Chain', 'TRON', 'Arbitrum', 'Optimism', 'Base'],
    tokens: ['USDT', 'USDC', 'ETH', 'BNB', 'TRX'],
    swap: 'reWallet Swap', bridge: 'reWallet Router', fee: 0.3,
    cash: true, cashName: 'reID Cashback', cashRate: 1,
    merchant: true, merchantName: 'Dune Café · Dubai',
    kyc: true, screen: true, travel: true, region: 'UAE',
  };
  const THEMES = {
    classic: { 'ph-bg': '#f2f2f5', 'ph-card': '#ffffff', 'ph-card2': '#ebebef', 'ph-ink': '#111114', 'ph-mut': '#86868f', 'ph-line': '#e3e3e8', act: '#111114', 'act-ink': '#ffffff', hcard: '#ffffff', 'hcard-ink': '#111114', 'hcard-mut': '#86868f', 'ph-tab': 'rgba(255,255,255,.92)' },
    midnight: { 'ph-bg': '#000000', 'ph-card': '#0d0d0d', 'ph-card2': '#171717', 'ph-ink': '#ffffff', 'ph-mut': '#9a9a9a', 'ph-line': '#242424', act: '#0066ff', 'act-ink': '#ffffff', hcard: 'linear-gradient(160deg,#0b1d3d,#0d0d0d 70%)', 'hcard-ink': '#ffffff', 'hcard-mut': '#8fa3c4', 'ph-tab': 'rgba(10,10,10,.92)' },
    violet: { 'ph-bg': '#f4f1ff', 'ph-card': '#ffffff', 'ph-card2': '#eee8ff', 'ph-ink': '#160a33', 'ph-mut': '#7b6f99', 'ph-line': '#e4dcfa', act: '#7000ff', 'act-ink': '#ffffff', hcard: 'linear-gradient(150deg,#7a14ff,#4b00c2)', 'hcard-ink': '#ffffff', 'hcard-mut': '#d9c8ff', 'ph-tab': 'rgba(255,255,255,.94)' },
    neo: { 'ph-bg': '#edf7f1', 'ph-card': '#ffffff', 'ph-card2': '#e1f1e8', 'ph-ink': '#0f2a1d', 'ph-mut': '#698a79', 'ph-line': '#d4eadd', act: '#00a36c', 'act-ink': '#ffffff', hcard: 'linear-gradient(150deg,#c9f5dd,#ffffff)', 'hcard-ink': '#0f2a1d', 'hcard-mut': '#5d806d', 'ph-tab': 'rgba(255,255,255,.94)' },
    luxe: { 'ph-bg': '#0b0a08', 'ph-card': '#16140f', 'ph-card2': '#1e1b14', 'ph-ink': '#f5eedc', 'ph-mut': '#a69d86', 'ph-line': '#2b271d', act: '#c9a227', 'act-ink': '#16140f', hcard: 'linear-gradient(150deg,#3a2e14,#12100b 75%)', 'hcard-ink': '#f5eedc', 'hcard-mut': '#c9b98d', 'ph-tab': 'rgba(14,13,10,.94)' },
    ocean: { 'ph-bg': '#e9f1fb', 'ph-card': '#ffffff', 'ph-card2': '#dfeaf7', 'ph-ink': '#0b2340', 'ph-mut': '#66809e', 'ph-line': '#d2e1f2', act: '#0a66ff', 'act-ink': '#ffffff', hcard: 'linear-gradient(150deg,#0a66ff,#00b4d8)', 'hcard-ink': '#ffffff', 'hcard-mut': '#cfe6ff', 'ph-tab': 'rgba(255,255,255,.94)' },
  };
  const phones = [];

  /* ---------- phone factory ---------- */
  function createPhone(host, kind) {
    const P = { host, kind, view: 'home', cfg: { ...DEFAULT, nets: [...DEFAULT.nets], tokens: [...DEFAULT.tokens] }, net: 'Ethereum', slip: 0.5, hidden: false,
      cash: { pending: 6.2, available: 18.4, claimed: 142.75 } };
    host.innerHTML = `
      <span class="hw hw1"></span><span class="hw hw2"></span><span class="hw hw3"></span>
      <div class="screen">
        <div class="island"></div>
        <div class="sbar"><span>9:41</span>${SB}</div>
        <div class="views">${['home', 'send', 'receive', 'swap', 'bridge', 'rewards', 'settings', 'pay'].map(v => `<section class="view${v === 'home' ? ' on' : ''}" data-v="${v}"></section>`).join('')}</div>
        <nav class="tabbar">
          <button data-go="home" class="on">${I.home}<span>Wallet</span></button>
          <button data-go="swap">${I.swap}<span>Swap</span></button>
          <button data-go="bridge">${I.bridge}<span>Bridge</span></button>
          <button data-go="rewards">${I.gift}<span>Rewards</span></button>
          <button data-go="settings">${I.gear}<span>Settings</span></button>
        </nav>
        <div class="homebar"></div>
        <div class="overlay"><div class="sheet"></div></div>
      </div>`;
    const V = n => $(`[data-v="${n}"]`, host);
    const q = s => $(s, host);
    const hdr = t => `<div class="hdr"><button class="ib" data-go="home" aria-label="Back">${I.back}</button><h6>${t}</h6><span class="ib ghost"></span></div>`;
    const toks = () => P.cfg.tokens.filter(k => TOKEN[k]);
    const tokOpts = sel => toks().map(k => `<option ${k === sel ? 'selected' : ''}>${k}</option>`).join('');
    const total = () => toks().reduce((a, k) => a + BAL[k] * USD[k], 0);
    const logoHTML = () => {
      const c = P.cfg, ini = esc((c.name.replace(/[^A-Za-z0-9]/g, '') || 'rw'));
      if (c.logo === 'upload' && c.logoData) return `<img src="${c.logoData}" alt="">`;
      if (c.logo === 'preset1') return `<i class="lg c">${ini.charAt(0).toUpperCase()}</i>`;
      if (c.logo === 'preset2') return `<i class="lg h">${ini.slice(0, 2).toUpperCase()}</i>`;
      return `<img src="assets/icon.png" alt="" class="tint">`;
    };
    const avatar = () => `<span class="orbav"></span>`;
    const acct = () => `<div class="acc"><span>Account 1 ${I.chev}</span><b>0x7325…5fCd</b></div>`;

    P.renderHome = () => {
      const c = P.cfg, tot = total(), list = toks();
      if (!c.nets.includes(P.net)) P.net = c.nets[0];
      V('home').innerHTML = `
        ${kind === 'wl' ? `<div class="brandbar" data-hl="brand"><span class="blogo">${logoHTML()}</span><b>${esc(c.name)}</b><button class="ib ghost2" aria-label="Notifications">${I.bell}</button></div>` : ''}
        <div class="hcard">
          <div class="hrow">
            <button class="netpill" data-act="net" data-hl="nets" aria-label="Switch network">${netImg(P.net)}<span>${esc(P.net)}</span>${I.chev}</button>
            <div class="hright">${acct()}${avatar()}</div>
          </div>
          <div class="bal"><small>Balance</small>
            <div class="bamt"><span class="bv">${P.hidden ? '••••••' : fiat(tot)}</span><button class="eye" aria-label="Hide balance">${I.eye}</button></div>
            <div class="bsub">≈ ${fmt(tot / USD[state.crypto], dp(state.crypto))} ${state.crypto}</div>
          </div>
          ${c.kyc ? `<div class="kyc" data-hl="kyc">${I.shield}<span>reID verified</span></div>` : ''}
        </div>
        <div class="acts${c.merchant ? ' five' : ''}">
          <button data-go="send"><span>${I.send}</span>Send</button>
          <button data-go="receive"><span>${I.recv}</span>Receive</button>
          <button data-go="swap"><span>${I.swap}</span>Swap</button>
          <button data-go="bridge"><span>${I.bridge}</span>Bridge</button>
          ${c.merchant ? `<button data-go="pay" data-hl="merchant"><span>${I.pay}</span>Pay</button>` : ''}
        </div>
        ${c.cash ? `<button class="cb-banner" data-go="rewards" data-hl="cash"><span class="cb-ic">${I.gift}</span><span><small>${esc(c.cashName)} · ${fmt(c.cashRate, 1)}% back</small><b>${fmt(P.cash.available)} USDT available</b></span>${I.right}</button>` : ''}
        <div class="tabs"><button class="on" data-t="tokens">Tokens</button><button data-t="nfts">NFTs</button></div>
        <div class="tpane" data-p="tokens">
          <div class="tools"><button class="pill2">Sort by ${I.chev}</button><button class="pill2" data-go="settings">${I.plus} Import</button></div>
          <div class="tlist" data-hl="tokens">${list.map(k => `
            <button class="tok" data-tok="${k}">${tokImg(k)}
              <span class="nm"><b>${k}</b><small>${fmt(BAL[k], dp(k))} ${k}</small></span>
              <span class="vl"><b>${fiat(BAL[k] * USD[k])}</b><small class="${CHG[k] > 0 ? 'up' : CHG[k] < 0 ? 'dn' : ''}">${CHG[k] > 0 ? '+' : ''}${CHG[k]}%</small></span>
            </button>`).join('')}
          </div>
          <p class="imp">Don't see your token? <button data-go="settings">Import tokens</button></p>
        </div>
        <div class="tpane nfts" data-p="nfts" hidden>
          <div><img src="assets/nft.jpg" alt=""><p>Genesis Pillar<small>#12 · Ethereum</small></p></div>
          <div><i style="background:conic-gradient(from 200deg,#7000ff,#00e5ff,#c9b0ff,#7000ff)"></i><p>Prism Pass<small>#08 · Base</small></p></div>
          <div><i style="background:linear-gradient(135deg,#ff8a3d,#ffd36e)"></i><p>Desert Dune<small>#221 · Arbitrum</small></p></div>
          <div><i style="background:linear-gradient(135deg,#0a66ff,#c9b0ff)"></i><p>reID Badge<small>Soulbound</small></p></div>
        </div>`;
    };

    P.renderSend = () => {
      const c = P.cfg;
      V('send').innerHTML = `${hdr('Send')}
        <div class="card">
          <label class="lab">To</label>
          <div class="addr-in"><input class="s-to" value="0x9a1F…c42B" aria-label="Recipient"><button class="ib sm" aria-label="Scan">${I.scan}</button></div>
          ${c.screen ? `<div class="note ok" data-hl="screen">${I.shield} Address screened · low risk</div>` : ''}
        </div>
        <div class="card">
          <label class="lab">Amount</label>
          <div class="amtrow"><input class="big s-amt" type="number" min="0" step="any" value="25" aria-label="Amount"><label class="tpill"><span class="tp-i"></span><select class="s-tok" aria-label="Token">${tokOpts('USDT')}</select>${I.chev}</label></div>
          <div class="brow"><span class="s-bal"></span><span><button class="chip s-half">50%</button><button class="chip s-max">Max</button></span></div>
        </div>
        <div class="note warn s-travel" hidden data-hl="travel">${I.info} Travel Rule: beneficiary details required above $1,000</div>
        <div class="card det">
          <div><span>Network</span><b>${esc(P.net)}</b></div>
          <div><span>Network fee</span><b>${fiat(NETS[P.net].gas)}</b></div>
          <div data-hl="fee"><span>Platform fee</span><b class="s-pf"></b></div>
          <div><span>Total</span><b class="s-tot"></b></div>
        </div>
        <button class="pbtn s-go">Review &amp; Send</button>`;
      const upd = () => {
        const k = q('.s-tok').value, a = +q('.s-amt').value || 0, v = a * USD[k];
        q('.tp-i').innerHTML = tokImg(k);
        q('.s-bal').textContent = `Balance: ${fmt(BAL[k], dp(k))}`;
        q('.s-pf').textContent = `${fmt(c.fee)}% · ${fiat(v * c.fee / 100)}`;
        q('.s-tot').textContent = fiat(v * (1 + c.fee / 100) + NETS[P.net].gas);
        q('.s-travel').hidden = !(c.travel && v > 1000);
        const g = q('.s-go'); g.disabled = a <= 0 || a > BAL[k];
        g.textContent = a > BAL[k] ? 'Insufficient balance' : 'Review & Send';
      };
      V('send').addEventListener('input', upd);
      q('.s-max').onclick = () => { q('.s-amt').value = BAL[q('.s-tok').value]; upd(); };
      q('.s-half').onclick = () => { q('.s-amt').value = +(BAL[q('.s-tok').value] / 2).toFixed(4); upd(); };
      q('.s-go').onclick = () => {
        const k = q('.s-tok').value, a = +q('.s-amt').value;
        P.confirm(`Send ${fmt(a, dp(k))} ${k}`, `to 0x9a1F…c42B on ${P.net}`, () => { BAL[k] -= a; refreshAll(); }, `Sent ${fmt(a, dp(k))} ${k}`);
      };
      upd();
    };

    P.renderReceive = () => {
      V('receive').innerHTML = `${hdr('Receive')}
        <div class="card qr">
          <div class="qr-net">${netImg(P.net)} ${esc(P.net)}</div>
          <img src="assets/qr.png" alt="Wallet address QR">
          <div class="addr">0x7325b1E9a04F7d2C83aA61f0E4b9D1c55E2d5fCd</div>
          <div class="qr-acts"><button class="pbtn ghost r-copy">${I.copy} Copy</button><button class="pbtn ghost r-share">Share</button></div>
        </div>
        <p class="hint">Only send ${esc(P.net)}-compatible assets to this address.</p>`;
      q('.r-copy').onclick = () => { navigator.clipboard?.writeText('0x7325b1E9a04F7d2C83aA61f0E4b9D1c55E2d5fCd').catch(() => {}); toast('Address copied'); };
      q('.r-share').onclick = () => toast('Share sheet · demo');
    };

    P.renderSwap = () => {
      const c = P.cfg, L = toks(), a0 = L.includes('USDT') ? 'USDT' : L[0], b0 = L.includes('ETH') && a0 !== 'ETH' ? 'ETH' : (L.find(k => k !== a0) || a0);
      V('swap').innerHTML = `
        <div class="hdr swap-h">${avatar()}${acct()}<button class="slipchip" aria-label="Slippage">${I.sliders}<span class="w-sl">${P.slip}%</span></button></div>
        <div class="card pay">
          <label class="lab">You pay</label>
          <div class="amtrow"><input class="big w-in" type="number" min="0" step="any" value="200" aria-label="You pay"><label class="tpill"><span class="tp-a"></span><select class="w-a" aria-label="Pay token">${tokOpts(a0)}</select>${I.chev}</label></div>
          <div class="brow"><span class="w-bal"></span><span><button class="chip" data-p=".5">50%</button><button class="chip" data-p="1">Max</button></span></div>
        </div>
        <button class="flipb" aria-label="Flip tokens">${I.flip}</button>
        <div class="card pay">
          <label class="lab">You receive</label>
          <div class="amtrow"><input class="big w-out" readonly aria-label="You receive"><label class="tpill"><span class="tp-b"></span><select class="w-b" aria-label="Receive token">${tokOpts(b0)}</select>${I.chev}</label></div>
          <div class="brow"><span class="w-bal2"></span></div>
        </div>
        <div class="card det">
          <div data-hl="swap"><span>Provider ${I.info}</span><b class="prov">${esc(c.swap)}</b></div>
          <div><span>Price ${I.info}</span><b class="w-rate"></b></div>
          <div data-hl="fee"><span>Fees ${I.info}</span><b class="w-fee"></b></div>
          <div><span>Min. received ${I.info}</span><b class="w-min"></b></div>
          <div><span>Slippage ${I.info}</span><b class="w-sl">${P.slip}%</b></div>
        </div>
        <button class="pbtn w-go">Swap</button>`;
      const upd = () => {
        const a = q('.w-a').value, b = q('.w-b').value, x = +q('.w-in').value || 0;
        const rate = USD[a] / USD[b], fee = (c.fee + 0.25) / 100, out = x * rate * (1 - fee);
        q('.tp-a').innerHTML = tokImg(a); q('.tp-b').innerHTML = tokImg(b);
        q('.w-out').value = out ? fmt(out, dp(b)) : '0';
        q('.w-rate').textContent = `1 ${a} = ${fmt(rate, rate < 0.01 ? 6 : 4)} ${b}`;
        q('.w-fee').textContent = `${fmt(c.fee)}% + 0.25% LP`;
        q('.w-min').textContent = `${fmt(out * (1 - P.slip / 100), dp(b))} ${b}`;
        q('.w-bal').textContent = `Balance: ${fmt(BAL[a], dp(a))}`; q('.w-bal2').textContent = `Balance: ${fmt(BAL[b], dp(b))}`;
        $$('.w-sl', V('swap')).forEach(e => e.textContent = P.slip + '%');
        const g = q('.w-go'); g.disabled = !x || x > BAL[a] || a === b;
        g.textContent = a === b ? 'Select different tokens' : x > BAL[a] ? 'Insufficient balance' : 'Swap';
        P._sw = { a, b, x, out };
      };
      V('swap').addEventListener('input', upd); V('swap').addEventListener('change', upd);
      $$('[data-p]', V('swap')).forEach(btn => btn.onclick = () => { q('.w-in').value = +(BAL[q('.w-a').value] * +btn.dataset.p).toFixed(4); upd(); });
      q('.slipchip').onclick = () => { const s = [0.1, 0.5, 1, 3]; P.slip = s[(s.indexOf(P.slip) + 1) % s.length]; upd(); };
      q('.flipb').onclick = () => { const A = q('.w-a'), B = q('.w-b'), t = A.value; A.value = B.value; B.value = t; upd(); };
      q('.w-go').onclick = () => { const { a, b, x, out } = P._sw; P.confirm(`Swap ${fmt(x, dp(a))} ${a}`, `for ≈ ${fmt(out, dp(b))} ${b} via ${c.swap}`, () => { BAL[a] -= x; BAL[b] += out; refreshAll(); }, 'Swap complete'); };
      upd();
    };

    P.renderBridge = () => {
      const c = P.cfg, N = c.nets;
      const opt = s => N.map(n => `<option ${n === s ? 'selected' : ''}>${n}</option>`).join('');
      const f0 = N.includes('TRON') ? 'TRON' : N[0], t0 = N.includes('BNB Chain') && f0 !== 'BNB Chain' ? 'BNB Chain' : (N.find(n => n !== f0) || N[0]);
      V('bridge').innerHTML = `${hdr('Bridge')}
        <div class="chains">
          <label class="card ch"><span class="lab">From</span><span class="chv"><span class="cf-i"></span><select class="b-f" aria-label="From">${opt(f0)}</select>${I.chev}</span></label>
          <button class="flipb h b-sw" aria-label="Switch">${I.swap}</button>
          <label class="card ch"><span class="lab">To</span><span class="chv"><span class="ct-i"></span><select class="b-t" aria-label="To">${opt(t0)}</select>${I.chev}</span></label>
        </div>
        <div class="card">
          <label class="lab">Amount</label>
          <div class="amtrow"><input class="big b-a" type="number" min="0" step="any" value="100" aria-label="Amount"><span class="tpill static">${tokImg('USDT')}USDT</span></div>
          <div class="brow"><span>Balance: ${fmt(BAL.USDT)}</span></div>
        </div>
        <div class="card det">
          <div data-hl="bridge"><span>Provider ${I.info}</span><b>${esc(c.bridge)}</b></div>
          <div><span>Route</span><b class="b-r"></b></div>
          <div data-hl="fee"><span>You receive</span><b class="b-rc"></b></div>
          <div><span>Est. arrival</span><b class="b-e"></b></div>
        </div>
        <button class="pbtn b-go">Bridge</button>`;
      const upd = () => {
        const f = q('.b-f').value, t = q('.b-t').value, a = +q('.b-a').value || 0;
        q('.cf-i').innerHTML = netImg(f); q('.ct-i').innerHTML = netImg(t);
        q('.b-r').textContent = routeTxt(f, t);
        q('.b-rc').textContent = `${fmt(a * (1 - 0.001 - c.fee / 100))} USDT`;
        q('.b-e').textContent = eta(routeEta(f, t));
        const g = q('.b-go'); g.disabled = f === t || !a || a > BAL.USDT;
        g.textContent = f === t ? 'Choose different networks' : a > BAL.USDT ? 'Insufficient balance' : 'Bridge';
      };
      V('bridge').addEventListener('input', upd); V('bridge').addEventListener('change', upd);
      q('.b-sw').onclick = () => { const A = q('.b-f'), B = q('.b-t'), t = A.value; A.value = B.value; B.value = t; upd(); };
      q('.b-go').onclick = () => P.confirm(`Bridge ${q('.b-a').value} USDT`, routeTxt(q('.b-f').value, q('.b-t').value), () => {}, 'Bridge submitted');
      upd();
    };

    P.renderRewards = () => {
      const c = P.cfg, k = P.cash;
      V('rewards').innerHTML = `${hdr('Rewards')}` + (!c.cash ? `<div class="emptyst">${I.gift}<b>No cashback program</b><span>This wallet's operator hasn't enabled a cashback program.</span></div>` : `
        <div class="cb-hero" data-hl="cash"><small>${esc(c.cashName)}</small><b>${fmt(c.cashRate, 1)}% back</b><span>on eligible payments &amp; swaps · paid in USDT</span></div>
        <div class="stats3"><div><b>${fmt(k.pending)}</b><span>Pending</span></div><div><b>${fmt(k.available)}</b><span>Available</span></div><div><b>${fmt(k.claimed)}</b><span>Claimed</span></div></div>
        <div class="card chartc"><div class="ch-h"><span class="lab">Last 7 days</span><b>+${fmt(k.available * .4)} USDT</b></div><div class="bars">${[30, 45, 28, 60, 52, 75, 90].map((h, i) => `<i data-h="${h}"><em>${'MTWTFSS'[i]}</em></i>`).join('')}</div></div>
        <button class="pbtn c-go" ${k.available ? '' : 'disabled'}>${k.available ? `Claim ${fmt(k.available)} USDT` : 'Nothing to claim'}</button>
        <label class="lab sec">History</label>
        <div class="card list">
          <div><span>${I.store}</span><p>Online purchase<small>Today</small></p><b class="up">+4.20</b></div>
          <div><span>${I.swap}</span><p>Swap USDT → ETH<small>Yesterday</small></p><b class="up">+0.60</b></div>
          <div><span>${I.pay}</span><p>${esc(c.merchantName)}<small>Mon</small></p><b class="up">+2.40</b></div>
        </div>`);
      if (c.cash) {
        requestAnimationFrame(() => setTimeout(() => $$('.bars i', V('rewards')).forEach(i => i.style.height = i.dataset.h + '%'), 60));
        q('.c-go').onclick = () => P.confirm(`Claim ${fmt(k.available)} USDT`, 'Cashback to your wallet', () => { BAL.USDT += k.available; k.claimed += k.available; k.available = 0; refreshAll(); }, 'Cashback claimed');
      }
    };

    P.renderSettings = () => {
      const c = P.cfg;
      const row = (t, s, on) => `<button class="setrow" data-sw="1"><span><b>${t}</b><small>${s}</small></span><i class="sw${on ? ' on' : ''}"></i></button>`;
      V('settings').innerHTML = `${hdr('Settings')}
        <label class="lab sec">Security</label>
        <div class="card list0">
          ${row('Face ID', 'Approve every transaction', true)}
          ${row('Passkeys', 'Phishing-resistant sign-in', true)}
          ${row('Transaction PIN', '6-digit fallback', true)}
          ${row('Risk alerts', 'Warn on suspicious addresses', true)}
        </div>
        <label class="lab sec">Compliance</label>
        <div class="card list0" data-hl="compliance">
          <div class="setrow"><span><b>Identity</b><small>${c.kyc ? 'reID verified · Level 2' : 'Not required'}</small></span><em class="tag ${c.kyc ? 'g' : ''}">${c.kyc ? 'Verified' : 'Off'}</em></div>
          <div class="setrow"><span><b>Travel Rule</b><small>${c.travel ? 'Enabled above $1,000' : 'Disabled'}</small></span><em class="tag ${c.travel ? 'g' : ''}">${c.travel ? 'On' : 'Off'}</em></div>
          <div class="setrow"><span><b>Sanctions screening</b><small>${c.screen ? 'All outgoing addresses' : 'Disabled'}</small></span><em class="tag ${c.screen ? 'g' : ''}">${c.screen ? 'On' : 'Off'}</em></div>
          <div class="setrow"><span><b>Region</b><small>Jurisdiction profile</small></span><em class="tag">${esc(c.region)}</em></div>
        </div>
        <label class="lab sec">Networks</label>
        <div class="card list0 netl" data-hl="nets">${c.nets.map(n => `<div class="setrow">${netImg(n)}<span><b>${n}</b></span><em class="tag g">Live</em></div>`).join('')}</div>
        <label class="lab sec">Add custom network</label>
        <div class="card form0">
          <input class="n-name" placeholder="Network name" aria-label="Network name">
          <input class="n-rpc" placeholder="RPC URL (https://…)" aria-label="RPC URL">
          <input class="n-id" inputmode="numeric" placeholder="Chain ID" aria-label="Chain ID">
          <button class="pbtn n-add">Add network</button>
        </div>`;
      $$('.setrow[data-sw]', V('settings')).forEach(r => r.onclick = () => { const s = $('.sw', r); s.classList.toggle('on'); toast(`${$('b', r).textContent} ${s.classList.contains('on') ? 'on' : 'off'}`); });
      q('.n-add').onclick = () => {
        const n = q('.n-name').value.trim(), r = q('.n-rpc').value.trim(), id = q('.n-id').value.trim();
        if (!n || !/^https?:\/\//.test(r) || !/^\d+$/.test(id)) return toast('Enter a name, valid RPC URL and numeric Chain ID');
        q('.netl').insertAdjacentHTML('beforeend', `<div class="setrow"><span class="tki sm"><img src="${circ('#555', esc(n.slice(0, 2).toUpperCase()))}" alt=""></span><span><b>${esc(n)}</b><small>Chain ID ${esc(id)}</small></span><em class="tag">Custom</em></div>`);
        q('.n-name').value = q('.n-rpc').value = q('.n-id').value = ''; toast(`${n} added`);
      };
    };

    P.renderPay = () => {
      const c = P.cfg;
      V('pay').innerHTML = `${hdr('Pay merchant')}
        <div class="card merch" data-hl="merchant">
          <div class="scanbox"><span class="scanln"></span>${I.scan}</div>
          <b>${esc(c.merchantName)}</b><small>Verified merchant · reWallet Pay</small>
          <div class="m-amt">42.50 <span>USDT</span></div>
          ${c.cash ? `<em class="tag g">+${fmt(42.5 * c.cashRate / 100)} USDT cashback</em>` : ''}
        </div>
        <div class="card det">
          <div><span>Network</span><b>${esc(P.net)}</b></div>
          <div><span>Network fee</span><b>${fiat(NETS[P.net].gas)}</b></div>
          <div><span>Merchant fee</span><b>Paid by merchant</b></div>
        </div>
        <button class="pbtn m-go">Pay 42.50 USDT</button>`;
      q('.m-go').onclick = () => P.confirm('Pay 42.50 USDT', c.merchantName, () => { BAL.USDT -= 42.5; if (c.cash) P.cash.pending += 42.5 * c.cashRate / 100; refreshAll(); }, 'Payment complete');
    };

    P.confirm = (title, sub, apply, doneMsg) => {
      const ov = q('.overlay'), sh = q('.sheet');
      sh.innerHTML = `<div class="fid scan">${I.face}</div><h6>${esc(title)}</h6><p>${esc(sub)}</p><button class="pbtn ghost x">Cancel</button>`;
      ov.classList.add('on');
      const t = setTimeout(() => {
        apply();
        sh.innerHTML = `<div class="fid ok">${I.check}</div><h6>${esc(doneMsg)}</h6><p>Confirmed · demo transaction</p><button class="pbtn x">Done</button>`;
        $('.x', sh).onclick = () => { ov.classList.remove('on'); P.go('home'); };
      }, 1500);
      $('.x', sh).onclick = () => { clearTimeout(t); ov.classList.remove('on'); };
    };

    const renders = { home: P.renderHome, send: P.renderSend, receive: P.renderReceive, swap: P.renderSwap, bridge: P.renderBridge, rewards: P.renderRewards, settings: P.renderSettings, pay: P.renderPay };
    P.go = (v, force) => {
      if (!renders[v]) return;
      if (v === 'pay' && !P.cfg.merchant) v = 'home';
      if (v !== 'home' || force) renders[v]();
      $$('.view', host).forEach(el => { el.classList.toggle('on', el.dataset.v === v); el.classList.toggle('back', el.dataset.v === P.view && v !== P.view); });
      $$('.tabbar button', host).forEach(b => b.classList.toggle('on', b.dataset.go === v));
      V(v).scrollTop = 0;
      P.view = v;
      if (kind === 'demo') $$('.dm').forEach(b => b.classList.toggle('active', b.dataset.go === v));
    };
    P.rerender = () => { P.renderHome(); if (P.view !== 'home') renders[P.view](); };
    P.flash = key => {
      const el = $(`.view.on [data-hl="${key}"]`, host); if (!el) return;
      el.classList.remove('hl'); void el.offsetWidth; el.classList.add('hl');
      const vw = el.closest('.view'), top = el.offsetTop - 60;
      vw.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    };
    P.setBrand = col => host.style.setProperty('--act', col);
    P.setTheme = k => { const t = THEMES[k]; if (!t) return; P.theme = k; Object.entries(t).forEach(([v, x]) => host.style.setProperty('--' + v, x)); host.dataset.theme = k; };

    host.addEventListener('click', e => {
      const g = e.target.closest('[data-go]');
      if (g) { e.preventDefault(); P.go(g.dataset.go); return; }
      const t = e.target.closest('[data-t]');
      if (t) { $$('[data-t]', host).forEach(b => b.classList.toggle('on', b === t)); $$('.tpane', host).forEach(p => p.hidden = p.dataset.p !== t.dataset.t); return; }
      if (e.target.closest('.eye')) { P.hidden = !P.hidden; q('.bv').textContent = P.hidden ? '••••••' : fiat(total()); return; }
      if (e.target.closest('[data-act=net]')) { const n = P.cfg.nets; P.net = n[(n.indexOf(P.net) + 1) % n.length]; P.renderHome(); toast(`Network: ${P.net}`); return; }
      const tk = e.target.closest('[data-tok]');
      if (tk) { P.go('send'); q('.s-tok').value = tk.dataset.tok; V('send').dispatchEvent(new Event('input')); }
    });

    P.renderHome();
    phones.push(P);
    return P;
  }
  const refreshAll = () => phones.forEach(p => p.rerender());

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2400); }

  /* ---------- init phones ---------- */
  const heroP = createPhone($('[data-phone="hero"]'), 'hero');
  const demoP = createPhone($('[data-phone="demo"]'), 'demo');
  const wlP = createPhone($('[data-phone="wl"]'), 'wl');
  [heroP, demoP].forEach(p => p.setTheme('classic'));
  wlP.setTheme('violet');

  $$('.dm').forEach(b => b.onclick = () => { demoP.go(b.dataset.go); if (innerWidth < 900) $('.demo-phone').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); });

  const segPick = (sel, fn) => $$(sel + ' button').forEach(b => b.onclick = () => { $$(sel + ' button').forEach(x => x.classList.toggle('on', x === b)); fn(b); });
  segPick('#fiatSeg', b => { state.fiat = b.dataset.fiat; refreshAll(); demoP.go('home'); });
  segPick('#cryptoSeg', b => { state.crypto = b.dataset.crypto; refreshAll(); demoP.go('home'); });

  // hero phone auto tour
  const tour = ['home', 'swap', 'bridge', 'rewards', 'home']; let ti = 0, tourOn = !reduce;
  const tourT = setInterval(() => { if (!tourOn) return clearInterval(tourT); ti = (ti + 1) % tour.length; heroP.go(tour[ti]); }, 3600);
  heroP.host.addEventListener('pointerdown', () => tourOn = false, { once: true });

  /* ---------- white-label configurator ---------- */
  (() => {
    const box = $('#wlcfg'); if (!box) return;
    const cap = $('#wlNow'), C = wlP.cfg;
    const apply = (screen, key, label) => {
      wlP.rerender();
      if (screen && wlP.view !== screen) wlP.go(screen);
      setTimeout(() => wlP.flash(key), 380);
      if (cap && label) { cap.innerHTML = `<b>Now showing:</b> ${label}`; cap.classList.remove('ping'); void cap.offsetWidth; cap.classList.add('ping'); }
    };
    $$('.wl-tabs button', box).forEach(b => b.onclick = () => {
      $$('.wl-tabs button', box).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      $$('.wl-pane', box).forEach(p => p.hidden = p.id !== b.getAttribute('aria-controls'));
    });
    $$('.thc', box).forEach(b => b.onclick = () => {
      $$('.thc', box).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      wlP.setTheme(b.dataset.theme); const col = THEMES[b.dataset.theme].act;
      $('#wlColor').value = col; $$('#swatches button').forEach(x => x.classList.toggle('on', getComputedStyle(x).getPropertyValue('--s').trim() === col));
      wlP.go('home'); apply('home', 'brand', `${$('b', b).textContent} theme`);
    });
    $$('[data-logo]', box).forEach(b => b.onclick = () => {
      $$('[data-logo]', box).forEach(x => x.classList.toggle('on', x === b)); $('#wlUpBtn').classList.remove('on');
      C.logo = b.dataset.logo; apply('home', 'brand', 'Company logo in the wallet header');
    });
    $('#wlUpload').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      if (!/^image\//.test(f.type) || f.size > 1.5e6) return toast('Please choose an image under 1.5 MB');
      const r = new FileReader();
      r.onload = () => { C.logoData = r.result; C.logo = 'upload'; $$('[data-logo]', box).forEach(x => x.classList.remove('on')); $('#wlUpBtn').classList.add('on'); apply('home', 'brand', 'Your uploaded logo in the wallet header'); };
      r.readAsDataURL(f);
    };
    $('#wlName').oninput = e => { C.name = e.target.value.trim() || 'reWallet'; apply('home', 'brand', 'App name in the wallet header'); };
    const setCol = c => { wlP.setBrand(c); $('#wlColor').value = c; apply('home', 'brand', 'Brand colour on buttons, actions and highlights'); };
    $$('#swatches button').forEach(b => b.onclick = () => { $$('#swatches button').forEach(x => x.classList.toggle('on', x === b)); setCol(getComputedStyle(b).getPropertyValue('--s').trim()); });
    $('#wlColor').oninput = e => { $$('#swatches button').forEach(x => x.classList.remove('on')); setCol(e.target.value); };
    const chipSet = (sel, key, screen, hl, label, min) => $$(sel + ' button', box).forEach(b => {
      b.classList.toggle('on', C[key].includes(b.dataset.v)); b.setAttribute('aria-pressed', b.classList.contains('on'));
      b.onclick = () => {
        const v = b.dataset.v, on = C[key].includes(v);
        if (on && C[key].length <= min) return toast(`Keep at least ${min} enabled`);
        C[key] = on ? C[key].filter(x => x !== v) : [...C[key], v];
        b.classList.toggle('on', !on); b.setAttribute('aria-pressed', !on);
        apply(screen, hl, label);
      };
    });
    const initChips = () => {
      chipSet('#wlNets', 'nets', 'settings', 'nets', 'Supported networks in Settings, network switcher and Bridge', 2);
      chipSet('#wlToks', 'tokens', 'home', 'tokens', 'Default tokens in the wallet token list', 2);
    };
    initChips();
    const radio = (sel, key, screen, hl, label) => $$(sel + ' button', box).forEach(b => b.onclick = () => {
      $$(sel + ' button', box).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
      C[key] = b.dataset.v; apply(screen, hl, label);
    });
    radio('#wlSwap', 'swap', 'swap', 'swap', 'Swap provider on the Swap screen');
    radio('#wlBridge', 'bridge', 'bridge', 'bridge', 'Bridge provider on the Bridge screen');
    const fee = $('#wlFee'), feeV = $('#wlFeeV');
    fee.oninput = () => { C.fee = +fee.value; feeV.textContent = fmt(C.fee) + '%'; apply('swap', 'fee', 'Platform fee on Swap (also applied on Send & Bridge)'); };
    const sw = (id, key, screen, hl, label, dep) => { const el = $(id); el.checked = !!C[key]; el.onchange = () => { C[key] = el.checked; if (dep) $$(dep).forEach(d => d.disabled = !el.checked); apply(el.checked || key !== 'merchant' ? screen : 'home', hl, label + (el.checked ? ' — on' : ' — off')); }; };
    sw('#wlCash', 'cash', 'rewards', 'cash', 'Cashback program on Home and Rewards', '#wlCashName,#wlCashRate');
    sw('#wlMerch', 'merchant', 'pay', 'merchant', 'Merchant “Pay” action and checkout', '#wlMerchName');
    sw('#wlKyc', 'kyc', 'home', 'kyc', 'reID verification badge on Home');
    sw('#wlScreen', 'screen', 'send', 'screen', 'Sanctions screening on Send');
    sw('#wlTravel', 'travel', 'settings', 'compliance', 'Travel Rule status in Settings');
    $('#wlCashName').oninput = e => { C.cashName = e.target.value.trim() || 'Cashback'; apply('rewards', 'cash', 'Cashback program name'); };
    const cr = $('#wlCashRate'), crV = $('#wlCashRateV');
    cr.oninput = () => { C.cashRate = +cr.value; crV.textContent = fmt(C.cashRate, 1) + '%'; apply('rewards', 'cash', 'Cashback rate on Rewards'); };
    $('#wlMerchName').oninput = e => { C.merchantName = e.target.value.trim() || 'Merchant'; apply('pay', 'merchant', 'Merchant name at checkout'); };
    $('#wlRegion').onchange = e => { C.region = e.target.value; apply('settings', 'compliance', 'Region profile in Settings'); };
    $('#wlReset').onclick = () => {
      Object.assign(C, { ...DEFAULT, nets: [...DEFAULT.nets], tokens: [...DEFAULT.tokens] }); delete C.logoData;
      wlP.setTheme('violet'); $$('.thc', box).forEach(x => { x.classList.toggle('on', x.dataset.theme === 'violet'); x.setAttribute('aria-pressed', x.dataset.theme === 'violet'); });
      $('#wlName').value = C.name; fee.value = C.fee; feeV.textContent = fmt(C.fee) + '%'; cr.value = C.cashRate; crV.textContent = fmt(C.cashRate, 1) + '%';
      $('#wlCashName').value = C.cashName; $('#wlMerchName').value = C.merchantName; $('#wlRegion').value = C.region; $('#wlUpload').value = '';
      ['#wlCash', '#wlMerch', '#wlKyc', '#wlScreen', '#wlTravel'].forEach(id => $(id).checked = true);
      $$('#wlCashName,#wlCashRate,#wlMerchName').forEach(d => d.disabled = false);
      $$('[data-logo]', box).forEach((x, i) => x.classList.toggle('on', i === 0)); $('#wlUpBtn').classList.remove('on');
      $$('#swatches button').forEach((x, i) => x.classList.toggle('on', i === 0)); $('#wlColor').value = '#7000ff';
      $$('#wlSwap button', box).forEach(x => x.classList.toggle('on', x.dataset.v === C.swap));
      $$('#wlBridge button', box).forEach(x => x.classList.toggle('on', x.dataset.v === C.bridge));
      initChips(); wlP.go('home', true); cap.innerHTML = '<b>Now showing:</b> Home screen';
    };
  })();

  /* ---------- 3D tilt + cursor glow + hero parallax ---------- */
  if (matchMedia('(hover:hover)').matches && !reduce) {
    $$('.tilt').forEach(el => {
      const par = el.parentElement;
      par.addEventListener('pointermove', e => {
        const r = par.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      par.addEventListener('pointerleave', () => el.style.transform = '');
    });
    const glow = $('.cursor-glow');
    addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });
    const hero = $('.hero');
    hero.addEventListener('pointermove', e => {
      hero.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3));
      hero.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3));
    });
  }

  /* ---------- theme ---------- */
  const root = document.documentElement, tBtn = $('#themeT'), meta = $('meta[name=theme-color]');
  const applyTheme = t => { root.dataset.theme = t; meta.content = t === 'dark' ? '#0b0716' : '#fbfaff'; tBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); };
  applyTheme(root.dataset.theme || 'light');
  tBtn.onclick = () => {
    root.classList.add('theming');
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(t); try { localStorage.setItem('rw-theme', t); } catch {}
    setTimeout(() => root.classList.remove('theming'), 400);
  };

  /* ---------- nav ---------- */
  const nav = $('#nav'), burger = $('#burger'), links = $('#links');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });
  burger.onclick = () => { const o = links.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
  $$('#links a').forEach(a => a.onclick = () => { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('#links a').forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(n => {
      const end = +n.dataset.count, suf = n.dataset.suffix || '', t0 = performance.now();
      const step = t => { const p = Math.min((t - t0) / 1200, 1); n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- network orbit ---------- */
  const orbit = $('#orbit');
  const live = [['Ethereum', '#8b7cff'], ['BSC', '#f3ba2f'], ['TRON', '#ff3b30']];
  const soon = ['Polygon', 'Avalanche', 'Arbitrum', 'Optimism', 'Base', 'Solana'];
  const orbs = [];
  live.forEach(([n, c], i) => { const d = document.createElement('div'); d.className = 'orb live'; d.style.setProperty('--c', c); d.textContent = n; orbit.appendChild(d); orbs.push({ d, r: .41, a: i / live.length * Math.PI * 2, s: .00025 }); });
  soon.forEach((n, i) => { const d = document.createElement('div'); d.className = 'orb soon'; d.textContent = n; orbit.appendChild(d); orbs.push({ d, r: .25, a: i / soon.length * Math.PI * 2, s: -.0004 }); });
  let last = performance.now(), orbVis = true;
  new IntersectionObserver(([e]) => orbVis = e.isIntersecting).observe(orbit);
  const spinOrbs = t => {
    const dt = reduce ? 0 : t - last; last = t;
    if (orbVis) { const R = orbit.clientWidth; orbs.forEach(o => { o.a += o.s * dt; o.d.style.transform = `translate(${Math.cos(o.a) * o.r * R}px,${Math.sin(o.a) * o.r * R}px)`; }); }
    requestAnimationFrame(spinOrbs);
  };
  requestAnimationFrame(spinOrbs);

  /* ---------- hero network canvas (nodes + travelling packets) ---------- */
  const cv = $('#particles');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d'); let W, H, pts = [], pk = [];
    const dark = () => root.dataset.theme === 'dark';
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: Math.max(24, Math.min(90, Math.round(W * H / 16000))) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2, r: Math.random() * 1.6 + .8 }));
    };
    size(); addEventListener('resize', size);
    let vis = true; new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(cv);
    const cols = ['0,229,255', '155,92,255', '46,229,157'];
    const draw = () => {
      if (vis) {
        const dk = dark(), links2 = []; ctx.clearRect(0, 0, W, H);
        for (const p of pts) { p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H; }
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 150) { links2.push([a, b]); ctx.strokeStyle = `rgba(${dk ? '155,92,255' : '112,0,255'},${(1 - d / 150) * (dk ? .25 : .14)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.fillStyle = dk ? 'rgba(201,176,255,.75)' : 'rgba(112,0,255,.45)';
        for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill(); }
        if (links2.length && pk.length < 16 && Math.random() < .14) { const [a, b] = links2[(Math.random() * links2.length) | 0]; pk.push({ a, b, t: 0, c: cols[(Math.random() * 3) | 0], s: .008 + Math.random() * .012 }); }
        pk = pk.filter(k => (k.t += k.s) < 1);
        for (const k of pk) {
          const x = k.a.x + (k.b.x - k.a.x) * k.t, y = k.a.y + (k.b.y - k.a.y) * k.t;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 10); g.addColorStop(0, `rgba(${k.c},.95)`); g.addColorStop(1, `rgba(${k.c},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 10, 0, 6.3); ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- mock bridge section ---------- */
  (() => {
    const xb = $('#xb'); if (!xb) return;
    const XBAL = { USDT: 1250, USDC: 640, ETH: 0.85, BNB: 3.2 };
    const F = $('#xbFrom'), T = $('#xbTo'), A = $('#xbAmt'), K = $('#xbTok'), go = $('#xbGo');
    let busy = false;
    const upd = () => {
      const f = F.value, t = T.value, a = +A.value || 0, k = K.value;
      $$('[data-ic=from]', xb).forEach(i => i.src = NETS[f].img);
      $$('[data-ic=to]', xb).forEach(i => i.src = NETS[t].img);
      $('#xbL1').textContent = f; $('#xbL2').textContent = t;
      $('#xbRoute').textContent = routeTxt(f, t);
      $('#xbHub').textContent = isHop(f, t) ? 'Multi-hop route' : 'Direct route';
      $('#xbBal').textContent = `${fmt(XBAL[k], k === 'ETH' || k === 'BNB' ? 4 : 2)} ${k}`;
      $('#xbRcv').textContent = `${fmt(a * .999, a < 10 ? 4 : 2)} ${k}`;
      $('#xbFee').textContent = `0.1% (${fmt(a * .001, 4)} ${k})`;
      $('#xbGas').textContent = '≈ $' + fmt(routeGas(f, t), 3);
      $('#xbEta').textContent = eta(routeEta(f, t));
      const bad = f === t ? 'Choose different networks' : !a ? 'Enter an amount' : a > XBAL[k] ? 'Insufficient balance' : '';
      if (!busy) { go.disabled = !!bad; go.firstChild.textContent = bad || `Bridge ${k} to ${t} `; }
    };
    [F, T, A, K].forEach(e => e.addEventListener('input', upd));
    $('#xbSwap').onclick = () => { const v = F.value; F.value = T.value; T.value = v; upd(); };
    go.onclick = () => {
      if (busy) return; busy = true; go.disabled = true; go.firstChild.textContent = 'Bridging… ';
      const li = $$('#xbSteps li'); li.forEach(l => l.className = ''); $$('.xb-node', xb).forEach(n => n.classList.remove('lit'));
      xb.classList.add('run'); $('#xbN1').classList.add('lit');
      let i = 0;
      const next = () => {
        if (i) li[i - 1].className = 'ok';
        if (i === li.length) { xb.classList.remove('run'); $('#xbN2').classList.add('lit'); const a = +A.value, k = K.value; XBAL[k] -= a; busy = false; toast(`Bridged ${fmt(a * .999, 2)} ${k} to ${T.value} · demo`); upd(); return; }
        li[i].className = 'act'; i++; setTimeout(next, 1100);
      };
      next();
    };
    upd();
  })();

  /* ---------- contact form ---------- */
  // Set CONTACT_ENDPOINT to a form backend (e.g. Formspree/your API) to POST JSON.
  // If empty, the form opens the visitor's email client addressed to CONTACT_EMAIL.
  const CONTACT_ENDPOINT = '';
  const CONTACT_EMAIL = 'info@rewallet.online';
  const form = $('#contactForm'), msg = $('#formMsg');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    ['fName', 'fEmail', 'fMsg'].forEach(id => {
      const el = $('#' + id), bad = !el.value.trim() || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      el.parentElement.classList.toggle('err', bad); if (bad) ok = false;
    });
    if (!$('#fConsent').checked) ok = false;
    if (!ok) { msg.className = 'form-msg bad'; msg.textContent = 'Please complete the required fields and consent box.'; return; }
    const data = Object.fromEntries(new FormData(form));
    const btn = $('button[type=submit]', form); btn.disabled = true;
    try {
      if (CONTACT_ENDPOINT) {
        const r = await fetch(CONTACT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error();
        msg.className = 'form-msg ok'; msg.textContent = 'Thanks! Your message has been sent — we\'ll be in touch shortly.'; form.reset();
      } else {
        const body = `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '-'}\nPhone: ${data.phone || '-'}\nType: ${data.type}\n\n${data.message}`;
        location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('reWallet — ' + data.type)}&body=${encodeURIComponent(body)}`;
        msg.className = 'form-msg ok'; msg.textContent = 'Opening your email app to send the message…';
      }
    } catch { msg.className = 'form-msg bad'; msg.textContent = 'Something went wrong. Please try again.'; }
    btn.disabled = false;
  });
  $$('#contactForm input, #contactForm textarea').forEach(el => el.addEventListener('input', () => el.parentElement.classList.remove('err')));

  /* ---------- security showcase ---------- */
  (() => {
    const sec = $('#security'); if (!sec) return;
    const items = $$('.sx-i', sec), scenes = $$('.sx-scene', sec), title = $('#sxTitle');
    const titles = ['Biometric approval', 'Recovery phrase & PIN', 'On-device encryption', 'Transaction preview', 'Risk detection'];
    const DUR = 4500; let cur = 0, timer, sub = [], inView = false, paused = false;
    const clearSub = () => { sub.forEach(clearTimeout); sub.forEach(clearInterval); sub = []; };
    const words = ['orbit', 'lunar', 'cedar', 'prism', 'delta', 'ember', 'nova', 'atlas', 'quartz', 'harbor', 'velvet', 'summit'];
    const hex = () => Array.from({ length: 64 }, () => '0123456789abcdef'[(Math.random() * 16) | 0]).join('');
    const run = i => {
      const sc = scenes[i];
      if (i === 0) {
        const f = $('.fx-face', sc); f.classList.remove('ok'); sc.classList.remove('ok-state');
        sub.push(setTimeout(() => { f.classList.add('ok'); sc.classList.add('ok-state'); }, 1900));
      }
      if (i === 1) {
        const g = $('#seedg'); g.innerHTML = words.map((w, k) => `<span class="hid"><em>${k + 1}</em>${w}</span>`).join('');
        const sp = $$('span', g), pins = $$('.pin i', sc); pins.forEach(p => p.classList.remove('f'));
        sp.forEach((s, k) => sub.push(setTimeout(() => { s.classList.remove('hid'); s.classList.add('rev'); }, 150 + k * 150)));
        sub.push(setTimeout(() => sp.forEach(s => s.classList.add('hid')), 2600));
        pins.forEach((p, k) => sub.push(setTimeout(() => p.classList.add('f'), 2800 + k * 180)));
      }
      if (i === 2) {
        const c = $('#cipher'), k = $('#encKey'); c.textContent = '';
        sub.push(setInterval(() => { c.textContent = (hex() + hex() + '\n' + c.textContent).slice(0, 900); k.textContent = '0x' + hex().slice(0, 4) + '…' + hex().slice(0, 4); }, 140));
      }
      if (i === 3) {
        const rs = $$('.txv-r', sc), go = $('.txv-go', sc); rs.forEach(r => r.className = 'txv-r'); go.classList.remove('ok'); go.textContent = 'Verifying…';
        rs.forEach((r, k) => { sub.push(setTimeout(() => r.classList.add('cur'), 200 + k * 600)); sub.push(setTimeout(() => { r.classList.remove('cur'); r.classList.add('ok'); }, 700 + k * 600)); });
        sub.push(setTimeout(() => { go.classList.add('ok'); go.textContent = 'Ready to sign · Face ID'; }, 700 + rs.length * 600));
      }
    };
    const show = i => {
      cur = i; clearSub();
      items.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
      scenes.forEach((s, k) => s.classList.toggle('on', k === i));
      title.textContent = titles[i]; run(i);
      items[i].querySelector('.bar').style.animation = 'none'; void items[i].offsetWidth; items[i].querySelector('.bar').style.animation = '';
      clearTimeout(timer); if (!reduce && !paused) timer = setTimeout(() => inView && show((cur + 1) % items.length), DUR);
    };
    items.forEach((b, k) => b.onclick = () => { paused = true; sec.classList.add('paused'); show(k); });
    sec.style.setProperty('--sxd', DUR + 'ms');
    new IntersectionObserver(([e]) => { const was = inView; inView = e.isIntersecting; if (inView && !was) show(cur); if (!inView) { clearTimeout(timer); clearSub(); } }, { threshold: .3 }).observe(sec);
    show(0);
  })();

  /* ---------- explainer "video" player — narrated (voice-over + ambient music) ---------- */
  (() => {
    const vp = $('#vp'); if (!vp) return;
    const scenes = $$('.vs', vp), N = scenes.length;
    const VO = [
      'Every business that wants its own crypto wallet hits the same wall. Key management, multi-chain support, swaps, bridges, security audits, and apps for every platform. Built in-house, that is twelve months or more of engineering — and the maintenance never ends.',
      'reWallet changes that. It is a production-ready, decentralized wallet that you brand as your own, and deploy to iOS, Android, web and browser extension, in one go.',
      'The first benefit is time. Instead of a year-long build, you go live in days, and start serving your users immediately.',
      'The second is your team. There is no wallet engineering team to hire, train or retain. Your developers stay focused on your core product.',
      'Third, future updates. New chains, new features and security patches are developed and pushed by us, so your wallet keeps improving without extra work on your side.',
      'Need something specific? Request a new network, or bring your own dApps into the in-wallet browser, and our team will add them for you.',
      'Behind the scenes, we run the complete architecture and tech stack. The apps, the wallet engine, security, nodes, R P C and monitoring. Enterprise grade, and fully managed.',
      'Everything is ready to deploy, at a single time. reWallet. One wallet, every network, complete control. Let us launch yours.',
    ];
    const CAP = VO.map(s => s.replace('R P C', 'RPC').replace('Let us', "Let's").replace(/\bIt is\b/g, "It's").replace(/\bthat is\b/g, "that's").replace(/\bThere is\b/g, "There's"));
    const chNames = ['The problem', 'The solution', 'Time saving', 'Developer saving', 'Future updates', 'Special requests', 'Fully managed', 'Deploy'];
    const DUR = VO.map(s => Math.max(6500, s.split(/\s+/).length / 2.45 * 1000 + 900)); // ~147 wpm
    const TOTAL = DUR.reduce((a, b) => a + b, 0);
    const seg = $('#vpSeg'), ch = $('#vpCh'), cap = $('#vpCap'), time = $('#vpTime'), sndBtn = $('#vpSnd'), chip = $('#vpChip');
    seg.innerHTML = scenes.map((_, i) => `<button aria-label="Chapter ${i + 1}: ${chNames[i]}" style="flex:${DUR[i]}"><i></i></button>`).join('');
    ch.innerHTML = chNames.map((n, i) => `<button>${i + 1}. ${n}</button>`).join('');
    const bars = $$('i', seg);
    let idx = 0, t = 0, playing = false, last = 0, raf, sound = false, spokeDone = false;
    const mm = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const before = i => DUR.slice(0, i).reduce((a, b) => a + b, 0);

    /* ---- voice (Web Speech API, best available natural voice) ---- */
    const synth = window.speechSynthesis; let voice = null;
    const pickVoice = () => {
      const vs = synth ? synth.getVoices().filter(v => /^en(-|_)/i.test(v.lang)) : [];
      const pref = [/Natural/i, /Neural/i, /Premium|Enhanced/i, /Google US English/i, /Google UK English Female/i, /Samantha|Ava|Allison|Serena|Daniel|Karen/i, /Microsoft (Aria|Jenny|Guy|Libby|Sonia)/i];
      for (const r of pref) { const v = vs.find(x => r.test(x.name)); if (v) return v; }
      return vs.find(v => /en-US/i.test(v.lang)) || vs[0] || null;
    };
    if (synth) { voice = pickVoice(); synth.onvoiceschanged = () => { voice = pickVoice(); }; }
    const speak = i => {
      if (!synth || !sound) return; synth.cancel(); spokeDone = false;
      const parts = VO[i].match(/[^.!?]+[.!?]+/g) || [VO[i]];
      parts.forEach((s, k) => {
        const u = new SpeechSynthesisUtterance(s.trim()); if (voice) u.voice = voice; u.lang = voice?.lang || 'en-US';
        u.rate = .98; u.pitch = 1; u.volume = 1;
        u.onstart = () => music.duck(true);
        if (k === parts.length - 1) u.onend = () => { spokeDone = true; music.duck(false); };
        synth.speak(u);
      });
    };

    /* ---- ambient music (Web Audio, generated — no files) ---- */
    const music = (() => {
      let ac, master, on = false, timer;
      const chords = [[261.63, 329.63, 392, 493.88], [220, 261.63, 329.63, 392], [174.61, 220, 261.63, 329.63], [196, 246.94, 293.66, 392]];
      let ci = 0;
      const pad = (f, t0, d) => {
        const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter();
        o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = f / 2; o2.frequency.value = f * 1.003;
        lp.type = 'lowpass'; lp.frequency.value = 900;
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.06, t0 + 1.6); g.gain.linearRampToValueAtTime(.045, t0 + d - 1.2); g.gain.linearRampToValueAtTime(0, t0 + d + .4);
        o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(master); o.start(t0); o2.start(t0); o.stop(t0 + d + .5); o2.stop(t0 + d + .5);
      };
      const pluck = (f, t0) => {
        const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f * 2;
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.035, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + 1.6);
        o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + 1.7);
      };
      const bar = () => {
        const t0 = ac.currentTime + .05, d = 4, c = chords[ci++ % chords.length];
        c.forEach(f => pad(f, t0, d));
        [0, 1, 2, 3, 2, 1].forEach((k, n) => pluck(c[k], t0 + n * .66));
      };
      return {
        start() {
          if (on) return; on = true;
          ac = ac || new (window.AudioContext || window.webkitAudioContext)();
          if (!master) { master = ac.createGain(); const comp = ac.createDynamicsCompressor(); const dl = ac.createDelay(); const fb = ac.createGain(); dl.delayTime.value = .33; fb.gain.value = .3; master.connect(comp); master.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(comp); comp.connect(ac.destination); }
          ac.resume(); master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(0, ac.currentTime); master.gain.linearRampToValueAtTime(.8, ac.currentTime + 1.5);
          bar(); timer = setInterval(bar, 4000);
        },
        stop() { if (!on) return; on = false; clearInterval(timer); master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(master.gain.value, ac.currentTime); master.gain.linearRampToValueAtTime(0, ac.currentTime + .6); },
        duck(d) { if (!on || !master) return; master.gain.cancelScheduledValues(ac.currentTime); master.gain.setTargetAtTime(d ? .45 : .8, ac.currentTime, .3); },
      };
    })();

    const setSound = v => {
      sound = v; sndBtn.setAttribute('aria-pressed', v); sndBtn.setAttribute('aria-label', v ? 'Mute' : 'Turn sound on');
      vp.classList.toggle('sound', v); chip.hidden = v || !vp.classList.contains('started');
      if (v && playing) { music.start(); speak(idx); } else { music.stop(); synth?.cancel(); }
    };

    const counters = sc => $$('[data-to]', sc).forEach(el => {
      const to = +el.dataset.to, suf = el.dataset.suf || '', dur = to === 100 ? 3400 : 2200, t0 = performance.now();
      const st = n => { const p = Math.min((n - t0) / dur, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1 && scenes[idx] === sc) requestAnimationFrame(st); };
      requestAnimationFrame(st);
    });
    const show = i => {
      idx = (i + N) % N; t = 0; spokeDone = false;
      scenes.forEach((s, k) => { s.classList.remove('on'); if (k === idx) { void s.offsetWidth; s.classList.add('on'); } });
      $$('button', ch).forEach((b, k) => b.classList.toggle('on', k === idx));
      bars.forEach((b, k) => b.style.width = k < idx ? '100%' : '0');
      cap.textContent = CAP[idx];
      if (vp.classList.contains('started')) { counters(scenes[idx]); if (playing) speak(idx); }
    };
    const tick = n => {
      if (!playing) return;
      t += n - last; last = n;
      const D = DUR[idx];
      bars[idx].style.width = Math.min(t / D * 100, 100) + '%';
      time.textContent = `${mm((before(idx) + Math.min(t, D)) / 1000)} / ${mm(TOTAL / 1000)}`;
      const speaking = sound && synth && synth.speaking && !spokeDone;
      if (t >= D && !speaking) { if (idx === N - 1) { pause(true); bars[idx].style.width = '100%'; return; } show(idx + 1); }
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      const fresh = !vp.classList.contains('started');
      vp.classList.add('started');
      if (idx === N - 1 && t >= DUR[N - 1]) { t = 0; idx = 0; }
      playing = true; vp.classList.add('playing'); $('#vpPlay').setAttribute('aria-label', 'Pause');
      if (fresh) show(idx); else if (sound) { if (synth?.paused) synth.resume(); else speak(idx); }
      if (sound) music.start();
      chip.hidden = sound;
      last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    };
    const pause = ended => { playing = false; vp.classList.remove('playing'); $('#vpPlay').setAttribute('aria-label', 'Play'); cancelAnimationFrame(raf); synth?.cancel(); music.stop(); if (ended) chip.hidden = true; };
    // Big play = user gesture → start with sound
    $('#vpBig').onclick = () => { setSound(true); play(); };
    chip.onclick = e => { e.stopPropagation(); setSound(true); if (!playing) play(); };
    sndBtn.onclick = () => setSound(!sound);
    $('#vpPlay').onclick = () => playing ? pause() : play();
    $('.vp-screen', vp).addEventListener('click', e => { if (!e.target.closest('a,.vp-big,.vp-snd-chip') && vp.classList.contains('started')) playing ? pause() : play(); });
    const jump = k => { vp.classList.add('started'); playing = true; vp.classList.add('playing'); show(k); if (sound) music.start(); last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    $$('button', seg).forEach((b, k) => b.onclick = () => jump(k));
    $$('button', ch).forEach((b, k) => b.onclick = () => jump(k));
    $('#vpFs').onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else vp.requestFullscreen?.(); };
    vp.addEventListener('keydown', e => { if (e.key === ' ' && e.target === vp) { e.preventDefault(); playing ? pause() : play(); } });
    show(0); time.textContent = `0:00 / ${mm(TOTAL / 1000)}`;
    // silent preview when scrolled into view; sound needs a tap (browser autoplay rules)
    let auto = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !auto && !reduce) { auto = true; play(); }
      if (!e.isIntersecting && playing) pause();
    }, { threshold: .6 }).observe(vp);
    addEventListener('pagehide', () => synth?.cancel());
  })();

  /* ---------- hero globe (multi-chain arcs) ---------- */
  (() => {
    const cv = $('#globe'); if (!cv) return;
    const ctx = cv.getContext('2d'); let S, R, dpr;
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); S = cv.clientWidth; R = S * .44; cv.width = S * dpr; cv.height = S * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener('resize', size);
    const P = []; const n = 900, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i; P.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    const sph = (lat, lon) => { const a = lat * Math.PI / 180, b = lon * Math.PI / 180; return [Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)]; };
    const HUB = [['Ethereum', '#627eea', 40, -30], ['BNB Chain', '#f3ba2f', 22, 70], ['TRON', '#ff3b30', -10, 120], ['Arbitrum', '#28a0f0', 50, 20], ['Optimism', '#ff0420', 5, -80], ['Base', '#0052ff', -30, 10], ['Polygon', '#8247e5', -35, -60], ['Avalanche', '#e84142', 15, 170], ['Solana', '#14f195', -45, 140]].map(([n, c, la, lo]) => ({ n, c, p: sph(la, lo) }));
    let arcs = [], rot = 0;
    const tilt = -.35, ct = Math.cos(tilt), st = Math.sin(tilt);
    const proj = ([x, y, z]) => { const cr = Math.cos(rot), sr = Math.sin(rot); let X = x * cr - z * sr, Z = x * sr + z * cr; let Y = y * ct - Z * st; Z = y * st + Z * ct; return [S / 2 + X * R, S / 2 - Y * R, Z]; };
    const slerp = (a, b, t, lift) => { const d = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) || 1e-6, s1 = Math.sin((1 - t) * d) / Math.sin(d), s2 = Math.sin(t * d) / Math.sin(d), h = 1 + lift * Math.sin(Math.PI * t); return [(a[0] * s1 + b[0] * s2) * h, (a[1] * s1 + b[1] * s2) * h, (a[2] * s1 + b[2] * s2) * h]; };
    let vis = true; new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(cv);
    const dark = () => document.documentElement.dataset.theme === 'dark';
    const draw = () => {
      if (vis) {
        const dk = dark(); ctx.clearRect(0, 0, S, S); rot += reduce ? 0 : .0022;
        const g = ctx.createRadialGradient(S / 2, S / 2, R * .2, S / 2, S / 2, R * 1.25);
        g.addColorStop(0, dk ? 'rgba(112,0,255,.18)' : 'rgba(112,0,255,.08)'); g.addColorStop(1, 'rgba(112,0,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(S / 2, S / 2, R * 1.25, 0, 6.3); ctx.fill();
        ctx.strokeStyle = dk ? 'rgba(201,176,255,.25)' : 'rgba(112,0,255,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(S / 2, S / 2, R, 0, 6.3); ctx.stroke();
        for (const p of P) { const [x, y, z] = proj(p); if (z < -.15) continue; const a = (z + .15) / 1.15; ctx.fillStyle = dk ? `rgba(201,176,255,${a * .7})` : `rgba(112,0,255,${a * .6})`; ctx.fillRect(x - 1.1, y - 1.1, 2.2, 2.2); }
        if (arcs.length < 5 && Math.random() < .03) { const a = HUB[(Math.random() * HUB.length) | 0]; let b = a; while (b === a) b = HUB[(Math.random() * HUB.length) | 0]; arcs.push({ a, b, t: 0 }); }
        arcs = arcs.filter(r => (r.t += .006) < 1.6);
        for (const r of arcs) {
          ctx.beginPath(); let first = true;
          for (let k = 0; k <= 40; k++) { const q = k / 40; if (q > r.t) break; const [x, y, z] = proj(slerp(r.a.p, r.b.p, q, .35)); if (z < -.2) { first = true; continue; } first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false; }
          const fade = r.t > 1 ? 1 - (r.t - 1) / .6 : 1;
          ctx.strokeStyle = `rgba(0,200,255,${.7 * fade})`; ctx.lineWidth = 1.6; ctx.stroke();
          if (r.t <= 1) { const [x, y, z] = proj(slerp(r.a.p, r.b.p, r.t, .35)); if (z > -.2) { const gg = ctx.createRadialGradient(x, y, 0, x, y, 9); gg.addColorStop(0, 'rgba(0,229,255,1)'); gg.addColorStop(1, 'rgba(0,229,255,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.3); ctx.fill(); } }
        }
        ctx.font = '600 11px "IBM Plex Sans",sans-serif'; ctx.textAlign = 'left';
        for (const h of HUB) { const [x, y, z] = proj(h.p); if (z < 0) continue; const a = Math.min(1, z * 1.6);
          ctx.globalAlpha = a; ctx.fillStyle = h.c; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.3); ctx.fill();
          ctx.strokeStyle = h.c; ctx.globalAlpha = a * .35; ctx.beginPath(); ctx.arc(x, y, 9 + Math.sin(performance.now() / 300 + x) * 2, 0, 6.3); ctx.stroke();
          ctx.globalAlpha = a; ctx.fillStyle = dk ? '#e9e2ff' : '#2b1d52'; ctx.fillText(h.n, x + 10, y + 4); ctx.globalAlpha = 1; }
      }
      requestAnimationFrame(draw);
    };
    draw();
  })();

  /* ---------- live blocks ticker ---------- */
  (() => {
    const tr = $('.btrack'); if (!tr || reduce) return;
    const C = [['Ethereum', '#627eea', 21458210], ['BNB Chain', '#f3ba2f', 44102331], ['TRON', '#ff3b30', 66901204], ['Arbitrum', '#28a0f0', 268110445], ['Base', '#0052ff', 22003918], ['Optimism', '#ff0420', 128440211]];
    let x = 0, k = 0;
    const add = () => { const c = C[k++ % C.length]; c[2] += 1 + ((Math.random() * 3) | 0); const d = document.createElement('div'); d.className = 'blk'; d.style.setProperty('--c', c[1]); d.innerHTML = `<b><i></i>${c[0]} #${c[2].toLocaleString('en-US')}</b>`; tr.appendChild(d); if (tr.children.length > 16) { x += tr.firstChild.offsetWidth; tr.firstChild.remove(); } };
    for (let i = 0; i < 10; i++) add();
    let off = 0, lt = performance.now();
    const mv = n => { off += (n - lt) * .03; lt = n; tr.style.transform = `translateX(${-(off) + x}px)`; if (tr.scrollWidth + x - off < tr.parentElement.clientWidth + 200) add(); requestAnimationFrame(mv); };
    requestAnimationFrame(mv);
  })();

  $('#yr').textContent = new Date().getFullYear();
})();
