/*
  AISHA — fon musiqasi: haqiqiy romantik yozuvlar (Wikimedia Commons, erkin litsenziya).
  Kayfiyatlar: calm (romantik), play (yengil), suspense (intriga), celebrate (bayram).
  Bitta <audio> element ishlatiladi: iPhone'da bir marta tegilgandan keyin
  sahna almashganda ham musiqa o'zi davom etadi. Har bir kuy qayerda to'xtagan
  bo'lsa, qaytganda o'sha joydan davom etadi.
  Tugma ovozlari (pop, chime, fanfare) — qisqa effektlar, Web Audio'da.
*/
const Sound = (() => {
  'use strict';
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/';
  const TRACKS = {
    // Chopin — Nocturne Op. 9 No. 2 (Frank Levy, pianino) — Public domain
    calm: { vol: 0.6, src: WM + '8/89/Chopin_-_Nocturne_No._2_in_E-flat_major%2C_Op._9_No._2_%28Frank_Levy%29.flac/Chopin_-_Nocturne_No._2_in_E-flat_major%2C_Op._9_No._2_%28Frank_Levy%29.flac.mp3' },
    // Elgar — Salut d'amour, Op. 12 (Emanuel Salvador, skripka; Pau Casan, pianino) — CC BY 3.0
    play: { vol: 0.5, src: WM + '7/7c/Edward_Elgar_-_Salut_d%27amour%2C_Op._12_-_Emanuel_Salvador_and_Pau_Casan_%282011%29.ogg/Edward_Elgar_-_Salut_d%27amour%2C_Op._12_-_Emanuel_Salvador_and_Pau_Casan_%282011%29.ogg.mp3' },
    // Debussy — Clair de lune (Suite bergamasque) — Public domain
    suspense: { vol: 0.6, src: WM + 'b/be/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg.mp3' },
    // Mendelssohn — To'y marshi, "Yoz kechasidagi tush" Op. 61 (European Archive) — Public domain
    celebrate: { vol: 0.5, src: WM + 'c/cb/A_Midsummer_Night%27s_Dream_Op._61_Wedding_March_%28Mendelssohn%29_European_Archive.ogg/A_Midsummer_Night%27s_Dream_Op._61_Wedding_March_%28Mendelssohn%29_European_Archive.ogg.mp3' }
  };
  // Kuy yuklanmasa, shu tartibda boshqasiga o'tadi
  const FALLBACK = { calm: 'suspense', play: 'calm', suspense: 'calm', celebrate: 'play' };

  let on = true, started = false, mood = 'calm', cur = null;
  const pos = {};
  const failed = new Set();
  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';

  /* ---- Musiqa ---- */
  let fadeId = null;
  function fadeTo(target, ms, done) {
    clearInterval(fadeId);
    const from = audio.volume, steps = Math.max(1, Math.round(ms / 40));
    let i = 0;
    fadeId = setInterval(() => {
      i++;
      try { audio.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps))); } catch (e) { /* iOS: volume o'zgarmaydi */ }
      if (i >= steps) { clearInterval(fadeId); fadeId = null; if (done) done(); }
    }, 40);
  }

  function load(m) {
    if (cur && !isNaN(audio.currentTime)) pos[cur] = audio.currentTime;
    cur = m;
    audio.src = TRACKS[m].src;
    const t = pos[m];
    if (t) audio.addEventListener('loadedmetadata', () => { try { audio.currentTime = t; } catch (e) {} }, { once: true });
  }

  function playNow() {
    try { audio.volume = 0; } catch (e) {}
    const p = audio.play();
    if (p && p.catch) p.catch(() => {});
    fadeTo(TRACKS[cur].vol, 1200);
  }

  audio.addEventListener('error', () => {
    if (!cur) return;
    failed.add(cur);
    const next = FALLBACK[cur];
    if (next && !failed.has(next)) { load(next); if (started && on) playNow(); }
  });

  function switchTo(m) {
    if (!TRACKS[m] || m === cur) return;
    if (failed.has(m)) return;
    if (!started || !on || audio.paused) { load(m); return; }
    fadeTo(0, 600, () => { load(m); playNow(); });
  }

  /* ---- Effektlar uchun Web Audio ---- */
  let ctx = null, master, sfxBus, reverbIn, noiseBuf;
  const plucks = new Map();
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function makeNoise(sec) {
    const len = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  function makeIR(sec) {
    const len = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return b;
  }

  function initFx() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = on ? 0.8 : 0;
    master.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.55; sfxBus.connect(master);
    const conv = ctx.createConvolver(); conv.buffer = makeIR(2.2);
    const wet = ctx.createGain(); wet.gain.value = 0.3;
    conv.connect(wet); wet.connect(master);
    reverbIn = conv;
    noiseBuf = makeNoise(1);
    return true;
  }

  function pluckBuf(m) {
    if (plucks.has(m)) return plucks.get(m);
    const sr = ctx.sampleRate, f = mtof(m);
    const dur = 1.4;
    const N = Math.max(2, Math.round(sr / f - 0.5));
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    const ring = new Float32Array(N);
    let lp = 0;
    for (let i = 0; i < N; i++) { lp += 0.55 * ((Math.random() * 2 - 1) - lp); ring[i] = lp; }
    let idx = 0, peak = 0;
    for (let i = 0; i < len; i++) {
      const n = idx + 1 === N ? 0 : idx + 1;
      const v = ring[idx];
      d[i] = v;
      ring[idx] = 0.996 * 0.5 * (v + ring[n]);
      idx = n;
      const a = v < 0 ? -v : v;
      if (a > peak) peak = a;
    }
    const norm = peak > 0 ? 0.9 / peak : 1;
    const fade = Math.floor(sr * 0.15);
    for (let i = 0; i < len; i++) {
      d[i] *= norm;
      if (i > len - fade) d[i] *= (len - i) / fade;
    }
    plucks.set(m, buf);
    return buf;
  }

  function pluck(m, t, vel, pan = 0, rev = 0.3) {
    const src = ctx.createBufferSource();
    src.buffer = pluckBuf(m);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3400;
    const g = ctx.createGain(); g.gain.value = vel;
    src.connect(lp); lp.connect(g);
    let out = g;
    if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); out = p; }
    out.connect(sfxBus);
    if (rev > 0) { const s = ctx.createGain(); s.gain.value = rev; out.connect(s); s.connect(reverbIn); }
    src.start(t);
  }

  function env(t, peak, dur) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    return g;
  }

  function sfx(name) {
    if (!ctx || !on || ctx.state !== 'running') return;
    const t = ctx.currentTime + 0.01;
    switch (name) {
      case 'pop': {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(620, t); o.frequency.exponentialRampToValueAtTime(990, t + 0.08);
        const g = env(t, 0.14, 0.12); o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + 0.14);
        break;
      }
      case 'whoosh': {
        const src = ctx.createBufferSource(); src.buffer = noiseBuf;
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 2;
        f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.3);
        const g = env(t, 0.22, 0.36);
        src.connect(f); f.connect(g); g.connect(sfxBus); src.start(t, 0, 0.4);
        break;
      }
      case 'chime':
        [74, 78, 81, 86].forEach((m, i) => pluck(m, t + i * 0.08, 0.3, 0, 0.5));
        break;
      case 'nope':
        [51, 50].forEach((m, i) => pluck(m, t + i * 0.16, 0.38, 0, 0.3));
        break;
      case 'fanfare':
        [62, 66, 69, 74, 78, 81, 86].forEach((m, i) => pluck(m, t + i * 0.07, 0.26, i % 2 ? 0.3 : -0.3, 0.5));
        break;
    }
  }

  /* ---- Boshqaruv ---- */
  const listeners = [];
  const notify = () => listeners.forEach(fn => { try { fn(); } catch (e) {} });

  function start() {
    if (initFx() && on && ctx.state === 'suspended') ctx.resume();
    if (started) return;
    started = true;
    if (cur !== mood) load(mood);
    if (on) playNow();
    disarm();
    notify();
  }

  /* ---- Avtomatik boshlash ----
     Sahifa ochilishi bilan chalishga urinamiz. Brauzer ruxsat bermasa
     (telefonlarda deyarli doim), ekranning istalgan joyiga birinchi
     tegish yoki tugma bosishda yonadi. */
  const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click'];
  let armed = false;

  function autoStart() {
    if (started || !on) return;
    if (cur !== mood) load(mood);
    try { audio.volume = 0; } catch (e) {}
    const p = audio.play();
    const ok = () => {
      if (started) return;
      started = true;
      fadeTo(TRACKS[cur].vol, 1500);
      disarm();
      notify();
    };
    if (p && p.then) p.then(ok, arm); else ok();
  }

  function onGesture(e) {
    if (started || !on) { disarm(); return; }
    // ovoz tugmasining o'zi boshlaydi — ikki marta bosilgandek bo'lmasin
    if (e.target && e.target.closest && e.target.closest('#soundBtn')) return;
    if (initFx() && ctx.state === 'suspended') ctx.resume();
    autoStart();
  }

  function arm() {
    if (armed || started) return;
    armed = true;
    GESTURES.forEach(ev => document.addEventListener(ev, onGesture, { capture: true, passive: true }));
  }

  function disarm() {
    if (!armed) return;
    armed = false;
    GESTURES.forEach(ev => document.removeEventListener(ev, onGesture, { capture: true }));
  }

  function setOn(v) {
    on = v;
    if (ctx) {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setTargetAtTime(on ? 0.8 : 0, t, 0.08);
      if (on) ctx.resume();
    }
    if (!started) { if (!on) disarm(); notify(); return; }
    if (on) { if (cur !== mood) load(mood); playNow(); }
    else fadeTo(0, 400, () => { if (!on) audio.pause(); });
    notify();
  }

  function toggle() { setOn(!on); if (on && !started) start(); return on; }

  document.addEventListener('visibilitychange', () => {
    if (!started) return;
    if (document.hidden) { audio.pause(); if (ctx) ctx.suspend(); }
    else if (on) { playNow(); if (ctx) ctx.resume(); }
  });

  // Birinchi kuyni yuklab, darhol chalishga urinamiz
  load(mood);
  autoStart();

  return {
    start, toggle, setOn, sfx,
    onChange: fn => { listeners.push(fn); },
    setMood: m => { if (!m) return; mood = m; switchTo(m); },
    isOn: () => on,
    started: () => started
  };
})();
