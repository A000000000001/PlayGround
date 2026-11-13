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

  /* ---------------- DUAL CULTIVATION REALMS ---------------- */
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const spiritRealms = [
    { name: 'Qi Condensation', cn: '凝氣', seal: '氣', desc: 'The first breath draws the world’s vital essence into mortal channels.' },
    { name: 'Foundation Establishment', cn: '築基', seal: '基', desc: 'A stable foundation is laid beneath the sea of qi.' },
    { name: 'Golden Core', cn: '金丹', seal: '丹', desc: 'Qi condenses into a radiant core. The body path awakens at this threshold.' },
    { name: 'Nascent Soul', cn: '元嬰', seal: '嬰', desc: 'A second self opens its eyes within the core.' },
    { name: 'Soul Transformation', cn: '化神', seal: '神', desc: 'The nascent soul becomes a true spiritual presence.' },
    { name: 'Spirit Severing', cn: '斬靈', seal: '斬', desc: 'The cultivator cuts away the mortal spirit that no longer serves.' },
    { name: 'Void Refinement', cn: '煉虛', seal: '虛', desc: 'Emptiness itself is refined into an immortal vessel.' },
    { name: 'Dao Integration', cn: '合道', seal: '道', desc: 'The self and the Dao no longer stand apart.' },
    { name: 'Tribulation Transcendence', cn: '渡劫', seal: '劫', desc: 'Heaven’s final examinations are answered with a steady heart.' },
    { name: 'True Immortal', cn: '真仙', seal: '仙', desc: 'Mortality falls away. The immortal road opens in truth.' },
    { name: 'Celestial Immortal', cn: '天仙', seal: '天', desc: 'The laws of the higher sky answer your call.' },
    { name: 'Immortal Sovereign', cn: '仙君', seal: '君', desc: 'A sovereign of immortal courts and ancient stars.' },
    { name: 'Immortal Emperor', cn: '仙帝', seal: '帝', desc: 'Your decree is written into the fabric of the immortal world.' },
    { name: 'Primordial Immortal', cn: '太初仙', seal: '初', desc: 'You remember the first dawn before heaven had a name.' },
    { name: 'Eternal Dao Ancestor', cn: '永道祖', seal: '祖', desc: 'The end of the spirit’s road. The Dao itself calls you ancestor.' }
  ];
  const bodyRealms = [
    { name: 'Mortal Body', cn: '凡體', seal: '凡', desc: 'The untempered vessel. Every legend begins in ordinary flesh.' },
    { name: 'Skin Tempering', cn: '淬皮', seal: '皮', desc: 'Spirit dew and iron sand harden the outer shell.' },
    { name: 'Muscle Tempering', cn: '煉肌', seal: '肌', desc: 'Fibres tighten into cords of living steel.' },
    { name: 'Bone Tempering', cn: '鍛骨', seal: '骨', desc: 'Marrow rings like a struck bell; bone becomes jade.' },
    { name: 'Organ Tempering', cn: '淬臟', seal: '臟', desc: 'The five organs become furnaces that refine breath and blood.' },
    { name: 'Blood Refinement', cn: '煉血', seal: '血', desc: 'Every drop of blood is cleansed into a river of vitality.' },
    { name: 'Marrow Cleansing', cn: '洗髓', seal: '髓', desc: 'Old impurities leave the marrow. Rebirth begins from within.' },
    { name: 'Meridian Forging', cn: '鑄脈', seal: '脈', desc: 'The body’s channels are reforged into unbreakable veins.' },
    { name: 'Diamond Body', cn: '金剛體', seal: '剛', desc: 'Steel, stone and spellfire break upon an adamant frame.' },
    { name: 'Saint Body', cn: '聖體', seal: '聖', desc: 'A saint’s flesh radiates quiet, unyielding power.' },
    { name: 'Divine Body', cn: '神體', seal: '神', desc: 'The mortal form becomes a dwelling for divine strength.' },
    { name: 'Immortal Body', cn: '仙體', seal: '仙', desc: 'Age and wound lose their claim upon your flesh.' },
    { name: 'Celestial Body', cn: '天體', seal: '天', desc: 'Your body moves with the turning of the celestial spheres.' },
    { name: 'Primordial Body', cn: '太初體', seal: '初', desc: 'The first body, before weakness entered the world.' },
    { name: 'Eternal Godbody', cn: '永神體', seal: '永', desc: 'The final flesh. Endless, deathless, and utterly sovereign.' }
  ];
  const spiritRealmBases = [0, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49];
  const legacyRealmStarts = [[1, 0], [10, 1], [13, 2], [16, 3], [19, 5], [22, 7], [25, 9], [28, 10], [31, 11], [34, 13], [37, 14]];
  const worldNames = ['Mortal Realm', 'Immortal Realm', 'Celestial Realm', 'Primordial Void'];

  const techniques = [
    { id: 'sutra', name: 'Clear Heart Sutra', seal: '心', desc: 'A serene mind draws pure qi from the surrounding world.', base: 30, req: 0, effect: 'Base qi +0.8 / rank', kind: 'qi' },
    { id: 'array', name: 'Spirit-Gathering Array', seal: '聚', desc: 'Arrange spirit stones to coax the ley lines into motion.', base: 45, req: 2, effect: 'Spirit stone yield +1 every 20 sec / rank', kind: 'stones' },
    { id: 'body', name: 'Jade Body Tempering', seal: '玉', desc: 'Temper the mortal vessel to weather the heavenly tribulation.', base: 65, req: 3, effect: 'Breakthrough chance +4% / rank', kind: 'chance' },
    { id: 'beast', name: 'Beast Whisperer Sutra', seal: '獸', desc: 'Listen to the wild heart. Even a proud beast may bow its head.', base: 80, req: 5, effect: 'Taming chance +4% / rank', kind: 'beast' },
    { id: 'alchemy', name: 'Herb-Lore Canon', seal: '藥', desc: 'Know the nature of every leaf, root, and petal.', base: 75, req: 6, effect: 'Gathering yield +3% / rank', kind: 'herb' },
    { id: 'fortune', name: 'Karmic Divination', seal: '卜', desc: 'Read the threads of fate that gather around a fortunate soul.', base: 95, req: 8, effect: 'Luck +1 / rank', kind: 'luck' },
    { id: 'dao', name: 'Dao Heart Sutra', seal: '道', desc: 'Still the heart, and the thousand laws will speak to you.', base: 110, req: 10, effect: 'Dao insight +6% / rank', kind: 'dao' }
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
    { id: 'hunt12', name: 'The Long Patrol', desc: 'Defeat 12 spirit beasts.', type: 'kill', target: 12, stones: 900, tokens: 70, merit: 100, req: 18 },
    { id: 'duel3', name: 'The Proving Grounds', desc: 'Win 3 arena duels.', type: 'duel', target: 3, stones: 300, tokens: 25, merit: 35, req: 6 }
  ];
  const sectRanks = [
    { name: 'Outer Disciple', need: 0 }, { name: 'Inner Disciple', need: 20 }, { name: 'Core Disciple', need: 60 },
    { name: 'Elder', need: 120 }, { name: 'Sect Master', need: 220 }, { name: 'Grand Elder', need: 360 },
    { name: 'Dao Guardian', need: 540 }, { name: 'Immortal Patriarch', need: 800 }
  ];
  const gearCatalog = [
    { id: 'sword', name: 'Sword', seal: '劍', tokens: 8, reqRank: 0, bonus: 'Attack +6 / level', stat: 'attack', value: 6, rarity: 'Common' },
    { id: 'helmet', name: 'Helmet', seal: '盔', tokens: 6, reqRank: 1, bonus: 'Qi flow +4% / level', stat: 'qi', value: .04, rarity: 'Common' },
    { id: 'gloves', name: 'Gloves', seal: '手', tokens: 6, reqRank: 1, bonus: 'Attack +3 / level', stat: 'attack', value: 3, rarity: 'Common' },
    { id: 'pants', name: 'Pants', seal: '褲', tokens: 6, reqRank: 2, bonus: 'Max health +10 / level', stat: 'health', value: 10, rarity: 'Common' },
    { id: 'vest', name: 'Vest', seal: '甲', tokens: 7, reqRank: 3, bonus: 'Qi flow +5% / level', stat: 'qi', value: .05, rarity: 'Rare' },
    { id: 'shoes', name: 'Shoes', seal: '履', tokens: 5, reqRank: 1, bonus: 'Incoming damage -1 / level', stat: 'guard', value: 1, rarity: 'Common' }
  ];
  const sectBuildings = [
    { id: 'meditation', name: 'Meditation Hall', seal: '靜', reqRank: 0, perk: '+3% qi flow / level', desc: 'Incense and silence. The oldest engine of cultivation.' },
    { id: 'garden', name: 'Herb Garden', seal: '藥', reqRank: 1, perk: '+5% gathering yield / level', desc: 'Spirit herbs arranged according to the five elements.' },
    { id: 'beastpen', name: 'Beast Pen', seal: '獸', reqRank: 1, perk: '+2% taming chance / level', desc: 'A wild sanctuary where proud beasts learn trust.' },
    { id: 'formation', name: 'Formation Hall', seal: '陣', reqRank: 2, perk: '+2% breakthrough chance / level', desc: 'Ley-line diagrams that steady the mortal vessel.' },
    { id: 'armory', name: 'Refining Armory', seal: '器', reqRank: 2, perk: '+3% weapon power / level', desc: 'Cold anvils and hotter forge-fires.' },
    { id: 'library', name: 'Scripture Library', seal: '卷', reqRank: 3, perk: '+10% dao insight / level', desc: 'Scrolls older than the sect itself.' }
  ];
  const expeditions = [
    { id: 'herbs', name: 'Gathering in the Mistwood', icon: '林', desc: 'Follow the dew trails through the foothills. Return with medicinal herbs and a modest stone offering.', duration: 25, reward: 18, loot: { herb: 3, root: 1 }, rep: 4, req: 0 },
    { id: 'ruins', name: 'The Moonlit Ruins', icon: '月', desc: 'Search a forgotten shrine for spirit stones, ironroot, and rare moonflowers.', duration: 60, reward: 48, loot: { root: 2, flower: 2 }, rep: 8, req: 3 },
    { id: 'emberridge', name: 'Emberfall Ridge', icon: '炎', desc: 'Ash-choked cliffs where starfall ore glows in the cracks.', duration: 95, reward: 95, loot: { ore: 3, flower: 2 }, rep: 12, req: 8 },
    { id: 'mirrorlake', name: 'Mirror Lake Depths', icon: '鏡', desc: 'Dive beneath the glassy surface for moon crystals and lost relics.', duration: 135, reward: 160, loot: { crystal: 2, essence: 1, flower: 2 }, rep: 18, req: 13 },
    { id: 'voidrift', name: 'The Shifting Void Rift', icon: '虛', desc: 'A wound in the world. Void dust gathers where reality thins.', duration: 180, reward: 260, loot: { voidDust: 2, ore: 3, essence: 1 }, rep: 26, req: 18 },
    { id: 'celestial', name: 'Celestial Garden Overlook', icon: '苑', desc: 'A terrace above the clouds where ancient relics bear fruit.', duration: 240, reward: 420, loot: { relic: 1, crystal: 3, essence: 2 }, rep: 38, req: 24 }
  ];
  const worldRegions = [
    {
      id: 'mistwood', name: 'Mistwood Foothills', seal: '林', x: 14, y: 66, req: 0, trip: 'herbs',
      desc: 'Dew-heavy pine and quiet deer trails below the sect. The oldest road, and the safest.',
      landmarks: [
        { id: 'dewspring', name: 'Dewlight Spring', seal: '泉', desc: 'A spring that gathers the first light of morning.', reward: { herb: 3, stones: 30 }, lore: 'The spring is said to remember every disciple who has ever knelt beside it.' },
        { id: 'bellshrine', name: 'Forgotten Bell Shrine', seal: '鐘', desc: 'A bronze bell with no clapper, older than the sect.', reward: { daoPoints: 1, stones: 80 }, lore: 'Some nights the bell rings anyway. Old Shen refuses to speak of it.' },
        { id: 'foxden', name: 'Ember Fox Den', seal: '狐', desc: 'Warm earth and small pawprints that glow faintly.', reward: { food: 2, luckBonus: 1 }, rare: true, lore: 'A fox that has learned to hide its tail has also learned to hide its intentions.' }
      ]
    },
    {
      id: 'ruins', name: 'Moonlit Ruins', seal: '月', x: 34, y: 46, req: 3, trip: 'ruins',
      desc: 'A shrine fallen out of memory. Moonflowers open only where the roof has failed.',
      landmarks: [
        { id: 'courtyard', name: 'Broken Courtyard', seal: '庭', desc: 'Tiles arranged in a formation no one can read.', reward: { root: 2, stones: 70 }, lore: 'The tiles were never a floor. They were a warning.' },
        { id: 'altar', name: 'Moon Altar', seal: '壇', desc: 'A pale altar still wet with condensation.', reward: { flower: 3, crystal: 1 }, lore: 'Offerings left here vanish before dawn, but are never taken by human hands.' },
        { id: 'seal', name: 'Sealed Cistern', seal: '封', desc: 'A stone lid, a warm draft, and a sound like breathing.', reward: { relic: 1, stones: 160 }, rare: true, lore: 'Whatever sleeps below is not dead. The moon ensures it dreams.' }
      ]
    },
    {
      id: 'emberridge', name: 'Emberfall Ridge', seal: '炎', x: 57, y: 25, req: 8, trip: 'emberridge',
      desc: 'Ash terraces and glowing cracks. The air tastes of iron and old lightning.',
      landmarks: [
        { id: 'ashfall', name: 'Ashen Falls', seal: '灰', desc: 'A waterfall of grey dust that never quite settles.', reward: { ore: 3, stones: 110 }, lore: 'The falls mark where a fire spirit was buried, still burning.' },
        { id: 'anvil', name: 'The Cold Anvil', seal: '砧', desc: 'An anvil untouched by heat, humming at the edge of hearing.', reward: { ore: 2, crystal: 1, stones: 140 }, lore: 'The first forge master struck it once and never needed to strike it again.' },
        { id: 'embernest', name: 'Ember Nest', seal: '巢', desc: 'A nest of black glass, warm as a heartbeat.', reward: { beastCore: 1, egg: 'rare' }, rare: true, lore: 'Something has been tending this nest for a very long time.' }
      ]
    },
    {
      id: 'mirrorlake', name: 'Mirror Lake', seal: '鏡', x: 76, y: 50, req: 13, trip: 'mirrorlake',
      desc: 'A lake with no wind and no bottom. The reflections arrive a moment late.',
      landmarks: [
        { id: 'shore', name: 'Silver Shore', seal: '岸', desc: 'Pale sand that rings like glass underfoot.', reward: { flower: 3, essence: 1 }, lore: 'The shore is made of a thousand shattered reflections.' },
        { id: 'isle', name: 'Drowned Pavilion', seal: '亭', desc: 'A pavilion below the surface, perfectly dry inside.', reward: { crystal: 2, stones: 220 }, lore: 'The pavilion has no door. Guests still arrive.' },
        { id: 'throne', name: 'Reflection Throne', seal: '座', desc: 'A seat of black water with a crown of moonlight above it.', reward: { keys: 1, rootEssence: 1 }, rare: true, lore: 'Whoever sits here is reflected in every lake in the world.' }
      ]
    },
    {
      id: 'voidrift', name: 'Shifting Void Rift', seal: '虛', x: 88, y: 24, req: 18, trip: 'voidrift',
      desc: 'Distance has lost its argument here. Paths fold into themselves.',
      landmarks: [
        { id: 'threshold', name: 'The Folded Threshold', seal: '門', desc: 'A doorway standing alone in the open air.', reward: { voidDust: 1, stones: 280 }, lore: 'The doorway opens onto the same room, no matter which side you enter.' },
        { id: 'drift', name: 'Star Drift', seal: '星', desc: 'Small stars drift like pollen in still water.', reward: { voidDust: 2, crystal: 2 }, lore: 'Each star is a distant world, and each is empty.' },
        { id: 'unmaking', name: 'The Unmaking Pool', seal: '無', desc: 'A pool that reflects nothing at all.', reward: { relic: 1, luckBonus: 2 }, rare: true, lore: 'Look long enough and you will forget which side of the surface you stand on.' }
      ]
    },
    {
      id: 'celestial', name: 'Celestial Garden', seal: '苑', x: 70, y: 9, req: 24, trip: 'celestial',
      desc: 'A terrace above the clouds where fruit ripens out of season and memory.',
      landmarks: [
        { id: 'terrace', name: 'Cloud Terrace', seal: '臺', desc: 'A balustrade of white jade above an endless sea of cloud.', reward: { essence: 2, stones: 360 }, lore: 'From here the mortal world looks like a rumour.' },
        { id: 'orchard', name: 'First Orchard', seal: '果', desc: 'Trees that bear fruit shaped like small, sleeping faces.', reward: { crystal: 3, flower: 3 }, lore: 'One fruit is missing from every branch. The gardeners are very patient.' },
        { id: 'throne', name: 'Seat of Dawn', seal: '晨', desc: 'An empty seat oriented toward a sun that has not yet risen.', reward: { relic: 2, rootEssence: 2, daoPoints: 1 }, rare: true, lore: 'The first morning sat here once. It has not returned.' }
      ]
    }
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
    { id: 'karmicwheel', name: 'Karmic Wheel', seal: '輪', rarity: 'Divine', bonus: { attack: .1, hp: .1, qi: .1, luck: 4 }, ability: 'Every choice returns. Every return is a gift.' },
    { id: 'laurel', name: 'Laurel of the Sect Champion', seal: '冠', rarity: 'Divine', bonus: { attack: .08, hp: .08, qi: .08, luck: 3 }, ability: 'Undefeated — the arena crowd lends its strength to every art you perform.' }
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
        { name: 'The Eastern Sea', desc: 'Reach True Immortal in spirit cultivation.', check: (s) => s.spirit?.realm >= 9, reward: { keys: 2, rootEssence: 5 } }
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
    { id: 'immortal', name: 'True Immortal', desc: 'Reach True Immortal.', check: s => s.spirit?.realm >= 9, reward: { stones: 1200, daoPoints: 3 } },
    { id: 'kills10', name: 'Hunter', desc: 'Defeat 10 spirit beasts.', check: s => (s.stats?.kills || 0) >= 10, reward: { stones: 60 } },
    { id: 'kills100', name: 'Terror of the Wilds', desc: 'Defeat 100 spirit beasts.', check: s => (s.stats?.kills || 0) >= 100, reward: { stones: 500, tokens: 40 } },
    { id: 'boss1', name: 'Boss Slayer', desc: 'Defeat a world boss.', check: s => (s.stats?.bosses || 0) >= 1, reward: { stones: 400, daoPoints: 1 } },
    { id: 'boss5', name: 'Heaven Defier', desc: 'Defeat all five world bosses.', check: s => (s.stats?.bosses || 0) >= 5, reward: { stones: 2500, daoPoints: 4 } },
    { id: 'arena1', name: 'First Blood', desc: 'Win a duel in the sect arena.', check: s => (s.arena?.wins || 0) >= 1, reward: { stones: 150, tokens: 10 } },
    { id: 'arenaChamp', name: 'Sect Champion', desc: 'Defeat all ten arena rivals.', check: s => (s.arena?.rank || 11) <= 1, reward: { stones: 2000, tokens: 120, daoPoints: 2, relic: 1 } },
    { id: 'artMaster', name: 'Art Perfected', desc: 'Attune a martial art to rank 5.', check: s => Object.values(s.artRanks || {}).some(v => v >= 5), reward: { stones: 600, tokens: 30 } },
    { id: 'bodyAwaken', name: 'Twin Roads', desc: 'Unlock body cultivation at Golden Core I.', check: s => !!s.body?.unlocked, reward: { stones: 300, rootEssence: 1 } },
    { id: 'body15', name: 'Eternal Godbody', desc: 'Reach Eternal Godbody X.', check: s => s.body?.realm >= 14 && s.body?.stage >= 9, reward: { stones: 6000, tokens: 200, daoPoints: 5, relic: 2 } },
    { id: 'spirit15', name: 'Eternal Dao Ancestor', desc: 'Reach Eternal Dao Ancestor X.', check: s => s.spirit?.realm >= 14 && s.spirit?.stage >= 9, reward: { stones: 6000, tokens: 200, daoPoints: 5, keys: 3 } },
    { id: 'origin', name: 'Beyond the Origin', desc: 'Unlock the hidden third progression.', hidden: true, check: s => !!s.origin?.unlocked, reward: { stones: 10000, daoPoints: 10, relic: 3 } },
    { id: 'ending', name: 'The End of All Roads', desc: 'Complete all ten steps of Beyond the Origin.', hidden: true, check: s => !!s.ending?.complete, reward: { stones: 50000, daoPoints: 20, relic: 5, rootEssence: 10 } },
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
    { id: 'q6', npc: 'The Last Disciple', name: 'The Last Disciple', req: 22, desc: 'An old disciple guards a sect that no longer exists. They ask only that someone remember its name.', type: 'realm', target: 1, reward: { stones: 1500, relic: 1, daoPoints: 2 } },
    { id: 'q7', npc: 'Arena Keeper Gan', name: 'The Empty Pedestal', req: 15, desc: 'Keeper Gan has polished the champion’s pedestal for twenty years. He asks you to give the crowd a duel worth remembering.', type: 'duel', target: 2, reward: { stones: 750, tokens: 25, daoPoints: 1 } }
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
    { id: 'duel1', label: 'Win 1 arena duel', type: 'duel', target: 1, reward: { stones: 70, tokens: 4 } },
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

  const pathTrees = {
    body: {
      name: 'Body · Iron Vessel', seal: '體', accent: '#7d9a74',
      desc: 'Bone, blood and breath. Every rank tempers the mortal vessel and every milestone leaves a permanent mark.',
      nodes: [
        { lvl: 2, name: 'Sinew Binding', desc: '+6% maximum health', bonus: { hpPct: .06 } },
        { lvl: 4, name: 'Marrow Wash', desc: '+1 guard', bonus: { guard: 1 } },
        { lvl: 6, name: 'Bronze Skin', desc: '+10% maximum health', bonus: { hpPct: .1 } },
        { lvl: 9, name: 'Titan Tendons', desc: '+6% attack', bonus: { attackPct: .06 } },
        { lvl: 12, name: 'Diamond Bones', desc: '+2 guard · +8% health', bonus: { guard: 2, hpPct: .08 } },
        { lvl: 15, name: 'Undying Body', desc: '+10% attack · +10% health', bonus: { attackPct: .1, hpPct: .1 } }
      ]
    },
    spirit: {
      name: 'Soul · Immortal Spirit', seal: '神', accent: '#8478a8',
      desc: 'The sea of consciousness widens with each refinement. Soul milestones sharpen arts, insight and the will to break through.',
      nodes: [
        { lvl: 2, name: 'Clear Sea', desc: '+6% spirit-art power', bonus: { spiritPct: .06 } },
        { lvl: 4, name: 'Bell Mind', desc: '+3% breakthrough chance', bonus: { breakPct: 3 } },
        { lvl: 6, name: 'Soul Lantern', desc: '+10% Dao insight', bonus: { daoPct: .1 } },
        { lvl: 9, name: 'Star Consciousness', desc: '+10% spirit-art power', bonus: { spiritPct: .1 } },
        { lvl: 12, name: 'Mirror Spirit', desc: '+4% breakthrough · +10% qi flow', bonus: { breakPct: 4, qiPct: .1 } },
        { lvl: 15, name: 'Immortal Soul', desc: '+15% spirit power · +15% Dao insight', bonus: { spiritPct: .15, daoPct: .15 } }
      ]
    },
    qi: {
      name: 'Qi · Flowing Breath', seal: '氣', accent: '#4f8b83',
      desc: 'Refine the quality of breath until the world itself lends you its essence. Qi milestones accelerate every current.',
      nodes: [
        { lvl: 2, name: 'First Circulation', desc: '+6% qi flow', bonus: { qiPct: .06 } },
        { lvl: 4, name: 'Dantian Bloom', desc: '+0.4 base qi / sec', bonus: { qiFlat: .4 } },
        { lvl: 6, name: 'River Meridians', desc: '+10% qi flow', bonus: { qiPct: .1 } },
        { lvl: 9, name: 'Spirit Dew', desc: '+1 spirit stone every 20 sec', bonus: { stonesPer: 1 } },
        { lvl: 12, name: 'Endless Current', desc: '+15% qi flow · +0.4 base qi', bonus: { qiPct: .15, qiFlat: .4 } },
        { lvl: 15, name: 'Heavenly Breath', desc: '+20% qi flow · +1 stone trickle', bonus: { qiPct: .2, stonesPer: 1 } }
      ]
    }
  };
  const daoMasteryNodes = [
    { total: 6, name: 'First Harmony', desc: '+5% qi flow and attack' },
    { total: 12, name: 'Sixfold Accord', desc: '+5% breakthrough · +1 luck' },
    { total: 18, name: 'Wheel of Laws', desc: '+10% qi flow and attack' },
    { total: 24, name: 'Dao Incarnate', desc: '+8% breakthrough · +2 luck' },
    { total: 30, name: 'Heavenly Understanding', desc: '+15% qi flow and attack' }
  ];
  const sectVault = [
    { id: 'herbs', name: 'Spirit Herb Bundle', seal: '草', tokens: 4, desc: 'Four spirit herbs gathered from the sect garden.', grant: { herb: 4 } },
    { id: 'ore', name: 'Starfall Ore Cache', seal: '礦', tokens: 6, desc: 'Three chunks of starfall ore for the forge.', grant: { ore: 3 } },
    { id: 'food', name: 'Beast Feast', seal: '飼', tokens: 5, desc: 'Two portions of spirit-rich beast food.', grant: { food: 2 } },
    { id: 'crystal', name: 'Moon Crystal', seal: '晶', tokens: 10, desc: 'A flawless moon crystal from the sect treasury.', grant: { crystal: 1 } },
    { id: 'key', name: 'Secret Realm Key', seal: '鑰', tokens: 15, desc: 'A key that opens one hidden realm.', grant: { keys: 1 } },
    { id: 'essence', name: 'Root Essence', seal: '華', tokens: 18, desc: 'One drop of distilled root-marrow.', grant: { rootEssence: 1 } },
    { id: 'egg', name: 'Mystic Egg · Rare', seal: '卵', tokens: 26, desc: 'A warm rare egg from the beast pens.', grant: { egg: 'rare' } },
    { id: 'relic', name: 'Ancient Relic', seal: '古', tokens: 40, desc: 'A relic recovered from a fallen rival sect.', grant: { relic: 1 } }
  ];
  const sectDuties = [
    { id: 'sweep', name: 'Sweep the Halls', seal: '掃', desc: 'Humble work steadies the heart. +8 merit, +3 tokens.', merit: 8, tokens: 3, qi: -10 },
    { id: 'copy', name: 'Copy Scriptures', seal: '抄', desc: 'Patience with old ink. +40 Dao insight spread across the laws.', merit: 5, tokens: 2, dao: 40, qi: -25 },
    { id: 'train', name: 'Train the Recruits', seal: '練', desc: 'A strong sect is a shared sect. +6 merit, +35 sect reputation power.', merit: 6, tokens: 2, stones: 40, qi: -15 }
  ];
  const arenaRivals = [
    { id: 'wenshuang', rank: 10, name: 'Wen Shuang', title: 'Outer Gate Sentinel', seal: '霜', sect: 'azure', req: 1, hp: 120, damage: 4, type: 'guard', stones: 80, tokens: 6, merit: 8, dao: { id: 'water', xp: 30 }, trait: 'Patient Guard — takes 3 less damage while above half health.', quote: 'The gate is closed to the unworthy. Show me something worth remembering.' },
    { id: 'baiwuchen', rank: 9, name: 'Bai Wuchen', title: 'Sword Attendant', seal: '劍', sect: 'crimson', req: 4, hp: 270, damage: 7, type: 'double', stones: 130, tokens: 9, merit: 12, dao: { id: 'sword', xp: 40 }, trait: 'Twin Cut — every third retaliation strikes twice.', quote: 'A blade is only honest when it is drawn.' },
    { id: 'linruoxue', rank: 8, name: 'Lin Ruoxue', title: 'Jade Lotus Envoy', seal: '蓮', sect: 'jade', req: 7, hp: 470, damage: 10, type: 'drain', stones: 190, tokens: 12, merit: 16, dao: { id: 'life', xp: 50 }, trait: 'Lotus Breath — drains 8 qi with every retaliation.', quote: 'You fight as if the world owes you something. It does not.' },
    { id: 'moyuan', rank: 7, name: 'Mo Yuan', title: 'Ashen Fist', seal: '拳', sect: 'crimson', req: 10, hp: 720, damage: 13, type: 'burn', stones: 260, tokens: 16, merit: 22, dao: { id: 'fire', xp: 60 }, trait: 'Cinder Fist — retaliation burns for 5 extra damage.', quote: 'Bones break. Ash remembers.' },
    { id: 'xiaotian', rank: 6, name: 'Xiao Tian', title: 'Thunder Runner', seal: '雷', sect: 'azure', req: 13, hp: 1050, damage: 16, type: 'storm', stones: 360, tokens: 20, merit: 28, dao: { id: 'lightning', xp: 70 }, trait: 'Heaven’s Tempo — every third turn releases a double strike.', quote: 'You cannot block what has already passed.' },
    { id: 'jiangli', rank: 5, name: 'Jiang Li', title: 'Moonlit Blade', seal: '月', sect: 'jade', req: 16, hp: 1450, damage: 20, type: 'pierce', stones: 500, tokens: 26, merit: 36, dao: { id: 'space', xp: 80 }, trait: 'Moon Pierce — ignores half your guard.', quote: 'The moon does not argue with the tide. It simply moves it.' },
    { id: 'qinfeng', rank: 4, name: 'Qin Feng', title: 'Formation Master', seal: '陣', sect: 'azure', req: 19, hp: 1950, damage: 24, type: 'heal', stones: 700, tokens: 32, merit: 46, dao: { id: 'water', xp: 90 }, trait: 'Repairing Seal — restores 5% health each turn.', quote: 'I have already read the end of this duel.' },
    { id: 'suming', rank: 3, name: 'Su Ming', title: 'Void Step', seal: '虛', sect: 'jade', req: 22, hp: 2550, damage: 28, type: 'dodge', stones: 950, tokens: 40, merit: 58, dao: { id: 'space', xp: 110 }, trait: 'Fold Step — 18% chance to evade your strike.', quote: 'Where were you looking? I was never there.' },
    { id: 'hanyue', rank: 2, name: 'Han Yue', title: 'Frost Sovereign', seal: '冰', sect: 'jade', req: 25, hp: 3300, damage: 33, type: 'reflect', stones: 1300, tokens: 50, merit: 72, dao: { id: 'life', xp: 130 }, trait: 'Frost Mirror — returns 18% of the damage you deal.', quote: 'Stillness is not peace. It is the knife before the cut.' },
    { id: 'nangongwan', rank: 1, name: 'Nangong Wan', title: 'Sect Champion', seal: '冠', sect: 'azure', req: 28, hp: 4200, damage: 39, type: 'champion', stones: 2000, tokens: 80, merit: 100, dao: { id: 'sword', xp: 180 }, trait: 'Ten Thousand Forms — heals 3% each turn, and every third strike lands twice.', quote: 'I have held this seat for thirty years. Show me why I should stand.' }
  ];
  const legacyBoons = [
    { id: 'cache', name: 'Ancestral Cache', seal: '匣', points: 3, desc: 'A sealed cache of spirit stones.', grant: { stones: 400 } },
    { id: 'insight', name: 'Whisper of the Dao', seal: '悟', points: 4, desc: 'One point of pure Dao insight.', grant: { daoPoints: 1 } },
    { id: 'key', name: 'Forgotten Key', seal: '鑰', points: 5, desc: 'A key to a door the world forgot.', grant: { keys: 1 } },
    { id: 'essence', name: 'Root Marrow', seal: '華', points: 6, desc: 'Two drops of ancient root essence.', grant: { rootEssence: 2 } },
    { id: 'tokens', name: 'Founder’s Stipend', seal: '✦', points: 7, desc: 'Sect tokens from the founder’s private purse.', grant: { tokens: 30 } }
  ];
  const forgeTempers = 5;
  const TIP = {
    qi: 'Qi is the vital essence gathered by breathing. It fuels training, spirit arts, realm breakthroughs and secret-realm doors.',
    stones: 'Spirit stones are the common currency of the cultivation world. They buy techniques, equipment, alchemy ingredients and forge work.',
    tokens: 'Sect tokens are earned through missions, bosses and duties. Spend them in the Armory, Vault and sect halls.',
    merit: 'Sect merit measures your service. Enough merit promotes your rank, which grants permanent attack, qi and health bonuses.',
    rate: 'Qi per second. Meditation raises this to its full value; idle cultivation receives 35%. Base qi grows with realm, path ranks and the Clear Heart Sutra.',
    breakthrough: 'The chance that a realm breakthrough succeeds. Failure scatters 20% of your qi but never destroys your foundation.',
    attack: 'The damage of a body strike before variance. It combines your weapon, gear, sect, root, Dao, companion, artifacts and path-tree bonuses.',
    guard: 'Flat damage reduction against physical retaliation. Some bosses pierce or ignore guard.',
    health: 'Your maximum health. It grows with realm, body training, gear, roots, Dao and path-tree milestones. At zero health you are carried to safety.',
    crit: 'Critical strike chance. Critical hits deal 150% damage, improved by the Sword Dao and Heaven’s Edge.',
    luck: 'Luck improves loot, rare findings, taming odds, root rarity and fortune events.',
    gathering: 'Gathering multiplier applied to expedition and resource loot. Herbs and the Life Dao raise it.',
    alchemy: 'Alchemy mastery is earned by brewing. It unlocks deeper recipes and improves your standing in the pavilion.',
    dao: 'Dao insight is experience toward the six laws. Comprehending costs qi and stones; insight points can be infused directly.',
    root: 'Your spiritual root grants a permanent elemental identity and bonuses. Grades multiply all root bonuses.',
    meridians: 'Meridians are permanent channels opened with meridian points, qi and stones. Sets of four grant circulation bonuses.',
    realm: 'Your spirit cultivation realm. Each of the fifteen realms holds ten Roman stages; stages I–IX are guaranteed qi upgrades and stage X opens a heavenly tribulation.',
    stage: 'A single step within a realm, marked I–X. Stage X is the final rung and requires a major breakthrough to enter the next realm.',
    bodyPath: 'Body cultivation is an independent fifteen-realm path sharing the same qi. It unlocks at Golden Core I and permanently raises health, physical attack, guard and damage resistance.',
    companion: 'The active spirit beast grants a passive bonus and strikes alongside you in every battle.',
    weapon: 'The equipped weapon adds flat attack, modified by refinement, tempering and the Refining Armory.',
    food: 'Beast food trains and evolves bonded companions. It is earned from alchemy, expeditions, fate and merchants.',
    keys: 'Realm keys open secret realms. They are earned from tribulations, inheritances, expeditions, fate and the sect vault.',
    essence: 'Root essence raises your spiritual root grade. Major breakthroughs, realms and elixirs provide it.',
    relic: 'Ancient relics are required for inheritances and weapon awakening.',
    maps: 'Treasure maps lead to caches, keys and rare materials. Follow one from Fate & Fortune.',
    fragments: 'Fate fragments can reroll a pending fortune, refresh the faceless merchant or be woven into a new encounter.',
    path: 'Path ranks are trained with qi and spirit stones. Every rank strengthens a foundation; milestones at ranks 2, 4, 6, 9, 12 and 15 grant permanent tree bonuses.',
    spiritPower: 'Spirit-art power multiplies damage from spirit strikes, sect spells and martial arts.',
    temper: 'Tempering adds a permanent +2% attack per temper to a forged weapon, up to five tempers.'
  };

  const emptyEquipment = () => Object.fromEntries(gearCatalog.map(item => [item.id, { owned: false, level: 0 }]));
  const defaultState = () => ({
    version: 3, qi: 0, stones: 25, stage: 0, active: false, totalSeconds: 0, totalQi: 0, qiToday: 0, medSeconds: 0,
    spirit: { realm: 0, stage: 0, breaks: 0, criticals: 0, failures: 0, migratedFrom: 0, bonuses: { qi: 0, spell: 0, dao: 0 } },
    body: { realm: 0, stage: 0, unlocked: false, breaks: 0, criticals: 0, failures: 0, bonuses: { hp: 0, attack: 0, guard: 0 } },
    origin: { unlocked: false, level: 0, name: 'Beyond the Origin' },
    ending: { complete: false, day: 0 },
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
    inheritance: { discovered: [], trials: {}, completed: [], artifacts: [], points: 0, boons: [] },
    realms: { cleared: {}, keys: 1, boss: null },
    forge: { weapons: {}, equippedWeapon: null, equippedArtifacts: [null, null] },
    sectBuildings: { meditation: 0, garden: 0, beastpen: 0, formation: 0, armory: 0, library: 0 },
    luckBonus: 0,
    fate: { pending: null, log: [], merchant: [], merchantDate: 0, merchantRefreshDate: 0, maps: 0, fragments: 0, clock: 0, encounters: 0, luckBuff: 0, luckBuffUntil: 0, offeringLuck: 0, offeringUntil: 0, divinations: 0 },
    world: { active: null, defeated: {}, tier: 1 },
    arena: { rank: 11, defeated: {}, wins: 0, battle: null, lastWin: 0 },
    rebirth: { count: 0, points: 0, upgrades: { qi: 0, attack: 0, luck: 0, dao: 0 }, world: 0 },
    achievements: {}, hiddenFound: [],
    quests: { active: null, completed: [], progress: {} },
    daily: { date: 0, list: [] },
    stats: { kills: 0, bosses: 0, tames: 0, dao: 0, brews: 0, trips: 0, realms: 0, tribulations: 0, crit: 0, chests: 0 },
    activeArts: ['cloudpalm'], artRanks: { cloudpalm: 1 }, breakBuff: 0,
    worldEvent: { id: null, ends: 0, next: 240 },
    story: { mercy: 0, npcMet: [] },
    rankClaimDate: 0,
    notifications: [],
    discoveries: { regions: {}, log: [] },
    sectPerks: { dutyDate: 0, dutyType: '', blessing: null, blessingUntil: 0 }
  });
  let state = loadState();
  let activeView = 'cultivate';
  let toastTimer;
  const uiTabs = { combat: 'hunt', sect: 'overview', techniques: 'passive', dao: 'roots', inherit: 'legacy', forge: 'weapons', fate: 'fortune', codex: 'realms', expeditions: 'mistwood' };

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
      const hasDualCultivation = saved.spirit && Number.isFinite(Number(saved.spirit.realm));
      if (!hasDualCultivation) {
        const legacyStage = Math.max(0, Number(saved.stage) || 0);
        const mapped = legacyStageToSpirit(legacyStage);
        fresh.spirit = { ...defaultState().spirit, ...mapped, migratedFrom: legacyStage };
        fresh.body = { ...defaultState().body };
      }
      normalizeCultivation(fresh);
      fresh.stage = legacyForSpirit(fresh.spirit.realm, fresh.spirit.stage);
      if (fresh.spirit.realm >= 2) fresh.body.unlocked = true;
      fresh.equipment = { ...emptyEquipment(), ...(fresh.equipment || {}) };
      Object.keys(fresh.equipment).forEach(id => { fresh.equipment[id] = { owned: false, level: 0, ...(fresh.equipment[id] || {}) }; });
      fresh.meridians.opened = fresh.meridians.opened || {};
      fresh.inheritance.trials = fresh.inheritance.trials || {};
      fresh.quests.progress = fresh.quests.progress || {};
      fresh.forge.equippedArtifacts = (fresh.forge.equippedArtifacts || []).slice(0, 2);
      while (fresh.forge.equippedArtifacts.length < 2) fresh.forge.equippedArtifacts.push(null);
      if (!Array.isArray(fresh.notifications)) fresh.notifications = [];
      if (!fresh.discoveries || typeof fresh.discoveries !== 'object') fresh.discoveries = { regions: {}, log: [] };
      if (!fresh.discoveries.regions) fresh.discoveries.regions = {};
      if (!Array.isArray(fresh.discoveries.log)) fresh.discoveries.log = [];
      if (!fresh.sectPerks) fresh.sectPerks = { dutyDate: 0, dutyType: '', blessing: null, blessingUntil: 0 };
      if (!Array.isArray(fresh.inheritance.boons)) fresh.inheritance.boons = [];
      if (!fresh.fate || typeof fresh.fate !== 'object') fresh.fate = { pending: null, log: [], merchant: [], merchantDate: 0, merchantRefreshDate: 0, maps: 0, fragments: 0, clock: 0, encounters: 0, luckBuff: 0, luckBuffUntil: 0, offeringLuck: 0, offeringUntil: 0, divinations: 0 };
      if (!fresh.ending || typeof fresh.ending !== 'object') fresh.ending = { complete: false, day: 0 };
      fresh.ending.complete = !!fresh.ending.complete;
      fresh.ending.day = Math.max(0, Number(fresh.ending.day) || 0);
      fresh.world.tier = Math.max(1, fresh.world.tier || 1);
      if (!fresh.arena || typeof fresh.arena !== 'object') fresh.arena = { rank: 11, defeated: {}, wins: 0, battle: null, lastWin: 0 };
      fresh.arena.rank = clamp(Number(fresh.arena.rank) || 11, 1, 11);
      fresh.arena.defeated = fresh.arena.defeated && typeof fresh.arena.defeated === 'object' ? fresh.arena.defeated : {};
      fresh.arena.wins = Number(fresh.arena.wins) || 0;
      if (!sects[fresh.sectId]) fresh.sectId = 'azure';
      fresh.maxHp = Math.max(60, Number(fresh.maxHp) || 60);
      fresh.hp = Math.max(0, Math.min(fresh.maxHp, Number(fresh.hp ?? fresh.maxHp)));
      if (!Array.isArray(fresh.activeArts)) fresh.activeArts = ['cloudpalm'];
      if (!fresh.artRanks || typeof fresh.artRanks !== 'object') fresh.artRanks = {};
      fresh.activeArts.forEach(id => { if (!fresh.artRanks[id]) fresh.artRanks[id] = 1; });
      if (fresh.worldEvent?.ends && Date.now() > fresh.worldEvent.ends) fresh.worldEvent = { id: null, ends: 0, next: (fresh.totalSeconds || 0) + 180 };
      const away = Math.min(28800, Math.max(0, (Date.now() - (fresh.lastSeen || Date.now())) / 1000));
      if (away > 15) {
        fresh.totalSeconds += away;
        const rate = rateFor(fresh);
        fresh.qiToday += fresh.active ? away * rate : 0;
        fresh.medSeconds += fresh.active ? away : 0;
        fresh.qi += away * (fresh.active ? rate : .5);
        fresh.totalQi += away * (fresh.active ? rate : .5);
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
  /* ---------------- CULTIVATION HELPERS ---------------- */
  function legacyStageToSpirit(stage) {
    const n = Math.max(0, Number(stage) || 0);
    if (n <= 0) return { realm: 0, stage: 0 };
    if (n < 10) return { realm: 0, stage: Math.min(9, n - 1) };
    let entry = legacyRealmStarts[0];
    for (const candidate of legacyRealmStarts) if (n >= candidate[0]) entry = candidate;
    const within = Math.max(0, n - entry[0]);
    return { realm: entry[1], stage: Math.min(9, within * 3) };
  }
  function legacyForSpirit(realm, stage) {
    realm = clamp(Number(realm) || 0, 0, spiritRealms.length - 1);
    stage = clamp(Number(stage) || 0, 0, 9);
    if (realm === 0) return stage;
    return spiritRealmBases[realm] + Math.min(2, Math.floor(stage * 3 / 10));
  }
  function normalizeCultivation(s = state) {
    if (!s.spirit || typeof s.spirit !== 'object') s.spirit = { realm: 0, stage: 0, breaks: 0, criticals: 0, failures: 0, bonuses: { qi: 0, spell: 0, dao: 0 } };
    if (!s.body || typeof s.body !== 'object') s.body = { realm: 0, stage: 0, unlocked: false, breaks: 0, criticals: 0, failures: 0, bonuses: { hp: 0, attack: 0, guard: 0 } };
    if (!s.origin || typeof s.origin !== 'object') s.origin = { unlocked: false, level: 0, name: 'Beyond the Origin' };
    s.spirit.realm = clamp(Math.floor(Number(s.spirit.realm) || 0), 0, spiritRealms.length - 1);
    s.spirit.stage = clamp(Math.floor(Number(s.spirit.stage) || 0), 0, 9);
    s.body.realm = clamp(Math.floor(Number(s.body.realm) || 0), 0, bodyRealms.length - 1);
    s.body.stage = clamp(Math.floor(Number(s.body.stage) || 0), 0, 9);
    s.spirit.bonuses = { qi: Number(s.spirit.bonuses?.qi) || 0, spell: Number(s.spirit.bonuses?.spell) || 0, dao: Number(s.spirit.bonuses?.dao) || 0 };
    s.body.bonuses = { hp: Number(s.body.bonuses?.hp) || 0, attack: Number(s.body.bonuses?.attack) || 0, guard: Number(s.body.bonuses?.guard) || 0 };
    ['breaks', 'criticals', 'failures'].forEach(k => { s.spirit[k] = Number(s.spirit[k]) || 0; s.body[k] = Number(s.body[k]) || 0; });
    if (s.spirit.realm >= 2) s.body.unlocked = true;
    s.origin.level = clamp(Math.floor(Number(s.origin.level) || 0), 0, 10);
    s.origin.unlocked = !!s.origin.unlocked;
  }
  function syncCultivation(s = state) {
    normalizeCultivation(s);
    s.stage = legacyForSpirit(s.spirit.realm, s.spirit.stage);
    if (s.spirit.realm >= 2) s.body.unlocked = true;
  }
  function spiritTitle(s = state) { return `${spiritRealms[s.spirit.realm].name} ${ROMAN[s.spirit.stage]}`; }
  function bodyTitle(s = state) { return s.body.unlocked ? `${bodyRealms[s.body.realm].name} ${ROMAN[s.body.stage]}` : 'Locked'; }
  function currentBand(stage) {
    if (stage !== undefined && stage !== null) {
      const mapped = typeof stage === 'object' ? stage : legacyStageToSpirit(stage);
      return spiritRealms[mapped.realm] || spiritRealms[0];
    }
    return spiritRealms[state.spirit.realm] || spiritRealms[0];
  }
  function isMajor(stage) {
    if (stage === undefined || stage === null) return state.spirit.stage === 9;
    return legacyStageToSpirit(stage).stage === 9;
  }
  function realmTitle(stage) {
    if (stage === undefined || stage === null) return spiritTitle();
    const mapped = typeof stage === 'object' ? stage : legacyStageToSpirit(stage);
    return `${spiritRealms[mapped.realm].name} ${ROMAN[mapped.stage]}`;
  }
  function nextSpiritTitle(s = state) {
    if (s.spirit.stage < 9) return `${spiritRealms[s.spirit.realm].name} ${ROMAN[s.spirit.stage + 1]}`;
    const next = s.spirit.realm + 1;
    return next < spiritRealms.length ? `${spiritRealms[next].name} I` : 'Beyond the Origin';
  }
  function nextBodyTitle(s = state) {
    if (!s.body.unlocked) return 'Golden Core I';
    if (s.body.stage < 9) return `${bodyRealms[s.body.realm].name} ${ROMAN[s.body.stage + 1]}`;
    const next = s.body.realm + 1;
    return next < bodyRealms.length ? `${bodyRealms[next].name} I` : 'Beyond the Origin';
  }
  function pathCultivation(path, s = state) { return path === 'body' ? s.body : s.spirit; }
  function pathRealmName(path, realm) { return path === 'body' ? bodyRealms[realm].name : spiritRealms[realm].name; }
  function spiritMaxed(s = state) { return s.spirit.realm >= spiritRealms.length - 1 && s.spirit.stage >= 9; }
  function bodyMaxed(s = state) { return !!s.body.unlocked && s.body.realm >= bodyRealms.length - 1 && s.body.stage >= 9; }
  function stageCost(path = 'spirit', s = state) {
    const c = pathCultivation(path, s);
    const base = path === 'body' ? 90 : 120;
    return Math.round(base * Math.pow(1.085, c.realm * 10 + c.stage) * Math.pow(1.22, c.realm));
  }
  function breakthroughCost(path = 'spirit', s = state) {
    const c = pathCultivation(path, s);
    const nextRealm = Math.min((path === 'body' ? bodyRealms : spiritRealms).length - 1, c.realm + 1);
    const base = path === 'body' ? 90 : 120;
    const at = base * Math.pow(1.085, nextRealm * 10) * Math.pow(1.22, nextRealm);
    return Math.round(at * 3);
  }
  function nextPathCost(path = 'spirit', s = state) {
    const c = pathCultivation(path, s);
    return c.stage >= 9 ? breakthroughCost(path, s) : stageCost(path, s);
  }
  function originUnlocked(s = state) { return s.spirit.realm === spiritRealms.length - 1 && s.spirit.stage === 9 && s.body.realm === bodyRealms.length - 1 && s.body.stage === 9; }
  function originCost(s = state) { return Math.round(50000 * Math.pow(1.55, s.origin.level)); }
  function spiritQiBonus(s = state) { return s.spirit.realm * .02 + s.spirit.stage * .002 + s.spirit.bonuses.qi * .02; }
  function spiritSpellBonus(s = state) { return s.spirit.realm * .04 + s.spirit.stage * .004 + s.spirit.bonuses.spell * .02; }
  function spiritDaoBonus(s = state) { return s.spirit.realm * .025 + s.spirit.stage * .0025 + s.spirit.bonuses.dao * .01; }
  function bodyHpBonus(s = state) { return s.body.unlocked ? s.body.realm * 28 + s.body.stage * 4 + s.body.bonuses.hp * 8 : 0; }
  function bodyAttackBonus(s = state) { return s.body.unlocked ? s.body.realm * 2.5 + s.body.stage * .45 + s.body.bonuses.attack * 1.6 : 0; }
  function bodyGuardBonus(s = state) { return s.body.unlocked ? s.body.realm * 1.4 + s.body.stage * .2 + s.body.bonuses.guard * .6 : 0; }
  function bodyDamageReduction(s = state) {
    if (!s.body.unlocked) return 0;
    return clamp(s.body.realm * .012 + s.body.stage * .0015 + s.body.bonuses.guard * .003, 0, .35);
  }
  function maybeUnlockBody(quiet = false) {
    if (state.body.unlocked || state.spirit.realm < 2) return false;
    state.body.unlocked = true;
    state.body.realm = 0; state.body.stage = 0;
    if (!quiet) notify('The body path awakens · Golden Core I reached. Begin at Mortal Body I.', 'breakthrough');
    return true;
  }
  function maybeUnlockOrigin() {
    if (state.origin.unlocked || !originUnlocked()) return false;
    state.origin.unlocked = true;
    notify('Beyond the Origin · both cultivation paths stand at their final stage.', 'breakthrough');
    fxBurst('rare', '源', 'Beyond the Origin', 'Spirit and body have reached their final rung. A third path opens beyond the charted Dao.', 'The hidden progression is now unlocked.');
    openModal('源', 'THE HIDDEN FINAL REALM', 'Beyond the Origin', 'Eternal Dao Ancestor X. Eternal Godbody X.<br><br>Two roads have ended at the same summit. The veil parts, and a path older than cultivation is revealed.<br><br><b>Beyond the Origin has been unlocked.</b>', '<button class="primary-btn" data-action="close-modal">Step beyond</button>');
    return true;
  }
  function requirement() { return nextPathCost('spirit'); }
  function sectData(s = state) { return sects[s.sectId] || sects.azure; }
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
    const temper = owned.temper || 0;
    return { ...w, refine, temper, awakened: !!owned.awakened, totalAttack: Math.round(w.attack * (1 + refine * .12 + temper * .02) * (1 + buildingLevel('armory', s) * .03)) };
  }
  function currentEvent(s = state) {
    if (!s.worldEvent?.id) return null;
    if (Date.now() > (s.worldEvent.ends || 0)) return null;
    return worldEvents.find(e => e.id === s.worldEvent.id) || null;
  }
  function luckFor(s = state) {
    let luck = 5 + (s.upgrades?.fortune || 0) + rootBonus('luck', s) + meridianBonus('luck', s) + beastBonus('luck', s) + artifactBonus('luck', s) + rebirthUpgrade('luck', s) * 2 + (s.luckBonus || 0) + daoTreeBonus('luck', s);
    const ev = currentEvent(s);
    if (ev?.buff === 'luck') luck += 5;
    if ((s.fate?.luckBuffUntil || 0) > Date.now()) luck += (s.fate?.luckBuff || 0);
    if ((s.fate?.offeringUntil || 0) > Date.now()) luck += (s.fate?.offeringLuck || 0);
    return Math.round(luck * 10) / 10;
  }
  function qiBase(s = state) {
    return 2.5 + (s.stage || 0) * .28 + (s.upgrades?.sutra || 0) * .8 + (s.pathLevels?.spirit || 0) * .4 + (s.pathLevels?.qi || 0) * .24 + pathTreeBonus('qiFlat', s);
  }
  function rateFor(s = state) {
    const base = qiBase(s);
    const ev = currentEvent(s);
    const mult = 1 + (s.boosts || 0) + gearStat('qi', s) + sectData(s).qi + (s.sectRank || 0) * .02
      + rootBonus('qi', s) + daoLevel('water', s) * .03 + meridianBonus('qi', s) + beastBonus('qi', s)
      + artifactBonus('qi', s) + rebirthUpgrade('qi', s) * .1 + (s.rebirth?.world || 0) * .2
      + buildingLevel('meditation', s) * .03 + (ev?.buff === 'qi' ? .5 : 0)
      + pathTreeBonus('qiPct', s) + daoTreeBonus('qi', s) + sectBlessing('qi', s) * .25
      + spiritQiBonus(s) + (s.origin?.level || 0) * .05;
    return base * mult * (s.active ? 1 : .35);
  }
  function attackDamage(base, s = state) {
    const w = equippedWeapon(s);
    const flat = gearStat('attack', s) + (w?.totalAttack || 0) + bodyAttackBonus(s);
    const mult = 1 + sectData(s).attack + (s.sectRank || 0) * .03 + rootBonus('attack', s) + daoLevel('sword', s) * .04
      + daoLevel('fire', s) * .04 + beastBonus('attack', s) + artifactBonus('attack', s) + rebirthUpgrade('attack', s) * .08 + (s.rebirth?.world || 0) * .15
      + buildingLevel('armory', s) * .02 + pathTreeBonus('attackPct', s) + daoTreeBonus('attack', s) + sectBlessing('attack', s) * .15
      + (s.origin?.level || 0) * .08;
    return Math.round((base + flat) * mult);
  }
  function spiritStrike(base, s = state) { return Math.round(attackDamage(base, s) * spiritPowerMult(s)); }
  function critChance(s = state) {
    let c = .02 + rootBonus('crit', s) + daoLevel('lightning', s) * .02 + artifactBonus('crit', s) + beastBonus('crit', s);
    if (currentEvent(s)?.buff === 'attack') c += .05;
    return clamp(c, 0, .6);
  }
  function artRank(id, s = state) {
    if (!s.activeArts?.includes(id)) return 0;
    return clamp(Number(s.artRanks?.[id]) || 1, 1, 5);
  }
  function artDamageMult(id, s = state) {
    const rank = artRank(id, s);
    return rank ? 1 + (rank - 1) * .18 : 1;
  }
  function maxHpFor(s = state) {
    const body = 1 + (s.stage || 0) + (s.upgrades?.body || 0) * 2 + (s.pathLevels?.body || 0) * 3;
    const base = 60 + body * 5 + (s.pathLevels?.body || 0) * 12 + (s.sectRank || 0) * 10 + gearStat('health', s) + bodyHpBonus(s);
    return Math.round(base * (1 + rootBonus('hp', s) + beastBonus('hp', s) + artifactBonus('hp', s) + daoLevel('life', s) * .03 + (s.rebirth?.world || 0) * .1 + pathTreeBonus('hpPct', s) + (s.origin?.level || 0) * .04));
  }
  function guardFor(s = state) {
    return Math.floor((s.pathLevels?.body || 0) / 2 + gearStat('guard', s) + meridianBonus('guard', s) + rootBonus('guard', s) + artifactBonus('guard', s) + beastBonus('guard', s) + daoLevel('life', s) * .4 + pathTreeBonus('guard', s) + bodyGuardBonus(s));
  }
  function harvestMult(s = state) {
    return 1 + (s.upgrades?.alchemy || 0) * .03 + rootBonus('herb', s) + daoLevel('life', s) * .04 + buildingLevel('garden', s) * .05 + beastBonus('herb', s) + (currentEvent(s)?.buff === 'herb' ? .5 : 0);
  }
  function daoGainMult(id, s = state) {
    let m = 1 + (s.upgrades?.dao || 0) * .06 + buildingLevel('library', s) * .1 + rebirthUpgrade('dao', s) * .15 + (currentEvent(s)?.buff === 'dao' ? .5 : 0) + pathTreeBonus('daoPct', s) + spiritDaoBonus(s);
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
  function spiritBreakChance(s = state) {
    let ch = 52
      + (s.upgrades?.body || 0) * 2
      + buildingLevel('formation', s) * 2.2
      + (s.breakBuff || 0)
      + rootBonus('break', s) * 100
      + meridianBonus('break', s) * 100
      + pathTreeBonus('breakPct', s)
      + daoTreeBonus('break', s)
      + sectBlessing('break', s) * 5
      + Math.min(10, (s.pathLevels?.spirit || 0) * .7)
      + Math.min(12, daoLevel('water', s) * 1.4 + totalMastery(s) * .25)
      - s.spirit.realm * 2.5;
    return Math.round(clamp(ch, 20, 95));
  }
  function bodyBreakChance(s = state) {
    let ch = 50
      + (s.upgrades?.body || 0) * 3.2
      + Math.min(14, (s.pathLevels?.body || 0) * .9)
      + Math.min(10, openedMeridians(s) * .9)
      + buildingLevel('formation', s) * 1.4
      + sectBlessing('break', s) * 4
      + Math.min(8, s.body.bonuses.guard * .5)
      - s.body.realm * 2.4;
    return Math.round(clamp(ch, 20, 95));
  }
  function breakChance(s = state) { return spiritBreakChance(s); }
  function alchemyLevel(s = state) { return 1 + Math.floor((s.brews || 0) / 5); }
  function questObjective(q, s = state) { return q.type === 'gather' ? (s.herbs?.[q.key] || 0) : (s.quests?.progress?.[q.id] || 0); }
  function questDone(q, s = state) { return questObjective(q, s) >= q.target; }
  function recipeUnlocked(r, s = state) { return (s.stage || 0) >= r.unlockStage && (s.brews || 0) >= r.unlockBrews; }
  function tripDuration(t, s = state) { return Math.max(8, Math.round(t.duration * (1 - Math.min(.4, daoLevel('space', s) * .015)))); }
  function rankPower(s = state) {
    return Math.round((s.stage || 0) * 120 + (s.spirit?.realm || 0) * 240 + (s.body?.realm || 0) * 180 + attackDamage(0, s) * 10 + maxHpFor(s) + (s.sectRep || 0) * 3 + (s.stats?.bosses || 0) * 500 + openedMeridians(s) * 150 + (s.rebirth?.count || 0) * 400 + (s.origin?.level || 0) * 2000);
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
  function pathTreeActive(pathId, node, s = state) {
    return (s.pathLevels?.[pathId] || 0) >= node.lvl;
  }
  function pathTreeBonus(key, s = state) {
    let sum = 0;
    Object.entries(pathTrees).forEach(([pathId, tree]) => {
      tree.nodes.forEach(node => { if (pathTreeActive(pathId, node, s)) sum += node.bonus?.[key] || 0; });
    });
    return sum;
  }
  function pathTreeNodes(pathId, s = state) {
    return (pathTrees[pathId]?.nodes || []).filter(n => pathTreeActive(pathId, n, s)).length;
  }
  function daoTreeNodes(s = state) {
    return daoMasteryNodes.filter(n => totalMastery(s) >= n.total).length;
  }
  function daoTreeBonus(key, s = state) {
    const total = totalMastery(s);
    let sum = 0;
    if (total >= 6) sum += key === 'qi' || key === 'attack' ? .05 : 0;
    if (total >= 12) sum += key === 'break' ? 5 : key === 'luck' ? 1 : 0;
    if (total >= 18) sum += key === 'qi' || key === 'attack' ? .1 : 0;
    if (total >= 24) sum += key === 'break' ? 8 : key === 'luck' ? 2 : 0;
    if (total >= 30) sum += key === 'qi' || key === 'attack' ? .15 : 0;
    return sum;
  }
  function sectBlessing(type, s = state) {
    if (s.sectPerks?.blessing !== type) return 0;
    if ((s.sectPerks?.blessingUntil || 0) < Date.now()) return 0;
    return 1;
  }
  function spiritPowerMult(s = state) {
    return 1 + pathTreeBonus('spiritPct', s) + (s.root?.type === 'divine' ? .05 : 0) + spiritSpellBonus(s) + (s.origin?.level || 0) * .06;
  }
  function tipAttr(text) { return ` data-tip="${String(text).replace(/"/g, '&quot;')}"`; }
  function notify(text, kind = 'info', silent = false) {
    if (!state.notifications) state.notifications = [];
    state.notifications.unshift({ text, kind, at: Date.now() });
    if (state.notifications.length > 40) state.notifications.length = 40;
    if (!silent) showToast(text);
  }
  function regionData(id) { return worldRegions.find(r => r.id === id) || null; }
  function regionState(id, s = state) {
    if (!s.discoveries) s.discoveries = { regions: {}, log: [] };
    if (!s.discoveries.regions) s.discoveries.regions = {};
    if (!s.discoveries.regions[id]) s.discoveries.regions[id] = { found: [], visits: 0, surveys: 0 };
    const r = s.discoveries.regions[id];
    if (!Array.isArray(r.found)) r.found = [];
    return r;
  }
  function regionFoundCount(id, s = state) { return regionState(id, s).found.length; }
  function regionComplete(id, s = state) { return regionFoundCount(id, s) >= (regionData(id)?.landmarks.length || 0); }
  function addDiscovery(regionId, landmark) {
    const rs = regionState(regionId);
    if (!rs.found.includes(landmark.id)) rs.found.push(landmark.id);
    state.discoveries.log.unshift({ region: regionId, landmark: landmark.id, name: landmark.name, at: Date.now() });
    if (state.discoveries.log.length > 30) state.discoveries.log.length = 30;
    applyReward(landmark.reward);
    notify(`${landmark.name} discovered in the ${regionData(regionId)?.name || 'wilds'} · ${rewardsText(landmark.reward)}`, landmark.rare ? 'rare' : 'reward');
    if (landmark.rare) fxBurst('rare', landmark.seal, landmark.name, landmark.lore || 'A rare discovery is recorded in your journal.', rewardsText(landmark.reward));
    else rewardFloat(`+ ${rewardsText(landmark.reward)}`);
  }

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
    maybeUnlockBody(true);
    maybeUnlockOrigin();
    recalc();
    const goal = requirement();
    const qi = Math.floor(state.qi);
    const aid = (id, value) => { const el = $(id); if (el) el.textContent = value; };
    aid('stones', nfmt(state.stones));
    aid('realmName', spiritTitle());
    const stageEl = $('stageBadge');
    if (stageEl) stageEl.innerHTML = `${spiritRealms[state.spirit.realm].cn} <span>${ROMAN[state.spirit.stage]}</span>`;
    aid('qiText', nfmt(qi)); aid('qiGoal', spiritMaxed() ? '∞' : nfmt(goal));
    const fill = $('qiFill'); if (fill) fill.style.width = spiritMaxed() ? '100%' : `${Math.min(100, qi / goal * 100)}%`;
    aid('qiPercent', spiritMaxed() ? 'PATH COMPLETE' : `${Math.min(100, Math.floor(qi / goal * 100))}%`);
    aid('qiRate', rateFor().toFixed(1));
    aid('meditateLabel', state.active ? 'Meditation in progress' : 'Begin Meditation');
    aid('meditateHint', state.active ? 'BREATHE DEEPLY · THE QI GATHERS' : 'LET THE QI FLOW THROUGH YOU');
    $('meditateBtn')?.classList.toggle('meditating', state.active);
    const canBreak = state.qi >= goal && !spiritMaxed();
    if ($('breakthroughBtn')) $('breakthroughBtn').disabled = !canBreak;
    aid('breakBtnLabel', spiritMaxed() ? 'Spirit path complete' : state.spirit.stage < 9 ? 'Advance Spirit' : 'Break Through');
    aid('breakHint', spiritMaxed()
      ? (state.ending?.complete ? 'THE JOURNEY IS COMPLETE' : bodyMaxed() ? 'THE HIDDEN REALM AWAITS' : 'COMPLETE THE BODY PATH')
      : canBreak ? (state.spirit.stage < 9 ? 'READY · GUARANTEED STAGE ADVANCE' : `READY · ${spiritBreakChance()}% SUCCESS · TRIBULATION`) : `${nfmt(Math.max(0, goal - qi))} QI TO THE THRESHOLD`);
    const control = Math.max(1, 1 + state.spirit.realm * 2 + state.spirit.stage + state.upgrades.sutra * 2 + daoLevel('water') * 2);
    const spirit = Math.max(1, 1 + state.spirit.realm * 2 + Math.floor(state.spirit.stage / 2) + state.upgrades.array * 2 + state.pathLevels.spirit * 3 + totalMastery() * 2);
    const body = Math.max(1, state.body.unlocked ? 1 + state.body.realm * 2 + state.body.stage + state.upgrades.body * 2 + state.pathLevels.body * 3 + openedMeridians() * 2 : 1);
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
    const spiritDone = spiritMaxed();
    const nextTitle = spiritDone ? 'The spirit path is complete' : state.spirit.stage < 9 ? `Spirit · ${nextSpiritTitle()}` : `Breakthrough · ${nextSpiritTitle()}`;
    aid('nextTitle', nextTitle);
    aid('nextText', spiritDone
      ? (bodyMaxed()
        ? 'Eternal Dao Ancestor X and Eternal Godbody X. Both roads have reached their final stage, and a hidden path now waits beyond the charted Dao.'
        : `Eternal Dao Ancestor X has been reached. The spirit road is complete; ${state.body.unlocked ? `continue body cultivation from ${bodyTitle()}` : 'the body path awaits its awakening at Golden Core I'}.`)
      : state.spirit.stage < 9
      ? `Spend ${nfmt(goal)} qi to advance from ${spiritTitle()} to ${nextSpiritTitle()}. Stages I–IX are guaranteed.`
      : `Gather ${nfmt(goal)} qi and face the heavenly tribulation. Success carries you to ${nextSpiritTitle()}. Failure leaves you at stage X and scatters 10% of your qi.`);
    aid('nextProgress', spiritDone ? `${spiritTitle()} · final stage` : `${nfmt(qi)} / ${nfmt(goal)} qi`);
    const nextFill = $('nextFill'); if (nextFill) nextFill.style.width = spiritDone ? '100%' : `${Math.min(100, state.qi / goal * 100)}%`;
    aid('techCount', `${Object.values(state.upgrades).filter(v => v > 0).length + state.activeArts.length}/${techniques.length + martialArts.length}`);
    $('expDot')?.classList.toggle('hidden', !(state.trip && Date.now() >= state.trip.ends));
    $('daoDot')?.classList.toggle('hidden', !(state.daoPoints > 0 || state.root.essence >= 6));
    $('fateDot')?.classList.toggle('hidden', !(state.fate?.pending || state.fate?.maps > 0 || state.fate?.merchant?.some(o => !o.bought)));
    $('completionBadge')?.classList.toggle('hidden', !state.ending?.complete);
    const trialsReady = inheritanceCatalog.some(inc => state.inheritance.discovered.includes(inc.id) && inc.trials.some((t, i) => !(state.inheritance.trials[inc.id]?.[i]) && safeCheck(t)));
    $('legacyDot')?.classList.toggle('hidden', !(trialsReady || (state.realms.keys > 0 && secretRealms.some(r => state.stage >= r.req))));
    const root = rootData();
    const chip = $('rootChip');
    if (chip) chip.innerHTML = root
      ? `<span class="root-seal ${root.rarity.toLowerCase()}">${root.seal}</span><span><small>SPIRITUAL ROOT · ${ROOT_GRADES[state.root.grade].toUpperCase()}</small><b>${root.name}</b></span>`
      : `<span class="root-seal">空</span><span><small>SPIRITUAL ROOT</small><b>Unawakened</b></span>`;
    renderRealmPath(); renderDualCultivation(); renderBanners(); renderCharacterPanel(); renderNotifications(); renderChallenges(); renderQuestTracker(); renderSubView();
  }
  function safeCheck(trial) { try { return trial.check(state); } catch { return false; } }
  function renderRealmPath() {
    const el = $('realmPath'); if (!el) return;
    el.classList.add('long');
    el.innerHTML = spiritRealms.map((r, i) => {
      const passed = state.spirit.realm > i || (state.spirit.realm === i && state.spirit.stage >= 0);
      const current = state.spirit.realm === i;
      return `<div class="realm-step ${passed ? 'passed' : ''} ${current ? 'current' : ''}"><span class="realm-node">${passed ? '✦' : '·'}</span><span>${r.name}</span></div>`;
    }).join('');
  }
  function pathCardHtml(path) {
    const isBody = path === 'body';
    const data = isBody ? state.body : state.spirit;
    const realms = isBody ? bodyRealms : spiritRealms;
    const realm = realms[data.realm];
    const locked = isBody && !data.unlocked;
    const cost = nextPathCost(path);
    const pct = Math.min(100, state.qi / cost * 100);
    const atPeak = data.stage >= 9;
    const complete = isBody ? bodyMaxed() : spiritMaxed();
    const chance = isBody ? bodyBreakChance() : spiritBreakChance();
    const canPay = state.qi >= cost && !complete;
    const nextLabel = complete ? 'Beyond the Origin' : isBody ? nextBodyTitle() : nextSpiritTitle();
    const stats = isBody
      ? [['MAX HEALTH', `+${nfmt(bodyHpBonus())}`, 'Permanent health from tempering the vessel.'],
         ['PHYSICAL ATTACK', `+${nfmt(Math.round(bodyAttackBonus() * 10) / 10)}`, 'Flat attack added to every physical strike.'],
         ['GUARD', `+${nfmt(Math.round(bodyGuardBonus() * 10) / 10)}`, 'Flat damage absorbed before health is lost.'],
         ['RESISTANCE', `${Math.round(bodyDamageReduction() * 100)}%`, 'Incoming damage reduced by the body’s tempered flesh.']]
      : [['QI FLOW', `+${Math.round(spiritQiBonus() * 100)}%`, 'Increases the shared qi gathered each second.'],
         ['SPELL POWER', `+${Math.round(spiritSpellBonus() * 100)}%`, 'Empowers spirit arts, sect spells and martial techniques.'],
         ['DAO INSIGHT', `+${Math.round(spiritDaoBonus() * 100)}%`, 'Deepens all Dao comprehension gains.'],
         ['SPIRIT CONTROL', `${nfmt(Math.round(1 + data.realm * 2 + data.stage + state.upgrades.sutra * 1.5))}`, 'Raises spiritual precision and breakthrough poise.']];
    const statHtml = stats.map(([label, value, tip]) => `<span class="cult-stat"${tipAttr(tip)}><small>${label}</small><b>${value}</b></span>`).join('');
    const stageDots = ROMAN.map((num, i) => `<span class="stage-pip ${i < data.stage ? 'done' : i === data.stage ? 'current' : ''}" title="Stage ${num}">${num}</span>`).join('');
    const breakthroughBonus = isBody
      ? `Body breakthroughs grant permanent health, attack and guard. Critical success doubles the tempering reward.`
      : `Spirit breakthroughs grant permanent qi flow, spell power and Dao insight, plus meridian points and realm keys.`;
    return `<article class="cultivation-card ${isBody ? 'body-card' : 'spirit-card'} ${locked ? 'locked' : ''}">
      <div class="cult-card-head">
        <span class="cult-seal">${locked ? '鎖' : realm.seal}</span>
        <div class="cult-card-title">
          <div class="eyebrow">${isBody ? 'BODY CULTIVATION' : 'SPIRIT CULTIVATION'}</div>
          <h2>${locked ? 'Body Path Sealed' : `${realm.name} <em>${ROMAN[data.stage]}</em>`}</h2>
          <small>${locked ? 'Unlocks at Golden Core I' : `Realm ${data.realm + 1} of 15 · Stage ${ROMAN[data.stage]} of X`}</small>
        </div>
        <span class="cult-pill ${isBody ? 'body' : 'spirit'}">${locked ? 'LOCKED' : complete ? 'PATH COMPLETE' : atPeak ? 'STAGE X · BREAKTHROUGH' : 'CULTIVATING'}</span>
      </div>
      ${locked ? `<div class="cult-locked">
        <span class="lock-mark">鎖</span>
        <div><b>The mortal vessel waits.</b><p>Body cultivation awakens when spirit cultivation reaches <b>Golden Core I</b>. Both paths share the same qi; the body path will begin at Mortal Body I.</p>
        <div class="cult-progress-label"><span>SPIRIT PROGRESS TO GOLDEN CORE</span><b>${spiritTitle()} · Realm ${state.spirit.realm + 1}/3</b></div>
        <div class="qi-track"><div class="qi-fill body-fill" style="width:${Math.min(100, state.spirit.realm / 2 * 100)}%"></div></div></div>
      </div>` : `<div class="cult-stage-track">${stageDots}</div>
      <div class="cult-progress-label"><span>${complete ? 'FINAL REALM COMPLETE' : atPeak ? 'MAJOR BREAKTHROUGH REQUIREMENT' : `QI TO REACH STAGE ${ROMAN[data.stage + 1]}`}</span><b>${complete ? 'STAGE X OF X' : `${nfmt(Math.floor(state.qi))} / ${nfmt(cost)} qi`}</b></div>
      <div class="qi-track"><div class="qi-fill ${isBody ? 'body-fill' : ''}" style="width:${complete ? 100 : pct}%"></div></div>
      <div class="cult-next-line"><span>NEXT · <b>${nextLabel}</b></span><span>${complete ? 'waiting at the summit' : atPeak ? `${chance}% success` : 'guaranteed'}</span></div>
      <div class="cult-actions">
        ${complete
          ? `<button class="action-btn ${isBody ? 'body-advance-btn' : 'gold'}" disabled>${isBody ? 'The body path is complete' : 'The spirit path is complete'}<span>${isBody && !spiritMaxed() ? 'continue spirit' : !isBody && !bodyMaxed() ? 'continue body' : 'Beyond the Origin'}</span></button>`
          : atPeak
          ? `<button class="action-btn ${isBody ? 'body-break-btn' : 'gold'}" data-action="${isBody ? 'open-body-break' : 'open-spirit-break'}" ${canPay ? '' : 'disabled'}>${isBody ? 'Begin body tempering trial' : 'Face the heavenly tribulation'}<span>${nfmt(cost)} qi · ${chance}%</span></button>`
          : `<button class="action-btn ${isBody ? 'body-advance-btn' : 'gold'}" data-action="${isBody ? 'advance-body' : 'advance-spirit'}" ${canPay ? '' : 'disabled'}>Advance to ${ROMAN[data.stage + 1]}<span>${nfmt(cost)} qi</span></button>`}
      </div>
      <div class="cult-stats">${statHtml}</div>
      <p class="cult-bonus">${breakthroughBonus}</p>`}
    </article>`;
  }
  function originCardHtml() {
    if (!state.origin?.unlocked) return '';
    const level = state.origin.level || 0;
    const cost = originCost();
    const maxed = level >= 10;
    return `<article class="origin-card">
      <span class="origin-seal">源</span>
      <div class="origin-copy"><div class="eyebrow gold-text">THE HIDDEN FINAL REALM</div><h2>Beyond the Origin <em>${level ? ROMAN[level - 1] : '—'}</em></h2><p>Both roads end at the same summit. What remains is the source before spirit, body and Dao. Each step grants +5% qi, +8% attack, +6% spell power and +4% health.</p><div class="origin-stats"><span>ORIGIN STEP <b>${level} / 10</b></span><span>NEXT COST <b>${maxed ? 'COMPLETE' : nfmt(cost) + ' qi'}</b></span><span>TOTAL BONUS <b>+${level * 5}% qi · +${level * 8}% attack</b></span></div></div>
      <button class="action-btn gold" data-action="advance-origin" ${maxed || state.qi < cost ? 'disabled' : ''}>${maxed ? 'The Origin is complete' : `Step beyond · ${nfmt(cost)} qi`}</button>
    </article>`;
  }
  function renderDualCultivation() {
    const el = $('dualCultivation'); if (!el) return;
    const spirit = state.spirit, body = state.body;
    const sharedPct = Math.min(100, state.qi / Math.max(1, nextPathCost('spirit')) * 100);
    el.innerHTML = `<article class="shared-qi">
      <span class="shared-seal">氣</span>
      <div class="shared-copy"><div class="eyebrow">SHARED QI RESERVOIR</div><h3>${nfmt(Math.floor(state.qi))} qi</h3><p>Spirit and body draw from the same breath. Every stage you choose to refine spends from this one reserve.</p></div>
      <div class="shared-meter"><div class="qi-track"><div class="qi-fill" style="width:${sharedPct}%"></div></div><span>${rateFor().toFixed(1)} qi/sec · ${state.active ? 'meditating' : 'idle cultivation'}</span></div>
      <div class="shared-realms"><span><small>SPIRIT</small><b>${spiritTitle()}</b></span><span><small>BODY</small><b>${body.unlocked ? bodyTitle() : 'Sealed'}</b></span></div>
    </article>
    <div class="dual-path-grid">${pathCardHtml('spirit')}${pathCardHtml('body')}</div>
    ${originCardHtml()}`;
  }
  function timeAgo(ts) {
    const sec = Math.max(0, Math.floor((Date.now() - (ts || Date.now())) / 1000));
    if (sec < 45) return 'just now';
    if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
    return `${Math.floor(sec / 86400)} d ago`;
  }
  function statTile(label, value, tip, cls = '') {
    return `<div class="char-stat ${cls}"${tipAttr(tip)}><small>${label}</small><b>${value}</b></div>`;
  }
  function renderCharacterPanel() {
    const el = $('characterPanel'); if (!el) return;
    const root = rootData(), weapon = equippedWeapon(), comp = activeBeast();
    const goal = requirement(), pct = Math.min(100, state.qi / goal * 100);
    const equippedCount = Object.values(state.equipment || {}).filter(g => g.owned).length + (weapon ? 1 : 0) + (state.forge.equippedArtifacts || []).filter(Boolean).length;
    const treeTotal = pathTreeNodes('body') + pathTreeNodes('spirit') + pathTreeNodes('qi');
    el.innerHTML = `<div class="panel-heading"><div><div class="eyebrow">CULTIVATOR RECORD</div><h3>Character sheet</h3></div><span class="live-chip"><i></i>LIVE</span></div>
      <div class="char-realm">
        <div class="char-seal"${tipAttr(TIP.realm)}>${spiritRealms[state.spirit.realm].cn}</div>
        <div class="char-realm-copy"><small>SPIRIT CULTIVATION</small><b>${spiritTitle()}</b><span>Realm ${state.spirit.realm + 1} / 15 · Stage ${ROMAN[state.spirit.stage]} · ${worldName()}</span></div>
        <div class="char-realm-progress"${tipAttr('Shared qi accumulated toward the next spirit stage or breakthrough.')}><small>NEXT SPIRIT THRESHOLD</small><b>${nfmt(Math.floor(state.qi))} / ${nfmt(goal)}</b><div class="mini-track"><i style="width:${pct}%"></i></div></div>
      </div>
      <div class="char-realm-sub">
        <span${tipAttr(TIP.bodyPath)}><i>${state.body.unlocked ? bodyRealms[state.body.realm].seal : '鎖'}</i><small>BODY CULTIVATION</small><b>${state.body.unlocked ? bodyTitle() : 'Sealed · Golden Core I'}</b></span>
        <span><i>氣</i><small>SHARED QI</small><b>${nfmt(Math.floor(state.qi))} · ${rateFor().toFixed(1)}/s</b></span>
        <span><i>✦</i><small>BREAKTHROUGH</small><b>${state.spirit.stage >= 9 ? spiritBreakChance() + '% spirit' : 'Next at stage X'}${state.body.unlocked && state.body.stage >= 9 ? ` · ${bodyBreakChance()}% body` : ''}</b></span>
      </div>
      <div class="char-section-label">FOUNDATION</div>
      <div class="char-stats">
        ${statTile('HEALTH', `${Math.ceil(state.hp)} / ${state.maxHp}`, TIP.health)}
        ${statTile('ATTACK', nfmt(attackDamage(0)), TIP.attack)}
        ${statTile('GUARD', guardFor(), TIP.guard)}
        ${statTile('CRIT', `${Math.round(critChance() * 100)}%`, TIP.crit)}
        ${statTile('QI FLOW', `${rateFor().toFixed(1)}/s`, TIP.rate)}
        ${statTile('SPIRIT BREAK', state.spirit.stage >= 9 ? `${spiritBreakChance()}%` : 'At stage X', TIP.breakthrough)}
        ${statTile('BODY BREAK', !state.body.unlocked ? 'Sealed' : state.body.stage >= 9 ? `${bodyBreakChance()}%` : 'At stage X', TIP.bodyPath)}
        ${statTile('RESIST', `${Math.round(bodyDamageReduction() * 100)}%`, TIP.bodyPath)}
        ${statTile('LUCK', luckFor(), TIP.luck)}
        ${statTile('GATHERING', `+${Math.round((harvestMult() - 1) * 100)}%`, TIP.gathering)}
      </div>
      <div class="char-section-label">MASTERY</div>
      <div class="char-stats compact">
        ${statTile('DAO LEVELS', `${totalMastery()} / 60`, `${TIP.dao} ${daoTreeNodes()} of ${daoMasteryNodes.length} harmony nodes awakened.`)}
        ${statTile('MERIDIANS', `${openedMeridians()} / ${meridianList.length}`, TIP.meridians)}
        ${statTile('PATH NODES', `${treeTotal} / 18`, TIP.path)}
        ${statTile('SPIRIT POWER', `+${Math.round((spiritPowerMult() - 1) * 100)}%`, TIP.spiritPower)}
        ${statTile('COMPANIONS', Object.keys(state.taming.beasts).length, TIP.companion)}
        ${statTile('ARENA', state.arena?.rank <= 10 ? `#${state.arena.rank}` : '—', 'Your seat in the Sect Arena. Win duels in the Sect Hall to climb the ladder and claim the champion’s laurel.')}
        ${statTile('EQUIPPED', `${equippedCount} pieces`, TIP.weapon)}
      </div>
      <div class="char-loadout">
        <span${tipAttr(TIP.root)}><i>${root ? root.seal : '空'}</i><small>ROOT</small><b>${root ? root.name : 'Unawakened'}</b></span>
        <span${tipAttr(TIP.weapon)}><i>⚔</i><small>WEAPON</small><b>${weapon ? weapon.name : 'Bare hands'}</b></span>
        <span${tipAttr(TIP.companion)}><i>${comp ? comp.icon : '獸'}</i><small>COMPANION</small><b>${comp ? comp.name : 'None'}</b></span>
        <span${tipAttr('Your sect rank grants permanent bonuses and unlocks armory gear and sect buildings.')}><i>${sectData().seal}</i><small>SECT</small><b>${sectRanks[state.sectRank]?.name || 'Outer Disciple'}</b></span>
      </div>
      <div class="char-actions"><button class="action-btn" data-view="paths">Grow foundations</button><button class="action-btn" data-view="dao">Inner Dao</button><button class="action-btn" data-view="codex" data-tab-view="codex" data-action="tab" data-tab="collections">Collections</button></div>`;
  }
  function renderNotifications() {
    const el = $('notificationPanel'); if (!el) return;
    const icons = { breakthrough: '破', rare: '✦', beast: '獸', reward: '◇', sect: '青', forge: '⚒', fate: '運', info: '·' };
    const rows = (state.notifications || []).slice(0, 8).map(n =>
      `<div class="notice-row notice-${n.kind || 'info'}"><span class="notice-icon">${icons[n.kind] || '·'}</span><div><b>${n.text}</b><small>${timeAgo(n.at)}</small></div></div>`
    ).join('');
    el.innerHTML = `<div class="panel-heading"><div><div class="eyebrow">THE SECT WHISPERS</div><h3>Notifications</h3></div><div class="notice-head-actions"><span class="task-progress">${state.notifications?.length || 0}</span>${state.notifications?.length ? '<button class="small-link" data-action="clear-notifications">CLEAR</button>' : ''}</div></div>
      ${rows || '<div class="notice-empty"><span>✧</span><p>No word has reached you yet. Meditate, train, or walk beyond the gate.</p></div>'}`;
  }
  function renderBanners() {
    const el = $('eventBanners'); if (!el) return;
    const cards = [];
    const ev = currentEvent();
    if (ev) {
      const left = Math.max(0, Math.ceil((state.worldEvent.ends - Date.now()) / 1000));
      cards.push(`<div class="banner-card event"><div class="banner-symbol">${ev.seal}</div><div class="banner-body"><small>LIMITED CULTIVATION EVENT · ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</small><b>${ev.name}</b><span>${ev.desc}</span></div><span class="world-event-count">EVENT ACTIVE</span></div>`);
    }
    if (state.ending?.complete) {
      cards.push(`<div class="banner-card ending"><div class="banner-symbol">終</div><div class="banner-body"><small>THE END OF ALL ROADS · JOURNEY COMPLETE</small><b>Beyond the Origin X</b><span>Spirit and body have reached their final rung and the hidden path has been walked to its end. Your legend is complete.</span></div><button class="action-btn gold" data-action="show-ending">View your legend</button></div>`);
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
    closeMobileNav();
    render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- PATHS & PROGRESSION TREES ---------------- */
  function pathTreeHtml(pathId) {
    const tree = pathTrees[pathId];
    const level = state.pathLevels[pathId] || 0;
    const nextLvl = tree.nodes.find(n => level < n.lvl)?.lvl;
    const nodes = tree.nodes.map((node, i) => {
      const active = level >= node.lvl;
      const next = !active && node.lvl === nextLvl;
      return `<div class="tree-node ${active ? 'active' : next ? 'next' : 'locked'}" style="--accent:${tree.accent}"${tipAttr(`${node.name} · Rank ${node.lvl}: ${node.desc}`)}>
        <span class="tree-dot">${active ? '✓' : node.lvl}</span>
        <div><b>${node.name}</b><small>Rank ${node.lvl} · ${node.desc}</small></div>
        ${active ? '<em>OPEN</em>' : next ? `<em>${node.lvl - level} RANK${node.lvl - level === 1 ? '' : 'S'} AWAY</em>` : ''}
      </div>`;
    }).join('');
    return `<div class="path-tree" style="--accent:${tree.accent}">
      <div class="path-tree-head"><span class="tree-seal">${tree.seal}</span><div><h3>${tree.name}</h3><small>RANK ${level} · ${pathTreeNodes(pathId)} / ${tree.nodes.length} NODES</small></div></div>
      <p>${tree.desc}</p>
      <div class="tree-track">${nodes}</div>
    </div>`;
  }
  function renderPaths() {
    const bodyLevel = state.pathLevels.body, spiritLevel = state.pathLevels.spirit, qiLevel = state.pathLevels.qi;
    const bodyCost = 50 + bodyLevel * 45, spiritCost = 50 + spiritLevel * 45, qiCost = 40 + qiLevel * 35;
    const cards = [
      { id: 'body', name: 'Body cultivation', seal: '體', eyebrow: 'THE IRON VESSEL', desc: 'Temper bone, blood, and breath. Body ranks increase health and empower crushing physical strikes.', level: bodyLevel, cost: bodyCost, action: 'Temper the body', good: state.qi >= bodyCost && state.stones >= 5, cls: 'body-path', label: 'BODY REALM' },
      { id: 'spirit', name: 'Soul cultivation', seal: '神', eyebrow: 'THE IMMORTAL SPIRIT', desc: 'Expand your sea of consciousness. Soul ranks strengthen spiritual arts, insight and breakthroughs.', level: spiritLevel, cost: spiritCost, action: 'Refine the soul', good: state.qi >= spiritCost && state.stones >= 5, cls: 'spirit-path', label: 'SOUL REALM' },
      { id: 'qi', name: 'Qi cultivation', seal: '氣', eyebrow: 'THE FLOWING BREATH', desc: 'Refine the quality of your qi. Qi ranks deepen meditation, stone trickles and meridian recovery.', level: qiLevel, cost: qiCost, action: 'Circulate the qi', good: state.qi >= qiCost && state.stones >= 8, cls: 'qi-path', label: 'QI REALM' }
    ];
    const cardHtml = cards.map(c => `<article class="path-card ${c.cls}"><div class="path-seal">${c.seal}</div><div class="eyebrow">${c.eyebrow}</div><h2>${c.name}</h2><p>${c.desc}</p><div class="path-level">${c.label} <b>Rank ${c.level}</b></div><div class="inventory-row"${tipAttr(TIP.path)}><span>Training requirement</span><b>${nfmt(c.cost)} qi · ${c.id === 'qi' ? 8 : 5} stones</b></div><button class="action-btn" data-action="train-path" data-id="${c.id}" ${c.good ? '' : 'disabled'}>${c.action}</button><small class="subtle">Every 5 ranks grants 1 meridian point. Milestones open permanently at ranks 2, 4, 6, 9, 12 and 15.</small></article>`).join('');
    const daoBranches = daoPaths.map(d => {
      const lv = daoLevel(d.id);
      return `<div class="dao-branch" style="--dao:${d.color}"${tipAttr(`${d.name} · Level ${lv} / 10. ${d.passive}. ${d.ability}`)}><span class="dao-branch-seal">${d.seal}</span><div class="dao-branch-body"><div><b>${d.name}</b><small>LV ${lv} / 10 · ${masteryName(lv).toUpperCase()}</small></div>${progressLine(lv, 10)}<div class="dao-stars">${[3, 6, 9].map(n => `<span class="${lv >= n ? 'on' : ''}">${lv >= n ? '✦' : '·'} <small>Lv ${n}</small></span>`).join('')}</div></div></div>`;
    }).join('');
    const harmony = daoMasteryNodes.map(n => `<div class="harmony-node ${totalMastery() >= n.total ? 'active' : ''}"${tipAttr(n.desc)}><span>${totalMastery() >= n.total ? '✦' : n.total}</span><div><b>${n.name}</b><small>${n.total} total Dao levels · ${n.desc}</small></div></div>`).join('');
    const twinCards = [
      { path: 'spirit', data: state.spirit, realm: spiritRealms[state.spirit.realm], title: spiritTitle(), next: nextSpiritTitle(), cost: nextPathCost('spirit'), locked: false },
      { path: 'body', data: state.body, realm: bodyRealms[state.body.realm], title: state.body.unlocked ? bodyTitle() : 'Sealed', next: state.body.unlocked ? nextBodyTitle() : 'Golden Core I', cost: state.body.unlocked ? nextPathCost('body') : 0, locked: !state.body.unlocked }
    ].map(c => `<article class="twin-path-card ${c.path} ${c.locked ? 'locked' : ''}"><span class="twin-seal">${c.locked ? '鎖' : c.realm.seal}</span><div><div class="eyebrow">${c.path === 'spirit' ? 'SPIRIT CULTIVATION' : 'BODY CULTIVATION'}</div><h3>${c.title}</h3><p>${c.locked ? 'Unlocks when spirit cultivation reaches Golden Core I.' : `Next · ${c.next} · ${nfmt(c.cost)} qi`}</p></div><button class="action-btn" data-view="cultivate">${c.locked ? 'View spirit path' : 'Open cultivation'}</button></article>`).join('');
    $('view-paths').innerHTML = `${subHead('TWIN ROADS TO IMMORTALITY', 'Cultivation paths', 'Refine the spirit and temper the body as two independent realms. Both spend the same qi, but each breakthrough is faced alone.', '☯')}
      <article class="content-panel twin-cultivation-panel"><div class="panel-heading"><div><div class="eyebrow">THE TWO GREAT ROADS</div><h2>Spirit and body</h2></div><span class="stat-pill gold">SHARED QI · ${nfmt(Math.floor(state.qi))}</span></div><p>Spirit cultivation governs qi flow, spell power and Dao insight. Body cultivation governs health, physical attack, guard and damage resistance. Stages I–IX are guaranteed qi upgrades; stage X opens a major breakthrough.</p><div class="twin-path-grid">${twinCards}</div></article>
      <div class="path-choice-grid three">${cardHtml}</div>
      <div class="tree-grid">${pathTreeHtml('body')}${pathTreeHtml('spirit')}${pathTreeHtml('qi')}</div>
      <article class="content-panel"><div class="eyebrow">THE INNER DAO TREE · ${totalMastery()} / 60 LEVELS</div><h2>Six laws, one understanding</h2><p>Every Dao is a branch of the same tree. Levels 3, 6 and 9 awaken milestones within each law. When your total mastery reaches 6, 12, 18, 24 and 30, harmony nodes open across every path.</p><div class="dao-tree">${daoBranches}</div><div class="harmony-track">${harmony}</div></article>
      <article class="content-panel path-note"><div class="eyebrow">YOUR FOUNDATION</div><h2>No path is a dead end</h2><p>Body realm progression raises health, physical damage, guard and resistance. Spirit realm progression deepens qi flow, spell power, spiritual control and Dao comprehension. Foundation training below adds another permanent layer to both.</p><p class="small-note">Base qi growth: ${qiBase().toFixed(1)} qi/sec. Your shared reservoir is ${nfmt(Math.floor(state.qi))} qi.</p><div class="feature-stats"><span>SPIRIT REALM <b>${spiritTitle()}</b></span><span>BODY REALM <b>${state.body.unlocked ? bodyTitle() : 'Sealed'}</b></span><span>BODY RANK <b>${bodyLevel}</b></span><span>SOUL RANK <b>${spiritLevel}</b></span><span>QI RANK <b>${qiLevel}</b></span><span>QI FLOW <b>${rateFor().toFixed(1)} / sec</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">TWO KINDS OF BREAKTHROUGH</div><h2>Lightning and iron</h2><p>Spirit breakthroughs are heavenly tribulations shaped by Dao comprehension, tribulation pills and the Formation Hall. Body breakthroughs are endurance trials shaped by body attributes and the Jade Body Tempering technique. Both succeed between 20% and 95%; failure leaves you at stage X and scatters 10% of your qi.</p><div class="stat-pills"><span class="stat-pill gold">Spirit chance · ${state.spirit.stage >= 9 ? `${spiritBreakChance()}%` : 'at stage X'}</span><span class="stat-pill ${state.body.unlocked ? 'green' : 'red'}">Body chance · ${!state.body.unlocked ? 'sealed' : state.body.stage >= 9 ? `${bodyBreakChance()}%` : 'at stage X'}</span><span class="stat-pill">Meridian points · ${state.meridians.points}</span><span class="stat-pill violet">Dao insight · ${state.daoPoints}</span></div></article>`;
  }

  /* ---------------- TECHNIQUES ---------------- */
  function renderTechniques() {
    let body;
    if (uiTabs.techniques === 'arts') {
      const cards = martialArts.map(a => {
        const learned = state.activeArts.includes(a.id);
        const rank = artRank(a.id);
        const can = state.stage >= a.req && state.stones >= a.cost;
        const trainCost = Math.round(150 * Math.pow(rank + 1, 1.45));
        const trainQi = Math.round(60 * (rank + 1));
        const canTrain = learned && rank < 5 && state.stones >= trainCost && state.qi >= trainQi;
        return `<article class="technique-card"><div class="tech-seal">${a.seal}</div><div class="tech-copy"><h3>${a.name}</h3><p>${a.desc}</p><div class="tech-level">${learned ? `RANK ${rank} / 5 · ${a.qi} QI · ${Math.round(a.damage * artDamageMult(a.id))} BASE DAMAGE` : `REQUIRES STAGE ${a.req} · ${a.cost} STONES`}</div></div>${learned ? `<button class="buy-btn" data-action="train-art" data-id="${a.id}" ${canTrain ? '' : 'disabled'}>${rank >= 5 ? 'Mastered' : `Attune rank ${rank + 1}`}<span>${rank >= 5 ? 'MAX RANK' : `◇ ${nfmt(trainCost)} · ${trainQi} qi`}</span></button>` : `<button class="buy-btn" data-action="unlock-art" data-id="${a.id}" ${can ? '' : 'disabled'}>Learn<span>◇ ${a.cost}</span></button>`}</article>`;
      }).join('');
      body = `<article class="content-panel"><div class="eyebrow">MARTIAL ARTS · MASTERY</div><h2>Battle techniques</h2><p>Active arts appear in every battle, boss fight and arena duel. Attune a learned art to raise its rank from 1 to 5; each rank adds 18% base damage. Arts also scale with spirit cultivation, your weapon and your Dao.</p>${cards}</article>`;
    } else {
      const cards = techniques.map(t => {
        const level = state.upgrades[t.id] || 0, cost = Math.ceil(t.base * Math.pow(level + 1, 1.55));
        const locked = state.stage < t.req;
        const can = !locked && state.stones >= cost;
        return `<article class="technique-card"><div class="tech-seal">${t.seal}</div><div class="tech-copy"><h3>${t.name}</h3><p>${t.desc}</p><div class="tech-level">RANK ${level} · ${t.effect}${locked ? ` · REQUIRES STAGE ${t.req}` : ''}</div></div><button class="buy-btn" data-action="upgrade" data-id="${t.id}" ${can ? '' : 'disabled'}>${locked ? 'Locked' : 'Attune'}<span>${locked ? `Stage ${t.req}` : `◇ ${cost}`}</span></button></article>`;
      }).join('');
      body = `<article class="content-panel"><div class="eyebrow">SEVEN SCROLLS AWAIT</div><h2>Choose what to cultivate</h2><p>Each technique may be attuned again and again. Higher ranks demand more spirit stones, but their effects endure. Deeper sutras unlock at stages 2, 3, 5, 6, 8 and 10.</p>${cards}</article>`;
    }
    $('view-techniques').innerHTML = `${subHead('THE SECT LIBRARY', 'Cultivation techniques', 'Master ancient arts to deepen your foundation, or learn battle arts to break your limits.', '☯')}
      ${tabs('techniques', [['passive', 'Passive sutras'], ['arts', 'Martial arts']])}
      <div class="subview-layout"><div class="subview-main">${body}</div><aside class="subview-aside">
      <article class="feature-card"><div class="eyebrow">CURRENTLY PRACTICING</div><h3>${state.active ? 'Clear your mind' : 'A quiet mind is a clear vessel'}</h3><p>${state.active ? `Your breath gathers ${rateFor().toFixed(1)} qi each second — ${qiBase().toFixed(1)} base before bonuses. Let the cycle continue.` : `Base qi growth is ${qiBase().toFixed(1)} per second. Begin meditation from the Cultivation Grove to gather vital essence even while you explore the sect.`}</p><div class="feature-stats"><span>QI FLOW <b>${rateFor().toFixed(1)} / sec</b></span><span>BREAKTHROUGH <b>${breakChance()}%</b></span><span>ARTS LEARNED <b>${state.activeArts.length} / ${martialArts.length}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">LEARNER'S NOTE</div><h2>Attunement</h2><p>Spend spirit stones to bind a scroll to your meridians. Effects are permanent and stack with each rank. Martial arts are learned once and can be used in every battle. Higher sutras require deeper realms.</p><div class="inventory-row"><span>Spirit stones</span><b>◇ ${nfmt(state.stones)}</b></div><div class="inventory-row"><span>Current realm</span><b>${realmTitle()}</b></div></article>
      </aside></div>`;
  }

  /* ---------------- EXPEDITIONS & WORLD MAP ---------------- */
  function selectedRegionId() {
    if (!worldRegions.some(r => r.id === uiTabs.expeditions)) uiTabs.expeditions = 'mistwood';
    return uiTabs.expeditions;
  }
  function renderRegionMap() {
    const nodes = worldRegions.map(region => {
      const rs = regionState(region.id), locked = state.stage < region.req;
      const found = rs.found.length, total = region.landmarks.length;
      return `<button class="region-node ${selectedRegionId() === region.id ? 'selected' : ''} ${locked ? 'locked' : ''} ${found >= total ? 'complete' : ''}" style="--x:${region.x}%;--y:${region.y}%" data-action="select-region" data-id="${region.id}"${tipAttr(`${region.name} · ${locked ? `Requires stage ${region.req}` : `${found} / ${total} discoveries charted.`}`)}><span class="region-seal">${region.seal}</span><b>${region.name}</b><small>${locked ? `STAGE ${region.req}` : `${found} / ${total} FOUND`}</small></button>`;
    }).join('');
    return `<article class="content-panel region-panel"><div class="panel-heading"><div><div class="eyebrow">THE KNOWN WORLD · ${worldRegions.reduce((a, r) => a + regionFoundCount(r.id), 0)} / ${worldRegions.reduce((a, r) => a + r.landmarks.length, 0)} DISCOVERIES</div><h2>Region map</h2></div><span class="stat-pill gold">${worldRegions.filter(r => regionComplete(r.id)).length} fully charted</span></div><p>Chart the lands beyond the sect gate. Each region hides three discoveries; rarer places demand a deeper realm and greater luck.</p><div class="region-map"><div class="region-map-glow"></div><div class="region-ridge ridge-a"></div><div class="region-ridge ridge-b"></div><div class="region-ridge ridge-c"></div><div class="region-map-lines"></div>${nodes}</div></article>`;
  }
  function renderRegionDetail() {
    const region = regionData(selectedRegionId()) || worldRegions[0];
    const rs = regionState(region.id);
    const locked = state.stage < region.req;
    const found = rs.found.length, total = region.landmarks.length;
    const surveyCost = { qi: 20 + region.req * 3, stones: 10 + region.req * 2 };
    const canSurvey = !locked && state.qi >= surveyCost.qi && state.stones >= surveyCost.stones;
    const landmarkRows = region.landmarks.map(lm => {
      const known = rs.found.includes(lm.id);
      return `<div class="landmark ${known ? 'found' : ''} ${lm.rare ? 'rare' : ''}"${tipAttr(known ? `${lm.desc} ${lm.lore}` : `An undiscovered place. Survey the region to reveal it. ${lm.rare ? 'This is a rare site.' : ''}`)}><span class="landmark-seal">${known ? lm.seal : '?'}</span><div><b>${known ? lm.name : 'Undiscovered site'}</b><small>${known ? lm.lore : lm.rare ? 'A rare site waits somewhere in this region.' : 'Somewhere beyond the marked trails.'}</small></div>${known ? `<span class="stat-pill green">${lm.rare ? 'RARE' : 'FOUND'}</span>` : '<span class="stat-pill">?</span>'}</div>`;
    }).join('');
    const trip = expeditions.find(t => t.id === region.trip);
    return `<article class="content-panel region-detail"><div class="panel-heading"><div><div class="eyebrow">REGION DOSSIER · ${region.seal} ${region.seal ? region.name.toUpperCase() : ''}</div><h2>${region.name}</h2></div><span class="stat-pill ${found >= total ? 'gold' : 'green'}">${found} / ${total}</span></div><p>${region.desc}</p><div class="region-meta-row"><span>REQUIRES STAGE ${region.req}</span><span>SURVEYS ${rs.surveys || 0}</span><span>JOURNEYS ${rs.visits || 0}</span></div><div class="landmark-list">${landmarkRows}</div><div class="inline-actions"><button class="action-btn gold" data-action="survey-region" data-id="${region.id}" ${canSurvey && found < total ? '' : 'disabled'}>${locked ? `Requires stage ${region.req}` : found >= total ? 'Region fully charted' : `Survey the wilds · ${surveyCost.qi} qi · ◇ ${surveyCost.stones}`}</button>${trip ? `<button class="action-btn" data-action="start-trip" data-id="${trip.id}" ${locked || state.trip ? 'disabled' : ''}>${state.trip ? 'Already away' : `Set out · ${trip.name}`}</button>` : ''}</div><p class="small-note">Surveys cost qi and spirit stones. Luck raises the chance of finding a rare site. Every discovery grants resources and is recorded in your journal.</p></article>`;
  }
  function renderExpeditions() {
    const region = regionData(selectedRegionId()) || worldRegions[0];
    const rs = regionState(region.id);
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
      const linked = worldRegions.find(r => r.trip === t.id);
      return `<article class="expedition-card ${locked ? 'locked-card' : ''} ${linked?.id === region.id ? 'in-region' : ''}"><div class="expedition-art">${t.icon}</div><div><h3>${t.name}</h3><p>${t.desc}</p><div class="exp-meta"><span>◷ ${tripDuration(t)}s</span><span>◇ ${t.reward + state.stage * 2} stones</span><span>✿ ${lootText}</span>${locked ? `<span>REQUIRES STAGE ${t.req}</span>` : ''}</div>${active ? tripState() : ''}</div>${locked ? '<button class="action-btn" disabled>Locked</button>' : state.trip ? (ready && active ? '<button class="action-btn" data-action="collect-trip">Collect</button>' : `<button class="action-btn" disabled>${active ? 'In progress' : 'Away'}</button>`) : `<button class="action-btn" data-action="start-trip" data-id="${t.id}">Set out</button>`}</article>`;
    }).join('');
    const log = (state.discoveries?.log || []).slice(0, 6).map(entry => {
      const r = regionData(entry.region);
      return `<div class="discovery-log-row"><span>${r?.seal || '✦'}</span><div><b>${entry.name}</b><small>${r?.name || 'Unknown region'} · ${timeAgo(entry.at)}</small></div></div>`;
    }).join('');
    $('view-expeditions').innerHTML = `${subHead('BEYOND THE SECT WALLS', 'Expeditions & discoveries', 'The world is vast. Chart its regions, uncover what the wilds hide, and bring back what they offer.', '⌁')}
      ${renderRegionMap()}
      <div class="subview-layout"><div class="subview-main">${renderRegionDetail()}
      <article class="content-panel"><div class="eyebrow">AVAILABLE JOURNEYS</div><h2>Choose a path</h2><p>Send your spirit out into the world. You can continue cultivating while an expedition is underway. Collecting a journey also records a visit to its region. Higher realms and the Space Dao shorten the road.</p>${cards}</article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">TRAVELER'S LEDGER</div><h3>${state.completedTrips} journeys completed</h3><p>Every safe return brings new resources to the sect. Fortune favors the well-prepared wanderer.</p><div class="feature-stats"><span>STONE YIELD <b>+${state.stage * 2} / trip</b></span><span>LUCK <b>${luckFor()}</b></span><span>DISCOVERIES <b>${worldRegions.reduce((a, r) => a + regionFoundCount(r.id), 0)}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">DISCOVERY JOURNAL</div><h2>The road remembers</h2>${log || '<p class="small-note">No discoveries yet. Survey a region or complete a journey to begin your journal.</p>'}</article>
      <article class="content-panel"><div class="eyebrow">RARE FINDS</div><h2>What the wilds hide</h2><p>Rare sites hold realm keys, relics and mystic eggs. High-luck cultivators also find treasure maps, lost relics and hidden inheritances. Secret Realms hold even greater dangers and rewards.</p><button class="action-btn" data-view="inherit">Visit secret realms</button></article>
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
    const enemyCard = enemy ? `<div class="enemy-card"><div class="enemy-glyph">${enemy.icon}</div><div class="enemy-info"><div class="eyebrow">${sects[enemy.sect]?.name || 'WILDERNESS'} ENCOUNTER · ${enemy.elite ? 'ELITE · ' : ''}REALM ${enemy.level || state.stage + 1}</div><h2>${enemy.name}</h2><div class="health-label"><span>HEALTH</span><b>${Math.max(0, Math.ceil(enemy.hp))} / ${enemy.maxHp}</b></div><div class="health-track"><i style="width:${Math.max(0, enemy.hp / enemy.maxHp * 100)}%"></i></div></div></div><div class="combat-actions"><button class="action-btn body-strike" data-action="attack" data-style="body">Body strike · ${attackDamage(3 + state.pathLevels.body * 4 + state.stage)}–${attackDamage(7 + state.pathLevels.body * 5 + state.stage)} dmg</button><button class="action-btn spirit-strike" data-action="attack" data-style="spirit" ${state.qi < 8 ? 'disabled' : ''}>Spirit art · ${spiritStrike(6 + state.pathLevels.spirit * 5 + state.stage)}–${spiritStrike(12 + state.pathLevels.spirit * 6 + state.stage)} dmg · 8 qi</button><button class="action-btn sect-spell" data-action="cast-spell" ${state.qi < spell.cost ? 'disabled' : ''}>${spell.seal} ${spell.name} · ${spiritStrike(spell.damage + state.pathLevels.spirit * 4 + state.stage)} dmg · ${spell.cost} qi</button>${artButtons()}<button class="action-btn" data-action="flee">Retreat</button></div>` : `<div class="encounter-empty"><div class="empty-mark">⚔</div><h2>The forest is quiet—for now.</h2><p>Seek a ${sectData().name} spirit beast to test your cultivation. Victory earns spirit stones, sect merit, and a chance at rare ingredients, eggs and map fragments.</p><button class="action-btn" data-action="seek-enemy">Seek a spirit beast</button></div>`;
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
    else if (tab === 'vault') body = renderSectVault();
    else if (tab === 'duties') body = renderSectDuties();
    else if (tab === 'arena') body = renderArena();
    else body = renderSectOverview();
    $('view-sect').innerHTML = `${subHead('THE GREAT SECTS', 'Sect Hall', 'Choose a sect, complete its missions, climb its rankings, raise its halls, and serve its daily needs.', sectData().seal)}
      ${tabs('sect', [['overview', 'Overview'], ['arena', 'Arena'], ['missions', 'Missions'], ['rankings', 'Rankings'], ['buildings', 'Buildings'], ['armory', 'Armory'], ['vault', 'Vault'], ['duties', 'Duties']])}
      ${body}`;
  }
  function renderSectOverview() {
    const rank = sectRanks[state.sectRank] || sectRanks[0], next = sectRanks[state.sectRank + 1];
    const progress = next ? Math.min(100, state.sectRep / next.need * 100) : 100;
    const sectCards = Object.entries(sects).map(([id, sect]) => {
      const stageLocked = state.stage < 4 && state.sectId !== id;
      return `<article class="sect-choice ${state.sectId === id ? 'selected' : ''}"><div class="tech-seal">${sect.seal}</div><h3>${sect.name}</h3><p>${sect.bonus}</p>${stageLocked ? '<div class="tech-level">REQUIRES STAGE 4</div>' : ''}<button class="action-btn" data-action="join-sect" data-id="${id}" ${state.sectId === id || stageLocked ? 'disabled' : ''}>${state.sectId === id ? 'Current sect' : stageLocked ? 'Requires stage 4' : 'Join sect'}</button></article>`;
    }).join('');
    const ranks = sectRanks.map((r, i) => `<div class="sect-rank ${i <= state.sectRank ? 'unlocked' : ''}"><span>${i <= state.sectRank ? '✦' : '·'}</span><div><b>${r.name}</b><small>${r.need} merit</small></div>${i === state.sectRank ? '<em>CURRENT</em>' : ''}</div>`).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">CHOOSE YOUR ALLIANCE</div><h2>Three sects, three disciplines</h2><div class="sect-choice-grid">${sectCards}</div><div class="feature-stats"><span>SECT RANK BONUS <b>+${state.sectRank * 3}% attack · +${state.sectRank * 2}% qi</b></span><span>FACTION BONUS <b>${sectData().bonus}</b></span><span>BUILDINGS <b>${Object.values(state.sectBuildings).reduce((a, b) => a + b, 0)} levels</b></span></div></article>
    <article class="content-panel sect-progress"><div class="eyebrow">YOUR STANDING · ${sectData().name}</div><h2>${rank.name}</h2><p>${next ? `${next.need - state.sectRep} merit until promotion to ${next.name}.` : 'You have reached the highest sect rank.'}</p><div class="mini-track"><i style="width:${progress}%"></i></div><div class="inventory-row"><span>Sect merit</span><b>${state.sectRep} / ${next?.need || 'MAX'}</b></div><div class="inventory-row"><span>Sect tokens</span><b>✦ ${nfmt(state.sectTokens)}</b></div><button class="action-btn" data-action="donate" ${state.stones < 10 || !next ? 'disabled' : ''}>Donate 10 spirit stones · +4 merit</button></article>
    <article class="content-panel"><div class="eyebrow">THE LADDER OF SERVICE</div><h2>Disciple ranks</h2><div class="sect-rank-list">${ranks}</div></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">SECT BLESSINGS</div><h3>${worldName()}</h3><p>Your sect grants a permanent cultivation bonus and access to its armory. Rank furthers both. Sect buildings add another layer of permanent strength.</p><div class="feature-stats"><span>RANK <b>${rank.name}</b></span><span>MERIT <b>${state.sectRep}</b></span><span>TOKENS <b>${nfmt(state.sectTokens)}</b></span></div></article>
    <article class="content-panel"><div class="eyebrow">TODAY'S DUTY</div><h2>Sect missions</h2><p>Hunt beasts, chart expeditions, and fell world bosses to earn tokens and merit. Missions scale with your realm.</p><button class="action-btn" data-tab-view="sect" data-action="tab" data-tab="missions">Open mission board</button></article>
    <article class="content-panel"><div class="eyebrow">THE STONE RING</div><h2>${arenaRankTitle()}</h2><p>${state.arena?.rank <= 10 ? `You hold rank ${state.arena.rank} of ten. The next seat is one duel away.` : 'Ten rivals hold the arena ladder. Claim a seat, then climb toward the champion’s pedestal.'}</p><div class="feature-stats"><span>WINS <b>${state.arena?.wins || 0}</b></span><span>FELLED <b>${Object.keys(state.arena?.defeated || {}).length} / 10</b></span></div><button class="action-btn" data-tab-view="sect" data-action="tab" data-tab="arena">Enter the arena</button></article></aside></div>`;
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
      const rankLocked = state.sectRank < (b.reqRank || 0);
      const rankName = sectRanks[b.reqRank || 0]?.name || 'Outer Disciple';
      const can = lv < 10 && !rankLocked && state.stones >= stones && state.sectTokens >= tokens;
      return `<article class="building-card ${rankLocked ? 'locked' : ''}"><div class="tech-seal">${b.seal}</div><h3>${b.name}</h3><p>${b.desc}</p><div class="building-level"><span>LEVEL ${lv} / 10</span><span>${b.perk}</span></div>${rankLocked ? `<div class="tech-level">REQUIRES ${rankName.toUpperCase()}</div>` : ''}${progressLine(lv, 10)}<button class="action-btn" data-action="upgrade-building" data-id="${b.id}" ${can ? '' : 'disabled'}>${lv >= 10 ? 'Fully built' : rankLocked ? `Requires ${rankName}` : `Upgrade · ◇ ${nfmt(stones)} · ✦ ${tokens}`}</button></article>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">SECT CONSTRUCTION · TOKENS ${nfmt(state.sectTokens)}</div><h2>Raise the halls</h2><p>Buildings grant permanent bonuses to every disciple. Each level costs spirit stones and sect tokens; deeper halls open as your sect rank rises.</p><div class="building-grid">${cards}</div></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">BUILDING BONUSES</div><h3>Strong foundations</h3><p>Meditation Hall · qi flow<br>Herb Garden · gathering<br>Beast Pen · taming<br>Formation Hall · breakthrough<br>Refining Armory · weapon power<br>Scripture Library · dao insight</p><div class="feature-stats"><span>TOTAL LEVELS <b>${Object.values(state.sectBuildings).reduce((a, b) => a + b, 0)}</b></span></div></article></aside></div>`;
  }
  function renderArmory() {
    const equipment = gearCatalog.map(item => {
      const gear = state.equipment[item.id], upgradeCost = 35 * (gear.level + 1);
      const rankLocked = state.sectRank < (item.reqRank || 0);
      const rankName = sectRanks[item.reqRank || 0]?.name || 'Outer Disciple';
      return `<article class="gear-card ${rarityClass(item.rarity)}"><div class="tech-seal">${item.seal}</div><h3>${item.name}</h3><span class="rarity-tag">${item.rarity.toUpperCase()}</span><p>${item.bonus}</p><div class="tech-level">${gear.owned ? `EQUIPPED · LEVEL ${gear.level}` : rankLocked ? `REQUIRES ${rankName.toUpperCase()}` : 'NOT OWNED'}</div>${gear.owned ? `<button class="action-btn" data-action="upgrade-gear" data-id="${item.id}" ${state.stones < upgradeCost || gear.level >= 10 || rankLocked ? 'disabled' : ''}>${rankLocked ? `Requires ${rankName}` : gear.level >= 10 ? 'Max level' : `Upgrade · ◇ ${upgradeCost}`}</button>` : `<button class="action-btn" data-action="buy-gear" data-id="${item.id}" ${rankLocked || state.sectTokens < item.tokens ? 'disabled' : ''}>${rankLocked ? `Requires ${rankName}` : `Buy · ${item.tokens} sect tokens`}</button>`}</article>`;
    }).join('');
    const weapon = equippedWeapon();
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">ARMORY · TOKENS ${nfmt(state.sectTokens)} · STONES ${nfmt(state.stones)}</div><h2>Equipment and refinement</h2><p>Buy each gear piece with sect tokens, then spend spirit stones to upgrade its bonus. Better gear is reserved for higher sect ranks; advanced weapons and artifacts are forged in the Forge.</p><div class="gear-grid">${equipment}</div></article>
    <article class="content-panel"><div class="eyebrow">CURRENT WEAPON</div><h2>${weapon ? weapon.name : 'No weapon equipped'}</h2><p>${weapon ? `${weapon.rarity} · +${weapon.totalAttack} attack · Refine ${weapon.refine}/10${weapon.awakened ? ' · Awakened' : ''}` : 'A cultivator without a weapon is still dangerous, but not as dangerous as one with a legendary blade.'}</p><button class="action-btn" data-view="forge">Open the forge</button></article></div>
    <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">ARMORY KEEPER</div><h3>Tokens well spent</h3><p>Gear provides flat attack, qi flow, health and guard. Refinement in the Forge multiplies a weapon’s base attack and can awaken a unique ability. Raise your sect rank to unlock the full armory.</p><div class="feature-stats"><span>ATTACK <b>${attackDamage(0)}</b></span><span>GUARD <b>${guardFor()}</b></span><span>MAX HP <b>${maxHpFor()}</b></span></div></article></aside></div>`;
  }

  function renderSectVault() {
    const cards = sectVault.map(item => {
      const can = state.sectTokens >= item.tokens;
      return `<article class="vault-card"${tipAttr(`${item.name} · ${item.desc} Grants ${rewardsText(item.grant)}.`)}><span class="vault-seal">${item.seal}</span><div><h3>${item.name}</h3><p>${item.desc}</p><small>${rewardsText(item.grant)}</small></div><button class="action-btn" data-action="buy-vault" data-id="${item.id}" ${can ? '' : 'disabled'}>✦ ${item.tokens}</button></article>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">SECT VAULT · TOKENS ${nfmt(state.sectTokens)}</div><h2>Supplies of the sect</h2><p>The vault exchanges tokens for rare materials, keys, eggs and relics. Stock is permanent, but each purchase spends the tokens you have earned in service.</p><div class="vault-grid">${cards}</div></article>
      <article class="content-panel"><div class="eyebrow">TOKEN SOURCES</div><h2>Earn what you spend</h2><p>Missions, world bosses, sect duties, ranking stipends and the daily practice reward all grant sect tokens. Higher ranks unlock more of the armory and the deeper halls.</p><div class="inline-actions"><button class="action-btn" data-action="tab" data-tab-view="sect" data-tab="missions">Mission board</button><button class="action-btn" data-action="tab" data-tab-view="sect" data-tab="duties">Daily duties</button></div></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">VAULT KEEPER</div><h3>${nfmt(state.sectTokens)} tokens available</h3><p>Sect tokens are shared across the armory, the vault and the building halls. Spend them where they will carry you furthest.</p><div class="feature-stats"><span>RANK <b>${sectRanks[state.sectRank]?.name}</b></span><span>MERIT <b>${state.sectRep}</b></span><span>TOKENS <b>${nfmt(state.sectTokens)}</b></span></div></article></aside></div>`;
  }
  function renderSectDuties() {
    const doneToday = state.sectPerks?.dutyDate === dayIndex();
    const blessing = state.sectPerks?.blessing && (state.sectPerks?.blessingUntil || 0) > Date.now() ? state.sectPerks.blessing : null;
    const cards = sectDuties.map(duty => {
      const qiCost = Math.abs(duty.qi || 0);
      const can = !doneToday && state.qi >= qiCost;
      return `<article class="duty-card"${tipAttr(`${duty.name} · ${duty.desc}`)}><span class="duty-seal">${duty.seal}</span><div><h3>${duty.name}</h3><p>${duty.desc}</p><small>${duty.qi ? `${qiCost} qi · ` : ''}${duty.merit} merit · ${duty.tokens} tokens${duty.stones ? ` · ◇ ${duty.stones}` : ''}${duty.dao ? ' · Dao insight' : ''}</small></div><button class="action-btn" data-action="perform-duty" data-id="${duty.id}" ${can ? '' : 'disabled'}>${doneToday ? 'Served today' : state.qi < qiCost ? `Needs ${qiCost} qi` : 'Serve'}</button></article>`;
    }).join('');
    const blessingNames = { qi: '+25% qi flow', attack: '+15% attack', break: '+5% breakthrough' };
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">DAILY SERVICE · ${doneToday ? 'COMPLETE' : 'ONE DUTY PER DAY'}</div><h2>The sect asks little</h2><p>Humble work earns merit, tokens and a temporary blessing. Choose one duty each game day. The blessing lasts five minutes and applies immediately to every calculation.</p><div class="duty-list">${cards}</div></article>
      <article class="content-panel"><div class="eyebrow">SERVICE RECORD</div><h2>What duty has taught you</h2><div class="feature-stats"><span>MERIT <b>${state.sectRep}</b></span><span>TOKENS <b>${nfmt(state.sectTokens)}</b></span><span>TODAY <b>${doneToday ? 'SERVED' : 'OPEN'}</b></span></div></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">CURRENT BLESSING</div><h3>${blessing ? blessingNames[blessing] : 'No blessing active'}</h3><p>${blessing ? 'The sect’s regard follows you into cultivation and combat.' : 'Serve a duty to receive a temporary blessing from the hall elders.'}</p><div class="feature-stats"><span>DUTY DATE <b>${doneToday ? 'Today' : 'Available'}</b></span><span>RANK <b>${sectRanks[state.sectRank]?.name}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">THE QUIET WORK</div><h2>Why sweep?</h2><p>Merit accumulates toward promotion. Each rank grants permanent attack, qi and health bonuses, and unlocks deeper armory stock and sect buildings.</p></article></aside></div>`;
  }

  /* ---------------- SECT ARENA ---------------- */
  function arenaRankTitle(rank = state.arena?.rank || 11) {
    if (rank <= 1) return 'Sect Champion';
    if (rank <= 3) return 'Sect Elite';
    if (rank <= 6) return 'Inner Ring Duelist';
    if (rank <= 10) return 'Outer Ring Duelist';
    return 'Unranked Challenger';
  }
  function nextArenaRival() {
    return arenaRivals.find(r => r.rank === (state.arena?.rank || 11) - 1) || null;
  }
  function arenaRivalStats(def) {
    const wins = state.arena?.defeated?.[def.id] || 0;
    return { maxHp: Math.round(def.hp * (1 + wins * .12)), damage: Math.round(def.damage * (1 + wins * .08)) };
  }
  function renderArena() {
    const rank = state.arena?.rank || 11;
    const wins = state.arena?.wins || 0;
    const cleared = Object.keys(state.arena?.defeated || {}).length;
    const next = nextArenaRival();
    const battle = state.arena?.battle;
    const champion = arenaRivals.find(r => r.rank === 1);
    const progress = clamp((11 - rank) / 10 * 100, 0, 100);
    let battleHtml = '';
    if (battle) {
      const def = arenaRivals.find(r => r.id === battle.id);
      const stats = def ? arenaRivalStats(def) : null;
      const pct = clamp(battle.hp / battle.maxHp * 100, 0, 100);
      const log = (battle.log || []).slice(-5).map(line => `<div>${line}</div>`).join('');
      battleHtml = `<article class="content-panel arena-battle"><div class="arena-battle-head"><div><div class="eyebrow">THE PROVING GROUND · DUEL IN PROGRESS</div><h2>${def?.name || 'Unknown rival'}</h2></div><span class="stat-pill red">TURN ${(battle.turn || 0) + 1}</span></div>
        <div class="arena-duelists">
          <div class="duelist"><span class="duelist-seal">${sectData().seal}</span><div><small>YOU · ${arenaRankTitle()}</small><b>${realmTitle()}</b><div class="health-track"><i style="width:${clamp(state.hp / state.maxHp * 100, 0, 100)}%"></i></div><span>${Math.ceil(state.hp)} / ${state.maxHp} health</span></div></div>
          <span class="duel-vs">對</span>
          <div class="duelist rival"><span class="duelist-seal">${def?.seal || '?'}</span><div><small>RANK ${def?.rank || '?'} · ${def?.title || ''}</small><b>${def?.name || 'Unknown'}</b><div class="health-track"><i style="width:${pct}%"></i></div><span>${nfmt(Math.max(0, battle.hp))} / ${nfmt(battle.maxHp)} health</span></div></div>
        </div>
        <p class="boss-ability">${def?.trait || ''}</p>
        <div class="boss-actions"><button class="action-btn body-strike" data-action="arena-attack" data-style="body">Body strike · ${attackDamage(3 + state.pathLevels.body * 4 + state.stage)}–${attackDamage(7 + state.pathLevels.body * 5 + state.stage)} dmg</button><button class="action-btn spirit-strike" data-action="arena-attack" data-style="spirit" ${state.qi < 10 ? 'disabled' : ''}>Spirit art · 10 qi</button><button class="action-btn sect-spell" data-action="arena-spell" ${state.qi < currentSpell().cost ? 'disabled' : ''}>${currentSpell().seal} ${currentSpell().name} · ${currentSpell().cost} qi</button>${state.activeArts.map(id => { const a = martialArts.find(x => x.id === id); return a ? `<button class="action-btn" data-action="arena-art" data-id="${a.id}" ${state.qi < a.qi ? 'disabled' : ''}>${a.seal} ${a.name} · ${a.qi} qi</button>` : ''; }).join('')}<button class="action-btn danger" data-action="arena-retreat">Yield</button></div>
        <div class="battle-log arena-log">${log}</div></article>`;
    }
    const ladder = arenaRivals.map(def => {
      const rivalStats = arenaRivalStats(def);
      const defeated = state.arena?.defeated?.[def.id] || 0;
      const isCleared = rank <= def.rank;
      const isNext = rank === def.rank + 1;
      const isLocked = def.rank < rank - 1;
      const stageLocked = state.stage < def.req;
      const can = !battle && (isNext || isCleared) && !stageLocked;
      const action = battle ? 'Duel underway' : stageLocked ? `Requires stage ${def.req}` : isNext ? 'Challenge' : isCleared ? 'Rematch' : 'Locked';
      return `<div class="arena-rival ${isCleared ? 'cleared' : ''} ${isNext ? 'next' : ''} ${isLocked ? 'locked' : ''}"${tipAttr(`${def.name} · ${def.trait} ${def.quote}`)}>
        <span class="arena-rank-no">${def.rank}</span><span class="arena-seal">${def.seal}</span>
        <div class="arena-rival-copy"><div class="arena-rival-head"><h3>${def.name}</h3><small>${def.title} · ${sects[def.sect].name}</small></div><p>${def.trait}</p><div class="arena-statline"><span>${nfmt(rivalStats.maxHp)} HP</span><span>${rivalStats.damage} ATK</span><span>${defeated ? `${defeated} win${defeated === 1 ? '' : 's'}` : 'Undefeated'}</span></div><div class="arena-reward-line">${rewardsText({ stones: def.stones, tokens: def.tokens, merit: def.merit })}${defeated ? ' · rematch reward reduced' : ' · first clear'}</div></div>
        <button class="action-btn ${isNext ? 'gold' : ''}" data-action="challenge-rival" data-id="${def.id}" ${can ? '' : 'disabled'}>${action}</button>
      </div>`;
    }).join('');
    const nextCard = next
      ? `<article class="arena-callout"><span class="arena-callout-seal">${next.seal}</span><div><small>YOUR NEXT OPPONENT · RANK ${next.rank}</small><b>${next.name} · ${next.title}</b><p>“${next.quote}”</p></div><button class="action-btn gold" data-action="challenge-rival" data-id="${next.id}" ${state.stage >= next.req && !battle ? '' : 'disabled'}>${state.stage < next.req ? `Requires stage ${next.req}` : 'Enter the ring'}</button></article>`
      : `<article class="arena-callout champion"><span class="arena-callout-seal">冠</span><div><small>THE SEAT IS YOURS</small><b>Sect Champion · ${state.arena?.wins || 0} victories</b><p>No rival stands above you. Rematch the fallen for sport, or turn your attention to the wider world.</p></div><button class="action-btn" data-action="tab" data-tab-view="sect" data-tab="rankings">View rankings</button></article>`;
    return `<div class="subview-layout"><div class="subview-main">
      <article class="arena-hero"><div class="arena-hero-mark">擂</div><div class="arena-hero-copy"><div class="eyebrow light">THE PROVING GROUND · ${rank <= 10 ? `RANK ${rank} OF 10` : 'UNRANKED CHALLENGER'}</div><h2>${arenaRankTitle()}</h2><p>${rank <= 1 ? 'The pedestal is polished. The crowd has learned your name. Every duel from here is a defense of the seat.' : 'The sect’s oldest stone ring accepts any disciple with the nerve to step inside. Climb one rank at a time; the crowd remembers every exchange.'}</p><div class="arena-progress"><i style="width:${progress}%"></i></div><div class="arena-meta"><span>DUELS WON <b>${wins}</b></span><span>RIVALS FELLED <b>${cleared} / 10</b></span><span>CHAMPION <b>${champion?.name || 'Vacant'}</b></span></div></div><div class="arena-crowd"><span>觀眾</span><small>THE CROWD<br>IS WATCHING</small></div></article>
      ${battleHtml}
      ${battle ? '' : nextCard}
      <article class="content-panel"><div class="eyebrow">THE LADDER · TEN SEATS</div><h2>Rivals of the stone ring</h2><p>Challenge the seat immediately above yours. A victory claims that rank forever; rematches award a reduced purse but still count toward missions and daily challenges. The arena ward mends both duelists before every bout.</p><div class="arena-ladder">${ladder}</div></article>
      </div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">DUEL RECORD</div><h3>${wins} victories in the ring</h3><p>${battle ? 'Finish the bout or yield. The crowd dislikes a half-finished story.' : next ? `Next: ${next.name}, ${next.title}. Their seal is ${next.seal}.` : 'You hold the champion’s seat. The pedestal is yours until someone stronger arrives.'}</p><div class="feature-stats"><span>RANK <b>${rank <= 10 ? `#${rank}` : '—'}</b></span><span>WINS <b>${wins}</b></span><span>FELLED <b>${cleared} / 10</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">ARENA RULES</div><h2>How the ring works</h2><p>Only the seat directly above you may be challenged for rank. Defeated rivals can be fought again for a smaller purse. Every first victory grants spirit stones, sect tokens, merit and Dao insight. Victory also advances arena missions, daily challenges and story quests.</p><div class="inventory-row"><span>Current title</span><b>${arenaRankTitle()}</b></div><div class="inventory-row"><span>Champion’s prize</span><b>Laurel of the Sect Champion</b></div></article>
      <article class="feature-card"><div class="eyebrow">KEEPER GAN’S ADVICE</div><h3>Read the stance</h3><p>Rivals telegraph their specialties. The Frost Sovereign turns your damage back on you, the Formation Master repairs himself, and the Void Step slips away from heavy blows. Bring a companion, a full qi reserve and a healing art.</p><button class="action-btn" data-view="forge">Prepare at the forge</button></article></aside></div>`;
  }
  function challengeRival(id) {
    if (state.arena.battle) return showToast('A duel is already underway.');
    const def = arenaRivals.find(r => r.id === id); if (!def) return;
    const rank = state.arena.rank || 11;
    const canFirst = rank === def.rank + 1;
    const canRematch = rank <= def.rank;
    if (!canFirst && !canRematch) return showToast('Defeat the rival above you first.');
    if (state.stage < def.req) return showToast(`You must reach stage ${def.req} to face ${def.name}.`);
    recalc();
    state.hp = state.maxHp;
    const stats = arenaRivalStats(def);
    state.arena.battle = { id, hp: stats.maxHp, maxHp: stats.maxHp, damage: stats.damage, turn: 0, log: [`${def.name} steps into the ring. “${def.quote}”`] };
    notify(`Arena duel begun · ${def.name}, ${def.title}.`, 'sect', true);
    showToast(`The arena ward restores you. ${def.name} takes the opposite mark.`);
    save(); render();
  }
  function arenaHit(base, source) {
    const battle = state.arena.battle; if (!battle) return;
    const def = arenaRivals.find(r => r.id === battle.id);
    if (!def) { state.arena.battle = null; save(); render(); return; }
    const hit = calculateHit(base);
    const evaded = def.type === 'dodge' && Math.random() < .18;
    if (evaded) {
      battle.log.push(`${def.name} folds the space where you strike. Your ${source} finds nothing.`);
    } else {
      battle.hp -= hit.damage;
      battle.log.push(`${source} lands for ${hit.damage}${hit.crit ? ' critical' : ''} damage.`);
    }
    if (battle.hp <= 0) { defeatArenaRival(def); return; }
    battle.turn = (battle.turn || 0) + 1;
    if (def.type === 'reflect' && !evaded) {
      const reflected = Math.max(1, Math.round(hit.damage * .18));
      state.hp = Math.max(0, state.hp - reflected);
      battle.log.push(`Frost Mirror returns ${reflected} damage.`);
      if (state.hp <= 0) { loseArenaDuel(def); return; }
    }
    if (def.type === 'heal' || def.type === 'champion') {
      const heal = Math.round(battle.maxHp * (def.type === 'heal' ? .05 : .03));
      battle.hp = Math.min(battle.maxHp, battle.hp + heal);
      battle.log.push(`${def.name} recovers ${heal} health.`);
    }
    if (def.type === 'drain') {
      const drain = Math.min(state.qi, 8);
      state.qi -= drain;
      battle.log.push(`${def.name} draws ${drain} qi from your channels.`);
    }
    let damage = Math.round(battle.damage * (0.9 + Math.random() * .2));
    if (def.type === 'burn') damage += 5;
    if ((def.type === 'double' || def.type === 'champion') && battle.turn % 3 === 0) {
      damage *= 2;
      battle.log.push('A second strike follows the first!');
    }
    if (def.type === 'storm' && battle.turn % 3 === 0) {
      damage = Math.round(damage * 1.6);
      battle.log.push('Thunder answers the crowd’s roar!');
    }
    const guard = def.type === 'pierce' ? Math.floor(guardFor() * .5) : guardFor();
    damage = Math.max(1, damage - guard);
    damage = Math.max(1, Math.round(damage * (1 - bodyDamageReduction())));
    state.hp = Math.max(0, state.hp - damage);
    battle.log.push(`${def.name} retaliates for ${damage}.`);
    if (state.hp <= 0) { loseArenaDuel(def); return; }
    save(); render();
  }
  function arenaAttack(style) {
    if (!state.arena.battle) return;
    let base;
    if (style === 'spirit') {
      if (state.qi < 10) return showToast('You need 10 qi to form a spirit art.');
      state.qi -= 10;
      base = spiritStrike(7 + state.pathLevels.spirit * 5 + state.stage + Math.random() * (7 + state.pathLevels.spirit));
      arenaHit(base, 'Your spirit art');
    } else {
      base = attackDamage(3 + state.pathLevels.body * 4 + state.stage + Math.random() * (5 + state.pathLevels.body));
      arenaHit(base, 'Your body strike');
    }
  }
  function arenaSpell() {
    if (!state.arena.battle) return;
    const spell = currentSpell();
    if (state.qi < spell.cost) return showToast(`You need ${spell.cost} qi to cast ${spell.name}.`);
    state.qi -= spell.cost;
    if (spell.heal) state.hp = Math.min(state.maxHp, state.hp + spell.heal);
    arenaHit(spiritStrike(spell.damage + state.pathLevels.spirit * 4 + state.stage), spell.name);
  }
  function arenaArt(id) {
    if (!state.arena.battle) return;
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (state.qi < art.qi) return showToast(`You need ${art.qi} qi for ${art.name}.`);
    state.qi -= art.qi;
    if (art.effect === 'heal') state.hp = Math.min(state.maxHp, state.hp + (art.heal || 20));
    if (art.effect === 'crit') state.breakBuff = (state.breakBuff || 0) + 3;
    arenaHit(spiritStrike(art.damage * artDamageMult(art.id) + state.pathLevels.spirit * 4 + state.stage), art.name);
  }
  function defeatArenaRival(def) {
    const first = !(state.arena.defeated[def.id] > 0);
    const rank = state.arena.rank || 11;
    const claimed = first && rank === def.rank + 1;
    state.arena.defeated[def.id] = (state.arena.defeated[def.id] || 0) + 1;
    state.arena.wins = (state.arena.wins || 0) + 1;
    state.arena.lastWin = Date.now();
    if (claimed) state.arena.rank = def.rank;
    state.arena.battle = null;
    const mult = first ? 1 : .35;
    const stones = Math.max(1, Math.round(def.stones * mult));
    const tokens = Math.max(1, Math.round(def.tokens * mult));
    const merit = Math.max(1, Math.round(def.merit * mult));
    state.stones += stones;
    state.sectTokens += tokens;
    addRep(merit);
    if (def.dao) state.dao[def.dao.id].xp = (state.dao[def.dao.id].xp || 0) + Math.round(def.dao.xp * mult * daoGainMult(def.dao.id));
    if (first && def.rank === 1) grantArtifact('laurel');
    dailyStep('duel'); missionStep('duel'); questStep('duel');
    state.stats.duels = (state.stats.duels || 0) + 1;
    state.hp = state.maxHp;
    notify(`Arena victory · ${def.name} defeated${claimed ? ` · rank ${state.arena.rank} claimed` : ' · rematch'}.`, 'reward');
    save(); render();
    if (first && def.rank === 1) {
      openModal('冠', 'THE SEAT IS CLAIMED', 'Sect Champion', `Nangong Wan yields the champion’s seat.<br><br>+${nfmt(stones)} spirit stones · +${tokens} tokens · +${merit} merit<br><b>Artifact claimed · Laurel of the Sect Champion</b><br><br>The stone ring will remember this day.`, '<button class="primary-btn" data-action="close-modal">Take the pedestal</button>');
    } else if (first) {
      fxBurst('rare', def.seal, `${def.name} defeated`, `You claim rank ${claimed ? state.arena.rank : def.rank} in the sect arena.`, rewardsText({ stones, tokens, merit }));
    } else {
      rewardFloat(`+ ${rewardsText({ stones, tokens, merit })}`);
    }
  }
  function loseArenaDuel(def) {
    state.arena.battle = null;
    state.hp = Math.max(1, Math.floor(state.maxHp * .4));
    notify(`${def.name} wins the exchange. The arena ward carries you from the ring.`, 'info');
    showToast(`${def.name} wins the bout. The ward mends your wounds — try again when you are stronger.`);
    save(); render();
  }
  function arenaRetreat() {
    if (!state.arena.battle) return;
    const def = arenaRivals.find(r => r.id === state.arena.battle.id);
    state.arena.battle = null;
    state.hp = Math.max(1, Math.floor(state.maxHp * .5));
    showToast(`You yield the bout to ${def?.name || 'your rival'}. The crowd murmurs, but the seat remains.`);
    save(); render();
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
    const boonCards = legacyBoons.map(b => {
      const claimed = (state.inheritance.boons || []).includes(b.id);
      const can = !claimed && (state.inheritance.points || 0) >= b.points;
      return `<article class="boon-card ${claimed ? 'claimed' : ''}"${tipAttr(`${b.name} · ${b.desc} Costs ${b.points} legacy points.`)}><span class="boon-seal">${b.seal}</span><div><h3>${b.name}</h3><p>${b.desc}</p><small>${rewardsText(b.grant)}</small></div><button class="action-btn" data-action="claim-boon" data-id="${b.id}" ${can ? '' : 'disabled'}>${claimed ? 'Claimed' : `✦ ${b.points} legacy`}</button></article>`;
    }).join('');
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE UNCLAIMED PAST</div><h2>Five legacies, five questions</h2><p>Discovering a legacy costs spirit stones and ancient relics. Each legacy holds three trials. Pass all three to claim its artifact and complete the inheritance.</p><div class="legacy-grid">${cards}</div></article>
      <article class="content-panel"><div class="eyebrow">LEGACY BOONS · ${state.inheritance.points || 0} POINTS</div><h2>What the ancients set aside</h2><p>Discovering a legacy and passing its trials earns legacy points. Spend them here for permanent aid that follows you through reincarnation.</p><div class="boon-grid">${boonCards}</div></article></div>
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
      const temper = owned?.temper || 0;
      const refineCost = { stones: Math.round(160 * Math.pow(1.45, refine)), ore: 2 + refine };
      const temperCost = { stones: 90 + temper * 95, ore: 1 + Math.floor(temper / 2) };
      const attack = Math.round(w.attack * (1 + refine * .12 + temper * .02) * (1 + buildingLevel('armory') * .03));
      const canRefine = owned && refine < 10 && canPay(refineCost);
      const canTemper = owned && temper < forgeTempers && canPay(temperCost);
      const canAwaken = owned && refine >= 10 && !owned.awakened && state.stones >= 500 && (state.herbs.relic || 0) >= 1 && (state.herbs.beastCore || 0) >= 1;
      return `<article class="weapon-card ${owned ? (state.forge.equippedWeapon === w.id ? 'equipped' : '') : 'locked'}"><span class="rarity-tag">${w.rarity.toUpperCase()}</span><h3>${w.name}</h3><p>${owned ? `${w.ability}` : `A ${w.rarity.toLowerCase()} weapon requiring stage ${w.req}.`}</p><div class="weapon-stats"><span${tipAttr(TIP.attack)}>⚔ ${nfmt(attack)} attack</span><span>Refine ${refine}/10</span><span${tipAttr(TIP.temper)}>Temper ${temper}/${forgeTempers}</span><span>${owned?.awakened ? 'Awakened' : 'Dormant'}</span></div><div class="weapon-ability"><b>${w.seal} ${owned?.awakened ? 'Awakened ability' : 'Latent ability'}</b><br>${w.ability}</div><div class="weapon-actions">${owned ? `<button class="action-btn" data-action="equip-weapon" data-id="${w.id}" ${state.forge.equippedWeapon === w.id ? 'disabled' : ''}>${state.forge.equippedWeapon === w.id ? 'Equipped' : 'Equip'}</button><button class="action-btn" data-action="refine-weapon" data-id="${w.id}" ${canRefine ? '' : 'disabled'}>${refine >= 10 ? 'Max refinement' : `Refine · ${costText(refineCost)}`}</button><button class="action-btn" data-action="temper-weapon" data-id="${w.id}" ${canTemper ? '' : 'disabled'}>${temper >= forgeTempers ? 'Fully tempered' : `Temper · ${costText(temperCost)}`}</button><button class="action-btn gold" data-action="awaken-weapon" data-id="${w.id}" ${canAwaken ? '' : 'disabled'}>Awaken · ◇ 500 · relic · core</button>` : `<button class="action-btn" data-action="forge-weapon" data-id="${w.id}" ${canForge ? '' : 'disabled'}>${state.stage < w.req ? `Requires stage ${w.req}` : `Forge · ${costText(w.cost)}`}</button>`}</div></article>`;
    }).join('');
    const weapon = equippedWeapon();
    return `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE COLD ANVIL · ORE ${state.herbs.ore || 0}</div><h2>Weapons of the path</h2><p>Forging a weapon costs spirit stones and ore. Equipped weapons add their attack to every strike; refinement multiplies it further. At refinement 10 a weapon can be awakened with a relic and a beast core.</p><div class="forge-grid">${cards}</div></article>
      <article class="content-panel"><div class="eyebrow">CURRENT ARMS</div><h2>${weapon ? weapon.name : 'Bare hands'}</h2><p>${weapon ? `+${nfmt(weapon.totalAttack)} attack · Refine ${weapon.refine}/10 · Temper ${weapon.temper}/5 · ${weapon.awakened ? 'Awakened' : 'Dormant'}. ${weapon.ability}` : 'A forged weapon is the difference between a long road and a short one.'}</p><div class="feature-stats"><span>ATTACK <b>${nfmt(attackDamage(0))}</b></span><span>GUARD <b>${guardFor()}</b></span><span>CRIT <b>${Math.round(critChance() * 100)}%</b></span></div></article></div>
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
    if (!s.fate) s.fate = { pending: null, log: [], merchant: [], merchantDate: 0, merchantRefreshDate: 0, maps: 0, fragments: 0, clock: 0, encounters: 0, luckBuff: 0, luckBuffUntil: 0, offeringLuck: 0, offeringUntil: 0, divinations: 0 };
    const day = dayIndex(s);
    if (s.fate.merchantDate !== day) {
      const seed = dayHash(day + (s.rebirth?.count || 0) * 23 + (s.fate.merchantRefreshDate || 0) * 7 + 'merchant');
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
    const luckBuffLeft = Math.max(0, Math.ceil(((state.fate.luckBuffUntil || 0) - Date.now()) / 60000));
    const offeringLeft = Math.max(0, Math.ceil(((state.fate.offeringUntil || 0) - Date.now()) / 60000));
    const workings = `<article class="content-panel"><div class="eyebrow">FATE WORKINGS · ${state.fate.fragments || 0} FRAGMENTS</div><h2>Bend the thread, not the loom</h2><p>Fragments are echoes of futures that did not happen. Spend them to divine the road, refresh the faceless merchant, or weave a new encounter. Incense offerings invite luck to linger.</p><div class="fate-work-grid">
      <div class="fate-work"${tipAttr('Divination reveals the shape of the next fortune and grants a short luck blessing. Costs 1 fragment, or 80 stones if you have none.')}><span>卜</span><div><b>Divine the road</b><small>1 fragment · +2 luck for 10 min</small></div><button class="action-btn" data-action="divine-fate" ${(state.fate.fragments > 0 || state.stones >= 80) ? '' : 'disabled'}>Divine</button></div>
      <div class="fate-work"${tipAttr('Burn spirit incense at the roadside shrine. Costs 120 stones and grants +3 luck for 15 minutes.')}><span>香</span><div><b>Offer incense</b><small>◇ 120 · +3 luck for 15 min</small></div><button class="action-btn" data-action="offer-incense" ${state.stones >= 120 ? '' : 'disabled'}>Offer</button></div>
      <div class="fate-work"${tipAttr('Weave 2 fate fragments into a fresh encounter, even if one already waits.')}><span>織</span><div><b>Weave a fortune</b><small>2 fragments · new encounter</small></div><button class="action-btn" data-action="weave-fate" ${(state.fate.fragments || 0) >= 2 ? '' : 'disabled'}>Weave</button></div>
      <div class="fate-work"${tipAttr('Ask the faceless merchant to show a different selection. Costs 1 fragment and can be done once per day.')}><span>商</span><div><b>Refresh merchant</b><small>1 fragment · new stock</small></div><button class="action-btn" data-action="refresh-merchant" ${(state.fate.fragments || 0) >= 1 && state.fate.merchantRefreshDate !== dayIndex() ? '' : 'disabled'}>${state.fate.merchantRefreshDate === dayIndex() ? 'Refreshed' : 'Refresh'}</button></div>
    </div><div class="stat-pills">${luckBuffLeft > 0 ? `<span class="stat-pill green">Fortune's favor · ${luckBuffLeft} min</span>` : ''}${offeringLeft > 0 ? `<span class="stat-pill gold">Incense · ${offeringLeft} min</span>` : ''}<span class="stat-pill">Divinations ${state.fate.divinations || 0}</span></div></article>`;
    $('view-fate').innerHTML = `${subHead('THE ROAD REMEMBERS', 'Fate & Fortune', 'Walk the roads between certainty and chance. Luck bends what the world is willing to give you.', '✦')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="luck-hero"><div class="luck-orb">✦</div><div><div class="eyebrow">YOUR FORTUNE</div><h2>${luckFor()}</h2><p>Luck bends loot, taming, rare roots, critical strikes and the generosity of strangers.</p></div></div></article>${pendingHtml}${workings}
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
    const endingCard = state.ending?.complete ? `<article class="content-panel ending-panel"><div class="eyebrow gold-text">THE END OF ALL ROADS · COMPLETE</div><h2>Your legend is finished</h2><p>Both cultivation paths reached their final stage, and all ten steps beyond the Origin have been claimed. The charted Dao lies behind you. What remains is a world that remembers your name.</p><div class="feature-stats"><span>COMPLETED ON DAY <b>${state.ending.day || dayIndex()}</b></span><span>ACHIEVEMENTS <b>${Object.keys(state.achievements || {}).length} / ${achievementDefs.length}</b></span><span>SPIRIT <b>${spiritTitle()}</b></span><span>BODY <b>${bodyTitle()}</b></span></div><div class="inline-actions"><button class="action-btn gold" data-action="show-ending">Read the ending</button><button class="action-btn" data-action="reincarnate">Walk the wheel again</button></div></article>` : '';
    $('view-ascension').innerHTML = `${subHead('THE WHEEL AND THE HIGHER SKY', 'Reincarnation & ascension', 'Death is a door, not an ending. Carry your permanent strength into a new life, or climb to a higher world.', '仙')}<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">THE WHEEL TURNS</div><h2>${world}</h2><p>Reincarnation strips away realm, qi and mortal standing, but the root, meridians, Dao, beasts, inheritances and forged weapons remain. Ascension carries you to a higher world with all your strength intact.</p><div class="feature-stats"><span>REBIRTHS <b>${state.rebirth.count || 0}</b></span><span>POINTS <b>${state.rebirth.points || 0}</b></span><span>NEXT LIFE VALUE <b>${points}</b></span><span>WORLD BONUS <b>+${(state.rebirth.world || 0) * 20}% qi · +${(state.rebirth.world || 0) * 15}% attack</b></span></div><div class="inline-actions"><button class="action-btn gold" data-action="reincarnate" ${state.spirit.realm >= 4 ? '' : 'disabled'}>${state.spirit.realm >= 4 ? `Reincarnate · earn ${points} points` : 'Reach Soul Transformation to reincarnate'}</button><button class="action-btn" data-action="ascend-world" ${state.spirit.realm >= 9 && (state.rebirth.world || 0) < worldNames.length - 1 ? '' : 'disabled'}>${(state.rebirth.world || 0) >= worldNames.length - 1 ? 'The highest sky' : state.spirit.realm >= 9 ? 'Ascend to the next world' : 'Reach True Immortal to ascend'}</button></div></article>
      ${endingCard}
      <article class="content-panel"><div class="eyebrow">SOUL UPGRADES</div><h2>Strengthen what death cannot take</h2><p>Reincarnation points are permanent. Spend them here; the cost rises with every rank.</p><div class="feature-grid">${upgrades}</div></article>
      <article class="content-panel"><div class="eyebrow">WHAT REMAINS</div><h2>The immortal ledger</h2><p>Roots, meridians, Dao insight, beast bonds, inheritances, artifacts, forged weapons, achievements, sect buildings and world boss records persist through reincarnation. Realm, qi, stones, paths, mission progress and daily practice begin again.</p></article></div>
      <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">ASCENSION</div><h3>${state.rebirth.world >= worldNames.length - 1 ? 'Beyond the heavens' : `Next world · ${worldNames[(state.rebirth.world || 0) + 1]}`}</h3><p>Each higher world grants +20% qi and +15% attack permanently. Ascension requires <b>True Immortal I</b> in spirit cultivation.</p><div class="feature-stats"><span>SPIRIT <b>${spiritTitle()}</b></span><span>BODY <b>${state.body.unlocked ? bodyTitle() : 'Sealed'}</b></span><span>DAO LEVELS <b>${totalMastery()}</b></span><span>BOSSES <b>${state.stats.bosses || 0}</b></span></div></article>
      <article class="content-panel"><div class="eyebrow">DEATH IS A DOOR</div><h2>Not an ending</h2><p>The wheel does not judge. It simply turns. Carry what you have learned, and the next life begins closer to the sky.</p></article></aside></div>`;
  }

  /* ---------------- CODEX ---------------- */
  function renderCodex() {
    const tab = uiTabs.codex;
    let body = '';
    if (tab === 'collections') {
      const beastCards = beastCatalog.map(b => {
        const owned = !!state.taming.beasts[b.id];
        const data = state.taming.beasts[b.id];
        return `<div class="collection-card ${owned ? 'owned' : 'locked'} ${rarityClass(b.rarity)}"${tipAttr(`${b.name} · ${b.rarity}. ${b.passive}. ${owned ? `Bonded at level ${data.level}.` : b.tameable ? `Tame at stage ${b.req}.` : 'Obtained by evolution.'}`)}><span class="collection-glyph">${b.icon}</span><small>${b.rarity.toUpperCase()}</small><b>${owned ? b.name : 'Undiscovered'}</b><em>${owned ? `Lv ${data.level} · bond ${data.bond || 0}` : b.tameable ? `Stage ${b.req}` : 'Evolution'}</em></div>`;
      }).join('');
      const gearCards = [...gearCatalog.map(g => {
        const owned = !!state.equipment[g.id]?.owned;
        return `<div class="collection-card ${owned ? 'owned' : 'locked'} ${rarityClass(g.rarity)}"${tipAttr(`${g.name} · ${g.bonus}. ${owned ? `Equipped at level ${state.equipment[g.id].level}.` : 'Bought from the Armory.'}`)}><span class="collection-glyph">${g.seal}</span><small>${g.rarity.toUpperCase()} · GEAR</small><b>${owned ? g.name : 'Undiscovered'}</b><em>${owned ? `Level ${state.equipment[g.id].level}` : `${g.tokens} tokens`}</em></div>`;
      }), ...weaponCatalog.map(w => {
        const owned = !!state.forge.weapons[w.id]?.owned;
        return `<div class="collection-card ${owned ? 'owned' : 'locked'} ${rarityClass(w.rarity)}"${tipAttr(`${w.name} · ${w.ability}. ${owned ? 'Forged and remembered.' : `Forged at stage ${w.req}.`}`)}><span class="collection-glyph">${w.seal}</span><small>${w.rarity.toUpperCase()} · WEAPON</small><b>${owned ? w.name : 'Unforged'}</b><em>${owned ? `Refine ${state.forge.weapons[w.id].refine}/10` : `Stage ${w.req}`}</em></div>`;
      }), ...artifactCatalog.map(a => {
        const owned = state.inheritance.artifacts.includes(a.id);
        const equipped = (state.forge.equippedArtifacts || []).includes(a.id);
        return `<div class="collection-card ${owned ? 'owned' : 'locked'} ${rarityClass(a.rarity)}"${tipAttr(`${a.name} · ${a.ability}. ${owned ? 'Claimed from an inheritance.' : 'Claimed by completing an inheritance or boss.'}`)}><span class="collection-glyph">${a.seal}</span><small>${a.rarity.toUpperCase()} · ARTIFACT</small><b>${owned ? a.name : 'Undiscovered'}</b><em>${equipped ? 'Equipped' : owned ? 'In vault' : 'Inheritance'}</em></div>`;
      })].join('');
      const techCards = [...techniques.map(t => {
        const rank = state.upgrades[t.id] || 0;
        return `<div class="collection-card ${rank ? 'owned' : 'locked'}"${tipAttr(`${t.name} · ${t.effect}. Rank ${rank}.`)}><span class="collection-glyph">${t.seal}</span><small>PASSIVE SUTRA</small><b>${t.name}</b><em>Rank ${rank}${rank ? '' : ` · stage ${t.req}`}</em></div>`;
      }), ...martialArts.map(a => {
        const known = state.activeArts.includes(a.id);
        return `<div class="collection-card ${known ? 'owned' : 'locked'}"${tipAttr(`${a.name} · ${a.desc} ${a.qi} qi · ${a.damage} base damage.`)}><span class="collection-glyph">${a.seal}</span><small>MARTIAL ART</small><b>${a.name}</b><em>${known ? 'Learned' : `Stage ${a.req}`}</em></div>`;
      })].join('');
      const rootCards = rootTypes.map(r => {
        const known = state.root.discovered.includes(r.id) || state.root.type === r.id;
        return `<div class="collection-card ${known ? 'owned' : 'locked'} ${rarityClass(r.rarity)}"${tipAttr(`${r.name} · ${r.ability} ${known ? bonusText(r.bonus) : 'Awaken or reroll roots to discover.'}`)}><span class="collection-glyph">${known ? r.seal : '?'}</span><small>${r.rarity.toUpperCase()} · ROOT</small><b>${known ? r.name : 'Undiscovered'}</b><em>${known ? bonusText(r.bonus) : 'Awakening'}</em></div>`;
      }).join('');
      const beastsOwned = beastCatalog.filter(b => state.taming.beasts[b.id]).length;
      const gearOwned = gearCatalog.filter(g => state.equipment[g.id]?.owned).length + weaponCatalog.filter(w => state.forge.weapons[w.id]?.owned).length + state.inheritance.artifacts.length;
      const gearTotal = gearCatalog.length + weaponCatalog.length + artifactCatalog.length;
      const techOwned = Object.values(state.upgrades).filter(v => v > 0).length + state.activeArts.length;
      body = `<div class="subview-layout"><div class="subview-main"><article class="content-panel"><div class="eyebrow">BEAST BESTIARY · ${beastsOwned} / ${beastCatalog.length}</div><h2>Spirit beasts</h2><p>Every beast you tame, hatch or evolve is recorded here. Evolved forms appear once they are bonded.</p><div class="collection-grid">${beastCards}</div></article>
        <article class="content-panel"><div class="eyebrow">ARMORY &amp; ARTIFACTS · ${gearOwned} / ${gearTotal}</div><h2>Equipment collection</h2><p>Gear, forged weapons and inheritance artifacts share one record.</p><div class="collection-grid">${gearCards}</div></article>
        <article class="content-panel"><div class="eyebrow">LIBRARY · ${techOwned} / ${techniques.length + martialArts.length}</div><h2>Techniques</h2><p>Passive sutras gain ranks; martial arts are learned once and carried into every battle.</p><div class="collection-grid">${techCards}</div></article>
        <article class="content-panel"><div class="eyebrow">ROOTS · ${state.root.discovered.length} / ${rootTypes.length}</div><h2>Spiritual roots</h2><p>Roots are discovered through awakening and rerolling.</p><div class="collection-grid">${rootCards}</div></article></div>
        <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">COLLECTION RECORD</div><h3>${beastsOwned + gearOwned + techOwned + state.root.discovered.length} entries recorded</h3><p>Collections are drawn from your live save. Evolving a beast, forging a weapon or learning an art updates them immediately.</p><div class="feature-stats"><span>BEASTS <b>${beastsOwned} / ${beastCatalog.length}</b></span><span>EQUIPMENT <b>${gearOwned} / ${gearTotal}</b></span><span>ARTS <b>${techOwned} / ${techniques.length + martialArts.length}</b></span><span>ROOTS <b>${state.root.discovered.length} / ${rootTypes.length}</b></span></div></article>
        <article class="content-panel"><div class="eyebrow">WHERE TO LOOK</div><h2>Fill the gaps</h2><p>Beasts come from taming and eggs. Gear comes from the Armory, forged weapons from the Forge, artifacts from inheritances, and roots from awakening.</p><div class="inline-actions"><button class="action-btn" data-view="combat">Tame beasts</button><button class="action-btn" data-view="forge">Forge</button><button class="action-btn" data-view="inherit">Inheritances</button></div></article></aside></div>`;
    } else if (tab === 'achievements') {
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
      const spiritRows = spiritRealms.map((r, i) => {
        const passed = state.spirit.realm > i;
        const current = state.spirit.realm === i;
        return `<div class="codex-realm ${passed ? 'unlocked' : ''} ${current ? 'current' : ''}"><div class="codex-node">${passed ? '✦' : current ? state.spirit.stage + 1 : '·'}</div><div><h3>${r.name} <small>${r.cn}</small></h3><p>${r.desc}</p></div><small>${current ? `STAGE ${ROMAN[state.spirit.stage]}` : passed ? 'PASSED' : 'UNDISCOVERED'}</small></div>`;
      }).join('');
      const bodyRows = bodyRealms.map((r, i) => {
        const passed = state.body.unlocked && state.body.realm > i;
        const current = state.body.unlocked && state.body.realm === i;
        return `<div class="codex-realm body ${passed ? 'unlocked' : ''} ${current ? 'current' : ''} ${state.body.unlocked ? '' : 'sealed'}"><div class="codex-node">${passed ? '✦' : current ? state.body.stage + 1 : '·'}</div><div><h3>${r.name} <small>${r.cn}</small></h3><p>${r.desc}</p></div><small>${current ? `STAGE ${ROMAN[state.body.stage]}` : passed ? 'PASSED' : state.body.unlocked ? 'UNDISCOVERED' : 'SEALED'}</small></div>`;
      }).join('');
      const origin = state.origin?.unlocked ? `<article class="content-panel origin-codex"><div class="eyebrow gold-text">THE HIDDEN FINAL REALM</div><h2>Beyond the Origin</h2><p>Spirit and body have both reached their final stage. The third progression stands outside the fifteen realms, measured in Origin Steps I–X.</p><div class="inventory-row"><span>Origin step</span><b>${state.origin.level} / 10</b></div></article>` : '';
      const goal = nextPathCost('spirit');
      body = `<div class="subview-layout"><div class="subview-main">
        <article class="content-panel"><div class="eyebrow">SPIRIT CULTIVATION · 15 REALMS</div><h2>The immortal spirit</h2><p>Every spirit realm holds ten Roman stages. Stages I–IX are guaranteed qi upgrades; stage X opens a heavenly tribulation and the next realm. Spirit power governs qi flow, spell damage and Dao insight.</p><div class="codex-list">${spiritRows}</div></article>
        <article class="content-panel"><div class="eyebrow">BODY CULTIVATION · 15 REALMS</div><h2>The tempered vessel</h2><p>${state.body.unlocked ? 'The body path is awake. Its stages share your qi but advance independently, each one hardening health, attack, guard and resistance.' : 'The body path remains sealed until spirit cultivation reaches <b>Golden Core I</b>. It will then begin at Mortal Body I.'}</p><div class="codex-list">${bodyRows}</div></article>
        ${origin}</div>
        <aside class="subview-aside"><article class="feature-card"><div class="eyebrow">CODEX OF THE SELF</div><h3>${worldName()}</h3><p>Your root, Dao, meridians and companions all appear in the other pages of this codex. Some knowledge is earned only by living.</p><div class="feature-stats"><span>SPIRIT <b>${spiritTitle()}</b></span><span>BODY <b>${state.body.unlocked ? bodyTitle() : 'Sealed'}</b></span><span>SHARED QI <b>${nfmt(state.qi)}</b></span></div></article>
        <article class="content-panel"><div class="eyebrow">THE NEXT SPIRIT THRESHOLD</div><h2>${nextSpiritTitle()}</h2><p>${nfmt(goal)} qi are required. ${state.spirit.stage >= 9 ? `A heavenly tribulation waits at this gate · ${spiritBreakChance()}% success.` : 'The stage advance is guaranteed once the qi is spent.'}</p><div class="inventory-row"><span>Body next</span><b>${state.body.unlocked ? `${nextBodyTitle()} · ${nfmt(nextPathCost('body'))} qi` : 'Golden Core I'}</b></div></article></aside></div>`;
    }
    $('view-codex').innerHTML = `${subHead('THE IMMORTAL CODEX', 'Codex', 'Realms, achievements, story quests and the record of your long road.', '▤')}
      ${tabs('codex', [['realms', 'Realms'], ['collections', 'Collections'], ['achievements', 'Achievements'], ['quests', 'Story quests'], ['records', 'Records']])}${body}`;
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
  function bodyTemperEffect(success, label) {
    const el = document.createElement('div');
    el.className = 'body-trial' + (success ? '' : ' fail');
    el.innerHTML = `<div class="trial-ring"></div><div class="trial-ring two"></div><div class="trial-shock"></div><div class="trial-fist">拳</div><div class="trial-text">${label || (success ? 'TEMPERING COMPLETE' : 'THE BODY YIELDS')}</div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2100);
  }
  function fxBurst(kind, seal, title, text, sub = '') {
    const layer = $('fxLayer'); if (!layer) return;
    const card = document.createElement('div');
    card.className = `fx-card fx-${kind}`;
    const sparks = Array.from({ length: kind === 'rare' ? 14 : 9 }, (_, i) =>
      `<i style="--a:${(i * 360 / (kind === 'rare' ? 14 : 9)).toFixed(1)}deg;--d:${60 + (i % 4) * 22}px;--t:${(i % 3) * .08}s"></i>`
    ).join('');
    card.innerHTML = `<div class="fx-sparks">${sparks}</div><div class="fx-seal">${seal || '✦'}</div><div class="fx-copy"><small>${kind === 'rare' ? 'RARE DISCOVERY' : kind === 'beast' ? 'BOND TRANSFORMED' : kind === 'breakthrough' ? 'HEAVEN ACKNOWLEDGES' : 'REWARD EARNED'}</small><b>${title}</b><span>${text}</span>${sub ? `<em>${sub}</em>` : ''}</div>`;
    layer.appendChild(card);
    setTimeout(() => card.classList.add('out'), 2400);
    setTimeout(() => card.remove(), 3000);
  }
  function rewardFloat(text) {
    const layer = $('fxLayer'); if (!layer) return;
    const el = document.createElement('div');
    el.className = 'reward-float';
    el.textContent = text;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 1800);
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
  function advanceSpirit() {
    if (state.spirit.stage >= 9) return openSpiritBreakthrough();
    const cost = stageCost('spirit');
    if (state.qi < cost) return showToast(`You need ${nfmt(cost)} qi to advance.`);
    state.qi -= cost;
    state.spirit.stage += 1;
    syncCultivation();
    maybeUnlockBody();
    notify(`Spirit cultivation · ${spiritTitle()} reached.`, 'breakthrough');
    showToast(`Qi refines into a deeper stage · ${spiritTitle()}.`);
    save(); render();
  }
  function advanceBody() {
    if (!state.body.unlocked) return showToast('Body cultivation unlocks at Golden Core I.');
    if (state.body.stage >= 9) return openBodyBreakthrough();
    const cost = stageCost('body');
    if (state.qi < cost) return showToast(`You need ${nfmt(cost)} qi to temper the body.`);
    state.qi -= cost;
    state.body.stage += 1;
    recalc(); syncCultivation();
    notify(`Body cultivation · ${bodyTitle()} reached.`, 'breakthrough');
    showToast(`The vessel hardens · ${bodyTitle()}.`);
    save(); render();
  }
  function openBreakthrough() {
    if (spiritMaxed()) return showToast('The spirit path is complete. Eternal Dao Ancestor X stands at the summit.');
    if (state.spirit.stage < 9) return advanceSpirit();
    return openSpiritBreakthrough();
  }
  function openSpiritBreakthrough() {
    if (spiritMaxed()) return showToast('The spirit path is complete. Eternal Dao Ancestor X stands at the summit.');
    if (state.spirit.stage !== 9) return showToast('Spirit breakthroughs occur only at stage X.');
    const chance = spiritBreakChance(), goal = breakthroughCost('spirit'), pill = state.breakBuff || 0, formation = buildingLevel('formation');
    openModal('渡', 'SPIRIT BREAKTHROUGH · HEAVENLY TRIBULATION', `${spiritTitle()} → ${nextSpiritTitle()}`,
      `Spiritual lightning gathers above the sect. Step into <b>${nextSpiritTitle()}</b>?<br><br>Required qi: ${nfmt(goal)} · Success chance: <b>${chance}%</b><br><span class="gold-text">Tribulation pill +${pill}% · Formation Hall +${Math.round(formation * 2.2)}% · Dao and spirit attributes included.</span><br><br>Success grants permanent qi flow, spell power and Dao insight. Failure leaves you at stage X and scatters <b>10%</b> of your qi.`,
      `<button class="secondary-btn" data-action="close-modal">Not yet</button><button class="primary-btn" data-action="attempt-spirit-break">Face the tribulation</button>`);
  }
  function openBodyBreakthrough() {
    if (!state.body.unlocked) return showToast('Body cultivation unlocks at Golden Core I.');
    if (bodyMaxed()) return showToast('The body path is complete. Eternal Godbody X stands at the summit.');
    if (state.body.stage !== 9) return showToast('Body breakthroughs occur only at stage X.');
    const chance = bodyBreakChance(), goal = breakthroughCost('body'), technique = state.upgrades?.body || 0;
    openModal('體', 'BODY BREAKTHROUGH · TEMPERING TRIAL', `${bodyTitle()} → ${nextBodyTitle()}`,
      `The arena ward seals you inside a ring of crushing stone. Endure the tempering trial and step into <b>${nextBodyTitle()}</b>?<br><br>Required qi: ${nfmt(goal)} · Success chance: <b>${chance}%</b><br><span class="gold-text">Jade Body Tempering rank ${technique} · Body attributes and meridians included.</span><br><br>Success grants permanent health, attack and resistance. Failure leaves you at stage X and scatters <b>10%</b> of your qi.`,
      `<button class="secondary-btn" data-action="close-modal">Not yet</button><button class="primary-btn" data-action="attempt-body-break">Enter the trial</button>`);
  }
  function finishSpiritBreakthrough(success, critical) {
    const realm = spiritRealms[state.spirit.realm], next = spiritRealms[Math.min(spiritRealms.length - 1, state.spirit.realm + 1)];
    state.stats.tribulations = (state.stats.tribulations || 0) + 1;
    if (success) {
      const goal = breakthroughCost('spirit');
      state.qi = Math.max(0, state.qi - goal);
      state.spirit.breaks += 1;
      state.spirit.realm += 1; state.spirit.stage = 0;
      if (critical) {
        state.spirit.criticals += 1;
        state.spirit.bonuses.qi += 2; state.spirit.bonuses.spell += 2; state.spirit.bonuses.dao += 2;
      } else {
        state.spirit.bonuses.qi += 1; state.spirit.bonuses.spell += 1; state.spirit.bonuses.dao += 1;
      }
      state.breakBuff = 0;
      state.meridians.points = (state.meridians.points || 0) + 2;
      state.daoPoints = (state.daoPoints || 0) + (critical ? 2 : 1);
      state.root.essence = (state.root.essence || 0) + 1 + Math.floor(state.spirit.realm / 5) + (critical ? 1 : 0);
      state.realms.keys = (state.realms.keys || 0) + 1;
      state.stones += 20 + state.spirit.realm * 12;
      if (critical) state.herbs.relic = (state.herbs.relic || 0) + 1;
      syncCultivation();
      maybeUnlockBody();
      state.hp = state.maxHp;
      tribulationEffect(true, critical ? 'CRITICAL · HEAVEN BOWS' : 'TRIBULATION ENDURED');
      notify(`${critical ? 'Critical spirit breakthrough' : 'Spirit breakthrough'} · ${spiritTitle()} · +2 meridian points${critical ? ' · +1 relic · doubled permanent attributes' : ' · permanent attributes'}.`, 'breakthrough');
      fxBurst('breakthrough', next.cn, spiritTitle(), 'Spiritual lightning parts. The next realm opens.', critical ? 'CRITICAL SUCCESS · permanent bonuses doubled' : '+2 meridian points · +1 realm key');
      save(); render();
      maybeUnlockOrigin();
      openModal(critical ? '極' : '破', critical ? 'CRITICAL BREAKTHROUGH' : 'SPIRIT BREAKTHROUGH', `${next.name} I`,
        `${critical ? 'Heaven itself bends. Your tribulation ends in a rare critical success.' : 'The last bolt fades. Your foundation stands.'}<br><br><b>${spiritTitle()}</b><br>+${critical ? '2' : '1'} permanent qi flow · +${critical ? '2' : '1'} spell power · +${critical ? '2' : '1'} Dao insight<br>+2 meridian points · +1 realm key · +1 Dao insight${critical ? '<br><b>Critical reward · +1 ancient relic</b>' : ''}`,
        '<button class="primary-btn" data-action="close-modal">Continue the ascent</button>');
    } else {
      state.spirit.failures += 1;
      state.qi *= .9; state.breakBuff = 0;
      tribulationEffect(false, 'THE HEAVENS REFUSE');
      notify(`Spirit breakthrough failed · ${realm.name} X remains · 10% of qi scattered.`, 'info');
      showToast('The tribulation resists. You remain at stage X; your foundation is intact. Gather qi and try again.');
      save(); render();
    }
  }
  function attemptSpiritBreak() {
    if (spiritMaxed()) return showToast('The spirit path is complete. Eternal Dao Ancestor X stands at the summit.');
    if (state.spirit.stage !== 9) return showToast('You must reach stage X before a major breakthrough.');
    const goal = breakthroughCost('spirit');
    if (state.qi < goal) return showToast(`You need ${nfmt(goal)} qi to face the tribulation.`);
    closeModal();
    const chance = spiritBreakChance();
    const success = Math.random() * 100 < chance;
    let critical = false;
    if (success) critical = Math.random() < clamp(.12 + daoLevel('water') * .01 + totalMastery() * .002, .12, .3);
    finishSpiritBreakthrough(success, critical);
  }
  function finishBodyBreakthrough(success, critical) {
    const realm = bodyRealms[state.body.realm], next = bodyRealms[Math.min(bodyRealms.length - 1, state.body.realm + 1)];
    if (success) {
      const goal = breakthroughCost('body');
      state.qi = Math.max(0, state.qi - goal);
      state.body.breaks += 1;
      state.body.realm += 1; state.body.stage = 0;
      const amount = critical ? 2 : 1;
      state.body.bonuses.hp += amount; state.body.bonuses.attack += amount; state.body.bonuses.guard += amount;
      if (critical) { state.body.criticals += 1; state.herbs.relic = (state.herbs.relic || 0) + 1; state.sectTokens += 20; }
      syncCultivation(); recalc();
      state.hp = state.maxHp;
      bodyTemperEffect(true, critical ? 'CRITICAL · BODY REBORN' : 'TEMPERING COMPLETE');
      notify(`${critical ? 'Critical body breakthrough' : 'Body breakthrough'} · ${bodyTitle()} · permanent health, attack and guard.`, 'breakthrough');
      fxBurst('rare', next.seal, bodyTitle(), 'The trial ends. Flesh, bone and blood have been reforged.', critical ? 'CRITICAL SUCCESS · doubled tempering reward' : 'Permanent body attributes increased');
      save(); render();
      maybeUnlockOrigin();
      openModal(critical ? '極' : '體', critical ? 'CRITICAL BODY BREAKTHROUGH' : 'BODY BREAKTHROUGH', `${next.name} I`,
        `${critical ? 'The stone ring shatters around you. The body is reborn beyond its old limit.' : 'The crushing waves subside. You stand, unbroken.'}<br><br><b>${bodyTitle()}</b><br>+${critical ? '2' : '1'} permanent health · +${critical ? '2' : '1'} physical attack · +${critical ? '2' : '1'} guard${critical ? '<br><b>Critical reward · +1 ancient relic · +20 sect tokens</b>' : ''}`,
        '<button class="primary-btn" data-action="close-modal">Continue tempering</button>');
    } else {
      state.body.failures += 1;
      state.qi *= .9;
      bodyTemperEffect(false, 'THE BODY YIELDS');
      notify(`Body breakthrough failed · ${realm.name} X remains · 10% of qi scattered.`, 'info');
      showToast('The trial breaks your stance. You remain at stage X; the qi scatters, but your body remembers.');
      save(); render();
    }
  }
  function attemptBodyBreak() {
    if (!state.body.unlocked) return showToast('Body cultivation unlocks at Golden Core I.');
    if (bodyMaxed()) return showToast('The body path is complete. Eternal Godbody X stands at the summit.');
    if (state.body.stage !== 9) return showToast('You must reach stage X before a major body breakthrough.');
    const goal = breakthroughCost('body');
    if (state.qi < goal) return showToast(`You need ${nfmt(goal)} qi to begin the trial.`);
    closeModal();
    const chance = bodyBreakChance();
    const success = Math.random() * 100 < chance;
    let critical = false;
    if (success) critical = Math.random() < clamp(.1 + (state.pathLevels?.body || 0) * .008 + openedMeridians() * .004, .1, .3);
    finishBodyBreakthrough(success, critical);
  }
  function attemptBreak() { attemptSpiritBreak(); }
  function advanceOrigin() {
    if (!state.origin?.unlocked || !originUnlocked()) return showToast('Beyond the Origin remains hidden.');
    if (state.origin.level >= 10) return showToast('The Origin is already complete.');
    const cost = originCost();
    if (state.qi < cost) return showToast(`You need ${nfmt(cost)} qi to step beyond the Origin.`);
    state.qi -= cost; state.origin.level += 1;
    if (state.origin.level >= 10) { state.ending.complete = true; state.ending.day = dayIndex(); }
    syncCultivation(); recalc();
    notify(`Beyond the Origin · step ${state.origin.level} of 10.`, 'breakthrough');
    if (state.origin.level >= 10) {
      fxBurst('rare', '源', 'Origin Complete', 'The secret final progression has been mastered.', 'Beyond the Origin X');
      save(); render();
      showEnding();
    } else {
      showToast(`Origin step ${state.origin.level} claimed · all cultivation permanently strengthened.`);
      save(); render();
    }
  }
  function showEnding() {
    if (!state.ending?.complete) return showToast('The final road has not yet been walked.');
    const stats = [
      ['DAY', dayIndex()],
      ['SPIRIT', spiritTitle()],
      ['BODY', state.body.unlocked ? bodyTitle() : 'Unawakened'],
      ['ORIGIN', `${state.origin.level} / 10`],
      ['DAO LEVELS', totalMastery()],
      ['BEASTS FELLED', state.stats.kills || 0],
      ['WORLD BOSSES', state.stats.bosses || 0],
      ['ARENA', arenaRankTitle()],
      ['ACHIEVEMENTS', `${Object.keys(state.achievements || {}).length} / ${achievementDefs.length}`],
      ['REBIRTHS', state.rebirth?.count || 0],
      ['WORLD', worldName()]
    ].map(([label, value]) => `<span><small>${label}</small><b>${value}</b></span>`).join('');
    openModal('終', 'THE END OF ALL ROADS', 'The journey is complete',
      `Spirit and body have ended at the same summit, and ten steps have carried you past it. The charted Dao lies behind you; the quiet country beyond it has no name.<br><br>
      <div class="ending-stats">${stats}</div>
      <p class="ending-copy">Everything you gathered — roots, meridians, companions, forged blades and old promises — remains part of the story. The wheel may turn again, but this life has been finished in full.</p>`,
      '<button class="secondary-btn" data-action="close-modal">Continue exploring</button><button class="primary-btn" data-action="reincarnate">Walk the wheel again</button>');
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
      taken = Math.max(1, Math.round(taken * (1 - bodyDamageReduction())));
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
      base = spiritStrike(6 + state.pathLevels.spirit * 5 + state.stage + Math.random() * (7 + state.pathLevels.spirit));
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
    damageEnemy(spiritStrike(spell.damage + state.pathLevels.spirit * 4 + state.stage), spell.name);
  }
  function useArt(id) {
    if (!state.enemy) return;
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (state.qi < art.qi) return showToast(`You need ${art.qi} qi for ${art.name}.`);
    state.qi -= art.qi;
    if (art.effect === 'heal') state.hp = Math.min(state.maxHp, state.hp + (art.heal || 20));
    if (art.effect === 'crit') state.breakBuff = (state.breakBuff || 0) + 3;
    damageEnemy(spiritStrike(art.damage * artDamageMult(art.id) + state.pathLevels.spirit * 4 + state.stage), art.name);
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
      base = spiritStrike(8 + state.pathLevels.spirit * 5 + state.stage + Math.random() * (8 + state.pathLevels.spirit));
    } else base = attackDamage(4 + state.pathLevels.body * 4 + state.stage + Math.random() * (6 + state.pathLevels.body));
    damageBoss(base, style === 'spirit' ? 'Your spirit art' : 'Your body strike');
  }
  function bossSpell() {
    const active = state.world.active; if (!active) return;
    const spell = currentSpell();
    if (state.qi < spell.cost) return showToast(`You need ${spell.cost} qi to cast ${spell.name}.`);
    state.qi -= spell.cost;
    if (spell.heal) state.hp = Math.min(state.maxHp, state.hp + spell.heal);
    damageBoss(spiritStrike(spell.damage + state.pathLevels.spirit * 4 + state.stage), spell.name);
  }
  function bossArt(id) {
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (state.qi < art.qi) return showToast(`You need ${art.qi} qi for ${art.name}.`);
    state.qi -= art.qi;
    if (art.effect === 'heal') state.hp = Math.min(state.maxHp, state.hp + (art.heal || 20));
    damageBoss(spiritStrike(art.damage * artDamageMult(art.id) + state.pathLevels.spirit * 4 + state.stage), art.name);
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
      damage = Math.max(1, Math.round(damage * (1 - bodyDamageReduction())));
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
      base = spiritStrike(8 + state.pathLevels.spirit * 5 + state.stage + Math.random() * (8 + state.pathLevels.spirit));
    } else base = attackDamage(4 + state.pathLevels.body * 4 + state.stage + Math.random() * (6 + state.pathLevels.body));
    damageRealm(base, style === 'spirit' ? 'Your spirit art' : 'Your body strike');
  }
  function realmSpell() {
    const rb = state.realms.boss; if (!rb) return;
    const spell = currentSpell();
    if (state.qi < spell.cost) return showToast(`You need ${spell.cost} qi to cast ${spell.name}.`);
    state.qi -= spell.cost;
    if (spell.heal) state.hp = Math.min(state.maxHp, state.hp + spell.heal);
    damageRealm(spiritStrike(spell.damage + state.pathLevels.spirit * 4 + state.stage), spell.name);
  }
  function realmArt(id) {
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (state.qi < art.qi) return showToast(`You need ${art.qi} qi for ${art.name}.`);
    state.qi -= art.qi;
    if (art.effect === 'heal') state.hp = Math.min(state.maxHp, state.hp + (art.heal || 20));
    damageRealm(spiritStrike(art.damage * artDamageMult(art.id) + state.pathLevels.spirit * 4 + state.stage), art.name);
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
      damage = Math.max(1, Math.round(damage * (1 - bodyDamageReduction())));
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
    notify(`${inc.name} discovered · its trials now await you.`, 'rare');
    fxBurst('rare', inc.seal, inc.name, 'A legacy stirs in the dark and recognizes your step.', '+1 legacy point');
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
      notify(`Inheritance complete · ${inc.name} · artifact claimed.`, 'rare');
      fxBurst('rare', inc.seal, inc.name, 'All three trials are passed. A legacy acknowledges its heir.', artifactCatalog.find(a => a.id === inc.artifact)?.name || '');
      save(); render();
      openModal(inc.seal, 'AN INHERITANCE CLAIMED', inc.name, `All three trials are passed. The legacy acknowledges you.<br><br><b>${artifactCatalog.find(a => a.id === inc.artifact)?.name}</b><br>${inc.bonus}${inc.art ? `<br>A forgotten art is now yours · ${martialArts.find(a => a.id === inc.art)?.name}` : ''}`, '<button class="primary-btn" data-action="close-modal">Accept the legacy</button>');
      return;
    }
    showToast(`Trial passed · ${trial.name}.`);
    notify(`Trial passed · ${inc.name} · ${trial.name} · ${rewardsText(trial.reward)}`, 'reward');
    rewardFloat(`+ ${rewardsText(trial.reward)}`);
    save(); render();
  }

  /* ---------------- FORGE ACTIONS ---------------- */
  function forgeWeapon(id) {
    const w = weaponCatalog.find(x => x.id === id); if (!w) return;
    if (state.forge.weapons[id]?.owned) return;
    if (state.stage < w.req) return showToast(`You must reach stage ${w.req}.`);
    if (!canPay(w.cost)) return showToast(`You need ${costText(w.cost)}.`);
    payCost(w.cost);
    state.forge.weapons[id] = { owned: true, refine: 0, temper: 0, awakened: false };
    if (!state.forge.equippedWeapon) state.forge.equippedWeapon = id;
    notify(`${w.name} forged${state.forge.equippedWeapon === id ? ' and equipped' : ''}.`, 'forge');
    fxBurst('reward', w.seal, w.name, 'Steel takes shape beneath the cold anvil.', w.ability);
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
    notify(`${w.name} awakens · ${w.ability}`, 'rare');
    fxBurst('rare', w.seal, `${w.name} Awakened`, 'The weapon remembers a name older than the sect.', w.ability);
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
      notify(`${def.name} bows its head · a bond is formed.`, 'beast');
      fxBurst('beast', def.icon, def.name, 'A new bond is recorded in the bestiary.', def.passive);
    } else notify(`${def.name} resists and vanishes into the wild.`, 'info');
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
    notify(`${def.name} evolved into ${evolved.name}!`, 'beast');
    fxBurst('beast', evolved.icon, evolved.name, `${def.name} has transformed. Its new bond is stronger.`, evolved.passive);
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
    notify(`The egg cracks · ${def.name} is born.`, 'beast');
    fxBurst('beast', def.icon, def.name, 'A mystic egg has hatched into a new companion.', def.passive);
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
    notify(`Quest complete · ${q.name} · ${rewardsText(q.reward)}.`, 'reward');
    fxBurst('reward', '傳', q.name, 'A story is settled, but the road continues.', rewardsText(q.reward));
    save(); render();
  }
  function claimDailyTask(id) {
    const task = state.daily.list.find(t => t.id === id); if (!task || task.claimed) return;
    if ((task.progress || 0) < task.target) return showToast('The challenge is not yet complete.');
    task.claimed = true;
    applyReward(task.reward);
    notify(`Daily challenge complete · ${rewardsText(task.reward)}.`, 'reward');
    rewardFloat(`+ ${rewardsText(task.reward)}`);
    save(); render();
  }
  function claimDailyPractice() {
    const ready = state.medSeconds >= 30 && state.qiToday >= 100 && (state.tripToday || 0) > 0;
    if (state.dailyClaimed || !ready) return;
    state.dailyClaimed = true;
    state.stones += 35;
    state.sectTokens += 3;
    notify('Daily practice complete · +35 spirit stones · +3 sect tokens.', 'reward');
    fxBurst('reward', '勤', 'Daily Practice Complete', 'The quiet work of a disciple is never wasted.', '+35 spirit stones · +3 sect tokens');
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
    const origin = state.origin;
    state.spirit = { ...defaultState().spirit };
    state.body = { ...defaultState().body };
    state.origin = origin || { unlocked: false, level: 0, name: 'Beyond the Origin' };
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
    if (state.spirit.realm < 4) return showToast('You must reach Soul Transformation to reincarnate.');
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
    if (state.spirit.realm < 9) return showToast('You must reach True Immortal to ascend.');
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
    if (state.stage < (t.req || 0)) return showToast(`${t.name} requires stage ${t.req}.`);
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
    if (!state.artRanks) state.artRanks = {};
    state.artRanks[id] = Math.max(1, state.artRanks[id] || 1);
    showToast(`${art.name} learned · it now appears in battle.`);
    save(); render();
  }
  function trainArt(id) {
    const art = martialArts.find(a => a.id === id); if (!art) return;
    if (!state.activeArts.includes(id)) return showToast('Learn this art first.');
    const rank = artRank(id);
    if (rank >= 5) return showToast(`${art.name} has reached its final rank.`);
    const cost = Math.round(150 * Math.pow(rank + 1, 1.45));
    const qiCost = Math.round(60 * (rank + 1));
    if (state.stones < cost || state.qi < qiCost) return showToast(`Attuning rank ${rank + 1} needs ◇ ${nfmt(cost)} and ${qiCost} qi.`);
    state.stones -= cost; state.qi -= qiCost;
    if (!state.artRanks) state.artRanks = {};
    state.artRanks[id] = rank + 1;
    notify(`${art.name} attuned to rank ${rank + 1} · base damage ${Math.round(art.damage * artDamageMult(id))}.`, 'reward');
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
  function selectRegion(id) {
    if (!regionData(id)) return;
    uiTabs.expeditions = id;
    render();
  }
  function surveyRegion(id) {
    const region = regionData(id); if (!region) return;
    if (state.stage < region.req) return showToast(`You must reach stage ${region.req} to survey this region.`);
    const rs = regionState(id);
    if (rs.found.length >= region.landmarks.length) return showToast('Every site in this region is already charted.');
    const qiCost = 20 + region.req * 3, stoneCost = 10 + region.req * 2;
    if (state.qi < qiCost || state.stones < stoneCost) return showToast(`A survey needs ${qiCost} qi and ◇ ${stoneCost}.`);
    state.qi -= qiCost; state.stones -= stoneCost; rs.surveys = (rs.surveys || 0) + 1;
    const remaining = region.landmarks.filter(lm => !rs.found.includes(lm.id));
    const rare = remaining.filter(lm => lm.rare);
    const common = remaining.filter(lm => !lm.rare);
    const target = rare.length && (!common.length || Math.random() < Math.min(.6, .2 + luckFor() * .018)) ? pick(rare) : pick(common.length ? common : rare);
    const chance = clamp(58 + luckFor() * 1.4 - (target.rare ? 14 : 0) + (target.rare && luckFor() >= 15 ? 12 : 0), 20, 96);
    if (Math.random() * 100 <= chance) {
      addDiscovery(id, target);
      save(); render();
      return;
    }
    const crumbs = Math.floor(6 + luckFor());
    state.stones += crumbs;
    state.discoveries.log.unshift({ region: id, landmark: null, name: 'Unmarked trail', at: Date.now() });
    if (state.discoveries.log.length > 30) state.discoveries.log.length = 30;
    notify(`The wilds elude you · +${crumbs} spirit stones found along the way.`, 'info');
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
    const linkedRegion = worldRegions.find(r => r.trip === def.id);
    if (linkedRegion) {
      const rs = regionState(linkedRegion.id);
      rs.visits = (rs.visits || 0) + 1;
      if (Math.random() * 100 < 18 + luckFor()) {
        const remaining = linkedRegion.landmarks.filter(lm => !rs.found.includes(lm.id));
        if (remaining.length) addDiscovery(linkedRegion.id, pick(remaining));
      }
    }
    const luck = luckFor();
    if (Math.random() * 100 < 6 + luck * .5) { addEgg(luck > 18 ? 'rare' : 'common'); notify('A mystic egg was hidden in the loot.', 'rare'); fxBurst('rare', '卵', 'Mystic Egg Found', 'A warm shell clicks softly against your pack.'); }
    if (Math.random() * 100 < 5 + luck * .4) { state.fate.maps = (state.fate.maps || 0) + 1; notify('A treasure map was tucked into your pack.', 'fate'); }
    if (Math.random() * 100 < 2 + luck * .2) { state.realms.keys = (state.realms.keys || 0) + 1; notify('A realm key was found among the stones.', 'rare'); }
    notify(`A safe return · +${nfmt(reward)} stones · +${def.rep} merit · ingredients gathered.`, 'reward');
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
    if (state.stage < 4) return showToast('Switching sects requires stage 4.');
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
    if (!item || state.equipment[id]?.owned) return;
    if (state.sectRank < (item.reqRank || 0)) return showToast(`${item.name} requires the rank of ${sectRanks[item.reqRank]?.name || 'a higher disciple'}.`);
    if (state.sectTokens < item.tokens) return showToast('You need more sect tokens to buy that equipment.');
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
    if (state.sectRank < (def.reqRank || 0)) return showToast(`${def.name} requires the rank of ${sectRanks[def.reqRank]?.name || 'a higher disciple'}.`);
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
    notify(`Ranking stipend claimed · +${stones} spirit stones · sect tokens.`, 'reward');
    save(); render();
  }
  function buyVault(id) {
    const item = sectVault.find(v => v.id === id); if (!item) return;
    if (state.sectTokens < item.tokens) return showToast(`The vault asks ${item.tokens} sect tokens.`);
    state.sectTokens -= item.tokens;
    applyReward(item.grant);
    notify(`Vault purchase · ${item.name} · ${rewardsText(item.grant)}.`, 'sect');
    fxBurst('reward', item.seal, item.name, rewardsText(item.grant), 'Withdrawn from the sect vault.');
    save(); render();
  }
  function performDuty(id) {
    const duty = sectDuties.find(d => d.id === id); if (!duty) return;
    if (state.sectPerks?.dutyDate === dayIndex()) return showToast('You have already served the sect today.');
    const qiCost = Math.abs(duty.qi || 0);
    if (state.qi < qiCost) return showToast(`This duty requires ${qiCost} qi.`);
    state.qi -= qiCost;
    state.sectTokens += duty.tokens || 0;
    addRep(duty.merit || 0);
    if (duty.stones) state.stones += duty.stones;
    if (duty.dao) {
      const each = duty.dao / daoPaths.length;
      daoPaths.forEach(d => { state.dao[d.id].xp += each * daoGainMult(d.id); });
    }
    const blessing = id === 'train' ? 'attack' : id === 'copy' ? 'break' : 'qi';
    state.sectPerks.dutyDate = dayIndex();
    state.sectPerks.dutyType = id;
    state.sectPerks.blessing = blessing;
    state.sectPerks.blessingUntil = Date.now() + 300000;
    const names = { qi: '+25% qi flow', attack: '+15% attack', break: '+5% breakthrough' };
    notify(`Duty complete · ${duty.name} · ${names[blessing]} for 5 minutes.`, 'sect');
    save(); render();
  }
  function claimBoon(id) {
    const boon = legacyBoons.find(b => b.id === id); if (!boon) return;
    if ((state.inheritance.boons || []).includes(id)) return showToast('This boon is already claimed.');
    if ((state.inheritance.points || 0) < boon.points) return showToast(`You need ${boon.points} legacy points.`);
    state.inheritance.points -= boon.points;
    state.inheritance.boons.push(id);
    applyReward(boon.grant);
    notify(`Legacy boon claimed · ${boon.name} · ${rewardsText(boon.grant)}.`, 'rare');
    fxBurst('rare', boon.seal, boon.name, rewardsText(boon.grant), 'The ancients remember their heir.');
    save(); render();
  }
  function temperWeapon(id) {
    const w = weaponCatalog.find(x => x.id === id), owned = state.forge.weapons[id];
    if (!w || !owned || (owned.temper || 0) >= forgeTempers) return;
    const cost = { stones: 90 + (owned.temper || 0) * 95, ore: 1 + Math.floor((owned.temper || 0) / 2) };
    if (!canPay(cost)) return showToast(`Tempering needs ${costText(cost)}.`);
    payCost(cost);
    owned.temper = (owned.temper || 0) + 1;
    notify(`${w.name} tempered to ${owned.temper}/${forgeTempers} · +2% attack.`, 'forge');
    save(); render();
  }
  function divineFate() {
    if (!state.fate.fragments && state.stones < 80) return showToast('Divination needs 1 fate fragment or ◇ 80.');
    if (state.fate.fragments > 0) state.fate.fragments -= 1; else state.stones -= 80;
    state.fate.divinations = (state.fate.divinations || 0) + 1;
    state.fate.luckBuff = 2; state.fate.luckBuffUntil = Date.now() + 600000;
    const hadPending = !!state.fate.pending;
    if (!hadPending) spawnFate();
    addFateLog(`Divination · ${hadPending ? 'the shape of the waiting fortune becomes clear.' : 'a new thread appears on the road.'}`);
    notify(`The road clarifies · +2 luck for 10 minutes${hadPending ? ' · a fortune already waits' : ' · a new fortune appears'}.`, 'fate');
    save(); render();
  }
  function offerIncense() {
    if (state.stones < 120) return showToast('The shrine incense costs ◇ 120.');
    state.stones -= 120;
    state.fate.offeringLuck = 3; state.fate.offeringUntil = Date.now() + 900000;
    addFateLog('Incense offered · the shrine smoke bends toward you.');
    notify('Incense offered · +3 luck for 15 minutes.', 'fate');
    save(); render();
  }
  function weaveFate() {
    if ((state.fate.fragments || 0) < 2) return showToast('Weaving a fortune needs 2 fate fragments.');
    state.fate.fragments -= 2;
    spawnFate();
    addFateLog(`Weaving · a new encounter takes shape · ${fateEvents.find(f => f.id === state.fate.pending?.id)?.title || 'unknown'}.`);
    notify('A new fortune is woven from the fragments.', 'fate');
    fxBurst('rare', '織', 'A Fortune Woven', 'Two futures become one road.', 'A new encounter waits in Fate & Fortune.');
    save(); render();
  }
  function refreshMerchant() {
    if ((state.fate.fragments || 0) < 1) return showToast('Refreshing the merchant needs 1 fate fragment.');
    if (state.fate.merchantRefreshDate === dayIndex()) return showToast('The merchant has already been asked today.');
    state.fate.fragments -= 1;
    state.fate.merchantRefreshDate = dayIndex();
    state.fate.merchantDate = 0;
    ensureFate();
    addFateLog('Merchant · the faceless merchant lays out a different selection.');
    notify('The merchant reveals different stock.', 'fate');
    save(); render();
  }
  function clearNotifications() {
    state.notifications = [];
    save(); render();
  }

  /* ---------------- TOOLTIPS & MOBILE NAVIGATION ---------------- */
  function showTooltip(target) {
    const tip = $('tooltip'); if (!tip || !target) return;
    const text = target.getAttribute('data-tip'); if (!text) return;
    tip.textContent = text; tip.hidden = false;
    const rect = target.getBoundingClientRect();
    const pad = 10;
    let left = rect.left + rect.width / 2;
    let top = rect.top - 10;
    const tipRect = tip.getBoundingClientRect();
    left = clamp(left, tipRect.width / 2 + pad, window.innerWidth - tipRect.width / 2 - pad);
    let placement = 'top';
    if (top - tipRect.height < pad) { top = rect.bottom + 10; placement = 'bottom'; }
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.dataset.place = placement;
    tip.classList.add('show');
  }
  function hideTooltip() {
    const tip = $('tooltip'); if (!tip) return;
    tip.classList.remove('show'); tip.hidden = true;
  }
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest?.('[data-tip]'); if (t) showTooltip(t);
  });
  document.addEventListener('pointerout', (e) => {
    const t = e.target.closest?.('[data-tip]');
    if (t && !t.contains(e.relatedTarget)) hideTooltip();
  });
  document.addEventListener('focusin', (e) => {
    const t = e.target.closest?.('[data-tip]'); if (t) showTooltip(t);
  });
  document.addEventListener('focusout', (e) => {
    if (e.target.closest?.('[data-tip]')) hideTooltip();
  });
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      const t = e.target.closest?.('[data-tip]');
      if (t) showTooltip(t); else hideTooltip();
    }
  });
  window.addEventListener('scroll', hideTooltip, { passive: true });
  window.addEventListener('resize', hideTooltip);

  function closeMobileNav() {
    $('sidebar')?.classList.remove('open');
    const scrim = $('navScrim'); if (scrim) scrim.hidden = true;
    $('menuToggle')?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
  $('menuToggle')?.addEventListener('click', () => {
    const sidebar = $('sidebar'); if (!sidebar) return;
    const open = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', open);
    const scrim = $('navScrim'); if (scrim) scrim.hidden = !open;
    $('menuToggle').setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  $('navScrim')?.addEventListener('click', closeMobileNav);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMobileNav(); hideTooltip(); closeModal(); } });

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
      case 'train-art': trainArt(id); break;
      case 'start-trip': startTrip(id); break;
      case 'collect-trip': collectTrip(); break;
      case 'select-region': selectRegion(id); break;
      case 'survey-region': surveyRegion(id); break;
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
      case 'buy-vault': buyVault(id); break;
      case 'perform-duty': performDuty(id); break;
      case 'challenge-rival': challengeRival(id); break;
      case 'arena-attack': arenaAttack(button.dataset.style); break;
      case 'arena-spell': arenaSpell(); break;
      case 'arena-art': arenaArt(id); break;
      case 'arena-retreat': arenaRetreat(); break;
      case 'clear-notifications': clearNotifications(); break;
      case 'attempt-break': attemptBreak(); break;
      case 'advance-spirit': advanceSpirit(); break;
      case 'advance-body': advanceBody(); break;
      case 'open-spirit-break': openSpiritBreakthrough(); break;
      case 'open-body-break': openBodyBreakthrough(); break;
      case 'attempt-spirit-break': attemptSpiritBreak(); break;
      case 'attempt-body-break': attemptBodyBreak(); break;
      case 'advance-origin': advanceOrigin(); break;
      case 'show-ending': showEnding(); break;
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
      case 'claim-boon': claimBoon(id); break;
      case 'enter-realm': enterRealm(id); break;
      case 'realm-attack': realmAttack(button.dataset.style); break;
      case 'realm-spell': realmSpell(); break;
      case 'realm-art': realmArt(id); break;
      case 'realm-retreat': retreatRealm(); break;
      case 'forge-weapon': forgeWeapon(id); break;
      case 'equip-weapon': equipWeapon(id); break;
      case 'refine-weapon': refineWeapon(id); break;
      case 'temper-weapon': temperWeapon(id); break;
      case 'awaken-weapon': awakenWeapon(id); break;
      case 'equip-artifact': equipArtifact(id, button.dataset.slot); break;
      case 'unequip-artifact': unequipArtifact(button.dataset.slot); break;
      case 'seek-fate': seekFate(); break;
      case 'resolve-fate': resolveFate(id); break;
      case 'buy-merchant': buyMerchant(id); break;
      case 'use-map': useMap(); break;
      case 'divine-fate': divineFate(); break;
      case 'offer-incense': offerIncense(); break;
      case 'weave-fate': weaveFate(); break;
      case 'refresh-merchant': refreshMerchant(); break;
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
    if ((pathTreeBonus('stonesPer') || 0) > 0 && state.totalSeconds % 20 === 0) state.stones += pathTreeBonus('stonesPer');
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
      notify('Your expedition has returned · collect your rewards.', 'reward');
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
