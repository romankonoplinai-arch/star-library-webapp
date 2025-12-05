export function useShare() {
  const share = (text: string, url?: string) => {
    const webApp = (window as any).Telegram?.WebApp

    // Default bot link if no URL provided
    const shareLink = url || 'https://t.me/Star_library_robot'

    // Build share URL for Telegram (url parameter is required for proper sharing)
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`

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
