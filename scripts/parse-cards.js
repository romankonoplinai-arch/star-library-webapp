// Script to parse tarot card metadata and create proper mapping

const metadata = `0603205238985_63_f02af86ef55229b471c1d1253058b510.jpg,"a trtd card of a woman wearing a crown sitting on an adorned chair, holding a sword, ""queen of swords"""
0603205238985_61_cb93169c7f120640584c2b00883308ae.jpg,"a trtd card of a young delicate woman holding a sword, ""page of swords"""
0603205238985_64_eb7c6746fbeb4552de04798d005a36f0.jpg,"a trtd card of a man wearing a crown sitting on a chair, holding a sword, ""king of swords"""
0603205238985_60_484c1e947ec887147750d73bebcc445f.jpg,a trtd card of a man laying down with swords piercing his back
0603205238985_62_4fa0a11fd5c5a00edcf37ac3f74d2368.jpg,"a trtd card of a knight mounting a running horse wearing an armor and holding a sword, ""knight of swords"""
0603205238985_58_d2627b0bdaf92ca202b9d578f52be080.jpg,"a trtd card of a woman blindfolded and bound, surrounded by swords stuck in the ground"
0603205238985_56_2c025245d18e13aa89bce15bdb949e6a.jpg,a trtd card of a woman on her back rowing a boat with swords pierced into it
0603205238985_55_9678e102349090196462da7b876869f2.jpg,"a trtd card of a person holding two swords, picking up one more"
0603205238985_59_8c86e6bbff27661032b574a00b564182.jpg,"a trtd card of a person sitting in bed, crying. there are swords on the wall"
0603205238985_57_6d88d900c18809aaa1556f523d86edce.jpg,"a trtd card of a person holding many swords while walking, smirking"
0603205238985_54_2d0e5181347701959cca210db239487b.jpg,"a trtd card of a person laying down on bed, sleeping. the bad and wall have drawn swords"
0603205238985_52_dc83a5e1ab8670b65fa0936705cb3cc5.jpg,a trtd card of a blindfolded woman with her hands crossed holding a sword on each hand
0603205238985_53_12af23e32d659ec73b276020ddf64c56.jpg,"a trtd card of a heart pierced by 3 swords, rainy clouds on the background"
0603205238985_51_9f25eaa7c24df141d7c46e7a7249540f.jpg,"a trtd card of a hand holding a sword. there's a crown on top of the sword, ""ace of swords"""
0603205238985_49_a2c774c05026e44ef20f7f62fe54326c.jpg,"a trtd card of a woman sitting on a throne, wearing a crown and holding a trophee, ""queen of cups"""
0603205238985_50_063fba44f1a033a2093808ef2a485070.jpg,"a trtd card of a man sitting on a throne, wearing a crown and holding a golden cup, ""king of cups"""
0603205238985_46_d684f3dfaea4ff1f3dd4a3a5bb8e77fa.jpg,"a trtd card of a couple hugging and children celebrating, peaceful bucolic background, looking at a rainbow composed of multiple golden cups"
0603205238985_47_b883905ee3aebd3ca64c142c64972734.jpg,a trtd card of a person wearing a funny dress and a funky hat holding a gold cup with a fish inside of it
0603205238985_42_b90e636ae4a7bfb9be97780bf285cf4f.jpg,"a trtd card of a child handing a cup to an old lady, there's a flower inside the cup"
0603205238985_48_2ed9176076924d8f685406e304a2eeed.jpg,a trtd card of a knight holding the cup while mounts on a stationary horse
0603205238985_45_d6c490c86d283bde215abad952b920f6.jpg,"a trtd card of a person sitting on a chair wearing a white dress and crossed arms, there's multiple golden cups on a table above him"
0603205238985_44_2699f4553247ad8fd0b10062199d6173.jpg,"a trtd card of a couple golden cups stacked on top of each other, a person is hiking fading into distance in the background, the moon has a serene face"
0603205238985_43_88df5949ec785c0a52e205e8c38eec31.jpg,a trtd card of a shadow of a person looking at multiple golden cups each with a different object inside
0603205238985_39_c50a4a2b55cdd14c62afa7bb3a8a2fcf.jpg,a trtd card of a group of people cheering on golden cups
0603205238985_41_dbd7e4f939f2bbf0be8f4747f85a696c.jpg,"a trtd card of a person wearing a black overall, looking down, gold cups are lying on the ground"
0603205238985_37_4f17a5163b978034a5b8a841b121443f.jpg,"a trtd card of a hand holding a golden cup, from the cup water comes out as if it's a fountain, a dove holds a crux on top of it, ""ace of cups"""
0603205238985_40_c5bee31e1c8097c9d27b0b3851976433.jpg,"a trtd card of a person sitting by a tree with crossed arms and closed eyes, medidating. a mysterious hand offers them a golden cup. there are three golden cups lying on the grass"
0603205238985_38_5da1301e81586bcf8c47b1d94ba468a2.jpg,"a trtd card of two people holding golden cups together, a winged creature wtih a lion face above them"
0603205238985_33_ac2ff146e881ad7299d39cd40120a7dd.jpg,"a trtd card of a young person wearing a hat with a feather, holding a tall staff with leaves. they are wearing ornate clothing and standing on a red ground with mountains in the background, ""page of wands"""
0603205238985_36_678c7a520dc6d9f72b26966f477092dc.jpg,"a trtd card of a man wearing a crown sitting on an ornate throne, holding a tall staff. he is wearing elaborate robes in red and yellow. behind him is a decorative yellow panel with black animal figures. at his feet is a small lizard-like creature. ""king of wands"""
0603205238985_32_67f868802676ebce90a210d956fc0294.jpg,a trtd card of a person wearing a red tunic carrying a bundle of ten tall staffs. they are bending forward under the weight. in the background there is a small village.
0603205238985_35_b1a791a787875aede882b7448a94a834.jpg,"a trtd card of a woman wearing a crown sitting on a throne, holding a tall staff. she is wearing a yellow robe with a white cape. there are lion heads on the armrests of her throne. a black cat sits at her feet. behind her is a red tapestry with flower designs. a sunflower is visible to her right. ""queen of wands"""
0603205238985_31_f88b72539a9a9779f8cf313cb566767c.jpg,"a trtd card of a person wearing a red tunic standing among nine tall staffs. they appear to be in a defensive posture, looking suspicious, holding one of the staffs. the background shows a hilly landscape"
0603205238985_29_1b6a140aedd216e64a674cf9a6c41b58.jpg,a trtd card of a person wearing a yellow tunic and red leggings holding a large staff with leaves. six other staffs are planted in the ground around them. the person has a determined expression. the background is pale green
0603205238985_34_06fe5991a12a0e820ca8447aa7af002f.jpg,"a trtd card of a knight mounting a running horse wearing an armor and holding a staff, ""knight of wands"""
0603205238985_30_04e181abfa90d0f747c0497fe350d59b.jpg,"a trtd card of light red staffs or wands arranged diagonally across a pale green background. The staffs have small leaf-like shapes at their ends. At the bottom, a simple landscape with hills or mountains"
0603205238985_28_a14a3ab44e937ba0de149408c8480729.jpg,"a trtd card of a knight mounting a white horse wearing a red cape and holding a tall staff, surrounded by five other tall staffs"
0603205238985_26_bd3ba5d3b1f11bc058249188d3a71a65.jpg,"a trtd card of a couple hugging and children celebrating, peaceful bucolic background, looking at a rainbow composed of multiple golden cups"
0603205238985_27_6a8a0ca314e8ac55dd143a9c4042f2df.jpg,"a trtd card of five people each holding a tall staff, some of them are facing each other, conflict"
0603205238985_21_696ecb953297e3192d5f2c898e16b131.jpg,"a trtd card of an angel with red wings blowing a trumpet, below are people rising from their graves with arms raised, ""judgement"""
0603205238985_22_cb000efb9912b049b4ac4b2f450880b2.jpg,"a trtd card of a nude woman wrapped in a purple cloth holding two wands, surrounded by a green wreath, with the four symbols of the evangelists in the corners, ""the world"""
0603205238985_25_f81b98bea89c8cba692948138ebd82df.jpg,"a trtd card of a person wearing a red and green robe, standing turned on their back, holding one of three tall staffs planted in the ground, looking out over a distant landscape"
0603205238985_24_573cb51379511fac771ec62bf35de19a.jpg,"a trtd card of a person wearing a red robe and hat, standing between two tall staffs, holding a globe in their hand, looking out over a landscape with water and mountains"
0603205238985_23_22ed1687f1e202dc482890610651359b.jpg,"a trtd card of a hand emerging from a cloud, holding a tall staff with leaves sprouting from it, a distant mountain and landscape in the background, ""ace of wands"""
0603205238985_16_3f282861b00f9fe6246cd8079fa7979e.jpg,"a trtd card of a horned figure with bat wings and an inverted pentagram on its forehead, sitting on a pedestal with a male and female figure chained below, ""the devil"""
0603205238985_19_268a5422bfd02678fbae1d39b384078c.jpg,"a trtd card of a large moon with a serene face in the sky, below are a dog and a wolf howling at the moon, with a crayfish emerging from a body of water, two towers in the background, ""the moon"""
0603205238985_18_6fbc854cb785a8cee939e015aa27dbf5.jpg,"a trtd card of a nude woman kneeling by a pool of water, pouring water from two jugs, surrounded by eight stars, with a bird in a tree in the background, ""the star"""
0603205238985_17_9bdf22277b1ca874d5a917140147278b.jpg,"a trtd card of a tall tower being struck by lightning, flames coming out from the top, and two figures falling from the tower, ""the tower"""
0603205238985_20_293caf99d19b4ba945159633c916d22a.jpg,"a trtd card of a bright sun with a face, shining down on a child riding a white horse, with sunflowers in the background, ""the sun"""
0603205238985_13_8a692ffa7c224b4ca161439322e33f37.jpg,"a trtd card of a person hanging upside down by one foot from a tree, with a serene expression and a halo around their head, ""the hanged man"""
0603205238985_09_fdb39f49409ce4c2a134479f4eb457f5.jpg,"a trtd card of a woman in a white dress and flower crown, gently taming a lion, with an infinity symbol above her head, ""strength"""
0603205238985_12_cb2452b3e455ec55a11fe96848da0f79.jpg,"a trtd card of a crowned figure sitting on a throne, holding a sword in one hand and scales in the other, with a red curtain behind them, ""justice"""
0603205238985_14_b69ffe0fc74c305601c760be0000c7d9.jpg,"a trtd card of a skeleton in black armor riding a white horse, holding a black flag with a white rose, trampling over figures on the ground, ""death"""
0603205238985_15_ad3f1fc96c2cae2a0b41441c428b6d7b.jpg,"a trtd card of an angel with red wings and a glowing halo, pouring liquid between two cups, standing with one foot on land and one foot in water, with a sun and mountains in the background, ""temperance"""
0603205238985_10_73075cf1cc03d23a3c959b8d3907aa8c.jpg,"a trtd card of an old man in a hooded robe holding a staff in one hand and a lit lantern in the other, standing on a snowy ground, ""the hermit"""
0603205238985_07_7049a3682c6707cd661a0c92b0d4b8a0.jpg,"a trtd card of a large wheel with various symbols and letters on it, surrounded by clouds, a sphinx sitting on top, a snake and a creature on the sides, and four winged creatures in the corners, ""wheel of fortune"""
0603205238985_07_7049a3682c6707cd661a0c92b0d4b8a0.jpg,"a trtd card of a naked man and woman standing beneath an angel with red wings, with a radiant sun and a mountain in the background, ""the lovers"""
0603205238985_08_c9344575d1cfb36a722090fa6f465eda.jpg,"a trtd card of a figure in armor standing in a chariot, holding a scepter, pulled by a black and a white sphinx, with a city in the background, ""the chariot"""
0603205238985_06_2f083cd664f6a22ef6a6bb0033183204.jpg,"a trtd card of a religious figure in elaborate robes and a triple crown, sitting on a throne, holding a scepter, with two followers kneeling before them, ""the hierophant"""
0603205238985_03_5c4ec1905aeae9bec5909153315e0269.jpg,"a trtd card of a seated woman in a blue robe and crown, holding a scroll, with two pillars labeled ""B"" and ""J"" on either side of her, and a tapestry with pomegranates behind her, ""the high priestess"""
0603205238985_02_5d4153da20d3d91dc0b84dd27247c1a5.jpg,"a trtd card of a figure in red robes with an infinity symbol above their head, standing at a table with a cup, wand, sword, and pentacle, one hand pointing to the sky and the other to the ground, ""the magician"""
0603205238985_04_e8af89ff25c8ad2180e1d6b564fe1930.jpg,"a trtd card of a woman wearing a crown of stars, sitting on a throne, holding a scepter, dressed in a robe with a pomegranate pattern, with a field and trees in the background, ""the empress"""
0603205238985_05_64a833c7ec42a8634fd0bbc92a1820a3.jpg,"a trtd card of a bearded man wearing a crown and red robes, sitting on a stone throne adorned with ram heads, holding a scepter in one hand and an orb in the other, with mountains in the background, ""the emperor"""
0603205238985_00_93f05f199fe56df4354be531f1666b53.jpg,"a trtd card of a young man standing on the edge of a cliff, looking up at the sky, holding a white rose in one hand and a small bag on a stick in the other, with a white dog at his feet and the sun shining brightly, ""the fool"""
0603205238985_77_254af0100053c750f194bd3cb5e7ff66.jpg,"a trtd card of a woman wearign a crown holding a golden medal with a pentacle drawing, ""queen of pentacles"""
0603205238985_74_c8de13051cf37f0034195c0a15fc832d.jpg,"a trtd card of en pentacles arranged in a pattern, in the foreground, in the background an old man with white hair and a beard, sitting outside a gate with a man and woman standing nearby"
0603205238985_76_219a1516764dd89076f68cc3fe13f06b.jpg,"a trtd card of a knight in full armor riding a dark horse, holding a pentacle in his hand, with a yellow background and plowed fields, ""knight of pentacles"""
0603205238985_78_acb14b5f1e2011ce9729ab2925e95c0c.jpg,"a trtd card of a man wearing a crown sitting on an adorned chair, holding a golden pentacle, ""king of pentacles"""
0603205238985_72_9e15c3c6db108357f05fbec114896e86.jpg,"a trtd card of a young man sitting on a bench, crafting a pentacle with a hammer and chisel, a bunch of pentacle coins on the wall"
0603205238985_75_efa6dbb48e298f27acdd3c04dd98e241.jpg,"a trtd card of a young person wearing a tunic and a red hat, holding a pentacle, ""page of pentacles"""
0603205238985_73_539ab150d137b2806c779b2eb3d1c524.jpg,"a trtd card of a woman wearing a robe with red patterns, holding a bird on her left hand and surrounded by nine pentacles"
0603205238985_71_9c63f27770932ab0a1157e3b4451f3ff.jpg,"a trtd card of a young man leaning on a staff, looking at a bush with seven pentacles"
0603205238985_67_ca47dcd4f58e8abc3b28f195a05e0d6a.jpg,"a trtd card of a person in a red robe holding a plan, another person in a hooded robe, and a craftsman working on a cathedral arch with three pentacles"
0603205238985_70_21a2e3232549fb406da262e7797c90ab.jpg,"a trtd card of a person in a red robe holding a scale and giving coins to two kneeling figures, surrounded by six pentacles"
0603205238985_68_1e943fd4e127e727cb382f0a37e86547.jpg,"a trtd card of a person wearing a crown and red robe, holding a pentacle, with one pentacle on their head and two under their feet"
0603205238985_65_5018e5b72e8ce116f1376028264ff011.jpg,"a trtd card of a hand emerging from clouds holding a golden pentacle, with a garden in the background, ""ace of pentacles"""
0603205238985_69_97a9f13f1c3faa0055f618793814566d.jpg,"a trtd card of two people walking in the snow, one on crutches, passing by a stained-glass"
0603205238985_66_9382be81d66ecc68554be184f491e74e.jpg,"a trtd card of a person wearing a red tunic and hat, juggling two pentacles with an infinity loop"`;

