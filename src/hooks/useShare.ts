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

    // Build share URL for Telegram
    const shareUrl = url
      ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://t.me/share/url?text=${encodeURIComponent(text)}`

    console.log('Sharing via Telegram:', shareUrl)

    // Use openTelegramLink to open share dialog
    if (typeof webApp.openTelegramLink === 'function') {
      try {
        webApp.openTelegramLink(shareUrl)
      } catch (e) {
        console.error('openTelegramLink failed:', e)
        // Try switchInlineQuery as fallback
        if (typeof webApp.switchInlineQuery === 'function') {
          webApp.switchInlineQuery(text, ['users', 'groups', 'channels'])
        }
      }
      return
    }

    // Fallback to openLink
    if (typeof webApp.openLink === 'function') {
      webApp.openLink(shareUrl)
    }
  }

  return { share }
}
