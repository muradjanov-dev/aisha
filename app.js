(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     Fon: yulduzchalar, osmon chiroqlari, gulbarglar
     ========================================================= */
  function buildSky() {
    const sky = $('#sky');
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 20; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.textContent = '✦';
      s.style.left = rnd(2, 98) + '%';
      s.style.top = rnd(2, 75) + '%';
      s.style.fontSize = rnd(6, 13) + 'px';
      s.style.setProperty('--dur', rnd(3, 7) + 's');
      s.style.setProperty('--delay', -rnd(0, 7) + 's');
      frag.appendChild(s);
    }
    if (!reduceMotion) {
      for (let i = 0; i < 7; i++) {
        const l = document.createElement('span');
        l.className = 'lantern';
        const k = rnd(0.7, 1.25);
        l.style.width = 18 * k + 'px';
        l.style.height = 24 * k + 'px';
        l.style.left = rnd(4, 94) + '%';
        l.style.setProperty('--dur', rnd(28, 46) + 's');
        l.style.setProperty('--delay', -rnd(0, 46) + 's');
        l.style.setProperty('--sway', rnd(-50, 50) + 'px');
        frag.appendChild(l);
      }
      for (let i = 0; i < 12; i++) {
        const p = document.createElement('span');
        p.className = 'petal';
        const sz = rnd(8, 14);
        p.style.width = sz + 'px';
        p.style.height = sz + 'px';
        p.style.left = rnd(0, 100) + '%';
        p.style.setProperty('--dur', rnd(16, 30) + 's');
        p.style.setProperty('--delay', -rnd(0, 30) + 's');
        p.style.setProperty('--drift', rnd(-90, 90) + 'px');
        frag.appendChild(p);
      }
    }
    sky.appendChild(frag);
  }

  /* =========================================================
     Choynak va piyola (SVG)
     ========================================================= */
  const paxta = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#93aac6" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">` +
    [0, 90, 180, 270].map(r => `<path transform="rotate(${r})" d="M0 -2 C3 -3 4 -8 0 -9 C-4 -8 -3 -3 0 -2Z"/>`).join('') +
    [45, 135, 225, 315].map(r => `<path transform="rotate(${r})" d="M0 -3.5 L0 -7"/>`).join('') +
    `<circle r="1.6" fill="#93aac6" stroke="none"/></g>`;

  function teaSVG(pour) {
    return `<svg class="tea${pour ? ' pour' : ''}" viewBox="0 0 280 175" role="img" aria-label="Choynak va piyola">
  <ellipse cx="140" cy="167" rx="118" ry="5" fill="#d8c2ba" opacity=".35"/>
  <g class="pot">
    <path d="M46 82 C16 80 16 128 48 124" fill="none" stroke="#e7ded6" stroke-width="9" stroke-linecap="round"/>
    <path d="M138 106 C154 100 160 82 174 70 L181 73 C172 88 168 112 146 124 Z" fill="#fbf7f2" stroke="#dcd0c6" stroke-width="1.5" stroke-linejoin="round"/>
    <ellipse cx="95" cy="104" rx="56" ry="44" fill="#fbf7f2" stroke="#dcd0c6" stroke-width="1.5"/>
    <path d="M47 84 Q95 66 143 84" stroke="#93aac6" stroke-width="3" fill="none" opacity=".75"/>
    <path d="M45 122 Q95 142 145 122" stroke="#93aac6" stroke-width="2" fill="none" opacity=".55"/>
    ${paxta(72, 104, 1.1)}${paxta(118, 104, 1.1)}${paxta(95, 120, 0.8)}${paxta(95, 92, 0.8)}
    <path d="M70 65 Q95 46 120 65 Z" fill="#fbf7f2" stroke="#dcd0c6" stroke-width="1.5"/>
    <ellipse cx="95" cy="65" rx="27" ry="6" fill="#f6f0ea" stroke="#dcd0c6" stroke-width="1.5"/>
    <circle cx="95" cy="50" r="5.5" fill="#93aac6" opacity=".85"/>
  </g>
  <path class="stream" d="M181 108 Q197 114 206 134" stroke="#d3a575" stroke-width="3" fill="none" stroke-linecap="round"/>
  <g class="cup">
    <ellipse cx="220" cy="163" rx="13" ry="3" fill="#e4d9d0"/>
    <path d="M190 128 Q192 160 220 162 Q248 160 250 128 Z" fill="#fbf7f2" stroke="#dcd0c6" stroke-width="1.5"/>
    <path d="M193 141 Q220 151 247 141" stroke="#93aac6" stroke-width="2.5" fill="none" opacity=".75"/>
    <ellipse cx="220" cy="128" rx="30" ry="5" fill="#f3ebe4" stroke="#dcd0c6" stroke-width="1.5"/>
    <ellipse class="tea-surface" cx="220" cy="128.8" rx="25" ry="3.4" fill="#d9a673"/>
  </g>
  <g class="steam">
    <path d="M210 118 c-4 -6 4 -10 0 -16 c-4 -6 4 -10 0 -16"/>
    <path d="M220 116 c-4 -6 4 -10 0 -16 c-4 -6 4 -10 0 -16"/>
    <path d="M230 118 c-4 -6 4 -10 0 -16 c-4 -6 4 -10 0 -16"/>
  </g>
</svg>`;
  }

  /* =========================================================
     Toast
     ========================================================= */
  const toastEl = $('#toast');
  let toastTimer = null;
  function toast(html, ms = 2900) {
    toastEl.innerHTML = html;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  /* =========================================================
     Ovoz tugmasi
     ========================================================= */
  const soundBtn = $('#soundBtn');
  function paintSound() {
    soundBtn.classList.toggle('on', Sound.isOn());
    soundBtn.classList.toggle('playing', Sound.isOn() && Sound.started());
  }
  soundBtn.addEventListener('click', () => {
    if (!Sound.started()) { Sound.setOn(true); Sound.start(); }
    else Sound.toggle();
    paintSound();
  });
  Sound.onChange(paintSound);
  paintSound();

  /* =========================================================
     Sahnalar
     ========================================================= */
  const ORDER = { intro: 0, roll: 0, vocab: 1, grammar: 2, dictation: 2, proverb: 2, break: 3, questions: 4, captcha: 5, exam: 5, reject: 5, last: 5, final: 6 };
  const LABELS = ['Muqaddima', "Lug'at", 'Grammatika', 'Tanaffus', 'Savol-javob', 'Imtihon', 'Tugadi ✓'];
  const MOODS = { intro: 'calm', roll: 'calm', vocab: 'calm', grammar: 'play', dictation: 'play', proverb: 'play', break: 'calm', questions: 'calm', captcha: 'play', exam: 'play', reject: 'suspense', last: 'play', final: 'celebrate' };
  // Baho varaqasi uchun
  const G = { roll: null, grammar: null, proverb: null, breakSecs: null, noCaught: false };
  let current = 'intro';

  function updateSteps(k) {
    $$('#steps i').forEach((d, i) => {
      d.classList.toggle('done', i < k);
      d.classList.toggle('on', i === k);
    });
    $('#stepLabel').textContent = LABELS[k];
  }

  function go(name, data) {
    const prev = $('.scene.active');
    if (prev) prev.classList.remove('active');
    $(`[data-scene="${name}"]`).classList.add('active');
    current = name;
    window.scrollTo(0, 0);
    updateSteps(ORDER[name]);
    Sound.setMood(MOODS[name]);
    syncNoBtn();
    if (enter[name]) enter[name](data);
  }

  const enter = {
    break() { $('#breakTea').innerHTML = teaSVG(false); breakStart = Date.now(); },
    captcha() { const box = $('#captcha'); $$('#captcha button').sort(() => Math.random() - 0.5).forEach(t => box.appendChild(t)); },
    exam() { $('#examTea').innerHTML = teaSVG(false); },
    reject() { runReject(); },
    last() { resetStubborn(); },
    final(choice) { showFinal(choice); }
  };

  /* ---------- 0. Muqaddima ---------- */
  $('#startBtn').addEventListener('click', () => {
    if (Sound.isOn()) Sound.start();
    paintSound();
    go('roll');
  });

  /* ---------- 0b. Davomat ---------- */
  $$('#rollRow .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (G.roll) return;
      G.roll = btn.dataset.roll;
      const mark = $('#rollMark');
      mark.textContent = '✓ keldi';
      mark.classList.add('ok');
      const fb = $('#rollFb');
      if (G.roll === 'absent') {
        fb.innerHTML = `Kelmagan talaba «kelmadim» deb javob bera olmaydi 🤨<br>Mantiq darsi ham kerakmi, ustoza? Jurnalga «keldi ✓» deb yozib qo'ydim.`;
        Sound.sfx('nope');
      } else {
        fb.innerHTML = `Barakalla ✓ Jurnalga yozildi: <b>Aisha — keldi, kayfiyati a'lo</b>`;
        Sound.sfx('chime');
      }
      $$('#rollRow .btn').forEach(b => { if (b !== btn) b.style.opacity = '.5'; });
      fb.hidden = false;
      $('#rollNext').hidden = false;
    });
  });
  $('#rollNext').addEventListener('click', () => go('vocab'));

  /* ---------- 1. Lug'at ---------- */
  const flipped = new Set();
  $$('.flash').forEach((card, i) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      flipped.add(i);
      Sound.sfx('pop');
    });
  });
  $('#vocabNext').addEventListener('click', () => {
    const left = 4 - flipped.size;
    if (left > 0) {
      Sound.sfx('nope');
      toast(`Ustoza, talaba darsni oxirigacha o'qishi kerak-ku 😄<br>Yana ${left} ta kartochka yopiq.`);
      return;
    }
    go('grammar');
  });

  /* ---------- 2. Grammatika ---------- */
  const GRAMMAR = {
    a: { sfx: 'chime', html: `<b lang="ar">مُمْتَاز!</b> ⭐ Albatta, ustoza. Yana «<span lang="ar">عَائِشَةُ</span>» tanvinsiz — <i>mamnu' min as-sarf</i>. Grammatika benuqson. Endi faqat ma'nosini tasdiqlash qoldi 😏` },
    b: { sfx: 'nope', html: `Ustoza?! 😳 Fe'l qani? Bu — ismiy gap-ku! Sizdan kutmagandim.<br>Jarima: nikohdan keyin bir piyola choy damlab berasiz 😄` },
    c: { sfx: 'pop', html: `Grammatik jihatdan — benuqson ✓<br>Hayotiy jihatdan esa... buni hozir imtihonda tekshiramiz 😌` }
  };
  $$('#grammarOpts .opt').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#grammarOpts .opt').forEach(b => b.classList.remove('chosen'));
      btn.classList.add('chosen');
      const g = GRAMMAR[btn.dataset.a];
      G.grammar = btn.dataset.a;
      const fb = $('#grammarFb');
      fb.hidden = true;
      void fb.offsetWidth; // animatsiyani qayta boshlash
      fb.innerHTML = g.html;
      fb.hidden = false;
      $('#grammarNext').hidden = false;
      Sound.sfx(g.sfx);
    });
  });
  $('#grammarNext').addEventListener('click', () => go('dictation'));

  /* ---------- 2b. Diktant: klaviatura o'zi «Ha, roziman» deb yozadi ---------- */
  const DICT = Array.from('Ha, roziman');
  const dictInput = $('#dictInput');
  let dictBusy = false;
  dictInput.addEventListener('input', () => {
    if (dictBusy) return;
    const n = Array.from(dictInput.value).length;
    const out = DICT.slice(0, Math.min(n, DICT.length)).join('');
    if (dictInput.value !== out) {
      dictInput.value = out;
      try { dictInput.setSelectionRange(out.length, out.length); } catch (e) {}
    }
  });
  async function dictCheck() {
    if (dictBusy || !$('#dictNext').hidden) return;
    const n = Array.from(dictInput.value).length;
    if (n === 0) {
      Sound.sfx('nope');
      toast("Hali hech narsa yozmadingiz-ku, ustoza 😄");
      dictInput.focus();
      return;
    }
    dictBusy = true;
    for (let i = n; i < DICT.length; i++) {
      dictInput.value = DICT.slice(0, i + 1).join('');
      await wait(70);
    }
    dictBusy = false;
    dictInput.blur();
    const fb = $('#dictFb');
    fb.innerHTML = `Imlo — <b>5</b> ✓<br>Faqat bir narsa: siz «Yo'q» deb yozmoqchi edingiz, klaviatura esa «Ha, roziman» deb yozdi. Bu saytdagi avtokorrektor shunday sozlangan 😄`;
    fb.hidden = false;
    $('#dictCheck').hidden = true;
    $('#dictNext').hidden = false;
    Sound.sfx('chime');
  }
  $('#dictCheck').addEventListener('click', dictCheck);
  dictInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); dictCheck(); } });
  $('#dictNext').addEventListener('click', () => go('proverb'));

  /* ---------- 2c. Maqollar ---------- */
  const PROVERB = {
    a: { sfx: 'chime', html: `<b lang="ar">مُمْتَاز!</b> «<span lang="ar">الصَّبْرُ مِفْتَاحُ الفَرَج</span>» — sabr kushoyish kalitidir. Men ham shu maqolga amal qilib, javobni sabr bilan kutyapman 😌` },
    b: { sfx: 'pop', html: `Mantiqan to'g'ri, lekin maqolda unaqa emas 😄 To'g'ri javob — «<span lang="ar">الفَرَج</span>». Garchi... sabr bilan damlangan choy ham ko'p eshiklarni ochadi ☕` },
    c: { sfx: 'nope', html: `Ustoza! 😳 Muzlatkichning kaliti bo'lmaydi-ku. To'g'ri javob — «<span lang="ar">الفَرَج</span>». Javobingizni «ijodiy» deb baholayman 😄` }
  };
  $$('#proverbOpts .opt').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#proverbOpts .opt').forEach(b => b.classList.remove('chosen'));
      btn.classList.add('chosen');
      G.proverb = btn.dataset.p;
      const p = PROVERB[G.proverb];
      const fb = $('#proverbFb');
      fb.hidden = true; void fb.offsetWidth;
      fb.innerHTML = p.html;
      fb.hidden = false;
      $('#proverbNext').hidden = false;
      Sound.sfx(p.sfx);
    });
  });
  $('#proverbNext').addEventListener('click', () => go('break'));

  /* ---------- 2d. Tanaffus: choy qaytarish ---------- */
  const POUR_LINES = ['Birinchisi — loy', 'Ikkinchisi — moy', "Uchinchisi — choy ☕ Endi ichsa bo'ladi!"];
  let pours = 0, breakStart = 0;
  $('#pourBtn').addEventListener('click', () => {
    if (pours >= 3) return;
    pours++;
    $('#breakTea').innerHTML = teaSVG(true);
    const li = document.createElement('li');
    li.className = 'pop-in';
    li.textContent = POUR_LINES[pours - 1];
    $('#breakLog').appendChild(li);
    $('#pourBtn').textContent = `Qaytarish · ${pours}/3`;
    Sound.sfx(pours === 3 ? 'chime' : 'pop');
    if (pours === 3) {
      G.breakSecs = Math.max(1, Math.round((Date.now() - breakStart) / 1000));
      $('#pourBtn').hidden = true;
      setTimeout(() => {
        $('#breakNext').hidden = false;
        toast(`Tanaffus 5 daqiqa edi. Siz ${G.breakSecs} soniyada tugatdingiz — a'lochi talaba 😄`, 3800);
      }, 900);
    }
  });
  $('#breakNext').addEventListener('click', () => go('questions'));

  /* ---------- 2e. Savol-javob: talaba so'raydi ---------- */
  const ANSWERS = {
    tea: `Navbat bilan: juft kunlari — men, toq kunlari — ham men 😄<br>Sizdan faqat «choy tayyor» xabarini tasdiqlash talab qilinadi ✓`,
    arabic: `«<span lang="ar">نَعَم</span>», «<span lang="ar">بَلَى</span>» va «<span lang="ar">شَاي</span>». Bugungi dars uchun yetarli. Qolganini, inshaalloh, ustozam o'rgatadi 😌`,
    why: `Chunki ilm, odob va sabr bir insonda jamlangani kamdan-kam uchraydi. Bunday «grammatika»ni hech bir kitobdan topolmadim 📚`,
    no: `Bu savol bugungi dasturga kirmagan (1-darsga qarang 📚)<br>Jiddiy javob esa: qaroringiz qanday bo'lsa ham, hurmat qilaman. Choy taklifi esa kuchda qoladi ☕`,
    leak: `Yo'q 😄<br>Ko'rdingizmi, bu saytda «yo'q» so'zini faqat ustoz ishlata oladi. Bugun ustoz — men.`
  };
  const asked = new Set();
  $$('#qOpts .opt').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#qOpts .opt').forEach(b => b.classList.remove('chosen'));
      btn.classList.add('chosen', 'asked');
      asked.add(btn.dataset.q);
      const fb = $('#qFb');
      fb.hidden = true; void fb.offsetWidth;
      fb.innerHTML = ANSWERS[btn.dataset.q];
      fb.hidden = false;
      Sound.sfx(btn.dataset.q === 'leak' ? 'nope' : 'pop');
      if (asked.size >= 2) $('#qNext').hidden = false;
      if (asked.size === 5) setTimeout(() => toast("Hamma savolni berdingiz. Ko'p so'raydigan talaba — a'lochi talaba 😄"), 1400);
    });
  });
  $('#qNext').addEventListener('click', () => go('captcha'));

  /* ---------- 2f. Captcha: «yo'q»ni toping ---------- */
  let captchaTries = 0, captchaDone = false;
  function finishCaptcha() {
    if (captchaDone) return;
    captchaDone = true;
    const fb = $('#captchaFb');
    fb.innerHTML = `Tekshiruv yakunlandi ✓<br>«Yo'q» topilmadi — chunki u yo'q. Tizim xulosasi: siz robot emassiz. Robot allaqachon taslim bo'lgan bo'lardi 🤖`;
    fb.hidden = false;
    $('#captchaGiveUp').hidden = true;
    $('#captchaNext').hidden = false;
    Sound.sfx('chime');
  }
  $$('#captcha button').forEach(tile => {
    tile.addEventListener('click', () => {
      tile.classList.add('seen');
      toast(`Bu ham «ha» ekan — ${tile.dataset.l} 😄`);
      Sound.sfx('nope');
      captchaTries++;
      if (captchaTries >= 3) setTimeout(finishCaptcha, 700);
    });
  });
  $('#captchaGiveUp').addEventListener('click', finishCaptcha);
  $('#captchaNext').addEventListener('click', () => go('exam'));

  /* ---------- 3. Imtihon: qochqoq «Yo'q» tugmasi ---------- */
  const yesBtn = $('#yesBtn');
  const noBtn = $('#noBtn');
  const MAX_ESCAPES = 4;
  const ESCAPE_LINES = [
    `Voy! «<span lang="ar">لَا</span>» qochib ketdi 🏃`,
    `U ham bu javobni yoqtirmayapti shekilli 🤭`,
    `Arab tilida «<span lang="ar">لَا</span>» — harfi nafy.<br>Bu saytda esa — harfi firor 😄`,
    `Mayli-mayli... tugma charchadi 😮‍💨<br>Endi bosa olasiz — agar ko'ngil rozi bo'lsa`
  ];
  let escapes = 0, tired = false, lastEscape = 0, placeholder = null;

  function syncNoBtn() {
    if (noBtn.classList.contains('runaway')) noBtn.style.display = current === 'exam' ? '' : 'none';
  }

  function detachNoBtn() {
    const r = noBtn.getBoundingClientRect();
    placeholder = document.createElement('span');
    placeholder.className = 'no-placeholder btn';
    placeholder.style.width = r.width + 'px';
    placeholder.style.height = r.height + 'px';
    placeholder.style.padding = '0';
    noBtn.replaceWith(placeholder);
    document.body.appendChild(noBtn);
    noBtn.classList.add('runaway');
    noBtn.style.left = r.left + 'px';
    noBtn.style.top = r.top + 'px';
    void noBtn.offsetWidth;
  }

  function moveAway(px, py) {
    if (!noBtn.classList.contains('runaway')) detachNoBtn();
    const vw = window.innerWidth, vh = window.innerHeight;
    const r = noBtn.getBoundingClientRect();
    const w = r.width, h = r.height, m = 14;
    const yr = yesBtn.getBoundingClientRect();
    const minY = 140, maxY = Math.max(minY, vh - h - m), maxX = Math.max(m, vw - w - m);
    let best = null, bestD = -1;
    for (let i = 0; i < 40; i++) {
      const x = rnd(m, maxX), y = rnd(minY, maxY);
      // «Ha» tugmasi ustiga tushmasin
      if (x < yr.right + 10 && x + w > yr.left - 10 && y < yr.bottom + 10 && y + h > yr.top - 10) continue;
      if (Math.hypot(x - r.left, y - r.top) < 90) continue;
      const d = Math.hypot(x + w / 2 - px, y + h / 2 - py);
      if (d > Math.min(240, Math.max(vw, vh) * 0.32)) { best = { x, y }; break; }
      if (d > bestD) { bestD = d; best = { x, y }; }
    }
    if (!best) best = { x: rnd(m, maxX), y: rnd(minY, maxY) };
    noBtn.style.left = best.x + 'px';
    noBtn.style.top = best.y + 'px';
    noBtn.style.setProperty('--rot', rnd(-9, 9) + 'deg');
  }

  function tryEscape(px, py) {
    if (tired) return;
    moveAway(px, py);
    const now = performance.now();
    if (now - lastEscape < 420) return; // bitta yaqinlashish — bitta urinish
    lastEscape = now;
    escapes++;
    Sound.sfx('whoosh');
    toast(ESCAPE_LINES[escapes - 1]);
    yesBtn.style.setProperty('--grow', String(1 + escapes * 0.09));
    if (escapes >= MAX_ESCAPES) {
      tired = true;
      noBtn.classList.add('tired');
      noBtn.querySelector('.lbl').textContent = "Yo'q 😮‍💨";
    }
  }

  noBtn.addEventListener('touchstart', e => {
    if (tired) return;
    e.preventDefault();
    const t = e.touches[0];
    tryEscape(t.clientX, t.clientY);
  }, { passive: false });

  document.addEventListener('mousemove', e => {
    if (current !== 'exam' || tired) return;
    const r = noBtn.getBoundingClientRect();
    const cx = Math.max(r.left, Math.min(e.clientX, r.right));
    const cy = Math.max(r.top, Math.min(e.clientY, r.bottom));
    if (Math.hypot(e.clientX - cx, e.clientY - cy) < 30) tryEscape(e.clientX, e.clientY);
  });

  noBtn.addEventListener('click', e => {
    if (!tired) {
      e.preventDefault();
      const r = noBtn.getBoundingClientRect();
      tryEscape(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
      return;
    }
    if (crashing) return;
    G.noCaught = true;
    fakeCrash().then(() => go('reject'));
  });

  /* Soxta «sayt buzildi» ekrani */
  let crashing = false;
  async function fakeCrash() {
    crashing = true;
    const el = $('#crash'), pct = $('#crashPct'), joke = $('#crashJoke');
    joke.hidden = true;
    pct.textContent = '0';
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('show');
    Sound.sfx('nope');
    let p = 0;
    while (p < 100) {
      await wait(rnd(70, 190));
      p = Math.min(100, p + Math.round(rnd(4, 14)));
      pct.textContent = String(p);
    }
    await wait(350);
    joke.hidden = false;
    Sound.sfx('pop');
    await wait(1500);
    el.classList.remove('show');
    await wait(450);
    el.hidden = true;
    crashing = false;
  }

  /* Shpargalka */
  $('#crib').addEventListener('click', () => {
    const c = $('#crib');
    const open = !c.classList.contains('open');
    c.classList.toggle('open', open);
    c.setAttribute('aria-expanded', String(open));
    if (open) {
      Sound.sfx('pop');
      toast('Imtihonda shpargalka taqiqlangan... lekin bu safar mumkin 😉');
    }
  });

  window.addEventListener('resize', () => {
    if (!noBtn.classList.contains('runaway')) return;
    const r = noBtn.getBoundingClientRect();
    noBtn.style.left = Math.min(r.left, window.innerWidth - r.width - 14) + 'px';
    noBtn.style.top = Math.min(r.top, window.innerHeight - r.height - 14) + 'px';
  });

  yesBtn.addEventListener('click', () => go('final', escapes > 0 ? 'after' : 'first'));

  function resetExam() {
    escapes = 0; tired = false; lastEscape = 0;
    noBtn.classList.remove('runaway', 'tired');
    noBtn.removeAttribute('style');
    noBtn.querySelector('.lbl').textContent = "Yo'q";
    if (placeholder) { placeholder.replaceWith(noBtn); placeholder = null; }
    yesBtn.style.removeProperty('--grow');
  }

  /* ---------- 3b. Rad etish bo'limi ---------- */
  let runToken = 0;
  async function typeLine(ul, text, token) {
    const li = document.createElement('li');
    ul.appendChild(li);
    for (const ch of Array.from(text)) {
      if (token !== runToken) return false;
      li.textContent += ch;
      await wait(24);
    }
    return true;
  }

  async function runReject() {
    const token = ++runToken;
    const log = $('#rejectLog'), bar = $('#rejectBar');
    log.innerHTML = '';
    log.classList.remove('done');
    bar.style.transition = 'none';
    bar.style.width = '0';
    $('#twist').hidden = true;
    $('#twistFb').hidden = true;
    $('#twistNext').hidden = true;
    $$('#twistRow .btn').forEach(b => { b.disabled = false; b.style.opacity = ''; });

    const steps = [
      [() => typeLine(log, 'Arizangiz qabul qilindi ✓', token), 450],
      [() => typeLine(log, "Ko'rib chiqilmoqda...", token), 0],
      [async () => {
        void bar.offsetWidth;
        bar.style.transition = 'width 1.8s ease';
        bar.style.width = '100%';
        await wait(1900);
        return token === runToken;
      }, 0],
      [() => { Sound.sfx('nope'); return typeLine(log, 'Natija: ❌ Ariza rad etildi.', token); }, 450],
      [() => typeLine(log, "Sabab: «لَا» so'zi bu darsning lug'atida yo'q (1-darsga qarang 📚)", token), 700]
    ];
    for (const [fn, pause] of steps) {
      const ok = await fn();
      if (ok === false || token !== runToken) return;
      if (pause) await wait(pause);
    }
    log.classList.add('done');
    $('#twist').hidden = false;
  }

  let twistAnswer = null;
  $$('#twistRow .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      twistAnswer = btn.dataset.twist;
      const fb = $('#twistFb');
      if (twistAnswer === 'bala') {
        fb.innerHTML = `<b lang="ar">مُمْتَاز!</b> Inkor savolga «<span lang="ar">بَلَى</span>» — inkorni inkor qiladi. Ya'ni: <b>ROZIMAN</b> ✓<br>Ustozlikni yana bir bor isbotladingiz 🌟`;
        $('#twistNext').textContent = "Natijani ko'rish →";
        Sound.sfx('chime');
      } else {
        fb.innerHTML = `Ehtiyot bo'ling, ustoza: inkor savolga «<span lang="ar">نَعَم</span>» — «ha, rozi emasman» degani bo'lib qoladi. Bunday javob bu saytda qabul qilinmaydi 😌<br>Keling, variantlarni biroz osonlashtiraman...`;
        $('#twistNext').textContent = 'Davom etish →';
        Sound.sfx('nope');
      }
      $$('#twistRow .btn').forEach(b => { if (b !== btn) b.style.opacity = '.5'; });
      fb.hidden = true; void fb.offsetWidth; fb.hidden = false;
      $('#twistNext').hidden = false;
    });
  });
  $('#twistNext').addEventListener('click', () => {
    if (twistAnswer === 'bala') go('final', 'bala');
    else go('last');
  });

  /* ---------- 3c. Oxirgi variantlar ---------- */
  $$('[data-yes]').forEach(btn => btn.addEventListener('click', () => go('final', btn.dataset.yes)));

  const STUBBORN = ["Baribir yo'q", "Yo'q... balki", "O'ylab ko'raman 🤔", 'Hmm, ehtimol ha', 'Mayli, ha 😊'];
  const stubborn = $('#stubbornNo');
  let stubbornStep = 0, stubbornLock = false;
  function resetStubborn() {
    stubbornStep = 0; stubbornLock = false;
    stubborn.dataset.s = '0';
    stubborn.textContent = STUBBORN[0];
  }
  stubborn.addEventListener('click', () => {
    if (stubbornLock) return;
    stubbornStep = Math.min(stubbornStep + 1, STUBBORN.length - 1);
    stubborn.dataset.s = String(stubbornStep);
    stubborn.textContent = STUBBORN[stubbornStep];
    Sound.sfx('pop');
    if (stubbornStep === 1) toast("Bu tugma ham sizning tarafingizda emas 😄");
    if (stubbornStep === STUBBORN.length - 1) {
      stubbornLock = true;
      setTimeout(() => go('final', 'stubborn'), 1100);
    }
  });

  /* ---------- 4. Natija ---------- */
  const FINALS = {
    first: "Imtihondan birinchi urinishdayoq o'tdingiz! 🌟 Ustoz-da, ustoz.",
    after: "«Yo'q» tugmasi bilan biroz quvlashmachoq o'ynadingiz, lekin baribir to'g'ri javobni topdingiz 😄",
    bala: `Inkor savolga «<span lang="ar">بَلَى</span>» — demak, rozi. Grammatika ham, ko'ngil ham bir xil javob berdi ✨`,
    ha: 'Eng chiroyli javob — eng qisqa javob. Barakalla!',
    albatta: "«Albatta» — qat'iy va go'zal. Ilmli insonning javobi.",
    inshaalloh: "Inshaalloh. Eng go'zal kelishuv — Alloh nomi bilan boshlangani 🤲",
    damlayman: 'Kelishdik: choyni siz damlaysiz, piyolalarni men yuvaman 🫖',
    stubborn: "Uzoq o'yladingiz, lekin to'g'ri xulosaga keldingiz. Olimlarga xos sabr 😄"
  };

  function renderReport() {
    const sm = t => ` <small>(${t})</small>`;
    const rows = [
      ['Davomat', '5' + (G.roll === 'absent' ? sm("«kelmadim» desa ham") : '')],
      ["Lug'at", '5'],
      ['Grammatika', G.grammar === 'b' ? '4' + sm("fe'l qidirdi 😄") : '5'],
      ['Diktant', '5' + sm('avtokorrektor yordamida')],
      ['Maqollar', G.proverb === 'c' ? '3' + sm('muzlatkich 😳') : G.proverb === 'b' ? '5' + sm('choy ham kalit') : '5'],
      ['Choy qaytarish', '5+' + (G.breakSecs ? sm(`${G.breakSecs} soniyada`) : '')],
      ["«Yo'q»ni quvish", G.noCaught ? '3' + sm("ushladingiz, foydasi bo'lmadi 😄") : escapes > 0 ? '2' + sm('ushlay olmadingiz') : '—' + sm("kerak bo'lmadi")],
      ['Odob', '5+']
    ];
    $('#reportList').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  }

  function showFinal(choice) {
    renderReport();
    $('#finalLine').innerHTML = FINALS[choice] || FINALS.ha;
    $('#finalTea').innerHTML = teaSVG(true);
    Sound.sfx('fanfare');
    setTimeout(() => Confetti.burst(), 150);
  }

  $('#shareBtn').addEventListener('click', async () => {
    const text = 'Assalomu alaykum! Darsingizni tugatdim, ustoz 😄 Imtihondagi javobim: نَعَم ☕';
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Matn nusxalandi — endi Telegramga joylashtiring 😉");
    } catch (e) {
      toast("Shu sahifaning skrinshotini yuborsangiz ham bo'ladi 📸");
    }
  });

  $('#restartBtn').addEventListener('click', () => {
    runToken++;
    resetExam();
    flipped.clear();
    $$('.flash').forEach(c => c.classList.remove('flipped'));
    $$('#grammarOpts .opt').forEach(b => b.classList.remove('chosen'));
    $('#grammarFb').hidden = true;
    $('#grammarNext').hidden = true;
    // yangi sahnalar
    Object.assign(G, { roll: null, grammar: null, proverb: null, breakSecs: null, noCaught: false });
    $('#rollMark').textContent = '?'; $('#rollMark').classList.remove('ok');
    $$('#rollRow .btn').forEach(b => { b.style.opacity = ''; });
    ['#rollFb', '#rollNext', '#dictFb', '#dictNext', '#proverbFb', '#proverbNext', '#breakNext', '#qFb', '#qNext', '#captchaFb', '#captchaNext'].forEach(s => { $(s).hidden = true; });
    dictInput.value = ''; $('#dictCheck').hidden = false;
    $$('#proverbOpts .opt, #qOpts .opt').forEach(b => b.classList.remove('chosen', 'asked'));
    pours = 0; $('#breakLog').innerHTML = ''; $('#pourBtn').hidden = false; $('#pourBtn').textContent = 'Qaytarish · 0/3';
    asked.clear();
    captchaTries = 0; captchaDone = false; $$('#captcha button').forEach(t => t.classList.remove('seen')); $('#captchaGiveUp').hidden = false;
    $('#crib').classList.remove('open'); $('#crib').setAttribute('aria-expanded', 'false');
    idleShown.clear();
    go('intro');
  });

  /* =========================================================
     Kutilmagan hazillar: mudrash va boshqa oynaga o'tish
     ========================================================= */
  const quiet = () => current === 'intro' || current === 'final' || crashing;
  let lastAct = Date.now();
  const idleShown = new Set();
  ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'].forEach(ev =>
    document.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true }));
  setInterval(() => {
    if (document.hidden || quiet() || idleShown.has(current)) return;
    if (Date.now() - lastAct > 35000) {
      idleShown.add(current);
      lastAct = Date.now();
      toast('Ustoza, uxlab qolmadingizmi? 😴<br>Dars davom etyapti ☕', 3800);
      Sound.sfx('chime');
    }
  }, 5000);

  const baseTitle = document.title;
  const AWAY = [
    "Qaytdingizmi? Jurnalga «kechikdi» deb yozmadim, xavotir olmang 😄",
    'Yana qayoqqa ketdingiz? Choy sovib qoldi 🫖',
    "Talaba darsdan qochmaydi, ustoza 😄"
  ];
  let hiddenAt = 0, awayCount = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hiddenAt = Date.now();
      if (!quiet()) document.title = 'Ustoza, dars tugamadi! ☕';
    } else {
      document.title = baseTitle;
      if (!quiet() && Date.now() - hiddenAt > 2500) {
        toast(AWAY[awayCount % AWAY.length], 3600);
        awayCount++;
        lastAct = Date.now();
      }
    }
  });

  /* =========================================================
     Konfetti: sakkiz qirrali yulduzlar, oy, barglar, harflar
     ========================================================= */
  const Confetti = (() => {
    const cv = $('#confetti');
    const cx = cv.getContext('2d');
    const COLORS = ['#dcbf96', '#e6b9b5', '#bccbb6', '#aecac6', '#cdc4e0', '#f0dcc0'];
    const LETTERS = ['ن', 'ع', 'م', 'ش', 'ا', 'ي', 'ص', 'ح', 'ب'];
    const TYPES = ['star', 'star', 'crescent', 'leaf', 'letter', 'petal'];
    let W = 0, H = 0, parts = [], raf = null, rainUntil = 0;

    function size() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(x, y, burst) {
      const a = burst ? rnd(0, Math.PI * 2) : Math.PI / 2;
      const sp = burst ? rnd(3, 10) : rnd(0.6, 1.6);
      return {
        x, y,
        vx: burst ? Math.cos(a) * sp : rnd(-0.4, 0.4),
        vy: burst ? Math.sin(a) * sp - 4 : sp,
        g: burst ? 0.13 : 0.02,
        rot: rnd(0, 6.28), vr: rnd(-0.12, 0.12),
        s: rnd(6, 14),
        type: TYPES[(Math.random() * TYPES.length) | 0],
        color: COLORS[(Math.random() * COLORS.length) | 0],
        ch: LETTERS[(Math.random() * LETTERS.length) | 0],
        wob: rnd(0, 6.28)
      };
    }
    function draw(p) {
      const s = p.s;
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.globalAlpha = 0.92;
      cx.fillStyle = p.color;
      switch (p.type) {
        case 'star':
          cx.fillRect(-s / 2, -s / 2, s, s);
          cx.rotate(Math.PI / 4);
          cx.fillRect(-s / 2, -s / 2, s, s);
          break;
        case 'crescent':
          cx.beginPath(); cx.arc(0, 0, s * 0.62, 0, Math.PI * 2); cx.clip();
          cx.beginPath();
          cx.arc(0, 0, s * 0.62, 0, Math.PI * 2);
          cx.arc(s * 0.3, -s * 0.1, s * 0.5, 0, Math.PI * 2, true);
          cx.fill('evenodd');
          break;
        case 'leaf':
          cx.beginPath(); cx.ellipse(0, 0, s * 0.7, s * 0.3, 0, 0, Math.PI * 2); cx.fill();
          cx.strokeStyle = 'rgba(255,255,255,.65)'; cx.lineWidth = 0.8;
          cx.beginPath(); cx.moveTo(-s * 0.6, 0); cx.lineTo(s * 0.6, 0); cx.stroke();
          break;
        case 'petal':
          cx.beginPath();
          cx.moveTo(0, -s * 0.6);
          cx.quadraticCurveTo(s * 0.6, 0, 0, s * 0.6);
          cx.quadraticCurveTo(-s * 0.6, 0, 0, -s * 0.6);
          cx.fill();
          break;
        case 'letter':
          cx.font = `700 ${s * 1.8}px Amiri, serif`;
          cx.textAlign = 'center'; cx.textBaseline = 'middle';
          cx.fillText(p.ch, 0, 0);
          break;
      }
      cx.restore();
    }
    function frame() {
      cx.clearRect(0, 0, W, H);
      const now = performance.now();
      if (now < rainUntil && Math.random() < 0.45) parts.push(make(rnd(0, W), -20, false));
      parts = parts.filter(p => p.y < H + 40 && p.x > -80 && p.x < W + 80);
      for (const p of parts) {
        p.vy = Math.min(p.vy + p.g, 3.4);
        p.vx *= 0.985;
        p.wob += 0.05;
        p.x += p.vx + Math.sin(p.wob) * 0.4;
        p.y += p.vy;
        p.rot += p.vr;
        draw(p);
      }
      if (parts.length || now < rainUntil) raf = requestAnimationFrame(frame);
      else { raf = null; cx.clearRect(0, 0, W, H); }
    }
    function burst() {
      size();
      const n = reduceMotion ? 40 : 130;
      for (let i = 0; i < n; i++) parts.push(make(W / 2 + rnd(-30, 30), H * 0.32, true));
      rainUntil = performance.now() + (reduceMotion ? 0 : 6000);
      if (!raf) raf = requestAnimationFrame(frame);
    }
    window.addEventListener('resize', () => { if (raf) size(); });
    return { burst };
  })();

  /* ---------- Boshlash ---------- */
  buildSky();
  updateSteps(0);
  paintSound();
})();
