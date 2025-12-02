import { useState } from 'react'
import { motion } from 'framer-motion'
import { TarotCard } from '@/components/tarot'
import { GlassCard, MagicButton } from '@/components/ui'
import { useHaptic, useBackButton } from '@/hooks'
import { useUserStore } from '@/stores'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'

// Временные данные для демо
const DEMO_CARD = {
  id: 0,
  name: 'The Fool',
  nameRu: 'Шут',
  imageUrl: '/cards/major/00-fool.svg',
  reversed: false,
}

export function TarotPage() {
  const haptic = useHaptic()
  const isPremium = useUserStore((s) => s.isPremium)
  const [drawnCard, setDrawnCard] = useState<typeof DEMO_CARD | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useBackButton(() => {
    // TODO: navigate back
  })

  const handleDrawCard = () => {
    haptic.medium()
    setIsDrawing(true)

    // Имитация вытягивания карты
    setTimeout(() => {
      setDrawnCard({
        ...DEMO_CARD,
        reversed: Math.random() > 0.7,
      })
      setIsDrawing(false)
    }, 500)
  }

  const handleCelticCross = () => {
    haptic.light()
    // Navigate to Celtic Cross page
    window.location.href = '/celtic-cross'
  }

  const handleThreeCard = () => {
    haptic.light()
    // Navigate to Three Card page
    window.location.href = '/three-card'
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <motion.header
        className="mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-2xl font-display font-bold text-gradient">
          🎴 Карты Судьбы
        </h1>
        <p className="text-muted-gray">Выбери свой расклад</p>
      </motion.header>

      <motion.main
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Карта дня */}
        <motion.div variants={staggerItem}>
          <GlassCard>
            <h2 className="text-lg font-semibold mb-4">Карта дня</h2>

            <div className="flex flex-col items-center">
              {drawnCard ? (
                <TarotCard card={drawnCard} size="lg" revealed />
              ) : (
                <div className="w-40 h-70 flex items-center justify-center">
                  <MagicButton
                    onClick={handleDrawCard}
                    disabled={isDrawing}
                    haptic="medium"
                  >
                    {isDrawing ? 'Вытягиваю...' : 'Вытянуть карту'}
                  </MagicButton>
                </div>
              )}
            </div>

            {drawnCard && (
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-soft-white/80 text-sm">
                  {drawnCard.nameRu} говорит о новых начинаниях и смелости
                  сделать первый шаг...
                </p>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Celtic Cross */}
        <motion.div variants={staggerItem}>
          <GlassCard
            hoverable
            onClick={handleCelticCross}
            className={!isPremium() ? 'opacity-80' : ''}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🔮</span>
                <div>
                  <h3 className="font-semibold">Кельтский крест</h3>
                  <p className="text-sm text-muted-gray">
                    10 карт — глубокий анализ
                  </p>
                </div>
              </div>
              {!isPremium() && (
                <span className="text-xs bg-mystical-gold/20 text-mystical-gold px-2 py-1 rounded-full">
                  Premium
                </span>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Past-Present-Future */}
        <motion.div variants={staggerItem}>
          <GlassCard hoverable onClick={handleThreeCard}>
            <div className="flex items-center gap-4">
              <span className="text-3xl">⏳</span>
              <div>
                <h3 className="font-semibold">Прошлое-Настоящее-Будущее</h3>
                <p className="text-sm text-muted-gray">3 карты</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.main>
    </div>
  )
}
