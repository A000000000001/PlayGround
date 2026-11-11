(() => {
  const SAVE_KEY = 'stillwater-cultivator-v1';
  const realmBands = [
    { start: 1, end: 9, name: 'Qi Condensation', cn: '凝氣' },
    { start: 10, end: 12, name: 'Foundation Establishment', cn: '築基' },
    { start: 13, end: 15, name: 'Golden Core', cn: '金丹' },
    { start: 16, end: 18, name: 'Nascent Soul', cn: '元嬰' },
    { start: 19, end: 21, name: 'Spirit Severing', cn: '化神' },
    { start: 22, end: 24, name: 'Dao Ascendant', cn: '合道' },
    { start: 25, end: Infinity, name: 'Immortal', cn: '仙人' }
  ];
  const techniques = [
    { id: 'sutra', name: 'Clear Heart Sutra', seal: '心', desc: 'A serene mind draws pure qi from the surrounding world.', base: 30, effect: 'Meditation qi +35% / rank', kind: 'qi' },
    { id: 'array', name: 'Spirit-Gathering Array', seal: '聚', desc: 'Arrange spirit stones to coax the ley lines into motion.', base: 45, effect: 'Spirit stone yield +1 every 20 sec / rank', kind: 'stones' },
    { id: 'body', name: 'Jade Body Tempering', seal: '玉', desc: 'Temper the mortal vessel to weather the heavenly tribulation.', base: 65, effect: 'Breakthrough chance +4% / rank', kind: 'chance' }
  ];
  const recipes = [
    { id: 'qiPill', name: 'Qi-Gathering Pill', seal: '丹', desc: 'A warm current of essence, carefully sealed in jade.', cost: 12, effect: 'Instantly gain 45 qi.', type: 'qi', amount: 45 },
    { id: 'focusTea', name: 'Stillwater Tea', seal: '茶', desc: 'A fragrant infusion that steadies the wandering mind.', cost: 10, effect: 'Meditate 30 seconds for free.', type: 'tea', amount: 30 },
    { id: 'bodyPill', name: 'Ironroot Elixir', seal: '根', desc: 'A bitter tonic that fortifies the meridians.', cost: 18, effect: 'Permanently gain +8% qi / sec.', type: 'boost', amount: .08 },
    { id: 'fortune', name: 'Fortune Incense', seal: '香', desc: 'Auspicious smoke that draws a few stray spirit stones.', cost: 8, effect: 'Gain 20 spirit stones.', type: 'stones', amount: 20 }
  ];
  const defaultState = () => ({ qi: 0, stones: 25, stage: 0, active: false, totalSeconds: 0, totalQi: 0, qiToday: 0, medSeconds: 0, expeditions: 0, completedTrips: 0, trip: null, upgrades: { sutra: 0, array: 0, body: 0 }, boosts: 0, teaUntil: 0, dailyClaimed: false, dailyDate: 1, brews: 0, milestones: [], lastSeen: Date.now() });
  let state = loadState();
  let activeView = 'cultivate';
  let toastTimer;
  let lastDailyReward = 0;
  const $ = (id) => document.getElementById(id);
  const nfmt = (n) => Math.floor(n).toLocaleString();
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!saved) return defaultState();
      const fresh = { ...defaultState(), ...saved, upgrades: { ...defaultState().upgrades, ...(saved.upgrades || {}) }, milestones: saved.milestones || [] };
      const away = Math.min(28800, Math.max(0, (Date.now() - (fresh.lastSeen || Date.now())) / 1000));
      if (away > 15) {
        fresh.totalSeconds += away;
        fresh.qiToday += fresh.active ? away * rateFor(fresh) : 0;
        fresh.medSeconds += fresh.active ? away : 0;
        fresh.qi += away * (fresh.active ? rateFor(fresh) : .15);
        fresh.totalQi += away * (fresh.active ? rateFor(fresh) : .15);
        fresh.stones += Math.floor(away / 8);
        const day = Math.floor(fresh.totalSeconds / 300) + 1;
        if (day !== fresh.dailyDate) { fresh.dailyDate = day; fresh.dailyClaimed = false; fresh.qiToday = 0; fresh.medSeconds = 0; fresh.tripToday = 0; }
        fresh.active = false;
        fresh.lastSeen = Date.now();
        setTimeout(() => showToast(`While you were away, ${Math.floor(away / 60)} min passed in quiet meditation.`), 700);
      }
      return fresh;
    } catch { return defaultState(); }
  }
  function save() {
    state.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    $('saveStatus').textContent = 'SYNCED';
  }
  function requirement(stage = state.stage) { return stage === 0 ? 100 : Math.round(100 * Math.pow(1.47, stage)); }
  function rateFor(s = state) { return (0.8 + s.upgrades.sutra * .45) * (1 + s.boosts) * (s.active ? 1 : .2); }
  function currentBand(stage = state.stage) { return realmBands.find(b => stage >= b.start && stage <= b.end); }
  function realmTitle(stage = state.stage) {
    if (stage === 0) return 'Mortal';
    const band = currentBand(stage);
    const level = stage < 10 ? stage : ((stage - band.start) % 3) + 1;
    return `${band.name} ${level}`;
  }
  function showToast(message) {
    const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function addStones(amount, reason) { state.stones += amount; if (reason) showToast(`${reason} · +${amount} spirit stones`); }
  function render() {
    const goal = requirement();
    const qi = Math.floor(state.qi);
    $('stones').textContent = nfmt(state.stones);
    $('realmName').textContent = realmTitle();
    $('stageBadge').innerHTML = `${state.stage === 0 ? '凡人' : currentBand().cn} <span>${String(state.stage === 0 ? 1 : ((state.stage - 1) % 3) + 1).padStart(2, '0')}</span>`;
    $('qiText').textContent = nfmt(qi); $('qiGoal').textContent = nfmt(goal);
    $('qiFill').style.width = `${Math.min(100, qi / goal * 100)}%`;
    $('qiPercent').textContent = `${Math.min(100, Math.floor(qi / goal * 100))}%`;
    $('qiRate').textContent = rateFor().toFixed(1);
    $('meditateLabel').textContent = state.active ? 'Meditation in progress' : 'Begin Meditation';
    $('meditateHint').textContent = state.active ? 'BREATHE DEEPLY · THE QI GATHERS' : 'LET THE QI FLOW THROUGH YOU';
    $('meditateBtn').classList.toggle('meditating', state.active);
    const canBreak = state.qi >= goal;
    $('breakthroughBtn').disabled = !canBreak;
    $('breakHint').textContent = canBreak ? `READY · ${breakChance()}% SUCCESS` : `${nfmt(Math.max(0, goal - qi))} QI TO THE THRESHOLD`;
    const control = Math.max(1, 1 + state.stage + state.upgrades.sutra * 2);
    const spirit = Math.max(1, 1 + Math.floor(state.stage / 2) + state.upgrades.array * 2);
    const body = Math.max(1, 1 + state.stage + state.upgrades.body * 2);
    [['control', control], ['spirit', spirit], ['body', body]].forEach(([key, val]) => {
      $(`${key}Stat`).textContent = val; $(`${key}Meter`).style.width = `${Math.min(100, 8 + val * 8)}%`;
    });
    $('dayCount').textContent = String(Math.floor(state.totalSeconds / 300) + 1).padStart(2, '0');
    $('welcomeDay').textContent = Math.floor(state.totalSeconds / 300) + 1;
    const meditateDone = state.medSeconds >= 30;
    const qiDone = state.qiToday >= 100;
    const tripDone = (state.tripToday || 0) > 0;
    [['taskMeditate', meditateDone], ['taskQi', qiDone], ['taskTrip', tripDone]].forEach(([id, done]) => $(id).classList.toggle('done', done));
    const taskCount = [meditateDone, qiDone, tripDone].filter(Boolean).length;
    $('taskProgress').textContent = `${state.dailyClaimed ? 3 : taskCount} / 3`;
    $('dailyClaim').disabled = state.dailyClaimed || taskCount < 3;
    $('dailyClaim').textContent = state.dailyClaimed ? 'Daily reward claimed' : taskCount === 3 ? 'Claim daily reward →' : 'Complete all practices →';
    const nextTitle = state.stage === 0 ? 'First breath' : `Step ${state.stage + 1} · ${realmTitle(state.stage + 1)}`;
    $('nextTitle').textContent = nextTitle;
    $('nextText').textContent = state.stage === 0 ? 'Gather 100 qi and take your first step into the cultivation world.' : `Refine ${nfmt(goal)} qi to advance toward ${realmTitle(state.stage + 1)}.`;
    $('nextProgress').textContent = `${nfmt(qi)} / ${nfmt(goal)} qi`;
    $('nextFill').style.width = `${Math.min(100, state.qi / goal * 100)}%`;
    $('techCount').textContent = `${Object.values(state.upgrades).reduce((a,b)=>a+b,0)}/∞`;
    $('expDot').classList.toggle('hidden', !(state.trip && Date.now() >= state.trip.ends));
    renderPath(); renderSubView();
  }
  function renderPath() {
    const milestones = [0, 1, 10, 13, 16, 19, 22];
    const labels = ['Mortal', 'Qi Cond.', 'Foundation', 'Golden Core', 'Nascent Soul', 'Spirit Severing', 'Dao Ascendant'];
    $('realmPath').innerHTML = milestones.map((stage, i) => `<div class="realm-step ${state.stage >= stage ? 'passed' : ''} ${state.stage >= stage && (i === milestones.length - 1 || state.stage < milestones[i+1]) ? 'current' : ''}"><span class="realm-node">${state.stage >= stage ? '✦' : '·'}</span><span>${labels[i]}</span></div>`).join('');
  }
  function breakChance() { return Math.min(99, 78 + state.upgrades.body * 4 + Math.min(state.stage, 5)); }
  function subHead(eyebrow, title, copy, symbol = '✧') {
    return `<div class="subview-head"><div><div class="eyebrow"><span class="eyebrow-line"></span>${eyebrow}</div><h1>${title}</h1><p>${copy}</p></div><div class="day-chip"><span class="sun-mark">${symbol}</span><span><small>YOUR CURRENT REALM</small><b>${realmTitle()}</b></span></div></div>`;
  }
  function renderTechniques() {
    const cards = techniques.map(t => {
      const level = state.upgrades[t.id], cost = Math.ceil(t.base * Math.pow(level + 1, 1.55));
      return `<article class="technique-card"><div class="tech-seal">${t.seal}</div><div class="tech-copy"><h3>${t.name}</h3><p>${t.desc}</p><div class="tech-level">RANK ${level} · ${t.effect}</div></div><button class="buy-btn" data-action="upgrade" data-id="${t.id}" ${state.stones < cost ? 'disabled' : ''}>Attune<span>◇ ${cost}</span></button></article>`;
    }).join('');
    $('view-techniques').innerHTML = `${subHead('THE SECT LIBRARY', 'Cultivation techniques', 'Master ancient arts to deepen your foundation.', '☯')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THREE SCROLLS AWAIT</div><h2>Choose what to cultivate</h2><p>Each technique may be attuned again and again. Higher ranks demand more spirit stones, but their effects endure.</p>${cards}</article></div><aside class="subview-aside"><article class="feature-card"><div class="eyebrow">CURRENTLY PRACTICING</div><h3>${state.active ? 'Clear your mind' : 'A quiet mind is a clear vessel'}</h3><p>${state.active ? `Your breath gathers ${rateFor().toFixed(1)} qi each second. Let the cycle continue.` : 'Begin meditation from the Cultivation Grove to gather vital essence even while you explore the sect.'}</p><div class="feature-stats"><span>QI FLOW <b>${rateFor().toFixed(1)} / sec</b></span><span>BREAKTHROUGH <b>${breakChance()}%</b></span></div></article><article class="content-panel"><div class="eyebrow">LEARNER'S NOTE</div><h2>Attunement</h2><p>Spend spirit stones to bind a scroll to your meridians. Effects are permanent and stack with each rank.</p><div class="inventory-row"><span>Spirit stones</span><b>◇ ${nfmt(state.stones)}</b></div></article></aside></div>`;
  }
  function renderExpeditions() {
    const list = [
      { id: 'herbs', name: 'Gathering in the Mistwood', icon: '林', desc: 'Follow the dew trails through the foothills. Return with herbs and a modest stone offering.', duration: 25, reward: 18 },
      { id: 'ruins', name: 'The Moonlit Ruins', icon: '月', desc: 'Search a forgotten shrine for spirit stones. The old wards may take time to navigate.', duration: 60, reward: 48 }
    ];
    let tripState = '';
    if (state.trip) {
      const left = Math.max(0, Math.ceil((state.trip.ends - Date.now()) / 1000));
      tripState = left ? `<div class="timer">Returning in ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</div>` : `<div class="timer ready">Journey complete · ready to collect</div>`;
    }
    const cards = list.map(t => `<article class="expedition-card"><div class="expedition-art">${t.icon}</div><div><h3>${t.name}</h3><p>${t.desc}</p><div class="exp-meta"><span>◷ ${t.duration}s</span><span>◇ ${t.reward + state.stage * 2} stones</span></div>${state.trip && state.trip.id === t.id ? tripState : ''}</div>${state.trip ? (state.trip.id === t.id && Date.now() >= state.trip.ends ? `<button class="action-btn" data-action="collect-trip">Collect</button>` : `<button class="action-btn" disabled>${state.trip.id === t.id ? 'In progress' : 'Away'}</button>`) : `<button class="action-btn" data-action="start-trip" data-id="${t.id}" data-duration="${t.duration}" data-reward="${t.reward}">Set out</button>`}</article>`).join('');
    $('view-expeditions').innerHTML = `${subHead('BEYOND THE SECT WALLS', 'Expeditions', 'The world is vast. A cultivator must also walk its roads.', '⌁')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">AVAILABLE JOURNEYS</div><h2>Choose a path</h2><p>Send your spirit out into the world. You can continue cultivating while an expedition is underway.</p>${cards}</article></div><aside class="subview-aside"><article class="feature-card"><div class="eyebrow">TRAVELER'S LEDGER</div><h3>${state.completedTrips} journeys completed</h3><p>Every safe return brings new spirit stones to the Azure Cloud Sect. Higher realms draw richer offerings.</p><div class="feature-stats"><span>STONE YIELD <b>+${state.stage * 2} / trip</b></span></div></article><article class="content-panel"><div class="eyebrow">FIELD TIP</div><h2>Time moves on</h2><p>Expeditions progress while you visit other pages. Leave the game open, or return later to collect your findings.</p></article></aside></div>`;
  }
  function renderAlchemy() {
    const items = recipes.map(r => `<article class="recipe"><div class="recipe-icon">${r.seal}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="recipe-cost">${r.effect}</div><button class="action-btn" data-action="brew" data-id="${r.id}" ${state.stones < r.cost ? 'disabled' : ''}>Brew · ◇ ${r.cost}</button></article>`).join('');
    $('view-alchemy').innerHTML = `${subHead('THE HERBALIST’S COURT', 'Alchemy pavilion', 'Trade spirit stones for useful elixirs and carefully prepared tonics.', '⚗')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">RECIPES IN YOUR JOURNAL</div><h2>Simple preparations</h2><p>These recipes are well known to outer disciples. Their ingredients are included in the stone cost.</p><div class="alch-grid">${items}</div></article></div><aside class="subview-aside"><article class="content-panel"><div class="eyebrow">YOUR SATCHEL</div><h2>Carried resources</h2><div class="inventory-row"><span>Spirit stones</span><b>◇ ${nfmt(state.stones)}</b></div><div class="inventory-row"><span>Permanent elixirs</span><b>${Math.round(state.boosts * 100)}% qi</b></div><div class="inventory-row"><span>Brews prepared</span><b>${state.brews || 0}</b></div></article><article class="feature-card"><div class="eyebrow">HERBALIST’S ADVICE</div><h3>Every root has a nature</h3><p>Use a Qi-Gathering Pill when you are close to a threshold, or save your stones to strengthen your permanent arts.</p></article></aside></div>`;
  }
  function renderCodex() {
    const entries = [{ s: 0, name: 'Mortal', desc: 'The beginning. All paths are still open.' }, { s: 1, name: 'Qi Condensation', desc: 'Draw vital essence into the meridians · 9 stages' }, { s: 10, name: 'Foundation Establishment', desc: 'Build a vessel strong enough to hold the Dao · 3 stages' }, { s: 13, name: 'Golden Core', desc: 'Condense the inner sea into a perfect core · 3 stages' }, { s: 16, name: 'Nascent Soul', desc: 'Give form to the spirit within · 3 stages' }, { s: 19, name: 'Spirit Severing', desc: 'Cut the threads that bind you to the mundane · 3 stages' }, { s: 22, name: 'Dao Ascendant', desc: 'Walk in harmony with the great order · 3 stages' }, { s: 25, name: 'Immortal', desc: 'Beyond the final gate, the long journey begins anew.' }];
    $('view-codex').innerHTML = `${subHead('A RECORD OF THE GREAT WAY', 'The cultivator’s codex', 'A map of the realms, teachings, and principles of the immortal path.', '▤')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">REALMS OF THE WORLD</div><h2>Steps beyond the mortal veil</h2><p>Each breakthrough deepens the foundation. The next realm is revealed only when the previous threshold has been crossed.</p><div class="codex-list">${entries.map((e, i) => `<div class="codex-realm ${state.stage >= e.s ? 'unlocked' : ''}"><span class="codex-node">${state.stage >= e.s ? '✦' : '·'}</span><div><h3>${e.name}</h3><p>${e.desc}</p></div><small>${state.stage >= e.s ? (state.stage >= (entries[i + 1]?.s ?? 999) ? 'MASTERED' : 'DISCOVERED') : 'UNKNOWN'}</small></div>`).join('')}</div></article></div><aside class="subview-aside"><article class="feature-card"><div class="eyebrow">THE WAY IS LONG</div><h3>${realmTitle()}</h3><p>You have crossed ${state.stage} breakthrough${state.stage === 1 ? '' : 's'}. Accumulate qi, refine your arts, and take each step when ready.</p><div class="feature-stats"><span>REALM STAGE <b>${state.stage}</b></span><span>TOTAL QI <b>${nfmt(state.totalQi)}</b></span></div></article><article class="content-panel"><div class="eyebrow">THE THREE FOUNDATIONS</div><h2>Body · Spirit · Qi</h2><p>Qi is the world's breath. Spirit is the will that shapes it. The body is the vessel that endures its power. Tend to all three.</p></article></aside></div>`;
  }
  function renderSubView() {
    if (activeView === 'techniques') renderTechniques();
    if (activeView === 'expeditions') renderExpeditions();
    if (activeView === 'alchemy') renderAlchemy();
    if (activeView === 'codex') renderCodex();
  }
  function setView(view) {
    activeView = view;
    document.querySelectorAll('.view').forEach(el => el.classList.toggle('active', el.id === `view-${view}`));
    document.querySelectorAll('[data-view]').forEach(el => el.classList.toggle('active', el.dataset.view === view));
    const names = { cultivate: 'CULTIVATION GROVE', techniques: 'SECT LIBRARY', expeditions: 'BEYOND THE SECT', alchemy: 'ALCHEMY PAVILION', codex: 'THE IMMORTAL CODEX' };
    $('crumbTitle').textContent = names[view] || names.cultivate;
    render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openBreakthrough() {
    $('modalSymbol').textContent = '破';
    $('modalEyebrow').textContent = 'REALM BREAKTHROUGH';
    $('modalTitle').textContent = 'The threshold awaits';
    $('modalText').textContent = `Your meridians brim with qi. Break through into ${realmTitle(state.stage + 1)}? Success chance: ${breakChance()}%. A failed attempt scatters some gathered qi, but your foundation will endure.`;
    $('modalActions').innerHTML = '<button class="secondary-btn" data-action="close-modal">Not yet</button><button class="primary-btn" data-action="attempt-break">Face the tribulation</button>';
    $('modalBackdrop').hidden = false;
  }
  function attemptBreak() {
    $('modalBackdrop').hidden = true;
    const chance = breakChance();
    if (Math.random() * 100 < chance) {
      state.qi = Math.max(0, state.qi - requirement());
      state.stage += 1;
      const reward = 12 + Math.floor(state.stage / 2) * 3;
      state.stones += reward;
      showToast(`Breakthrough! You reached ${realmTitle()} · +${reward} spirit stones`);
      if (state.stage >= 25) {
        $('modalSymbol').textContent = '仙'; $('modalEyebrow').textContent = 'THE IMMORTAL GATE'; $('modalTitle').textContent = 'You have touched eternity';
        $('modalText').textContent = 'The mortal world falls away. Yet even an immortal knows there are always higher skies to seek.';
        $('modalActions').innerHTML = '<button class="primary-btn" data-action="close-modal">Continue the journey</button>';
        $('modalBackdrop').hidden = false;
      }
    } else {
      state.qi *= .8;
      showToast('The tribulation resists. Your qi scatters, but your resolve remains.');
    }
    save(); render();
  }
  function buyUpgrade(id) {
    const t = techniques.find(x => x.id === id); if (!t) return;
    const rank = state.upgrades[id], cost = Math.ceil(t.base * Math.pow(rank + 1, 1.55));
    if (state.stones < cost) return showToast('Not enough spirit stones.');
    state.stones -= cost; state.upgrades[id] += 1;
    showToast(`${t.name} attuned · rank ${state.upgrades[id]}`); save(); render();
  }
  function startTrip(button) {
    if (state.trip) return showToast('You are already away on an expedition.');
    const duration = Number(button.dataset.duration), reward = Number(button.dataset.reward);
    state.trip = { id: button.dataset.id, ends: Date.now() + duration * 1000, reward };
    showToast('Your expedition has begun. Safe travels.'); save(); render();
  }
  function collectTrip() {
    if (!state.trip || Date.now() < state.trip.ends) return;
    const trip = state.trip, reward = trip.reward + state.stage * 2 + state.upgrades.array;
    state.trip = null; state.stones += reward; state.completedTrips += 1; state.tripToday = (state.tripToday || 0) + 1;
    showToast(`A safe return · +${reward} spirit stones`); save(); render();
  }
  function brew(id) {
    const recipe = recipes.find(r => r.id === id); if (!recipe || state.stones < recipe.cost) return;
    state.stones -= recipe.cost; state.brews = (state.brews || 0) + 1;
    if (recipe.type === 'qi') { state.qi += recipe.amount; state.qiToday += recipe.amount; state.totalQi += recipe.amount; }
    if (recipe.type === 'tea') { state.qi += 30; state.qiToday += 30; state.totalQi += 30; state.medSeconds += 30; }
    if (recipe.type === 'boost') { state.boosts += recipe.amount; state.milestones.push(`pill-${Date.now()}`); }
    if (recipe.type === 'stones') state.stones += recipe.amount;
    showToast(`${recipe.name} prepared.`); save(); render();
  }
  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) { setView(viewButton.dataset.view); return; }
    const action = event.target.closest('[data-action]');
    if (!action) return;
    switch (action.dataset.action) {
      case 'upgrade': buyUpgrade(action.dataset.id); break;
      case 'start-trip': startTrip(action); break;
      case 'collect-trip': collectTrip(); break;
      case 'brew': brew(action.dataset.id); break;
      case 'attempt-break': attemptBreak(); break;
      case 'close-modal': $('modalBackdrop').hidden = true; break;
    }
  });
  $('meditateBtn').addEventListener('click', () => {
    state.active = !state.active;
    showToast(state.active ? 'Your breathing slows. Qi gathers around you.' : 'You return gently from meditation.');
    save(); render();
  });
  $('breakthroughBtn').addEventListener('click', openBreakthrough);
  $('modalClose').addEventListener('click', () => $('modalBackdrop').hidden = true);
  $('modalBackdrop').addEventListener('click', e => { if (e.target === $('modalBackdrop')) $('modalBackdrop').hidden = true; });
  $('dailyClaim').addEventListener('click', () => {
    const ready = state.medSeconds >= 30 && state.qiToday >= 100 && (state.tripToday || 0) > 0;
    if (!ready || state.dailyClaimed) return;
    state.dailyClaimed = true; state.stones += 35; showToast('Daily practice complete · +35 spirit stones'); save(); render();
  });
  $('soundToggle').addEventListener('click', e => {
    const active = document.body.classList.toggle('focus-mode');
    e.currentTarget.querySelector('span').textContent = active ? 'FOCUS ON' : 'FOCUS';
    showToast(active ? 'Focus mode: distractions softened.' : 'Focus mode off.');
  });
  function tick() {
    state.totalSeconds += 1;
    const today = Math.floor(state.totalSeconds / 300) + 1;
    if (today !== state.dailyDate) {
      state.dailyDate = today; state.dailyClaimed = false; state.qiToday = 0; state.medSeconds = 0; state.tripToday = 0;
      showToast('A new day dawns at Azure Cloud Sect.');
    }
    const gained = rateFor();
    state.qi += gained; state.totalQi += gained; state.qiToday += gained;
    if (state.active) state.medSeconds += 1;
    state.stoneClock = (state.stoneClock || 0) + 1;
    if (state.stoneClock >= 8) { state.stoneClock -= 8; state.stones += 1; }
    if (state.upgrades.array > 0 && state.totalSeconds % 20 === 0) state.stones += state.upgrades.array;
    if (state.trip && Date.now() >= state.trip.ends && activeView === 'expeditions') renderSubView();
    render();
    if (state.totalSeconds % 5 === 0) save();
  }
  document.querySelectorAll('[data-view="cultivate"]').forEach(el => el.classList.add('active'));
  render(); setInterval(tick, 1000);
  window.addEventListener('beforeunload', save);
})();