// Parse metadata
const cards = [];
const lines = metadata.trim().split('\n');

for (const line of lines) {
  const match = line.match(/^([^,]+\.jpg),(.+)$/);
  if (match) {
    const filename = match[1];
    const description = match[2].replace(/^"|"$/g, '');
    cards.push({ filename, description });
  }
}

// Card identification rules
function identifyCard(description) {
  const desc = description.toLowerCase();

  // Major Arcana (explicit names in quotes)
  const majorPatterns = [
    { pattern: /"the fool"/, id: 'fool', name: 'The Fool', nameRu: 'Шут', number: 0 },
    { pattern: /"the magician"/, id: 'magician', name: 'The Magician', nameRu: 'Маг', number: 1 },
    { pattern: /"the high priestess"/, id: 'high_priestess', name: 'The High Priestess', nameRu: 'Верховная Жрица', number: 2 },
    { pattern: /"the empress"/, id: 'empress', name: 'The Empress', nameRu: 'Императрица', number: 3 },
    { pattern: /"the emperor"/, id: 'emperor', name: 'The Emperor', nameRu: 'Император', number: 4 },
    { pattern: /"the hierophant"/, id: 'hierophant', name: 'The Hierophant', nameRu: 'Иерофант', number: 5 },
    { pattern: /"the lovers"/, id: 'lovers', name: 'The Lovers', nameRu: 'Влюблённые', number: 6 },
    { pattern: /"the chariot"/, id: 'chariot', name: 'The Chariot', nameRu: 'Колесница', number: 7 },
    { pattern: /"strength"/, id: 'strength', name: 'Strength', nameRu: 'Сила', number: 8 },
    { pattern: /"the hermit"/, id: 'hermit', name: 'The Hermit', nameRu: 'Отшельник', number: 9 },
    { pattern: /"wheel of fortune"/, id: 'wheel', name: 'Wheel of Fortune', nameRu: 'Колесо Фортуны', number: 10 },
    { pattern: /"justice"/, id: 'justice', name: 'Justice', nameRu: 'Справедливость', number: 11 },
    { pattern: /"the hanged man"/, id: 'hanged_man', name: 'The Hanged Man', nameRu: 'Повешенный', number: 12 },
    { pattern: /"death"/, id: 'death', name: 'Death', nameRu: 'Смерть', number: 13 },
    { pattern: /"temperance"/, id: 'temperance', name: 'Temperance', nameRu: 'Умеренность', number: 14 },
    { pattern: /"the devil"/, id: 'devil', name: 'The Devil', nameRu: 'Дьявол', number: 15 },
    { pattern: /"the tower"/, id: 'tower', name: 'The Tower', nameRu: 'Башня', number: 16 },
    { pattern: /"the star"/, id: 'star', name: 'The Star', nameRu: 'Звезда', number: 17 },
    { pattern: /"the moon"/, id: 'moon', name: 'The Moon', nameRu: 'Луна', number: 18 },
    { pattern: /"the sun"/, id: 'sun', name: 'The Sun', nameRu: 'Солнце', number: 19 },
    { pattern: /"judgement"/, id: 'judgement', name: 'Judgement', nameRu: 'Суд', number: 20 },
    { pattern: /"the world"/, id: 'world', name: 'The World', nameRu: 'Мир', number: 21 },
  ];

  for (const p of majorPatterns) {
    if (p.pattern.test(desc)) {
      return { ...p, suit: 'major' };
    }
  }

  // Minor Arcana - Court cards (explicit names)
  const courtPatterns = [
    // Swords
    { pattern: /"ace of swords"/, id: 'ace_swords', name: 'Ace of Swords', nameRu: 'Туз Мечей', suit: 'swords', number: 1 },
    { pattern: /"page of swords"/, id: 'page_swords', name: 'Page of Swords', nameRu: 'Паж Мечей', suit: 'swords', number: 11 },
    { pattern: /"knight of swords"/, id: 'knight_swords', name: 'Knight of Swords', nameRu: 'Рыцарь Мечей', suit: 'swords', number: 12 },
    { pattern: /"queen of swords"/, id: 'queen_swords', name: 'Queen of Swords', nameRu: 'Королева Мечей', suit: 'swords', number: 13 },
    { pattern: /"king of swords"/, id: 'king_swords', name: 'King of Swords', nameRu: 'Король Мечей', suit: 'swords', number: 14 },
    // Cups
    { pattern: /"ace of cups"/, id: 'ace_cups', name: 'Ace of Cups', nameRu: 'Туз Кубков', suit: 'cups', number: 1 },
    { pattern: /"page of cups"/, id: 'page_cups', name: 'Page of Cups', nameRu: 'Паж Кубков', suit: 'cups', number: 11 },
    { pattern: /"knight of cups"/, id: 'knight_cups', name: 'Knight of Cups', nameRu: 'Рыцарь Кубков', suit: 'cups', number: 12 },
    { pattern: /"queen of cups"/, id: 'queen_cups', name: 'Queen of Cups', nameRu: 'Королева Кубков', suit: 'cups', number: 13 },
    { pattern: /"king of cups"/, id: 'king_cups', name: 'King of Cups', nameRu: 'Король Кубков', suit: 'cups', number: 14 },
    // Wands
    { pattern: /"ace of wands"/, id: 'ace_wands', name: 'Ace of Wands', nameRu: 'Туз Жезлов', suit: 'wands', number: 1 },
    { pattern: /"page of wands"/, id: 'page_wands', name: 'Page of Wands', nameRu: 'Паж Жезлов', suit: 'wands', number: 11 },
    { pattern: /"knight of wands"/, id: 'knight_wands', name: 'Knight of Wands', nameRu: 'Рыцарь Жезлов', suit: 'wands', number: 12 },
    { pattern: /"queen of wands"/, id: 'queen_wands', name: 'Queen of Wands', nameRu: 'Королева Жезлов', suit: 'wands', number: 13 },
    { pattern: /"king of wands"/, id: 'king_wands', name: 'King of Wands', nameRu: 'Король Жезлов', suit: 'wands', number: 14 },
    // Pentacles
    { pattern: /"ace of pentacles"/, id: 'ace_pentacles', name: 'Ace of Pentacles', nameRu: 'Туз Пентаклей', suit: 'pentacles', number: 1 },
    { pattern: /"page of pentacles"/, id: 'page_pentacles', name: 'Page of Pentacles', nameRu: 'Паж Пентаклей', suit: 'pentacles', number: 11 },
    { pattern: /"knight of pentacles"/, id: 'knight_pentacles', name: 'Knight of Pentacles', nameRu: 'Рыцарь Пентаклей', suit: 'pentacles', number: 12 },
    { pattern: /"queen of pentacles"/, id: 'queen_pentacles', name: 'Queen of Pentacles', nameRu: 'Королева Пентаклей', suit: 'pentacles', number: 13 },
    { pattern: /"king of pentacles"/, id: 'king_pentacles', name: 'King of Pentacles', nameRu: 'Король Пентаклей', suit: 'pentacles', number: 14 },
  ];

  for (const p of courtPatterns) {
    if (p.pattern.test(desc)) {
      return p;
    }
  }

  // Minor Arcana - Number cards (by description analysis)
  // Swords
  if (desc.includes('sword')) {
    if (desc.includes('heart pierced by 3 swords')) return { id: '3_swords', name: 'Three of Swords', nameRu: 'Тройка Мечей', suit: 'swords', number: 3 };
    if (desc.includes('blindfolded') && desc.includes('hands crossed')) return { id: '2_swords', name: 'Two of Swords', nameRu: 'Двойка Мечей', suit: 'swords', number: 2 };
    if (desc.includes('sleeping') || desc.includes('laying down on bed')) return { id: '4_swords', name: 'Four of Swords', nameRu: 'Четвёрка Мечей', suit: 'swords', number: 4 };
    if (desc.includes('holding two swords') && desc.includes('picking up')) return { id: '5_swords', name: 'Five of Swords', nameRu: 'Пятёрка Мечей', suit: 'swords', number: 5 };
    if (desc.includes('rowing a boat')) return { id: '6_swords', name: 'Six of Swords', nameRu: 'Шестёрка Мечей', suit: 'swords', number: 6 };
    if (desc.includes('holding many swords') && desc.includes('smirking')) return { id: '7_swords', name: 'Seven of Swords', nameRu: 'Семёрка Мечей', suit: 'swords', number: 7 };
    if (desc.includes('blindfolded and bound')) return { id: '8_swords', name: 'Eight of Swords', nameRu: 'Восьмёрка Мечей', suit: 'swords', number: 8 };
    if (desc.includes('sitting in bed') && desc.includes('crying')) return { id: '9_swords', name: 'Nine of Swords', nameRu: 'Девятка Мечей', suit: 'swords', number: 9 };
    if (desc.includes('laying down') && desc.includes('piercing his back')) return { id: '10_swords', name: 'Ten of Swords', nameRu: 'Десятка Мечей', suit: 'swords', number: 10 };
  }

  // Cups
  if (desc.includes('cup') || desc.includes('golden cup')) {
    if (desc.includes('two people holding golden cups together')) return { id: '2_cups', name: 'Two of Cups', nameRu: 'Двойка Кубков', suit: 'cups', number: 2 };
    if (desc.includes('mysterious hand offers') && desc.includes('three golden cups')) return { id: '4_cups', name: 'Four of Cups', nameRu: 'Четвёрка Кубков', suit: 'cups', number: 4 };
    if (desc.includes('looking down') && desc.includes('cups are lying on the ground')) return { id: '5_cups', name: 'Five of Cups', nameRu: 'Пятёрка Кубков', suit: 'cups', number: 5 };
    if (desc.includes('child handing a cup')) return { id: '6_cups', name: 'Six of Cups', nameRu: 'Шестёрка Кубков', suit: 'cups', number: 6 };
    if (desc.includes('shadow') && desc.includes('multiple golden cups')) return { id: '7_cups', name: 'Seven of Cups', nameRu: 'Семёрка Кубков', suit: 'cups', number: 7 };
    if (desc.includes('hiking fading') && desc.includes('moon has a serene face')) return { id: '8_cups', name: 'Eight of Cups', nameRu: 'Восьмёрка Кубков', suit: 'cups', number: 8 };
    if (desc.includes('crossed arms') && desc.includes('cups on a table')) return { id: '9_cups', name: 'Nine of Cups', nameRu: 'Девятка Кубков', suit: 'cups', number: 9 };
    if (desc.includes('couple hugging') && desc.includes('children') && desc.includes('rainbow')) return { id: '10_cups', name: 'Ten of Cups', nameRu: 'Десятка Кубков', suit: 'cups', number: 10 };
    if (desc.includes('group of people cheering')) return { id: '3_cups', name: 'Three of Cups', nameRu: 'Тройка Кубков', suit: 'cups', number: 3 };
    if (desc.includes('fish inside')) return { id: 'page_cups', name: 'Page of Cups', nameRu: 'Паж Кубков', suit: 'cups', number: 11 };
    if (desc.includes('knight') && desc.includes('stationary horse')) return { id: 'knight_cups', name: 'Knight of Cups', nameRu: 'Рыцарь Кубков', suit: 'cups', number: 12 };
  }

  // Wands/Staffs
  if (desc.includes('staff') || desc.includes('wand')) {
    if (desc.includes('standing between two tall staffs') && desc.includes('globe')) return { id: '2_wands', name: 'Two of Wands', nameRu: 'Двойка Жезлов', suit: 'wands', number: 2 };
    if (desc.includes('standing turned on their back') && desc.includes('three tall staffs')) return { id: '3_wands', name: 'Three of Wands', nameRu: 'Тройка Жезлов', suit: 'wands', number: 3 };
    if (desc.includes('couple hugging') && !desc.includes('cup')) return { id: '4_wands', name: 'Four of Wands', nameRu: 'Четвёрка Жезлов', suit: 'wands', number: 4 };
    if (desc.includes('five people') && desc.includes('holding a tall staff')) return { id: '5_wands', name: 'Five of Wands', nameRu: 'Пятёрка Жезлов', suit: 'wands', number: 5 };
    if (desc.includes('white horse') && desc.includes('red cape') && desc.includes('surrounded by')) return { id: '6_wands', name: 'Six of Wands', nameRu: 'Шестёрка Жезлов', suit: 'wands', number: 6 };
    if (desc.includes('determined expression') && desc.includes('six other staffs')) return { id: '7_wands', name: 'Seven of Wands', nameRu: 'Семёрка Жезлов', suit: 'wands', number: 7 };
    if (desc.includes('arranged diagonally') || (desc.includes('light red staffs') && desc.includes('eight'))) return { id: '8_wands', name: 'Eight of Wands', nameRu: 'Восьмёрка Жезлов', suit: 'wands', number: 8 };
    if (desc.includes('defensive posture') && desc.includes('nine')) return { id: '9_wands', name: 'Nine of Wands', nameRu: 'Девятка Жезлов', suit: 'wands', number: 9 };
    if (desc.includes('carrying a bundle') && desc.includes('ten')) return { id: '10_wands', name: 'Ten of Wands', nameRu: 'Десятка Жезлов', suit: 'wands', number: 10 };
  }

  // Pentacles
  if (desc.includes('pentacle')) {
    if (desc.includes('juggling two pentacles')) return { id: '2_pentacles', name: 'Two of Pentacles', nameRu: 'Двойка Пентаклей', suit: 'pentacles', number: 2 };
    if (desc.includes('craftsman working') && desc.includes('three pentacles')) return { id: '3_pentacles', name: 'Three of Pentacles', nameRu: 'Тройка Пентаклей', suit: 'pentacles', number: 3 };
    if (desc.includes('crown and red robe') && desc.includes('on their head') && desc.includes('under their feet')) return { id: '4_pentacles', name: 'Four of Pentacles', nameRu: 'Четвёрка Пентаклей', suit: 'pentacles', number: 4 };
    if (desc.includes('walking in the snow') && desc.includes('crutches')) return { id: '5_pentacles', name: 'Five of Pentacles', nameRu: 'Пятёрка Пентаклей', suit: 'pentacles', number: 5 };
    if (desc.includes('scale') && desc.includes('giving coins')) return { id: '6_pentacles', name: 'Six of Pentacles', nameRu: 'Шестёрка Пентаклей', suit: 'pentacles', number: 6 };
    if (desc.includes('leaning on a staff') && desc.includes('seven pentacles')) return { id: '7_pentacles', name: 'Seven of Pentacles', nameRu: 'Семёрка Пентаклей', suit: 'pentacles', number: 7 };
    if (desc.includes('crafting a pentacle') && desc.includes('hammer')) return { id: '8_pentacles', name: 'Eight of Pentacles', nameRu: 'Восьмёрка Пентаклей', suit: 'pentacles', number: 8 };
    if (desc.includes('bird on her left hand') && desc.includes('nine pentacles')) return { id: '9_pentacles', name: 'Nine of Pentacles', nameRu: 'Девятка Пентаклей', suit: 'pentacles', number: 9 };
    if (desc.includes('old man') && desc.includes('outside a gate')) return { id: '10_pentacles', name: 'Ten of Pentacles', nameRu: 'Десятка Пентаклей', suit: 'pentacles', number: 10 };
  }

  return null;
}

