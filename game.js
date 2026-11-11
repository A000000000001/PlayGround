(() => {
  /* ============================================================
     STILLWATER — Path of the Immortal
     Expanded edition: Dao · Roots · Meridians · Taming
     Inheritance · Secret Realms · Forge · Fate · Ascension
     ============================================================ */
  const SAVE_KEY = 'stillwater-cultivator-v1';
  const $ = (id) => document.getElementById(id);
  const nfmt = (n) => Math.floor(Number(n) || 0).toLocaleString();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dayIndex = (s = state) => Math.floor(s.totalSeconds / 300) + 1;
  const dayHash = (seed) => { let h = 2166136261; String(seed).split('').forEach(c => { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }); return Math.abs(h); };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------------- REALMS ---------------- */
  const realmBands = [
    { start: 1, end: 9, name: 'Qi Condensation', cn: '凝氣' },
    { start: 10, end: 12, name: 'Foundation Establishment', cn: '築基' },
    { start: 13, end: 15, name: 'Golden Core', cn: '金丹' },
    { start: 16, end: 18, name: 'Nascent Soul', cn: '元嬰' },
    { start: 19, end: 21, name: 'Spirit Severing', cn: '化神' },
    { start: 22, end: 24, name: 'Dao Ascendant', cn: '合道' },
    { start: 25, end: 27, name: 'True Immortal', cn: '真仙' },
    { start: 28, end: 30, name: 'Celestial Sovereign', cn: '天君' },
    { start: 31, end: 33, name: 'Sage of the Dao', cn: '道聖' },
    { start: 34, end: 36, name: 'Primordial Ancestor', cn: '太初' },
    { start: 37, end: Infinity, name: 'Beyond the Heavens', cn: '天外' }
  ];
  const majorStages = realmBands.filter(b => b.start > 1).map(b => b.start);
  const worldNames = ['Mortal Realm', 'Immortal Realm', 'Celestial Realm', 'Primordial Void'];

  const techniques = [
    { id: 'sutra', name: 'Clear Heart Sutra', seal: '心', desc: 'A serene mind draws pure qi from the surrounding world.', base: 30, effect: 'Meditation qi +35% / rank', kind: 'qi' },
    { id: 'array', name: 'Spirit-Gathering Array', seal: '聚', desc: 'Arrange spirit stones to coax the ley lines into motion.', base: 45, effect: 'Spirit stone yield +1 every 20 sec / rank', kind: 'stones' },
    { id: 'body', name: 'Jade Body Tempering', seal: '玉', desc: 'Temper the mortal vessel to weather the heavenly tribulation.', base: 65, effect: 'Breakthrough chance +4% / rank', kind: 'chance' },
    { id: 'beast', name: 'Beast Whisperer Sutra', seal: '獸', desc: 'Listen to the wild heart. Even a proud beast may bow its head.', base: 80, effect: 'Taming chance +4% / rank', kind: 'beast' },
    { id: 'alchemy', name: 'Herb-Lore Canon', seal: '藥', desc: 'Know the nature of every leaf, root, and petal.', base: 75, effect: 'Gathering yield +3% / rank', kind: 'herb' },
    { id: 'fortune', name: 'Karmic Divination', seal: '卜', desc: 'Read the threads of fate that gather around a fortunate soul.', base: 95, effect: 'Luck +1 / rank', kind: 'luck' },
    { id: 'dao', name: 'Dao Heart Sutra', seal: '道', desc: 'Still the heart, and the thousand laws will speak to you.', base: 110, effect: 'Dao insight +6% / rank', kind: 'dao' }
  ];
  const martialArts = [
    { id: 'cloudpalm', name: 'Cloudburst Palm', seal: '雲', cost: 150, req: 1, qi: 16, damage: 26, effect: 'plain', desc: 'A compressed wave of spirit qi, the first battle art of the Azure Cloud Sect.' },
    { id: 'flameserpent', name: 'Flame Serpent Art', seal: '炎', cost: 420, req: 8, qi: 22, damage: 38, effect: 'burn', desc: 'A coiling serpent of flame that clings to the wound.' },
    { id: 'thunderstep', name: 'Thunder Step', seal: '雷', cost: 680, req: 12, qi: 20, damage: 34, effect: 'crit', desc: 'Move with the sudden violence of a summer storm.' },
    { id: 'frostlotus', name: 'Frost Lotus Palm', seal: '冰', cost: 980, req: 16, qi: 26, damage: 46, effect: 'heal', heal: 22, desc: 'A pale lotus blooms; cold qi mends the body even as it strikes.' },
    { id: 'voidcut', name: 'Void Severing Cut', seal: '虛', cost: 1500, req: 20, qi: 34, damage: 66, effect: 'pierce', desc: 'Cut the space between cause and consequence.' },
    { id: 'lifebloom', name: 'Life Bloom Sutra', seal: '生', cost: 2100, req: 24, qi: 40, damage: 42, effect: 'heal', heal: 90, desc: 'The forbidden art of the Verdant Ancestor. Spring follows the blade.' }
  ];
  const ingredients = {
    herb: { name: 'Spirit Herb', seal: '草' }, root: { name: 'Ironroot', seal: '根' }, flower: { name: 'Moonflower', seal: '花' },
    ore: { name: 'Starfall Ore', seal: '礦' }, essence: { name: 'Spirit Essence', seal: '華' }, crystal: { name: 'Moon Crystal', seal: '晶' },
    beastCore: { name: 'Beast Core', seal: '核' }, voidDust: { name: 'Void Dust', seal: '虛' }, relic: { name: 'Ancient Relic', seal: '古' }
  };
  const recipes = [
    { id: 'qiPill', name: 'Qi-Gathering Pill', seal: '丹', desc: 'A warm current of essence, carefully sealed in jade.', cost: 12, ingredients: { herb: 2, root: 1 }, effect: 'Instantly gain 45 qi.', type: 'qi', amount: 45, unlockStage: 0, unlockBrews: 0 },
    { id: 'focusTea', name: 'Stillwater Tea', seal: '茶', desc: 'A fragrant infusion that steadies the wandering mind.', cost: 10, ingredients: { herb: 3 }, effect: 'Restore 40 health and gain 30 qi.', type: 'heal', amount: 40, unlockStage: 0, unlockBrews: 0 },
    { id: 'bodyPill', name: 'Ironroot Elixir', seal: '根', desc: 'A bitter tonic that fortifies the meridians.', cost: 18, ingredients: { root: 3 }, effect: 'Permanently gain +8% qi / sec.', type: 'boost', amount: .08, unlockStage: 0, unlockBrews: 0 },
    { id: 'fortune', name: 'Fortune Incense', seal: '香', desc: 'Auspicious smoke that draws spirit stones and gathers qi.', cost: 10, ingredients: { herb: 1, flower: 1 }, effect: 'Gain 1,000 spirit stones and 1,000 qi.', type: 'fortune', amount: 1000, unlockStage: 0, unlockBrews: 0 },
    { id: 'beastFeast', name: 'Spirit Beast Feast', seal: '飼', desc: 'A fragrant meal that strengthens a bonded companion.', cost: 22, ingredients: { herb: 2, root: 1 }, effect: 'Gain 3 beast food.', type: 'food', amount: 3, unlockStage: 3, unlockBrews: 1 },
    { id: 'meridianPill', name: 'Meridian Opening Pill', seal: '脈', desc: 'A sharp, clear elixir that clears a blocked meridian.', cost: 55, ingredients: { herb: 3, ore: 1 }, effect: 'Gain 1 meridian point.', type: 'meridian', amount: 1, unlockStage: 5, unlockBrews: 2 },
    { id: 'tribulationPill', name: 'Tribulation Pill', seal: '劫', desc: 'Condensed lightning, sealed in wax. Heaven will notice.', cost: 65, ingredients: { flower: 2, root: 2, essence: 1 }, effect: 'Next breakthrough chance +18%.', type: 'break', amount: 18, unlockStage: 8, unlockBrews: 3 },
    { id: 'luckPill', name: "Fortune's Favor Pill", seal: '運', desc: 'A golden pill that tastes faintly of rain and possibility.', cost: 90, ingredients: { flower: 2, herb: 1, crystal: 1 }, effect: 'Permanently gain +1 luck.', type: 'luck', amount: 1, unlockStage: 9, unlockBrews: 4 },
    { id: 'daoIncense', name: 'Dao Enlightenment Incense', seal: '悟', desc: 'Its smoke forms characters that vanish before they can be read.', cost: 120, ingredients: { flower: 2, essence: 2 }, effect: 'Gain 45 dao insight in every Dao.', type: 'dao', amount: 45, unlockStage: 10, unlockBrews: 5 },
    { id: 'rootElixir', name: 'Root Nourishing Pill', seal: '根', desc: 'A pill that feeds the spiritual root at its deepest layer.', cost: 140, ingredients: { essence: 2, flower: 2, ore: 1 }, effect: 'Gain 2 root essence.', type: 'rootEssence', amount: 2, unlockStage: 12, unlockBrews: 6 },
    { id: 'heavenPill', name: 'Heaven-Seizing Pill', seal: '天', desc: 'A pill that steals a sliver of heaven’s authority.', cost: 260, ingredients: { relic: 1, essence: 2, crystal: 2 }, effect: 'Gain 1,500 qi and +25% next breakthrough chance.', type: 'heaven', amount: 1500, unlockStage: 20, unlockBrews: 8 },
    { id: 'ascensionPill', name: 'Ascension Pill', seal: '仙', desc: 'The last medicine of the mortal world.', cost: 420, ingredients: { relic: 2, voidDust: 2, crystal: 2 }, effect: 'Gain 1 reincarnation point.', type: 'rebirth', amount: 1, unlockStage: 26, unlockBrews: 10 }
  ];
  const enemyKinds = [
    { name: 'Mistfang Wolf', icon: '狼', sect: 'azure', hp: 42, damage: 5, stones: 10, rep: 4, drop: 'herb', req: 1 },
    { name: 'Brambleback Boar', icon: '豕', sect: 'azure', hp: 58, damage: 7, stones: 14, rep: 5, drop: 'root', req: 2 },
    { name: 'Moonlit Wisp', icon: '魄', sect: 'jade', hp: 36, damage: 8, stones: 12, rep: 6, drop: 'flower', req: 3 },
    { name: 'Ashenhorn Stag', icon: '鹿', sect: 'crimson', hp: 52, damage: 8, stones: 18, rep: 7, drop: 'root', req: 4 },
    { name: 'Emberscale Serpent', icon: '蛇', sect: 'crimson', hp: 64, damage: 10, stones: 22, rep: 8, drop: 'flower', req: 6 },
    { name: 'Jadewing Crane', icon: '鶴', sect: 'jade', hp: 58, damage: 9, stones: 20, rep: 7, drop: 'herb', req: 7 },
    { name: 'Shadow Panther', icon: '豹', sect: 'azure', hp: 82, damage: 13, stones: 30, rep: 10, drop: 'essence', req: 9 },
    { name: 'Ironhide Ape', icon: '猿', sect: 'azure', hp: 120, damage: 15, stones: 38, rep: 12, drop: 'ore', req: 11 },
    { name: 'Bloodmoon Bat', icon: '蝠', sect: 'crimson', hp: 96, damage: 19, stones: 42, rep: 13, drop: 'crystal', req: 13 },
    { name: 'Frostscale Serpent', icon: '蛟', sect: 'jade', hp: 138, damage: 21, stones: 50, rep: 15, drop: 'crystal', req: 15 },
    { name: 'Thunderhawk', icon: '鷹', sect: 'azure', hp: 155, damage: 25, stones: 60, rep: 17, drop: 'essence', req: 17 },
    { name: 'Void Wraith', icon: '魅', sect: 'jade', hp: 190, damage: 30, stones: 78, rep: 20, drop: 'voidDust', req: 20 },
    { name: 'Corrupted Monk', icon: '僧', sect: 'crimson', hp: 240, damage: 36, stones: 96, rep: 24, drop: 'relic', req: 22 },
    { name: 'Demon Hound', icon: '犬', sect: 'crimson', hp: 280, damage: 43, stones: 120, rep: 28, drop: 'beastCore', req: 24 },
    { name: 'Starfall Chimera', icon: '猊', sect: 'azure', hp: 360, damage: 52, stones: 160, rep: 34, drop: 'crystal', req: 27 },
    { name: 'Heavenly Guardian', icon: '衛', sect: 'jade', hp: 460, damage: 62, stones: 210, rep: 40, drop: 'relic', req: 30 }
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
    { id: 'hunt3', name: 'Clear the Beast Trail', desc: 'Defeat 3 spirit beasts.', type: 'kill', target: 3, stones: 80, tokens: 8, merit: 12, req: 0 },
    { id: 'hunt5', name: 'Guard the Mountain Pass', desc: 'Defeat 5 spirit beasts.', type: 'kill', target: 5, stones: 150, tokens: 15, merit: 22, req: 2 },
    { id: 'hunt8', name: 'Cull the Ashen Pack', desc: 'Defeat 8 spirit beasts.', type: 'kill', target: 8, stones: 260, tokens: 22, merit: 34, req: 5 },
    { id: 'trip3', name: 'Chart the Wilds', desc: 'Complete 3 expeditions.', type: 'trip', target: 3, stones: 240, tokens: 20, merit: 30, req: 4 },
    { id: 'dao1', name: 'Attain a Dao Insight', desc: 'Comprehend a Dao once.', type: 'dao', target: 1, stones: 320, tokens: 26, merit: 40, req: 8 },
    { id: 'boss1', name: 'Fell a World Boss', desc: 'Defeat one world boss.', type: 'boss', target: 1, stones: 600, tokens: 50, merit: 70, req: 12 },
    { id: 'realm1', name: 'Enter the Hidden Realm', desc: 'Clear one secret realm.', type: 'realm', target: 1, stones: 720, tokens: 60, merit: 85, req: 14 },
    { id: 'hunt12', name: 'The Long Patrol', desc: 'Defeat 12 spirit beasts.', type: 'kill', target: 12, stones: 900, tokens: 70, merit: 100, req: 18 }
  ];
  const sectRanks = [
    { name: 'Outer Disciple', need: 0 }, { name: 'Inner Disciple', need: 20 }, { name: 'Core Disciple', need: 60 },
    { name: 'Elder', need: 120 }, { name: 'Sect Master', need: 220 }, { name: 'Grand Elder', need: 360 },
    { name: 'Dao Guardian', need: 540 }, { name: 'Immortal Patriarch', need: 800 }
  ];
  const gearCatalog = [
    { id: 'sword', name: 'Sword', seal: '劍', tokens: 8, bonus: 'Attack +6 / level', stat: 'attack', value: 6, rarity: 'Common' },
    { id: 'helmet', name: 'Helmet', seal: '盔', tokens: 6, bonus: 'Qi flow +4% / level', stat: 'qi', value: .04, rarity: 'Common' },
    { id: 'gloves', name: 'Gloves', seal: '手', tokens: 6, bonus: 'Attack +3 / level', stat: 'attack', value: 3, rarity: 'Common' },
    { id: 'pants', name: 'Pants', seal: '褲', tokens: 6, bonus: 'Max health +10 / level', stat: 'health', value: 10, rarity: 'Common' },
    { id: 'vest', name: 'Vest', seal: '甲', tokens: 7, bonus: 'Qi flow +5% / level', stat: 'qi', value: .05, rarity: 'Rare' },
    { id: 'shoes', name: 'Shoes', seal: '履', tokens: 5, bonus: 'Incoming damage -1 / level', stat: 'guard', value: 1, rarity: 'Common' }
  ];
  const sectBuildings = [
    { id: 'meditation', name: 'Meditation Hall', seal: '靜', perk: '+3% qi flow / level', desc: 'Incense and silence. The oldest engine of cultivation.' },
    { id: 'garden', name: 'Herb Garden', seal: '藥', perk: '+5% gathering yield / level', desc: 'Spirit herbs arranged according to the five elements.' },
    { id: 'beastpen', name: 'Beast Pen', seal: '獸', perk: '+2% taming chance / level', desc: 'A wild sanctuary where proud beasts learn trust.' },
    { id: 'formation', name: 'Formation Hall', seal: '陣', perk: '+2% breakthrough chance / level', desc: 'Ley-line diagrams that steady the mortal vessel.' },
    { id: 'armory', name: 'Refining Armory', seal: '器', perk: '+3% weapon power / level', desc: 'Cold anvils and hotter forge-fires.' },
    { id: 'library', name: 'Scripture Library', seal: '卷', perk: '+10% dao insight / level', desc: 'Scrolls older than the sect itself.' }
  ];
  const expeditions = [
    { id: 'herbs', name: 'Gathering in the Mistwood', icon: '林', desc: 'Follow the dew trails through the foothills. Return with medicinal herbs and a modest stone offering.', duration: 25, reward: 18, loot: { herb: 3, root: 1 }, rep: 4, req: 0 },
    { id: 'ruins', name: 'The Moonlit Ruins', icon: '月', desc: 'Search a forgotten shrine for spirit stones, ironroot, and rare moonflowers.', duration: 60, reward: 48, loot: { root: 2, flower: 2 }, rep: 8, req: 3 },
    { id: 'emberridge', name: 'Emberfall Ridge', icon: '炎', desc: 'Ash-choked cliffs where starfall ore glows in the cracks.', duration: 95, reward: 95, loot: { ore: 3, flower: 2 }, rep: 12, req: 8 },
    { id: 'mirrorlake', name: 'Mirror Lake Depths', icon: '鏡', desc: 'Dive beneath the glassy surface for moon crystals and lost relics.', duration: 135, reward: 160, loot: { crystal: 2, essence: 1, flower: 2 }, rep: 18, req: 13 },
    { id: 'voidrift', name: 'The Shifting Void Rift', icon: '虛', desc: 'A wound in the world. Void dust gathers where reality thins.', duration: 180, reward: 260, loot: { voidDust: 2, ore: 3, essence: 1 }, rep: 26, req: 18 },
    { id: 'celestial', name: 'Celestial Garden Overlook', icon: '苑', desc: 'A terrace above the clouds where ancient relics bear fruit.', duration: 240, reward: 420, loot: { relic: 1, crystal: 3, essence: 2 }, rep: 38, req: 24 }
  ];
  const rootTypes = [
    { id: 'metal', name: 'Metal Spirit Root', seal: '金', rarity: 'Common', weight: 15, desc: 'Sharp and unyielding. Metal roots sharpen every edge you touch.', bonus: { attack: .07 }, ability: 'Blade Intent — +7% attack.' },
    { id: 'wood', name: 'Wood Spirit Root', seal: '木', rarity: 'Common', weight: 15, desc: 'Roots remember the earth and reach for the sun.', bonus: { qi: .05, herb: .08, hp: .04 }, ability: 'Verdant Renewal — gathering and vitality flourish.' },
    { id: 'water', name: 'Water Spirit Root', seal: '水', rarity: 'Common', weight: 15, desc: 'Yielding, patient, impossible to hold. Qi flows to you like rain to a valley.', bonus: { qi: .09 }, ability: 'Tidal Breath — +9% qi flow.' },
    { id: 'fire', name: 'Fire Spirit Root', seal: '火', rarity: 'Common', weight: 14, desc: 'A hunger that turns herbs to medicine and enemies to ash.', bonus: { attack: .06, alchemy: .1, crit: .01 }, ability: 'Ember Heart — alchemy and attack improved.' },
    { id: 'earth', name: 'Earth Spirit Root', seal: '土', rarity: 'Common', weight: 14, desc: 'The mountain does not hurry, yet it outlasts the storm.', bonus: { hp: .08, guard: 1 }, ability: 'Mountain Stance — +8% health, +1 guard.' },
    { id: 'thunder', name: 'Thunder Spirit Root', seal: '雷', rarity: 'Rare', weight: 8, desc: 'Heaven’s temper runs in your blood. Your strikes arrive before their sound.', bonus: { attack: .05, crit: .04 }, ability: 'Thunderclap — +4% critical chance.' },
    { id: 'ice', name: 'Ice Spirit Root', seal: '冰', rarity: 'Rare', weight: 8, desc: 'Still water, frozen into perfect clarity. Nothing escapes your calm.', bonus: { qi: .06, guard: 1, luck: 1 }, ability: 'Frost Domain — clarity and fortune.' },
    { id: 'wind', name: 'Wind Spirit Root', seal: '風', rarity: 'Rare', weight: 7, desc: 'You were never quite where the world expected you to be.', bonus: { qi: .04, luck: 2 }, ability: 'Wandering Gale — +2 luck.' },
    { id: 'heaven', name: 'Heavenly Spirit Root', seal: '天', rarity: 'Heavenly', weight: 3, desc: 'The heavens themselves lean closer when you breathe.', bonus: { qi: .12, attack: .12, hp: .1, luck: 4, herb: .1 }, ability: "Heaven's Favor — broad mastery of every art." },
    { id: 'divine', name: 'Divine Chaos Root', seal: '神', rarity: 'Divine', weight: 1, desc: 'A root that should not exist in a mortal body. The Dao bends around it.', bonus: { qi: .2, attack: .18, hp: .15, luck: 8, herb: .15, crit: .04 }, ability: 'Primordial Harmony — all cultivation surges.' }
  ];
  const ROOT_GRADES = ['Mortal', 'Profound', 'Earth', 'Heaven', 'Divine'];
  const meridianList = [
    { id: 'lung', name: 'Lung Meridian', seal: '肺', points: 1, stones: 60, qi: 80, stage: 1, req: [], bonus: { qi: .03, hp: 5 }, desc: 'Breath becomes a river; qi flow +3%.' },
    { id: 'heart', name: 'Heart Meridian', seal: '心', points: 1, stones: 80, qi: 120, stage: 1, req: ['lung'], bonus: { hp: 10, attack: .02 }, desc: 'The heart’s fire steadies; health and attack rise.' },
    { id: 'liver', name: 'Liver Meridian', seal: '肝', points: 1, stones: 80, qi: 120, stage: 2, req: ['lung'], bonus: { attack: .03, herb: .03 }, desc: 'Wood qi nourishes growth and fury.' },
    { id: 'spleen', name: 'Spleen Meridian', seal: '脾', points: 1, stones: 110, qi: 180, stage: 3, req: ['heart'], bonus: { herb: .05, hp: 10 }, desc: 'Earth qi digests the world into strength.' },
    { id: 'kidney', name: 'Kidney Meridian', seal: '腎', points: 1, stones: 110, qi: 180, stage: 4, req: ['liver'], bonus: { guard: 1, hp: 8 }, desc: 'Water qi deepens your foundation.' },
    { id: 'pericardium', name: 'Pericardium Meridian', seal: '包', points: 1, stones: 150, qi: 260, stage: 6, req: ['heart', 'spleen'], bonus: { qi: .04, luck: 1 }, desc: 'The heart’s shield; qi and fortune gather.' },
    { id: 'stomach', name: 'Stomach Meridian', seal: '胃', points: 1, stones: 150, qi: 260, stage: 7, req: ['spleen'], bonus: { hp: 14, herb: .03 }, desc: 'Nourishment becomes endurance.' },
    { id: 'triple', name: 'Triple Burner', seal: '焦', points: 1, stones: 200, qi: 340, stage: 9, req: ['pericardium', 'stomach'], bonus: { luck: 1, qi: .03 }, desc: 'The three fires align; fortune follows.' },
    { id: 'ren', name: 'Ren Mai · Conception Vessel', seal: '任', points: 3, stones: 420, qi: 900, stage: 10, req: ['pericardium', 'stomach'], special: true, bonus: { qi: .08, hp: 20, attack: .05 }, desc: 'The sea of yin opens. A true foundation is required.', daoReq: { id: 'water', level: 2 } },
    { id: 'du', name: 'Du Mai · Governing Vessel', seal: '督', points: 3, stones: 550, qi: 1300, stage: 13, req: ['ren'], special: true, bonus: { attack: .08, guard: 2, crit: .02 }, desc: 'The spine becomes a pillar of lightning.', daoReq: { id: 'sword', level: 3 } },
    { id: 'dai', name: 'Dai Mai · Girdle Vessel', seal: '帶', points: 4, stones: 750, qi: 2200, stage: 16, req: ['du'], special: true, bonus: { hp: 40, qi: .1, herb: .08 }, desc: 'The girdle binds body and spirit into one vessel.', daoReq: { id: 'life', level: 3 } },
    { id: 'chong', name: 'Chong Mai · Thrusting Vessel', seal: '衝', points: 5, stones: 1100, qi: 3600, stage: 19, req: ['dai'], special: true, bonus: { qi: .12, attack: .1, hp: 50, luck: 2 }, desc: 'The central channel pierces every realm at once.', daoReq: { id: 'space', level: 3 } }
  ];
  const daoPaths = [
    { id: 'sword', name: 'Sword Dao', seal: '劍', color: '#8f7a4e', desc: 'The will made edge. Every cut is a sentence in a longer argument.', passive: '+4% attack per level', ability: 'Sword Heart (Lv 3) — critical strikes deal +25% more damage.' },
    { id: 'fire', name: 'Fire Dao', seal: '炎', color: '#b06a4d', desc: 'Destruction and renewal share the same hungry tongue.', passive: '+4% damage per level', ability: 'Ember Wake (Lv 3) — attacks have a 20% chance to burn for extra damage.' },
    { id: 'water', name: 'Water Dao', seal: '水', color: '#527f9d', desc: 'Nothing is softer, and nothing wears down the world so completely.', passive: '+3% qi flow per level', ability: 'Tidal Return (Lv 3) — recover health each second out of combat.' },
    { id: 'lightning', name: 'Lightning Dao', seal: '雷', color: '#8a7fb0', desc: 'The instant between intention and consequence.', passive: '+2% critical chance per level', ability: 'Heaven’s Tempo (Lv 3) — critical hits also restore 4 qi.' },
    { id: 'space', name: 'Space Dao', seal: '虛', color: '#6c7f8a', desc: 'Distance is a habit, not a law.', passive: '+1.5% expedition speed and +1% evasion per level', ability: 'Fold Step (Lv 3) — 15% chance to evade enemy retaliation.' },
    { id: 'life', name: 'Life Dao', seal: '生', color: '#5e8a68', desc: 'The stubborn insistence that things should continue.', passive: '+3% health and +4% gathering per level', ability: 'Verdant Pulse (Lv 3) — regenerate health during battle.' }
  ];
  const DAO_XP = [0, 30, 80, 150, 250, 380, 550, 760, 1020, 1330, 1700];
  const beastCatalog = [
    { id: 'mistwolf', name: 'Mistfang Wolf', icon: '狼', rarity: 'Common', req: 2, cost: 18, power: 7, bonus: { attack: .03 }, passive: '+3% attack', evolve: 'direwolf', tameable: true },
    { id: 'moonhare', name: 'Moonlit Hare', icon: '兔', rarity: 'Common', req: 1, cost: 14, power: 5, bonus: { luck: 1 }, passive: '+1 luck', evolve: 'jadehare', tameable: true },
    { id: 'emberfox', name: 'Ember Fox', icon: '狐', rarity: 'Rare', req: 8, cost: 38, power: 13, bonus: { attack: .04, crit: .02 }, passive: '+4% attack, +2% crit', evolve: 'ninefox', tameable: true },
    { id: 'jadecrane', name: 'Jadewing Crane', icon: '鶴', rarity: 'Rare', req: 10, cost: 42, power: 12, bonus: { qi: .05 }, passive: '+5% qi flow', evolve: 'skycrane', tameable: true },
    { id: 'stoneserpent', name: 'Stoneback Serpent', icon: '蛇', rarity: 'Rare', req: 12, cost: 48, power: 16, bonus: { guard: 1, hp: .04 }, passive: '+1 guard, +4% health', tameable: true },
    { id: 'thunderroc', name: 'Thunder Roc', icon: '鵬', rarity: 'Epic', req: 16, cost: 68, power: 24, bonus: { crit: .05, attack: .05 }, passive: '+5% crit, +5% attack', evolve: 'voidroc', tameable: true },
    { id: 'frosttiger', name: 'Frostmane Tiger', icon: '虎', rarity: 'Epic', req: 19, cost: 76, power: 27, bonus: { attack: .07, guard: 1 }, passive: '+7% attack, +1 guard', tameable: true },
    { id: 'azuredragon', name: 'Azure Dragonling', icon: '龍', rarity: 'Mythical', req: 22, cost: 130, power: 40, bonus: { qi: .12, attack: .1, hp: .08 }, passive: 'Dragon qi — all cultivation rises', tameable: true },
    { id: 'phoenix', name: 'Vermilion Phoenix', icon: '鳳', rarity: 'Mythical', req: 25, cost: 150, power: 46, bonus: { attack: .12, hp: .06, crit: .03 }, passive: '+12% attack, +6% health', tameable: true },
    { id: 'qilin', name: 'Celestial Qilin', icon: '麟', rarity: 'Mythical', req: 28, cost: 175, power: 54, bonus: { qi: .1, attack: .1, luck: 4, hp: .08 }, passive: 'Auspicious beast — great fortune', tameable: true },
    { id: 'direwolf', name: 'Mistfang Direwolf', icon: '狼', rarity: 'Rare', req: 99, cost: 0, power: 18, bonus: { attack: .06, crit: .02 }, passive: '+6% attack, +2% crit', tameable: false },
    { id: 'jadehare', name: 'Jade Moon Hare', icon: '兔', rarity: 'Rare', req: 99, cost: 0, power: 12, bonus: { luck: 3, qi: .04 }, passive: '+3 luck, +4% qi', tameable: false },
    { id: 'ninefox', name: 'Nine-Tailed Emberfox', icon: '狐', rarity: 'Epic', req: 99, cost: 0, power: 30, bonus: { attack: .09, crit: .05 }, passive: '+9% attack, +5% crit', tameable: false },
    { id: 'skycrane', name: 'Sky-Soaring Crane', icon: '鶴', rarity: 'Epic', req: 99, cost: 0, power: 28, bonus: { qi: .1, luck: 2 }, passive: '+10% qi, +2 luck', tameable: false },
    { id: 'voidroc', name: 'Voidwing Roc', icon: '鵬', rarity: 'Mythical', req: 99, cost: 0, power: 52, bonus: { crit: .08, attack: .08, qi: .06 }, passive: '+8% crit and attack', tameable: false }
  ];
  const artifactCatalog = [
    { id: 'swordheart', name: 'Heart of the Sword Saint', seal: '劍', rarity: 'Legendary', bonus: { attack: .12, crit: .05 }, ability: '+12% attack, +5% crit. The heartbeat of a dead swordsman.' },
    { id: 'flamecore', name: 'Flame Emperor’s Core', seal: '炎', rarity: 'Legendary', bonus: { attack: .1, herb: .08 }, ability: '+10% attack. Alchemy fires burn hotter.' },
    { id: 'moonmirror', name: 'Moon Goddess’ Mirror', seal: '月', rarity: 'Legendary', bonus: { qi: .12, luck: 3 }, ability: '+12% qi flow, +3 luck. It reflects a sky that is not there.' },
    { id: 'voidpearl', name: 'Void Ancestor’s Pearl', seal: '虛', rarity: 'Mythical', bonus: { qi: .1, attack: .1, crit: .03 }, ability: 'Space folds around its bearer.' },
    { id: 'dragonpearl', name: 'Azure Dragon Pearl', seal: '龍', rarity: 'Mythical', bonus: { hp: .12, attack: .12, qi: .08 }, ability: 'The old dragon’s breath still moves inside.' },
    { id: 'starcrown', name: 'Crown of Fallen Stars', seal: '星', rarity: 'Mythical', bonus: { qi: .14, luck: 5 }, ability: 'Fortune trails you like a comet’s tail.' },
    { id: 'karmicwheel', name: 'Karmic Wheel', seal: '輪', rarity: 'Divine', bonus: { attack: .1, hp: .1, qi: .1, luck: 4 }, ability: 'Every choice returns. Every return is a gift.' }
  ];
  const weaponCatalog = [
    { id: 'ironwood', name: 'Ironwood Sword', seal: '劍', rarity: 'Common', req: 1, attack: 8, cost: { stones: 120, ore: 2 }, ability: 'A dependable blade for a first disciple.' },
    { id: 'mistfang', name: 'Mistfang Blade', seal: '刃', rarity: 'Rare', req: 8, attack: 19, cost: { stones: 420, ore: 8, crystal: 1 }, ability: 'Mist Step — 10% chance to evade retaliation.' },
    { id: 'emberfang', name: 'Emberfang Saber', seal: '炎', rarity: 'Rare', req: 13, attack: 32, cost: { stones: 900, ore: 14, crystal: 2 }, ability: 'Ember Edge — 25% chance to burn for +35% damage.' },
    { id: 'frostmirror', name: 'Frost Mirror Sword', seal: '冰', rarity: 'Epic', req: 17, attack: 48, cost: { stones: 1600, ore: 20, crystal: 4 }, ability: 'Frostbite — 20% chance to weaken the next retaliation.' },
    { id: 'voidpiercer', name: 'Void Piercer', seal: '虛', rarity: 'Epic', req: 21, attack: 68, cost: { stones: 2800, ore: 24, voidDust: 4 }, ability: 'Void Cut — ignores half of enemy guard.' },
    { id: 'heavensedge', name: "Heaven's Edge", seal: '天', rarity: 'Mythical', req: 26, attack: 104, cost: { stones: 5200, ore: 30, relic: 2, beastCore: 2 }, ability: "Heaven's Edge — critical hits deal +35% extra damage." }
  ];
  const inheritanceCatalog = [
    { id: 'swordtomb', name: "Sword Saint's Tomb", seal: '劍', req: 8, cost: { stones: 200, relic: 1 }, desc: 'A tomb without a body, only a sword and a question.', artifact: 'swordheart', art: null, bonus: '+12% attack, +5% crit',
      trials: [
        { name: 'Blade Echo', desc: 'Reach Sword Dao level 2.', check: (s) => daoLevel('sword', s) >= 2, reward: { daoXp: { sword: 80 }, stones: 100 } },
        { name: 'Guardian of the Tomb', desc: 'Defeat 10 spirit beasts.', check: (s) => (s.stats?.kills || 0) >= 10, reward: { stones: 150, ore: 3 } },
        { name: 'Sword Heart', desc: 'Reach Golden Core (stage 13).', check: (s) => s.stage >= 13, reward: { keys: 1, rootEssence: 2 } }
      ] },
    { id: 'flamepyre', name: "Flame Emperor's Pyre", seal: '炎', req: 12, cost: { stones: 380, relic: 1 }, desc: 'The pyre still burns. Its keeper left no ashes.', artifact: 'flamecore', art: 'flameserpent', bonus: '+10% attack, alchemy fires',
      trials: [
        { name: 'Ember Meditation', desc: 'Reach Fire Dao level 2.', check: (s) => daoLevel('fire', s) >= 2, reward: { daoXp: { fire: 100 } } },
        { name: 'The Keeper’s Craft', desc: 'Brew 5 elixirs.', check: (s) => (s.brews || 0) >= 5, reward: { stones: 180, essence: 2 } },
        { name: 'Walk Through Fire', desc: 'Reach Nascent Soul (stage 16).', check: (s) => s.stage >= 16, reward: { keys: 1, rootEssence: 2 } }
      ] },
    { id: 'moondream', name: 'Moon Goddess’ Dream', seal: '月', req: 16, cost: { stones: 650, relic: 2 }, desc: 'A dream sleeping beneath a lake, waiting for a lucid guest.', artifact: 'moonmirror', art: null, bonus: '+12% qi, +3 luck',
      trials: [
        { name: 'Still Water', desc: 'Reach Water Dao level 3.', check: (s) => daoLevel('water', s) >= 3, reward: { daoXp: { water: 110 } } },
        { name: 'Kindred Spirits', desc: 'Bond with 2 spirit beasts.', check: (s) => Object.keys(s.taming?.beasts || {}).length >= 2, reward: { food: 3, stones: 250 } },
        { name: 'The Silver Shore', desc: 'Reach Spirit Severing (stage 19).', check: (s) => s.stage >= 19, reward: { keys: 1, rootEssence: 3 } }
      ] },
    { id: 'voidsanc', name: 'Void Ancestor’s Sanctum', seal: '虛', req: 20, cost: { stones: 1100, relic: 2, voidDust: 2 }, desc: 'A room with no walls, built by someone who forgot distance.', artifact: 'voidpearl', art: 'voidcut', bonus: '+10% qi and attack, +3% crit',
      trials: [
        { name: 'Fold the World', desc: 'Reach Space Dao level 3.', check: (s) => daoLevel('space', s) >= 3, reward: { daoXp: { space: 130 } } },
        { name: 'Beyond the Veil', desc: 'Clear 2 secret realms.', check: (s) => (s.stats?.realms || 0) >= 2, reward: { keys: 2, voidDust: 2 } },
        { name: 'The Empty Throne', desc: 'Reach Dao Ascendant (stage 22).', check: (s) => s.stage >= 22, reward: { keys: 1, rootEssence: 4 } }
      ] },
    { id: 'dragonlegacy', name: 'Azure Dragon’s Legacy', seal: '龍', req: 24, cost: { stones: 2000, relic: 3, beastCore: 2 }, desc: 'The first dragon of the eastern sea left its heartbeat in a pearl.', artifact: 'dragonpearl', art: 'lifebloom', bonus: '+12% health and attack',
      trials: [
        { name: 'Dragon’s Breath', desc: 'Defeat a world boss.', check: (s) => (s.stats?.bosses || 0) >= 1, reward: { stones: 500, beastCore: 2 } },
        { name: 'Five Clawed Intent', desc: 'Reach Sword Dao level 4.', check: (s) => daoLevel('sword', s) >= 4, reward: { daoXp: { sword: 150 } } },
        { name: 'The Eastern Sea', desc: 'Reach True Immortal (stage 25).', check: (s) => s.stage >= 25, reward: { keys: 2, rootEssence: 5 } }
      ] }
  ];
  const secretRealms = [
    { id: 'grotto', name: 'Whispering Grotto', seal: '穴', req: 5, keyCost: 1, qiCost: 120, boss: { name: 'Mossbound Guardian', icon: '魈', hp: 260, damage: 12, trait: 'Regrows 4% health each turn.', type: 'regen' }, drops: { essence: 2, ore: 2 }, stones: 180, desc: 'A cave that repeats your thoughts back in older voices.' },
    { id: 'mirror', name: 'Mirror Lake Sanctum', seal: '鏡', req: 10, keyCost: 1, qiCost: 300, boss: { name: 'Lakelight Serpent', icon: '蛟', hp: 620, damage: 20, trait: 'Drains 6 qi each turn.', type: 'drain' }, drops: { crystal: 2, flower: 3 }, stones: 380, desc: 'The lake’s reflection does not always match the sky.' },
    { id: 'ember', name: 'Emberfall Crypt', seal: '炎', req: 14, keyCost: 2, qiCost: 600, boss: { name: 'Ashen King', icon: '王', hp: 1150, damage: 29, trait: 'Burns you for 7 extra damage.', type: 'burn' }, drops: { ore: 3, beastCore: 1, flower: 2 }, stones: 720, desc: 'A king who refused to die and forgot why.' },
    { id: 'void', name: 'Void Rift', seal: '虛', req: 18, keyCost: 2, qiCost: 1100, boss: { name: 'Unmade Wanderer', icon: '無', hp: 1950, damage: 41, trait: 'Ignores half your guard.', type: 'pierce' }, drops: { voidDust: 3, crystal: 2 }, stones: 1200, desc: 'A corridor of missing stars and patient hunger.' },
    { id: 'garden', name: 'Celestial Garden', seal: '苑', req: 23, keyCost: 3, qiCost: 2000, boss: { name: 'Jade Lion of Dawn', icon: '獅', hp: 3300, damage: 58, trait: 'Heals 8% each turn.', type: 'regen' }, drops: { relic: 1, essence: 3, crystal: 2 }, stones: 2100, desc: 'Fruit that remembers the first morning.' },
    { id: 'primordial', name: 'Primordial Sea', seal: '海', req: 28, keyCost: 4, qiCost: 3600, boss: { name: 'Leviathan of the First Tide', icon: '鯨', hp: 5600, damage: 82, trait: 'Calls a tribulation wave every third turn.', type: 'storm' }, drops: { relic: 2, voidDust: 4, beastCore: 2 }, stones: 4200, desc: 'The sea before names, before shores, before mercy.' }
  ];
  const worldBosses = [
    { id: 'emberwyrm', name: 'Ashscale Emberwyrm', seal: '炎', tier: 1, req: 8, icon: '龍', hp: 980, damage: 22, trait: 'Molten Scales — burns for extra damage every third turn.', type: 'burn', stones: 500, tokens: 45, merit: 60, drops: { ore: 4, beastCore: 1 }, artifact: null },
    { id: 'voidmaw', name: 'Voidmaw Devourer', seal: '虛', tier: 2, req: 14, icon: '噬', hp: 2400, damage: 36, trait: 'Hungering Dark — drains 10 qi each turn.', type: 'drain', stones: 1000, tokens: 80, merit: 100, drops: { voidDust: 4, crystal: 2 }, artifact: null },
    { id: 'bloodking', name: 'Bloodmoon Demon King', seal: '血', tier: 3, req: 20, icon: '魔', hp: 4300, damage: 55, trait: 'Crimson Regrowth — heals 6% each turn.', type: 'regen', stones: 1900, tokens: 130, merit: 160, drops: { relic: 1, beastCore: 2 }, artifact: null },
    { id: 'starfather', name: 'Starfather Colossus', seal: '星', tier: 4, req: 26, icon: '星', hp: 7600, damage: 78, trait: 'Gravity Well — pierces half your guard.', type: 'pierce', stones: 3400, tokens: 200, merit: 240, drops: { crystal: 5, relic: 2 }, artifact: 'starcrown' },
    { id: 'primordial', name: 'Primordial Demon Ancestor', seal: '太', tier: 5, req: 32, icon: '祖', hp: 12500, damage: 108, trait: 'Heaven Defiance — storm waves every third turn.', type: 'storm', stones: 7000, tokens: 350, merit: 420, drops: { relic: 3, voidDust: 6, beastCore: 3 }, artifact: 'karmicwheel' }
  ];
  const worldEvents = [
    { id: 'qitide', name: 'Qi Tide', seal: '潮', buff: 'qi', duration: 150, desc: 'The world exhales. Meditation qi +50% while the tide lasts.' },
    { id: 'daorain', name: 'Dao Rain', seal: '雨', buff: 'dao', duration: 150, desc: 'Silver rain carries old insights. Dao comprehension +50%.' },
    { id: 'beastcall', name: 'Beast Migration', seal: '獸', buff: 'beast', duration: 150, desc: 'Wild beasts gather. Taming chance +15%.' },
    { id: 'meteor', name: 'Meteor Shower', seal: '星', buff: 'herb', duration: 150, desc: 'Star-metal dust settles on the herbs. Gathering +50%.' },
    { id: 'bloodmoon', name: 'Blood Moon', seal: '月', buff: 'attack', duration: 150, desc: 'The moon turns red. Attack +25%, but the beasts are restless.' }
  ];
  const fateEvents = [
    { id: 'wanderer', title: 'A Wandering Cultivator', seal: '俠', weight: 12, text: 'A road-worn cultivator bars your path, blade already half-drawn. “A spar,” they say. “Nothing more.”', options: [{ key: 'spar', label: 'Accept the spar' }, { key: 'tea', label: 'Offer tea instead' }] },
    { id: 'spring', title: 'Spirit Spring', seal: '泉', weight: 10, text: 'Between two stones, water glows with a faint blue light. The air tastes of rain and possibility.', options: [{ key: 'drink', label: 'Drink deeply' }] },
    { id: 'chest', title: 'A Forgotten Chest', seal: '匣', weight: 9, text: 'Half-buried beneath a dead pine is a lacquered chest, its lock long rusted through.', options: [{ key: 'open', label: 'Open the chest' }] },
    { id: 'tablet', title: 'The Silent Tablet', seal: '碑', weight: 8, text: 'A stone tablet bears no words, yet your gaze keeps returning to a single unmarked line.', options: [{ key: 'read', label: 'Trace the blank line' }] },
    { id: 'cub', title: 'An Abandoned Cub', seal: '崽', weight: 7, text: 'A tiny beast watches you from a hollow. It is too young to be afraid.', options: [{ key: 'adopt', label: 'Take it in' }, { key: 'leave', label: 'Leave it be' }] },
    { id: 'merchant', title: 'The Mysterious Merchant', seal: '商', weight: 8, text: 'A merchant with no face beneath their hood offers a single item, price already named.', options: [{ key: 'buy', label: 'Pay the price' }, { key: 'decline', label: 'Decline' }] },
    { id: 'curse', title: 'A Cursed Idol', seal: '咒', weight: 6, text: 'A small idol of black stone sits on the path. The air around it is cold enough to hurt.', options: [{ key: 'resist', label: 'Endure the curse' }, { key: 'pay', label: 'Offer spirit stones' }] },
    { id: 'rain', title: 'Cultivation Rain', seal: '霖', weight: 8, text: 'A warm rain falls upward from the ground. Each drop carries a thread of pure qi.', options: [{ key: 'bathe', label: 'Stand in the rain' }] },
    { id: 'meteor', title: 'Fallen Star', seal: '隕', weight: 6, text: 'Something bright broke against the far ridge. The crater is still warm.', options: [{ key: 'search', label: 'Search the crater' }] },
    { id: 'hermit', title: 'The Laughing Hermit', seal: '隱', weight: 5, text: 'An old hermit laughs at nothing, then points at you. “You,” he says. “You are almost interesting.”', options: [{ key: 'listen', label: 'Listen to the hermit' }] }
  ];
  const achievementDefs = [
    { id: 'firstStep', name: 'First Step', desc: 'Reach Qi Condensation 1.', check: s => s.stage >= 1, reward: { stones: 20 } },
    { id: 'foundation', name: 'Foundation Laid', desc: 'Reach Foundation Establishment.', check: s => s.stage >= 10, reward: { stones: 100, daoPoints: 1 } },
    { id: 'core', name: 'Golden Core', desc: 'Reach Golden Core.', check: s => s.stage >= 13, reward: { stones: 200, rootEssence: 1 } },
    { id: 'soul', name: 'Nascent Soul', desc: 'Reach Nascent Soul.', check: s => s.stage >= 16, reward: { stones: 350, keys: 1 } },
    { id: 'immortal', name: 'True Immortal', desc: 'Reach True Immortal.', check: s => s.stage >= 25, reward: { stones: 1200, daoPoints: 3 } },
    { id: 'kills10', name: 'Hunter', desc: 'Defeat 10 spirit beasts.', check: s => (s.stats?.kills || 0) >= 10, reward: { stones: 60 } },
    { id: 'kills100', name: 'Terror of the Wilds', desc: 'Defeat 100 spirit beasts.', check: s => (s.stats?.kills || 0) >= 100, reward: { stones: 500, tokens: 40 } },
    { id: 'boss1', name: 'Boss Slayer', desc: 'Defeat a world boss.', check: s => (s.stats?.bosses || 0) >= 1, reward: { stones: 400, daoPoints: 1 } },
    { id: 'boss5', name: 'Heaven Defier', desc: 'Defeat all five world bosses.', check: s => (s.stats?.bosses || 0) >= 5, reward: { stones: 2500, daoPoints: 4 } },
    { id: 'tame1', name: 'Kindred Spirit', desc: 'Tame a spirit beast.', check: s => Object.keys(s.taming?.beasts || {}).length >= 1, reward: { stones: 80, food: 1 } },
    { id: 'tame5', name: 'Beast Sovereign', desc: 'Bond with 5 spirit beasts.', check: s => Object.keys(s.taming?.beasts || {}).length >= 5, reward: { stones: 500, daoPoints: 2 } },
    { id: 'dao3', name: 'Dao Seeker', desc: 'Reach level 3 in any Dao.', check: s => daoPaths.some(d => daoLevel(d.id, s) >= 3), reward: { stones: 200, daoPoints: 1 } },
    { id: 'daoMaster', name: 'Dao Master', desc: 'Reach level 8 in any Dao.', check: s => daoPaths.some(d => daoLevel(d.id, s) >= 8), reward: { stones: 900, daoPoints: 3 } },
    { id: 'meridian4', name: 'Meridian Awakening', desc: 'Open 4 meridians.', check: s => openedMeridians(s) >= 4, reward: { stones: 150, rootEssence: 1 } },
    { id: 'meridian12', name: 'Perfect Circulation', desc: 'Open all 12 meridians.', check: s => openedMeridians(s) >= 12, reward: { stones: 2000, daoPoints: 4 } },
    { id: 'root', name: 'Root Awakened', desc: 'Awaken a spiritual root.', check: s => !!s.root?.type, reward: { stones: 80, rootEssence: 1 } },
    { id: 'heavenroot', name: 'Heaven Chosen', desc: 'Awaken a Heavenly or Divine root.', check: s => ['heaven', 'divine'].includes(s.root?.type), reward: { stones: 1200, daoPoints: 2 } },
    { id: 'inherit1', name: 'Heir of the Ancients', desc: 'Complete an ancient inheritance.', check: s => (s.inheritance?.completed || []).length >= 1, reward: { stones: 500, daoPoints: 2 } },
    { id: 'realm1', name: 'Realm Walker', desc: 'Clear a secret realm.', check: s => (s.stats?.realms || 0) >= 1, reward: { stones: 400, keys: 1 } },
    { id: 'realm6', name: 'Lord of Hidden Places', desc: 'Clear all six secret realms.', check: s => (s.stats?.realms || 0) >= 6, reward: { stones: 3000, daoPoints: 4 } },
    { id: 'weaponAwake', name: 'Awakened Edge', desc: 'Awaken a weapon.', check: s => Object.values(s.forge?.weapons || {}).some(w => w?.awakened), reward: { stones: 600, tokens: 50 } },
    { id: 'alchemy10', name: 'Cauldron Adept', desc: 'Brew 10 elixirs.', check: s => (s.brews || 0) >= 10, reward: { stones: 200, herb: 5 } },
    { id: 'rebirth1', name: 'Wheel of Lives', desc: 'Reincarnate once.', check: s => (s.rebirth?.count || 0) >= 1, reward: { stones: 1000, daoPoints: 2 } },
    { id: 'ascend1', name: 'Higher Sky', desc: 'Ascend to a higher cultivation world.', check: s => (s.rebirth?.world || 0) >= 1, reward: { stones: 2500, daoPoints: 3 } },
    { id: 'hiddenLuck', name: 'Fortune’s Child', desc: 'A hidden fate.', hidden: true, check: s => luckFor(s) >= 25, reward: { stones: 800, daoPoints: 2 } },
    { id: 'hiddenMaps', name: 'Cartographer of Ruin', desc: 'A hidden fate.', hidden: true, check: s => (s.stats?.chests || 0) >= 3, reward: { stones: 700, keys: 1 } },
    { id: 'hiddenMercy', name: 'A Small Mercy', desc: 'A hidden fate.', hidden: true, check: s => (s.story?.mercy || 0) >= 1, reward: { stones: 300, luckBonus: 1 } }
  ];
  const storyQuests = [
    { id: 'q1', npc: 'Sister Mei', name: "The Herbalist's Debt", req: 1, desc: 'Sister Mei needs five spirit herbs before the evening bell. The sect’s stores are thin this season.', type: 'gather', key: 'herb', target: 5, reward: { stones: 80, root: 2 } },
    { id: 'q2', npc: 'Old Shen', name: 'Echoes in the Mist', req: 4, desc: 'Old Shen says something has been copying the sect’s bells at night. He wants proof, not theories.', type: 'kill', target: 6, reward: { stones: 160, ore: 2 } },
    { id: 'q3', npc: 'The Wandering Blade', name: 'A Duel at Dawn', req: 8, desc: 'A nameless swordswoman waits at the eastern gate. She will not leave until someone gives her a real fight.', type: 'kill', target: 10, reward: { stones: 300, daoXp: { sword: 120 } } },
    { id: 'q4', npc: 'Alchemist Yun', name: 'The Missing Cauldron', req: 12, desc: 'Yun’s cauldron vanished overnight. The residue on the floor smells of moonflower and fear.', type: 'brew', target: 3, reward: { stones: 420, essence: 2 } },
    { id: 'q5', npc: 'The Veiled Oracle', name: 'Threads of Fate', req: 16, desc: 'The oracle will read your fate, but only if you bring her a treasure that fate never intended you to find.', type: 'map', target: 2, reward: { stones: 800, luckBonus: 2 } },
    { id: 'q6', npc: 'The Last Disciple', name: 'The Last Disciple', req: 22, desc: 'An old disciple guards a sect that no longer exists. They ask only that someone remember its name.', type: 'realm', target: 1, reward: { stones: 1500, relic: 1, daoPoints: 2 } }
  ];
  const dailyPool = [
    { id: 'kill3', label: 'Defeat 3 spirit beasts', type: 'kill', target: 3, reward: { stones: 40, tokens: 3 } },
    { id: 'kill6', label: 'Defeat 6 spirit beasts', type: 'kill', target: 6, reward: { stones: 80, tokens: 6 } },
    { id: 'brew1', label: 'Brew 1 elixir', type: 'brew', target: 1, reward: { stones: 50, herb: 2 } },
    { id: 'trip1', label: 'Complete 1 expedition', type: 'trip', target: 1, reward: { stones: 60, ore: 1 } },
    { id: 'dao1', label: 'Comprehend a Dao once', type: 'dao', target: 1, reward: { stones: 50, daoPoints: 1 } },
    { id: 'tame1', label: 'Tame or hatch a beast', type: 'tame', target: 1, reward: { stones: 70, food: 1 } },
    { id: 'realm1', label: 'Clear a secret realm', type: 'realm', target: 1, reward: { stones: 120, keys: 1 } },
    { id: 'wboss1', label: 'Defeat a world boss', type: 'wboss', target: 1, reward: { stones: 160, tokens: 10 } },
    { id: 'gather8', label: 'Gather 8 resources', type: 'gather', target: 8, reward: { stones: 60, herb: 2 } }
  ];
  const rankNames = ['Shen Yuling', 'Bai Wuchen', 'Lin Ruoxue', 'Mo Yuan', 'Xiao Tian', 'Jiang Li', 'Qin Feng', 'Su Ming', 'Han Yue', 'Ye Chen', 'Gu Changge', 'Nangong Wan'];
  const merchantPool = [
    { id: 'herbBundle', name: 'Spirit Herb Bundle', seal: '草', desc: '5 spirit herbs, still damp with mountain mist.', cost: 60, grant: { herb: 5 } },
    { id: 'oreBundle', name: 'Starfall Ore Bundle', seal: '礦', desc: '3 chunks of ore humming with fallen starlight.', cost: 120, grant: { ore: 3 } },
    { id: 'crystal', name: 'Moon Crystal', seal: '晶', desc: 'A single flawless crystal, cold as a winter memory.', cost: 180, grant: { crystal: 1 } },
    { id: 'key', name: 'Secret Realm Key', seal: '鑰', desc: 'A key that fits no door you have found yet.', cost: 250, grant: { keys: 1 } },
    { id: 'eggRare', name: 'Mystic Egg · Rare', seal: '卵', desc: 'A warm egg with a faint heartbeat inside.', cost: 320, grant: { egg: 'rare' } },
    { id: 'eggEpic', name: 'Mystic Egg · Epic', seal: '卵', desc: 'The shell is veined with gold. Something strong dreams within.', cost: 850, grant: { egg: 'epic' } },
    { id: 'food', name: 'Beast Feast', seal: '飼', desc: '3 portions of spirit-rich food for a bonded beast.', cost: 80, grant: { food: 3 } },
    { id: 'rootEssence', name: 'Root Essence', seal: '華', desc: '2 drops of distilled root-marrow.', cost: 350, grant: { rootEssence: 2 } },
    { id: 'map', name: 'Treasure Map', seal: '圖', desc: 'A map to something someone wanted forgotten.', cost: 220, grant: { map: 1 } },
    { id: 'relic', name: 'Ancient Relic', seal: '古', desc: 'A fragment of an age that ended badly.', cost: 900, grant: { relic: 1 } },
    { id: 'charm', name: 'Fortune Charm', seal: '符', desc: 'Permanently gain +1 luck. The merchant smiles.', cost: 1200, grant: { luck: 1 } },
    { id: 'breakPill', name: 'Tribulation Pill', seal: '劫', desc: 'Next breakthrough chance +15%.', cost: 150, grant: { breakBuff: 15 } }
  ];

  /* ---------------- STATE ---------------- */
  const emptyEquipment = () => Object.fromEntries(gearCatalog.map(item => [item.id, { owned: false, level: 0 }]));
  const defaultState = () => ({
    version: 2, qi: 0, stones: 25, stage: 0, active: false, totalSeconds: 0, totalQi: 0, qiToday: 0, medSeconds: 0,
    completedTrips: 0, trip: null,
    upgrades: { sutra: 0, array: 0, body: 0, beast: 0, alchemy: 0, fortune: 0, dao: 0 },
    boosts: 0, teaUntil: 0, dailyClaimed: false, dailyDate: 1, brews: 0, milestones: [], lastSeen: Date.now(),
    hp: 60, maxHp: 60, enemy: null, pathLevels: { body: 0, spirit: 0, qi: 0 },
    herbs: { herb: 0, root: 0, flower: 0, ore: 0, essence: 0, crystal: 0, beastCore: 0, voidDust: 0, relic: 0 },
    sectRep: 0, sectRank: 0, tripToday: 0, sectId: 'azure', sectTokens: 0, mission: null, equipment: emptyEquipment(), wins: 0,
    root: { type: null, grade: 0, essence: 0, discovered: [], rerolls: 0 },
    meridians: { opened: {}, points: 0 },
    dao: { sword: { xp: 0 }, fire: { xp: 0 }, water: { xp: 0 }, lightning: { xp: 0 }, space: { xp: 0 }, life: { xp: 0 } },
    daoPoints: 0,
    taming: { beasts: {}, active: null, eggs: { common: 0, rare: 0, epic: 0, mythic: 0 }, food: 1 },
    inheritance: { discovered: [], trials: {}, completed: [], artifacts: [], points: 0 },
    realms: { cleared: {}, keys: 1, boss: null },
    forge: { weapons: {}, equippedWeapon: null, equippedArtifacts: [null, null] },
    sectBuildings: { meditation: 0, garden: 0, beastpen: 0, formation: 0, armory: 0, library: 0 },
    luckBonus: 0,
    fate: { pending: null, log: [], merchant: [], merchantDate: 0, maps: 0, fragments: 0, clock: 0, encounters: 0, luckBuff: 0, luckBuffUntil: 0 },
    world: { active: null, defeated: {}, tier: 1 },
    rebirth: { count: 0, points: 0, upgrades: { qi: 0, attack: 0, luck: 0, dao: 0 }, world: 0 },
    achievements: {}, hiddenFound: [],
    quests: { active: null, completed: [], progress: {} },
    daily: { date: 0, list: [] },
    stats: { kills: 0, bosses: 0, tames: 0, dao: 0, brews: 0, trips: 0, realms: 0, tribulations: 0, crit: 0, chests: 0 },
    activeArts: ['cloudpalm'], breakBuff: 0,
    worldEvent: { id: null, ends: 0, next: 240 },
    story: { mercy: 0, npcMet: [] },
    rankClaimDate: 0
  });
  let state = loadState();
  let activeView = 'cultivate';
  let toastTimer;
  const uiTabs = { combat: 'hunt', sect: 'overview', techniques: 'passive', dao: 'roots', inherit: 'legacy', forge: 'weapons', fate: 'fortune', codex: 'realms' };

  function mergeDeep(base, extra) {
    if (Array.isArray(base)) return Array.isArray(extra) ? extra : base;
    if (base && typeof base === 'object') {
      const out = { ...base };
      if (extra && typeof extra === 'object') for (const key of Object.keys(extra)) out[key] = key in base ? mergeDeep(base[key], extra[key]) : extra[key];
      return out;
    }
    return extra === undefined ? base : extra;
  }
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!saved) return defaultState();
      const fresh = mergeDeep(defaultState(), saved);
      fresh.equipment = { ...emptyEquipment(), ...(fresh.equipment || {}) };
      Object.keys(fresh.equipment).forEach(id => { fresh.equipment[id] = { owned: false, level: 0, ...(fresh.equipment[id] || {}) }; });
      fresh.meridians.opened = fresh.meridians.opened || {};
      fresh.inheritance.trials = fresh.inheritance.trials || {};
      fresh.quests.progress = fresh.quests.progress || {};
      fresh.forge.equippedArtifacts = (fresh.forge.equippedArtifacts || []).slice(0, 2);
      while (fresh.forge.equippedArtifacts.length < 2) fresh.forge.equippedArtifacts.push(null);
      fresh.world.tier = Math.max(1, fresh.world.tier || 1);
      if (!sects[fresh.sectId]) fresh.sectId = 'azure';
      fresh.maxHp = Math.max(60, Number(fresh.maxHp) || 60);
      fresh.hp = Math.max(0, Math.min(fresh.maxHp, Number(fresh.hp ?? fresh.maxHp)));
      if (!Array.isArray(fresh.activeArts)) fresh.activeArts = ['cloudpalm'];
      if (fresh.worldEvent?.ends && Date.now() > fresh.worldEvent.ends) fresh.worldEvent = { id: null, ends: 0, next: (fresh.totalSeconds || 0) + 180 };
      const away = Math.min(28800, Math.max(0, (Date.now() - (fresh.lastSeen || Date.now())) / 1000));
      if (away > 15) {
        fresh.totalSeconds += away;
        const rate = rateFor(fresh);
        fresh.qiToday += fresh.active ? away * rate : 0;
        fresh.medSeconds += fresh.active ? away : 0;
        fresh.qi += away * (fresh.active ? rate : .15);
        fresh.totalQi += away * (fresh.active ? rate : .15);
        fresh.stones += Math.floor(away / 8);
        fresh.dailyDate = dayIndex(fresh);
        ensureDaily(fresh);
        fresh.active = false;
        fresh.lastSeen = Date.now();
        setTimeout(() => showToast(`While you were away, ${Math.floor(away / 60)} min passed in quiet meditation.`), 700);
      }
      ensureDaily(fresh);
      return fresh;
    } catch { return defaultState(); }
  }
  function recalc() {
    state.maxHp = maxHpFor();
    state.hp = clamp(state.hp, 0, state.maxHp);
  }
  function save() {
    state.lastSeen = Date.now();
    recalc();
    checkAchievements();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    if ($('saveStatus')) $('saveStatus').textContent = 'SYNCED';
  }

  /* ---------------- DERIVED STATS ---------------- */
  function requirement(stage = state.stage) { return stage <= 0 ? 100 : Math.round(100 * Math.pow(1.47, stage)); }
  function sectData(s = state) { return sects[s.sectId] || sects.azure; }
  function currentBand(stage = state.stage) { return realmBands.find(b => stage >= b.start && stage <= b.end) || realmBands[realmBands.length - 1]; }
  function isMajor(stage) { return majorStages.includes(stage); }
  function realmTitle(stage = state.stage) {
    if (stage <= 0) return 'Mortal';
    const band = currentBand(stage);
    const level = stage < 10 ? stage : ((stage - band.start) % 3) + 1;
    return `${band.name} ${level}`;
  }
  function worldName(s = state) { return worldNames[s.rebirth?.world || 0] || 'Beyond the Void'; }
  function gearStat(stat, s = state) { return gearCatalog.reduce((sum, item) => sum + (item.stat === stat && s.equipment?.[item.id]?.owned ? item.value * s.equipment[item.id].level : 0), 0); }
  function rootData(s = state) { return s.root?.type ? rootTypes.find(r => r.id === s.root.type) : null; }
  function rootMul(s = state) { return 1 + (s.root?.grade || 0) * .35; }
  function rootBonus(key, s = state) { const r = rootData(s); if (!r) return 0; return ((r.bonus?.[key] || 0) + (r.bonus?.all || 0)) * rootMul(s); }
  function daoLevel(id, s = state) {
    const xp = s.dao?.[id]?.xp || 0;
    let lv = 0;
    while (lv < 10 && xp >= DAO_XP[lv + 1]) lv++;
    return lv;
  }
  function masteryName(level) { return level >= 10 ? 'Dao Master' : level >= 9 ? 'Transcendent' : level >= 6 ? 'Master' : level >= 3 ? 'Adept' : level >= 1 ? 'Initiate' : 'Unawakened'; }
  function openedMeridians(s = state) { return meridianList.filter(m => s.meridians?.opened?.[m.id]).length; }
  function meridianBonus(key, s = state) {
    let sum = 0;
    meridianList.forEach(m => { if (s.meridians?.opened?.[m.id]) sum += (m.bonus?.[key] || 0) + (m.bonus?.all || 0); });
    const count = openedMeridians(s);
    if (count >= 4) sum += key === 'qi' ? .02 : 0;
    if (count >= 8) sum += key === 'attack' ? .03 : key === 'hp' ? 10 : 0;
    if (count >= 12) sum += key === 'qi' ? .08 : key === 'attack' ? .08 : key === 'hp' ? 40 : 0;
    return sum;
  }
  function beastDef(id) { return beastCatalog.find(b => b.id === id); }
  function activeBeast(s = state) {
    const id = s.taming?.active, data = id ? s.taming.beasts?.[id] : null, def = id ? beastDef(id) : null;
    if (!data || !def) return null;
    return { ...def, level: data.level || 1, bond: data.bond || 0 };
  }
  function beastBonus(key, s = state) {
    const b = activeBeast(s);
    if (!b) return 0;
    return ((b.bonus?.[key] || 0) + (b.bonus?.all || 0)) * (1 + (b.level - 1) * .07);
  }
  function artifactBonus(key, s = state) {
    let sum = 0;
    (s.forge?.equippedArtifacts || []).forEach(id => {
      if (!id) return;
      const a = artifactCatalog.find(x => x.id === id);
      if (a) sum += (a.bonus?.[key] || 0) + (a.bonus?.all || 0);
    });
    return sum;
  }
  function buildingLevel(id, s = state) { return s.sectBuildings?.[id] || 0; }
  function rebirthUpgrade(key, s = state) { return s.rebirth?.upgrades?.[key] || 0; }
  function equippedWeapon(s = state) {
    const id = s.forge?.equippedWeapon;
    if (!id) return null;
    const w = weaponCatalog.find(x => x.id === id);
    if (!w) return null;
    const owned = s.forge.weapons?.[id] || {};
    const refine = owned.refine || 0;
    return { ...w, refine, awakened: !!owned.awakened, totalAttack: Math.round(w.attack * (1 + refine * .12) * (1 + buildingLevel('armory', s) * .03)) };
  }
  function currentEvent(s = state) {
    if (!s.worldEvent?.id) return null;
    if (Date.now() > (s.worldEvent.ends || 0)) return null;
    return worldEvents.find(e => e.id === s.worldEvent.id) || null;
  }
  function luckFor(s = state) {
    let luck = 5 + (s.upgrades?.fortune || 0) + rootBonus('luck', s) + meridianBonus('luck', s) + beastBonus('luck', s) + artifactBonus('luck', s) + rebirthUpgrade('luck', s) * 2 + (s.luckBonus || 0);
    const ev = currentEvent(s);
    if (ev?.buff === 'luck') luck += 5;
    if ((s.fate?.luckBuffUntil || 0) > Date.now()) luck += (s.fate?.luckBuff || 0);
    return Math.round(luck * 10) / 10;
  }
  function rateFor(s = state) {
    const base = .8 + (s.upgrades?.sutra || 0) * .45 + (s.pathLevels?.spirit || 0) * .2 + (s.pathLevels?.qi || 0) * .12;
    const ev = currentEvent(s);
    const mult = 1 + (s.boosts || 0) + gearStat('qi', s) + sectData(s).qi + (s.sectRank || 0) * .02
      + rootBonus('qi', s) + daoLevel('water', s) * .03 + meridianBonus('qi', s) + beastBonus('qi', s)
      + artifactBonus('qi', s) + rebirthUpgrade('qi', s) * .1 + (s.rebirth?.world || 0) * .2
      + buildingLevel('meditation', s) * .03 + (ev?.buff === 'qi' ? .5 : 0);
    return base * mult * (s.active ? 1 : .2);
  }
  function attackDamage(base, s = state) {
    const w = equippedWeapon(s);
    const flat = gearStat('attack', s) + (w?.totalAttack || 0);
    const mult = 1 + sectData(s).attack + (s.sectRank || 0) * .03 + rootBonus('attack', s) + daoLevel('sword', s) * .04
      + daoLevel('fire', s) * .04 + beastBonus('attack', s) + artifactBonus('attack', s) + rebirthUpgrade('attack', s) * .08 + (s.rebirth?.world || 0) * .15
      + buildingLevel('armory', s) * .02;
    return Math.round((base + flat) * mult);
  }
  function critChance(s = state) {
    let c = .02 + rootBonus('crit', s) + daoLevel('lightning', s) * .02 + artifactBonus('crit', s) + beastBonus('crit', s);
    if (currentEvent(s)?.buff === 'attack') c += .05;
    return clamp(c, 0, .6);
  }
  function maxHpFor(s = state) {
    const body = 1 + (s.stage || 0) + (s.upgrades?.body || 0) * 2 + (s.pathLevels?.body || 0) * 3;
    const base = 60 + body * 5 + (s.pathLevels?.body || 0) * 12 + (s.sectRank || 0) * 10 + gearStat('health', s);
    return Math.round(base * (1 + rootBonus('hp', s) + beastBonus('hp', s) + artifactBonus('hp', s) + daoLevel('life', s) * .03 + (s.rebirth?.world || 0) * .1));
  }
  function guardFor(s = state) {
    return Math.floor((s.pathLevels?.body || 0) / 2 + gearStat('guard', s) + meridianBonus('guard', s) + rootBonus('guard', s) + artifactBonus('guard', s) + beastBonus('guard', s) + daoLevel('life', s) * .4);
  }
  function harvestMult(s = state) {
    return 1 + (s.upgrades?.alchemy || 0) * .03 + rootBonus('herb', s) + daoLevel('life', s) * .04 + buildingLevel('garden', s) * .05 + beastBonus('herb', s) + (currentEvent(s)?.buff === 'herb' ? .5 : 0);
  }
  function daoGainMult(id, s = state) {
    let m = 1 + (s.upgrades?.dao || 0) * .06 + buildingLevel('library', s) * .1 + rebirthUpgrade('dao', s) * .15 + (currentEvent(s)?.buff === 'dao' ? .5 : 0);
    const root = rootData(s);
    const affinity = { fire: 'fire', water: 'water', wood: 'life', metal: 'sword', thunder: 'lightning', ice: 'water', wind: 'space' }[root?.id];
    if (affinity === id) m += .5;
    if (root?.id === 'heaven') m += .25;
    if (root?.id === 'divine') m += .5;
    return m;
  }
  function tameChance(def, s = state) {
    const base = 30 + luckFor(s) * 1.5 + (s.upgrades?.beast || 0) * 4 + daoLevel('life', s) * 2 + buildingLevel('beastpen', s) * 2 + (currentEvent(s)?.buff === 'beast' ? 15 : 0);
    return clamp(Math.round(base - (def.rarity === 'Mythical' ? 20 : def.rarity === 'Epic' ? 10 : 0)), 5, 92);
  }
  function breakChance(s = state) {
    let ch = 78 + (s.upgrades?.body || 0) * 4 + Math.min(s.stage || 0, 5) + meridianBonus('break', s) * 100
      + buildingLevel('formation', s) * 2 + rootBonus('break', s) * 100 + (s.breakBuff || 0)
      - (isMajor((s.stage || 0) + 1) ? 18 : 0);
    return Math.round(clamp(ch, 5, 99));
  }
  function alchemyLevel(s = state) { return 1 + Math.floor((s.brews || 0) / 5); }
  function questObjective(q, s = state) { return q.type === 'gather' ? (s.herbs?.[q.key] || 0) : (s.quests?.progress?.[q.id] || 0); }
  function questDone(q, s = state) { return questObjective(q, s) >= q.target; }
  function recipeUnlocked(r, s = state) { return (s.stage || 0) >= r.unlockStage && (s.brews || 0) >= r.unlockBrews; }
  function tripDuration(t, s = state) { return Math.max(8, Math.round(t.duration * (1 - Math.min(.4, daoLevel('space', s) * .015)))); }
  function rankPower(s = state) {
    return Math.round((s.stage || 0) * 120 + attackDamage(0, s) * 10 + maxHpFor(s) + (s.sectRep || 0) * 3 + (s.stats?.bosses || 0) * 500 + openedMeridians(s) * 150 + (s.rebirth?.count || 0) * 400);
  }
  function ranking() {
    const base = [8200, 6100, 4700, 3600, 2800, 2200, 1700, 1300, 980, 720, 520, 360];
    const rows = rankNames.map((name, i) => ({ name, score: base[i] + (i % 3) * 37 }));
    rows.push({ name: 'You', score: rankPower(), me: true });
    return rows.sort((a, b) => b.score - a.score);
  }

  /* ---------------- SMALL UI HELPERS ---------------- */
  function showToast(message) {
    const toast = $('toast'); if (!toast) return;
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  function subHead(eyebrow, title, copy, symbol = '✧') {
    return `<div class="subview-head"><div><div class="eyebrow"><span class="eyebrow-line"></span>${eyebrow}</div><h1>${title}</h1><p>${copy}</p></div><div class="day-chip"><span class="sun-mark">${symbol}</span><span><small>YOUR CURRENT REALM</small><b>${realmTitle()}</b></span></div></div>`;
  }
  function tabs(view, items) {
    return `<div class="tabs">${items.map(([id, label]) => `<button class="tab-btn ${uiTabs[view] === id ? 'active' : ''}" data-action="tab" data-tab-view="${view}" data-tab="${id}">${label}</button>`).join('')}</div>`;
  }
  function progressLine(value, max, cls = '') { return `<div class="progress-line ${cls}"><i style="width:${clamp(max ? value / max * 100 : 0, 0, 100)}%"></i></div>`; }
  function rarityClass(r) { return 'rarity-' + String(r || 'common').toLowerCase(); }
  function ingredientText(r) {
    return Object.entries(r.ingredients).map(([key, amount]) => `${amount} ${ingredients[key]?.name || key}`).join(' · ');
  }
  function hasIngredients(r, s = state) { return Object.entries(r.ingredients).every(([key, amount]) => (s.herbs[key] || 0) >= amount); }
  function bonusText(bonus) {
    const labels = { qi: 'qi flow', attack: 'attack', hp: 'health', crit: 'crit', guard: 'guard', luck: 'luck', herb: 'gathering', alchemy: 'alchemy', break: 'breakthrough', tame: 'taming' };
    return Object.entries(bonus || {}).map(([k, v]) => {
      const val = k === 'guard' ? `+${v}` : `+${Math.round(v * (v < 1 ? 100 : 1))}%`;
      return `${val} ${labels[k] || k}`;
    }).join(' · ');
  }
  function allDaoLevels(s = state) { return daoPaths.map(d => daoLevel(d.id, s)); }
  function totalMastery(s = state) { return allDaoLevels(s).reduce((a, b) => a + b, 0); }

  /* ---------------- DAILY / QUEST / MISSION PROGRESS ---------------- */
  function ensureDaily(s = state) {
    const date = dayIndex(s);
    if (Array.isArray(s.daily?.list) && s.daily.list.length && s.daily.date === date) return;
    const seed = dayHash(date + (s.rebirth?.count || 0) * 17);
    const pool = dailyPool.slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = seed % (i + 1); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    s.daily = { date, list: pool.slice(0, 3).map(t => ({ ...t, progress: 0, claimed: false })) };
  }
  function dailyStep(type, amount = 1, s = state) {
    ensureDaily(s);
    (s.daily.list || []).forEach(task => {
      if (!task.claimed && task.type === type) task.progress = Math.min(task.target, (task.progress || 0) + amount);
    });
  }
  function missionStep(type, amount = 1) {
    if (!state.mission) return;
    const m = missions.find(x => x.id === state.mission.id);
    if (m && m.type === type) state.mission.progress = Math.min(m.target, (state.mission.progress || 0) + amount);
  }
  function questStep(type, amount = 1) {
    const q = state.quests?.active;
    if (!q) return;
    if (q.type !== type) return;
    state.quests.progress[q.id] = Math.min(q.target, (state.quests.progress[q.id] || 0) + amount);
  }
  function addRep(amount) {
    state.sectRep += amount;
    while (state.sectRank < sectRanks.length - 1 && state.sectRep >= sectRanks[state.sectRank + 1].need) {
      state.sectRank += 1;
      state.hp += 10;
      showToast(`Sect promotion · ${sectRanks[state.sectRank].name}! Maximum health +10.`);
    }
  }
  function rewardsText(reward) {
    const bits = [];
    if (!reward) return '';
    if (reward.stones) bits.push(`◇ ${nfmt(reward.stones)}`);
    if (reward.tokens) bits.push(`✦ ${reward.tokens} tokens`);
    if (reward.merit) bits.push(`${reward.merit} merit`);
    if (reward.keys) bits.push(`🗝 ${reward.keys} key`);
    if (reward.rootEssence) bits.push(`${reward.rootEssence} root essence`);
    if (reward.daoPoints) bits.push(`${reward.daoPoints} dao insight`);
    if (reward.luck || reward.luckBonus) bits.push(`+${reward.luck || reward.luckBonus} luck`);
    if (reward.food) bits.push(`${reward.food} food`);
    if (reward.herb) bits.push(`${reward.herb} herbs`);
    if (reward.root) bits.push(`${reward.root} ironroot`);
    if (reward.ore) bits.push(`${reward.ore} ore`);
    if (reward.essence) bits.push(`${reward.essence} essence`);
    if (reward.crystal) bits.push(`${reward.crystal} crystal`);
    if (reward.voidDust) bits.push(`${reward.voidDust} void dust`);
    if (reward.beastCore) bits.push(`${reward.beastCore} beast core`);
    if (reward.relic) bits.push(`${reward.relic} relic`);
    if (reward.flower) bits.push(`${reward.flower} moonflower`);
    if (reward.map) bits.push(`${reward.map} treasure map`);
    if (reward.egg) bits.push(`${reward.egg} mystic egg`);
    if (reward.daoXp) bits.push(`dao insight`);
    if (reward.breakBuff) bits.push(`+${reward.breakBuff}% breakthrough`);
    return bits.join(' · ');
  }
  function applyReward(reward) {
    if (!reward) return;
    state.stones += reward.stones || 0;
    state.sectTokens += reward.tokens || 0;
    if (reward.merit) addRep(reward.merit);
    state.realms.keys = (state.realms.keys || 0) + (reward.keys || 0);
    state.root.essence = (state.root.essence || 0) + (reward.rootEssence || 0);
    state.daoPoints = (state.daoPoints || 0) + (reward.daoPoints || 0);
    state.luckBonus = (state.luckBonus || 0) + (reward.luck || reward.luckBonus || 0);
    state.taming.food = (state.taming.food || 0) + (reward.food || 0);
    Object.keys(ingredients).forEach(key => { if (reward[key] && state.herbs[key] !== undefined) state.herbs[key] += reward[key]; });
    if (reward.breakBuff) state.breakBuff = (state.breakBuff || 0) + reward.breakBuff;
    if (reward.egg) addEgg(reward.egg);
    if (reward.map) state.fate.maps += reward.map;
    if (reward.daoXp) Object.entries(reward.daoXp).forEach(([id, xp]) => { state.dao[id].xp = (state.dao[id].xp || 0) + xp * daoGainMult(id); });
    if (reward.artifact) grantArtifact(reward.artifact);
  }
  function addEgg(rarity) {
    rarity = String(rarity || 'common').toLowerCase();
    if (!state.taming.eggs[rarity]) rarity = 'common';
    state.taming.eggs[rarity] = (state.taming.eggs[rarity] || 0) + 1;
  }
  function grantArtifact(id) {
    if (!state.inheritance.artifacts.includes(id)) state.inheritance.artifacts.push(id);
  }
  function checkAchievements(notify = true) {
    const unlocked = [];
    let changed = true, guard = 0;
    while (changed && guard < 3) {
      changed = false; guard++;
      achievementDefs.forEach(def => {
        if (state.achievements[def.id]) return;
        let ok = false;
        try { ok = def.check(state); } catch { ok = false; }
        if (!ok) return;
        state.achievements[def.id] = true;
        if (def.hidden && !state.hiddenFound.includes(def.id)) state.hiddenFound.push(def.id);
        applyReward(def.reward);
        unlocked.push(def.name);
        changed = true;
      });
    }
    if (unlocked.length && notify) setTimeout(() => showToast(`Achievement · ${unlocked.join(' · ')}`), 220);
  }

  /* ---------------- MAIN RENDER ---------------- */
  function render() {
    recalc();
    const goal = requirement();
    const qi = Math.floor(state.qi);
    const aid = (id, value) => { const el = $(id); if (el) el.textContent = value; };
    aid('stones', nfmt(state.stones));
    aid('realmName', realmTitle());
    const stageEl = $('stageBadge');
    if (stageEl) stageEl.innerHTML = `${state.stage === 0 ? '凡人' : currentBand().cn} <span>${String(state.stage === 0 ? 1 : ((state.stage - 1) % 3) + 1).padStart(2, '0')}</span>`;
    aid('qiText', nfmt(qi)); aid('qiGoal', nfmt(goal));
    const fill = $('qiFill'); if (fill) fill.style.width = `${Math.min(100, qi / goal * 100)}%`;
    aid('qiPercent', `${Math.min(100, Math.floor(qi / goal * 100))}%`);
    aid('qiRate', rateFor().toFixed(1));
    aid('meditateLabel', state.active ? 'Meditation in progress' : 'Begin Meditation');
    aid('meditateHint', state.active ? 'BREATHE DEEPLY · THE QI GATHERS' : 'LET THE QI FLOW THROUGH YOU');
    $('meditateBtn')?.classList.toggle('meditating', state.active);
    const canBreak = state.qi >= goal;
    if ($('breakthroughBtn')) $('breakthroughBtn').disabled = !canBreak;
    aid('breakHint', canBreak ? `READY · ${breakChance()}% SUCCESS${isMajor(state.stage + 1) ? ' · TRIBULATION' : ''}` : `${nfmt(Math.max(0, goal - qi))} QI TO THE THRESHOLD`);
    const control = Math.max(1, 1 + state.stage + state.upgrades.sutra * 2 + daoLevel('water') * 2);
    const spirit = Math.max(1, 1 + Math.floor(state.stage / 2) + state.upgrades.array * 2 + state.pathLevels.spirit * 3 + totalMastery() * 2);
    const body = Math.max(1, 1 + state.stage + state.upgrades.body * 2 + state.pathLevels.body * 3 + openedMeridians() * 2);
    aid('sectRankLabel', sectRanks[state.sectRank]?.name || sectRanks[0].name);
    aid('sectName', sectData().name);
    [['control', control], ['spirit', spirit], ['body', body], ['luck', luckFor()]].forEach(([key, val]) => {
      aid(`${key}Stat`, val);
      const meter = $(`${key}Meter`); if (meter) meter.style.width = `${Math.min(100, 8 + Number(val) * 8)}%`;
    });
    aid('dayCount', String(dayIndex()).padStart(2, '0'));
    aid('welcomeDay', dayIndex());
    aid('worldLabel', `IN THE ${worldName().toUpperCase()}`);
    const meditateDone = state.medSeconds >= 30;
    const qiDone = state.qiToday >= 100;
    const tripDone = (state.tripToday || 0) > 0;
    [['taskMeditate', meditateDone], ['taskQi', qiDone], ['taskTrip', tripDone]].forEach(([id, done]) => $(id)?.classList.toggle('done', done));
    const taskCount = [meditateDone, qiDone, tripDone].filter(Boolean).length;
    aid('taskProgress', `${state.dailyClaimed ? 3 : taskCount} / 3`);
    if ($('dailyClaim')) {
      $('dailyClaim').disabled = state.dailyClaimed || taskCount < 3;
      $('dailyClaim').textContent = state.dailyClaimed ? 'Daily reward claimed' : taskCount === 3 ? 'Claim daily reward →' : 'Complete all practices →';
    }
    const nextTitle = state.stage === 0 ? 'First breath' : `Step ${state.stage + 1} · ${realmTitle(state.stage + 1)}`;
    aid('nextTitle', nextTitle);
    aid('nextText', state.stage === 0 ? 'Gather 100 qi and take your first step into the cultivation world.' : `Refine ${nfmt(goal)} qi to advance toward ${realmTitle(state.stage + 1)}.${isMajor(state.stage + 1) ? ' A heavenly tribulation guards this threshold.' : ''}`);
    aid('nextProgress', `${nfmt(qi)} / ${nfmt(goal)} qi`);
    const nextFill = $('nextFill'); if (nextFill) nextFill.style.width = `${Math.min(100, state.qi / goal * 100)}%`;
    aid('techCount', `${Object.values(state.upgrades).reduce((a, b) => a + b, 0)}/${techniques.length + martialArts.length}`);
    $('expDot')?.classList.toggle('hidden', !(state.trip && Date.now() >= state.trip.ends));
    $('daoDot')?.classList.toggle('hidden', !(state.daoPoints > 0 || state.root.essence >= 6));
    $('fateDot')?.classList.toggle('hidden', !(state.fate?.pending || state.fate?.maps > 0 || state.fate?.merchant?.some(o => !o.bought)));
    const trialsReady = inheritanceCatalog.some(inc => state.inheritance.discovered.includes(inc.id) && inc.trials.some((t, i) => !(state.inheritance.trials[inc.id]?.[i]) && safeCheck(t)));
    $('legacyDot')?.classList.toggle('hidden', !(trialsReady || (state.realms.keys > 0 && secretRealms.some(r => state.stage >= r.req))));
    const root = rootData();
    const chip = $('rootChip');
    if (chip) chip.innerHTML = root
      ? `<span class="root-seal ${root.rarity.toLowerCase()}">${root.seal}</span><span><small>SPIRITUAL ROOT · ${ROOT_GRADES[state.root.grade].toUpperCase()}</small><b>${root.name}</b></span>`
      : `<span class="root-seal">空</span><span><small>SPIRITUAL ROOT</small><b>Unawakened</b></span>`;
    renderRealmPath(); renderBanners(); renderChallenges(); renderQuestTracker(); renderSubView();
  }
  function safeCheck(trial) { try { return trial.check(state); } catch { return false; } }
  function renderRealmPath() {
    const el = $('realmPath'); if (!el) return;
    const milestones = [0, 1, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37];
    const labels = ['Mortal', 'Qi', 'Foundation', 'Core', 'Soul', 'Severing', 'Dao', 'Immortal', 'Celestial', 'Sage', 'Primordial', 'Beyond'];
    el.innerHTML = milestones.map((stage, i) => `<div class="realm-step ${state.stage >= stage ? 'passed' : ''} ${state.stage >= stage && (i === milestones.length - 1 || state.stage < milestones[i + 1]) ? 'current' : ''}"><span class="realm-node">${state.stage >= stage ? '✦' : '·'}</span><span>${labels[i]}</span></div>`).join('');
  }
  function renderBanners() {
    const el = $('eventBanners'); if (!el) return;
    const cards = [];
    const ev = currentEvent();
    if (ev) {
      const left = Math.max(0, Math.ceil((state.worldEvent.ends - Date.now()) / 1000));
      cards.push(`<div class="banner-card event"><div class="banner-symbol">${ev.seal}</div><div class="banner-body"><small>LIMITED CULTIVATION EVENT · ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</small><b>${ev.name}</b><span>${ev.desc}</span></div><span class="world-event-count">EVENT ACTIVE</span></div>`);
    }
    if (state.fate?.pending) {
      cards.push(`<div class="banner-card fate"><div class="banner-symbol">✦</div><div class="banner-body"><small>A FORTUNE AWAITS YOUR ATTENTION</small><b>${state.fate.pending.title}</b><span>A strange encounter waits on the road. Go to Fate &amp; Fortune to see how it unfolds.</span></div><button class="action-btn gold" data-view="fate">Attend</button></div>`);
    }
    el.innerHTML = cards.join('');
  }
  function renderChallenges() {
    const el = $('dailyChallenges'); if (!el) return;
    ensureDaily();
    const rows = state.daily.list.map(task => {
      const done = task.progress >= task.target;
      return `<div class="daily-row ${done ? 'done' : ''}"><span class="daily-check">${done ? '✓' : '·'}</span><div><b>${task.label}</b><small>${task.progress || 0} / ${task.target} · ${rewardsText(task.reward)}</small></div>${task.claimed ? '<span class="stat-pill green">Claimed</span>' : `<button class="action-btn" data-action="claim-daily" data-id="${task.id}" ${done ? '' : 'disabled'}>Claim</button>`}</div>`;
    }).join('');
    el.innerHTML = `<div class="panel-heading"><div><div class="eyebrow">THE DAY'S CHALLENGES · DAY ${dayIndex()}</div><h3>Prove your diligence</h3></div><span class="task-progress">${state.daily.list.filter(t => t.claimed).length} / 3</span></div><div class="daily-challenge-list">${rows}</div><p class="small-note">A new set of challenges is drawn each game day. Progress is saved with your cultivator.</p>`;
  }
  function renderQuestTracker() {
    const el = $('questTracker'); if (!el) return;
    const q = state.quests?.active;
    if (q) {
      const value = Math.min(questObjective(q), q.target);
      el.innerHTML = `<div class="panel-heading"><div><div class="eyebrow">ACTIVE STORY QUEST · ${q.npc}</div><h3>${q.name}</h3></div><span class="stat-pill gold">${value} / ${q.target}</span></div><div class="quest-tracker"><span class="quest-seal">卷</span><div><b>${q.desc}</b><small>Reward · ${rewardsText(q.reward) || 'a story worth remembering'}</small></div><button class="action-btn" data-view="codex">Open Codex</button></div>`;
      return;
    }
    const available = storyQuests.filter(x => state.stage >= x.req && !state.quests.completed.includes(x.id));
    if (available.length) {
      const q2 = available[0];
      el.innerHTML = `<div class="panel-heading"><div><div class="eyebrow">A STORY AWAITS</div><h3>${q2.name}</h3></div><span class="stat-pill">${q2.npc}</span></div><div class="quest-tracker"><span class="quest-seal">傳</span><div><b>${q2.desc}</b><small>Visit the Codex to accept this quest.</small></div><button class="action-btn" data-view="codex">View quests</button></div>`;
      return;
    }
    el.innerHTML = `<div class="panel-heading"><div><div class="eyebrow">THE QUIET ROAD</div><h3>No active story quests</h3></div></div><p class="small-note">New wanderers and old debts will find you as your cultivation deepens.</p>`;
  }
  function renderSubView() {
    const map = { paths: renderPaths, dao: renderDao, combat: renderCombat, sect: renderSect, techniques: renderTechniques, expeditions: renderExpeditions, alchemy: renderAlchemy, inherit: renderInheritance, forge: renderForge, fate: renderFate, ascension: renderAscension, codex: renderCodex };
    if (map[activeView]) map[activeView]();
  }
  function setView(view) {
    activeView = view;
    document.querySelectorAll('.view').forEach(el => el.classList.toggle('active', el.id === `view-${view}`));
    document.querySelectorAll('.nav-item, .mobile-nav button').forEach(el => el.classList.toggle('active', el.dataset.view === view));
    const names = { cultivate: 'CULTIVATION GROVE', paths: 'THREE CULTIVATION PATHS', dao: 'INNER DAO', combat: 'SPIRIT BEAST GROUNDS', sect: 'AZURE CLOUD SECT', techniques: 'SECT LIBRARY', expeditions: 'BEYOND THE SECT', alchemy: 'ALCHEMY PAVILION', inherit: 'ANCIENT INHERITANCE', forge: 'THE REFINING FORGE', fate: 'FATE & FORTUNE', ascension: 'REINCARNATION & ASCENSION', codex: 'THE IMMORTAL CODEX' };
    if ($('crumbTitle')) $('crumbTitle').textContent = names[view] || names.cultivate;
    render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- PATHS ---------------- */
  function renderPaths() {
    const bodyLevel = state.pathLevels.body, spiritLevel = state.pathLevels.spirit, qiLevel = state.pathLevels.qi;
    const bodyCost = 50 + bodyLevel * 45, spiritCost = 50 + spiritLevel * 45, qiCost = 40 + qiLevel * 35;
    const cards = [
      { id: 'body', name: 'Body cultivation', seal: '體', eyebrow: 'THE IRON VESSEL', desc: 'Temper bone, blood, and breath. Body ranks increase health and empower crushing physical strikes.', level: bodyLevel, cost: bodyCost, action: 'Temper the body', good: state.qi >= bodyCost && state.stones >= 5, cls: 'body-path', label: 'BODY REALM' },
      { id: 'spirit', name: 'Spiritual cultivation', seal: '神', eyebrow: 'THE IMMORTAL SPIRIT', desc: 'Expand your sea of consciousness. Spirit ranks strengthen spiritual arts and accelerate meditation.', level: spiritLevel, cost: spiritCost, action: 'Refine the spirit', good: state.qi >= spiritCost && state.stones >= 5, cls: 'spirit-path', label: 'SPIRIT REALM' },
      { id: 'qi', name: 'Qi cultivation', seal: '氣', eyebrow: 'THE FLOWING BREATH', desc: 'Refine the quality of your qi. Qi ranks deepen meditation and open the meridians faster.', level: qiLevel, cost: qiCost, action: 'Circulate the qi', good: state.qi >= qiCost && state.stones >= 8, cls: 'qi-path', label: 'QI REALM' }
    ];
    const cardHtml = cards.map(c => `<article class="path-card ${c.cls}"><div class="path-seal">${c.seal}</div><div class="eyebrow">${c.eyebrow}</div><h2>${c.name}</h2><p>${c.desc}</p><div class="path-level">${c.label} <b>Rank ${c.level}</b></div><div class="inventory-row"><span>Training requirement</span><b>${nfmt(c.cost)} qi · ${c.id === 'qi' ? 8 : 5} stones</b></div><button class="action-btn" data-action="train-path" data-id="${c.id}" ${c.good ? '' : 'disabled'}>${c.action}</button><small class="subtle">Every 5 ranks grants 1 meridian point.</small></article>`).join('');
    $('view-paths').innerHTML = `${subHead('THREE WAYS TO IMMORTALITY', 'Choose your cultivation path', 'Train the mortal vessel, refine the soul, or perfect the breath. All paths remain open, and each grants its own battle art.', '☯')}
      <div class="path-choice-grid three">${cardHtml}</div>
      <article class="content-panel path-note"><div class="eyebrow">YOUR FOUNDATION</div><h2>Neither path is a dead end</h2><p>Body training raises health and physical damage. Spirit training improves spirit-arts damage and meditation. Qi training accelerates qi flow and meridian recovery. Invest in any—or balance all three.</p><div class="feature-stats"><span>BODY RANK <b>${bodyLevel}</b></span><span>SPIRIT RANK <b>${spiritLevel}</b></span><span>QI RANK <b>${qiLevel}</b></span><span>QI FLOW <b>${rateFor().toFixed(1)} / sec</b></span><span>MAX HEALTH <b>${maxHpFor()}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">THE HEAVENLY TRIBULATION</div><h2>Major realms are guarded</h2><p>At the threshold of every major realm, heaven sends a tribulation. Its success chance is lower than an ordinary breakthrough, but the rewards are far greater: meridian points, dao insight, realm keys and root essence. Prepare pills, formations and meridians before you step forward.</p><div class="stat-pills"><span class="stat-pill gold">Current chance · ${breakChance()}%</span><span class="stat-pill ${isMajor(state.stage + 1) ? 'red' : 'green'}">Next threshold · ${isMajor(state.stage + 1) ? 'Heavenly Tribulation' : 'Ordinary'}</span><span class="stat-pill">Meridian points · ${state.meridians.points}</span><span class="stat-pill violet">Dao insight · ${state.daoPoints}</span></div></article>`;
  }

  /* ---------------- TECHNIQUES ---------------- */
  function renderTechniques() {
    let body;
    if (uiTabs.techniques === 'arts') {
      const cards = martialArts.map(a => {
        const learned = state.activeArts.includes(a.id);
        const can = state.stage >= a.req && state.stones >= a.cost;
        return `<article class="technique-card"><div class="tech-seal">${a.seal}</div><div class="tech-copy"><h3>${a.name}</h3><p>${a.desc}</p><div class="tech-level">${learned ? `ATTUNED · ${a.qi} QI · ${a.damage} BASE DAMAGE` : `REQUIRES STAGE ${a.req} · ${a.cost} STONES`}</div></div>${learned ? '<span class="stat-pill green">Learned</span>' : `<button class="buy-btn" data-action="unlock-art" data-id="${a.id}" ${can ? '' : 'disabled'}>Learn<span>◇ ${a.cost}</span></button>`}</article>`;
      }).join('');
      body = `<article class="content-panel"><div class="eyebrow">MARTIAL ARTS</div><h2>Battle techniques</h2><p>Active arts appear in combat and boss battles. They scale with spirit cultivation and your Dao, and each has a distinct effect.</p>${cards}</article>`;
    } else {
      const cards = techniques.map(t => {
        const level = state.upgrades[t.id] || 0, cost = Math.ceil(t.base * Math.pow(level + 1, 1.55));
        return `<article class="technique-card"><div class="tech-seal">${t.seal}</div><div class="tech-copy"><h3>${t.name}</h3><p>${t.desc}</p><div class="tech-level">RANK ${level} · ${t.effect}</div></div><button class="buy-btn" data-action="upgrade" data-id="${t.id}" ${state.stones < cost ? 'disabled' : ''}>Attune<span>◇ ${cost}</span></button></article>`;
      }).join('');
      body = `<article class="content-panel"><div class="eyebrow">SEVEN SCROLLS AWAIT</div><h2>Choose what to cultivate</h2><p>Each technique may be attuned again and again. Higher ranks demand more spirit stones, but their effects endure.</p>${cards}</article>`;
    }
    $('view-techniques').innerHTML = `${subHead('THE SECT LIBRARY', 'Cultivation techniques', 'Master ancient arts to deepen your foundation, or learn battle arts to break your limits.', '☯')}
      ${tabs('techniques', [['passive', 'Passive sutras'], ['arts', 'Martial arts']])}
      <div class="subview-layout"><div class="subview-main">${body}</div><aside class="subview-aside">
      <article class="feature-card"><div class="eyebrow">CURRENTLY PRACTICING</div><h3>${state.active ? 'Clear your mind' : 'A quiet mind is a clear vessel'}</h3><p>${state.active ? `Your breath gathers ${rateFor().toFixed(1)} qi each second. Let the cycle continue.` : 'Begin meditation from the Cultivation Grove to gather vital essence even while you explore the sect.'}</p><div class="feature-stats"><span>QI FLOW <b>${rateFor().toFixed(1)} / sec</b></span><span>BREAKTHROUGH <b>${breakChance()}%</b></span><span>ARTS LEARNED <b>${state.activeArts.length} / ${martialArts.length}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">LEARNER'S NOTE</div><h2>Attunement</h2><p>Spend spirit stones to bind a scroll to your meridians. Effects are permanent and stack with each rank. Martial arts are learned once and can be used in every battle.</p><div class="inventory-row"><span>Spirit stones</span><b>◇ ${nfmt(state.stones)}</b></div></article>
      </aside></div>`;
  }

  /* ---------------- EXPEDITIONS ---------------- */
  function renderExpeditions() {
    const tripState = () => {
      if (!state.trip) return '';
      const left = Math.max(0, Math.ceil((state.trip.ends - Date.now()) / 1000));
      return left ? `<div class="timer">Returning in ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</div>` : '<div class="timer ready">Journey complete · ready to collect</div>';
    };
    const cards = expeditions.map(t => {
      const locked = state.stage < t.req;
      const active = state.trip?.id === t.id;
      const ready = active && Date.now() >= state.trip.ends;
      const lootText = Object.entries(t.loot).map(([k, v]) => `${v} ${ingredients[k]?.name || k}`).join(' · ');
      return `<article class="expedition-card ${locked ? 'locked-card' : ''}"><div class="expedition-art">${t.icon}</div><div><h3>${t.name}</h3><p>${t.desc}</p><div class="exp-meta"><span>◷ ${tripDuration(t)}s</span><span>◇ ${t.reward + state.stage * 2} stones</span><span>✿ ${lootText}</span>${locked ? `<span>REQUIRES STAGE ${t.req}</span>` : ''}</div>${active ? tripState() : ''}</div>${locked ? '<button class="action-btn" disabled>Locked</button>' : state.trip ? (ready && active ? '<button class="action-btn" data-action="collect-trip">Collect</button>' : `<button class="action-btn" disabled>${active ? 'In progress' : 'Away'}</button>`) : `<button class="action-btn" data-action="start-trip" data-id="${t.id}">Set out</button>`}</article>`;
    }).join('');
    $('view-expeditions').innerHTML = `${subHead('BEYOND THE SECT WALLS', 'Expeditions', 'The world is vast. A cultivator must also walk its roads and bring back what the wilds offer.', '⌁')}
      <div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">AVAILABLE JOURNEYS</div><h2>Choose a path</h2><p>Send your spirit out into the world. You can continue cultivating while an expedition is underway. Higher realms and the Space Dao shorten the road.</p>${cards}</article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">TRAVELER'S LEDGER</div><h3>${state.completedTrips} journeys completed</h3><p>Every safe return brings new resources to the sect. Fortune favors the well-prepared wanderer.</p><div class="feature-stats"><span>STONE YIELD <b>+${state.stage * 2} / trip</b></span><span>LUCK <b>${luckFor()}</b></span><span>GATHERING <b>+${Math.round((harvestMult() - 1) * 100)}%</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">RARE FINDS</div><h2>The road remembers</h2><p>High-luck cultivators sometimes find treasure map fragments, realm keys, mystic eggs or lost relics. Secret Realms hold even greater dangers and rewards.</p><button class="action-btn" data-view="inherit">Visit secret realms</button></article>
      </aside></div>`;
  }

  /* ---------------- ALCHEMY ---------------- */
  function renderAlchemy() {
    const items = recipes.map(r => {
      const unlocked = recipeUnlocked(r), enough = hasIngredients(r);
      const missing = Object.entries(r.ingredients).filter(([k, v]) => (state.herbs[k] || 0) < v).map(([k, v]) => `${v - (state.herbs[k] || 0)} ${ingredients[k]?.name || k}`).join(', ');
      return `<article class="recipe ${unlocked ? '' : 'locked-card'}"><div class="recipe-icon">${r.seal}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="recipe-cost">${r.effect}</div><div class="ingredient-line">Needs ${ingredientText(r)}${unlocked && !enough ? `<br><span class="gold-text">Missing: ${missing}</span>` : ''}</div>${unlocked ? `<button class="action-btn" data-action="brew" data-id="${r.id}" ${state.stones < r.cost || !enough ? 'disabled' : ''}>Brew · ◇ ${r.cost}</button>` : `<span class="stat-pill">Unlocks at stage ${r.unlockStage}${r.unlockBrews ? ` · ${r.unlockBrews} brews` : ''}</span>`}</article>`;
    }).join('');
    const satchel = Object.entries(ingredients).map(([key, info]) => `<div class="inventory-row"><span>${info.name}</span><b>${state.herbs[key] || 0}</b></div>`).join('');
    $('view-alchemy').innerHTML = `${subHead('THE HERBALIST’S COURT', 'Alchemy pavilion', 'Trade spirit stones for useful elixirs and carefully prepared tonics. Deeper realms unlock rarer recipes.', '⚗')}
      <div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">RECIPES IN YOUR JOURNAL · MASTERY ${alchemyLevel()}</div><h2>Preparations known and forgotten</h2><p>Gather ingredients on expeditions, from beasts, or from wandering merchants. Ingredients are consumed when a brew succeeds. Each five brews raises your alchemy mastery.</p><div class="alch-grid">${items}</div></article></div>
      <aside class="subview-aside"><article class="content-panel"><div class="eyebrow">YOUR SATCHEL</div><h2>Carried resources</h2><div class="inventory-row"><span>Spirit stones</span><b>◇ ${nfmt(state.stones)}</b></div>${satchel}<div class="inventory-row"><span>Permanent elixirs</span><b>${Math.round(state.boosts * 100)}% qi</b></div><div class="inventory-row"><span>Brews prepared</span><b>${state.brews || 0}</b></div><div class="inventory-row"><span>Alchemy mastery</span><b>${alchemyLevel()}</b></div></article>
      <article class="feature-card"><div class="eyebrow">HERBALIST’S ADVICE</div><h3>Every root has a nature</h3><p>Use a Qi-Gathering Pill when you are close to a threshold, or save rare ingredients for tribulation pills and root elixirs. The Fire Spirit Root and Fire Dao both improve gathering.</p></article></aside></div>`;
  }

  /* ---------------- COMBAT / BEASTS / WORLD BOSSES ---------------- */
  function artButtons() {
    return state.activeArts.map(id => {
      const a = martialArts.find(x => x.id === id); if (!a) return '';
      return `<button class="action-btn sect-spell" data-action="use-art" data-id="${a.id}" ${state.qi < a.qi ? 'disabled' : ''}>${a.seal} ${a.name} · ${a.qi} qi</button>`;
    }).join('');
  }
  function renderCombat() {
    const tab = uiTabs.combat;
    let panel;
    if (tab === 'tame') panel = renderTamePanel();
    else if (tab === 'boss') panel = renderBossPanel();
    else panel = renderHuntPanel();
    $('view-combat').innerHTML = `${subHead('TRIAL BY COMBAT', 'Spirit beast grounds', 'Face the creatures beyond the sect wall, bond with the wild, or challenge the ancient powers that rule it.', '⚔')}
      ${tabs('combat', [['hunt', 'Hunt'], ['tame', 'Tame & companions'], ['boss', 'World bosses']])}
      ${panel}`;
  }
  function renderHuntPanel() {
    const enemy = state.enemy, spell = currentSpell();
    const enemyCard = enemy ? `<div class="enemy-card"><div class="enemy-glyph">${enemy.icon}</div><div class="enemy-info"><div class="eyebrow">${sects[enemy.sect]?.name || 'WILDERNESS'} ENCOUNTER · ${enemy.elite ? 'ELITE · ' : ''}REALM ${enemy.level || state.stage + 1}</div><h2>${enemy.name}</h2><div class="health-label"><span>HEALTH</span><b>${Math.max(0, Math.ceil(enemy.hp))} / ${enemy.maxHp}</b></div><div class="health-track"><i style="width:${Math.max(0, enemy.hp / enemy.maxHp * 100)}%"></i></div></div></div><div class="combat-actions"><button class="action-btn body-strike" data-action="attack" data-style="body">Body strike · ${attackDamage(3 + state.pathLevels.body * 4 + state.stage)}–${attackDamage(7 + state.pathLevels.body * 5 + state.stage)} dmg</button><button class="action-btn spirit-strike" data-action="attack" data-style="spirit" ${state.qi < 8 ? 'disabled' : ''}>Spirit art · ${attackDamage(6 + state.pathLevels.spirit * 5 + state.stage)}–${attackDamage(12 + state.pathLevels.spirit * 6 + state.stage)} dmg · 8 qi</button><button class="action-btn sect-spell" data-action="cast-spell" ${state.qi < spell.cost ? 'disabled' : ''}>${spell.seal} ${spell.name} · ${attackDamage(spell.damage + state.pathLevels.spirit * 4 + state.stage)} dmg · ${spell.cost} qi</button>${artButtons()}<button class="action-btn" data-action="flee">Retreat</button></div>` : `<div class="encounter-empty"><div class="empty-mark">⚔</div><h2>The forest is quiet—for now.</h2><p>Seek a ${sectData().name} spirit beast to test your cultivation. Victory earns spirit stones, sect merit, and a chance at rare ingredients, eggs and map fragments.</p><button class="action-btn" data-action="seek-enemy">Seek a spirit beast</button></div>`;
    const hpPercent = Math.max(0, state.hp / state.maxHp * 100);
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel combat-panel"><div class="eyebrow">${enemy ? 'ACTIVE BATTLE' : 'READY YOURSELF'}</div>${enemyCard}</article>
      <article class="content-panel"><div class="eyebrow">YOUR VITALITY</div><h2>${Math.ceil(state.hp)} / ${state.maxHp} health</h2><div class="health-track player-health"><i style="width:${hpPercent}%"></i></div><p class="combat-tip">Body strikes are free and scale with body cultivation. Spirit arts spend 8 qi. Weapon abilities, Dao passives and your bonded companion all join the attack. A prepared healing pill restores health.</p></article></div>
      <aside class="subview-aside"><article class="content-panel"><div class="eyebrow">BATTLE RECORD</div><h2>${state.stats.kills || state.wins || 0} victories</h2><div class="inventory-row"><span>Spirit stones</span><b>◇ ${nfmt(state.stones)}</b></div><div class="inventory-row"><span>Sect merit</span><b>${state.sectRep}</b></div><div class="inventory-row"><span>Beasts slain</span><b>${state.stats.kills || 0}</b></div><div class="inventory-row"><span>Luck</span><b>${luckFor()}</b></div><div class="inventory-row"><span>Companion</span><b>${activeBeast()?.name || 'None'}</b></div></article>
      <article class="feature-card"><div class="eyebrow">FIELD COUNSEL</div><h3>Prepare before you hunt</h3><p>Craft Stillwater Tea in the Alchemy Pavilion to restore health. If your health reaches zero, you are carried back to safety at a fraction of your vitality.</p><button class="action-btn" data-view="alchemy">Visit alchemy</button></article></aside></div>`;
  }
  function renderTamePanel() {
    const wild = beastCatalog.filter(b => b.tameable);
    const cards = wild.map(b => {
      const owned = state.taming.beasts[b.id];
      const locked = state.stage < b.req;
      const chance = tameChance(b);
      return `<article class="beast-card ${owned ? 'tamed' : ''} ${state.taming.active === b.id ? 'active' : ''} ${rarityClass(b.rarity)}"><div class="beast-glyph">${b.icon}</div><span class="rarity-tag">${b.rarity.toUpperCase()}</span><h3>${b.name}</h3><p>${b.passive}</p><div class="beast-bonus">Tame chance ${chance}% · ${owned ? `Bonded Lv ${owned.level}` : `Requires stage ${b.req}`}</div>${owned ? `<button class="action-btn" data-action="set-beast" data-id="${b.id}">${state.taming.active === b.id ? 'Active companion' : 'Set as companion'}</button>` : `<button class="action-btn" data-action="tame-beast" data-id="${b.id}" ${locked || state.qi < 40 + b.cost || state.stones < b.cost ? 'disabled' : ''}>Tame · ${40 + b.cost} qi · ◇ ${b.cost}</button>`}</article>`;
    }).join('');
    const rosterIds = Object.keys(state.taming.beasts);
    const roster = rosterIds.length ? rosterIds.map(id => {
      const b = beastDef(id), d = state.taming.beasts[id]; if (!b) return '';
      const canEvolve = b.evolve && d.level >= 5;
      const trainCost = 20 * (d.level + 1);
      return `<article class="beast-card ${state.taming.active === id ? 'active' : ''} ${rarityClass(b.rarity)}"><div class="beast-glyph">${b.icon}</div><span class="rarity-tag">${b.rarity.toUpperCase()} · LV ${d.level}</span><h3>${b.name}</h3><p>${b.passive}</p>${progressLine(d.xp % 100, 100)}<div class="beast-bonus">Bond ${d.bond || 0} · ${b.evolve ? (canEvolve ? 'Ready to evolve' : `Evolves at Lv 5`) : 'Final form'}</div><div class="weapon-actions"><button class="action-btn" data-action="train-beast" data-id="${id}" ${state.taming.food < 1 || state.stones < trainCost || d.level >= 10 ? 'disabled' : ''}>Train · 1 food · ◇ ${trainCost}</button><button class="action-btn" data-action="set-beast" data-id="${id}" ${state.taming.active === id ? 'disabled' : ''}>${state.taming.active === id ? 'Companion' : 'Activate'}</button>${b.evolve ? `<button class="action-btn gold" data-action="evolve-beast" data-id="${id}" ${canEvolve && state.taming.food >= 2 && state.stones >= 150 ? '' : 'disabled'}>Evolve</button>` : ''}</div></article>`;
    }).join('') : '<div class="empty-tab"><div class="empty-mark">獸</div><h3>No companions yet</h3><p>Tame a wild beast or hatch an egg to begin. A companion fights beside you and grants a permanent passive bonus.</p></div>';
    const eggs = Object.entries(state.taming.eggs).map(([rarity, count]) => `<article class="beast-card ${rarityClass(rarity)}"><div class="beast-glyph">卵</div><span class="rarity-tag">${rarity.toUpperCase()} EGG</span><h3>${count} egg${count === 1 ? '' : 's'}</h3><p>Hatch a companion of this rarity. Mythic eggs may contain a legendary beast.</p><button class="action-btn" data-action="hatch-egg" data-rarity="${rarity}" ${count > 0 && state.taming.food > 0 && state.qi >= 60 ? '' : 'disabled'}>Hatch · 60 qi · 1 food</button></article>`).join('');
    const comp = activeBeast();
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">WILD BEASTS · TAMING CHANCE ${tameChance({ rarity: 'Common' })}% BASE</div><h2>Listen to the wild</h2><p>Taming costs qi and spirit stones. Rare beasts resist more. Your Beast Whisperer sutra, Life Dao, Beast Pen and luck all improve the odds.</p><div class="beast-grid">${cards}</div></article>
      <article class="content-panel"><div class="eyebrow">BONDED COMPANIONS</div><h2>Your beast hall</h2><p>Train companions with spirit food. At level 5 they may evolve into a rarer form.</p><div class="beast-grid">${roster}</div></article>
      <article class="content-panel"><div class="eyebrow">MYSTIC EGGS</div><h2>Something waits inside</h2><div class="beast-grid">${eggs}</div></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">ACTIVE COMPANION</div><h3>${comp ? comp.name : 'No companion'}</h3><p>${comp ? `${comp.passive} · Level ${comp.level}. In battle, your companion strikes for ${companionStrike()} extra damage with every attack.` : 'A bonded beast lends its strength to every battle and grants a passive bonus even outside combat.'}</p><div class="feature-stats"><span>BEAST FOOD <b>${state.taming.food}</b></span><span>TAMED <b>${rosterIds.length}</b></span><span>LUCK <b>${luckFor()}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">EGG SOURCES</div><h2>Where eggs are found</h2><p>Expeditions, secret realms, treasure maps, wandering merchants and rare wild encounters can all yield mystic eggs.</p><button class="action-btn" data-view="expeditions">Search the wilds</button></article></aside></div>`;
  }
  function companionStrike() {
    const b = activeBeast(); if (!b) return 0;
    return Math.round((b.power || 5) * (1 + (b.level - 1) * .35));
  }
  function renderBossPanel() {
    const active = state.world.active;
    let battle = '';
    if (active) {
      const def = worldBosses.find(b => b.id === active.id);
      const pct = active.hp / active.maxHp * 100;
      const log = (active.log || []).slice(-4).map(l => `<div>${l}</div>`).join('');
      battle = `<article class="boss-battle"><div class="boss-head"><div class="boss-glyph">${def?.icon || '魔'}</div><div><small>WORLD BOSS · TIER ${def?.tier || 1}</small><h3>${def?.name || 'Unknown'}</h3><div class="health-label"><span>HEALTH</span><b>${Math.max(0, Math.ceil(active.hp))} / ${active.maxHp}</b></div><div class="health-track"><i style="width:${clamp(pct, 0, 100)}%"></i></div></div></div><p class="boss-ability">${def?.trait || ''}</p><div class="boss-actions"><button class="action-btn body-strike" data-action="boss-attack" data-style="body">Body strike · ${attackDamage(4 + state.pathLevels.body * 4 + state.stage)} dmg</button><button class="action-btn spirit-strike" data-action="boss-attack" data-style="spirit" ${state.qi < 10 ? 'disabled' : ''}>Spirit art · 10 qi</button><button class="action-btn sect-spell" data-action="boss-spell" ${state.qi < currentSpell().cost ? 'disabled' : ''}>${currentSpell().seal} ${currentSpell().name} · ${currentSpell().cost} qi</button>${state.activeArts.map(id => { const a = martialArts.find(x => x.id === id); return a ? `<button class="action-btn" data-action="boss-art" data-id="${a.id}" ${state.qi < a.qi ? 'disabled' : ''}>${a.seal} ${a.name} · ${a.qi} qi</button>` : ''; }).join('')}<button class="action-btn danger" data-action="boss-retreat">Retreat</button></div><div class="battle-log">${log || '<div>The ancient beast regards you without fear.</div>'}</div></article>`;
    }
    const cards = worldBosses.map((b, i) => {
      const unlocked = state.world.tier >= b.tier;
      const defeated = (state.world.defeated[b.id] || 0) > 0;
      const canChallenge = unlocked && state.stage >= b.req && !active;
      return `<article class="boss-card ${defeated ? 'defeated' : ''} ${unlocked ? '' : 'locked'}"><div class="eyebrow">TIER ${b.tier} · ${b.seal}</div><h3>${b.name}</h3><p>${defeated ? `Defeated ${state.world.defeated[b.id]} time${state.world.defeated[b.id] === 1 ? '' : 's'}.` : unlocked ? 'The seal is broken. It is waiting.' : 'Sealed until the previous world boss falls.'}</p><div class="boss-ability">${b.trait}</div><div class="boss-reward">HP ${nfmt(b.hp)} · ATK ${b.damage} · Reward ◇ ${nfmt(b.stones)} · ✦ ${b.tokens} tokens${b.artifact ? ` · ${artifactCatalog.find(a => a.id === b.artifact)?.name}` : ''}</div><button class="action-btn" data-action="challenge-boss" data-id="${b.id}" ${canChallenge ? '' : 'disabled'}>${state.stage < b.req ? `Requires stage ${b.req}` : !unlocked ? 'Sealed' : active ? 'Battle in progress' : defeated ? 'Challenge again' : 'Challenge boss'}</button></article>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main">${battle}<article class="content-panel"><div class="eyebrow">ANCIENT POWERS</div><h2>World bosses</h2><p>Each victory breaks the seal on the next tier. Bosses have unique abilities and guaranteed rewards; later tiers can drop legendary artifacts.</p><div class="boss-grid">${cards}</div></article></div>
      <aside class="subview-aside"><article class="content-panel"><div class="eyebrow">BOSS RECORD</div><h2>${state.stats.bosses || 0} world bosses felled</h2><div class="inventory-row"><span>Current tier</span><b>${state.world.tier}</b></div><div class="inventory-row"><span>Sect tokens</span><b>✦ ${nfmt(state.sectTokens)}</b></div><div class="inventory-row"><span>Active companion</span><b>${activeBeast()?.name || 'None'}</b></div></article>
      <article class="feature-card"><div class="eyebrow">FIELD COUNSEL</div><h3>Bring everything</h3><p>World bosses hit harder than wild beasts. Use tribulation pills, equip an awakened weapon, and bring a companion. Retreat preserves your life but forfeits the attempt.</p><button class="action-btn" data-view="forge">Visit forge</button></article></aside></div>`;
  }

  /* ---------------- SECT ---------------- */
  function renderSect() {
    const tab = uiTabs.sect;
    let body = '';
    if (tab === 'missions') body = renderMissions();
    else if (tab === 'rankings') body = renderRankings();
    else if (tab === 'buildings') body = renderBuildings();
    else if (tab === 'armory') body = renderArmory();
    else body = renderSectOverview();
    $('view-sect').innerHTML = `${subHead('THE GREAT SECTS', 'Sect Hall', 'Choose a sect, complete its missions, climb its rankings, and raise its halls.', sectData().seal)}
      ${tabs('sect', [['overview', 'Overview'], ['missions', 'Missions'], ['rankings', 'Rankings'], ['buildings', 'Buildings'], ['armory', 'Armory']])}
      ${body}`;
  }
  function renderSectOverview() {
    const rank = sectRanks[state.sectRank] || sectRanks[0], next = sectRanks[state.sectRank + 1];
    const progress = next ? Math.min(100, state.sectRep / next.need * 100) : 100;
    const sectCards = Object.entries(sects).map(([id, sect]) => `<article class="sect-choice ${state.sectId === id ? 'selected' : ''}"><div class="tech-seal">${sect.seal}</div><h3>${sect.name}</h3><p>${sect.bonus}</p><button class="action-btn" data-action="join-sect" data-id="${id}" ${state.sectId === id ? 'disabled' : ''}>${state.sectId === id ? 'Current sect' : 'Join sect'}</button></article>`).join('');
    const ranks = sectRanks.map((r, i) => `<div class="sect-rank ${i <= state.sectRank ? 'unlocked' : ''}"><span>${i <= state.sectRank ? '✦' : '·'}</span><div><b>${r.name}</b><small>${r.need} merit</small></div>${i === state.sectRank ? '<em>CURRENT</em>' : ''}</div>`).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">CHOOSE YOUR ALLIANCE</div><h2>Three sects, three disciplines</h2><div class="sect-choice-grid">${sectCards}</div><div class="feature-stats"><span>SECT RANK BONUS <b>+${state.sectRank * 3}% attack · +${state.sectRank * 2}% qi</b></span><span>FACTION BONUS <b>${sectData().bonus}</b></span><span>BUILDINGS <b>${Object.values(state.sectBuildings).reduce((a, b) => a + b, 0)} levels</b></span></div></article>
    <article class="content-panel sect-progress"><div class="eyebrow">YOUR STANDING · ${sectData().name}</div><h2>${rank.name}</h2><p>${next ? `${next.need - state.sectRep} merit until promotion to ${next.name}.` : 'You have reached the highest sect rank.'}</p><div class="mini-track"><i style="width:${progress}%"></i></div><div class="inventory-row"><span>Sect merit</span><b>${state.sectRep} / ${next?.need || 'MAX'}</b></div><div class="inventory-row"><span>Sect tokens</span><b>✦ ${nfmt(state.sectTokens)}</b></div><button class="action-btn" data-action="donate" ${state.stones < 10 || !next ? 'disabled' : ''}>Donate 10 spirit stones · +4 merit</button></article>
    <article class="content-panel"><div class="eyebrow">THE LADDER OF SERVICE</div><h2>Disciple ranks</h2><div class="sect-rank-list">${ranks}</div></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">SECT BLESSINGS</div><h3>${worldName()}</h3><p>Your sect grants a permanent cultivation bonus and access to its armory. Rank furthers both. Sect buildings add another layer of permanent strength.</p><div class="feature-stats"><span>RANK <b>${rank.name}</b></span><span>MERIT <b>${state.sectRep}</b></span><span>TOKENS <b>${nfmt(state.sectTokens)}</b></span></div></article>
    <article class="content-panel"><div class="eyebrow">TODAY'S DUTY</div><h2>Sect missions</h2><p>Hunt beasts, chart expeditions, and fell world bosses to earn tokens and merit. Missions scale with your realm.</p><button class="action-btn" data-tab-view="sect" data-action="tab" data-tab="missions">Open mission board</button></article></aside></div>`;
  }
  function renderMissions() {
    const mission = state.mission && missions.find(m => m.id === state.mission.id);
    const missionPanel = mission
      ? `<div class="inventory-row"><span>${mission.name}</span><b>${Math.min(state.mission.progress || 0, mission.target)} / ${mission.target}</b></div><p>${mission.desc} Reward: ${mission.stones} stones · ${mission.tokens} sect tokens · ${mission.merit} merit.</p><div class="mini-track"><i style="width:${Math.min(100, (state.mission.progress || 0) / mission.target * 100)}%"></i></div><button class="action-btn" data-action="claim-mission" ${(state.mission.progress || 0) < mission.target ? 'disabled' : ''}>${(state.mission.progress || 0) >= mission.target ? 'Claim mission reward' : 'Mission in progress'}</button>`
      : missions.filter(m => state.stage >= m.req).map(m => `<div class="mission-row"><h3>${m.name}</h3><p>${m.desc}</p><small>Reward · ${m.stones} stones · ${m.tokens} tokens · ${m.merit} merit</small><button class="action-btn" data-action="accept-mission" data-id="${m.id}" ${state.mission ? 'disabled' : ''}>Accept mission</button></div>`).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">SECT MISSIONS · TOKENS ${nfmt(state.sectTokens)}</div><h2>Earn tokens and merit</h2><p>Complete assignments to earn sect tokens, spirit stones, and promotion merit. Only one mission may be active at a time.</p>${missionPanel}</article>
    <article class="content-panel"><div class="eyebrow">MISSION BOARD</div><h2>Available assignments</h2>${missions.filter(m => state.stage < m.req).map(m => `<div class="inventory-row"><span>${m.name}</span><b>Unlocks stage ${m.req}</b></div>`).join('') || '<p class="small-note">Every mission at your current realm is available.</p>'}</article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">MISSION MASTER</div><h3>${state.mission ? 'One task at a time' : 'The board is full'}</h3><p>Claim your current mission before accepting another. Merit promotes you through the sect ranks, which grants permanent attack, qi and health bonuses.</p><div class="feature-stats"><span>MERIT <b>${state.sectRep}</b></span><span>RANK <b>${sectRanks[state.sectRank]?.name}</b></span></div></article></aside></div>`;
  }
  function renderRankings() {
    const rows = ranking();
    const myPlace = rows.findIndex(r => r.me) + 1;
    const html = rows.slice(0, 12).map((r, i) => `<div class="rank-row ${r.me ? 'me' : ''}"><span class="rank-no">${i + 1}</span><span class="rank-name">${r.name}</span><b>${nfmt(r.score)} power</b></div>`).join('') + (myPlace > 12 ? `<div class="rank-row me"><span class="rank-no">${myPlace}</span><span class="rank-name">You</span><b>${nfmt(rankPower())} power</b></div>` : '');
    const canClaim = myPlace <= 10 && state.rankClaimDate !== dayIndex();
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">SECT POWER RANKINGS · DAY ${dayIndex()}</div><h2>You stand at rank ${myPlace}</h2><p>Ranking power combines realm, attack, health, sect merit, bosses felled, meridians and reincarnations. Top-ten disciples may claim a daily stipend.</p><div class="rank-list">${html}</div></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">RANKING STIPEND</div><h3>${myPlace <= 10 ? 'A reward awaits' : 'Climb higher'}</h3><p>${myPlace <= 10 ? 'The sect rewards its strongest disciples each day. Claim your stipend before the next dawn.' : 'Reach the top ten to earn a daily spirit stone and token stipend.'}</p><div class="feature-stats"><span>YOUR POWER <b>${nfmt(rankPower())}</b></span><span>RANK <b>${myPlace}</b></span></div><button class="action-btn" data-action="claim-rank" ${canClaim ? '' : 'disabled'}>${canClaim ? 'Claim stipend' : state.rankClaimDate === dayIndex() ? 'Claimed today' : 'Top ten only'}</button></article></aside></div>`;
  }
  function renderBuildings() {
    const cards = sectBuildings.map(b => {
      const lv = buildingLevel(b.id);
      const stones = Math.round(120 * Math.pow(1.65, lv));
      const tokens = 8 * (lv + 1);
      const can = lv < 10 && state.stones >= stones && state.sectTokens >= tokens;
      return `<article class="building-card"><div class="tech-seal">${b.seal}</div><h3>${b.name}</h3><p>${b.desc}</p><div class="building-level"><span>LEVEL ${lv} / 10</span><span>${b.perk}</span></div>${progressLine(lv, 10)}<button class="action-btn" data-action="upgrade-building" data-id="${b.id}" ${can ? '' : 'disabled'}>${lv >= 10 ? 'Fully built' : `Upgrade · ◇ ${nfmt(stones)} · ✦ ${tokens}`}</button></article>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">SECT CONSTRUCTION · TOKENS ${nfmt(state.sectTokens)}</div><h2>Raise the halls</h2><p>Buildings grant permanent bonuses to every disciple. Each level costs spirit stones and sect tokens, and the price rises with each rank.</p><div class="building-grid">${cards}</div></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">BUILDING BONUSES</div><h3>Strong foundations</h3><p>Meditation Hall · qi flow<br>Herb Garden · gathering<br>Beast Pen · taming<br>Formation Hall · breakthrough<br>Refining Armory · weapon power<br>Scripture Library · dao insight</p><div class="feature-stats"><span>TOTAL LEVELS <b>${Object.values(state.sectBuildings).reduce((a, b) => a + b, 0)}</b></span></div></article></aside></div>`;
  }
  function renderArmory() {
    const equipment = gearCatalog.map(item => {
      const gear = state.equipment[item.id], upgradeCost = 35 * (gear.level + 1);
      return `<article class="gear-card ${rarityClass(item.rarity)}"><div class="tech-seal">${item.seal}</div><h3>${item.name}</h3><span class="rarity-tag">${item.rarity.toUpperCase()}</span><p>${item.bonus}</p><div class="tech-level">${gear.owned ? `EQUIPPED · LEVEL ${gear.level}` : 'NOT OWNED'}</div>${gear.owned ? `<button class="action-btn" data-action="upgrade-gear" data-id="${item.id}" ${state.stones < upgradeCost || gear.level >= 10 ? 'disabled' : ''}>${gear.level >= 10 ? 'Max level' : `Upgrade · ◇ ${upgradeCost}`}</button>` : `<button class="action-btn" data-action="buy-gear" data-id="${item.id}" ${state.sectTokens < item.tokens ? 'disabled' : ''}>Buy · ${item.tokens} sect tokens</button>`}</article>`;
    }).join('');
    const weapon = equippedWeapon();
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">ARMORY · TOKENS ${nfmt(state.sectTokens)} · STONES ${nfmt(state.stones)}</div><h2>Equipment and refinement</h2><p>Buy each gear piece with sect tokens, then spend spirit stones to upgrade its bonus. Advanced weapons and artifacts are forged in the Forge.</p><div class="gear-grid">${equipment}</div></article>
    <article class="content-panel"><div class="eyebrow">CURRENT WEAPON</div><h2>${weapon ? weapon.name : 'No weapon equipped'}</h2><p>${weapon ? `${weapon.rarity} · +${weapon.totalAttack} attack · Refine ${weapon.refine}/10${weapon.awakened ? ' · Awakened' : ''}` : 'A cultivator without a weapon is still dangerous, but not as dangerous as one with a legendary blade.'}</p><button class="action-btn" data-view="forge">Open the forge</button></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">ARMORY KEEPER</div><h3>Tokens well spent</h3><p>Gear provides flat attack, qi flow, health and guard. Refinement in the Forge multiplies a weapon’s base attack and can awaken a unique ability.</p><div class="feature-stats"><span>ATTACK <b>${attackDamage(0)}</b></span><span>GUARD <b>${guardFor()}</b></span><span>MAX HP <b>${maxHpFor()}</b></span></div></article></aside></div>`;
  }

  /* ---------------- INNER DAO ---------------- */
  function renderDao() {
    const tab = uiTabs.dao;
    let body = tab === 'meridians' ? renderMeridians() : tab === 'dao' ? renderDaoPaths() : renderRoots();
    $('view-dao').innerHTML = `${subHead('THE INNER LANDSCAPE', 'Inner Dao', 'Awaken your spiritual root, open the meridians, and comprehend the laws that underpin reality.', '道')}
      ${tabs('dao', [['roots', 'Spiritual roots'], ['meridians', 'Meridians'], ['dao', 'Dao comprehension']])}${body}`;
  }
  function renderRoots() {
    const root = rootData();
    const rarity = root?.rarity || 'Common';
    let showcase;
    if (root) {
      const grade = state.root.grade || 0;
      const essenceCost = 8 + grade * 6 + state.stage;
      showcase = `<div class="root-showcase ${rarityClass(rarity)}"><div class="root-orb">${root.seal}</div><span class="rarity-tag">${rarity.toUpperCase()} · ${ROOT_GRADES[grade].toUpperCase()}</span><h2>${root.name}</h2><p>${root.desc}</p><div class="grade-pips">${ROOT_GRADES.map((_, i) => `<i class="${i <= grade ? 'on' : ''}"></i>`).join('')}</div><div class="stat-pills" style="justify-content:center"><span class="stat-pill green">${bonusText(root.bonus)}</span><span class="stat-pill violet">${root.ability}</span></div><div class="inline-actions" style="justify-content:center"><button class="action-btn gold" data-action="upgrade-root" ${state.root.essence >= essenceCost && grade < 4 ? '' : 'disabled'}>${grade >= 4 ? 'Divine grade reached' : `Raise grade · ${essenceCost} essence`}</button><button class="action-btn" data-action="reroll-root">Seek a new root</button></div><div class="small-note">Root essence: ${state.root.essence}. Grade multiplies all root bonuses by ×${rootMul().toFixed(2)}.</div></div>`;
    } else {
      showcase = `<div class="root-showcase"><div class="root-orb">空</div><span class="rarity-tag">UNAWAKENED</span><h2>Your root sleeps</h2><p>Every cultivator is born with a spiritual root, but most never wake it. The Awakening Ritual draws out the element hidden in your blood.</p><div class="stat-pills" style="justify-content:center"><span class="stat-pill">120 qi</span><span class="stat-pill">◇ 60</span><span class="stat-pill red">Requires stage 1</span></div><button class="action-btn gold" data-action="awaken-root" ${state.stage >= 1 && state.qi >= 120 && state.stones >= 60 ? '' : 'disabled'}>Begin the awakening ritual</button><div class="small-note">Heavenly and Divine roots are extremely rare. Higher luck improves the odds.</div></div>`;
    }
    const catalog = rootTypes.map(r => {
      const known = state.root.discovered.includes(r.id) || state.root.type === r.id;
      return `<div class="root-tile ${known ? '' : 'locked'} ${rarityClass(r.rarity)}"><span class="root-seal">${known ? r.seal : '?'}</span><div><b>${known ? r.name : 'Undiscovered root'}</b><small>${known ? `${r.rarity} · ${bonusText(r.bonus)}` : `${r.rarity} · Awaken or reroll to discover`}</small></div></div>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">SPIRITUAL ROOT</div><h2>${root ? 'The element within' : 'The root within'}</h2><p>Your spiritual root shapes every art you learn. It grants permanent bonuses that stack with Dao, meridians, equipment and companions.</p><div class="root-layout"><div>${showcase}</div><div><div class="eyebrow">KNOWN ROOTS</div><div class="root-catalog">${catalog}</div></div></div></article>
    <article class="content-panel"><div class="eyebrow">ROOT AFFINITY</div><h2>Element and Dao</h2><p>Fire roots comprehend the Fire Dao faster and improve alchemy. Water roots accelerate qi. Metal roots sharpen the Sword Dao. Wood roots deepen the Life Dao. Thunder roots master Lightning. Rare roots may touch several laws at once.</p><div class="feature-stats"><span>ROOT ESSENCE <b>${state.root.essence}</b></span><span>GRADE <b>${root ? ROOT_GRADES[state.root.grade] : 'None'}</b></span><span>LUCK <b>${luckFor()}</b></span></div></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">THE AWAKENING</div><h3>${root ? root.name : 'Still sleeping'}</h3><p>${root ? root.ability : 'Awaken a root to gain a permanent elemental identity. Your root can be raised through five grades, from Mortal to Divine.'}</p><div class="feature-stats"><span>DISCOVERED <b>${state.root.discovered.length} / ${rootTypes.length}</b></span><span>REROLLS <b>${state.root.rerolls || 0}</b></span></div></article>
    <article class="content-panel"><div class="eyebrow">ROOT ESSENCE</div><h2>How to grow</h2><p>Major breakthroughs, secret realms, inheritance trials and the Root Nourishing Pill all grant root essence. Spend it to raise your root grade.</p><button class="action-btn" data-view="alchemy">Visit alchemy</button></article></aside></div>`;
  }
  function meridianBlock(m) {
    if (state.meridians.opened[m.id]) return '';
    if (state.stage < m.stage) return `Requires stage ${m.stage}`;
    if (m.req.some(r => !state.meridians.opened[r])) return `Open ${m.req.map(r => meridianList.find(x => x.id === r)?.name || r).join(' · ')} first`;
    if (m.daoReq && daoLevel(m.daoReq.id) < m.daoReq.level) return `Requires ${daoPaths.find(d => d.id === m.daoReq.id)?.name} level ${m.daoReq.level}`;
    if (state.meridians.points < m.points) return `Needs ${m.points} meridian point${m.points > 1 ? 's' : ''}`;
    if (state.stones < m.stones) return `Needs ◇ ${m.stones}`;
    if (state.qi < m.qi) return `Needs ${nfmt(m.qi)} qi`;
    return '';
  }
  function renderMeridians() {
    const opened = openedMeridians();
    const cards = meridianList.map(m => {
      const isOpen = !!state.meridians.opened[m.id];
      const block = meridianBlock(m);
      const can = !isOpen && !block;
      return `<article class="meridian-card ${isOpen ? 'opened' : can ? 'available' : ''} ${m.special ? 'special' : ''}"><div class="meridian-seal">${m.seal}</div><h3>${m.name}</h3><p>${m.desc}</p><div class="stat-pills"><span class="stat-pill green">${bonusText(m.bonus)}</span></div><div class="meridian-req">${isOpen ? 'OPEN · circulating' : block || `${m.points} point${m.points > 1 ? 's' : ''} · ◇ ${m.stones} · ${nfmt(m.qi)} qi`}${m.daoReq ? `<br>Dao requirement: ${daoPaths.find(d => d.id === m.daoReq.id)?.name} Lv ${m.daoReq.level}` : ''}</div><button class="action-btn" data-action="open-meridian" data-id="${m.id}" ${can ? '' : 'disabled'}>${isOpen ? 'Meridian open' : 'Open meridian'}</button></article>`;
    }).join('');
    const setRows = [
      { need: 4, text: '4 opened · +2% qi flow' },
      { need: 8, text: '8 opened · +3% attack, +10 health' },
      { need: 12, text: '12 opened · +8% qi and attack, +40 health · Perfect Circulation' }
    ].map(s => `<div class="daily-row ${opened >= s.need ? 'done' : ''}"><span class="daily-check">${opened >= s.need ? '✓' : '·'}</span><div><b>${s.text}</b><small>${opened} / ${s.need} meridians opened</small></div></div>`).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">MERIDIAN NETWORK · POINTS ${state.meridians.points}</div><h2>Open the channels of the body</h2><p>Meridians are permanent. Each opened channel grants a stat bonus; completing sets of four grants additional circulation bonuses. Major breakthroughs grant meridian points.</p><div class="meridian-grid">${cards}</div></article>
    <article class="content-panel circulation-bonus"><h3>Circulation bonuses</h3><p>As the network opens, the body begins to circulate qi without conscious effort.</p><div class="daily-challenge-list">${setRows}</div></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">MERIDIAN MAP</div><h3>${opened} / ${meridianList.length} channels open</h3><p>Special vessels — Ren, Du, Dai and Chong — require both a high realm and a Dao level. They are the true gates of immortal anatomy.</p><div class="feature-stats"><span>MERIDIAN POINTS <b>${state.meridians.points}</b></span><span>OPEN <b>${opened}</b></span><span>BREAKTHROUGH <b>${breakChance()}%</b></span></div></article>
    <article class="content-panel"><div class="eyebrow">GAINING POINTS</div><h2>Where points come from</h2><p>Every breakthrough grants 1 meridian point; major realm breakthroughs grant 2. The Meridian Opening Pill grants 1 more. Every fifth path rank also grants 1.</p></article></aside></div>`;
  }
  function renderDaoPaths() {
    const cards = daoPaths.map(d => {
      const xp = state.dao[d.id]?.xp || 0, lv = daoLevel(d.id), nextXp = DAO_XP[Math.min(10, lv + 1)] || DAO_XP[10];
      const cost = { qi: 80 + lv * 45, stones: 8 + lv * 6 };
      const can = state.qi >= cost.qi && state.stones >= cost.stones && lv < 10;
      return `<article class="dao-card ${d.id === 'fire' ? '' : ''}" style="--dao:${d.color}"><div class="dao-head"><div class="dao-seal">${d.seal}</div><div><h3>${d.name}</h3><small>LEVEL ${lv} / 10 · ${masteryName(lv).toUpperCase()}</small></div></div><p>${d.desc}</p><div class="meter-caption"><span>INSIGHT</span><b>${nfmt(xp)} / ${nfmt(nextXp)}</b></div>${progressLine(lv >= 10 ? 1 : xp, lv >= 10 ? 1 : nextXp, 'gold')}<div class="stat-pills"><span class="stat-pill green">${d.passive}</span><span class="stat-pill ${lv >= 3 ? 'violet' : ''}">${lv >= 3 ? 'Ability awakened' : 'Ability at Lv 3'}</span></div><div class="dao-ability">${d.ability}</div><div class="dao-actions"><button class="action-btn" data-action="comprehend-dao" data-id="${d.id}" ${can ? '' : 'disabled'}>Comprehend · ${nfmt(cost.qi)} qi · ◇ ${cost.stones}</button><button class="action-btn gold" data-action="infuse-dao" data-id="${d.id}" ${state.daoPoints > 0 && lv < 10 ? '' : 'disabled'}>Infuse insight · 1</button></div></article>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE SIX LAWS · DAO INSIGHT ${state.daoPoints}</div><h2>Comprehend the Dao</h2><p>Each Dao grants a permanent passive. Reaching level 3 awakens its signature ability. Levels continue to 10 and mastery. Comprehending costs qi and spirit stones; insight points grant immediate progress.</p><div class="dao-grid">${cards}</div></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">DAO MASTERY</div><h3>${totalMastery()} total levels</h3><p>Your spiritual root determines which Dao you learn fastest. The Scripture Library, Dao Heart Sutra and reincarnation memories further amplify comprehension.</p><div class="feature-stats"><span>TOTAL LEVELS <b>${totalMastery()} / 60</b></span><span>INSIGHT POINTS <b>${state.daoPoints}</b></span><span>DAO GAIN <b>×${daoGainMult('sword').toFixed(2)}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">PATH SYNERGY</div><h2>Every law touches another</h2><p>Sword raises attack. Fire empowers damage. Water accelerates qi. Lightning sharpens critical strikes. Space shortens expeditions and evades blows. Life heals, fortifies, and improves gathering.</p></article></aside></div>`;
  }

  /* ---------------- ANCIENT INHERITANCE & SECRET REALMS ---------------- */
  function renderInheritance() {
    const tab = uiTabs.inherit;
    const body = tab === 'realms' ? renderSecretRealms() : renderLegacy();
    $('view-inherit').innerHTML = `${subHead('ECHOES OF THE ANCIENTS', 'Ancient inheritance', 'Tombs, dreams and empty thrones remember their heirs. Pass their trials, claim their artifacts, and walk through doors the world forgot.', '傳')}
      ${tabs('inherit', [['legacy', 'Inheritances'], ['realms', 'Secret realms']])}${body}`;
  }
  function renderLegacy() {
    const cards = inheritanceCatalog.map(inc => {
      const discovered = state.inheritance.discovered.includes(inc.id);
      const completed = state.inheritance.completed.includes(inc.id);
      const doneCount = inc.trials.filter((_, i) => state.inheritance.trials[inc.id]?.[i]).length;
      const canDiscover = !discovered && state.stage >= inc.req && state.stones >= (inc.cost.stones || 0) && Object.entries(inc.cost).every(([k, v]) => k === 'stones' || (state.herbs[k] || 0) >= v);
      const trialRows = inc.trials.map((trial, i) => {
        const done = !!state.inheritance.trials[inc.id]?.[i];
        const ready = discovered && !done && safeCheck(trial);
        return `<div class="trial-row ${done ? 'done' : ''}"><span class="trial-check">${done ? '✓' : '·'}</span><div><b>${trial.name}</b><small>${trial.desc} · ${rewardsText(trial.reward)}</small></div>${done ? '' : `<button class="action-btn" data-action="attempt-trial" data-id="${inc.id}" data-index="${i}" ${ready ? '' : 'disabled'}>${ready ? 'Undergo' : 'Locked'}</button>`}</div>`;
      }).join('');
      const costText = [`◇ ${nfmt(inc.cost.stones || 0)}`, ...Object.entries(inc.cost).filter(([k]) => k !== 'stones').map(([k, v]) => `${v} ${ingredients[k]?.name || k}`)].join(' · ');
      return `<article class="legacy-card ${completed ? 'completed' : discovered ? 'discovered' : ''}"><div class="legacy-head"><div class="legacy-seal">${inc.seal}</div><div><h3>${inc.name}</h3><small>${completed ? 'LEGACY CLAIMED' : discovered ? `${doneCount} / ${inc.trials.length} TRIALS PASSED` : `REQUIRES STAGE ${inc.req}`}</small></div></div><p>${inc.desc}</p><div class="stat-pills"><span class="stat-pill green">${inc.bonus}</span><span class="stat-pill violet">${artifactCatalog.find(a => a.id === inc.artifact)?.name || 'Lost artifact'}</span></div>${discovered ? `<div class="trial-list">${trialRows}</div>` : ''}${completed ? '<span class="stat-pill gold">Artifact claimed · legacy complete</span>' : discovered ? '' : `<button class="action-btn gold" data-action="discover-inheritance" data-id="${inc.id}" ${canDiscover ? '' : 'disabled'}>${state.stage < inc.req ? `Requires stage ${inc.req}` : `Enter the legacy · ${costText}`}</button>`}</article>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE UNCLAIMED PAST</div><h2>Five legacies, five questions</h2><p>Discovering a legacy costs spirit stones and ancient relics. Each legacy holds three trials. Pass all three to claim its artifact and complete the inheritance.</p><div class="legacy-grid">${cards}</div></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">LEGACY RECORD</div><h3>${state.inheritance.completed.length} / ${inheritanceCatalog.length} inheritances claimed</h3><p>Artifacts are permanent. Equip up to two in the Forge. Some legacies also teach a forgotten martial art.</p><div class="feature-stats"><span>DISCOVERED <b>${state.inheritance.discovered.length}</b></span><span>ARTIFACTS <b>${state.inheritance.artifacts.length}</b></span><span>LEGACY POINTS <b>${state.inheritance.points || 0}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">THE HEIR'S BURDEN</div><h2>Trials remember</h2><p>Trials ask for Dao levels, beast bonds, brews, victories and realm advancement. Prepare before you enter; the legacy will wait.</p><button class="action-btn" data-view="forge">Open the forge</button></article></aside></div>`;
  }
  function renderSecretRealms() {
    const rb = state.realms.boss;
    const realmDef = rb ? secretRealms.find(r => r.id === rb.id) : null;
    let battle = '';
    if (rb && realmDef) {
      const log = (rb.log || []).slice(-5).map(l => `<div>${l}</div>`).join('');
      battle = `<article class="boss-battle"><div class="boss-head"><div class="boss-glyph">${realmDef.boss.icon}</div><div><small>SECRET REALM · ${realmDef.name.toUpperCase()}</small><h3>${realmDef.boss.name}</h3><div class="health-label"><span>HEALTH</span><b>${Math.max(0, Math.ceil(rb.hp))} / ${rb.maxHp}</b></div><div class="health-track"><i style="width:${clamp(rb.hp / rb.maxHp * 100, 0, 100)}%"></i></div></div></div><p class="boss-ability">${realmDef.boss.trait}</p><div class="boss-actions"><button class="action-btn body-strike" data-action="realm-attack" data-style="body">Body strike · ${attackDamage(4 + state.pathLevels.body * 4 + state.stage)} dmg</button><button class="action-btn spirit-strike" data-action="realm-attack" data-style="spirit" ${state.qi < 10 ? 'disabled' : ''}>Spirit art · 10 qi</button><button class="action-btn sect-spell" data-action="realm-spell" ${state.qi < currentSpell().cost ? 'disabled' : ''}>${currentSpell().seal} ${currentSpell().name} · ${currentSpell().cost} qi</button>${state.activeArts.map(id => { const a = martialArts.find(x => x.id === id); return a ? `<button class="action-btn" data-action="realm-art" data-id="${a.id}" ${state.qi < a.qi ? 'disabled' : ''}>${a.seal} ${a.name} · ${a.qi} qi</button>` : ''; }).join('')}<button class="action-btn danger" data-action="realm-retreat">Withdraw</button></div><div class="battle-log">${log || '<div>The realm closes behind you. Something ancient stirs.</div>'}</div></article>`;
    }
    const cards = secretRealms.map(r => {
      const cleared = state.realms.cleared[r.id] || 0;
      const unlocked = state.stage >= r.req;
      const can = unlocked && state.realms.keys >= r.keyCost && state.qi >= r.qiCost && !rb;
      const drops = Object.entries(r.drops).map(([k, v]) => `${v} ${ingredients[k]?.name || k}`).join(' · ');
      return `<article class="realm-card ${cleared ? 'cleared' : ''} ${unlocked ? '' : 'locked'}"><div class="eyebrow">REALM ${secretRealms.indexOf(r) + 1} · ${r.seal}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="realm-meta"><span>Stage ${r.req}</span><span>🗝 ${r.keyCost}</span><span>${nfmt(r.qiCost)} qi</span><span>Boss HP ${nfmt(r.boss.hp)}</span><span>${cleared ? `Cleared ${cleared}×` : 'Uncleared'}</span></div><div class="small-note">${r.boss.trait}<br>Drops · ${drops} · ◇ ${nfmt(r.stones)}</div><button class="action-btn" data-action="enter-realm" data-id="${r.id}" ${can ? '' : 'disabled'}>${unlocked ? (rb ? 'A realm is already open' : cleared ? 'Enter again' : 'Enter the realm') : `Requires stage ${r.req}`}</button></article>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main">${battle}<article class="content-panel"><div class="eyebrow">HIDDEN PLACES · KEYS ${state.realms.keys}</div><h2>Doors beneath the world</h2><p>Secret realms consume a key and a great deal of qi to open. Their guardians are stronger than wild beasts and do not forgive hesitation.</p><div class="realm-grid">${cards}</div></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">REALM RECORD</div><h3>${state.stats.realms || 0} hidden realms cleared</h3><p>Each first clear grants root essence and Dao insight. Keys are found on expeditions, through fate, and from inheritance trials.</p><div class="feature-stats"><span>KEYS <b>${state.realms.keys}</b></span><span>CLEARED <b>${Object.keys(state.realms.cleared).length} / ${secretRealms.length}</b></span><span>RELICS <b>${state.herbs.relic || 0}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">BEYOND THE DOOR</div><h2>Prepare your body</h2><p>Guard, healing pills and a strong companion matter more here than raw attack. Withdrawing preserves your life but forfeits the key.</p><button class="action-btn" data-view="alchemy">Brew a restorative</button></article></aside></div>`;
  }

  /* ---------------- FORGE ---------------- */
  function costText(cost) {
    return Object.entries(cost).map(([k, v]) => k === 'stones' ? `◇ ${nfmt(v)}` : `${v} ${ingredients[k]?.name || k}`).join(' · ');
  }
  function canPay(cost, s = state) {
    return Object.entries(cost || {}).every(([k, v]) => k === 'stones' ? s.stones >= v : (s.herbs[k] || 0) >= v);
  }
  function payCost(cost) {
    state.stones -= cost.stones || 0;
    Object.entries(cost).forEach(([k, v]) => { if (k !== 'stones' && state.herbs[k] !== undefined) state.herbs[k] -= v; });
  }
  function renderForge() {
    const tab = uiTabs.forge;
    const body = tab === 'artifacts' ? renderArtifacts() : renderWeapons();
    $('view-forge').innerHTML = `${subHead('FIRE, STEEL AND PATIENCE', 'The refining forge', 'Shape spirit ore into a weapon worthy of your path, then refine and awaken it. Ancient artifacts wait in the second flame.', '⚒')}
      ${tabs('forge', [['weapons', 'Weapons'], ['artifacts', 'Artifacts']])}${body}`;
  }
  function renderWeapons() {
    const cards = weaponCatalog.map(w => {
      const owned = state.forge.weapons[w.id] || null;
      const canForge = state.stage >= w.req && canPay(w.cost) && !owned;
      const refine = owned?.refine || 0;
      const refineCost = { stones: Math.round(160 * Math.pow(1.45, refine)), ore: 2 + refine };
      const attack = Math.round(w.attack * (1 + refine * .12) * (1 + buildingLevel('armory') * .03));
      const canRefine = owned && refine < 10 && canPay(refineCost);
      const canAwaken = owned && refine >= 10 && !owned.awakened && state.stones >= 500 && (state.herbs.relic || 0) >= 1 && (state.herbs.beastCore || 0) >= 1;
      return `<article class="weapon-card ${owned ? (state.forge.equippedWeapon === w.id ? 'equipped' : '') : 'locked'}"><span class="rarity-tag">${w.rarity.toUpperCase()}</span><h3>${w.name}</h3><p>${owned ? `${w.ability}` : `A ${w.rarity.toLowerCase()} weapon requiring stage ${w.req}.`}</p><div class="weapon-stats"><span>⚔ ${nfmt(attack)} attack</span><span>Refine ${refine}/10</span><span>${owned?.awakened ? 'Awakened' : 'Dormant'}</span></div><div class="weapon-ability"><b>${w.seal} ${owned?.awakened ? 'Awakened ability' : 'Latent ability'}</b><br>${w.ability}</div><div class="weapon-actions">${owned ? `<button class="action-btn" data-action="equip-weapon" data-id="${w.id}" ${state.forge.equippedWeapon === w.id ? 'disabled' : ''}>${state.forge.equippedWeapon === w.id ? 'Equipped' : 'Equip'}</button><button class="action-btn" data-action="refine-weapon" data-id="${w.id}" ${canRefine ? '' : 'disabled'}>${refine >= 10 ? 'Max refinement' : `Refine · ${costText(refineCost)}`}</button><button class="action-btn gold" data-action="awaken-weapon" data-id="${w.id}" ${canAwaken ? '' : 'disabled'}>Awaken · ◇ 500 · relic · core</button>` : `<button class="action-btn" data-action="forge-weapon" data-id="${w.id}" ${canForge ? '' : 'disabled'}>${state.stage < w.req ? `Requires stage ${w.req}` : `Forge · ${costText(w.cost)}`}</button>`}</div></article>`;
    }).join('');
    const weapon = equippedWeapon();
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE COLD ANVIL · ORE ${state.herbs.ore || 0}</div><h2>Weapons of the path</h2><p>Forging a weapon costs spirit stones and ore. Equipped weapons add their attack to every strike; refinement multiplies it further. At refinement 10 a weapon can be awakened with a relic and a beast core.</p><div class="forge-grid">${cards}</div></article>
      <article class="content-panel"><div class="eyebrow">CURRENT ARMS</div><h2>${weapon ? weapon.name : 'Bare hands'}</h2><p>${weapon ? `+${nfmt(weapon.totalAttack)} attack · Refine ${weapon.refine}/10 · ${weapon.awakened ? 'Awakened' : 'Dormant'}. ${weapon.ability}` : 'A forged weapon is the difference between a long road and a short one.'}</p><div class="feature-stats"><span>ATTACK <b>${nfmt(attackDamage(0))}</b></span><span>GUARD <b>${guardFor()}</b></span><span>CRIT <b>${Math.round(critChance() * 100)}%</b></span></div></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">FORGE MASTER</div><h3>${Object.values(state.forge.weapons).filter(w => w?.owned).length} weapons forged</h3><p>The armory building increases every weapon's power. Artifacts from ancient inheritances can be equipped in the second tab.</p><div class="feature-stats"><span>STONES <b>◇ ${nfmt(state.stones)}</b></span><span>ORE <b>${state.herbs.ore || 0}</b></span><span>CORES <b>${state.herbs.beastCore || 0}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">AWAKENING</div><h2>Steel remembers</h2><p>An awakened weapon keeps its full ability in battle. The Emberfang burns, the Mistfang evades, and Heaven's Edge sharpens every critical strike.</p></article></aside></div>`;
  }
  function renderArtifacts() {
    const slots = state.forge.equippedArtifacts || [null, null];
    const slotHtml = slots.map((id, i) => {
      const a = id ? artifactCatalog.find(x => x.id === id) : null;
      return `<div class="artifact-slot ${a ? 'filled' : ''}"><small>ARTIFACT SLOT ${i + 1}</small>${a ? `<b>${a.seal} ${a.name}</b><p>${a.ability}</p><button class="action-btn" data-action="unequip-artifact" data-slot="${i}">Unequip</button>` : '<b>Empty</b><p>Claim an ancient inheritance to fill this slot.</p>'}</div>`;
    }).join('');
    const cards = state.inheritance.artifacts.length ? state.inheritance.artifacts.map(id => {
      const a = artifactCatalog.find(x => x.id === id); if (!a) return '';
      const equipped = slots.includes(id);
      return `<article class="weapon-card ${equipped ? 'equipped' : ''} ${rarityClass(a.rarity)}"><span class="rarity-tag">${a.rarity.toUpperCase()}</span><h3>${a.seal} ${a.name}</h3><p>${a.ability}</p><div class="weapon-stats"><span>${bonusText(a.bonus)}</span></div><div class="weapon-actions">${equipped ? '<span class="stat-pill gold">Equipped</span>' : `<button class="action-btn" data-action="equip-artifact" data-id="${a.id}" data-slot="0">Equip slot 1</button><button class="action-btn" data-action="equip-artifact" data-id="${a.id}" data-slot="1">Equip slot 2</button>`}</div></article>`;
    }).join('') : '<div class="empty-tab"><div class="empty-mark">器</div><h3>No artifacts yet</h3><p>Pass the trials of an ancient inheritance to claim your first artifact.</p><button class="action-btn" data-view="inherit">Visit inheritance</button></div>';
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">TWO HANDS, TWO HEIRLOOMS</div><h2>Equipped artifacts</h2><div class="artifact-slots">${slotHtml}</div><p>Artifacts grant permanent bonuses while equipped. Their power stacks with roots, meridians, Dao and companions.</p></article>
      <article class="content-panel"><div class="eyebrow">ARTIFACT VAULT</div><h2>${state.inheritance.artifacts.length} claimed</h2><div class="forge-grid">${cards}</div></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">HEIRLOOM LORE</div><h3>The dead lend strength</h3><p>Every artifact came from a life that ended badly. The Karmic Wheel is the rarest, torn from the Primordial Demon Ancestor.</p><div class="feature-stats"><span>ATTACK <b>${nfmt(attackDamage(0))}</b></span><span>QI FLOW <b>${rateFor().toFixed(1)}</b></span><span>LUCK <b>${luckFor()}</b></span></div></article></aside></div>`;
  }

  /* ---------------- FATE & FORTUNE ---------------- */
  function ensureFate(s = state) {
    if (!s.fate) s.fate = { pending: null, log: [], merchant: [], merchantDate: 0, maps: 0, fragments: 0, clock: 0, encounters: 0, luckBuff: 0, luckBuffUntil: 0 };
    const day = dayIndex(s);
    if (s.fate.merchantDate !== day) {
      const seed = dayHash(day + (s.rebirth?.count || 0) * 23 + 'merchant');
      const pool = merchantPool.slice();
      for (let i = pool.length - 1; i > 0; i--) { const j = seed % (i + 1); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      s.fate.merchant = pool.slice(0, 3).map(item => ({ id: item.id, bought: false }));
      s.fate.merchantDate = day;
    }
    if (s.fate.pending && !fateEvents.find(f => f.id === s.fate.pending.id)) s.fate.pending = null;
  }
  function renderFate() {
    ensureFate();
    const pending = state.fate.pending ? fateEvents.find(f => f.id === state.fate.pending.id) : null;
    const offers = state.fate.merchant.map(offer => {
      const item = merchantPool.find(m => m.id === offer.id); if (!item) return '';
      return `<article class="merchant-offer"><div class="offer-seal">${item.seal}</div><h3>${item.name}</h3><p>${item.desc}</p><b class="gold-text">◇ ${nfmt(item.cost)}</b><button class="action-btn" data-action="buy-merchant" data-id="${item.id}" ${offer.bought || state.stones < item.cost ? 'disabled' : ''}>${offer.bought ? 'Sold' : 'Buy'}</button></article>`;
    }).join('');
    const log = (state.fate.log || []).slice(-6).reverse().map(line => `<div class="log-line">${line}</div>`).join('') || '<div class="log-line">The road is quiet. Fortune waits for those who walk.</div>';
    const pendingHtml = pending
      ? `<article class="content-panel"><div class="eyebrow">A FORTUNE ON THE ROAD · ${pending.seal}</div><h2>${pending.title}</h2><p>${pending.text}</p><div class="fate-options">${pending.options.map(o => `<button class="action-btn gold" data-action="resolve-fate" data-id="${o.key}">${o.label}</button>`).join('')}</div></article>`
      : `<article class="content-panel"><div class="eyebrow">THE ROAD IS OPEN</div><h2>Seek what fate has left for you</h2><p>Walk beyond the sect gate and let chance find you. Seeking a fortune costs a little qi; the road may offer treasure, insight, a beast, or a lesson.</p><button class="action-btn gold" data-action="seek-fate" ${state.qi < 20 ? 'disabled' : ''}>Walk the road · 20 qi</button><div class="small-note">Fate also finds you on its own during long cultivation. A pending fortune appears in the banners above.</div></article>`;
    $('view-fate').innerHTML = `${subHead('THE ROAD REMEMBERS', 'Fate & Fortune', 'Walk the roads between certainty and chance. Luck bends what the world is willing to give you.', '✦')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="luck-hero"><div class="luck-orb">✦</div><div><div class="eyebrow">YOUR FORTUNE</div><h2>${luckFor()}</h2><p>Luck bends loot, taming, rare roots, critical strikes and the generosity of strangers.</p></div></div></article>${pendingHtml}
      <article class="content-panel"><div class="eyebrow">THE FACELESS MERCHANT · DAY ${dayIndex()}</div><h2>Three offers at the edge of the road</h2><p>A new merchant arrives each game day. Their stock is never the same twice.</p><div class="merchant-grid">${offers}</div></article>
      <article class="content-panel"><div class="eyebrow">TREASURE MAPS</div><h2>${state.fate.maps} map${state.fate.maps === 1 ? '' : 's'} in your sleeve</h2><p>Treasure maps lead to buried caches, forgotten keys and fragments of older maps. Using one always costs the map.</p><button class="action-btn" data-action="use-map" ${state.fate.maps > 0 ? '' : 'disabled'}>${state.fate.maps > 0 ? 'Follow a treasure map' : 'No maps'}</button></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">FORTUNE'S LEDGER</div><h3>${state.fate.encounters || 0} encounters walked</h3><p>Some fortunes grant permanent luck. Others ask for courage, patience, or a handful of spirit stones.</p><div class="feature-stats"><span>MAPS <b>${state.fate.maps}</b></span><span>FRAGMENTS <b>${state.fate.fragments || 0}</b></span><span>LUCK <b>${luckFor()}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">RECENT FORTUNES</div><h2>The road remembers</h2><div class="log-list">${log}</div></article></aside></div>`;
  }

  /* ---------------- REINCARNATION & ASCENSION ---------------- */
  function rebirthPointsFor(s = state) {
    return Math.max(1, Math.floor((s.stage || 0) / 2) + Math.floor(totalMastery(s) / 2) + (s.stats?.bosses || 0) * 2 + Math.floor((s.stats?.realms || 0) / 2));
  }
  function renderAscension() {
    const world = worldNames[state.rebirth?.world || 0] || 'Beyond the Void';
    const points = rebirthPointsFor();
    const upgrades = [
      { id: 'qi', name: 'Eternal Breath', seal: '氣', desc: '+10% qi generation per rank, carried through every life.', level: rebirthUpgrade('qi') },
      { id: 'attack', name: 'Karmic Edge', seal: '刃', desc: '+8% attack per rank, remembered by the soul.', level: rebirthUpgrade('attack') },
      { id: 'luck', name: 'Wheel of Fortune', seal: '運', desc: '+2 luck per rank. Fate favors an old soul.', level: rebirthUpgrade('luck') },
      { id: 'dao', name: 'Echo of Enlightenment', seal: '悟', desc: '+15% Dao insight per rank.', level: rebirthUpgrade('dao') }
    ].map(u => {
      const cost = u.level + 1;
      return `<article class="feature-card-lite"><div class="eyebrow">${u.seal} · RANK ${u.level}</div><h3>${u.name}</h3><p>${u.desc}</p><small>Next rank · ${cost} reincarnation point${cost === 1 ? '' : 's'}</small><button class="action-btn" data-action="rebirth-upgrade" data-id="${u.id}" ${state.rebirth.points >= cost ? '' : 'disabled'}>Deepen the soul</button></article>`;
    }).join('');
    $('view-ascension').innerHTML = `${subHead('THE WHEEL AND THE HIGHER SKY', 'Reincarnation & ascension', 'Death is a door, not an ending. Carry your permanent strength into a new life, or climb to a higher world.', '仙')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE WHEEL TURNS</div><h2>${world}</h2><p>Reincarnation strips away realm, qi and mortal standing, but the root, meridians, Dao, beasts, inheritances and forged weapons remain. Ascension carries you to a higher world with all your strength intact.</p><div class="feature-stats"><span>REBIRTHS <b>${state.rebirth.count || 0}</b></span><span>POINTS <b>${state.rebirth.points || 0}</b></span><span>NEXT LIFE VALUE <b>${points}</b></span><span>WORLD BONUS <b>+${(state.rebirth.world || 0) * 20}% qi · +${(state.rebirth.world || 0) * 15}% attack</b></span></div><div class="inline-actions"><button class="action-btn gold" data-action="reincarnate" ${state.stage >= 20 ? '' : 'disabled'}>${state.stage >= 20 ? `Reincarnate · earn ${points} points` : 'Reach stage 20 to reincarnate'}</button><button class="action-btn" data-action="ascend-world" ${state.stage >= 25 && (state.rebirth.world || 0) < worldNames.length - 1 ? '' : 'disabled'}>${(state.rebirth.world || 0) >= worldNames.length - 1 ? 'The highest sky' : state.stage >= 25 ? 'Ascend to the next world' : 'Reach stage 25 to ascend'}</button></div></article>
      <article class="content-panel"><div class="eyebrow">SOUL UPGRADES</div><h2>Strengthen what death cannot take</h2><p>Reincarnation points are permanent. Spend them here; the cost rises with every rank.</p><div class="feature-grid">${upgrades}</div></article>
      <article class="content-panel"><div class="eyebrow">WHAT REMAINS</div><h2>The immortal ledger</h2><p>Roots, meridians, Dao insight, beast bonds, inheritances, artifacts, forged weapons, achievements, sect buildings and world boss records persist through reincarnation. Realm, qi, stones, paths, mission progress and daily practice begin again.</p></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">ASCENSION</div><h3>${state.rebirth.world >= worldNames.length - 1 ? 'Beyond the heavens' : `Next world · ${worldNames[(state.rebirth.world || 0) + 1]}`}</h3><p>Each higher world grants +20% qi and +15% attack permanently. Ascension requires True Immortal (stage 25).</p><div class="feature-stats"><span>STAGE <b>${state.stage}</b></span><span>DAO LEVELS <b>${totalMastery()}</b></span><span>BOSSES <b>${state.stats.bosses || 0}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">DEATH IS A DOOR</div><h2>Not an ending</h2><p>The wheel does not judge. It simply turns. Carry what you have learned, and the next life begins closer to the sky.</p></article></aside></div>`;
  }

  /* ---------------- CODEX ---------------- */
  function renderCodex() {
    const tab = uiTabs.codex;
    let body = '';
    if (tab === 'achievements') {
      const cards = achievementDefs.map(def => {
        const unlocked = !!state.achievements[def.id];
        const hidden = def.hidden && !unlocked;
        return `<div class="achievement ${unlocked ? 'unlocked' : ''} ${hidden ? 'hidden-ach' : ''}"><div class="achievement-icon">${unlocked ? '✦' : hidden ? '?' : '·'}</div><div><b>${hidden ? 'A hidden fate' : def.name}</b><small>${unlocked ? `Unlocked · ${rewardsText(def.reward)}` : hidden ? 'Continue walking. Some fates reveal themselves only once.' : def.desc}<br><span class="reward">${hidden ? '' : rewardsText(def.reward)}</span></small></div></div>`;
      }).join('');
      body = `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE WHEEL OF DEEDS · ${Object.keys(state.achievements).length} / ${achievementDefs.length}</div><h2>Achievements</h2><p>Every deed leaves a mark. Achievements grant permanent resources and cannot be earned twice.</p><div class="achievement-grid">${cards}</div></article></div><aside class="subview-aside"><article class="feature-card"><div class="eyebrow">HIDDEN FATES</div><h3>${state.hiddenFound.length} hidden deeds found</h3><p>Some achievements are not listed until they happen. High luck, old mercy and forgotten chests may reveal them.</p><div class="feature-stats"><span>UNLOCKED <b>${Object.keys(state.achievements).length}</b></span><span>HIDDEN <b>${state.hiddenFound.length}</b></span></div></article></aside></div>`;
    } else if (tab === 'quests') {
      const active = state.quests?.active;
      const activeHtml = active ? (() => {
        const done = questDone(active);
        return `<article class="quest-card"><div class="npc">${active.npc}</div><h3>${active.name}</h3><p>${active.desc}</p><div class="quest-progress"><span>${Math.min(questObjective(active), active.target)} / ${active.target}</span><span>${rewardsText(active.reward)}</span></div>${progressLine(Math.min(questObjective(active), active.target), active.target)}<button class="action-btn" data-action="claim-quest" ${done ? '' : 'disabled'}>${done ? 'Claim reward' : 'Quest in progress'}</button></article>`;
      })() : '<p class="small-note">No active story quest. Speak to a wanderer below.</p>';
      const available = storyQuests.filter(q => state.stage >= q.req && !state.quests.completed.includes(q.id) && !state.quests.active);
      const availableHtml = available.map(q => `<article class="quest-card"><div class="npc">${q.npc} · REQUIRES STAGE ${q.req}</div><h3>${q.name}</h3><p>${q.desc}</p><div class="quest-progress"><span>Reward</span><span>${rewardsText(q.reward)}</span></div><button class="action-btn" data-action="accept-quest" data-id="${q.id}">Accept quest</button></article>`).join('');
      const completed = storyQuests.filter(q => state.quests.completed.includes(q.id));
      const completedHtml = completed.map(q => `<div class="inventory-row"><span>${q.name}</span><b>Completed · ${q.npc}</b></div>`).join('');
      body = `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE STORY SO FAR</div><h2>Active quest</h2>${activeHtml}</article>
        <article class="content-panel"><div class="eyebrow">PEOPLE WITH NEEDS</div><h2>Available quests</h2>${availableHtml || '<p class="small-note">No new stories at your current stage.</p>'}</article>
        <article class="content-panel"><div class="eyebrow">THE BOOK OF DEBTS</div><h2>Completed quests</h2>${completedHtml || '<p class="small-note">Nothing finished yet.</p>'}</article></div>
        <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">STORY LEDGER</div><h3>${state.quests.completed.length} stories settled</h3><p>Quests progress through the actions they describe: gather herbs, defeat beasts, brew pills, follow maps or clear realms.</p><div class="feature-stats"><span>ACTIVE <b>1</b></span><span>COMPLETED <b>${state.quests.completed.length}</b></span><span>MERCY <b>${state.story?.mercy || 0}</b></span></div></article></aside></div>`;
    } else if (tab === 'records') {
      const rows = [
        ['Beasts defeated', state.stats.kills || 0], ['World bosses felled', state.stats.bosses || 0], ['Secret realms cleared', state.stats.realms || 0],
        ['Elixirs brewed', state.stats.brews || 0], ['Expeditions completed', state.stats.trips || 0], ['Beasts tamed', state.stats.tames || 0],
        ['Dao comprehensions', state.stats.dao || 0], ['Critical strikes', state.stats.crit || 0], ['Treasure caches opened', state.stats.chests || 0],
        ['Tribulations faced', state.stats.tribulations || 0], ['Inheritances completed', state.inheritance.completed.length], ['Roots discovered', state.root.discovered.length],
        ['Meridians opened', openedMeridians()], ['Dao mastery levels', totalMastery()], ['Reincarnations', state.rebirth.count || 0]
      ].map(([label, value]) => `<div class="inventory-row"><span>${label}</span><b>${nfmt(value)}</b></div>`).join('');
      const build = sectBuildings.map(b => `<div class="inventory-row"><span>${b.name}</span><b>Level ${buildingLevel(b.id)}</b></div>`).join('');
      body = `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE IMMORTAL RECORD</div><h2>Deeds and statistics</h2>${rows}</article><article class="content-panel"><div class="eyebrow">SECT CONSTRUCTION</div><h2>Halls raised</h2>${build}</article></div>
        <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">THE LONG VIEW</div><h3>Day ${dayIndex()} of the journey</h3><p>Progress is saved automatically. Every realm, root and hidden path remains in the record.</p><div class="feature-stats"><span>WORLD <b>${worldName()}</b></span><span>DAY <b>${dayIndex()}</b></span><span>BEASTS <b>${Object.keys(state.taming.beasts).length}</b></span></div></article></aside></div>`;
    } else {
      const rows = realmBands.map((band, i) => {
        const unlocked = state.stage >= band.start;
        const current = state.stage >= band.start && (i === realmBands.length - 1 || state.stage < realmBands[i + 1].start);
        return `<div class="codex-realm ${unlocked ? 'unlocked' : ''}"><div class="codex-node">${unlocked ? '✦' : '·'}</div><div><h3>${band.name} ${band.cn}</h3><p>Stage ${band.start}${band.end === Infinity ? ' and beyond' : `–${band.end}`} · ${band.start <= 1 ? 'The first breath' : `Threshold ${nfmt(requirement(band.start))} qi`}</p></div><small>${current ? 'CURRENT REALM' : unlocked ? 'PASSED' : 'UNDISCOVERED'}</small></div>`;
      }).join('');
      body = `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE IMMORTAL LADDER · ${realmTitle()}</div><h2>Realms of cultivation</h2><p>The ladder has no final rung. Major realms are guarded by heavenly tribulations, and each threshold grants meridian points, Dao insight and keys.</p><div class="codex-list">${rows}</div></article></div>
        <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">CODEX OF THE SELF</div><h3>${worldName()}</h3><p>Your root, Dao, meridians and companions all appear in the other pages of this codex. Some knowledge is earned only by living.</p><div class="feature-stats"><span>STAGE <b>${state.stage}</b></span><span>QI <b>${nfmt(state.qi)}</b></span><span>BREAKTHROUGH <b>${breakChance()}%</b></span></div></article>
        <article class="content-panel"><div class="eyebrow">THE NEXT THRESHOLD</div><h2>${realmTitle(state.stage + 1)}</h2><p>${nfmt(requirement())} qi are required. ${isMajor(state.stage + 1) ? 'A heavenly tribulation waits at this gate.' : 'The road ahead is quiet, for now.'}</p><button class="action-btn" data-action="close-modal" style="display:none"></button></article></aside></div>`;
    }
    $('view-codex').innerHTML = `${subHead('THE IMMORTAL CODEX', 'Codex', 'Realms, achievements, story quests and the record of your long road.', '▤')}
      ${tabs('codex', [['realms', 'Realms'], ['achievements', 'Achievements'], ['quests', 'Story quests'], ['records', 'Records']])}${body}`;
  }

  /* ---------------- MODALS & VISUAL EFFECTS ---------------- */
  function openModal(symbol, eyebrow, title, text, actions) {
    $('modalSymbol').textContent = symbol || '✧';
    $('modalEyebrow').textContent = eyebrow || 'THE PATH CONTINUES';
    $('modalTitle').textContent = title || '';
    $('modalText').innerHTML = text || '';
    $('modalActions').innerHTML = actions || '<button class="primary-btn" data-action="close-modal">Continue</button>';
    $('modalBackdrop').hidden = false;
  }
  function closeModal() { $('modalBackdrop').hidden = true; }
  function tribulationEffect(success, label) {
    const el = document.createElement('div');
    el.className = 'tribulation' + (success ? '' : ' fail');
    el.innerHTML = `<div class="bolt"></div><div class="bolt two"></div><div class="bolt three"></div><div class="trib-text">${label || (success ? 'TRIBULATION ENDURED' : 'THE HEAVENS REFUSE')}</div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  /* ---------------- ROOTS ---------------- */
  function rollRootType() {
    const luck = luckFor();
    const weighted = rootTypes.map(r => {
      const factor = r.rarity === 'Divine' ? 1 + luck * .1 : r.rarity === 'Heavenly' ? 1 + luck * .07 : r.rarity === 'Rare' ? 1 + luck * .025 : 1;
      return { root: r, weight: r.weight * factor };
    });
    const total = weighted.reduce((a, b) => a + b.weight, 0);
    let roll = Math.random() * total;
    for (const entry of weighted) { roll -= entry.weight; if (roll <= 0) return entry.root; }
    return rootTypes[0];
  }
  function awakenRoot() {
    if (state.root.type) return showToast('Your spiritual root is already awake.');
    if (state.stage < 1 || state.qi < 120 || state.stones < 60) return showToast('The ritual requires stage 1, 120 qi and 60 spirit stones.');
    const root = rollRootType();
    state.qi -= 120; state.stones -= 60;
    state.root.type = root.id; state.root.grade = 0; state.root.essence = (state.root.essence || 0) + 1;
    if (!state.root.discovered.includes(root.id)) state.root.discovered.push(root.id);
    state.root.rerolls = state.root.rerolls || 0;
    save();
    openModal(root.seal, 'THE AWAKENING RITUAL', root.name, `${root.desc}<br><br><b>${root.rarity} root · ${root.ability}</b><br>${bonusText(root.bonus)}`, '<button class="primary-btn" data-action="close-modal">Accept the root</button>');
    render();
  }
  function rerollRoot() {
    if (!state.root.type) return showToast('Awaken a root before seeking another.');
    const qiCost = 80 + (state.root.rerolls || 0) * 30;
    const stoneCost = 40 + (state.root.rerolls || 0) * 15;
    if (state.qi < qiCost || state.stones < stoneCost) return showToast(`Seeking a new root costs ${nfmt(qiCost)} qi and ${stoneCost} stones.`);
    const root = rollRootType();
    state.qi -= qiCost; state.stones -= stoneCost;
    state.root.type = root.id; state.root.grade = 0; state.root.rerolls = (state.root.rerolls || 0) + 1;
    if (!state.root.discovered.includes(root.id)) state.root.discovered.push(root.id);
    save();
    openModal(root.seal, 'ROOT REBORN', root.name, `${root.desc}<br><br><b>${root.rarity} root · ${root.ability}</b>`, '<button class="primary-btn" data-action="close-modal">Continue</button>');
    render();
  }
  function upgradeRoot() {
    if (!state.root.type) return showToast('Awaken a spiritual root first.');
    const grade = state.root.grade || 0;
    if (grade >= 4) return showToast('Your root already shines at Divine grade.');
    const cost = 8 + grade * 6 + state.stage;
    if ((state.root.essence || 0) < cost) return showToast(`You need ${cost} root essence.`);
    state.root.essence -= cost; state.root.grade = grade + 1;
    showToast(`Root raised to ${ROOT_GRADES[state.root.grade]} grade · all root bonuses ×${rootMul().toFixed(2)}.`);
    save(); render();
  }

  /* ---------------- BREAKTHROUGH ---------------- */
  function openBreakthrough() {
    const chance = breakChance(), goal = requirement();
    openModal('破', 'REALM BREAKTHROUGH', 'The threshold awaits',
      `Your meridians brim with qi. Step into <b>${realmTitle(state.stage + 1)}</b>?<br><br>Required qi: ${nfmt(goal)} · Success chance: <b>${chance}%</b>${isMajor(state.stage + 1) ? '<br><span class="gold-text">A heavenly tribulation guards this gate.</span>' : ''}<br><br>A failure scatters some gathered qi, but your foundation remains.`,
      '<button class="secondary-btn" data-action="close-modal">Not yet</button><button class="primary-btn" data-action="attempt-break">Face the tribulation</button>');
  }
  function attemptBreak() {
    closeModal();
    const chance = breakChance(), major = isMajor(state.stage + 1), goal = requirement();
    state.stats.tribulations = (state.stats.tribulations || 0) + 1;
    if (Math.random() * 100 < chance) {
      state.qi = Math.max(0, state.qi - goal);
      state.stage += 1;
      state.breakBuff = 0;
      state.meridians.points = (state.meridians.points || 0) + (major ? 2 : 1);
      if (major) {
        state.daoPoints = (state.daoPoints || 0) + 1;
        state.root.essence = (state.root.essence || 0) + 1 + Math.floor(state.stage / 12);
        state.realms.keys = (state.realms.keys || 0) + 1;
        tribulationEffect(true, 'TRIBULATION ENDURED');
      }
      const reward = 12 + Math.floor(state.stage / 2) * 3;
      state.stones += reward;
      state.hp = state.maxHp;
      showToast(`Breakthrough · ${realmTitle()} · +${major ? 2 : 1} meridian point${major ? 's' : ''}${major ? ' · +1 dao insight · +1 realm key' : ''}`);
      save(); render();
      if (state.stage === 25) {
        openModal('仙', 'THE IMMORTAL GATE', 'You have touched eternity', 'The mortal world falls away. Yet even an immortal knows there are always higher skies to seek. Ascension now waits in the wheel of lives.', '<button class="primary-btn" data-action="close-modal">Continue the journey</button>');
      }
    } else {
      state.qi *= .8; state.breakBuff = 0;
      tribulationEffect(false);
      showToast('The tribulation resists. Your qi scatters, but your resolve remains.');
      save(); render();
    }
  }

  /* ---------------- MERIDIANS & DAO ---------------- */
  function openMeridian(id) {
    const m = meridianList.find(x => x.id === id); if (!m) return;
    const block = meridianBlock(m);
    if (block) return showToast(block);
    state.meridians.points -= m.points; state.stones -= m.stones; state.qi -= m.qi;
    state.meridians.opened[id] = true;
    const count = openedMeridians();
    showToast(`${m.name} opened · ${bonusText(m.bonus)}${count % 4 === 0 ? ` · circulation bonus at ${count} meridians!` : ''}`);
    save(); render();
  }
  function comprehendDao(id) {
    const d = daoPaths.find(x => x.id === id); if (!d) return;
    const lv = daoLevel(id);
    if (lv >= 10) return showToast(`${d.name} is already mastered.`);
    const qiCost = 80 + lv * 45, stoneCost = 8 + lv * 6;
    if (state.qi < qiCost || state.stones < stoneCost) return showToast(`Comprehension costs ${nfmt(qiCost)} qi and ${stoneCost} spirit stones.`);
    state.qi -= qiCost; state.stones -= stoneCost;
    state.dao[id].xp = (state.dao[id].xp || 0) + Math.round(45 * daoGainMult(id));
    state.stats.dao = (state.stats.dao || 0) + 1;
    dailyStep('dao'); missionStep('dao');
    const after = daoLevel(id);
    showToast(after > lv ? `${d.name} advanced to level ${after} · ${masteryName(after)}!` : `Insight gathered · ${d.name} level ${lv}.`);
    save(); render();
  }
  function infuseDao(id) {
    const d = daoPaths.find(x => x.id === id); if (!d) return;
    if (state.daoPoints <= 0 || daoLevel(id) >= 10) return;
    state.daoPoints -= 1;
    state.dao[id].xp = (state.dao[id].xp || 0) + Math.round(60 * daoGainMult(id));
    showToast(`Dao insight infused into ${d.name} · level ${daoLevel(id)}.`);
    save(); render();
  }

  /* ---------------- COMBAT ---------------- */
  function currentSpell() { return sectSpells[state.sectId] || sectSpells.azure; }
  function calculateHit(base, s = state) {
    let damage = Math.max(1, Math.round(base * (0.88 + Math.random() * 0.24)));
    let crit = false;
    if (Math.random() < critChance(s)) {
      const swordHeart = daoLevel('sword', s) >= 3 ? .25 : 0;
      const heavenEdge = equippedWeapon(s)?.id === 'heavensedge' && equippedWeapon(s)?.awakened ? .35 : 0;
      damage = Math.round(damage * (1.5 + swordHeart + heavenEdge));
      crit = true;
      state.stats.crit = (state.stats.crit || 0) + 1;
      if (daoLevel('lightning', s) >= 3) state.qi = Math.min(state.qi + 4, state.qi + 4);
    }
    if (daoLevel('fire', s) >= 3 && Math.random() < .2) damage = Math.round(damage * 1.25);
    const weapon = equippedWeapon(s);
    if (weapon?.id === 'emberfang' && weapon.awakened && Math.random() < .25) damage = Math.round(damage * 1.35);
    const strike = companionStrike();
    if (strike > 0) damage += strike;
    return { damage, crit };
  }
  function seekEnemy() {
    if (state.enemy) return;
    const sameSect = enemyKinds.filter(e => e.sect === state.sectId && e.req <= Math.max(1, state.stage + 1));
    const pool = sameSect.length ? sameSect : enemyKinds.filter(e => e.req <= Math.max(1, state.stage + 1));
    const template = pick(pool.length ? pool : enemyKinds.slice(0, 1));
    const scale = 1 + state.stage * .12 + (state.wins || 0) * .025;
    const elite = Math.random() < .12 + luckFor() * .003;
    const maxHp = Math.round(template.hp * scale * (elite ? 1.45 : 1));
    state.enemy = { ...template, hp: maxHp, maxHp, damage: Math.max(2, Math.round(template.damage * scale * (elite ? 1.25 : 1))), stones: Math.round(template.stones * scale * (elite ? 1.6 : 1)), level: state.stage + 1, elite, weaken: false };
    showToast(elite ? `An elite ${template.name} emerges from the mist!` : `${template.name} emerges from the mist!`);
    save(); render();
  }
  function damageEnemy(base, source) {
    if (!state.enemy) return;
    const enemy = state.enemy;
    const hit = calculateHit(base);
    enemy.hp -= hit.damage;
    if (enemy.hp <= 0) {
      const drop = enemy.drop;
      state.enemy = null; state.wins = (state.wins || 0) + 1;
      state.stats.kills = (state.stats.kills || 0) + 1;
      state.stones += enemy.stones;
      addRep(enemy.rep);
      if (drop && state.herbs[drop] !== undefined) state.herbs[drop] += 1 + Math.floor(luckFor() / 20);
      dailyStep('kill'); missionStep('kill'); questStep('kill');
      const luck = luckFor();
      if (Math.random() * 100 < 4 + luck * .5) { addEgg(luck > 18 ? 'rare' : 'common'); showToast('A mystic egg was found among the remains.'); }
      if (Math.random() * 100 < 3 + luck * .35) { state.fate.maps = (state.fate.maps || 0) + 1; showToast('A treasure map flutters free of the beast.'); }
      if (Math.random() * 100 < 1 + luck * .12) { state.realms.keys = (state.realms.keys || 0) + 1; showToast('A secret realm key glints in the dust.'); }
      showToast(`${enemy.name} defeated · +${nfmt(enemy.stones)} stones · +${enemy.rep} merit${hit.crit ? ' · Critical strike!' : ''}`);
      save(); render();
      return;
    }
    const evaded = (daoLevel('space') >= 3 && Math.random() < .15) || (equippedWeapon()?.id === 'mistfang' && equippedWeapon()?.awakened && Math.random() < .1);
    if (evaded) {
      showToast(`${source} dealt ${hit.damage}${hit.crit ? ' critical' : ''} damage · you evaded the retaliation.`);
    } else {
      let taken = Math.max(1, enemy.damage - guardFor() - Math.floor(state.pathLevels.body / 2));
      if (enemy.weaken) { taken = Math.max(1, Math.floor(taken * .6)); enemy.weaken = false; }
      state.hp = Math.max(0, state.hp - taken);
      if (state.hp <= 0) {
        state.enemy = null;
        state.hp = Math.max(1, Math.floor(state.maxHp * .35));
        showToast(`You were overcome and carried to safety · restored to ${state.hp} health.`);
        save(); render();
        return;
      }
      showToast(`${source} dealt ${hit.damage}${hit.crit ? ' critical' : ''} damage · suffered ${taken} in return.`);
    }
    save(); render();
  }
  function attackEnemy(style) {
    if (!state.enemy) return;
    let base;
    if (style === 'spirit') {
      if (state.qi < 8) return showToast('You need 8 qi to form a spirit art.');
      state.qi -= 8;
      base = attackDamage(6 + state.pathLevels.spirit * 5 + state.stage + Math.random() * (7 + state.pathLevels.spirit));
      damageEnemy(base, 'Your spirit art');
    } else {
      base = attackDamage(3 + state.pathLevels.body * 4 + state.stage + Math.random() * (5 + state.pathLevels.body));
      damageEnemy(base, 'Your body strike');
    }
  }
  function castSectSpell() {
    if (!state.enemy) return;
    const spell = currentSpell();
    if (state.qi < spell.cost) return showToast(`You need ${spell.cost} qi to cast ${spell.name}.`);
    state.qi -= spell.cost;
    if (spell.heal) state.hp = Math.min(state.maxHp, state.hp + spell.heal);
    damageEnemy(attackDamage(spell.damage + state.pathLevels.spirit * 4 + state.stage), spell.name);
  }
  function useArt(id) {
    if (!state.enemy) return;
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (state.qi < art.qi) return showToast(`You need ${art.qi} qi for ${art.name}.`);
    state.qi -= art.qi;
    if (art.effect === 'heal') state.hp = Math.min(state.maxHp, state.hp + (art.heal || 20));
    if (art.effect === 'crit') state.breakBuff = (state.breakBuff || 0) + 3;
    damageEnemy(attackDamage(art.damage + state.pathLevels.spirit * 4 + state.stage), art.name);
  }
  function flee() { state.enemy = null; showToast('You retreat safely from the encounter.'); save(); render(); }

  /* ---------------- WORLD BOSSES ---------------- */
  function challengeBoss(id) {
    if (state.world.active) return showToast('A world boss battle is already underway.');
    const def = worldBosses.find(b => b.id === id); if (!def) return;
    if (state.world.tier < def.tier) return showToast('This boss is still sealed.');
    if (state.stage < def.req) return showToast(`You must reach stage ${def.req}.`);
    state.world.active = { id, hp: def.hp, maxHp: def.hp, log: [`${def.name} rises from its ancient seal.`], turn: 0, weaken: false };
    save(); render();
  }
  function bossAttack(style) {
    const active = state.world.active; if (!active) return;
    const def = worldBosses.find(b => b.id === active.id); if (!def) return;
    let base;
    if (style === 'spirit') {
      if (state.qi < 10) return showToast('You need 10 qi for a spirit art.');
      state.qi -= 10;
      base = attackDamage(8 + state.pathLevels.spirit * 5 + state.stage + Math.random() * (8 + state.pathLevels.spirit));
    } else base = attackDamage(4 + state.pathLevels.body * 4 + state.stage + Math.random() * (6 + state.pathLevels.body));
    damageBoss(base, style === 'spirit' ? 'Your spirit art' : 'Your body strike');
  }
  function bossSpell() {
    const active = state.world.active; if (!active) return;
    const spell = currentSpell();
    if (state.qi < spell.cost) return showToast(`You need ${spell.cost} qi to cast ${spell.name}.`);
    state.qi -= spell.cost;
    if (spell.heal) state.hp = Math.min(state.maxHp, state.hp + spell.heal);
    damageBoss(attackDamage(spell.damage + state.pathLevels.spirit * 4 + state.stage), spell.name);
  }
  function bossArt(id) {
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (state.qi < art.qi) return showToast(`You need ${art.qi} qi for ${art.name}.`);
    state.qi -= art.qi;
    if (art.effect === 'heal') state.hp = Math.min(state.maxHp, state.hp + (art.heal || 20));
    damageBoss(attackDamage(art.damage + state.pathLevels.spirit * 4 + state.stage), art.name);
  }
  function damageBoss(base, source) {
    const active = state.world.active; if (!active) return;
    const def = worldBosses.find(b => b.id === active.id); if (!def) return;
    const hit = calculateHit(base);
    active.hp -= hit.damage;
    active.log.push(`${source} strikes for ${hit.damage}${hit.crit ? ' critical' : ''}.`);
    if (active.hp <= 0) { defeatWorldBoss(def, active); return; }
    active.turn = (active.turn || 0) + 1;
    if (def.type === 'regen') { const heal = Math.round(active.maxHp * .06); active.hp = Math.min(active.maxHp, active.hp + heal); active.log.push(`${def.name} regenerates ${heal} health.`); }
    if (def.type === 'drain') { const drain = Math.min(state.qi, 10); state.qi -= drain; active.log.push(`${def.name} devours ${drain} of your qi.`); }
    const evaded = (daoLevel('space') >= 3 && Math.random() < .15) || (equippedWeapon()?.id === 'mistfang' && equippedWeapon()?.awakened && Math.random() < .1);
    if (evaded) { active.log.push('You fold space and evade the retaliation.'); }
    else {
      let damage = Math.round(def.damage * (0.9 + Math.random() * .2));
      if (def.type === 'burn') damage += 7;
      if (def.type === 'storm' && active.turn % 3 === 0) { damage = Math.round(damage * 1.5); active.log.push('A tribulation wave crashes over you!'); }
      if (def.type !== 'pierce') damage = Math.max(1, damage - guardFor());
      active.hp = Math.max(0, active.hp);
      state.hp = Math.max(0, state.hp - Math.max(1, damage));
      active.log.push(`${def.name} retaliates for ${Math.max(1, damage)}.`);
      if (state.hp <= 0) {
        state.world.active = null;
        state.hp = Math.max(1, Math.floor(state.maxHp * .35));
        showToast('The world boss overwhelms you. You are carried back to the sect, alive but humbled.');
        save(); render(); return;
      }
    }
    save(); render();
  }
  function defeatWorldBoss(def, active) {
    state.world.active = null;
    state.world.defeated[def.id] = (state.world.defeated[def.id] || 0) + 1;
    state.world.tier = Math.max(state.world.tier || 1, def.tier + 1);
    state.stats.bosses = (state.stats.bosses || 0) + 1;
    state.stones += def.stones;
    state.sectTokens += def.tokens;
    addRep(def.merit);
    Object.entries(def.drops).forEach(([k, v]) => { if (state.herbs[k] !== undefined) state.herbs[k] += v; });
    if (def.artifact && !state.inheritance.artifacts.includes(def.artifact)) { grantArtifact(def.artifact); }
    dailyStep('wboss'); missionStep('boss');
    const artName = def.artifact ? artifactCatalog.find(a => a.id === def.artifact)?.name : null;
    save(); render();
    openModal(def.seal, 'WORLD BOSS FELLED', def.name, `The ancient power falls silent.<br><br>+${nfmt(def.stones)} spirit stones · +${def.tokens} sect tokens · +${def.merit} merit${artName ? `<br><b>Artifact claimed · ${artName}</b>` : ''}<br><br>${worldBosses.find(b => b.tier === def.tier + 1) ? 'A deeper seal has broken.' : 'No deeper seal remains.'}`, '<button class="primary-btn" data-action="close-modal">Stand victorious</button>');
  }
  function bossRetreat() {
    if (!state.world.active) return;
    state.world.active = null;
    showToast('You withdraw from the world boss. The seal remains.');
    save(); render();
  }

  /* ---------------- SECRET REALMS ---------------- */
  function enterRealm(id) {
    if (state.realms.boss) return showToast('A secret realm is already open.');
    const realm = secretRealms.find(r => r.id === id); if (!realm) return;
    if (state.stage < realm.req) return showToast(`You must reach stage ${realm.req}.`);
    if (state.realms.keys < realm.keyCost) return showToast(`You need ${realm.keyCost} realm key${realm.keyCost > 1 ? 's' : ''}.`);
    if (state.qi < realm.qiCost) return showToast(`You need ${nfmt(realm.qiCost)} qi to force the door.`);
    state.realms.keys -= realm.keyCost; state.qi -= realm.qiCost;
    state.realms.boss = { id, hp: realm.boss.hp, maxHp: realm.boss.hp, log: [`${realm.name} opens. ${realm.boss.name} awakens.`], turn: 0, weaken: false };
    showToast(`${realm.name} opens · ${realm.boss.name} guards the way.`);
    save(); render();
  }
  function realmAttack(style) {
    const rb = state.realms.boss; if (!rb) return;
    let base;
    if (style === 'spirit') {
      if (state.qi < 10) return showToast('You need 10 qi for a spirit art.');
      state.qi -= 10;
      base = attackDamage(8 + state.pathLevels.spirit * 5 + state.stage + Math.random() * (8 + state.pathLevels.spirit));
    } else base = attackDamage(4 + state.pathLevels.body * 4 + state.stage + Math.random() * (6 + state.pathLevels.body));
    damageRealm(base, style === 'spirit' ? 'Your spirit art' : 'Your body strike');
  }
  function realmSpell() {
    const rb = state.realms.boss; if (!rb) return;
    const spell = currentSpell();
    if (state.qi < spell.cost) return showToast(`You need ${spell.cost} qi to cast ${spell.name}.`);
    state.qi -= spell.cost;
    if (spell.heal) state.hp = Math.min(state.maxHp, state.hp + spell.heal);
    damageRealm(attackDamage(spell.damage + state.pathLevels.spirit * 4 + state.stage), spell.name);
  }
  function realmArt(id) {
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (state.qi < art.qi) return showToast(`You need ${art.qi} qi for ${art.name}.`);
    state.qi -= art.qi;
    if (art.effect === 'heal') state.hp = Math.min(state.maxHp, state.hp + (art.heal || 20));
    damageRealm(attackDamage(art.damage + state.pathLevels.spirit * 4 + state.stage), art.name);
  }
  function damageRealm(base, source) {
    const rb = state.realms.boss; if (!rb) return;
    const realm = secretRealms.find(r => r.id === rb.id); if (!realm) return;
    const hit = calculateHit(base);
    rb.hp -= hit.damage;
    rb.log.push(`${source} strikes for ${hit.damage}${hit.crit ? ' critical' : ''}.`);
    if (rb.hp <= 0) { clearSecretRealm(realm, rb); return; }
    rb.turn = (rb.turn || 0) + 1;
    if (realm.boss.type === 'regen') { const heal = Math.round(rb.maxHp * .04); rb.hp = Math.min(rb.maxHp, rb.hp + heal); rb.log.push(`${realm.boss.name} regenerates ${heal} health.`); }
    if (realm.boss.type === 'drain') { const drain = Math.min(state.qi, 6); state.qi -= drain; rb.log.push(`${realm.boss.name} drains ${drain} qi.`); }
    const evaded = (daoLevel('space') >= 3 && Math.random() < .15) || (equippedWeapon()?.id === 'mistfang' && equippedWeapon()?.awakened && Math.random() < .1);
    if (evaded) rb.log.push('You slip between moments and evade the retaliation.');
    else {
      let damage = Math.round(realm.boss.damage * (0.9 + Math.random() * .2));
      if (realm.boss.type === 'burn') damage += 7;
      if (realm.boss.type === 'storm' && rb.turn % 3 === 0) { damage = Math.round(damage * 1.5); rb.log.push('The realm itself lashes out!'); }
      if (realm.boss.type !== 'pierce') damage = Math.max(1, damage - guardFor());
      state.hp = Math.max(0, state.hp - Math.max(1, damage));
      rb.log.push(`${realm.boss.name} retaliates for ${Math.max(1, damage)}.`);
      if (state.hp <= 0) {
        state.realms.boss = null;
        state.hp = Math.max(1, Math.floor(state.maxHp * .35));
        showToast('The realm spits you out. You survive, but the key is lost.');
        save(); render(); return;
      }
    }
    save(); render();
  }
  function clearSecretRealm(realm, rb) {
    const first = !(state.realms.cleared[realm.id] > 0);
    state.realms.cleared[realm.id] = (state.realms.cleared[realm.id] || 0) + 1;
    state.realms.boss = null;
    state.stats.realms = (state.stats.realms || 0) + 1;
    state.stones += realm.stones;
    Object.entries(realm.drops).forEach(([k, v]) => { if (state.herbs[k] !== undefined) state.herbs[k] += v + Math.floor(luckFor() / 12); });
    if (first) { state.root.essence = (state.root.essence || 0) + 2; state.daoPoints = (state.daoPoints || 0) + 1; state.realms.keys += 1; }
    dailyStep('realm'); missionStep('realm'); questStep('realm');
    save(); render();
    openModal(realm.seal, 'SECRET REALM CLEARED', realm.name, `${realm.boss.name} is defeated. The realm yields its hoard.<br><br>+${nfmt(realm.stones)} spirit stones · ${Object.entries(realm.drops).map(([k, v]) => `+${v} ${ingredients[k]?.name || k}`).join(' · ')}${first ? '<br><b>First clear · +2 root essence · +1 dao insight · +1 realm key</b>' : ''}`, '<button class="primary-btn" data-action="close-modal">Leave the realm</button>');
  }
  function retreatRealm() {
    if (!state.realms.boss) return;
    state.realms.boss = null;
    showToast('You withdraw from the secret realm. The door closes behind you.');
    save(); render();
  }

  /* ---------------- INHERITANCE ACTIONS ---------------- */
  function discoverInheritance(id) {
    const inc = inheritanceCatalog.find(x => x.id === id); if (!inc) return;
    if (state.inheritance.discovered.includes(id)) return;
    if (state.stage < inc.req) return showToast(`You must reach stage ${inc.req}.`);
    if (!canPay(inc.cost)) return showToast(`You need ${costText(inc.cost)}.`);
    payCost(inc.cost);
    state.inheritance.discovered.push(id);
    state.inheritance.points = (state.inheritance.points || 0) + 1;
    showToast(`${inc.name} discovered · its trials now await you.`);
    save(); render();
  }
  function attemptTrial(id, index) {
    const inc = inheritanceCatalog.find(x => x.id === id); if (!inc || !state.inheritance.discovered.includes(id)) return;
    const trial = inc.trials[index]; if (!trial) return;
    if (!state.inheritance.trials[id]) state.inheritance.trials[id] = {};
    if (state.inheritance.trials[id][index]) return;
    if (!safeCheck(trial)) return showToast('The trial does not yet recognize you.');
    state.inheritance.trials[id][index] = true;
    state.inheritance.points = (state.inheritance.points || 0) + 2;
    applyReward(trial.reward);
    const done = inc.trials.every((_, i) => state.inheritance.trials[id][i]);
    if (done && !state.inheritance.completed.includes(id)) {
      state.inheritance.completed.push(id);
      grantArtifact(inc.artifact);
      if (inc.art && !state.activeArts.includes(inc.art)) state.activeArts.push(inc.art);
      state.daoPoints = (state.daoPoints || 0) + 1;
      state.root.essence = (state.root.essence || 0) + 2;
      showToast(`Inheritance complete · ${inc.name} · artifact claimed.`);
      save(); render();
      openModal(inc.seal, 'AN INHERITANCE CLAIMED', inc.name, `All three trials are passed. The legacy acknowledges you.<br><br><b>${artifactCatalog.find(a => a.id === inc.artifact)?.name}</b><br>${inc.bonus}${inc.art ? `<br>A forgotten art is now yours · ${martialArts.find(a => a.id === inc.art)?.name}` : ''}`, '<button class="primary-btn" data-action="close-modal">Accept the legacy</button>');
      return;
    }
    showToast(`Trial passed · ${trial.name}.`);
    save(); render();
  }

  /* ---------------- FORGE ACTIONS ---------------- */
  function forgeWeapon(id) {
    const w = weaponCatalog.find(x => x.id === id); if (!w) return;
    if (state.forge.weapons[id]?.owned) return;
    if (state.stage < w.req) return showToast(`You must reach stage ${w.req}.`);
    if (!canPay(w.cost)) return showToast(`You need ${costText(w.cost)}.`);
    payCost(w.cost);
    state.forge.weapons[id] = { owned: true, refine: 0, awakened: false };
    if (!state.forge.equippedWeapon) state.forge.equippedWeapon = id;
    showToast(`${w.name} forged${state.forge.equippedWeapon === id ? ' and equipped' : ''}.`);
    save(); render();
  }
  function equipWeapon(id) {
    if (!state.forge.weapons[id]?.owned) return;
    state.forge.equippedWeapon = id;
    showToast('A new weapon is ready in your hand.'); save(); render();
  }
  function refineWeapon(id) {
    const w = weaponCatalog.find(x => x.id === id), owned = state.forge.weapons[id];
    if (!w || !owned || owned.refine >= 10) return;
    const cost = { stones: Math.round(160 * Math.pow(1.45, owned.refine)), ore: 2 + owned.refine };
    if (!canPay(cost)) return showToast(`Refinement needs ${costText(cost)}.`);
    payCost(cost); owned.refine += 1;
    showToast(`${w.name} refined to ${owned.refine}/10.`);
    save(); render();
  }
  function awakenWeapon(id) {
    const w = weaponCatalog.find(x => x.id === id), owned = state.forge.weapons[id];
    if (!w || !owned || owned.awakened) return;
    if (owned.refine < 10) return showToast('The weapon must be refined to 10 first.');
    if (state.stones < 500 || (state.herbs.relic || 0) < 1 || (state.herbs.beastCore || 0) < 1) return showToast('Awakening needs ◇ 500, 1 ancient relic and 1 beast core.');
    state.stones -= 500; state.herbs.relic -= 1; state.herbs.beastCore -= 1;
    owned.awakened = true;
    showToast(`${w.name} awakens · ${w.ability}`);
    save(); render();
  }
  function equipArtifact(id, slot) {
    if (!state.inheritance.artifacts.includes(id)) return;
    slot = Number(slot) === 1 ? 1 : 0;
    const slots = state.forge.equippedArtifacts;
    const existing = slots.indexOf(id);
    if (existing >= 0) slots[existing] = null;
    slots[slot] = id;
    showToast(`${artifactCatalog.find(a => a.id === id)?.name} equipped in slot ${slot + 1}.`);
    save(); render();
  }
  function unequipArtifact(slot) {
    state.forge.equippedArtifacts[Number(slot)] = null;
    save(); render();
  }

  /* ---------------- TAMING ACTIONS ---------------- */
  function tameBeast(id) {
    const def = beastDef(id); if (!def || !def.tameable) return;
    if (state.taming.beasts[id]) return;
    if (state.stage < def.req) return showToast(`You must reach stage ${def.req}.`);
    const qiCost = 40 + def.cost, stoneCost = def.cost;
    if (state.qi < qiCost || state.stones < stoneCost) return showToast(`Taming requires ${nfmt(qiCost)} qi and ◇ ${stoneCost}.`);
    state.qi -= qiCost; state.stones -= stoneCost;
    const chance = tameChance(def);
    if (Math.random() * 100 < chance) {
      state.taming.beasts[id] = { level: 1, xp: 0, bond: 1 };
      if (!state.taming.active) state.taming.active = id;
      state.stats.tames = (state.stats.tames || 0) + 1;
      dailyStep('tame');
      showToast(`${def.name} bows its head · a bond is formed.`);
    } else showToast(`${def.name} resists and vanishes into the wild.`);
    save(); render();
  }
  function setBeast(id) {
    if (!state.taming.beasts[id]) return;
    state.taming.active = id;
    save(); render();
  }
  function trainBeast(id) {
    const def = beastDef(id), data = state.taming.beasts[id];
    if (!def || !data) return;
    if (data.level >= 10) return showToast('This companion has reached its limit.');
    const cost = 20 * (data.level + 1);
    if (state.taming.food < 1 || state.stones < cost) return showToast(`Training needs 1 beast food and ◇ ${cost}.`);
    state.taming.food -= 1; state.stones -= cost;
    data.xp = (data.xp || 0) + 30 + Math.floor(luckFor() / 2);
    data.bond = (data.bond || 0) + 1;
    if (data.xp >= 100) { data.xp -= 100; data.level += 1; showToast(`${def.name} reached level ${data.level}.`); }
    else showToast(`${def.name} trained · bond ${data.bond}.`);
    save(); render();
  }
  function evolveBeast(id) {
    const def = beastDef(id), data = state.taming.beasts[id];
    if (!def || !data || !def.evolve) return;
    if (data.level < 5) return showToast('The beast must reach level 5.');
    if (state.taming.food < 2 || state.stones < 150) return showToast('Evolution needs 2 food and ◇ 150.');
    const evolved = beastDef(def.evolve); if (!evolved) return;
    state.taming.food -= 2; state.stones -= 150;
    delete state.taming.beasts[id];
    state.taming.beasts[evolved.id] = { level: Math.max(1, data.level - 4), xp: 0, bond: (data.bond || 0) + 1 };
    if (state.taming.active === id) state.taming.active = evolved.id;
    showToast(`${def.name} evolved into ${evolved.name}!`);
    save(); render();
  }
  function hatchEgg(rarity) {
    if ((state.taming.eggs[rarity] || 0) <= 0) return;
    if (state.taming.food < 1 || state.qi < 60) return showToast('Hatching needs 60 qi and 1 beast food.');
    state.taming.eggs[rarity] -= 1; state.taming.food -= 1; state.qi -= 60;
    const pool = beastCatalog.filter(b => b.tameable && b.rarity.toLowerCase() === String(rarity).toLowerCase());
    const def = pick(pool.length ? pool : beastCatalog.filter(b => b.tameable));
    if (!state.taming.beasts[def.id]) state.taming.beasts[def.id] = { level: 1, xp: 0, bond: 1 };
    else state.taming.beasts[def.id].level += 1;
    if (!state.taming.active) state.taming.active = def.id;
    state.stats.tames = (state.stats.tames || 0) + 1;
    dailyStep('tame');
    showToast(`The egg cracks · ${def.name} is born.`);
    save(); render();
  }

  /* ---------------- QUESTS, MISSIONS & DAILY ---------------- */
  function acceptQuest(id) {
    const q = storyQuests.find(x => x.id === id); if (!q) return;
    if (state.quests.active) return showToast('Finish your current story quest first.');
    if (state.stage < q.req || state.quests.completed.includes(id)) return;
    state.quests.active = { ...q };
    state.quests.progress[id] = state.quests.progress[id] || 0;
    showToast(`Quest accepted · ${q.name}.`);
    save(); render();
  }
  function claimQuest() {
    const q = state.quests.active; if (!q) return;
    if (!questDone(q)) return showToast('The quest is not yet complete.');
    if (q.type === 'gather' && state.herbs[q.key] !== undefined) state.herbs[q.key] = Math.max(0, state.herbs[q.key] - q.target);
    applyReward(q.reward);
    if (!state.quests.completed.includes(q.id)) state.quests.completed.push(q.id);
    state.quests.active = null;
    showToast(`Quest complete · ${q.name} · ${rewardsText(q.reward)}.`);
    save(); render();
  }
  function claimDailyTask(id) {
    const task = state.daily.list.find(t => t.id === id); if (!task || task.claimed) return;
    if ((task.progress || 0) < task.target) return showToast('The challenge is not yet complete.');
    task.claimed = true;
    applyReward(task.reward);
    showToast(`Daily challenge complete · ${rewardsText(task.reward)}.`);
    save(); render();
  }
  function claimDailyPractice() {
    const ready = state.medSeconds >= 30 && state.qiToday >= 100 && (state.tripToday || 0) > 0;
    if (state.dailyClaimed || !ready) return;
    state.dailyClaimed = true;
    state.stones += 35;
    state.sectTokens += 3;
    showToast('Daily practice complete · +35 spirit stones · +3 sect tokens.');
    save(); render();
  }

  /* ---------------- FATE ACTIONS ---------------- */
  function spawnFate() {
    const lastLog = state.fate.log?.[0] || '';
    const pool = fateEvents.filter(f => !lastLog.includes(f.title));
    const total = pool.reduce((a, f) => a + f.weight, 0);
    let roll = Math.random() * total;
    let chosen = pool[0];
    for (const f of pool) { roll -= f.weight; if (roll <= 0) { chosen = f; break; } }
    state.fate.pending = { id: chosen.id, at: Date.now() };
    state.fate.encounters = (state.fate.encounters || 0) + 1;
  }
  function seekFate() {
    if (state.fate.pending) return showToast('A fortune already waits for you.');
    if (Date.now() - (state.fate.clock || 0) < 30000) return showToast('The road is still settling. Wait a moment before seeking again.');
    if (state.qi < 20) return showToast('You need 20 qi to walk the fortune road.');
    state.qi -= 20; state.fate.clock = Date.now();
    spawnFate();
    showToast('A fortune takes shape on the road.');
    save(); render();
  }
  function addFateLog(text) {
    state.fate.log.unshift(text);
    if (state.fate.log.length > 20) state.fate.log.length = 20;
  }
  function resolveFate(optionKey) {
    const pending = state.fate.pending; if (!pending) return;
    const def = fateEvents.find(f => f.id === pending.id); if (!def) { state.fate.pending = null; return; }
    let text = '';
    const luck = luckFor();
    if (def.id === 'wanderer') {
      if (optionKey === 'spar') {
        if (Math.random() < .5 + luck * .012) { const stones = 80 + state.stage * 6; state.stones += stones; state.daoPoints += 1; text = `You win the spar. The wanderer laughs and leaves you ${stones} stones and a sliver of insight.`; }
        else { state.hp = Math.max(1, Math.floor(state.hp * .8)); state.sectRep += 4; text = 'You lose the spar, but the lesson is worth the bruises. Your sect merit rises.'; }
      } else { state.fate.luckBuff = 2; state.fate.luckBuffUntil = Date.now() + 3600000; state.story.mercy = (state.story.mercy || 0) + 1; text = 'You share tea instead. The wanderer leaves a blessing of luck upon you.'; }
    } else if (def.id === 'spring') {
      const qi = 200 + state.stage * 20; state.qi += qi; state.hp = state.maxHp;
      if (Math.random() < .25) { state.root.essence += 1; text = `You drink deeply · +${nfmt(qi)} qi, full health, and a drop of root essence.`; }
      else text = `You drink deeply · +${nfmt(qi)} qi and full health.`;
    } else if (def.id === 'chest') {
      const stones = 100 + Math.floor(Math.random() * 300) + luck * 8; state.stones += stones; state.stats.chests = (state.stats.chests || 0) + 1; dailyStep('gather');
      if (Math.random() < .35) { state.fate.maps += 1; text = `The chest holds ${stones} spirit stones and a treasure map.`; }
      else if (Math.random() < .15) { addEgg(luck > 20 ? 'rare' : 'common'); text = `The chest holds ${stones} spirit stones and a warm mystic egg.`; }
      else text = `The chest holds ${stones} spirit stones.`;
    } else if (def.id === 'tablet') {
      const dao = pick(daoPaths); const gain = Math.round((60 + luck * 3) * daoGainMult(dao.id)); state.dao[dao.id].xp += gain;
      text = `The blank line fills with meaning · +${gain} ${dao.name} insight.`;
      if (luck > 15) { state.daoPoints += 1; text += ' A point of pure insight remains behind.'; }
    } else if (def.id === 'cub') {
      if (optionKey === 'adopt') { addEgg('common'); state.taming.food += 1; text = 'The cub follows you home. You gain a mystic egg and a portion of beast food.'; }
      else { state.story.mercy = (state.story.mercy || 0) + 1; state.fate.luckBuff = 1; state.fate.luckBuffUntil = Date.now() + 3600000; text = 'You leave the cub to its wild life. A small mercy settles on your fate (+1 luck for an hour).'; }
    } else if (def.id === 'merchant') {
      if (optionKey === 'buy') { if (state.stones < 250) text = 'You cannot meet the price. The merchant bows and vanishes.'; else { state.stones -= 250; const grants = [{ relic: 1 }, { egg: 'rare' }, { keys: 1, map: 1 }, { crystal: 3, essence: 2 }]; applyReward(pick(grants)); text = 'You pay the merchant and receive a sealed bundle of rare goods.'; } }
      else text = 'You decline. The merchant smiles as if they expected it.';
    } else if (def.id === 'curse') {
      if (optionKey === 'resist') { if (Math.random() < .5 + luck * .01) { state.luckBonus = (state.luckBonus || 0) + 1; text = 'You endure the cold. The curse breaks, leaving +1 permanent luck.'; } else { state.hp = Math.max(1, Math.floor(state.hp * .7)); text = 'The curse bites deep. You survive, but your health suffers.'; } }
      else { state.stones = Math.max(0, state.stones - 100); state.hp = state.maxHp; text = 'You leave 100 spirit stones at the idol. The cold recedes and your health is restored.'; }
    } else if (def.id === 'rain') {
      const qi = 300 + state.stage * 25; state.qi += qi; state.hp = state.maxHp; state.dao.water.xp += Math.round(40 * daoGainMult('water'));
      text = `You stand in the upward rain · +${nfmt(qi)} qi, full health, and Water Dao insight.`;
    } else if (def.id === 'meteor') {
      const ore = 2 + Math.floor(luck / 5), crystal = 1 + Math.floor(luck / 12);
      state.herbs.ore += ore; state.herbs.crystal += crystal; state.stats.chests = (state.stats.chests || 0) + 1; dailyStep('gather');
      text = `The crater yields ${ore} starfall ore and ${crystal} moon crystal${crystal > 1 ? 's' : ''}.`;
    } else if (def.id === 'hermit') {
      state.daoPoints += 1; state.luckBonus = (state.luckBonus || 0) + 1;
      text = 'The hermit points at your heart and laughs. You gain a dao insight and +1 permanent luck.';
    }
    addFateLog(`${def.title} · ${text}`);
    state.fate.pending = null;
    save(); render();
    openModal(def.seal, 'A FORTUNE UNFOLDS', def.title, text, '<button class="primary-btn" data-action="close-modal">Continue on the road</button>');
  }
  function buyMerchant(id) {
    const offer = state.fate.merchant.find(o => o.id === id); if (!offer || offer.bought) return;
    const item = merchantPool.find(m => m.id === id); if (!item) return;
    if (state.stones < item.cost) return showToast('Not enough spirit stones.');
    state.stones -= item.cost; offer.bought = true;
    const grant = item.grant;
    if (grant.egg) addEgg(grant.egg);
    if (grant.keys) state.realms.keys += grant.keys;
    if (grant.map) state.fate.maps += grant.map;
    if (grant.rootEssence) state.root.essence += grant.rootEssence;
    if (grant.food) state.taming.food += grant.food;
    if (grant.luck) state.luckBonus = (state.luckBonus || 0) + grant.luck;
    if (grant.breakBuff) state.breakBuff = (state.breakBuff || 0) + grant.breakBuff;
    Object.keys(ingredients).forEach(k => { if (grant[k] && state.herbs[k] !== undefined) state.herbs[k] += grant[k]; });
    addFateLog(`Merchant · purchased ${item.name} for ${item.cost} stones.`);
    showToast(`Purchased ${item.name}.`);
    save(); render();
  }
  function useMap() {
    if (state.fate.maps <= 0) return;
    state.fate.maps -= 1; state.stats.chests = (state.stats.chests || 0) + 1;
    const luck = luckFor(); const stones = 80 + state.stage * 5 + Math.floor(Math.random() * 150) + luck * 5;
    state.stones += stones; state.herbs.ore += 1 + Math.floor(luck / 15); state.herbs.crystal += Math.floor(luck / 25);
    if (Math.random() < .4) state.realms.keys += 1;
    if (Math.random() < .25) state.fate.fragments = (state.fate.fragments || 0) + 1;
    questStep('map'); dailyStep('gather');
    addFateLog(`Treasure map · found ${stones} stones and a small cache.`);
    showToast(`Treasure found · +${stones} spirit stones.`);
    save(); render();
  }

  /* ---------------- REINCARNATION ACTIONS ---------------- */
  function resetMortalLife() {
    state.qi = 0; state.stage = 0; state.active = false; state.totalQi = 0; state.qiToday = 0; state.medSeconds = 0;
    state.completedTrips = 0; state.trip = null; state.upgrades = { sutra: 0, array: 0, body: 0, beast: 0, alchemy: 0, fortune: 0, dao: 0 };
    state.boosts = 0; state.breakBuff = 0; state.dailyClaimed = false; state.dailyDate = 0; state.daily = { date: 0, list: [] };
    state.pathLevels = { body: 0, spirit: 0, qi: 0 }; state.enemy = null; state.tripToday = 0;
    state.herbs = { herb: 0, root: 0, flower: 0, ore: 0, essence: 0, crystal: 0, beastCore: 0, voidDust: 0, relic: 0 };
    state.sectRep = 0; state.sectRank = 0; state.mission = null; state.wins = 0;
    state.realms.boss = null; state.world.active = null; state.quests.active = null; state.quests.progress = {};
    state.fate.pending = null;
    state.hp = maxHpFor();
    ensureDaily();
  }
  function reincarnate() {
    if (state.stage < 20) return showToast('You must reach stage 20 to reincarnate.');
    const points = rebirthPointsFor();
    openModal('輪', 'THE WHEEL TURNS', 'Reincarnate?', `You will lose realm, qi, spirit stones, paths, missions and daily progress. Your root, meridians, Dao, beasts, inheritances, artifacts, weapons and achievements remain.<br><br>You will gain <b>${points} reincarnation point${points === 1 ? '' : 's'}</b>.`, `<button class="secondary-btn" data-action="close-modal">Not yet</button><button class="primary-btn" data-action="reincarnate-confirm">Step into the wheel</button>`);
  }
  function reincarnateConfirm() {
    closeModal();
    const points = rebirthPointsFor();
    state.rebirth.count = (state.rebirth.count || 0) + 1;
    state.rebirth.points = (state.rebirth.points || 0) + points;
    resetMortalLife();
    state.stones = 150 + points * 15;
    addFateLog(`Reincarnation ${state.rebirth.count} · ${points} points carried forward.`);
    save(); render();
    openModal('輪', 'A NEW LIFE BEGINS', 'The wheel releases you', `You wake beneath the same mountain with a smaller body and an older soul.<br><br><b>+${points} reincarnation points</b> · ${state.stones} spirit stones to begin again.`, '<button class="primary-btn" data-action="close-modal">Walk the road again</button>');
  }
  function ascendWorld() {
    if (state.stage < 25) return showToast('You must reach True Immortal (stage 25).');
    if ((state.rebirth.world || 0) >= worldNames.length - 1) return showToast('There is no higher world left to climb.');
    openModal('仙', 'THE HIGHER SKY', 'Ascend beyond this world?', `You will leave the ${worldNames[state.rebirth.world || 0]} for the <b>${worldNames[(state.rebirth.world || 0) + 1]}</b>.<br><br>Realm, qi, stones and mortal progress reset, but every permanent system remains. The new world grants a permanent <b>+20% qi and +15% attack</b>.`, '<button class="secondary-btn" data-action="close-modal">Remain here</button><button class="primary-btn" data-action="ascend-confirm">Ascend</button>');
  }
  function ascendConfirm() {
    closeModal();
    state.rebirth.world = (state.rebirth.world || 0) + 1;
    resetMortalLife();
    state.stones = 500 + state.rebirth.world * 250;
    addFateLog(`Ascended to the ${worldNames[state.rebirth.world]}.`);
    save(); render();
    openModal('仙', 'A HIGHER SKY', worldNames[state.rebirth.world], 'The old sky closes like a door. A wider one opens. Everything you made permanent has followed you.', '<button class="primary-btn" data-action="close-modal">Look upward</button>');
  }
  function spendRebirth(id) {
    const level = rebirthUpgrade(id);
    const cost = level + 1;
    if ((state.rebirth.points || 0) < cost) return showToast(`You need ${cost} reincarnation points.`);
    state.rebirth.points -= cost;
    state.rebirth.upgrades[id] = level + 1;
    showToast(`Soul upgrade deepened · ${id} rank ${level + 1}.`);
    save(); render();
  }

  /* ---------------- CORE ACTIONS ---------------- */
  function buyUpgrade(id) {
    const t = techniques.find(x => x.id === id); if (!t) return;
    const rank = state.upgrades[id] || 0, cost = Math.ceil(t.base * Math.pow(rank + 1, 1.55));
    if (state.stones < cost) return showToast('Not enough spirit stones.');
    state.stones -= cost; state.upgrades[id] = rank + 1;
    showToast(`${t.name} attuned · rank ${state.upgrades[id]}.`);
    save(); render();
  }
  function unlockArt(id) {
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (state.activeArts.includes(id)) return showToast('You already know this art.');
    if (state.stage < art.req) return showToast(`You must reach stage ${art.req}.`);
    if (state.stones < art.cost) return showToast(`Learning this art costs ◇ ${art.cost}.`);
    state.stones -= art.cost; state.activeArts.push(id);
    showToast(`${art.name} learned · it now appears in battle.`);
    save(); render();
  }
  function startTrip(id) {
    if (state.trip) return showToast('You are already away on an expedition.');
    const trip = expeditions.find(t => t.id === id); if (!trip) return;
    if (state.stage < trip.req) return showToast(`You must reach stage ${trip.req}.`);
    state.trip = { id, ends: Date.now() + tripDuration(trip) * 1000, notified: false };
    showToast('Your expedition has begun. Safe travels.');
    save(); render();
  }
  function collectTrip() {
    if (!state.trip || Date.now() < state.trip.ends) return;
    const trip = state.trip, def = expeditions.find(t => t.id === trip.id); if (!def) { state.trip = null; save(); render(); return; }
    const reward = def.reward + state.stage * 2 + (state.upgrades.array || 0) * 3;
    state.trip = null; state.stones += reward; state.completedTrips = (state.completedTrips || 0) + 1;
    state.tripToday = (state.tripToday || 0) + 1; state.stats.trips = (state.stats.trips || 0) + 1;
    Object.entries(def.loot).forEach(([k, v]) => { if (state.herbs[k] !== undefined) state.herbs[k] += Math.max(1, Math.round(v * harvestMult())); });
    addRep(def.rep);
    dailyStep('trip'); missionStep('trip');
    const luck = luckFor();
    if (Math.random() * 100 < 6 + luck * .5) { addEgg(luck > 18 ? 'rare' : 'common'); showToast('A mystic egg was hidden in the loot.'); }
    if (Math.random() * 100 < 5 + luck * .4) { state.fate.maps = (state.fate.maps || 0) + 1; showToast('A treasure map was tucked into your pack.'); }
    if (Math.random() * 100 < 2 + luck * .2) { state.realms.keys = (state.realms.keys || 0) + 1; showToast('A realm key was found among the stones.'); }
    showToast(`A safe return · +${nfmt(reward)} stones · +${def.rep} merit · ingredients gathered.`);
    save(); render();
  }
  function brew(id) {
    const recipe = recipes.find(r => r.id === id); if (!recipe) return;
    if (!recipeUnlocked(recipe)) return showToast('This recipe is not yet known.');
    if (state.stones < recipe.cost) return showToast(`This brew costs ◇ ${recipe.cost}.`);
    if (!hasIngredients(recipe)) return showToast('Gather the required ingredients first.');
    state.stones -= recipe.cost;
    Object.entries(recipe.ingredients).forEach(([key, amount]) => { state.herbs[key] -= amount; });
    state.brews = (state.brews || 0) + 1; state.stats.brews = (state.stats.brews || 0) + 1;
    switch (recipe.type) {
      case 'qi': state.qi += recipe.amount; state.qiToday += recipe.amount; state.totalQi += recipe.amount; break;
      case 'heal': state.hp = Math.min(state.maxHp, state.hp + recipe.amount); state.qi += 30; state.qiToday += 30; state.totalQi += 30; break;
      case 'boost': state.boosts = (state.boosts || 0) + recipe.amount; break;
      case 'fortune': state.stones += recipe.amount; state.qi += recipe.amount; state.qiToday += recipe.amount; state.totalQi += recipe.amount; break;
      case 'food': state.taming.food += recipe.amount; break;
      case 'meridian': state.meridians.points = (state.meridians.points || 0) + recipe.amount; break;
      case 'break': state.breakBuff = (state.breakBuff || 0) + recipe.amount; break;
      case 'luck': state.luckBonus = (state.luckBonus || 0) + recipe.amount; break;
      case 'dao': daoPaths.forEach(d => { state.dao[d.id].xp += recipe.amount * daoGainMult(d.id); }); break;
      case 'rootEssence': state.root.essence = (state.root.essence || 0) + recipe.amount; break;
      case 'heaven': state.qi += recipe.amount; state.qiToday += recipe.amount; state.totalQi += recipe.amount; state.breakBuff = (state.breakBuff || 0) + 25; break;
      case 'rebirth': state.rebirth.points = (state.rebirth.points || 0) + recipe.amount; break;
    }
    dailyStep('brew'); questStep('brew');
    showToast(`${recipe.name} prepared · ${recipe.effect}`);
    save(); render();
  }
  function trainPath(id) {
    if (!['body', 'spirit', 'qi'].includes(id)) return;
    const level = state.pathLevels[id], cost = id === 'qi' ? 40 + level * 35 : 50 + level * 45;
    const stones = id === 'qi' ? 8 : 5;
    if (state.qi < cost || state.stones < stones) return showToast('You need more qi and spirit stones to train.');
    state.qi -= cost; state.stones -= stones; state.pathLevels[id] = level + 1;
    if ((level + 1) % 5 === 0) state.meridians.points = (state.meridians.points || 0) + 1;
    showToast(id === 'body' ? 'Your body grows more resilient.' : id === 'spirit' ? 'Your spiritual sea expands; meditation flows faster.' : 'Your qi grows clearer and more abundant.');
    save(); render();
  }
  function joinSect(id) {
    if (!sects[id] || id === state.sectId) return;
    state.sectId = id;
    showToast(`You have joined the ${sects[id].name} Sect. Its arts and beasts await.`);
    save(); render();
  }
  function acceptMission(id) {
    const mission = missions.find(item => item.id === id); if (!mission) return;
    if (state.mission) return showToast('Complete or claim your current mission first.');
    if (state.stage < mission.req) return showToast(`You must reach stage ${mission.req}.`);
    state.mission = { id, progress: 0 };
    showToast(`Mission accepted · ${mission.name}.`);
    save(); render();
  }
  function claimMission() {
    const mission = state.mission && missions.find(item => item.id === state.mission.id);
    if (!mission || state.mission.progress < mission.target) return showToast('The mission is not yet complete.');
    state.stones += mission.stones; state.sectTokens += mission.tokens; addRep(mission.merit);
    state.mission = null;
    showToast(`Mission complete · +${mission.stones} stones · +${mission.tokens} sect tokens · +${mission.merit} merit.`);
    save(); render();
  }
  function buyGear(id) {
    const item = gearCatalog.find(entry => entry.id === id);
    if (!item || state.equipment[id]?.owned || state.sectTokens < item.tokens) return showToast('You need more sect tokens to buy that equipment.');
    state.sectTokens -= item.tokens;
    state.equipment[id] = { owned: true, level: 1 };
    showToast(`${item.name} equipped · ${item.bonus}.`);
    save(); render();
  }
  function upgradeGear(id) {
    const item = gearCatalog.find(entry => entry.id === id), gear = state.equipment[id];
    if (!item || !gear?.owned || gear.level >= 10) return;
    const cost = 35 * (gear.level + 1);
    if (state.stones < cost) return showToast('Not enough spirit stones to refine this equipment.');
    state.stones -= cost; gear.level += 1;
    showToast(`${item.name} refined to level ${gear.level}.`);
    save(); render();
  }
  function donateToSect() {
    if (state.stones < 10 || state.sectRank >= sectRanks.length - 1) return showToast('The sect cannot accept further donations from you.');
    state.stones -= 10; addRep(4);
    showToast('A generous contribution · +4 sect merit.');
    save(); render();
  }
  function upgradeBuilding(id) {
    const def = sectBuildings.find(b => b.id === id); if (!def) return;
    const lv = buildingLevel(id), stones = Math.round(120 * Math.pow(1.65, lv)), tokens = 8 * (lv + 1);
    if (lv >= 10) return showToast('This hall is fully built.');
    if (state.stones < stones || state.sectTokens < tokens) return showToast(`Upgrading needs ◇ ${nfmt(stones)} and ✦ ${tokens} tokens.`);
    state.stones -= stones; state.sectTokens -= tokens; state.sectBuildings[id] = lv + 1;
    showToast(`${def.name} raised to level ${lv + 1} · ${def.perk}.`);
    save(); render();
  }
  function claimRank() {
    const place = ranking().findIndex(r => r.me) + 1;
    if (place > 10) return showToast('Only the top ten disciples receive a stipend.');
    if (state.rankClaimDate === dayIndex()) return showToast('You have already claimed today\'s stipend.');
    const stones = 80 + (11 - place) * 20;
    state.stones += stones; state.sectTokens += 2 + Math.max(0, 6 - place); state.rankClaimDate = dayIndex();
    showToast(`Ranking stipend claimed · +${stones} spirit stones · sect tokens.`);
    save(); render();
  }

  /* ---------------- EVENT DISPATCH ---------------- */
  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) {
      event.preventDefault();
      setView(viewButton.dataset.view);
      return;
    }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    switch (action) {
      case 'tab': { const view = button.dataset.tabView; if (view && uiTabs[view]) { uiTabs[view] = button.dataset.tab; render(); } break; }
      case 'upgrade': buyUpgrade(id); break;
      case 'unlock-art': unlockArt(id); break;
      case 'start-trip': startTrip(id); break;
      case 'collect-trip': collectTrip(); break;
      case 'brew': brew(id); break;
      case 'train-path': trainPath(id); break;
      case 'seek-enemy': seekEnemy(); break;
      case 'attack': attackEnemy(button.dataset.style); break;
      case 'cast-spell': castSectSpell(); break;
      case 'use-art': useArt(id); break;
      case 'flee': flee(); break;
      case 'join-sect': joinSect(id); break;
      case 'accept-mission': acceptMission(id); break;
      case 'claim-mission': claimMission(); break;
      case 'buy-gear': buyGear(id); break;
      case 'upgrade-gear': upgradeGear(id); break;
      case 'donate': donateToSect(); break;
      case 'upgrade-building': upgradeBuilding(id); break;
      case 'claim-rank': claimRank(); break;
      case 'attempt-break': attemptBreak(); break;
      case 'close-modal': closeModal(); break;
      case 'awaken-root': awakenRoot(); break;
      case 'reroll-root': rerollRoot(); break;
      case 'upgrade-root': upgradeRoot(); break;
      case 'open-meridian': openMeridian(id); break;
      case 'comprehend-dao': comprehendDao(id); break;
      case 'infuse-dao': infuseDao(id); break;
      case 'tame-beast': tameBeast(id); break;
      case 'set-beast': setBeast(id); break;
      case 'train-beast': trainBeast(id); break;
      case 'evolve-beast': evolveBeast(id); break;
      case 'hatch-egg': hatchEgg(button.dataset.rarity); break;
      case 'challenge-boss': challengeBoss(id); break;
      case 'boss-attack': bossAttack(button.dataset.style); break;
      case 'boss-spell': bossSpell(); break;
      case 'boss-art': bossArt(id); break;
      case 'boss-retreat': bossRetreat(); break;
      case 'claim-daily': claimDailyTask(id); break;
      case 'discover-inheritance': discoverInheritance(id); break;
      case 'attempt-trial': attemptTrial(id, Number(button.dataset.index)); break;
      case 'enter-realm': enterRealm(id); break;
      case 'realm-attack': realmAttack(button.dataset.style); break;
      case 'realm-spell': realmSpell(); break;
      case 'realm-art': realmArt(id); break;
      case 'realm-retreat': retreatRealm(); break;
      case 'forge-weapon': forgeWeapon(id); break;
      case 'equip-weapon': equipWeapon(id); break;
      case 'refine-weapon': refineWeapon(id); break;
      case 'awaken-weapon': awakenWeapon(id); break;
      case 'equip-artifact': equipArtifact(id, button.dataset.slot); break;
      case 'unequip-artifact': unequipArtifact(button.dataset.slot); break;
      case 'seek-fate': seekFate(); break;
      case 'resolve-fate': resolveFate(id); break;
      case 'buy-merchant': buyMerchant(id); break;
      case 'use-map': useMap(); break;
      case 'accept-quest': acceptQuest(id); break;
      case 'claim-quest': claimQuest(); break;
      case 'reincarnate': reincarnate(); break;
      case 'reincarnate-confirm': reincarnateConfirm(); break;
      case 'ascend-world': ascendWorld(); break;
      case 'ascend-confirm': ascendConfirm(); break;
      case 'rebirth-upgrade': spendRebirth(id); break;
    }
  });

  $('meditateBtn').addEventListener('click', () => {
    state.active = !state.active;
    showToast(state.active ? 'Your breathing slows. Qi gathers around you.' : 'You return gently from meditation.');
    save(); render();
  });
  $('breakthroughBtn').addEventListener('click', openBreakthrough);
  $('modalClose').addEventListener('click', closeModal);
  $('modalBackdrop').addEventListener('click', e => { if (e.target === $('modalBackdrop')) closeModal(); });
  $('dailyClaim').addEventListener('click', claimDailyPractice);
  $('soundToggle').addEventListener('click', (e) => {
    const active = document.body.classList.toggle('focus-mode');
    e.currentTarget.querySelector('span').textContent = active ? 'FOCUS ON' : 'FOCUS';
    showToast(active ? 'Focus mode: distractions softened.' : 'Focus mode off.');
  });

  /* ---------------- WORLD CLOCK ---------------- */
  function ensureWorldEvent() {
    if (!state.worldEvent) state.worldEvent = { id: null, ends: 0, next: 120 };
    if (!state.worldEvent.id) {
      if (!state.worldEvent.next) state.worldEvent.next = state.totalSeconds + 120;
      if (state.totalSeconds >= state.worldEvent.next) {
        const ev = pick(worldEvents);
        state.worldEvent = { id: ev.id, ends: Date.now() + ev.duration * 1000, next: state.totalSeconds + 300 };
        showToast(`${ev.seal} ${ev.name} · ${ev.desc}`);
      }
    } else if (Date.now() > state.worldEvent.ends) {
      state.worldEvent = { id: null, ends: 0, next: state.totalSeconds + 180 };
    }
  }
  function tick() {
    state.totalSeconds += 1;
    const today = dayIndex();
    if (today !== state.dailyDate) {
      state.dailyDate = today; state.dailyClaimed = false; state.qiToday = 0; state.medSeconds = 0; state.tripToday = 0;
      ensureDaily();
      showToast(`A new day dawns · Day ${today}. Daily practice and challenges renewed.`);
    }
    const gained = rateFor();
    state.qi += gained; state.totalQi += gained; state.qiToday += gained;
    if (state.active) state.medSeconds += 1;
    state.stoneClock = (state.stoneClock || 0) + 1;
    if (state.stoneClock >= 8) { state.stoneClock -= 8; state.stones += 1; }
    if ((state.upgrades.array || 0) > 0 && state.totalSeconds % 20 === 0) state.stones += state.upgrades.array;
    const inBattle = !!state.enemy || !!state.world.active || !!state.realms.boss;
    if (!inBattle && daoLevel('water') >= 3) state.hp = Math.min(state.maxHp, state.hp + state.maxHp * .01);
    if (inBattle && daoLevel('life') >= 3) state.hp = Math.min(state.maxHp, state.hp + state.maxHp * .005);
    ensureWorldEvent();
    if (!state.fate.pending && state.totalSeconds % 120 === 0 && Math.random() < .5) {
      spawnFate();
      showToast('A fortune takes shape on the road. Visit Fate & Fortune.');
    }
    if (state.trip && Date.now() >= state.trip.ends && !state.trip.notified) {
      state.trip.notified = true;
      showToast('Your expedition has returned · collect your rewards.');
    }
    render();
    if (state.totalSeconds % 5 === 0) save();
  }

  document.querySelectorAll('[data-view="cultivate"]').forEach(el => el.classList.add('active'));
  render();
  setInterval(tick, 1000);
  window.addEventListener('beforeunload', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
})();
