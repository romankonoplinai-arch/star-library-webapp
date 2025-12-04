export function useShare() {
  const share = (text: string, url?: string) => {
    // Get Telegram WebApp instance with proper typing
    const webApp = (window as any).Telegram?.WebApp

    if (!webApp) {
      console.warn('Telegram WebApp not available')
      // Fallback for browser testing
      if (navigator.share) {
        navigator.share({ text, url }).catch(console.error)
      } else {
        alert(`Поделиться: ${text}`)
      }
      return
    }

    console.log('Sharing text:', text)

    // Try switchInlineQuery first (best for sharing in Telegram)
    if (typeof webApp.switchInlineQuery === 'function') {
      try {
        // Truncate text if too long for inline query
        const shortText = text.length > 256 ? text.slice(0, 253) + '...' : text
        webApp.switchInlineQuery(shortText, ['users', 'groups', 'channels'])
        return
      } catch (e) {
        console.error('switchInlineQuery failed:', e)
      }
    }

    // Build share URL for Telegram
    const shareUrl = url
      ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://t.me/share/url?text=${encodeURIComponent(text)}`

    // Try openTelegramLink
    if (typeof webApp.openTelegramLink === 'function') {
      try {
        webApp.openTelegramLink(shareUrl)
        return
      } catch (e) {
        console.error('openTelegramLink failed:', e)
      }
    }

    // Fallback to openLink
    if (typeof webApp.openLink === 'function') {
      webApp.openLink(shareUrl)
    }
  }

  return { share }
}
