import { motion } from 'framer-motion'
import { GlassCard, MagicButton } from '@/components/ui'
import { useBackButton, useTelegram, useHaptic } from '@/hooks'
import { useUserStore } from '@/stores'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useNavigate } from 'react-router-dom'

const CHARACTERS = [
  { id: 'lunara', name: 'Лунара', emoji: '🌙', desc: 'Мудрая и нежная' },
  { id: 'marsik', name: 'Марсик', emoji: '🔥', desc: 'Энергичный и прямой' },
  { id: 'venera', name: 'Венера', emoji: '💕', desc: 'Романтичная и чувственная' },
  { id: 'merkury', name: 'Меркурий', emoji: '💨', desc: 'Быстрый и остроумный' },
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
  const setCharacter = useUserStore((s) => s.setCharacter)

  useBackButton(() => navigate('/'))

  const tierInfo = TIER_INFO[subscriptionTier]

  const handleCharacterSelect = (characterId: string) => {
    haptic.selection()
    setCharacter(characterId)
  }

  const handleUpgrade = () => {
    haptic.medium()
    // TODO: открыть paywall
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
                <h2 className="text-lg font-semibold">{firstName}</h2>
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
                onClick={() => haptic.light()}
                className="text-xs text-accent-purple"
              >
                Изменить
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-gray">Дата</span>
                <span>{birthDate || 'Не указана'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-gray">Место</span>
                <span>{birthPlace || 'Не указано'}</span>
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
                <p className="text-2xl font-bold text-accent-purple">0</p>
                <p className="text-xs text-muted-gray">Гороскопов</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-gray">Дней</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
