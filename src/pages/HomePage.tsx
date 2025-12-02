import { motion } from 'framer-motion'
import { GlassCard, MagicButton } from '@/components/ui'
import { useTelegram, useHaptic } from '@/hooks'
import { useUserStore } from '@/stores'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'

export function HomePage() {
  const haptic = useHaptic()
  const { user: tgUser } = useTelegram()
  const firstName = useUserStore((s) => s.firstName) || tgUser?.firstName || 'путник'
  const isPremium = useUserStore((s) => s.isPremium)
  const subscriptionTier = useUserStore((s) => s.subscriptionTier)

  const handleCardOfDay = () => {
    haptic.light()
    // TODO: navigate to tarot
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <motion.header
        className="mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-2xl font-display font-bold text-gradient">
          Звёздная Библиотека
        </h1>
        <p className="text-muted-gray">
          Доброе утро, {firstName}!
        </p>
      </motion.header>

      <motion.main
        className="space-y-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Гороскоп секция */}
        <motion.div variants={staggerItem}>
          <GlassCard glow>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🌟</span>
              <h2 className="text-lg font-semibold">Гороскоп от Лунары</h2>
            </div>
            <p className="text-soft-white/80 text-sm leading-relaxed mb-4">
              Луна в Раке создаёт нежную атмосферу для заботы о себе.
              Сегодня звёзды благоволят творчеству и интуитивным решениям...
            </p>
            <button className="text-mystical-gold text-sm">
              Подробнее →
            </button>
          </GlassCard>
        </motion.div>

        {/* Транзиты секция */}
        <motion.div variants={staggerItem}>
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔮</span>
                <h2 className="text-lg font-semibold">Транзиты дня</h2>
              </div>
              {!isPremium() && (
                <span className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-1 rounded-full">
                  Premium
                </span>
              )}
            </div>

            {isPremium() ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">♥️</span>
                  <span>Венера △ Юпитер — хороший день для отношений</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-400">⚠️</span>
                  <span>Марс □ Сатурн — избегай конфликтов</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="blur-sm text-sm text-muted-gray">
                  <p>Венера △ Юпитер — отношения</p>
                  <p>Марс □ Сатурн — осторожность</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MagicButton size="sm" variant="secondary">
                    🔓 Открыть транзиты
                  </MagicButton>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Карта дня */}
        <motion.div variants={staggerItem}>
          <GlassCard hoverable>
            <div className="flex items-center gap-4">
              <span className="text-4xl">🎴</span>
              <div className="flex-1">
                <h3 className="font-semibold">Карта дня</h3>
                <p className="text-sm text-muted-gray">Узнай послание звёзд</p>
              </div>
              <MagicButton size="sm" onClick={handleCardOfDay}>
                Вытянуть
              </MagicButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Натальная карта */}
        <motion.div variants={staggerItem}>
          <GlassCard hoverable>
            <div className="flex items-center gap-4">
              <span className="text-4xl">🌌</span>
              <div>
                <h3 className="font-semibold">Натальная карта</h3>
                <p className="text-sm text-muted-gray">Твоя звёздная карта</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Premium Banner */}
        {!isPremium() && (
          <motion.div variants={staggerItem}>
            <GlassCard className="bg-gradient-to-r from-accent-purple/20 to-mystical-gold/20 border-mystical-gold/30">
              <div className="flex items-center gap-4">
                <span className="text-3xl">👑</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-mystical-gold">Premium</h3>
                  <p className="text-xs text-muted-gray">
                    Персональные транзиты + Celtic Cross
                  </p>
                </div>
                <MagicButton size="sm">199⭐</MagicButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.main>
    </div>
  )
}
