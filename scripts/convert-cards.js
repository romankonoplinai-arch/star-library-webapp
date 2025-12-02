/**
 * Скрипт для конвертации карт Таро в WebP формат
 *
 * Использование:
 * 1. Установи sharp: npm install sharp
 * 2. Запусти: node scripts/convert-cards.js "D:/ТАРО"
 *
 * Скрипт:
 * - Читает JPG файлы из указанной папки
 * - Конвертирует их в WebP (качество 85%)
 * - Изменяет размер до 360x630 (оптимально для мобильных)
 * - Раскладывает по папкам: major/, wands/, cups/, swords/, pentacles/
 */

const fs = require('fs')
const path = require('path')

// Проверяем наличие sharp
let sharp
try {
  sharp = require('sharp')
} catch (e) {
  console.error('❌ Sharp не установлен. Установи его командой:')
  console.error('   npm install sharp')
  process.exit(1)
}

// Маппинг оригинальных файлов к нашим именам
const filenameMap = {
  // Major Arcana
  '0603205238985_00_93f05f199fe56df4354be531f1666b53.jpg': 'major/fool.webp',
  '0603205238985_02_5d4153da20d3d91dc0b84dd27247c1a5.jpg': 'major/magician.webp',
  '0603205238985_03_5c4ec1905aeae9bec5909153315e0269.jpg': 'major/high_priestess.webp',
  '0603205238985_04_e8af89ff25c8ad2180e1d6b564fe1930.jpg': 'major/empress.webp',
  '0603205238985_05_64a833c7ec42a8634fd0bbc92a1820a3.jpg': 'major/emperor.webp',
  '0603205238985_06_2f083cd664f6a22ef6a6bb0033183204.jpg': 'major/hierophant.webp',
  '0603205238985_07_7049a3682c6707cd661a0c92b0d4b8a0.jpg': 'major/lovers.webp',
  '0603205238985_08_c9344575d1cfb36a722090fa6f465eda.jpg': 'major/chariot.webp',
  '0603205238985_09_fdb39f49409ce4c2a134479f4eb457f5.jpg': 'major/strength.webp',
  '0603205238985_10_73075cf1cc03d23a3c959b8d3907aa8c.jpg': 'major/hermit.webp',
  // Note: Need separate file for Wheel of Fortune (file _07_ is used for Lovers)
  // '0603205238985_11_xxx.jpg': 'major/wheel.webp',
  '0603205238985_12_cb2452b3e455ec55a11fe96848da0f79.jpg': 'major/justice.webp',
  '0603205238985_13_8a692ffa7c224b4ca161439322e33f37.jpg': 'major/hanged_man.webp',
  '0603205238985_14_b69ffe0fc74c305601c760be0000c7d9.jpg': 'major/death.webp',
  '0603205238985_15_ad3f1fc96c2cae2a0b41441c428b6d7b.jpg': 'major/temperance.webp',
  '0603205238985_16_3f282861b00f9fe6246cd8079fa7979e.jpg': 'major/devil.webp',
  '0603205238985_17_9bdf22277b1ca874d5a917140147278b.jpg': 'major/tower.webp',
  '0603205238985_18_6fbc854cb785a8cee939e015aa27dbf5.jpg': 'major/star.webp',
  '0603205238985_19_268a5422bfd02678fbae1d39b384078c.jpg': 'major/moon.webp',
  '0603205238985_20_293caf99d19b4ba945159633c916d22a.jpg': 'major/sun.webp',
  '0603205238985_21_696ecb953297e3192d5f2c898e16b131.jpg': 'major/judgement.webp',
  '0603205238985_22_cb000efb9912b049b4ac4b2f450880b2.jpg': 'major/world.webp',
  // Wands
  '0603205238985_23_22ed1687f1e202dc482890610651359b.jpg': 'wands/ace_wands.webp',
  '0603205238985_24_573cb51379511fac771ec62bf35de19a.jpg': 'wands/2_wands.webp',
  '0603205238985_25_f81b98bea89c8cba692948138ebd82df.jpg': 'wands/3_wands.webp',
  '0603205238985_26_bd3ba5d3b1f11bc058249188d3a71a65.jpg': 'wands/4_wands.webp',
  '0603205238985_27_6a8a0ca314e8ac55dd143a9c4042f2df.jpg': 'wands/5_wands.webp',
  '0603205238985_28_a14a3ab44e937ba0de149408c8480729.jpg': 'wands/6_wands.webp',
  '0603205238985_29_1b6a140aedd216e64a674cf9a6c41b58.jpg': 'wands/7_wands.webp',
  '0603205238985_30_04e181abfa90d0f747c0497fe350d59b.jpg': 'wands/8_wands.webp',
  '0603205238985_31_f88b72539a9a9779f8cf313cb566767c.jpg': 'wands/9_wands.webp',
  '0603205238985_32_67f868802676ebce90a210d956fc0294.jpg': 'wands/10_wands.webp',
  '0603205238985_33_ac2ff146e881ad7299d39cd40120a7dd.jpg': 'wands/page_wands.webp',
  '0603205238985_34_06fe5991a12a0e820ca8447aa7af002f.jpg': 'wands/knight_wands.webp',
  '0603205238985_35_b1a791a787875aede882b7448a94a834.jpg': 'wands/queen_wands.webp',
  '0603205238985_36_678c7a520dc6d9f72b26966f477092dc.jpg': 'wands/king_wands.webp',
  // Cups
  '0603205238985_37_4f17a5163b978034a5b8a841b121443f.jpg': 'cups/ace_cups.webp',
  '0603205238985_38_5da1301e81586bcf8c47b1d94ba468a2.jpg': 'cups/2_cups.webp',
  '0603205238985_39_c50a4a2b55cdd14c62afa7bb3a8a2fcf.jpg': 'cups/3_cups.webp',
  '0603205238985_40_c5bee31e1c8097c9d27b0b3851976433.jpg': 'cups/4_cups.webp',
  '0603205238985_41_dbd7e4f939f2bbf0be8f4747f85a696c.jpg': 'cups/5_cups.webp',
  '0603205238985_42_b90e636ae4a7bfb9be97780bf285cf4f.jpg': 'cups/6_cups.webp',
  '0603205238985_43_88df5949ec785c0a52e205e8c38eec31.jpg': 'cups/7_cups.webp',
  '0603205238985_44_2699f4553247ad8fd0b10062199d6173.jpg': 'cups/8_cups.webp',
  '0603205238985_45_d6c490c86d283bde215abad952b920f6.jpg': 'cups/9_cups.webp',
  '0603205238985_46_d684f3dfaea4ff1f3dd4a3a5bb8e77fa.jpg': 'cups/10_cups.webp',
  '0603205238985_47_b883905ee3aebd3ca64c142c64972734.jpg': 'cups/page_cups.webp',
  '0603205238985_48_2ed9176076924d8f685406e304a2eeed.jpg': 'cups/knight_cups.webp',
  '0603205238985_49_a2c774c05026e44ef20f7f62fe54326c.jpg': 'cups/queen_cups.webp',
  '0603205238985_50_063fba44f1a033a2093808ef2a485070.jpg': 'cups/king_cups.webp',
  // Swords
  '0603205238985_51_9f25eaa7c24df141d7c46e7a7249540f.jpg': 'swords/ace_swords.webp',
  '0603205238985_52_dc83a5e1ab8670b65fa0936705cb3cc5.jpg': 'swords/2_swords.webp',
  '0603205238985_53_12af23e32d659ec73b276020ddf64c56.jpg': 'swords/3_swords.webp',
  '0603205238985_54_2d0e5181347701959cca210db239487b.jpg': 'swords/4_swords.webp',
  '0603205238985_55_9678e102349090196462da7b876869f2.jpg': 'swords/5_swords.webp',
  '0603205238985_56_2c025245d18e13aa89bce15bdb949e6a.jpg': 'swords/6_swords.webp',
  '0603205238985_57_6d88d900c18809aaa1556f523d86edce.jpg': 'swords/7_swords.webp',
  '0603205238985_58_d2627b0bdaf92ca202b9d578f52be080.jpg': 'swords/8_swords.webp',
  '0603205238985_59_8c86e6bbff27661032b574a00b564182.jpg': 'swords/9_swords.webp',
  '0603205238985_60_484c1e947ec887147750d73bebcc445f.jpg': 'swords/10_swords.webp',
  '0603205238985_61_cb93169c7f120640584c2b00883308ae.jpg': 'swords/page_swords.webp',
  '0603205238985_62_4fa0a11fd5c5a00edcf37ac3f74d2368.jpg': 'swords/knight_swords.webp',
  '0603205238985_63_f02af86ef55229b471c1d1253058b510.jpg': 'swords/queen_swords.webp',
  '0603205238985_64_eb7c6746fbeb4552de04798d005a36f0.jpg': 'swords/king_swords.webp',
  // Pentacles
  '0603205238985_65_5018e5b72e8ce116f1376028264ff011.jpg': 'pentacles/ace_pentacles.webp',
  '0603205238985_66_9382be81d66ecc68554be184f491e74e.jpg': 'pentacles/2_pentacles.webp',
  '0603205238985_67_ca47dcd4f58e8abc3b28f195a05e0d6a.jpg': 'pentacles/3_pentacles.webp',
  '0603205238985_68_1e943fd4e127e727cb382f0a37e86547.jpg': 'pentacles/4_pentacles.webp',
  '0603205238985_69_97a9f13f1c3faa0055f618793814566d.jpg': 'pentacles/5_pentacles.webp',
  '0603205238985_70_21a2e3232549fb406da262e7797c90ab.jpg': 'pentacles/6_pentacles.webp',
  '0603205238985_71_9c63f27770932ab0a1157e3b4451f3ff.jpg': 'pentacles/7_pentacles.webp',
  '0603205238985_72_9e15c3c6db108357f05fbec114896e86.jpg': 'pentacles/8_pentacles.webp',
  '0603205238985_73_539ab150d137b2806c779b2eb3d1c524.jpg': 'pentacles/9_pentacles.webp',
  '0603205238985_74_c8de13051cf37f0034195c0a15fc832d.jpg': 'pentacles/10_pentacles.webp',
  '0603205238985_75_efa6dbb48e298f27acdd3c04dd98e241.jpg': 'pentacles/page_pentacles.webp',
  '0603205238985_76_219a1516764dd89076f68cc3fe13f06b.jpg': 'pentacles/knight_pentacles.webp',
  '0603205238985_77_254af0100053c750f194bd3cb5e7ff66.jpg': 'pentacles/queen_pentacles.webp',
  '0603205238985_78_acb14b5f1e2011ce9729ab2925e95c0c.jpg': 'pentacles/king_pentacles.webp',
}

