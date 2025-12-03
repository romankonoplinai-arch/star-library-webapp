import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, MagicButton } from '@/components/ui'
import { useBackButton, useTelegram, useHaptic } from '@/hooks'
import { useUserStore } from '@/stores'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'

const CHARACTERS = [
  { id: 'lunara', name: 'Лунара', emoji: '🌙', desc: 'Мудрая и нежная' },
  { id: 'marsik', name: 'Марсик', emoji: '🔥', desc: 'Энергичный и прямой' },
  { id: 'selena', name: 'Селена', emoji: '🌑', desc: 'Глубинный психолог' },
  { id: 'merkury', name: 'Меркурий', emoji: '✨', desc: 'Быстрый и остроумный' },
  { id: 'aristarchus', name: 'Аристарх', emoji: '🌌', desc: 'Мудрый философ' },
]

const TIER_INFO = {
  free: { name: 'Free', color: 'text-muted-gray', badge: '🌱' },
  premium: { name: 'Premium', color: 'text-accent-purple', badge: '⭐' },
  vip: { name: 'VIP', color: 'text-mystical-gold', badge: '👑' },
}

export function ProfilePage() {
  const navigate = useNavigate()
  const haptic = useHaptic()
  const { user: tgUser } = useTelegram()

  const firstName = useUserStore((s) => s.firstName) || tgUser?.firstName || 'Путник'
  const birthDate = useUserStore((s) => s.birthDate)
  const birthPlace = useUserStore((s) => s.birthPlace)
  const subscriptionTier = useUserStore((s) => s.subscriptionTier)
  const defaultCharacter = useUserStore((s) => s.defaultCharacter)
  const totalHoroscopes = useUserStore((s) => s.totalHoroscopes)
  const totalActiveDays = useUserStore((s) => s.totalActiveDays)
  const setCharacter = useUserStore((s) => s.setCharacter)
  const setBirthData = useUserStore((s) => s.setBirthData)

  const [showBirthEditor, setShowBirthEditor] = useState(false)
  const [showNameEditor, setShowNameEditor] = useState(false)
  const [editName, setEditName] = useState(firstName)
  const [editBirthDate, setEditBirthDate] = useState(birthDate || '')
  const [editBirthPlace, setEditBirthPlace] = useState(birthPlace || '')
  const [editBirthTime, setEditBirthTime] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useBackButton(() => {
    if (showNameEditor) {
      setShowNameEditor(false)
    } else if (showBirthEditor) {
      setShowBirthEditor(false)
    } else {
      navigate('/')
    }
  })

  const tierInfo = TIER_INFO[subscriptionTier]

  const handleCharacterSelect = (characterId: string) => {
    haptic.selection()
    setCharacter(characterId)
  }

  const handleUpgrade = () => {
    haptic.medium()
    // TODO: открыть paywall
  }

  const handleEditName = () => {
    haptic.light()
    setEditName(firstName)
    setShowNameEditor(true)
  }

  const handleSaveName = async () => {
    if (!editName.trim()) return

    haptic.medium()
    setIsSaving(true)

    try {
      await api.fetch('/user/update-name', {
        method: 'POST',
        body: JSON.stringify({ first_name: editName.trim() }),
      })

      useUserStore.setState({ firstName: editName.trim() })
      setShowNameEditor(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditBirthData = () => {
    haptic.light()
    setEditBirthDate(birthDate || '')
    setEditBirthPlace(birthPlace || '')
    setShowBirthEditor(true)
  }

  const handleSaveBirthData = async () => {
    if (!editBirthDate || !editBirthPlace) return

    haptic.medium()
    setIsSaving(true)

    try {
      // Геокодируем место
      const geoResponse = await api.fetch<{
        success: boolean
        latitude: number
        longitude: number
        timezone: string
        display_name: string
      }>('/natal-chart/geocode', {
        method: 'POST',
        body: JSON.stringify({ place_name: editBirthPlace }),
      })

      // Сохраняем данные
      await api.fetch('/natal-chart/save-birth-data', {
        method: 'POST',
        body: JSON.stringify({
          birth_date: editBirthDate,
          birth_time: editBirthTime || '12:00',
          birth_place: geoResponse.display_name || editBirthPlace,
          latitude: geoResponse.latitude,
          longitude: geoResponse.longitude,
          timezone: geoResponse.timezone,
        }),
      })

      // Обновляем локальный store
      setBirthData(editBirthDate, geoResponse.display_name || editBirthPlace, editBirthTime || null)

      haptic.success()
      setShowBirthEditor(false)
    } catch (err) {
      console.error('Failed to save birth data:', err)
      haptic.error()
      // Всё равно сохраняем локально
      setBirthData(editBirthDate, editBirthPlace, editBirthTime || null)
      setShowBirthEditor(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Header */}
        <motion.header variants={staggerItem} className="text-center mb-4">
          <h1 className="text-2xl font-display font-bold text-gradient">
            Профиль
          </h1>
        </motion.header>

        {/* User Info Card */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mystical-gold to-accent-purple flex items-center justify-center text-2xl">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{firstName}</h2>
                  <button
                    onClick={handleEditName}
                    className="text-xs text-accent-purple hover:underline"
                  >
                    Изменить
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span>{tierInfo.badge}</span>
                  <span className={`text-sm ${tierInfo.color}`}>{tierInfo.name}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Birth Data */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-mystical-gold font-semibold">Данные рождения</h2>
              <button
                onClick={handleEditBirthData}
                className="text-xs text-accent-purple hover:underline"
              >
                Изменить
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-gray">Дата</span>
                <span>{birthDate ? birthDate.split('T')[0] : 'Не указана'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-gray">Место</span>
                <span className="text-right max-w-[180px] truncate">{birthPlace || 'Не указано'}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Character Selection */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <h2 className="text-mystical-gold font-semibold mb-3">
              Твой проводник
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleCharacterSelect(char.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    defaultCharacter === char.id
                      ? 'border-mystical-gold bg-mystical-gold/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{char.emoji}</span>
                  <p className="text-sm font-semibold mt-1">{char.name}</p>
                  <p className="text-xs text-muted-gray">{char.desc}</p>
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Subscription */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <h2 className="text-mystical-gold font-semibold mb-3">Подписка</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Текущий план</p>
                  <p className={`text-sm ${tierInfo.color}`}>
                    {tierInfo.badge} {tierInfo.name}
                  </p>
                </div>
                {subscriptionTier === 'free' && (
                  <MagicButton size="sm" onClick={handleUpgrade}>
                    Upgrade
                  </MagicButton>
                )}
              </div>

              {subscriptionTier === 'free' && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm text-muted-gray mb-2">
                    Premium включает:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>✨ Персональные транзиты</li>
                    <li>🎴 Celtic Cross расклад</li>
                    <li>💬 Больше сообщений AI</li>
                  </ul>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <h2 className="text-mystical-gold font-semibold mb-3">Статистика</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-mystical-gold">0</p>
                <p className="text-xs text-muted-gray">Раскладов</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-purple">{totalHoroscopes}</p>
                <p className="text-xs text-muted-gray">Гороскопов</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalActiveDays}</p>
                <p className="text-xs text-muted-gray">Дней</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Name Editor Modal */}
      <AnimatePresence>
        {showNameEditor && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowNameEditor(false)}
            />

            {/* Modal */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-sm"
            >
              <GlassCard className="p-5">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Изменить имя
                </h2>

                <div>
                  <label className="block text-sm text-muted-gray mb-1">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Введите ваше имя"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-soft-white placeholder:text-muted-gray"
                    maxLength={50}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowNameEditor(false)}
                    className="flex-1 py-3 rounded-xl border border-white/20 text-muted-gray"
                  >
                    Отмена
                  </button>
                  <MagicButton
                    onClick={handleSaveName}
                    disabled={!editName.trim() || isSaving}
                    className="flex-1"
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </MagicButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birth Data Editor Modal */}
      <AnimatePresence>
        {showBirthEditor && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowBirthEditor(false)}
            />

            {/* Modal */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-sm"
            >
              <GlassCard className="p-5">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Данные рождения
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-gray mb-1">
                      Дата рождения
                    </label>
                    <input
                      type="date"
                      value={editBirthDate}
                      onChange={(e) => setEditBirthDate(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-soft-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-gray mb-1">
                      Место рождения
                    </label>
                    <input
                      type="text"
                      value={editBirthPlace}
                      onChange={(e) => setEditBirthPlace(e.target.value)}
                      placeholder="Например: Москва"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-soft-white placeholder:text-muted-gray"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-gray mb-1">
                      Время рождения (опционально)
                    </label>
                    <input
                      type="time"
                      value={editBirthTime}
                      onChange={(e) => setEditBirthTime(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-soft-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowBirthEditor(false)}
                    className="flex-1 py-3 rounded-xl border border-white/20 text-muted-gray"
                  >
                    Отмена
                  </button>
                  <MagicButton
                    onClick={handleSaveBirthData}
                    disabled={!editBirthDate || !editBirthPlace || isSaving}
                    className="flex-1"
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </MagicButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
