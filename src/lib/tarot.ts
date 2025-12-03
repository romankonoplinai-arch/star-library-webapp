/**
 * Tarot utility functions
 */

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

  return `/cards/${arcana}/${filename}.svg?v=${Date.now()}`
}

/**
 * Card name mappings for correct filenames
 */
const CARD_FILENAME_MAP: Record<string, string> = {
  'The Fool': 'fool',
  'The Magician': 'magician',
  'The High Priestess': 'high_priestess',
  'The Empress': 'empress',
  'The Emperor': 'emperor',
  'The Hierophant': 'hierophant',
  'The Lovers': 'lovers',
  'The Chariot': 'chariot',
  'Strength': 'strength',
  'The Hermit': 'hermit',
  'Wheel of Fortune': 'wheel_of_fortune',
  'Justice': 'justice',
  'The Hanged Man': 'hanged_man',
  'Death': 'death',
  'Temperance': 'temperance',
  'The Devil': 'devil',
  'The Tower': 'tower',
  'The Star': 'star',
  'The Moon': 'moon',
  'The Sun': 'sun',
  'Judgement': 'judgement',
  'The World': 'world',
}

/**
 * Get correct image URL using mapping (more reliable)
 */
export function getTarotCardImage(cardName: string, arcana: string = 'major'): string {
  const filename = CARD_FILENAME_MAP[cardName] || getTarotCardImageUrl(cardName, arcana).split('/').pop()?.replace('.svg', '').split('?')[0]
  return `/cards/${arcana}/${filename}.svg?v=${Date.now()}`
}