async function convertCards(inputDir) {
  const outputDir = path.join(__dirname, '..', 'public', 'cards')

  // Создаём папки
  const suits = ['major', 'wands', 'cups', 'swords', 'pentacles']
  for (const suit of suits) {
    const dir = path.join(outputDir, suit)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`📁 Создана папка: ${dir}`)
    }
  }

  // Получаем список файлов
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.jpg') || f.endsWith('.JPG'))
  console.log(`\n📷 Найдено ${files.length} JPG файлов\n`)

  let converted = 0
  let skipped = 0
  let notFound = 0

  for (const filename of files) {
    const targetPath = filenameMap[filename]

    if (!targetPath) {
      console.log(`⚠️  Неизвестный файл: ${filename}`)
      notFound++
      continue
    }

    const inputPath = path.join(inputDir, filename)
    const outputPath = path.join(outputDir, targetPath)

    try {
      await sharp(inputPath)
        .resize(360, 630, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toFile(outputPath)

      console.log(`✅ ${filename} → ${targetPath}`)
      converted++
    } catch (err) {
      console.error(`❌ Ошибка: ${filename} - ${err.message}`)
      skipped++
    }
  }

  console.log(`\n${'═'.repeat(50)}`)
  console.log(`✅ Конвертировано: ${converted}`)
  console.log(`⚠️  Не найдено в маппинге: ${notFound}`)
  console.log(`❌ Ошибки: ${skipped}`)
  console.log(`${'═'.repeat(50)}\n`)

  // Проверяем какие карты отсутствуют
  const expectedCards = Object.values(filenameMap)
  const existingCards = []

  for (const suit of suits) {
    const dir = path.join(outputDir, suit)
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
      for (const f of files) {
        existingCards.push(`${suit}/${f}`)
      }
    }
  }

  const missingCards = expectedCards.filter(c => !existingCards.includes(c))
  if (missingCards.length > 0) {
    console.log(`⚠️  Отсутствующие карты (${missingCards.length}):`)
    missingCards.forEach(c => console.log(`   - ${c}`))
  }
}

// Запуск
const inputDir = process.argv[2]
if (!inputDir) {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║          🔮 Конвертер карт Таро в WebP                    ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Использование:                                           ║
║    node scripts/convert-cards.js "путь/к/картам"          ║
║                                                           ║
║  Пример:                                                  ║
║    node scripts/convert-cards.js "D:/ТАРО"                ║
║                                                           ║
║  Скрипт:                                                  ║
║    • Конвертирует JPG → WebP (качество 85%)               ║
║    • Изменяет размер до 360x630                           ║
║    • Раскладывает по папкам мастей                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`)
  process.exit(1)
}

if (!fs.existsSync(inputDir)) {
  console.error(`❌ Папка не найдена: ${inputDir}`)
  process.exit(1)
}

convertCards(inputDir)