// Process all cards
const mappedCards = [];
const unmapped = [];

for (const card of cards) {
  const identified = identifyCard(card.description);
  if (identified) {
    mappedCards.push({
      ...identified,
      originalFilename: card.filename,
      description: card.description
    });
  } else {
    unmapped.push(card);
  }
}

// Sort by suit and number
const suitOrder = { major: 0, wands: 1, cups: 2, swords: 3, pentacles: 4 };
mappedCards.sort((a, b) => {
  if (suitOrder[a.suit] !== suitOrder[b.suit]) {
    return suitOrder[a.suit] - suitOrder[b.suit];
  }
  return a.number - b.number;
});

console.log('=== MAPPED CARDS (' + mappedCards.length + ') ===\n');
for (const card of mappedCards) {
  console.log(`${card.suit.padEnd(10)} ${String(card.number).padStart(2)} | ${card.name.padEnd(22)} | ${card.nameRu.padEnd(20)} | ${card.originalFilename}`);
}

console.log('\n=== UNMAPPED CARDS (' + unmapped.length + ') ===\n');
for (const card of unmapped) {
  console.log(card.filename + ' -> ' + card.description.substring(0, 80) + '...');
}

// Generate TypeScript file
console.log('\n\n=== GENERATING TYPESCRIPT ===\n');

const tsOutput = `import type { TarotCard } from '@/types'

export const fullDeck: TarotCard[] = [
${mappedCards.map(c => `  {
    id: '${c.id}',
    name: '${c.name}',
    nameRu: '${c.nameRu}',
    suit: '${c.suit}',
    number: ${c.number},
    image: '/cards/${c.suit}/${c.id}.webp',
    keywords: [],
    meaningUpright: '',
    meaningReversed: ''
  }`).join(',\n')}
]

// Filename mapping for image conversion
export const filenameMap: Record<string, string> = {
${mappedCards.map(c => `  '${c.originalFilename}': '${c.suit}/${c.id}.webp'`).join(',\n')}
}
`;

console.log(tsOutput);
