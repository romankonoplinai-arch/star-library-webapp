import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HomePage, TarotPage, NatalChartPage, ProfilePage, WelcomePage, DailyPage, FriendChartPage } from '@/pages'
import { CelticCrossPage } from '@/pages/CelticCrossPage'
import { ThreeCardPage } from '@/pages/ThreeCardPage'
import { Navigation } from '@/components/Navigation'
import { StarsBackground } from '@/components/background'
import { useTelegram } from '@/hooks'
import { useUserStore } from '@/stores'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/ui'

function AppContent() {
  const { isReady: isTelegramReady, initDataRaw } = useTelegram()
  const syncFromApi = useUserStore((s) => s.syncFromApi)
  const [showWelcome, setShowWelcome] = useState(true)

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

  // Show loading while Telegram not ready
  if (!isTelegramReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-black">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show welcome screen on every app launch
  if (showWelcome) {
    return (
      <WelcomePage
        onComplete={() => {
          setShowWelcome(false)
        }}
      />
    )
  }

  // Show main app
  return (
    <div className="relative z-10">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/tarot" element={<TarotPage />} />
        <Route path="/celtic-cross" element={<CelticCrossPage />} />
        <Route path="/three-card" element={<ThreeCardPage />} />
        <Route path="/natal" element={<NatalChartPage />} />
        <Route path="/friend" element={<FriendChartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Navigation />
    </div>
  )
}

export default function App() {
  return (
    <>
      <StarsBackground />
      <HashRouter>
        <AppContent />
      </HashRouter>
    </>
  )
}
