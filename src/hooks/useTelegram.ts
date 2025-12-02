import { useEffect, useState, useCallback } from 'react'

export interface TelegramUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
  languageCode?: string
  isPremium?: boolean
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
      is_premium?: boolean
    }
    start_param?: string
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [initDataRaw, setInitDataRaw] = useState<string>('')

  useEffect(() => {
    const tg = window.Telegram?.WebApp

    if (tg) {
      // Инициализация
      tg.ready()
      tg.expand()
      tg.enableClosingConfirmation()

      // Получение данных пользователя
      const userData = tg.initDataUnsafe?.user
      if (userData) {
        setUser({
          id: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          username: userData.username,
          languageCode: userData.language_code,
          isPremium: userData.is_premium,
        })
      }

      setInitDataRaw(tg.initData || '')
      setIsReady(true)
    } else {
      // Dev mode без Telegram
      setIsReady(true)
    }
  }, [])

  const getStartParam = useCallback(() => {
    return window.Telegram?.WebApp?.initDataUnsafe?.start_param
  }, [])

  return {
    user,
    isReady,
    initDataRaw,
    startParam: getStartParam(),
    webApp: window.Telegram?.WebApp,
  }
}

// Отдельный хук для haptic feedback
export function useHaptic() {
  const haptic = window.Telegram?.WebApp?.HapticFeedback

  return {
    light: () => haptic?.impactOccurred('light'),
    medium: () => haptic?.impactOccurred('medium'),
    heavy: () => haptic?.impactOccurred('heavy'),
    success: () => haptic?.notificationOccurred('success'),
    warning: () => haptic?.notificationOccurred('warning'),
    error: () => haptic?.notificationOccurred('error'),
    selection: () => haptic?.selectionChanged(),
  }
}

// Хук для MainButton
export function useMainButton() {
  const mainButton = window.Telegram?.WebApp?.MainButton

  const show = useCallback((text: string, onClick: () => void) => {
    if (!mainButton) return

    mainButton.setText(text)
    mainButton.onClick(onClick)
    mainButton.show()
    mainButton.enable()

    return () => {
      mainButton.offClick(onClick)
      mainButton.hide()
    }
  }, [mainButton])

  const hide = useCallback(() => {
    mainButton?.hide()
  }, [mainButton])

  return { show, hide, mainButton }
}

// Хук для BackButton
export function useBackButton(onBack?: () => void) {
  const backButton = window.Telegram?.WebApp?.BackButton

  useEffect(() => {
    if (!backButton || !onBack) return

    backButton.show()
    backButton.onClick(onBack)

    return () => {
      backButton.offClick(onBack)
      backButton.hide()
    }
  }, [backButton, onBack])

  return backButton
}
