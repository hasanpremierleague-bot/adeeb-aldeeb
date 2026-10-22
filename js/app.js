// AWS Cloud Developing quiz site: routing, study sheets, quiz engine, progress.
(function () {
  'use strict';

  const MODULES = (window.MODULES || []).sort((a, b) => a.num - b.num);
  const app = document.getElementById('app');
  const banner = document.getElementById('banner');
  const userBox = document.getElementById('userBox');

  // Give every question a stable id and back-reference to its module
  const ALL = [];
  // id = module + hash of the question text, so adding or removing questions keeps saved progress pointing at the right ones
  const hash = (str) => { let h = 5381; for (let k = 0; k < str.length; k++) h = ((h << 5) + h + str.charCodeAt(k)) | 0; return (h >>> 0).toString(36); };
  MODULES.forEach((m) => m.questions.forEach((q) => {
    q.id = m.id + '-' + hash(q.q);
    q.mod = m.id;
    ALL.push(q);
  }));
  const modById = Object.fromEntries(MODULES.map((m) => [m.id, m]));

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const typeLabel = { mcq: 'Multiple choice', multi: 'Multiple answers', tf: 'True / False', match: 'Matching', dnd: 'Drag & drop', order: 'Drag & drop (order)' };
  const typeGroup = (t) => (t === 'order' ? 'dnd' : t === 'multi' ? 'mcq' : t);

  // ---------- theme ----------
  const themeBtn = document.getElementById('themeBtn');
  function applyTheme(t) { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  try { applyTheme(localStorage.getItem('quiz-theme')); } catch (e) { /* storage unavailable */ }
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('quiz-theme', next); } catch (e) { /* ignore */ }
  });

  // ---------- progress ----------
  let user = null;
  let progress = emptyProgress();
  function emptyProgress() { return { best: {}, last: {}, attempts: 0, wrong: {}, seen: {} }; }
  function storeKey() { return 'awsquiz-progress:' + (user ? user.uid : 'guest'); }
  function loadLocal() {
    try { progress = Object.assign(emptyProgress(), JSON.parse(localStorage.getItem(storeKey()) || '{}')); }
    catch (e) { progress = emptyProgress(); }
  }
  // combine two copies of progress (this device + cloud): best scores and seen questions from both,
  // latest scores and the mistakes list from whichever copy was updated more recently
  function mergeProgress(a, b) {
    const newer = (b.updated || 0) > (a.updated || 0) ? b : a;
    const best = Object.assign({}, a.best);
    Object.entries(b.best || {}).forEach(([k, v]) => { if (best[k] == null || v > best[k]) best[k] = v; });
    return Object.assign(emptyProgress(), {
      best,
      last: Object.assign({}, a.last, b.last, newer.last),
      attempts: Math.max(a.attempts || 0, b.attempts || 0),
      wrong: Object.assign({}, newer.wrong),
      seen: Object.assign({}, a.seen, b.seen),
      updated: Math.max(a.updated || 0, b.updated || 0)
    });
  }
  let syncFailed = false;
  async function pullRemote() {
    if (!user || !window.Auth.settings.syncProgressToFirestore) return false;
    try {
      const remote = await window.Auth.loadRemote(user.uid);
      if (remote) progress = mergeProgress(progress, Object.assign(emptyProgress(), remote));
      syncFailed = false;
      return true;
    } catch (e) { console.warn('Remote load failed', e); syncFailed = true; return false; }
  }
  function saveProgress() {
    progress.updated = Date.now();
    try { localStorage.setItem(storeKey(), JSON.stringify(progress)); } catch (e) { /* ignore */ }
    if (user) window.Auth.saveRemote(user.uid, progress).then(() => { if (syncFailed) { syncFailed = false; showBanner(); } })
      .catch((e) => { console.warn('Remote save failed', e); syncFailed = true; showBanner(); });
  }

  // ---------- auth wiring ----------
  let authReady = false;
  function renderUserBox() {
    if (!window.Auth.configured) { userBox.innerHTML = '<span class="pill">Guest</span>'; return; }
    if (user) {
      const name = user.displayName || user.email || 'Signed in';
      userBox.innerHTML = `<span class="pill" title="${esc(user.email || '')}">${esc(name)}</span><button class="btn btn-sm btn-ghost" id="logoutBtn">Sign out</button>`;
      document.getElementById('logoutBtn').onclick = () => window.Auth.signOut();
    } else {
      userBox.innerHTML = '<a class="btn btn-sm" href="#/login">Sign in</a>';
    }
  }
  function showBanner() {
    if (!window.Auth.configured) {
      banner.innerHTML = 'Login is not configured yet, so you are in <b>guest mode</b> and progress is saved in this browser. Fill in <code>js/firebase-config.js</code> to turn on Firebase login.';
      banner.classList.remove('hidden');
    } else if (window.Auth.loadError) {
      banner.innerHTML = 'Firebase could not load (check your config or network). Running in guest mode.';
      banner.classList.remove('hidden');
    } else if (user && syncFailed) {
      banner.innerHTML = 'Your scores could not be synced to the cloud, so they are only saved on this device for now. (Firestore may not be set up yet.)';
      banner.classList.remove('hidden');
    } else banner.classList.add('hidden');
  }
  // when you come back to this tab, pick up anything you did on another device
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || !user || location.hash === '#/play') return;
    if (await pullRemote()) { try { localStorage.setItem(storeKey(), JSON.stringify(progress)); } catch (e) { /* ignore */ } route(); }
    showBanner();
  });
  const startAuth = () => window.Auth.init(async (u) => {
    user = u;
    loadLocal();
    if (u) {
      if (await pullRemote()) saveProgress();
    }
    authReady = true;
    renderUserBox();
    showBanner();
    if (user && location.hash === '#/login') location.hash = '#/';
    else route();
  });

  function needsLogin() {
    return window.Auth.configured && !window.Auth.loadError && window.Auth.settings.requireLogin && !user;
  }

  // ---------- router ----------
  let quiz = null; // active quiz state
  window.addEventListener('hashchange', route);
  function route() {
    if (!authReady) { app.innerHTML = '<div class="loading">Loading…</div>'; return; }
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    document.querySelectorAll('#topnav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#/' + (parts[0] || '')));
    if (parts[0] === 'login') return viewLogin();
    if (needsLogin()) { location.hash = '#/login'; return; }
    window.scrollTo(0, 0);
    switch (parts[0]) {
      case undefined: return viewHome();
      case 'study': return parts[1] ? viewStudy(parts[1]) : viewStudyIndex();
      case 'quiz': return viewSetup('lesson', parts[1]);
      case 'important': return viewSetup('important');
      case 'final': return viewSetup('final');
      case 'mistakes': return viewSetup('mistakes');
      case 'play': return quiz ? renderQuestion() : (location.hash = '#/');
      case 'results': return quiz && quiz.done ? viewResults() : (location.hash = '#/');
      default: return viewHome();
    }
  }

  // ---------- login ----------
  function viewLogin() {
    if (!window.Auth.configured) {
      app.innerHTML = `<section class="card narrow"><h1>Sign in</h1><p>Login is not set up yet. Add your Firebase settings to <code>js/firebase-config.js</code> (see README.md). Until then you can use the whole site as a guest.</p><a class="btn" href="#/">Continue as guest</a></section>`;
      return;
    }
    if (user) { location.hash = '#/'; return; }
    let mode = 'signin';
    const draw = () => {
      const up = mode === 'signup';
      app.innerHTML = `
      <section class="card narrow auth">
        <div class="auth-logo">☁️</div>
        <h1>${up ? 'Create your account' : 'Welcome back'}</h1>
        <p class="muted">${up ? 'Sign up to track your quiz scores.' : 'Sign in to continue studying.'}</p>
        <form id="authForm" class="form">
          ${up ? '<label>Name<input name="name" autocomplete="name" placeholder="Your name"></label>' : ''}
          <label>Email<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label>
          <label>Password<input name="password" type="password" required minlength="6" autocomplete="${up ? 'new-password' : 'current-password'}" placeholder="At least 6 characters"></label>
          <div id="authMsg" class="form-msg"></div>
          <button class="btn btn-block" type="submit">${up ? 'Create account' : 'Sign in'}</button>
        </form>
        ${window.Auth.settings.enableGoogleSignIn ? '<div class="divider"><span>or</span></div><button class="btn btn-block btn-ghost" id="googleBtn"><b>G</b>&nbsp; Continue with Google</button>' : ''}
        <div class="auth-links">
          ${up ? '<a href="#" id="toggleMode">Already have an account? Sign in</a>' : '<a href="#" id="toggleMode">New here? Create an account</a><a href="#" id="resetBtn">Forgot password?</a>'}
        </div>
      </section>`;
      const msg = document.getElementById('authMsg');
      const say = (t, ok) => { msg.textContent = t; msg.className = 'form-msg ' + (ok ? 'ok' : 'err'); };
      document.getElementById('toggleMode').onclick = (e) => { e.preventDefault(); mode = up ? 'signin' : 'signup'; draw(); };
      const resetBtn = document.getElementById('resetBtn');
      if (resetBtn) resetBtn.onclick = async (e) => {
        e.preventDefault();
        const email = document.querySelector('[name=email]').value.trim();
        if (!email) return say('Type your email above first, then click "Forgot password?".');
        try { await window.Auth.reset(email); say('Password reset email sent.', true); } catch (err) { say(window.Auth.friendly(err)); }
      };
      const g = document.getElementById('googleBtn');
      if (g) g.onclick = async () => { try { await window.Auth.google(); } catch (err) { say(window.Auth.friendly(err)); } };
      document.getElementById('authForm').onsubmit = async (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        say('Please wait…', true);
        try {
          if (up) await window.Auth.signUp(f.get('email'), f.get('password'), (f.get('name') || '').trim());
          else await window.Auth.signIn(f.get('email'), f.get('password'));
        } catch (err) { say(window.Auth.friendly(err)); }
      };
    };
    draw();
  }

  // ---------- home ----------
  function viewHome() {
    const bests = MODULES.map((m) => progress.best[m.id]).filter((v) => v != null);
    const avg = bests.length ? Math.round(bests.reduce((a, b) => a + b, 0) / bests.length) : null;
    const importantCount = ALL.filter((q) => q.i).length;
    const wrongCount = Object.keys(progress.wrong).filter((id) => ALL.some((q) => q.id === id)).length;
    const hello = user ? `Hi ${esc((user.displayName || user.email || '').split(/[ @]/)[0])}, ready to study?` : 'Ready to study?';
    app.innerHTML = `
      <section class="hero">
        <div>
          <h1>${hello}</h1>
          <p class="muted">Study sheets and ${ALL.length} quiz questions (multiple choice, multiple answers, true/false, matching and drag &amp; drop) covering the IT7101 midterm scope: Modules 3–8 of AWS Academy Cloud Developing, code slides excluded.</p>
        </div>
        <div class="stats">
          <div class="stat"><b>${MODULES.length}</b><span>lessons</span></div>
          <div class="stat"><b>${ALL.length}</b><span>questions</span></div>
          <div class="stat"><b>${avg == null ? '–' : avg + '%'}</b><span>avg best score</span></div>
        </div>
      </section>

      <section class="special-grid">
        <a class="special imp" href="#/important"><span class="sp-icon">⭐</span><div><h3>Important &amp; probable questions</h3><p>${importantCount} hand-picked high-yield questions across all lessons.</p></div></a>
        <a class="special fin" href="#/final"><span class="sp-icon">🏁</span><div><h3>Final exam (all lessons)</h3><p>Mixed questions from every lesson, graded at the end.</p></div></a>
        <a class="special mis" href="#/mistakes"><span class="sp-icon">🔁</span><div><h3>Review my mistakes</h3><p>${wrongCount ? wrongCount + ' questions you got wrong recently.' : 'Nothing yet. Questions you miss show up here.'}</p></div></a>
      </section>

      <h2 class="section-title">Lessons</h2>
      <section class="lesson-grid">
        ${MODULES.map((m) => {
          const best = progress.best[m.id];
          return `<article class="lesson">
            <div class="lesson-head"><span class="lesson-icon">${m.icon}</span><span class="lesson-num">Module ${m.num}</span></div>
            <h3>${esc(m.title)}</h3>
            <p class="muted small">${m.questions.length} questions · ${m.scope}</p>
            <div class="meter"><div style="width:${best || 0}%"></div></div>
            <p class="small">${best == null ? 'Not attempted yet' : 'Best score: <b>' + best + '%</b>'}</p>
            <div class="lesson-actions"><a class="btn btn-ghost btn-sm" href="#/study/${m.id}">📖 Study sheet</a><a class="btn btn-sm" href="#/quiz/${m.id}">📝 Quiz</a></div>
          </article>`;
        }).join('')}
      </section>`;
  }

  // ---------- study ----------
  function viewStudyIndex() {
    app.innerHTML = `<h1>Study sheets</h1><p class="muted">One summary per lesson. Read it, then take the lesson quiz.</p>
      <section class="lesson-grid">${MODULES.map((m) => `<a class="lesson link" href="#/study/${m.id}"><div class="lesson-head"><span class="lesson-icon">${m.icon}</span><span class="lesson-num">Module ${m.num}</span></div><h3>${esc(m.title)}</h3><p class="small muted">Open study sheet →</p></a>`).join('')}</section>`;
  }
  function viewStudy(id) {
    const m = modById[id];
    if (!m) { location.hash = '#/study'; return; }
    const i = MODULES.indexOf(m);
    const prev = MODULES[i - 1], next = MODULES[i + 1];
    app.innerHTML = `
      <div class="crumbs"><a href="#/study">Study sheets</a> / Module ${m.num}</div>
      <article class="study card">
        <div class="study-head"><span class="lesson-icon big">${m.icon}</span><div><p class="lesson-num">Module ${m.num}</p><h1>${esc(m.title)}</h1><span class="scope">Midterm scope: ${m.scope}</span>${m.note ? `<p class="note">${esc(m.note)}</p>` : ''}</div></div>
        <div class="study-body">${m.study}</div>
        <div class="study-foot"><a class="btn" href="#/quiz/${m.id}">Take the Module ${m.num} quiz (${m.questions.length} questions) →</a>
          <button class="btn btn-ghost" onclick="window.print()">🖨️ Print</button></div>
      </article>
      <div class="pager">${prev ? `<a href="#/study/${prev.id}">← Module ${prev.num}</a>` : '<span></span>'}${next ? `<a href="#/study/${next.id}">Module ${next.num} →</a>` : '<span></span>'}</div>`;
  }

  // ---------- quiz setup ----------
  function viewSetup(kind, id) {
    let title, sub, pool, defaultCount, defaultMode, showMods = false;
    if (kind === 'lesson') {
      const m = modById[id];
      if (!m) { location.hash = '#/'; return; }
      title = `Module ${m.num} quiz`; sub = m.title; pool = m.questions; defaultCount = 'all'; defaultMode = 'practice';
    } else if (kind === 'important') {
      title = 'Important & probable questions'; sub = 'High-yield questions picked from every lesson: key numbers, definitions, comparisons and exam-style scenarios.';
      pool = ALL.filter((q) => q.i); defaultCount = 'all'; defaultMode = 'practice'; showMods = true;
    } else if (kind === 'final') {
      title = 'Final exam: all lessons'; sub = 'A mixed exam drawn evenly from every lesson. Answers are revealed at the end, like the real thing.';
      pool = ALL; defaultCount = '60'; defaultMode = 'exam'; showMods = true;
    } else {
      title = 'Review my mistakes'; sub = 'Questions you answered wrong. Get them right to clear them from this list.';
      pool = ALL.filter((q) => progress.wrong[q.id]); defaultCount = 'all'; defaultMode = 'practice'; showMods = true;
      if (!pool.length) {
        app.innerHTML = `<section class="card narrow"><h1>${title}</h1><p>No mistakes saved yet. Take a quiz and any question you miss will show up here.</p><a class="btn" href="#/">Back home</a></section>`;
        return;
      }
    }
    const counts = ['10', '20', '30', '60', 'all'];
    const typeCount = (t) => pool.filter((q) => typeGroup(q.t) === t).length;
    app.innerHTML = `
      <section class="card setup">
        <div class="crumbs"><a href="#/">Home</a> / ${esc(title)}</div>
        <h1>${esc(title)}</h1>
        <p class="muted">${esc(sub)}</p>
        <form id="setupForm" class="form">
          ${showMods ? `<fieldset><legend>Lessons</legend><div class="chips">${MODULES.map((m) => `<label class="chip"><input type="checkbox" name="mod" value="${m.id}" checked> M${m.num} ${esc(m.short)}</label>`).join('')}</div></fieldset>` : ''}
          <fieldset><legend>Question types</legend><div class="chips">
            ${['mcq', 'tf', 'match', 'dnd'].map((t) => `<label class="chip"><input type="checkbox" name="type" value="${t}" checked> ${typeLabel[t]} <span class="muted">(${typeCount(t)})</span></label>`).join('')}
          </div></fieldset>
          <fieldset><legend>Number of questions</legend><div class="chips">
            ${counts.map((c) => `<label class="chip"><input type="radio" name="count" value="${c}" ${c === defaultCount ? 'checked' : ''}> ${c === 'all' ? 'All' : c}</label>`).join('')}
          </div></fieldset>
          <fieldset><legend>Mode</legend><div class="chips">
            <label class="chip"><input type="radio" name="mode" value="practice" ${defaultMode === 'practice' ? 'checked' : ''}> Practice: see the answer after each question</label>
            <label class="chip"><input type="radio" name="mode" value="exam" ${defaultMode === 'exam' ? 'checked' : ''}> Exam: answers revealed at the end</label>
          </div></fieldset>
          <p class="small muted" id="poolInfo"></p>
          <button class="btn btn-lg" type="submit">Start quiz →</button>
        </form>
      </section>`;
    const form = document.getElementById('setupForm');
    const selected = () => {
      const fd = new FormData(form);
      const types = fd.getAll('type');
      const mods = showMods ? fd.getAll('mod') : null;
      return pool.filter((q) => types.includes(typeGroup(q.t)) && (!mods || mods.includes(q.mod)));
    };
    const info = () => { document.getElementById('poolInfo').textContent = `${selected().length} questions match these settings.`; };
    form.addEventListener('change', info); info();
    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      let qs = selected();
      if (!qs.length) { alertBox('Pick at least one lesson and question type.'); return; }
      const count = fd.get('count');
      if (count !== 'all') qs = kind === 'final' ? stratified(qs, +count) : shuffle(qs).slice(0, +count);
      startQuiz({ title, kind, key: kind === 'lesson' ? id : kind, mode: fd.get('mode'), questions: shuffle(qs) });
    };
  }
  function alertBox(t) { const p = document.getElementById('poolInfo'); if (p) { p.textContent = t; p.classList.add('err'); } }
  // Even spread across lessons for the final exam
  function stratified(qs, n) {
    const by = {};
    shuffle(qs).forEach((q) => (by[q.mod] = by[q.mod] || []).push(q));
    const mods = Object.keys(by);
    const out = [];
    while (out.length < n && mods.some((m) => by[m].length)) mods.forEach((m) => { if (out.length < n && by[m].length) out.push(by[m].pop()); });
    return out;
  }

  // ---------- quiz engine ----------
  function prepare(q) {
    const p = { src: q };
    if (q.t === 'mcq') { p.correct = q.o[0]; p.options = shuffle(q.o); }
    if (q.t === 'multi') { p.correct = q.o.slice(0, q.k); p.options = shuffle(q.o); }
    if (q.t === 'match') { p.left = shuffle(q.p.map((x) => x[0])); p.rights = shuffle([...new Set(q.p.map((x) => x[1]).concat(q.x || []))]); p.key = Object.fromEntries(q.p); }
    if (q.t === 'dnd') { p.left = shuffle(q.p.map((x) => x[0])); p.buckets = [...new Set(q.p.map((x) => x[1]))]; p.key = Object.fromEntries(q.p); }
    if (q.t === 'order') { do { p.start = shuffle(q.s); } while (q.s.length > 1 && p.start.join('|') === q.s.join('|')); }
    return p;
  }
  function startQuiz(opts) {
    quiz = Object.assign(opts, { items: opts.questions.map(prepare), idx: 0, answers: [], checked: [], done: false, started: Date.now() });
    if (location.hash === '#/play') renderQuestion();
    else location.hash = '#/play';
  }
  function isCorrect(item, ans) {
    const q = item.src;
    if (ans == null) return false;
    if (q.t === 'mcq') return ans === item.correct;
    if (q.t === 'multi') return ans.length === item.correct.length && item.correct.every((o) => ans.includes(o));
    if (q.t === 'tf') return ans === q.a;
    if (q.t === 'match' || q.t === 'dnd') return item.left.every((l) => ans[l] === item.key[l]);
    if (q.t === 'order') return ans.join('|') === q.s.join('|');
    return false;
  }
  function answered(item, ans) {
    if (ans == null) return false;
    if (item.src.t === 'match' || item.src.t === 'dnd') return item.left.every((l) => ans[l]);
    if (item.src.t === 'multi') return ans.length > 0;
    return true;
  }

  function renderQuestion() {
    const item = quiz.items[quiz.idx];
    const q = item.src;
    const m = modById[q.mod];
    if (q.t === 'order' && !quiz.answers[quiz.idx]) quiz.answers[quiz.idx] = item.start.slice();
    const ans = quiz.answers[quiz.idx];
    const checked = quiz.mode === 'practice' && quiz.checked[quiz.idx];
    const total = quiz.items.length;
    const doneCount = quiz.answers.filter((a, i) => answered(quiz.items[i], a)).length;

    let body = '';
    if (q.t === 'mcq') {
      body = `<div class="options">${item.options.map((o, i) => {
        let cls = ans === o ? 'selected' : '';
        if (checked) cls = o === item.correct ? 'correct' : (ans === o ? 'wrong' : 'dim');
        return `<button class="option ${cls}" data-val="${esc(o)}" ${checked ? 'disabled' : ''}><span class="key">${'ABCDEFG'[i]}</span><span>${esc(o)}</span></button>`;
      }).join('')}</div>`;
    } else if (q.t === 'multi') {
      const a = ans || [];
      body = `<p class="small muted dnd-help">Select all that apply (more than one answer is correct).</p><div class="options">${item.options.map((o, i) => {
        const on = a.includes(o), right = item.correct.includes(o);
        let cls = on ? 'selected' : '';
        if (checked) cls = right ? (on ? 'correct' : 'correct missed') : (on ? 'wrong' : 'dim');
        return `<button class="option multi ${cls}" data-multi="${esc(o)}" ${checked ? 'disabled' : ''}><span class="key">${on ? '✓' : 'ABCDEFG'[i]}</span><span>${esc(o)}</span></button>`;
      }).join('')}</div>`;
    } else if (q.t === 'tf') {
      body = `<div class="options tf">${[true, false].map((v, i) => {
        let cls = ans === v ? 'selected' : '';
        if (checked) cls = v === q.a ? 'correct' : (ans === v ? 'wrong' : 'dim');
        return `<button class="option ${cls}" data-tf="${v}" ${checked ? 'disabled' : ''}><span class="key">${i ? 'F' : 'T'}</span><span>${v ? 'True' : 'False'}</span></button>`;
      }).join('')}</div>`;
    } else if (q.t === 'dnd') {
      const a = ans || {};
      const chip = (l) => {
        let cls = quiz.sel === l ? 'sel' : '';
        if (checked) cls = a[l] === item.key[l] ? 'correct' : 'wrong';
        return `<span class="dchip ${cls}" draggable="${!checked}" data-chip="${esc(l)}">${esc(l)}${checked && a[l] !== item.key[l] ? `<small>→ ${esc(item.key[l])}</small>` : ''}</span>`;
      };
      const pool = item.left.filter((l) => !a[l]);
      body = `<p class="small muted dnd-help">Drag each item into the right box, or tap an item and then tap a box.</p>
        <div class="dpool dzone" data-zone="">${pool.length ? pool.map(chip).join('') : '<span class="muted small">All items placed</span>'}</div>
        <div class="dbuckets">${item.buckets.map((b) => `<div class="dbucket dzone" data-zone="${esc(b)}"><div class="dbucket-title">${esc(b)}</div><div class="dbucket-body">${item.left.filter((l) => a[l] === b).map(chip).join('')}</div></div>`).join('')}</div>`;
    } else if (q.t === 'order') {
      body = `<p class="small muted dnd-help">Drag the items (or use the arrows) into the correct order, first at the top.</p>
        <ol class="dorder">${ans.map((it, i) => {
          let cls = '';
          if (checked) cls = it === q.s[i] ? 'correct' : 'wrong';
          return `<li class="dorder-item ${cls}" draggable="${!checked}" data-pos="${i}"><span class="grip">⠿</span><span class="otext">${esc(it)}${checked && it !== q.s[i] ? `<small>Should be: ${esc(q.s[i])}</small>` : ''}</span>
            ${checked ? '' : `<span class="oarrows"><button class="obtn" data-up="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">▲</button><button class="obtn" data-down="${i}" ${i === ans.length - 1 ? 'disabled' : ''} aria-label="Move down">▼</button></span>`}</li>`;
        }).join('')}</ol>`;
    } else {
      const a = ans || {};
      body = `<div class="match">${item.left.map((l, i) => {
        let cls = '';
        if (checked) cls = a[l] === item.key[l] ? 'correct' : 'wrong';
        return `<div class="match-row ${cls}"><div class="match-left">${esc(l)}</div>
          <select data-left="${esc(l)}" ${checked ? 'disabled' : ''} aria-label="Match for ${esc(l)}">
            <option value="">Choose…</option>
            ${item.rights.map((r) => `<option ${a[l] === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}
          </select>
          ${checked && a[l] !== item.key[l] ? `<div class="match-fix">✔ ${esc(item.key[l])}</div>` : ''}</div>`;
      }).join('')}</div>`;
    }

    let feedback = '';
    if (checked) {
      const ok = isCorrect(item, ans);
      feedback = `<div class="feedback ${ok ? 'ok' : 'bad'}"><b>${ok ? '✅ Correct!' : '❌ Not quite.'}</b>
        ${!ok && q.t === 'tf' ? ` The answer is <b>${q.a ? 'True' : 'False'}</b>.` : ''}
        ${!ok && q.t === 'mcq' ? ` The answer is <b>${esc(item.correct)}</b>.` : ''}
        ${!ok && q.t === 'multi' ? ` The answers are <b>${item.correct.map(esc).join('</b> and <b>')}</b>.` : ''}
        ${q.e ? `<p>${esc(q.e)}</p>` : ''}</div>`;
    }

    const canCheck = answered(item, ans);
    const last = quiz.idx === total - 1;
    let actions;
    if (quiz.mode === 'practice') {
      actions = checked
        ? `<button class="btn" id="nextBtn">${last ? 'See results →' : 'Next question →'}</button>`
        : `<button class="btn" id="checkBtn" ${canCheck ? '' : 'disabled'}>Check answer</button><button class="btn btn-ghost" id="skipBtn">${last ? 'Finish' : 'Skip'}</button>`;
    } else {
      actions = `<button class="btn btn-ghost" id="prevBtn" ${quiz.idx === 0 ? 'disabled' : ''}>← Back</button>
        ${last ? `<button class="btn" id="submitBtn">Submit exam (${doneCount}/${total} answered)</button>` : `<button class="btn" id="nextBtn">Next →</button>`}`;
    }

    app.innerHTML = `
      <section class="quiz">
        <div class="quiz-top">
          <div><p class="lesson-num">${esc(quiz.title)}</p><p class="small muted">Question ${quiz.idx + 1} of ${total} · ${quiz.mode === 'exam' ? 'Exam mode' : 'Practice mode'}</p></div>
          <button class="btn btn-sm btn-ghost" id="quitBtn">${quiz.mode === 'exam' ? 'Submit now' : 'End quiz'}</button>
        </div>
        <div class="progress"><div style="width:${pct(quiz.idx + (checked ? 1 : 0), total)}%"></div></div>
        <article class="card qcard">
          <div class="qmeta"><span class="tag">${typeLabel[q.t]}</span><span class="tag ghost">M${m.num} · ${esc(q.c || m.short)}</span>${q.i ? '<span class="tag star">⭐ Important</span>' : ''}</div>
          <h2 class="qtext">${esc(q.q)}</h2>
          ${body}
          ${feedback}
          <div class="qactions">${actions}</div>
        </article>
        ${quiz.mode === 'exam' ? `<div class="dots">${quiz.items.map((it, i) => `<button class="dot ${i === quiz.idx ? 'cur' : ''} ${answered(it, quiz.answers[i]) ? 'done' : ''}" data-go="${i}" title="Question ${i + 1}">${i + 1}</button>`).join('')}</div>` : ''}
        <p class="small muted center hint">Keys: ${q.t === 'mcq' || q.t === 'multi' ? 'A–D to choose, ' : q.t === 'tf' ? 'T / F to choose, ' : ''}Enter to ${quiz.mode === 'practice' ? 'check / continue' : 'go next'}.</p>
      </section>`;

    // events
    app.querySelectorAll('.option[data-val]').forEach((b) => b.onclick = () => { quiz.answers[quiz.idx] = b.dataset.val; renderQuestion(); });
    app.querySelectorAll('.option[data-multi]').forEach((b) => b.onclick = () => {
      const a = (quiz.answers[quiz.idx] || []).slice();
      const v = b.dataset.multi, k = a.indexOf(v);
      if (k >= 0) a.splice(k, 1); else a.push(v);
      quiz.answers[quiz.idx] = a.length ? a : undefined;
      renderQuestion();
    });
    app.querySelectorAll('.option[data-tf]').forEach((b) => b.onclick = () => { quiz.answers[quiz.idx] = b.dataset.tf === 'true'; renderQuestion(); });
    app.querySelectorAll('select[data-left]').forEach((s) => s.onchange = () => {
      const a = Object.assign({}, quiz.answers[quiz.idx] || {});
      a[s.dataset.left] = s.value || undefined;
      quiz.answers[quiz.idx] = a;
      renderQuestion();
      const again = app.querySelector(`select[data-left="${CSS.escape(s.dataset.left)}"]`);
      if (again) again.focus();
    });
    if (q.t === 'dnd' && !checked) wireDnd(item);
    if (q.t === 'order' && !checked) wireOrder();
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
    on('checkBtn', () => { quiz.checked[quiz.idx] = true; renderQuestion(); });
    on('skipBtn', () => { quiz.checked[quiz.idx] = true; quiz.answers[quiz.idx] = quiz.answers[quiz.idx] ?? null; advance(); });
    on('nextBtn', advance);
    on('prevBtn', () => { quiz.idx--; renderQuestion(); });
    on('submitBtn', finish);
    on('quitBtn', () => { if (confirmEnd()) finish(); });
    app.querySelectorAll('.dot').forEach((d) => d.onclick = () => { quiz.idx = +d.dataset.go; renderQuestion(); });
  }
  // drag & drop into buckets (mouse drag, or tap chip then tap box)
  function wireDnd(item) {
    const place = (l, zone) => {
      const a = Object.assign({}, quiz.answers[quiz.idx] || {});
      if (zone) a[l] = zone; else delete a[l];
      quiz.answers[quiz.idx] = a;
      quiz.sel = null;
      renderQuestion();
    };
    app.querySelectorAll('.dchip').forEach((c) => {
      c.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', c.dataset.chip); c.classList.add('dragging'); });
      c.addEventListener('dragend', () => c.classList.remove('dragging'));
      c.addEventListener('click', (e) => {
        e.stopPropagation();
        const zone = c.closest('.dzone');
        // tapping a chip that sits in a box while another chip is selected drops the selected one into that box
        if (quiz.sel && quiz.sel !== c.dataset.chip && zone && zone.dataset.zone) return place(quiz.sel, zone.dataset.zone);
        quiz.sel = quiz.sel === c.dataset.chip ? null : c.dataset.chip;
        renderQuestion();
      });
    });
    app.querySelectorAll('.dzone').forEach((z) => {
      z.addEventListener('dragover', (e) => { e.preventDefault(); z.classList.add('over'); });
      z.addEventListener('dragleave', () => z.classList.remove('over'));
      z.addEventListener('drop', (e) => { e.preventDefault(); const l = e.dataTransfer.getData('text/plain'); if (item.left.includes(l)) place(l, z.dataset.zone); });
      z.addEventListener('click', () => { if (quiz.sel) place(quiz.sel, z.dataset.zone); });
    });
  }
  // drag & drop ordering (mouse drag or arrow buttons)
  function wireOrder() {
    const move = (from, to) => {
      const arr = quiz.answers[quiz.idx].slice();
      const [x] = arr.splice(from, 1);
      arr.splice(to, 0, x);
      quiz.answers[quiz.idx] = arr;
      renderQuestion();
    };
    app.querySelectorAll('[data-up]').forEach((b) => b.onclick = () => move(+b.dataset.up, +b.dataset.up - 1));
    app.querySelectorAll('[data-down]').forEach((b) => b.onclick = () => move(+b.dataset.down, +b.dataset.down + 1));
    app.querySelectorAll('.dorder-item').forEach((li) => {
      li.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', li.dataset.pos); li.classList.add('dragging'); });
      li.addEventListener('dragend', () => li.classList.remove('dragging'));
      li.addEventListener('dragover', (e) => { e.preventDefault(); li.classList.add('over'); });
      li.addEventListener('dragleave', () => li.classList.remove('over'));
      li.addEventListener('drop', (e) => { e.preventDefault(); const from = +e.dataTransfer.getData('text/plain'); const to = +li.dataset.pos; if (from !== to) move(from, to); });
    });
  }
  function confirmEnd() {
    const unanswered = quiz.items.filter((it, i) => !answered(it, quiz.answers[i])).length;
    return !unanswered || window.confirm(`End now? ${unanswered} unanswered question(s) will count as wrong.`);
  }
  function advance() {
    if (quiz.idx < quiz.items.length - 1) { quiz.idx++; renderQuestion(); }
    else finish();
  }

  document.addEventListener('keydown', (e) => {
    if (!quiz || quiz.done || location.hash !== '#/play' || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
    const item = quiz.items[quiz.idx];
    const k = e.key.toLowerCase();
    if ((item.src.t === 'mcq' || item.src.t === 'multi') && 'abcdefg'.includes(k) && k.length === 1) { const b = app.querySelectorAll('.option[data-val], .option[data-multi]')[k.charCodeAt(0) - 97]; if (b && !b.disabled) b.click(); }
    if (item.src.t === 'tf' && (k === 't' || k === 'f')) { const b = app.querySelector(`.option[data-tf="${k === 't'}"]`); if (b && !b.disabled) b.click(); }
    if (k === 'enter') { const b = document.getElementById('nextBtn') || document.getElementById('checkBtn') || document.getElementById('submitBtn'); if (b && !b.disabled) { e.preventDefault(); b.click(); } }
  });

  function finish() {
    quiz.done = true;
    quiz.results = quiz.items.map((it, i) => isCorrect(it, quiz.answers[i]));
    const score = pct(quiz.results.filter(Boolean).length, quiz.items.length);
    quiz.score = score;
    // update progress
    progress.attempts++;
    const k = quiz.key;
    progress.last[k] = score;
    if (progress.best[k] == null || score > progress.best[k]) progress.best[k] = score;
    quiz.items.forEach((it, i) => {
      progress.seen[it.src.id] = 1;
      if (quiz.results[i]) delete progress.wrong[it.src.id];
      else progress.wrong[it.src.id] = 1;
    });
    saveProgress();
    location.hash = '#/results';
  }

  // ---------- results ----------
  function viewResults() {
    const right = quiz.results.filter(Boolean).length;
    const total = quiz.items.length;
    const byTopic = {};
    quiz.items.forEach((it, i) => {
      const key = quiz.kind === 'lesson' ? (it.src.c || 'General') : 'M' + modById[it.src.mod].num + ' ' + modById[it.src.mod].short;
      byTopic[key] = byTopic[key] || [0, 0];
      byTopic[key][1]++;
      if (quiz.results[i]) byTopic[key][0]++;
    });
    const verdict = quiz.score >= 90 ? 'Excellent, you are ready! 🎉' : quiz.score >= 75 ? 'Good job. Review the misses below.' : quiz.score >= 50 ? 'Getting there. Re-read the study sheet and retry.' : 'Keep studying: read the study sheet, then try again.';
    const weak = Object.entries(byTopic).filter(([, v]) => v[0] / v[1] < 0.7).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);
    const mins = Math.max(1, Math.round((Date.now() - quiz.started) / 60000));
    app.innerHTML = `
      <section class="card results">
        <p class="lesson-num">${esc(quiz.title)}</p>
        <div class="score-ring" style="--p:${quiz.score}"><span>${quiz.score}%</span></div>
        <h1>${right} / ${total} correct</h1>
        <p class="muted">${verdict} · about ${mins} min</p>
        <div class="qactions center">
          <button class="btn" id="retryBtn">Retry same questions</button>
          ${quiz.results.some((r) => !r) ? '<button class="btn btn-ghost" id="retryWrongBtn">Retry only the ones I missed</button>' : ''}
          ${quiz.kind === 'lesson' ? `<a class="btn btn-ghost" href="#/study/${quiz.key}">Open study sheet</a>` : ''}
          <a class="btn btn-ghost" href="#/">Home</a>
        </div>
      </section>
      <section class="card">
        <h2>Breakdown by ${quiz.kind === 'lesson' ? 'topic' : 'lesson'}</h2>
        <div class="breakdown">${Object.entries(byTopic).map(([k, v]) => `<div class="brow"><span>${esc(k)}</span><div class="meter"><div class="${v[0] / v[1] < 0.7 ? 'low' : ''}" style="width:${pct(v[0], v[1])}%"></div></div><b>${v[0]}/${v[1]}</b></div>`).join('')}</div>
        ${weak.length ? `<p class="small">Focus on: <b>${weak.slice(0, 5).map(([k]) => esc(k)).join(', ')}</b></p>` : ''}
      </section>
      <section class="card">
        <div class="review-head"><h2>Review answers</h2><label class="chip"><input type="checkbox" id="onlyWrong" ${right < total ? 'checked' : ''}> Show only wrong</label></div>
        <div id="reviewList"></div>
      </section>`;
    const drawReview = () => {
      const only = document.getElementById('onlyWrong').checked;
      document.getElementById('reviewList').innerHTML = quiz.items.map((it, i) => {
        if (only && quiz.results[i]) return '';
        return reviewItem(it, quiz.answers[i], quiz.results[i], i);
      }).join('') || '<p class="muted">No wrong answers. 🎉</p>';
    };
    document.getElementById('onlyWrong').onchange = drawReview;
    drawReview();
    document.getElementById('retryBtn').onclick = () => startQuiz({ title: quiz.title, kind: quiz.kind, key: quiz.key, mode: quiz.mode, questions: shuffle(quiz.items.map((x) => x.src)) });
    const rw = document.getElementById('retryWrongBtn');
    if (rw) rw.onclick = () => startQuiz({ title: quiz.title + ' (missed)', kind: quiz.kind, key: quiz.key + '-retry', mode: 'practice', questions: shuffle(quiz.items.filter((x, i) => !quiz.results[i]).map((x) => x.src)) });
  }
  function reviewItem(it, ans, ok, i) {
    const q = it.src;
    let yours, correct;
    if (q.t === 'mcq') { yours = ans == null ? '<i>No answer</i>' : esc(ans); correct = esc(it.correct); }
    else if (q.t === 'multi') { yours = ans ? ans.map(esc).join('<br>') : '<i>No answer</i>'; correct = it.correct.map(esc).join('<br>'); }
    else if (q.t === 'tf') { yours = ans == null ? '<i>No answer</i>' : (ans ? 'True' : 'False'); correct = q.a ? 'True' : 'False'; }
    else if (q.t === 'order') {
      yours = ans ? '<ol class="mlist">' + ans.map((x, k) => `<li class="${x === q.s[k] ? 'ok' : 'bad'}">${esc(x)}</li>`).join('') + '</ol>' : '<i>No answer</i>';
      correct = '<ol class="mlist">' + q.s.map((x) => `<li>${esc(x)}</li>`).join('') + '</ol>';
    } else {
      const a = ans || {};
      yours = '<ul class="mlist">' + it.left.map((l) => `<li class="${a[l] === it.key[l] ? 'ok' : 'bad'}">${esc(l)} → ${a[l] ? esc(a[l]) : '<i>none</i>'}</li>`).join('') + '</ul>';
      correct = '<ul class="mlist">' + q.p.map(([l, r]) => `<li>${esc(l)} → ${esc(r)}</li>`).join('') + '</ul>';
    }
    return `<div class="review ${ok ? 'ok' : 'bad'}">
      <p class="small muted">${i + 1}. ${typeLabel[q.t]} · M${modById[q.mod].num} · ${esc(q.c || '')}</p>
      <p class="rq">${esc(q.q)}</p>
      <div class="ra"><div><span class="lbl">Your answer</span>${yours}</div>${ok ? '' : `<div><span class="lbl">Correct answer</span>${correct}</div>`}</div>
      ${q.e ? `<p class="small expl">💡 ${esc(q.e)}</p>` : ''}
    </div>`;
  }

  route();
  startAuth();
})();
