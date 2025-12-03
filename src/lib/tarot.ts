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
 * Card name mappings for PNG files (major arcana)
 */
const CARD_FILENAME_MAP: Record<string, string> = {
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
