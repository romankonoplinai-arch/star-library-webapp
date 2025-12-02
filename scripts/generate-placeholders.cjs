/**
 * Генератор SVG-заглушек для карт Таро
 * Создаёт красивые placeholder карты в космическом стиле
 */

const fs = require('fs')
const path = require('path')

const outputDir = path.join(__dirname, '..', 'public', 'cards')

// Цвета для мастей
const suitColors = {
  major: { bg: '#1a0a2e', accent: '#9333ea', glow: '#a855f7' },
  wands: { bg: '#1a0f0a', accent: '#ea580c', glow: '#f97316' },
  cups: { bg: '#0a1a1a', accent: '#0891b2', glow: '#22d3ee' },
  swords: { bg: '#0a0f1a', accent: '#3b82f6', glow: '#60a5fa' },
  pentacles: { bg: '#0f1a0a', accent: '#16a34a', glow: '#4ade80' }
}

// Символы мастей
const suitSymbols = {
  major: '✧',
  wands: '🜂',
  cups: '🜄',
  swords: '🜁',
  pentacles: '🜃'
}

// Все карты
const cards = [
  // Major Arcana
  { id: 'fool', name: 'The Fool', nameRu: 'Шут', suit: 'major', number: 0 },
  { id: 'magician', name: 'The Magician', nameRu: 'Маг', suit: 'major', number: 1 },
  { id: 'high_priestess', name: 'High Priestess', nameRu: 'Верховная Жрица', suit: 'major', number: 2 },
  { id: 'empress', name: 'The Empress', nameRu: 'Императрица', suit: 'major', number: 3 },
  { id: 'emperor', name: 'The Emperor', nameRu: 'Император', suit: 'major', number: 4 },
  { id: 'hierophant', name: 'The Hierophant', nameRu: 'Иерофант', suit: 'major', number: 5 },
  { id: 'lovers', name: 'The Lovers', nameRu: 'Влюблённые', suit: 'major', number: 6 },
  { id: 'chariot', name: 'The Chariot', nameRu: 'Колесница', suit: 'major', number: 7 },
  { id: 'strength', name: 'Strength', nameRu: 'Сила', suit: 'major', number: 8 },
  { id: 'hermit', name: 'The Hermit', nameRu: 'Отшельник', suit: 'major', number: 9 },
  { id: 'wheel', name: 'Wheel of Fortune', nameRu: 'Колесо Фортуны', suit: 'major', number: 10 },
  { id: 'justice', name: 'Justice', nameRu: 'Справедливость', suit: 'major', number: 11 },
  { id: 'hanged_man', name: 'The Hanged Man', nameRu: 'Повешенный', suit: 'major', number: 12 },
  { id: 'death', name: 'Death', nameRu: 'Смерть', suit: 'major', number: 13 },
  { id: 'temperance', name: 'Temperance', nameRu: 'Умеренность', suit: 'major', number: 14 },
  { id: 'devil', name: 'The Devil', nameRu: 'Дьявол', suit: 'major', number: 15 },
  { id: 'tower', name: 'The Tower', nameRu: 'Башня', suit: 'major', number: 16 },
  { id: 'star', name: 'The Star', nameRu: 'Звезда', suit: 'major', number: 17 },
  { id: 'moon', name: 'The Moon', nameRu: 'Луна', suit: 'major', number: 18 },
  { id: 'sun', name: 'The Sun', nameRu: 'Солнце', suit: 'major', number: 19 },
  { id: 'judgement', name: 'Judgement', nameRu: 'Суд', suit: 'major', number: 20 },
  { id: 'world', name: 'The World', nameRu: 'Мир', suit: 'major', number: 21 },
  // Wands
  { id: 'ace_wands', nameRu: 'Туз Жезлов', suit: 'wands', number: 1 },
  { id: '2_wands', nameRu: 'II Жезлов', suit: 'wands', number: 2 },
  { id: '3_wands', nameRu: 'III Жезлов', suit: 'wands', number: 3 },
  { id: '4_wands', nameRu: 'IV Жезлов', suit: 'wands', number: 4 },
  { id: '5_wands', nameRu: 'V Жезлов', suit: 'wands', number: 5 },
  { id: '6_wands', nameRu: 'VI Жезлов', suit: 'wands', number: 6 },
  { id: '7_wands', nameRu: 'VII Жезлов', suit: 'wands', number: 7 },
  { id: '8_wands', nameRu: 'VIII Жезлов', suit: 'wands', number: 8 },
  { id: '9_wands', nameRu: 'IX Жезлов', suit: 'wands', number: 9 },
  { id: '10_wands', nameRu: 'X Жезлов', suit: 'wands', number: 10 },
  { id: 'page_wands', nameRu: 'Паж Жезлов', suit: 'wands', number: 11 },
  { id: 'knight_wands', nameRu: 'Рыцарь Жезлов', suit: 'wands', number: 12 },
  { id: 'queen_wands', nameRu: 'Королева Жезлов', suit: 'wands', number: 13 },
  { id: 'king_wands', nameRu: 'Король Жезлов', suit: 'wands', number: 14 },
  // Cups
  { id: 'ace_cups', nameRu: 'Туз Кубков', suit: 'cups', number: 1 },
  { id: '2_cups', nameRu: 'II Кубков', suit: 'cups', number: 2 },
  { id: '3_cups', nameRu: 'III Кубков', suit: 'cups', number: 3 },
  { id: '4_cups', nameRu: 'IV Кубков', suit: 'cups', number: 4 },
  { id: '5_cups', nameRu: 'V Кубков', suit: 'cups', number: 5 },
  { id: '6_cups', nameRu: 'VI Кубков', suit: 'cups', number: 6 },
  { id: '7_cups', nameRu: 'VII Кубков', suit: 'cups', number: 7 },
  { id: '8_cups', nameRu: 'VIII Кубков', suit: 'cups', number: 8 },
  { id: '9_cups', nameRu: 'IX Кубков', suit: 'cups', number: 9 },
  { id: '10_cups', nameRu: 'X Кубков', suit: 'cups', number: 10 },
  { id: 'page_cups', nameRu: 'Паж Кубков', suit: 'cups', number: 11 },
  { id: 'knight_cups', nameRu: 'Рыцарь Кубков', suit: 'cups', number: 12 },
  { id: 'queen_cups', nameRu: 'Королева Кубков', suit: 'cups', number: 13 },
  { id: 'king_cups', nameRu: 'Король Кубков', suit: 'cups', number: 14 },
  // Swords
  { id: 'ace_swords', nameRu: 'Туз Мечей', suit: 'swords', number: 1 },
  { id: '2_swords', nameRu: 'II Мечей', suit: 'swords', number: 2 },
  { id: '3_swords', nameRu: 'III Мечей', suit: 'swords', number: 3 },
  { id: '4_swords', nameRu: 'IV Мечей', suit: 'swords', number: 4 },
  { id: '5_swords', nameRu: 'V Мечей', suit: 'swords', number: 5 },
  { id: '6_swords', nameRu: 'VI Мечей', suit: 'swords', number: 6 },
  { id: '7_swords', nameRu: 'VII Мечей', suit: 'swords', number: 7 },
  { id: '8_swords', nameRu: 'VIII Мечей', suit: 'swords', number: 8 },
  { id: '9_swords', nameRu: 'IX Мечей', suit: 'swords', number: 9 },
  { id: '10_swords', nameRu: 'X Мечей', suit: 'swords', number: 10 },
  { id: 'page_swords', nameRu: 'Паж Мечей', suit: 'swords', number: 11 },
  { id: 'knight_swords', nameRu: 'Рыцарь Мечей', suit: 'swords', number: 12 },
  { id: 'queen_swords', nameRu: 'Королева Мечей', suit: 'swords', number: 13 },
  { id: 'king_swords', nameRu: 'Король Мечей', suit: 'swords', number: 14 },
  // Pentacles
  { id: 'ace_pentacles', nameRu: 'Туз Пентаклей', suit: 'pentacles', number: 1 },
  { id: '2_pentacles', nameRu: 'II Пентаклей', suit: 'pentacles', number: 2 },
  { id: '3_pentacles', nameRu: 'III Пентаклей', suit: 'pentacles', number: 3 },
  { id: '4_pentacles', nameRu: 'IV Пентаклей', suit: 'pentacles', number: 4 },
  { id: '5_pentacles', nameRu: 'V Пентаклей', suit: 'pentacles', number: 5 },
  { id: '6_pentacles', nameRu: 'VI Пентаклей', suit: 'pentacles', number: 6 },
  { id: '7_pentacles', nameRu: 'VII Пентаклей', suit: 'pentacles', number: 7 },
  { id: '8_pentacles', nameRu: 'VIII Пентаклей', suit: 'pentacles', number: 8 },
  { id: '9_pentacles', nameRu: 'IX Пентаклей', suit: 'pentacles', number: 9 },
  { id: '10_pentacles', nameRu: 'X Пентаклей', suit: 'pentacles', number: 10 },
  { id: 'page_pentacles', nameRu: 'Паж Пентаклей', suit: 'pentacles', number: 11 },
  { id: 'knight_pentacles', nameRu: 'Рыцарь Пентаклей', suit: 'pentacles', number: 12 },
  { id: 'queen_pentacles', nameRu: 'Королева Пентаклей', suit: 'pentacles', number: 13 },
  { id: 'king_pentacles', nameRu: 'Король Пентаклей', suit: 'pentacles', number: 14 },
]

