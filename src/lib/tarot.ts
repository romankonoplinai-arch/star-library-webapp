/**
 * Tarot utility functions
 */

declare const __CACHE_VERSION__: string

/**
 * Get image URL for a tarot card based on its name
 * Converts card name to filename (e.g., "The Fool" -> "fool.svg")
 */
export function getTarotCardImageUrl(cardName: string, arcana: string = 'major'): string {
  // Remove "The " prefix and convert to lowercase
  const filename = cardName
    .toLowerCase()
    .replace(/^the /i, '') // Remove "The " from start
    .replace(/ /g, '_') // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, '') // Keep letters, numbers, underscores only

  // Use import.meta.env.BASE_URL which Vite GUARANTEES to replace correctly
  return `${import.meta.env.BASE_URL}cards/${arcana}/${filename}.svg?v=${__CACHE_VERSION__}`
}

/**
 * Card name mappings for PNG files (major + minor arcana)
 */
const CARD_FILENAME_MAP: Record<string, string> = {
  // Major Arcana
  'The Fool': '00-TheFool',
  'The Magician': '01-TheMagician',
  'The High Priestess': '02-TheHighPriestess',
  'The Empress': '03-TheEmpress',
  'The Emperor': '04-TheEmperor',
  'The Hierophant': '05-TheHierophant',
  'The Lovers': '06-TheLovers',
  'The Chariot': '07-TheChariot',
  'Strength': '08-Strength',
  'The Hermit': '09-TheHermit',
  'Wheel of Fortune': '10-WheelOfFortune',
  'Justice': '11-Justice',
  'The Hanged Man': '12-TheHangedMan',
  'Death': '13-Death',
  'Temperance': '14-Temperance',
  'The Devil': '15-TheDevil',
  'The Tower': '16-TheTower',
  'The Star': '17-TheStar',
  'The Moon': '18-TheMoon',
  'The Sun': '19-TheSun',
  'Judgement': '20-Judgement',
  'The World': '21-TheWorld',

  // Minor Arcana - Cups
  'Ace of Cups': 'Cups01',
  '2 of Cups': 'Cups02',
  '3 of Cups': 'Cups03',
  '4 of Cups': 'Cups04',
  '5 of Cups': 'Cups05',
  '6 of Cups': 'Cups06',
  '7 of Cups': 'Cups07',
  '8 of Cups': 'Cups08',
  '9 of Cups': 'Cups09',
  '10 of Cups': 'Cups10',
  'Page of Cups': 'Cups11',
  'Knight of Cups': 'Cups12',
  'Queen of Cups': 'Cups13',
  'King of Cups': 'Cups14',

  // Minor Arcana - Wands
  'Ace of Wands': 'Wands01',
  '2 of Wands': 'Wands02',
  '3 of Wands': 'Wands03',
  '4 of Wands': 'Wands04',
  '5 of Wands': 'Wands05',
  '6 of Wands': 'Wands06',
  '7 of Wands': 'Wands07',
  '8 of Wands': 'Wands08',
  '9 of Wands': 'Wands09',
  '10 of Wands': 'Wands10',
  'Page of Wands': 'Wands11',
  'Knight of Wands': 'Wands12',
  'Queen of Wands': 'Wands13',
  'King of Wands': 'Wands14',

  // Minor Arcana - Swords
  'Ace of Swords': 'Swords01',
  '2 of Swords': 'Swords02',
  '3 of Swords': 'Swords03',
  '4 of Swords': 'Swords04',
  '5 of Swords': 'Swords05',
  '6 of Swords': 'Swords06',
  '7 of Swords': 'Swords07',
  '8 of Swords': 'Swords08',
  '9 of Swords': 'Swords09',
  '10 of Swords': 'Swords10',
  'Page of Swords': 'Swords11',
  'Knight of Swords': 'Swords12',
  'Queen of Swords': 'Swords13',
  'King of Swords': 'Swords14',

  // Minor Arcana - Pentacles
  'Ace of Pentacles': 'Pentacles01',
  '2 of Pentacles': 'Pentacles02',
  '3 of Pentacles': 'Pentacles03',
  '4 of Pentacles': 'Pentacles04',
  '5 of Pentacles': 'Pentacles05',
  '6 of Pentacles': 'Pentacles06',
  '7 of Pentacles': 'Pentacles07',
  '8 of Pentacles': 'Pentacles08',
  '9 of Pentacles': 'Pentacles09',
  '10 of Pentacles': 'Pentacles10',
  'Page of Pentacles': 'Pentacles11',
  'Knight of Pentacles': 'Pentacles12',
  'Queen of Pentacles': 'Pentacles13',
  'King of Pentacles': 'Pentacles14',
}

/**
 * Get correct image URL using PNG cards
 */
export function getTarotCardImage(cardName: string, arcana: string = 'major'): string {
  // Try exact match first
  let filename = CARD_FILENAME_MAP[cardName]

  // If no match, try to generate filename from card name
  if (!filename) {
    console.warn(`No exact filename mapping for card: ${cardName}, trying fallback`)

    // Remove "The " prefix and convert to PascalCase
    const cleanName = cardName
      .replace(/^The /i, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')

    // Try to find the matching file by searching through known cards
    const cardNumber = Object.entries(CARD_FILENAME_MAP).findIndex(([key]) =>
      key.toLowerCase() === cardName.toLowerCase()
    )

    if (cardNumber >= 0) {
      const paddedNumber = cardNumber.toString().padStart(2, '0')
      filename = `${paddedNumber}-${cleanName}`
      console.log(`Found fallback: ${filename}`)
    } else {
      console.error(`Could not find mapping for: ${cardName}`)
      return `${import.meta.env.BASE_URL}cards/Cards-png/CardBacks.png?v=${__CACHE_VERSION__}`
    }
  }

  return `${import.meta.env.BASE_URL}cards/Cards-png/${filename}.png?v=${__CACHE_VERSION__}`
}

/**
 * Get card back image URL
 */
export function getCardBackImage(): string {
  return `${import.meta.env.BASE_URL}cards/Cards-png/CardBacks.png?v=${__CACHE_VERSION__}`
}
