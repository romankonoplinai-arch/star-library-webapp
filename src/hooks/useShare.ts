export function useShare() {
  const share = (text: string, url?: string) => {
    const webApp = (window as any).Telegram?.WebApp

    // Build share URL for Telegram
    const shareUrl = url
      ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://t.me/share/url?text=${encodeURIComponent(text)}`

    if (!webApp) {
      // Browser fallback
      window.open(shareUrl, '_blank')
      return
    }

    // Try openTelegramLink first (best for t.me links)
    if (typeof webApp.openTelegramLink === 'function') {
      webApp.openTelegramLink(shareUrl)
      return
    }

    // Fallback to openLink
    if (typeof webApp.openLink === 'function') {
      webApp.openLink(shareUrl)
      return
    }

    // Last resort
    window.open(shareUrl, '_blank')
  }

  return { share }
}