function generateSVG(card) {
  const colors = suitColors[card.suit]
  const symbol = suitSymbols[card.suit]
  const numeral = card.suit === 'major' ? toRoman(card.number) : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 630" width="360" height="630">
  <defs>
    <linearGradient id="bg-${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg}"/>
      <stop offset="100%" style="stop-color:#0a0a1a"/>
    </linearGradient>
    <linearGradient id="border-${card.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.accent}"/>
      <stop offset="50%" style="stop-color:${colors.glow}"/>
      <stop offset="100%" style="stop-color:${colors.accent}"/>
    </linearGradient>
    <filter id="glow-${card.id}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <pattern id="stars-${card.id}" width="50" height="50" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="0.5" fill="${colors.glow}" opacity="0.3"/>
      <circle cx="25" cy="15" r="0.3" fill="white" opacity="0.2"/>
      <circle cx="45" cy="35" r="0.4" fill="${colors.glow}" opacity="0.25"/>
      <circle cx="15" cy="45" r="0.3" fill="white" opacity="0.15"/>
      <circle cx="35" cy="25" r="0.5" fill="${colors.accent}" opacity="0.2"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="360" height="630" rx="20" fill="url(#bg-${card.id})"/>
  <rect width="360" height="630" rx="20" fill="url(#stars-${card.id})"/>

  <!-- Border -->
  <rect x="10" y="10" width="340" height="610" rx="15" fill="none" stroke="url(#border-${card.id})" stroke-width="2"/>
  <rect x="20" y="20" width="320" height="590" rx="12" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.3"/>

  <!-- Top decoration -->
  <text x="180" y="60" text-anchor="middle" fill="${colors.glow}" font-size="24" filter="url(#glow-${card.id})">${symbol}</text>
  ${card.suit === 'major' ? `<text x="180" y="90" text-anchor="middle" fill="${colors.accent}" font-size="18" font-family="serif">${numeral}</text>` : ''}

  <!-- Center symbol -->
  <text x="180" y="315" text-anchor="middle" fill="${colors.glow}" font-size="80" filter="url(#glow-${card.id})" opacity="0.6">${symbol}</text>

  <!-- Card name -->
  <text x="180" y="540" text-anchor="middle" fill="white" font-size="20" font-family="Georgia, serif" font-weight="bold">${card.nameRu}</text>
  ${card.name ? `<text x="180" y="565" text-anchor="middle" fill="${colors.accent}" font-size="12" font-family="Georgia, serif">${card.name}</text>` : ''}

  <!-- Bottom decoration -->
  <text x="180" y="600" text-anchor="middle" fill="${colors.glow}" font-size="18" filter="url(#glow-${card.id})">${symbol}</text>

  <!-- Corner decorations -->
  <circle cx="40" cy="40" r="3" fill="${colors.accent}" opacity="0.5"/>
  <circle cx="320" cy="40" r="3" fill="${colors.accent}" opacity="0.5"/>
  <circle cx="40" cy="590" r="3" fill="${colors.accent}" opacity="0.5"/>
  <circle cx="320" cy="590" r="3" fill="${colors.accent}" opacity="0.5"/>
</svg>`
}

function toRoman(num) {
  const romanNumerals = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
                         'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI']
  return romanNumerals[num] || num.toString()
}

async function generateAllCards() {
  // Create directories
  const suits = ['major', 'wands', 'cups', 'swords', 'pentacles']
  for (const suit of suits) {
    const dir = path.join(outputDir, suit)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  console.log('🎴 Generating SVG placeholder cards...\n')

  for (const card of cards) {
    const svg = generateSVG(card)
    const filePath = path.join(outputDir, card.suit, `${card.id}.svg`)
    fs.writeFileSync(filePath, svg)
    console.log(`✅ ${card.suit}/${card.id}.svg`)
  }

  console.log(`\n✨ Generated ${cards.length} placeholder cards!`)
}

generateAllCards()
