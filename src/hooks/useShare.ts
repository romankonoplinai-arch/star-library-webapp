export function useShare() {
  const share = (text: string, url?: string) => {
    // Get Telegram WebApp instance with proper typing
    const webApp = (window as any).Telegram?.WebApp

    if (!webApp) {
      console.warn('Telegram WebApp not available')
      return
    }

    // Try shareToStory API (newer) - using any type to bypass TypeScript checks
    if (typeof (webApp as any).shareToStory === 'function') {
      ;(webApp as any).shareToStory(text, url)
      return
    }

    // Fallback to openTelegramLink
    if (typeof (webApp as any).openTelegramLink === 'function') {
      const shareUrl = url
        ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        : `https://t.me/share/url?text=${encodeURIComponent(text)}`
      ;(webApp as any).openTelegramLink(shareUrl)
      return
    }

    // Last resort: openLink
    if (typeof (webApp as any).openLink === 'function') {
      const shareUrl = url
        ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        : `https://t.me/share/url?text=${encodeURIComponent(text)}`
      ;(webApp as any).openLink(shareUrl)
    }
  }

  return { share }
}
