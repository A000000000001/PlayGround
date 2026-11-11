(() => {
  const SAVE_KEY = 'stillwater-cultivator-v1';
  // Realm floors are data-driven so each path can keep its own place on the ladder.
  const realms = [
    { name: 'Qi Condensation', cn: '凝氣', floors: 9 },
    { name: 'Foundation Establishment', cn: '築基', floors: 3 },
    { name: 'Golden Core', cn: '金丹', floors: 3 },
    { name: 'Nascent Soul', cn: '元嬰', floors: 3 },
    { name: 'Spirit Severing', cn: '化神', floors: 3 },
    { name: 'Dao Ascendant', cn: '合道', floors: 3 },
    { name: 'Immortal', cn: '仙人', floors: 9 }
  ];
  const realmBands = realms.reduce((bands, realm, index) => {
    const start = bands.length ? bands[bands.length - 1].start + bands[bands.length - 1].floors : 1;
    bands.push({ ...realm, start, end: index === realms.length - 1 ? Infinity : start + realm.floors - 1 });
    return bands;
  }, []);
  const realmPhases = ['Early', 'Middle', 'Late', 'Peak'];
  const realmGates = {
    10: { body: 3, roots: 1, label: 'Foundation Trial' },
    13: { body: 6, spirit: 1, roots: 2, flowers: 1, wins: 1, label: 'Core Condensation' },
    16: { body: 9, spirit: 3, flowers: 2, brews: 1, wins: 3, label: 'Nascent Soul tribulation' },
    19: { body: 12, spirit: 5, flowers: 3, brews: 2, sectRank: 1, wins: 5, label: 'Spirit Severing trial' },
    22: { body: 15, spirit: 8, flowers: 4, brews: 3, sectRank: 2, wins: 8, label: 'Dao Ascendant tribulation' },
    25: { body: 18, spirit: 10, flowers: 5, brews: 4, sectRank: 3, wins: 12, label: 'Immortal tribulation' }
  };
  const progressionUnlocks = [
    { stage: 1, title: 'Spirit beast grounds', detail: 'Combat practice and the Mistwood expedition.' },
    { stage: 4, title: 'Moonlit Ruins', detail: 'A new exploration region with rare moonflowers and stronger beasts.' },
    { stage: 10, title: 'Foundation armory', detail: 'Unlock the second equipment tier.' },
    { stage: 16, title: 'Nascent hunting grounds', detail: 'Stronger spirit beasts join the encounter pool.' },
    { stage: 22, title: 'Dao armory', detail: 'Unlock the highest equipment tier.' },
    { stage: 25, title: 'Immortal frontier', detail: 'A final exploration region opens beyond the mortal world.' }
  ];
  const techniques = [
    { id: 'sutra', name: 'Clear Heart Sutra', seal: '心', desc: 'A serene mind draws pure qi from the surrounding world.', base: 30, effect: 'Meditation qi +35% / rank', kind: 'qi' },
    { id: 'array', name: 'Spirit-Gathering Array', seal: '聚', desc: 'Arrange spirit stones to coax the ley lines into motion.', base: 45, effect: 'Spirit stone yield +1 every 20 sec / rank', kind: 'stones' },
    { id: 'body', name: 'Jade Body Tempering', seal: '玉', desc: 'Temper the mortal vessel to weather the heavenly tribulation.', base: 65, effect: 'Breakthrough chance +4% / rank', kind: 'chance' }
  ];
  const recipes = [
    { id: 'qiPill', name: 'Qi-Gathering Pill', seal: '丹', desc: 'A warm current of essence, carefully sealed in jade.', cost: 12, ingredients: { herb: 2, root: 1 }, effect: 'Instantly gain 45 qi.', type: 'qi', amount: 45 },
    { id: 'focusTea', name: 'Stillwater Tea', seal: '茶', desc: 'A fragrant infusion that steadies the wandering mind.', cost: 10, ingredients: { herb: 3 }, effect: 'Restore 30 health and gain 30 qi.', type: 'heal', amount: 30 },
    { id: 'bodyPill', name: 'Ironroot Elixir', seal: '根', desc: 'A bitter tonic that fortifies the meridians.', cost: 18, ingredients: { root: 3 }, effect: 'Permanently gain +8% qi / sec.', type: 'boost', amount: .08 },
    { id: 'fortune', name: 'Fortune Incense', seal: '香', desc: 'Auspicious smoke that draws spirit stones and gathers qi.', cost: 10, ingredients: { herb: 1, flower: 1 }, effect: 'Gain 1,000 spirit stones and 1,000 qi.', type: 'fortune', amount: 1000 }
  ];
  const enemyKinds = [
    { name: 'Mistfang Wolf', icon: '狼', sect: 'azure', hp: 42, damage: 5, stones: 10, rep: 4, drop: 'herb', minStage: 0 },
    { name: 'Brambleback Boar', icon: '豕', sect: 'azure', hp: 58, damage: 7, stones: 14, rep: 5, drop: 'root', minStage: 0 },
    { name: 'Moonlit Wisp', icon: '魄', sect: 'jade', hp: 36, damage: 8, stones: 12, rep: 6, drop: 'flower', minStage: 4 },
    { name: 'Ashenhorn Stag', icon: '鹿', sect: 'crimson', hp: 52, damage: 8, stones: 18, rep: 7, drop: 'root', minStage: 4 },
    { name: 'Emberscale Serpent', icon: '蛇', sect: 'crimson', hp: 44, damage: 10, stones: 20, rep: 8, drop: 'flower', minStage: 16 },
    { name: 'Jadewing Crane', icon: '鶴', sect: 'jade', hp: 48, damage: 6, stones: 16, rep: 7, drop: 'herb', minStage: 4 }
  ];
  const sects = {
    azure: { name: 'Azure Cloud', seal: '青', bonus: 'Qi generation +10%', qi: .1, attack: 0 },
    crimson: { name: 'Crimson Forge', seal: '炎', bonus: 'Attack damage +15%', qi: 0, attack: .15 },
    jade: { name: 'Jade Lotus', seal: '蓮', bonus: 'Qi generation +5% · attack +5%', qi: .05, attack: .05 }
  };
  const sectSpells = {
    azure: { name: 'Cloudburst Palm', seal: '雲', cost: 12, damage: 24, desc: 'A focused wave of compressed spirit qi.' },
    crimson: { name: 'Blazing Phoenix', seal: '炎', cost: 16, damage: 36, desc: 'A fierce flame art that scorches one foe.' },
    jade: { name: 'Lotus Bind', seal: '蓮', cost: 10, damage: 20, heal: 8, desc: 'Entangling petals strike and restore a little health.' }
  };
  const missions = [
    { id: 'hunt3', name: 'Clear the Beast Trail', desc: 'Defeat 3 spirit beasts.', target: 3, stones: 80, tokens: 8, merit: 12 },
    { id: 'hunt5', name: 'Guard the Mountain Pass', desc: 'Defeat 5 spirit beasts.', target: 5, stones: 150, tokens: 15, merit: 22 }
  ];
  const gearCatalog = [
    { id: 'sword', name: 'Sword', seal: '劍', tokens: 8, bonus: 'Attack +6 / level', stat: 'attack', value: 6, minStage: 0 },
    { id: 'helmet', name: 'Helmet', seal: '盔', tokens: 6, bonus: 'Qi flow +4% / level', stat: 'qi', value: .04, minStage: 10 },
    { id: 'gloves', name: 'Gloves', seal: '手', tokens: 6, bonus: 'Attack +3 / level', stat: 'attack', value: 3, minStage: 10 },
    { id: 'pants', name: 'Pants', seal: '褲', tokens: 6, bonus: 'Max health +10 / level', stat: 'health', value: 10, minStage: 10 },
    { id: 'vest', name: 'Vest', seal: '甲', tokens: 7, bonus: 'Qi flow +5% / level', stat: 'qi', value: .05, minStage: 22 },
    { id: 'shoes', name: 'Shoes', seal: '履', tokens: 5, bonus: 'Incoming damage -1 / level', stat: 'guard', value: 1, minStage: 22 }
  ];
  const emptyEquipment = () => Object.fromEntries(gearCatalog.map(item => [item.id, { owned: false, level: 0 }]));
  const defaultState = () => ({ qi: 0, stones: 25, stage: 0, active: false, totalSeconds: 0, totalQi: 0, qiToday: 0, medSeconds: 0, expeditions: 0, completedTrips: 0, trip: null, upgrades: { sutra: 0, array: 0, body: 0 }, boosts: 0, teaUntil: 0, dailyClaimed: false, dailyDate: 1, brews: 0, milestones: [], lastSeen: Date.now(), hp: 60, maxHp: 60, enemy: null, pathLevels: { body: 0, spirit: 0 }, pathProgress: { qi: 0, body: 0 }, herbs: { herb: 0, root: 0, flower: 0 }, sectRep: 0, sectRank: 0, tripToday: 0, sectId: 'azure', sectTokens: 0, mission: null, equipment: emptyEquipment() });
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
      const defaults = defaultState();
      const fresh = { ...defaults, ...saved, upgrades: { ...defaults.upgrades, ...(saved.upgrades || {}) }, pathLevels: { ...defaults.pathLevels, ...(saved.pathLevels || {}) }, pathProgress: { ...defaults.pathProgress, ...(saved.pathProgress || {}) }, herbs: { ...defaults.herbs, ...(saved.herbs || {}) }, equipment: { ...defaults.equipment, ...(saved.equipment || {}) }, milestones: saved.milestones || [] };
      fresh.stage = Math.max(0, Math.floor(Number(fresh.stage) || 0));
      fresh.pathLevels.body = Math.max(0, Math.floor(Number(fresh.pathLevels.body) || 0));
      fresh.pathLevels.spirit = Math.max(0, Math.floor(Number(fresh.pathLevels.spirit) || 0));
      // Qi floors follow the legacy realm stage; Body floors inherit the old Body rank.
      fresh.pathProgress.qi = Math.max(fresh.stage, Math.floor(Number(saved.pathProgress?.qi) || 0));
      fresh.pathProgress.body = Math.max(0, Math.floor(Number(saved.pathProgress?.body ?? saved.pathLevels?.body) || 0));
      fresh.pathLevels.body = Math.max(fresh.pathLevels.body, fresh.pathProgress.body);
      Object.keys(fresh.equipment).forEach(id => { fresh.equipment[id] = { owned: false, level: 0, ...(fresh.equipment[id] || {}) }; });
      if (!sects[fresh.sectId]) fresh.sectId = 'azure';
      fresh.maxHp = Math.max(60, Number(fresh.maxHp) || 60);
      fresh.hp = Math.max(0, Math.min(fresh.maxHp, Number(fresh.hp ?? fresh.maxHp)));
      const away = Math.floor(Math.min(28800, Math.max(0, (Date.now() - (fresh.lastSeen || Date.now())) / 1000)));
      if (away > 15) {
        const previousTotal = fresh.totalSeconds;
        const nextTotal = previousTotal + away;
        const wasActive = fresh.active;
        const qiRate = rateFor(fresh);
        fresh.totalSeconds = nextTotal;
        fresh.qi += away * qiRate;
        fresh.totalQi += away * qiRate;
        const day = Math.floor(nextTotal / 300) + 1;
        const crossedDay = day !== fresh.dailyDate;
        const secondsToday = nextTotal % 300;
        fresh.qiToday = crossedDay
          ? secondsToday * qiRate
          : fresh.qiToday + away * qiRate;
        fresh.medSeconds = crossedDay
          ? (wasActive ? secondsToday : 0)
          : fresh.medSeconds + (wasActive ? away : 0);
        if (crossedDay) { fresh.dailyDate = day; fresh.dailyClaimed = false; fresh.tripToday = 0; }
        fresh.stoneClock = (Number(fresh.stoneClock) || 0) + away;
        fresh.stones += Math.floor(fresh.stoneClock / 8);
        fresh.stoneClock %= 8;
        fresh.stones += (Math.floor(nextTotal / 20) - Math.floor(previousTotal / 20)) * fresh.upgrades.array;
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
  function gateFor(stage = state.stage + 1) { return realmGates[stage] || null; }
  function gateNeeds(stage = state.stage + 1) {
    const gate = gateFor(stage);
    if (!gate) return [];
    const needs = [];
    if (state.pathProgress.body < gate.body) needs.push(`Body floor ${gate.body}`);
    if (state.pathLevels.spirit < (gate.spirit || 0)) needs.push(`Spirit rank ${gate.spirit}`);
    if (state.herbs.root < (gate.roots || 0)) needs.push(`${gate.roots} ironroot`);
    if (state.herbs.flower < (gate.flowers || 0)) needs.push(`${gate.flowers} moonflowers`);
    if ((state.brews || 0) < (gate.brews || 0)) needs.push(`${gate.brews} prepared pills`);
    if ((state.wins || 0) < (gate.wins || 0)) needs.push(`${gate.wins} beast victories`);
    if (state.sectRank < (gate.sectRank || 0)) needs.push(`${sectRanks[gate.sectRank]?.name || 'Sect rank'} standing`);
    return needs;
  }
  function gateSummary(stage = state.stage + 1) {
    const gate = gateFor(stage);
    if (!gate) return 'Qi threshold';
    const parts = [`Body ${gate.body}+`];
    if (gate.spirit) parts.push(`Spirit ${gate.spirit}+`);
    if (gate.roots) parts.push(`${gate.roots} ironroot`);
    if (gate.flowers) parts.push(`${gate.flowers} moonflowers`);
    if (gate.brews) parts.push(`${gate.brews} pills brewed`);
    if (gate.wins) parts.push(`${gate.wins} victories`);
    if (gate.sectRank) parts.push(`${sectRanks[gate.sectRank].name}`);
    return parts.join(' · ');
  }
  function realmProgress(stage = state.stage) {
    if (stage <= 0) return { band: null, floor: 0, phase: 'Mortal', floors: 0 };
    const band = currentBand(stage);
    const rawFloor = stage - band.start + 1;
    const floor = ((rawFloor - 1) % band.floors) + 1;
    const phaseIndex = Math.min(3, Math.floor((floor - 1) * 4 / band.floors));
    return { band, floor, phase: realmPhases[phaseIndex], floors: band.floors };
  }
  function pathBonus(path, floor) { return path === 'body' ? floor * 2 : floor * 0.01; }
  function bodyFloorRequirement(floor = state.pathProgress.body) { return 50 + floor * 45; }
  function sectData(s = state) { return sects[s.sectId] || sects.azure; }
  function gearStat(stat, s = state) { return gearCatalog.reduce((sum, item) => sum + (item.stat === stat && s.equipment?.[item.id]?.owned ? item.value * s.equipment[item.id].level : 0), 0); }
  function attackDamage(base) { return Math.round((base + pathBonus('body', state.pathProgress.body) + gearStat('attack')) * (1 + sectData().attack + state.sectRank * .03)); }
  function rateFor(s = state) { return (0.8 + s.upgrades.sutra * .45 + (s.pathLevels?.spirit || 0) * .2) * (1 + s.boosts + gearStat('qi', s) + sectData(s).qi + s.sectRank * .02 + pathBonus('qi', s.pathProgress?.qi || s.stage)) * (s.active ? 1 : .2); }
  function currentSpell() { return sectSpells[state.sectId] || sectSpells.azure; }
  function damageEnemy(damage, source) {
    const enemy = state.enemy;
    if (!enemy) return;
    enemy.hp -= damage;
    if (enemy.hp <= 0) {
      state.enemy = null; state.wins = (state.wins || 0) + 1;
      state.stones += enemy.stones; addRep(enemy.rep);
      if (enemy.drop && state.herbs[enemy.drop] !== undefined) state.herbs[enemy.drop] += 1;
      if (state.mission) state.mission.progress = Math.min(state.mission.progress + 1, missions.find(m => m.id === state.mission.id)?.target || Infinity);
      showToast(`${enemy.name} defeated · +${enemy.stones} stones · +${enemy.rep} merit${enemy.drop ? ` · ${enemy.drop} gathered` : ''}`);
      return;
    }
    const taken = Math.max(1, enemy.damage - Math.floor(state.pathLevels.body / 2) - Math.floor(gearStat('guard')));
    state.hp = Math.max(0, state.hp - taken);
    if (state.hp <= 0) {
      state.enemy = null; state.hp = Math.max(1, Math.floor(state.maxHp * .35));
      showToast(`You were overcome and carried to safety · restored to ${state.hp} health.`);
    } else showToast(`${source} dealt ${damage} damage and suffered ${taken} in return.`);
  }
  function currentBand(stage = state.stage) { return realmBands.find(b => stage >= b.start && stage <= b.end); }
  function realmTitle(stage = state.stage) {
    if (stage === 0) return 'Mortal';
    const band = currentBand(stage);
    const { floor } = realmProgress(stage);
    return `${band.name} ${floor}`;
  }
  function showToast(message) {
    const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function addStones(amount, reason) { state.stones += amount; if (reason) showToast(`${reason} · +${amount} spirit stones`); }
  const sectRanks = [
    { name: 'Outer Disciple', need: 0 }, { name: 'Inner Disciple', need: 20 },
    { name: 'Core Disciple', need: 60 }, { name: 'Elder', need: 120 }, { name: 'Sect Master', need: 220 }
  ];
  function addRep(amount) {
    state.sectRep += amount;
    while (state.sectRank < sectRanks.length - 1 && state.sectRep >= sectRanks[state.sectRank + 1].need) {
      state.sectRank += 1;
      state.hp += 10;
      showToast(`Sect promotion · ${sectRanks[state.sectRank].name}! Maximum health +10.`);
    }
  }
  function render() {
    const goal = requirement();
    const qi = Math.floor(state.qi);
    $('stones').textContent = nfmt(state.stones);
    $('realmName').textContent = realmTitle();
    $('stageBadge').innerHTML = `${state.stage === 0 ? '凡人' : currentBand().cn} <span>${String(state.stage === 0 ? 1 : realmProgress().floor).padStart(2, '0')}</span>`;
    $('qiText').textContent = nfmt(qi); $('qiGoal').textContent = nfmt(goal);
    $('qiFill').style.width = `${Math.min(100, qi / goal * 100)}%`;
    $('qiPercent').textContent = `${Math.min(100, Math.floor(qi / goal * 100))}%`;
    $('qiRate').textContent = rateFor().toFixed(1);
    $('meditateLabel').textContent = state.active ? 'Meditation in progress' : 'Begin Meditation';
    $('meditateHint').textContent = state.active ? 'BREATHE DEEPLY · THE QI GATHERS' : 'LET THE QI FLOW THROUGH YOU';
    $('meditateBtn').classList.toggle('meditating', state.active);
    const missingGateNeeds = gateNeeds();
    const canBreak = state.qi >= goal && !missingGateNeeds.length;
    $('breakthroughBtn').disabled = !canBreak;
    $('breakHint').textContent = missingGateNeeds.length ? `REQUIRES · ${missingGateNeeds.join(' · ')}` : state.qi >= goal ? `READY · ${breakChance()}% SUCCESS` : `${nfmt(Math.max(0, goal - qi))} QI TO THE THRESHOLD`;
    const control = Math.max(1, 1 + state.stage + state.upgrades.sutra * 2);
    const spirit = Math.max(1, 1 + Math.floor(state.stage / 2) + state.upgrades.array * 2 + state.pathLevels.spirit * 3);
    const body = Math.max(1, 1 + state.stage + state.upgrades.body * 2 + state.pathLevels.body * 3);
    state.maxHp = Math.max(60, 60 + body * 5 + state.pathLevels.body * 12 + pathBonus('body', state.pathProgress.body) * 3 + state.sectRank * 10 + gearStat('health'));
    state.hp = Math.min(state.hp, state.maxHp);
    $('sectRankLabel').textContent = sectRanks[state.sectRank]?.name || sectRanks[0].name;
    $('sectName').textContent = sectData().name;
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
      { id: 'herbs', name: 'Gathering in the Mistwood', icon: '林', desc: 'Follow the dew trails through the foothills. Return with medicinal herbs and a modest stone offering.', duration: 25, reward: 18, loot: '3 herbs · 1 ironroot', minStage: 0 },
      { id: 'ruins', name: 'The Moonlit Ruins', icon: '月', desc: 'Search a forgotten shrine for spirit stones, ironroot, and rare moonflowers.', duration: 60, reward: 48, loot: '2 ironroot · 2 moonflowers', minStage: 4 },
      { id: 'frontier', name: 'The Immortal Frontier', icon: '仙', desc: 'Cross beyond the mortal veil in search of ancient roots and immortal offerings.', duration: 90, reward: 100, loot: '3 ironroot · 3 moonflowers', minStage: 25 }
    ];
    let tripState = '';
    if (state.trip) {
      const left = Math.max(0, Math.ceil((state.trip.ends - Date.now()) / 1000));
      tripState = left ? `<div class="timer">Returning in ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</div>` : `<div class="timer ready">Journey complete · ready to collect</div>`;
    }
    const cards = list.map(t => {
      const locked = state.stage < t.minStage;
      const button = state.trip
        ? (state.trip.id === t.id && Date.now() >= state.trip.ends ? `<button class="action-btn" data-action="collect-trip">Collect</button>` : `<button class="action-btn" disabled>${state.trip.id === t.id ? 'In progress' : 'Away'}</button>`)
        : locked
          ? `<button class="action-btn" disabled>Requires stage ${t.minStage}</button>`
          : `<button class="action-btn" data-action="start-trip" data-id="${t.id}" data-duration="${t.duration}" data-reward="${t.reward}">Set out</button>`;
      return `<article class="expedition-card ${locked ? 'expedition-locked' : ''}"><div class="expedition-art">${t.icon}</div><div><h3>${t.name}</h3><p>${t.desc}</p><div class="exp-meta"><span>◷ ${t.duration}s</span><span>◇ ${t.reward + state.stage * 2} stones</span><span>✿ ${t.loot}</span></div>${locked ? `<div class="path-warning">Unlocks at stage ${t.minStage}</div>` : ''}${state.trip && state.trip.id === t.id ? tripState : ''}</div>${button}</article>`;
    }).join('');
    $('view-expeditions').innerHTML = `${subHead('BEYOND THE SECT WALLS', 'Expeditions', 'The world is vast. A cultivator must also walk its roads.', '⌁')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">AVAILABLE JOURNEYS</div><h2>Choose a path</h2><p>Send your spirit out into the world. You can continue cultivating while an expedition is underway.</p>${cards}</article></div><aside class="subview-aside"><article class="feature-card"><div class="eyebrow">TRAVELER'S LEDGER</div><h3>${state.completedTrips} journeys completed</h3><p>Every safe return brings new spirit stones to the Azure Cloud Sect. Higher realms draw richer offerings.</p><div class="feature-stats"><span>STONE YIELD <b>+${state.stage * 2} / trip</b></span></div></article><article class="content-panel"><div class="eyebrow">FIELD TIP</div><h2>Time moves on</h2><p>Expeditions progress while you visit other pages. Leave the game open, or return later to collect your findings.</p></article></aside></div>`;
  }
  function renderAlchemy() {
    const ingredientText = (r) => Object.entries(r.ingredients).map(([key, amount]) => `${amount} ${key}`).join(' · ');
    const items = recipes.map(r => {
      const enough = Object.entries(r.ingredients).every(([key, amount]) => state.herbs[key] >= amount);
      return `<article class="recipe"><div class="recipe-icon">${r.seal}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="recipe-cost">${r.effect}</div><div class="ingredient-line">Needs ${ingredientText(r)}</div><button class="action-btn" data-action="brew" data-id="${r.id}" ${state.stones < r.cost || !enough ? 'disabled' : ''}>Brew · ◇ ${r.cost}</button></article>`;
    }).join('');
    $('view-alchemy').innerHTML = `${subHead('THE HERBALIST’S COURT', 'Alchemy pavilion', 'Trade spirit stones for useful elixirs and carefully prepared tonics.', '⚗')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">RECIPES IN YOUR JOURNAL</div><h2>Simple preparations</h2><p>Gather ingredients on expeditions, then spend spirit stones to prepare each recipe. Ingredients are consumed when a brew succeeds.</p><div class="alch-grid">${items}</div></article></div><aside class="subview-aside"><article class="content-panel"><div class="eyebrow">YOUR SATCHEL</div><h2>Carried resources</h2><div class="inventory-row"><span>Spirit stones</span><b>◇ ${nfmt(state.stones)}</b></div><div class="inventory-row"><span>Herbs</span><b>${state.herbs.herb}</b></div><div class="inventory-row"><span>Ironroot</span><b>${state.herbs.root}</b></div><div class="inventory-row"><span>Moonflower</span><b>${state.herbs.flower}</b></div><div class="inventory-row"><span>Permanent elixirs</span><b>${Math.round(state.boosts * 100)}% qi</b></div><div class="inventory-row"><span>Brews prepared</span><b>${state.brews || 0}</b></div></article><article class="feature-card"><div class="eyebrow">HERBALIST’S ADVICE</div><h3>Every root has a nature</h3><p>Use a Qi-Gathering Pill when you are close to a threshold, or save your stones to strengthen your permanent arts.</p></article></aside></div>`;
  }
  function renderCodex() {
    const entries = [{ s: 0, name: 'Mortal', desc: 'The beginning. All paths are still open.' }, { s: 1, name: 'Qi Condensation', desc: 'Draw vital essence into the meridians · 9 stages' }, { s: 10, name: 'Foundation Establishment', desc: 'Build a vessel strong enough to hold the Dao · 3 stages' }, { s: 13, name: 'Golden Core', desc: 'Condense the inner sea into a perfect core · 3 stages' }, { s: 16, name: 'Nascent Soul', desc: 'Give form to the spirit within · 3 stages' }, { s: 19, name: 'Spirit Severing', desc: 'Cut the threads that bind you to the mundane · 3 stages' }, { s: 22, name: 'Dao Ascendant', desc: 'Walk in harmony with the great order · 3 stages' }, { s: 25, name: 'Immortal', desc: 'Beyond the final gate, the long journey begins anew.' }];
    $('view-codex').innerHTML = `${subHead('A RECORD OF THE GREAT WAY', 'The cultivator’s codex', 'A map of the realms, teachings, and principles of the immortal path.', '▤')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">REALMS OF THE WORLD</div><h2>Steps beyond the mortal veil</h2><p>Each breakthrough deepens the foundation. The next realm is revealed only when the previous threshold has been crossed.</p><div class="codex-list">${entries.map((e, i) => `<div class="codex-realm ${state.stage >= e.s ? 'unlocked' : ''}"><span class="codex-node">${state.stage >= e.s ? '✦' : '·'}</span><div><h3>${e.name}</h3><p>${e.desc}</p></div><small>${state.stage >= e.s ? (state.stage >= (entries[i + 1]?.s ?? 999) ? 'MASTERED' : 'DISCOVERED') : 'UNKNOWN'}</small></div>`).join('')}</div></article></div><aside class="subview-aside"><article class="feature-card"><div class="eyebrow">THE WAY IS LONG</div><h3>${realmTitle()}</h3><p>You have crossed ${state.stage} breakthrough${state.stage === 1 ? '' : 's'}. Accumulate qi, refine your arts, and take each step when ready.</p><div class="feature-stats"><span>REALM STAGE <b>${state.stage}</b></span><span>TOTAL QI <b>${nfmt(state.totalQi)}</b></span></div></article><article class="content-panel"><div class="eyebrow">THE THREE FOUNDATIONS</div><h2>Body · Spirit · Qi</h2><p>Qi is the world's breath. Spirit is the will that shapes it. The body is the vessel that endures its power. Tend to all three.</p></article></aside></div>`;
  }
  function renderPaths() {
    const bodyLevel = state.pathLevels.body, spiritLevel = state.pathLevels.spirit;
    const bodyCost = bodyFloorRequirement(), qiCost = requirement();
    const qiRealm = realmProgress(state.stage), bodyRealm = realmProgress(state.pathProgress.body);
    const qiFloorProgress = Math.min(100, state.qi / qiCost * 100);
    const bodyFloorProgress = Math.min(100, state.qi / bodyCost * 100);
    const qiRealmLabel = qiRealm.band ? `${qiRealm.band.name} · ${qiRealm.phase} ${qiRealm.floor}/${qiRealm.floors}` : 'Mortal · before first floor';
    const bodyRealmLabel = bodyRealm.band ? `${bodyRealm.band.name} · ${bodyRealm.phase} ${bodyRealm.floor}/${bodyRealm.floors}` : 'Mortal · before first floor';
    const gate = gateFor(), missing = gateNeeds();
    const unlockRows = progressionUnlocks.map(item => `<div class="progression-unlock ${state.stage >= item.stage ? 'unlocked' : 'locked'}"><span>${state.stage >= item.stage ? '✦' : '⌑'}</span><div><b>${item.title}</b><small>${item.detail}</small></div><em>${state.stage >= item.stage ? 'UNLOCKED' : `STAGE ${item.stage}`}</em></div>`).join('');
    $('view-paths').innerHTML = `${subHead('TWO WAYS TO IMMORTALITY', 'Choose your cultivation path', 'Advance the Qi realm floor by floor, while tempering a separate Body path. Each has its own requirements and lasting bonuses.', '☯')}<div class="path-choice-grid"><article class="path-card qi-path"><div class="path-seal">氣</div><div class="eyebrow">THE INNER MERIDIAN</div><h2>Qi cultivation</h2><p>Gather essence and cross each realm floor through a breakthrough. Major thresholds demand a prepared foundation.</p><div class="path-level">CURRENT REALM <b>${realmTitle()} · Floor ${qiRealm.floor || 0}</b></div><div class="path-floor-label"><span>${qiRealmLabel}</span><b>${nfmt(state.qi)} / ${nfmt(qiCost)} qi</b></div><div class="path-progress-track"><i style="width:${qiFloorProgress}%"></i></div><div class="inventory-row"><span>Next floor</span><b>${realmTitle(state.stage + 1)} · ${realmProgress(state.stage + 1).phase}</b></div><div class="inventory-row"><span>Breakthrough conditions</span><b>${gate ? gateSummary() : 'Qi threshold'}</b></div>${gate && missing.length ? `<div class="path-warning">Still needed: ${missing.join(' · ')}</div>` : `<div class="path-bonus-line">Realm benefit · Qi flow +${(pathBonus('qi', state.pathProgress.qi) * 100).toFixed(0)}%</div>`}<div class="path-bonus-line">Current floor progress · ${Math.floor(qiFloorProgress)}%</div></article><article class="path-card body-path"><div class="path-seal">體</div><div class="eyebrow">THE IRON VESSEL</div><h2>Body cultivation</h2><p>Temper bone, blood, and breath independently of realm breakthroughs. Every Body floor increases vitality and physical force.</p><div class="path-level">BODY REALM <b>Rank ${bodyLevel} · Floor ${bodyRealm.floor || 0}</b></div><div class="path-floor-label"><span>${bodyRealmLabel}</span><b>${nfmt(state.qi)} / ${nfmt(bodyCost)} shared qi</b></div><div class="path-progress-track body-track"><i style="width:${bodyFloorProgress}%"></i></div><div class="path-progress-caption">Shared Qi available toward this independent Body floor</div><div class="inventory-row"><span>Next floor conditions</span><b>${nfmt(bodyCost)} qi · 5 spirit stones</b></div><div class="path-bonus-line">Floor bonus · +${pathBonus('body', state.pathProgress.body) * 3} max health · +${state.pathProgress.body} physical force</div><button class="action-btn" data-action="train-path" data-id="body" ${state.qi < bodyCost || state.stones < 5 ? 'disabled' : ''}>Break through Body floor</button><div class="path-bonus-line">Current floor progress · ${Math.floor(bodyFloorProgress)}%</div></article></div><article class="content-panel path-note"><div class="eyebrow">YOUR FOUNDATION</div><h2>Paths advance at their own pace</h2><p>Qi breakthroughs unlock new realms and trials. Body breakthroughs have their own escalating Qi and stone cost; Spirit ranks continue to strengthen spiritual arts and meditation.</p><div class="feature-stats"><span>QI FLOOR <b>${state.pathProgress.qi}</b></span><span>BODY FLOOR <b>${state.pathProgress.body}</b></span><span>SPIRIT RANK <b>${spiritLevel}</b></span><span>QI FLOW <b>${rateFor().toFixed(1)} / sec · +${(pathBonus('qi', state.pathProgress.qi) * 100).toFixed(0)}%</b></span></div></article><article class="content-panel progression-panel"><div class="eyebrow">REALM PROGRESSION</div><h2>Trials, rewards, and unlocks</h2><p>${gate ? `${gate.label}: ${missing.length ? `Requirements remaining — ${missing.join(' · ')}` : 'All requirements met; gather the Qi threshold to attempt the breakthrough.'}` : 'No additional trial requirements at this floor.'} Successful breakthroughs grant spirit stones and open new paths through the world.</p><div class="progression-unlock-list">${unlockRows}</div></article>`;
  }
  function renderCombat() {
    const enemy = state.enemy;
    const spell = currentSpell();
    const enemyCard = enemy ? `<div class="enemy-card"><div class="enemy-glyph">${enemy.icon}</div><div class="enemy-info"><div class="eyebrow">${sects[enemy.sect]?.name || 'WILDERNESS'} ENCOUNTER · ${enemy.level ? `REALM ${enemy.level}` : 'BEAST'}</div><h2>${enemy.name}</h2><div class="health-label"><span>HEALTH</span><b>${Math.max(0, enemy.hp)} / ${enemy.maxHp}</b></div><div class="health-track"><i style="width:${Math.max(0, enemy.hp / enemy.maxHp * 100)}%"></i></div></div></div><div class="combat-actions"><button class="action-btn body-strike" data-action="attack" data-style="body">Body strike · ${attackDamage(3 + state.pathLevels.body * 4 + state.stage)}–${attackDamage(7 + state.pathLevels.body * 5 + state.stage)} dmg</button><button class="action-btn spirit-strike" data-action="attack" data-style="spirit" ${state.qi < 8 ? 'disabled' : ''}>Spirit art · ${attackDamage(6 + state.pathLevels.spirit * 5 + state.stage)}–${attackDamage(12 + state.pathLevels.spirit * 6 + state.stage)} dmg · 8 qi</button><button class="action-btn sect-spell" data-action="cast-spell" ${state.qi < spell.cost ? 'disabled' : ''}>${spell.seal} ${spell.name} · ${attackDamage(spell.damage + state.pathLevels.spirit * 4 + state.stage)} dmg · ${spell.cost} qi</button><button class="action-btn" data-action="flee">Retreat</button></div>` : `<div class="encounter-empty"><div class="empty-mark">⚔</div><h2>The forest is quiet—for now.</h2><p>Seek a ${sectData().name} spirit beast to test your cultivation. Victory earns spirit stones, sect merit, and a chance at rare ingredients.</p><button class="action-btn" data-action="seek-enemy">Seek a spirit beast</button></div>`;
    const hpPercent = Math.max(0, state.hp / state.maxHp * 100);
    $('view-combat').innerHTML = `${subHead('TRIAL BY COMBAT', 'Spirit beast grounds', 'Face the creatures beyond the sect wall. Choose how to fight, watch your health, and claim the spoils.', '⚔')}<div class="subview-layout"><div class="subview-main"><article class="content-panel combat-panel"><div class="eyebrow">${enemy ? 'ACTIVE BATTLE' : 'READY YOURSELF'}</div>${enemyCard}</article><article class="content-panel"><div class="eyebrow">YOUR VITALITY</div><h2>${Math.ceil(state.hp)} / ${state.maxHp} health</h2><div class="health-track player-health"><i style="width:${hpPercent}%"></i></div><p class="combat-tip">Body strikes are free and scale with body cultivation. Spirit arts spend 8 qi but hit harder. A prepared healing pill restores health.</p></article></div><aside class="subview-aside"><article class="content-panel"><div class="eyebrow">BATTLE RECORD</div><h2>${state.wins || 0} victories</h2><div class="inventory-row"><span>Spirit stones</span><b>◇ ${nfmt(state.stones)}</b></div><div class="inventory-row"><span>Sect merit</span><b>${state.sectRep}</b></div><div class="inventory-row"><span>Herb · root · flower</span><b>${state.herbs.herb} · ${state.herbs.root} · ${state.herbs.flower}</b></div></article><article class="feature-card"><div class="eyebrow">FIELD COUNSEL</div><h3>Prepare before you hunt</h3><p>Craft Stillwater Tea in the Alchemy Pavilion to restore health. If your health reaches zero, you are carried back to safety at a fraction of your vitality.</p><button class="action-btn" data-view="alchemy">Visit alchemy</button></article></aside></div>`;
  }
  function renderSect() {
    const rank = sectRanks[state.sectRank] || sectRanks[0], next = sectRanks[state.sectRank + 1];
    const progress = next ? Math.min(100, state.sectRep / next.need * 100) : 100;
    const ranks = sectRanks.map((r, i) => `<div class="sect-rank ${i <= state.sectRank ? 'unlocked' : ''}"><span>${i <= state.sectRank ? '✦' : '·'}</span><div><b>${r.name}</b><small>${r.need} merit</small></div>${i === state.sectRank ? '<em>CURRENT</em>' : ''}</div>`).join('');
    const sectCards = Object.entries(sects).map(([id, sect]) => `<article class="sect-choice ${state.sectId === id ? 'selected' : ''}"><div class="tech-seal">${sect.seal}</div><h3>${sect.name}</h3><p>${sect.bonus}</p><button class="action-btn" data-action="join-sect" data-id="${id}" ${state.sectId === id ? 'disabled' : ''}>${state.sectId === id ? 'Current sect' : 'Join sect'}</button></article>`).join('');
    const mission = state.mission && missions.find(m => m.id === state.mission.id);
    const missionPanel = mission ? `<div class="inventory-row"><span>${mission.name}</span><b>${Math.min(state.mission.progress, mission.target)} / ${mission.target}</b></div><p>${mission.desc} Reward: ${mission.stones} stones · ${mission.tokens} sect tokens · ${mission.merit} merit.</p><button class="action-btn" data-action="claim-mission" ${state.mission.progress < mission.target ? 'disabled' : ''}>${state.mission.progress >= mission.target ? 'Claim mission reward' : 'Mission in progress'}</button>` : missions.map(m => `<div class="mission-row"><h3>${m.name}</h3><p>${m.desc}</p><small>Reward · ${m.stones} stones · ${m.tokens} tokens · ${m.merit} merit</small><button class="action-btn" data-action="accept-mission" data-id="${m.id}">Accept mission</button></div>`).join('');
    const equipment = gearCatalog.map(item => {
      const gear = state.equipment[item.id], upgradeCost = 35 * (gear.level + 1);
      const locked = state.stage < item.minStage;
      return `<article class="gear-card ${locked ? 'gear-locked' : ''}"><div class="tech-seal">${item.seal}</div><h3>${item.name}</h3><p>${item.bonus}</p><div class="tech-level">${gear.owned ? `EQUIPPED · LEVEL ${gear.level}` : locked ? `UNLOCKS AT STAGE ${item.minStage}` : 'NOT OWNED'}</div>${gear.owned ? `<button class="action-btn" data-action="upgrade-gear" data-id="${item.id}" ${state.stones < upgradeCost || gear.level >= 10 ? 'disabled' : ''}>${gear.level >= 10 ? 'Max level' : `Upgrade · ◇ ${upgradeCost}`}</button>` : `<button class="action-btn" data-action="buy-gear" data-id="${item.id}" ${locked || state.sectTokens < item.tokens ? 'disabled' : ''}>${locked ? `Requires stage ${item.minStage}` : `Buy · ${item.tokens} sect tokens`}</button>`}</article>`;
    }).join('');
    $('view-sect').innerHTML = `${subHead('THE GREAT SECTS', 'Sect Hall', 'Choose a sect, complete its missions, and earn the gear to strengthen your path.', sectData().seal)}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">CHOOSE YOUR ALLIANCE</div><h2>Three sects, three disciplines</h2><div class="sect-choice-grid">${sectCards}</div><div class="feature-stats"><span>SECT RANK BONUS <b>+${state.sectRank * 3}% attack · +${state.sectRank * 2}% qi</b></span><span>FACTION BONUS <b>${sectData().bonus}</b></span></div></article><article class="content-panel sect-progress"><div class="eyebrow">YOUR STANDING · ${sectData().name}</div><h2>${rank.name}</h2><p>${next ? `${next.need - state.sectRep} merit until promotion to ${next.name}.` : 'You have reached the highest sect rank.'}</p><div class="mini-track"><i style="width:${progress}%"></i></div><div class="inventory-row"><span>Sect merit</span><b>${state.sectRep} / ${next?.need || 'MAX'}</b></div><button class="action-btn" data-action="donate" ${state.stones < 10 || !next ? 'disabled' : ''}>Donate 10 spirit stones · +4 merit</button></article><article class="content-panel"><div class="eyebrow">SECT MISSIONS</div><h2>Earn tokens and merit</h2><p>Complete beast-hunting assignments to earn sect tokens, spirit stones, and promotion merit.</p><div class="inventory-row"><span>Sect tokens</span><b>✦ ${nfmt(state.sectTokens)}</b></div>${missionPanel}</article><article class="content-panel"><div class="eyebrow">ARMORY · TOKENS ${nfmt(state.sectTokens)} · STONES ${nfmt(state.stones)}</div><h2>Equipment and refinement</h2><p>Buy each gear piece with sect tokens, then spend spirit stones to upgrade its bonus.</p><div class="gear-grid">${equipment}</div></article><article class="content-panel"><div class="eyebrow">THE LADDER OF SERVICE</div><h2>Disciple ranks</h2><div class="sect-rank-list">${ranks}</div></article></div><aside class="subview-aside"><article class="feature-card"><div class="eyebrow">${sectData().name}</div><h3>Your sect empowers your cultivation</h3><p>Promotions strengthen your attacks and qi flow. Gear adds further bonuses, while your sect's unique spell is available in combat.</p><div class="feature-stats"><span>CURRENT RANK <b>${rank.name}</b></span><span>MAX HEALTH <b>${state.maxHp}</b></span><span>ATTACK BONUS <b>+${Math.round((sectData().attack + state.sectRank * .03) * 100)}%</b></span><span>QI FLOW BONUS <b>+${Math.round((sectData().qi + state.sectRank * .02 + gearStat('qi')) * 100)}%</b></span></div></article><article class="content-panel"><div class="eyebrow">SECT SERVICE</div><h2>Rise together</h2><p>Defeat beasts to earn merit and progress your active mission. Every promotion also grants +10 maximum health.</p></article></aside></div>`;
  }
  function renderSubView() {
    if (activeView === 'paths') renderPaths();
    if (activeView === 'combat') renderCombat();
    if (activeView === 'sect') renderSect();
    if (activeView === 'techniques') renderTechniques();
    if (activeView === 'expeditions') renderExpeditions();
    if (activeView === 'alchemy') renderAlchemy();
    if (activeView === 'codex') renderCodex();
  }
  function setView(view) {
    activeView = view;
    document.querySelectorAll('.view').forEach(el => el.classList.toggle('active', el.id === `view-${view}`));
    document.querySelectorAll('[data-view]').forEach(el => el.classList.toggle('active', el.dataset.view === view));
    const names = { cultivate: 'CULTIVATION GROVE', paths: 'TWO CULTIVATION PATHS', combat: 'SPIRIT BEAST GROUNDS', sect: 'AZURE CLOUD SECT', techniques: 'SECT LIBRARY', expeditions: 'BEYOND THE SECT', alchemy: 'ALCHEMY PAVILION', codex: 'THE IMMORTAL CODEX' };
    $('crumbTitle').textContent = names[view] || names.cultivate;
    render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openBreakthrough() {
    $('modalSymbol').textContent = '破';
    $('modalEyebrow').textContent = 'REALM BREAKTHROUGH';
    $('modalTitle').textContent = 'The threshold awaits';
    const gate = gateFor();
    $('modalText').textContent = `Your meridians brim with qi. ${gate ? `${gate.label} requirements: ${gateSummary()}. ` : ''}Break through into ${realmTitle(state.stage + 1)}? Success chance: ${breakChance()}%. A failed attempt scatters some gathered qi, but your foundation will endure.`;
    $('modalActions').innerHTML = '<button class="secondary-btn" data-action="close-modal">Not yet</button><button class="primary-btn" data-action="attempt-break">Face the tribulation</button>';
    $('modalBackdrop').hidden = false;
  }
  function attemptBreak() {
    const targetStage = state.stage + 1;
    const missing = gateNeeds(targetStage);
    if (state.qi < requirement() || missing.length) {
      $('modalBackdrop').hidden = true;
      showToast(missing.length ? `Breakthrough requirements unmet · ${missing.join(' · ')}` : 'Gather enough qi before attempting a breakthrough.');
      return;
    }
    $('modalBackdrop').hidden = true;
    const gate = gateFor(targetStage);
    const chance = breakChance();
    if (Math.random() * 100 < chance) {
      state.qi = Math.max(0, state.qi - requirement());
      if (gate) {
        state.herbs.root -= gate.roots || 0;
        state.herbs.flower -= gate.flowers || 0;
      }
      state.stage += 1;
      state.pathProgress.qi = state.stage;
      const reward = 12 + Math.floor(state.stage / 2) * 3;
      state.stones += reward;
      const unlocked = progressionUnlocks.find(item => item.stage === state.stage);
      showToast(`Breakthrough! You reached ${realmTitle()} · +${reward} spirit stones${unlocked ? ` · unlocked: ${unlocked.title}` : ''}`);
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
    if (trip.id === 'herbs') { state.herbs.herb += 3; state.herbs.root += 1; }
    if (trip.id === 'ruins') { state.herbs.root += 2; state.herbs.flower += 2; }
    if (trip.id === 'frontier') { state.herbs.root += 3; state.herbs.flower += 3; }
    addRep(trip.id === 'frontier' ? 12 : trip.id === 'ruins' ? 8 : 4);
    showToast(`A safe return · +${reward} stones · medicinal ingredients gathered`); save(); render();
  }
  function brew(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe || state.stones < recipe.cost || !Object.entries(recipe.ingredients).every(([key, amount]) => state.herbs[key] >= amount)) return showToast('Gather the required ingredients and spirit stones first.');
    state.stones -= recipe.cost;
    Object.entries(recipe.ingredients).forEach(([key, amount]) => { state.herbs[key] -= amount; });
    state.brews = (state.brews || 0) + 1;
    if (recipe.type === 'qi') { state.qi += recipe.amount; state.qiToday += recipe.amount; state.totalQi += recipe.amount; }
    if (recipe.type === 'heal') { state.hp = Math.min(state.maxHp, state.hp + recipe.amount); state.qi += 30; state.qiToday += 30; state.totalQi += 30; }
    if (recipe.type === 'boost') { state.boosts += recipe.amount; state.milestones.push(`pill-${Date.now()}`); }
    if (recipe.type === 'stones') state.stones += recipe.amount;
    if (recipe.type === 'fortune') {
      state.stones += recipe.amount;
      state.qi += recipe.amount;
      state.qiToday += recipe.amount;
      state.totalQi += recipe.amount;
    }
    showToast(`${recipe.name} prepared.`); save(); render();
  }
  function trainPath(id) {
    if (!['body', 'spirit'].includes(id)) return;
    const level = state.pathLevels[id], cost = id === 'body' ? bodyFloorRequirement() : 50 + level * 45;
    if (state.qi < cost || state.stones < 5) return showToast('You need more qi and spirit stones to train.');
    state.qi -= cost; state.stones -= 5; state.pathLevels[id] += 1;
    if (id === 'body') state.pathProgress.body += 1;
    showToast(id === 'body' ? `Body breakthrough · ${realmTitle(state.pathProgress.body)} vessel` : 'Your spiritual sea expands; meditation flows faster.');
    save(); render();
  }
  function seekEnemy() {
    if (state.enemy) return;
    const unlockedEnemies = enemyKinds.filter(enemy => state.stage >= (enemy.minStage || 0));
    const sectEnemies = unlockedEnemies.filter(enemy => enemy.sect === state.sectId);
    const pool = sectEnemies.length ? sectEnemies : unlockedEnemies;
    if (!pool.length) return showToast(`No spirit beasts are available until stage ${Math.min(...enemyKinds.map(enemy => enemy.minStage || 0))}.`);
    const template = pool[Math.floor(Math.random() * pool.length)];
    const scale = 1 + state.stage * .12 + (state.wins || 0) * .035;
    const maxHp = Math.round(template.hp * scale);
    state.enemy = { ...template, hp: maxHp, maxHp, damage: Math.max(2, Math.round(template.damage * scale)), stones: Math.round(template.stones * scale), level: state.stage + 1 };
    showToast(`${template.name} emerges from the mist!`); save(); render();
  }
  function attackEnemy(style) {
    if (!state.enemy) return;
    let base;
    if (style === 'spirit') {
      if (state.qi < 8) return showToast('You need 8 qi to form a spirit art.');
      state.qi -= 8;
      base = 6 + state.pathLevels.spirit * 5 + state.stage + Math.floor(Math.random() * (7 + state.pathLevels.spirit));
    } else {
      base = 3 + state.pathLevels.body * 4 + state.stage + Math.floor(Math.random() * (5 + state.pathLevels.body));
    }
    damageEnemy(attackDamage(base), style === 'spirit' ? 'Your spirit art' : 'Your body strike');
    save(); render();
  }
  function castSectSpell() {
    if (!state.enemy) return;
    const spell = currentSpell();
    if (state.qi < spell.cost) return showToast(`You need ${spell.cost} qi to cast ${spell.name}.`);
    state.qi -= spell.cost;
    damageEnemy(attackDamage(spell.damage + state.pathLevels.spirit * 4 + state.stage), spell.name);
    if (spell.heal) state.hp = Math.min(state.maxHp, state.hp + spell.heal);
    save(); render();
  }
  function joinSect(id) {
    if (!sects[id] || id === state.sectId) return;
    state.sectId = id;
    showToast(`You have joined the ${sects[id].name} Sect. Its arts and beasts await.`);
    save(); render();
  }
  function acceptMission(id) {
    const mission = missions.find(item => item.id === id);
    if (!mission || state.mission) return showToast('Complete or claim your current mission first.');
    state.mission = { id, progress: 0 };
    showToast(`Mission accepted · ${mission.name}`); save(); render();
  }
  function claimMission() {
    const mission = state.mission && missions.find(item => item.id === state.mission.id);
    if (!mission || state.mission.progress < mission.target) return showToast('Defeat the required spirit beasts before claiming this mission.');
    state.stones += mission.stones;
    state.sectTokens += mission.tokens;
    addRep(mission.merit);
    state.mission = null;
    showToast(`Mission complete · +${mission.stones} stones · +${mission.tokens} sect tokens`);
    save(); render();
  }
  function buyGear(id) {
    const item = gearCatalog.find(entry => entry.id === id);
    if (!item || state.equipment[id]?.owned) return showToast('That equipment is unavailable.');
    if (state.stage < item.minStage) return showToast(`${item.name} unlocks at cultivation stage ${item.minStage}.`);
    if (state.sectTokens < item.tokens) return showToast('You need more sect tokens to buy that equipment.');
    state.sectTokens -= item.tokens;
    state.equipment[id] = { owned: true, level: 1 };
    showToast(`${item.name} equipped · ${item.bonus}`); render(); save();
  }
  function upgradeGear(id) {
    const item = gearCatalog.find(entry => entry.id === id), gear = state.equipment[id];
    if (!item || !gear?.owned || gear.level >= 10) return;
    const cost = 35 * (gear.level + 1);
    if (state.stones < cost) return showToast('Not enough spirit stones to refine this equipment.');
    state.stones -= cost; gear.level += 1;
    showToast(`${item.name} refined to level ${gear.level}.`); render(); save();
  }
  function donateToSect() {
    if (state.stones < 10 || state.sectRank >= sectRanks.length - 1) return;
    state.stones -= 10; addRep(4); showToast('A generous contribution · +4 sect merit.'); save(); render();
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
      case 'train-path': trainPath(action.dataset.id); break;
      case 'seek-enemy': seekEnemy(); break;
      case 'attack': attackEnemy(action.dataset.style); break;
      case 'cast-spell': castSectSpell(); break;
      case 'flee': state.enemy = null; showToast('You retreat safely from the encounter.'); save(); render(); break;
      case 'join-sect': joinSect(action.dataset.id); break;
      case 'accept-mission': acceptMission(action.dataset.id); break;
      case 'claim-mission': claimMission(); break;
      case 'buy-gear': buyGear(action.dataset.id); break;
      case 'upgrade-gear': upgradeGear(action.dataset.id); break;
      case 'donate': donateToSect(); break;
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
