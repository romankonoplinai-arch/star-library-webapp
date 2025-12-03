import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HomePage, TarotPage, NatalChartPage, ProfilePage, WelcomePage } from '@/pages'
import { CelticCrossPage } from '@/pages/CelticCrossPage'
import { ThreeCardPage } from '@/pages/ThreeCardPage'
import { Navigation } from '@/components/Navigation'
import { useTelegram } from '@/hooks'
import { useUserStore } from '@/stores'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/ui'

function AppContent() {
  const { isReady: isTelegramReady, initDataRaw } = useTelegram()
  const syncFromApi = useUserStore((s) => s.syncFromApi)
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null)

  // Check if user has seen welcome screen
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenWelcome')
    setHasSeenWelcome(seen === 'true')
  }, [])

  // DEV: Reset welcome screen on triple click anywhere (for testing)
  useEffect(() => {
    let clickCount = 0
    let timeout: NodeJS.Timeout

    const handleTripleClick = () => {
      clickCount++
      clearTimeout(timeout)

      if (clickCount === 3) {
        localStorage.removeItem('hasSeenWelcome')
        setHasSeenWelcome(false)
        clickCount = 0
        console.log('✨ Welcome screen reset!')
      }

      timeout = setTimeout(() => {
        clickCount = 0
      }, 500)
    }

    document.addEventListener('click', handleTripleClick)
    return () => {
      document.removeEventListener('click', handleTripleClick)
      clearTimeout(timeout)
    }
  }, [])

  // Инициализация: передать initData в API и загрузить данные
  useEffect(() => {
    if (!isTelegramReady) return

    // Передаём initData в API клиент
    if (initDataRaw) {
      api.setInitData(initDataRaw)
    }

    // Загружаем данные пользователя с backend (не блокирует UI)
    api.getUserData()
      .then((response) => {
        if (response.success && response.user) {
          syncFromApi(response.user)
        }
      })
      .catch((err) => {
        console.error('Failed to load user data:', err)
      })
  }, [isTelegramReady, initDataRaw, syncFromApi])

  // Show loading while checking localStorage or Telegram not ready
  if (hasSeenWelcome === null || !isTelegramReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-black">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show welcome screen if not seen
  if (!hasSeenWelcome) {
    return (
      <WelcomePage
        onComplete={() => {
          localStorage.setItem('hasSeenWelcome', 'true')
          setHasSeenWelcome(true)
        }}
      />
    )
  }

  // Show main app
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tarot" element={<TarotPage />} />
        <Route path="/celtic-cross" element={<CelticCrossPage />} />
        <Route path="/three-card" element={<ThreeCardPage />} />
        <Route path="/natal" element={<NatalChartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Navigation />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}
