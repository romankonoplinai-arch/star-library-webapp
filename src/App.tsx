import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, TarotPage, NatalChartPage, ProfilePage } from '@/pages'
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

  // Показываем загрузку только если Telegram не готов
  // Не блокируем UI если API не ответил - данные уже в БД
  if (!isTelegramReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // TODO: онбординг можно включить позже через Профиль
  // Сейчас пропускаем - данные рождения уже в БД

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
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
