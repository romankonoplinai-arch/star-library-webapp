import { useTelegram } from './useTelegram'

export function useShare() {
  const { webApp } = useTelegram()

  const share = (text: string, url?: string) => {
    if (!webApp) {
      console.warn('Telegram WebApp not available')
      return
    }

    // Try shareToStory API (newer)
    if (typeof webApp.shareToStory === 'function') {
      webApp.shareToStory(text, url)
      return
    }

    // Fallback to openTelegramLink
    if (typeof webApp.openTelegramLink === 'function') {
      const shareUrl = url
        ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        : `https://t.me/share/url?text=${encodeURIComponent(text)}`
      webApp.openTelegramLink(shareUrl)
      return
    }

    // Last resort: openLink
    if (typeof webApp.openLink === 'function') {
      const shareUrl = url
        ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        : `https://t.me/share/url?text=${encodeURIComponent(text)}`
      webApp.openLink(shareUrl)
    }
  }

  return { share }
}
