import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, TarotPage, OnboardingPage, NatalChartPage, ProfilePage } from '@/pages'
import { Navigation } from '@/components/Navigation'
import { useTelegram } from '@/hooks'
import { useUserStore } from '@/stores'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/ui'

function AppContent() {
  const { user: tgUser, isReady: isTelegramReady, initDataRaw } = useTelegram()
  const syncFromApi = useUserStore((s) => s.syncFromApi)
  const isLoaded = useUserStore((s) => s.isLoaded)
  const birthDate = useUserStore((s) => s.birthDate)
  const setBirthData = useUserStore((s) => s.setBirthData)
  const [loadError, setLoadError] = useState(false)

  // Инициализация: передать initData в API и загрузить данные
  useEffect(() => {
    if (!isTelegramReady) return

    // Передаём initData в API клиент
    if (initDataRaw) {
      api.setInitData(initDataRaw)
    }

    // Загружаем данные пользователя с backend
    api.getUserData()
      .then((response) => {
        if (response.success && response.user) {
          syncFromApi(response.user)
        }
      })
      .catch((err) => {
        console.error('Failed to load user data:', err)
        setLoadError(true)
      })
  }, [isTelegramReady, initDataRaw, syncFromApi])

  // Показываем загрузку пока не получили данные с backend
  if (!isLoaded && !loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Если нет данных рождения — показываем онбординг
  const needsOnboarding = !birthDate && !loadError

  const handleOnboardingComplete = (data: {
    birthDate: string
    birthPlace: string
    birthTime: string | null
  }) => {
    setBirthData(data.birthDate, data.birthPlace, data.birthTime)
    // TODO: отправить данные на backend через api.saveBirthData
  }

  if (needsOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tarot" element={<TarotPage />} />
        <Route path="/natal" element={<NatalChartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Navigation />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
