import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { TarotPage, NatalChartPage, ProfilePage, WelcomePage, DailyPage, FriendChartPage } from '@/pages'
import { CelticCrossPage } from '@/pages/CelticCrossPage'
import { ThreeCardPage } from '@/pages/ThreeCardPage'
import { DailySpreadPage } from '@/pages/DailySpreadPage'
import { CompatibilityPage } from '@/pages/CompatibilityPage'
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
  const navigate = useNavigate()

  // Инициализация: передать initData в API и загрузить данные
  useEffect(() => {
    if (!isTelegramReady) return

    // Debug: log initData
    console.log('[App] initDataRaw:', initDataRaw ? `${initDataRaw.substring(0, 50)}...` : 'EMPTY')
    console.log('[App] Telegram WebApp:', window.Telegram?.WebApp ? 'EXISTS' : 'NOT FOUND')

    // Передаём initData в API клиент
    if (initDataRaw) {
      api.setInitData(initDataRaw)
      console.log('[App] initData set to API client')
    } else {
      console.warn('[App] initDataRaw is empty - API calls will fail auth')
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

  // Handle welcome completion - navigate to daily first, then hide welcome
  const handleWelcomeComplete = () => {
    navigate('/daily', { replace: true })
    setShowWelcome(false)
  }

  // Show welcome screen on every app launch
  if (showWelcome) {
    return <WelcomePage onComplete={handleWelcomeComplete} />
  }

  // Show main app
  return (
    <div className="relative z-10">
      <Routes>
        <Route path="/" element={<Navigate to="/daily" replace />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/compatibility" element={<CompatibilityPage />} />
        <Route path="/tarot" element={<TarotPage />} />
        <Route path="/celtic-cross" element={<CelticCrossPage />} />
        <Route path="/three-card" element={<ThreeCardPage />} />
        <Route path="/daily-spread" element={<DailySpreadPage />} />
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
