/* reWallet website — interactions & live app mock (demo data only) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- demo data ---------- */
  const USD = { INFRA: 0.05, USDT: 1, USDC: 1, ETH: 3200, BNB: 600, TRX: 0.16 };
  const FIAT = { USD: [1, '$'], EUR: [0.92, '€'], GBP: [0.79, '£'], INR: [83.5, '₹'], SAR: [3.75, 'SAR'] };
  const TOK = {
    INFRA: { bal: 12000, net: 'INFRA Network', col: '#f1e9ff', ic: 'assets/icon.png', chg: 5.1 },
    USDT: { bal: 320, net: 'TRC20', col: '#26a17b', ic: 'assets/usdt.png', chg: 0.01 },
    USDC: { bal: 50, net: 'ERC20', col: '#2775ca', chg: 0 },
    ETH: { bal: 0.12, net: 'Ethereum', col: '#627eea', chg: 2.4 },
    BNB: { bal: 0.5, net: 'BSC', col: '#f3ba2f', ic: 'assets/bnb.png', chg: -0.8 },
    TRX: { bal: 900, net: 'TRON', col: '#ff3b30', ic: 'assets/tron.png', chg: 1.2 },
  };
  const state = { fiat: 'USD', crypto: 'USDT' };
  const phones = [];

  const fmt = (n, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fiatOf = usd => { const [r, s] = FIAT[state.fiat]; return (s.length > 1 ? s + ' ' : s) + fmt(usd * r); };
  const totalUSD = () => Object.entries(TOK).reduce((a, [k, t]) => a + t.bal * USD[k], 0);
  const icon = k => TOK[k].ic ? `<img src="${TOK[k].ic}" alt="">` : k.slice(0, 1);
  const tokOpts = sel => Object.keys(TOK).map(k => `<option ${k === sel ? 'selected' : ''}>${k}</option>`).join('');

  const svg = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 4v14M3 14l4 4 4-4M17 20V6M13 10l4-4 4 4"/></svg>',
    bridge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 17h20M5 17V9M19 17V9M2 9c5-6 15-6 20 0M12 17v-6"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8S10 3 7.5 4 9 8 12 8zm0 0s2-5 4.5-4S15 8 12 8z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.8-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11h.1a2 2 0 1 1 0 4z"/></svg>',
  };

  /* ---------- phone factory ---------- */
  function createPhone(host, kind) {
    const P = { host, kind, view: 'home', brand: '#7000ff', name: 'reWallet', slip: 0.5, cash: { pending: 62, available: 184, claimed: 1427.5 } };
    host.innerHTML = `
      <div class="screen">
        <div class="notch"></div>
        <div class="sbar"><span>9:41</span><i>●●● ᯤ ▮</i></div>
        <div class="views">
          <section class="view on" data-v="home"></section>
          <section class="view" data-v="send"></section>
          <section class="view" data-v="receive"></section>
          <section class="view" data-v="swap"></section>
          <section class="view" data-v="bridge"></section>
          <section class="view" data-v="rewards"></section>
          <section class="view" data-v="settings"></section>
        </div>
        <nav class="tabbar">
          <button data-go="home" class="on">${svg.home}Wallet</button>
          <button data-go="swap">${svg.swap}Swap</button>
          <button data-go="bridge">${svg.bridge}Bridge</button>
          <button data-go="rewards">${svg.gift}Rewards</button>
          <button data-go="settings">${svg.gear}Settings</button>
        </nav>
        <div class="overlay"><div class="sheet"></div></div>
      </div>`;
    const V = n => $(`[data-v="${n}"]`, host);
    const back = '<button data-go="home" aria-label="Back">←</button>';

    P.renderHome = () => {
      const tot = totalUSD();
      const cr = state.crypto;
      V('home').innerHTML = `
        <div class="top">
          ${kind === 'wl' ? `<div class="wl-logo"><i></i><span class="wl-n">${esc(P.name)}</span></div>` : `<div class="net-sel"><i></i>INFRA Network ▾</div>`}
          <div class="acct">Account 1 ▾<br><b>0x7325…5fCd</b></div>
        </div>
        <div class="bal"><small>Total balance</small>
          <h5><span class="bv">${fiatOf(tot)}</span><button class="eye" aria-label="Hide balance">◉</button></h5>
          <div class="sub">≈ ${fmt(tot / USD[cr])} ${cr}</div>
          <span class="chg">▲ 1.84% today</span>
        </div>
        <div class="acts">
          <button data-go="send"><span>↑</span>Send</button>
          <button data-go="receive"><span>↓</span>Receive</button>
          <button data-go="swap"><span>⇄</span>Swap</button>
          <button data-go="bridge"><span>⛓</span>Bridge</button>
        </div>
        <div class="cashback-banner" data-go="rewards"><div>reID Cashback available<b>${fmt(P.cash.available)} INFRA</b></div><span>Claim →</span></div>
        <div class="seg-t"><button class="on" data-t="tokens">Tokens</button><button data-t="nfts">NFTs</button></div>
        <div class="tlist">${Object.entries(TOK).map(([k, t]) => `
          <div class="tok" data-tok="${k}">
            <div class="ic" style="background:${t.col}">${icon(k)}</div>
            <div class="nm"><b>${k}</b><span>${fmt(t.bal, t.bal < 1 ? 4 : 2)} ${k} · ${t.net}</span></div>
            <div class="vl"><b>${fiatOf(t.bal * USD[k])}</b><span style="color:${t.chg > 0 ? '#109c5c' : t.chg < 0 ? '#e2462b' : '#7d7795'}">${t.chg > 0 ? '+' : ''}${t.chg}%</span></div>
          </div>`).join('')}
          <div class="imp">Don't see your token? <a href="#" data-go="settings">Import tokens</a></div>
        </div>
        <div class="nfts" hidden>
          <div><img src="assets/nft.jpg" alt=""><p>Genesis Pillar #12</p></div>
          <div><i style="background:linear-gradient(135deg,#7000ff,#00e5ff)"></i><p>INFRA Pass #08</p></div>
          <div><i style="background:linear-gradient(135deg,#ff5a1f,#ffd36e)"></i><p>Desert Dune #221</p></div>
          <div><i style="background:linear-gradient(135deg,#0a66ff,#c9b0ff)"></i><p>reID Badge</p></div>
        </div>`;
    };

    P.renderSend = () => {
      V('send').innerHTML = `
        <div class="hdr">${back}<h6>Send</h6></div>
        <div class="box"><label>Recipient</label><input class="s-to" placeholder="0x… or ENS / reID handle" value="0x9a1F…c42B"></div>
        <div class="box"><label>Amount</label>
          <div class="amt-row"><input class="s-amt" type="number" min="0" step="any" value="25"><span class="tsel"><select class="s-tok">${tokOpts('INFRA')}</select>▾</span></div>
          <div class="mini"><span class="s-bal"></span><span><button class="s-max">MAX</button></span></div>
        </div>
        <div class="kv"><div><span>Network</span><b class="s-net"></b></div><div><span>Network fee</span><b>~0.001 INFRA</b></div><div><span>Fiat value</span><b class="s-fv"></b></div></div>
        <button class="pbtn s-go">Review &amp; Send</button>`;
      const upd = () => {
        const k = $('.s-tok', host).value, a = +$('.s-amt', host).value || 0;
        $('.s-bal', host).textContent = `Balance: ${fmt(TOK[k].bal, 4)} ${k}`;
        $('.s-net', host).textContent = TOK[k].net;
        $('.s-fv', host).textContent = fiatOf(a * USD[k]);
        $('.s-go', host).disabled = a <= 0 || a > TOK[k].bal;
        $('.s-go', host).textContent = a > TOK[k].bal ? 'Insufficient balance' : 'Review & Send';
      };
      V('send').addEventListener('input', upd);
      $('.s-max', host).onclick = () => { $('.s-amt', host).value = TOK[$('.s-tok', host).value].bal; upd(); };
      $('.s-go', host).onclick = () => {
        const k = $('.s-tok', host).value, a = +$('.s-amt', host).value;
        P.confirm(`Send ${fmt(a, 4)} ${k}`, 'Confirm with Face ID', () => { TOK[k].bal -= a; P.refresh(); }, `Sent ${fmt(a, 4)} ${k}`);
      };
      upd();
    };

    P.renderReceive = () => {
      V('receive').innerHTML = `
        <div class="hdr">${back}<h6>Receive</h6></div>
        <div class="qr-box"><img src="assets/qr.png" alt="Wallet QR"><div class="addr">0x7325b1E9a04F7d2C83aA61f0E4b9D1c55E2d5fCd</div>
          <button class="pbtn ghost r-copy">Copy address</button></div>
        <p style="font-size:11px;color:#7d7795;text-align:center;margin-top:10px">Only send INFRA, Ethereum and BSC (EVM) assets to this address. TRON uses a separate address.</p>`;
      $('.r-copy', host).onclick = () => { navigator.clipboard?.writeText('0x7325b1E9a04F7d2C83aA61f0E4b9D1c55E2d5fCd').catch(() => {}); toast('Address copied'); };
    };

    P.renderSwap = () => {
      V('swap').innerHTML = `
        <div class="hdr">${back}<h6>Swap</h6></div>
        <div class="box"><label>You pay</label>
          <div class="amt-row"><input class="w-in" type="number" min="0" step="any" value="20"><span class="tsel"><select class="w-a">${tokOpts('INFRA')}</select>▾</span></div>
          <div class="mini"><span class="w-bal"></span><span><button data-p=".5">50%</button><button data-p="1">Max</button></span></div></div>
        <button class="flip" aria-label="Flip tokens">⇅</button>
        <div class="box"><label>You receive</label>
          <div class="amt-row"><input class="w-out" readonly><span class="tsel"><select class="w-b">${tokOpts('USDT')}</select>▾</span></div>
          <div class="mini"><span class="w-bal2"></span></div></div>
        <div class="kv">
          <div><span>Provider</span><b>INFRA DEX</b></div>
          <div><span>Price</span><b class="w-rate"></b></div>
          <div><span>Fees</span><b>0.3% + gas</b></div>
          <div><span>Price impact</span><b class="w-imp"></b></div>
          <div><span>Min. received</span><b class="w-min"></b></div>
          <div><span>Est. arrival</span><b>~3 sec</b></div>
        </div>
        <div style="font-size:10px;color:#7d7795">Slippage tolerance</div>
        <div class="slip"><button data-s=".1">0.1%</button><button data-s=".5" class="on">0.5%</button><button data-s="1">1%</button><button data-s="3">3%</button></div>
        <button class="pbtn w-go" style="margin-top:12px">Swap</button>`;
      const upd = () => {
        const a = $('.w-a', host).value, b = $('.w-b', host).value, x = +$('.w-in', host).value || 0;
        const rate = USD[a] / USD[b], imp = Math.min(x * USD[a] / 50000 * 100, 9.9), out = x * rate * (1 - .003) * (1 - imp / 100);
        $('.w-out', host).value = out ? fmt(out, out < 1 ? 6 : 4) : '0';
        $('.w-rate', host).textContent = `1 ${a} = ${fmt(rate, rate < 1 ? 6 : 4)} ${b}`;
        $('.w-imp', host).textContent = fmt(imp) + '%'; $('.w-imp', host).className = 'w-imp' + (imp > 3 ? ' warn' : '');
        $('.w-min', host).textContent = `${fmt(out * (1 - P.slip / 100), out < 1 ? 6 : 4)} ${b}`;
        $('.w-bal', host).textContent = `Balance: ${fmt(TOK[a].bal, 4)}`;
        $('.w-bal2', host).textContent = `Balance: ${fmt(TOK[b].bal, 4)}`;
        const g = $('.w-go', host);
        g.disabled = !x || x > TOK[a].bal || a === b;
        g.textContent = a === b ? 'Select different tokens' : x > TOK[a].bal ? 'Insufficient balance' : `Swap ${a} → ${b}`;
        P._sw = { a, b, x, out };
      };
      V('swap').addEventListener('input', upd);
      V('swap').addEventListener('change', upd);
      $$('[data-p]', V('swap')).forEach(btn => btn.onclick = () => { $('.w-in', host).value = +(TOK[$('.w-a', host).value].bal * +btn.dataset.p).toFixed(4); upd(); });
      $$('[data-s]', V('swap')).forEach(btn => btn.onclick = () => { $$('[data-s]', V('swap')).forEach(z => z.classList.remove('on')); btn.classList.add('on'); P.slip = +btn.dataset.s; upd(); });
      $('.flip', host).onclick = () => { const A = $('.w-a', host), B = $('.w-b', host), t = A.value; A.value = B.value; B.value = t; upd(); };
      $('.w-go', host).onclick = () => {
        const { a, b, x, out } = P._sw;
        P.confirm(`Swap ${fmt(x, 4)} ${a}`, `for ≈ ${fmt(out, 4)} ${b}`, () => { TOK[a].bal -= x; TOK[b].bal += out; P.refresh(); }, 'Swap complete');
      };
      upd();
    };

    P.renderBridge = () => {
      const nets = ['Ethereum', 'BNB Chain', 'TRON', 'INFRA', 'Arbitrum', 'Optimism', 'Base', 'Polygon', 'Avalanche'];
      const opt = s => nets.map(n => `<option ${n === s ? 'selected' : ''}>${n}</option>`).join('');
      V('bridge').innerHTML = `
        <div class="hdr">${back}<h6>Cross-Chain Bridge</h6></div>
        <div class="chain-sel">
          <div class="chain"><small>From</small><select class="b-from">${opt('Ethereum')}</select></div>
          <button class="swapc" aria-label="Switch">⇄</button>
          <div class="chain"><small>To</small><select class="b-to">${opt('BNB Chain')}</select></div>
        </div>
        <div class="box"><label>Amount</label><div class="amt-row"><input class="b-amt" type="number" min="0" step="any" value="100"><span class="tsel">USDT</span></div>
          <div class="mini"><span>Balance: ${fmt(TOK.USDT.bal)} USDT</span></div></div>
        <div class="kv"><div><span>You receive</span><b class="b-rcv"></b></div><div><span>Bridge fee</span><b>0.1%</b></div><div><span>Est. arrival</span><b class="b-eta"></b></div><div><span>Route</span><b class="b-route"></b></div></div>
        <button class="pbtn b-go">Bridge assets</button>
        <p style="font-size:10px;color:#7d7795;text-align:center;margin-top:10px">Any-to-any · multi-hop routes via INFRA</p>`;
      const upd = () => {
        const f = $('.b-from', host).value, t = $('.b-to', host).value, a = +$('.b-amt', host).value || 0;
        $('.b-rcv', host).textContent = `${fmt(a * .999)} USDT`;
        $('.b-eta', host).textContent = ({ TRON: '~1 min', Ethereum: '~3 min', 'BNB Chain': '~45 sec', INFRA: '~10 sec' }[f] || '~30 sec');
        $('.b-route', host).textContent = `${f} → ${t}`;
        const g = $('.b-go', host); g.disabled = f === t || !a || a > TOK.USDT.bal;
        g.textContent = f === t ? 'Choose different networks' : a > TOK.USDT.bal ? 'Insufficient balance' : 'Bridge assets';
      };
      V('bridge').addEventListener('input', upd); V('bridge').addEventListener('change', upd);
      $('.swapc', host).onclick = () => { const A = $('.b-from', host), B = $('.b-to', host), t = A.value; A.value = B.value; B.value = t; upd(); };
      $('.b-go', host).onclick = () => P.confirm(`Bridge ${$('.b-amt', host).value} USDT`, `${$('.b-from', host).value} → ${$('.b-to', host).value}`, () => {}, 'Bridge submitted');
      upd();
    };

    P.renderRewards = () => {
      const c = P.cash;
      V('rewards').innerHTML = `
        <div class="hdr">${back}<h6>reID Cashback</h6></div>
        <div class="stats3"><div><b>${fmt(c.pending)}</b><span>Pending</span></div><div><b>${fmt(c.available)}</b><span>Available</span></div><div><b>${fmt(c.claimed)}</b><span>Claimed</span></div></div>
        <div class="chart">${[30, 45, 28, 60, 52, 75, 90].map(h => `<i data-h="${h}"></i>`).join('')}</div>
        <button class="pbtn c-go" ${c.available ? '' : 'disabled'}>${c.available ? `Claim ${fmt(c.available)} INFRA` : 'Nothing to claim'}</button>
        <div class="secttl">History</div>
        <div class="hist">
          <div><span>reMarketplace purchase</span><span class="g">+4.20</span></div>
          <div><span>Swap INFRA → USDT</span><span class="g">+0.60</span></div>
          <div><span>Merchant payment · Dubai</span><span class="g">+2.40</span></div>
          <div><span>reID verification bonus</span><span class="g">+10.00</span></div>
        </div>`;
      requestAnimationFrame(() => setTimeout(() => $$('.chart i', host).forEach(i => i.style.height = i.dataset.h + '%'), 60));
      $('.c-go', host).onclick = () => P.confirm(`Claim ${fmt(c.available)} INFRA`, 'Cashback to your wallet', () => { TOK.INFRA.bal += c.available; c.claimed += c.available; c.available = 0; P.refresh(); }, 'Cashback claimed');
    };

    P.renderSettings = () => {
      V('settings').innerHTML = `
        <div class="hdr">${back}<h6>Security &amp; Networks</h6></div>
        <div class="set">Face ID / Fingerprint<small>Approve transactions</small><span class="sw on"></span></div>
        <div class="set">Passkeys<small>Phishing-resistant sign-in</small><span class="sw on"></span></div>
        <div class="set">Transaction PIN<small>6-digit fallback</small><span class="sw on"></span></div>
        <div class="set">Risk alerts<small>Suspicious address warnings</small><span class="sw on"></span></div>
        <div class="set">Connect reID<small>Identity &amp; cashback</small><span class="sw on"></span></div>
        <div class="secttl">Networks</div>
        <div class="netlist">
          <div class="netrow"><i style="background:#00e5ff"></i>INFRA<span>Live</span></div>
          <div class="netrow"><i style="background:#627eea"></i>Ethereum<span>Live</span></div>
          <div class="netrow"><i style="background:#f3ba2f"></i>BSC<span>Live</span></div>
          <div class="netrow"><i style="background:#ff3b30"></i>TRON<span>Live</span></div>
        </div>
        <div class="secttl">Add custom network</div>
        <div class="box"><label>Network name</label><input class="n-name" placeholder="My EVM Chain"></div>
        <div class="box"><label>RPC URL</label><input class="n-rpc" placeholder="https://rpc.example.org"></div>
        <div class="box"><label>Chain ID</label><input class="n-id" inputmode="numeric" placeholder="e.g. 8453"></div>
        <button class="pbtn n-add">Add network</button>
        <button class="pbtn ghost" data-go="receive">Back up recovery phrase</button>`;
      $$('.sw', V('settings')).forEach(s => s.parentElement.onclick = () => { s.classList.toggle('on'); toast(s.parentElement.firstChild.textContent.trim() + (s.classList.contains('on') ? ' enabled' : ' disabled')); });
      $('.n-add', host).onclick = () => {
        const n = $('.n-name', host).value.trim(), r = $('.n-rpc', host).value.trim(), id = $('.n-id', host).value.trim();
        if (!n || !/^https?:\/\//.test(r) || !/^\d+$/.test(id)) return toast('Enter a name, valid RPC URL and numeric Chain ID');
        $('.netlist', host).insertAdjacentHTML('beforeend', `<div class="netrow"><i style="background:var(--brand)"></i>${esc(n)} · ${esc(id)}<span>Custom</span></div>`);
        $('.n-name', host).value = $('.n-rpc', host).value = $('.n-id', host).value = '';
        toast(`${n} added`);
      };
    };

    P.confirm = (title, sub, apply, doneMsg) => {
      const ov = $('.overlay', host), sh = $('.sheet', host);
      sh.innerHTML = `<div class="faceid scan">☺</div><h6>${esc(title)}</h6><p>${esc(sub)}</p><button class="pbtn ghost x">Cancel</button>`;
      ov.classList.add('on');
      let t = setTimeout(() => {
        apply();
        sh.innerHTML = `<div class="done">✓</div><h6>${esc(doneMsg)}</h6><p>Confirmed on-chain · demo</p><button class="pbtn x">Done</button>`;
        $('.x', sh).onclick = () => { ov.classList.remove('on'); P.go('home'); };
      }, 1600);
      $('.x', sh).onclick = () => { clearTimeout(t); ov.classList.remove('on'); };
    };

    P.refresh = () => { P.renderHome(); P.renderRewards(); };
    const renders = { home: P.renderHome, send: P.renderSend, receive: P.renderReceive, swap: P.renderSwap, bridge: P.renderBridge, rewards: P.renderRewards, settings: P.renderSettings };

    P.go = v => {
      if (!renders[v]) return;
      if (v !== 'home') renders[v]();
      $$('.view', host).forEach(el => { el.classList.toggle('on', el.dataset.v === v); el.classList.toggle('back', el.dataset.v === P.view && v !== P.view); });
      $$('.tabbar button', host).forEach(b => b.classList.toggle('on', b.dataset.go === v));
      $(`[data-v="${v}"]`, host).scrollTop = 0;
      P.view = v;
      if (kind === 'demo') $$('.dm').forEach(b => b.classList.toggle('active', b.dataset.go === v));
    };

    P.setBrand = (c, name) => {
      if (c) { P.brand = c; host.style.setProperty('--brand', c); }
      if (name != null) { P.name = name || 'reWallet'; $$('.wl-n', host).forEach(e => e.textContent = P.name); }
    };

    // delegated events
    host.addEventListener('click', e => {
      const g = e.target.closest('[data-go]');
      if (g) { e.preventDefault(); P.go(g.dataset.go); return; }
      const t = e.target.closest('[data-t]');
      if (t) {
        $$('[data-t]', host).forEach(b => b.classList.toggle('on', b === t));
        $('.tlist', host).hidden = t.dataset.t !== 'tokens';
        $('.nfts', host).hidden = t.dataset.t !== 'nfts';
        return;
      }
      if (e.target.closest('.eye')) {
        const bv = $('.bv', host); bv.dataset.h = bv.dataset.h ? '' : '1';
        bv.textContent = bv.dataset.h ? '••••••' : fiatOf(totalUSD());
        return;
      }
      const tk = e.target.closest('[data-tok]');
      if (tk) { P.go('send'); $('.s-tok', host).value = tk.dataset.tok; V('send').dispatchEvent(new Event('input')); }
    });

    P.renderHome();
    phones.push(P);
    return P;
  }

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2400); }

  /* ---------- init phones ---------- */
  const heroP = createPhone($('[data-phone="hero"]'), 'hero');
  const demoP = createPhone($('[data-phone="demo"]'), 'demo');
  const wlP = createPhone($('[data-phone="wl"]'), 'wl');

  // demo menu
  $$('.dm').forEach(b => b.onclick = () => { demoP.go(b.dataset.go); if (innerWidth < 900) $('.demo-phone').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); });

  // currency switchers
  const reRenderAll = () => phones.forEach(p => { p.renderHome(); if (p.view !== 'home') p.go(p.view); });
  $$('#fiatSeg button').forEach(b => b.onclick = () => { $$('#fiatSeg button').forEach(x => x.classList.remove('on')); b.classList.add('on'); state.fiat = b.dataset.fiat; reRenderAll(); demoP.go('home'); });
  $$('#cryptoSeg button').forEach(b => b.onclick = () => { $$('#cryptoSeg button').forEach(x => x.classList.remove('on')); b.classList.add('on'); state.crypto = b.dataset.crypto; reRenderAll(); demoP.go('home'); });

  // white-label
  const setSw = c => { wlP.setBrand(c); $('#wlColor').value = c; };
  $$('#swatches button').forEach(b => b.onclick = () => { $$('#swatches button').forEach(x => x.classList.remove('on')); b.classList.add('on'); setSw(getComputedStyle(b).getPropertyValue('--s').trim()); });
  $('#wlColor').oninput = e => { $$('#swatches button').forEach(x => x.classList.remove('on')); wlP.setBrand(e.target.value); };
  $('#wlName').oninput = e => wlP.setBrand(null, e.target.value.trim());
  $$('#wlChips span').forEach(s => s.onclick = () => s.classList.toggle('on'));

  // hero phone: gentle auto tour until user interacts
  let tour = ['home', 'swap', 'rewards', 'home'], ti = 0, tourOn = !reduce;
  const tourT = setInterval(() => { if (!tourOn) return clearInterval(tourT); ti = (ti + 1) % tour.length; heroP.go(tour[ti]); }, 3800);
  heroP.host.addEventListener('pointerdown', () => tourOn = false, { once: true });

  /* ---------- 3D tilt ---------- */
  if (matchMedia('(hover:hover)').matches && !reduce) {
    $$('.tilt').forEach(el => {
      const par = el.parentElement;
      par.addEventListener('pointermove', e => {
        const r = par.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
      });
      par.addEventListener('pointerleave', () => el.style.transform = '');
    });
    const glow = $('.cursor-glow');
    addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });
  }

  /* ---------- theme ---------- */
  const root = document.documentElement, tBtn = $('#themeT'), meta = $('meta[name=theme-color]');
  const applyTheme = t => {
    root.dataset.theme = t;
    meta.content = t === 'dark' ? '#0b0716' : '#fbfaff';
    tBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
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
  const secs = $$('main section[id]');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('#links a').forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => spy.observe(s));

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
  const live = [['INFRA', '#00e5ff'], ['Ethereum', '#8b7cff'], ['BSC', '#f3ba2f'], ['TRON', '#ff3b30']];
  const soon = ['Polygon', 'Avalanche', 'Arbitrum', 'Optimism', 'Base', 'Solana', 'Bitcoin'];
  const orbs = [];
  live.forEach(([n, c], i) => { const d = document.createElement('div'); d.className = 'orb live'; d.style.setProperty('--c', c); d.textContent = n; orbit.appendChild(d); orbs.push({ d, r: .41, a: i / live.length * Math.PI * 2, s: .00025 }); });
  soon.forEach((n, i) => { const d = document.createElement('div'); d.className = 'orb soon'; d.textContent = n; orbit.appendChild(d); orbs.push({ d, r: .25, a: i / soon.length * Math.PI * 2, s: -.0004 }); });
  let last = performance.now();
  const spinOrbs = t => {
    const dt = reduce ? 0 : t - last; last = t;
    const R = orbit.clientWidth;
    orbs.forEach(o => { o.a += o.s * dt; o.d.style.transform = `translate(${Math.cos(o.a) * o.r * R}px,${Math.sin(o.a) * o.r * R}px)`; });
    requestAnimationFrame(spinOrbs);
  };
  requestAnimationFrame(spinOrbs);

  /* ---------- hero particles ---------- */
  const cv = $('#particles');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d'); let W, H, pts = []; const dark = () => document.documentElement.dataset.theme === 'dark';
    const size = () => { const dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: Math.round(W * H / 22000) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 })); };
    size(); addEventListener('resize', size);
    let vis = true; new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(cv);
    const draw = () => {
      if (vis) {
        ctx.clearRect(0, 0, W, H);
        for (const p of pts) { p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H; ctx.fillStyle = dark() ? 'rgba(201,176,255,.6)' : 'rgba(112,0,255,.35)'; ctx.fillRect(p.x, p.y, 1.6, 1.6); }
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) { ctx.strokeStyle = `rgba(${dark() ? '155,92,255' : '112,0,255'},${(1 - d / 120) * (dark() ? .22 : .14)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- contact form ---------- */
  // Set CONTACT_ENDPOINT to a form backend (e.g. Formspree/your API) to POST JSON.
  // If left empty, the form opens the user's email client addressed to CONTACT_EMAIL.
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
        msg.className = 'form-msg ok'; msg.textContent = 'Thanks! Your message has been sent — we\'ll be in touch shortly.';
        form.reset();
      } else {
        const body = `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '-'}\nPhone: ${data.phone || '-'}\nType: ${data.type}\n\n${data.message}`;
        location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('reWallet — ' + data.type)}&body=${encodeURIComponent(body)}`;
        msg.className = 'form-msg ok'; msg.textContent = 'Opening your email app to send the message…';
      }
    } catch { msg.className = 'form-msg bad'; msg.textContent = 'Something went wrong. Please try again.'; }
    btn.disabled = false;
  });
  $$('#contactForm input, #contactForm textarea').forEach(el => el.addEventListener('input', () => el.parentElement.classList.remove('err')));

  /* ---------- mock bridge ---------- */
  (() => {
    const COL = { Ethereum: '#627eea', 'BNB Chain': '#f3ba2f', TRON: '#ff3b30', INFRA: '#7000ff', Arbitrum: '#28a0f0', Optimism: '#ff0420', Base: '#0052ff', Polygon: '#8247e5', Avalanche: '#e84142' };
    const IC = { TRON: 'assets/tron.png', 'BNB Chain': 'assets/bnb.png', INFRA: 'assets/icon.png' };
    const icOf = n => IC[n] || 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${COL[n]}"/><text x="16" y="21" font-family="Arial" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">${n.slice(0, 2)}</text></svg>`);
    const ETA = { TRON: 60, Ethereum: 180, 'BNB Chain': 45, INFRA: 8, Arbitrum: 30, Optimism: 30, Base: 25, Polygon: 60, Avalanche: 20 };
    const GAS = { TRON: 0.9, Ethereum: 2.4, 'BNB Chain': 0.12, INFRA: 0.001, Arbitrum: 0.05, Optimism: 0.04, Base: 0.02, Polygon: 0.01, Avalanche: 0.08 };
    const NONEVM = ['TRON'];
    const route = (f, t) => (NONEVM.includes(f) || NONEVM.includes(t)) && f !== 'INFRA' && t !== 'INFRA' ? [f, 'INFRA', t] : [f, t];
    const eta = s => s < 60 ? `~${s} sec` : `~${Math.round(s / 60)} min`;
    const BAL = { USDT: 1250, USDC: 640, ETH: 0.85, BNB: 3.2 };
    const xb = $('#xb'); if (!xb) return;
    const F = $('#xbFrom'), T = $('#xbTo'), A = $('#xbAmt'), K = $('#xbTok'), go = $('#xbGo');
    let busy = false;
    const upd = () => {
      const f = F.value, t = T.value, a = +A.value || 0, k = K.value;
      $$('[data-ic=from]', xb).forEach(i => i.src = icOf(f));
      $$('[data-ic=to]', xb).forEach(i => i.src = icOf(t));
      const r = route(f, t);
      $('#xbRoute').textContent = r.join(' → ');
      $('#xbHub').textContent = r.length > 2 ? 'Multi-hop via INFRA' : 'Direct route';
      $('#xbL1').textContent = f; $('#xbL2').textContent = t;
      $('#xbBal').textContent = `${fmt(BAL[k], k === 'ETH' || k === 'BNB' ? 4 : 2)} ${k}`;
      $('#xbRcv').textContent = `${fmt(a * .999, a < 10 ? 4 : 2)} ${k}`;
      $('#xbFee').textContent = `0.1% (${fmt(a * .001, 4)} ${k})`;
      $('#xbGas').textContent = '≈ $' + fmt(r.reduce((s, n, i) => i < r.length - 1 ? s + GAS[n] : s, 0), 3);
      $('#xbEta').textContent = eta(r.slice(0, -1).reduce((s, n) => s + ETA[n], 0) + (r.length > 2 ? 8 : 0));
      const bad = f === t ? 'Choose different networks' : !a ? 'Enter an amount' : a > BAL[k] ? 'Insufficient balance' : '';
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
        if (i === li.length) {
          xb.classList.remove('run'); $('#xbN2').classList.add('lit');
          const a = +A.value, k = K.value; BAL[k] -= a;
          busy = false; toast(`Bridged ${fmt(a * .999, 2)} ${k} to ${T.value} · demo`); upd(); return;
        }
        li[i].className = 'act'; i++; setTimeout(next, 1100);
      };
      next();
    };
    upd();
  })();

  $('#yr').textContent = new Date().getFullYear();
})();
