export function useShare() {
  const share = (text: string, url?: string) => {
    // Get Telegram WebApp instance with proper typing
    const webApp = (window as any).Telegram?.WebApp

    if (!webApp) {
      console.warn('Telegram WebApp not available')
      return
    }

    // Build share URL for Telegram
    const shareUrl = url
      ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      : `https://t.me/share/url?text=${encodeURIComponent(text)}`

    // Use openTelegramLink to open share dialog
    if (typeof webApp.openTelegramLink === 'function') {
      webApp.openTelegramLink(shareUrl)
      return
    }

    // Fallback to openLink
    if (typeof webApp.openLink === 'function') {
      webApp.openLink(shareUrl)
    }
  }

  return { share }
}
