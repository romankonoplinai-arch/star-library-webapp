import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, TarotPage, OnboardingPage, NatalChartPage, ProfilePage } from '@/pages'
import { Navigation } from '@/components/Navigation'
import { useTelegram } from '@/hooks'
import { useUserStore } from '@/stores'

function AppContent() {
  const { user: tgUser, isReady: isTelegramReady } = useTelegram()
  const setUser = useUserStore((s) => s.setUser)
  const birthDate = useUserStore((s) => s.birthDate)
  const setBirthData = useUserStore((s) => s.setBirthData)

  // Инициализация пользователя
  useEffect(() => {
    if (!isTelegramReady) return

    if (tgUser) {
      setUser(tgUser.id, tgUser.firstName, tgUser.isPremium || false)
    }
  }, [isTelegramReady, tgUser, setUser])

  // Если нет данных рождения — показываем онбординг
  const needsOnboarding = !birthDate

  const handleOnboardingComplete = (data: {
    birthDate: string
    birthPlace: string
    birthTime: string | null
  }) => {
    setBirthData(data.birthDate, data.birthPlace, data.birthTime)
    // TODO: отправить данные на backend
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
