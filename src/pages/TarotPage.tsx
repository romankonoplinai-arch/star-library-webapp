import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TarotCard } from '@/components/tarot'
import { GlassCard, MagicButton } from '@/components/ui'
import { useHaptic, useBackButton } from '@/hooks'
import { useUserStore } from '@/stores'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { getTarotCardImage } from '@/lib/tarot'

// Список всех карт для случайного выбора
const ALL_CARDS = [
  { id: 0, name: 'The Fool', nameRu: 'Шут' },
  { id: 1, name: 'The Magician', nameRu: 'Маг' },
  { id: 2, name: 'The High Priestess', nameRu: 'Верховная Жрица' },
  { id: 3, name: 'The Empress', nameRu: 'Императрица' },
  { id: 4, name: 'The Emperor', nameRu: 'Император' },
  { id: 5, name: 'The Hierophant', nameRu: 'Иерофант' },
  { id: 6, name: 'The Lovers', nameRu: 'Влюблённые' },
  { id: 7, name: 'The Chariot', nameRu: 'Колесница' },
  { id: 8, name: 'Strength', nameRu: 'Сила' },
  { id: 9, name: 'The Hermit', nameRu: 'Отшельник' },
  { id: 10, name: 'Wheel of Fortune', nameRu: 'Колесо Фортуны' },
  { id: 11, name: 'Justice', nameRu: 'Справедливость' },
  { id: 12, name: 'The Hanged Man', nameRu: 'Повешенный' },
  { id: 13, name: 'Death', nameRu: 'Смерть' },
  { id: 14, name: 'Temperance', nameRu: 'Умеренность' },
  { id: 15, name: 'The Devil', nameRu: 'Дьявол' },
  { id: 16, name: 'The Tower', nameRu: 'Башня' },
  { id: 17, name: 'The Star', nameRu: 'Звезда' },
  { id: 18, name: 'The Moon', nameRu: 'Луна' },
  { id: 19, name: 'The Sun', nameRu: 'Солнце' },
  { id: 20, name: 'Judgement', nameRu: 'Суд' },
  { id: 21, name: 'The World', nameRu: 'Мир' },
]

interface DrawnCard {
  id: number
  name: string
  nameRu: string
  imageUrl: string
  reversed: boolean
}

export function TarotPage() {
  const navigate = useNavigate()
  const haptic = useHaptic()
  const isPremium = useUserStore((s) => s.isPremium)
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useBackButton(() => {
    navigate('/')
  })

  const handleDrawCard = () => {
    haptic.medium()
    setIsDrawing(true)

    // Случайный выбор карты
    setTimeout(() => {
      const randomCard = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)]
      const reversed = Math.random() > 0.7

      setDrawnCard({
        ...randomCard,
        imageUrl: getTarotCardImage(randomCard.name),
        reversed,
      })
      setIsDrawing(false)
    }, 500)
  }

  const handleCelticCross = () => {
    haptic.light()
    navigate('/celtic-cross')
  }

  const handleThreeCard = () => {
    haptic.light()
    navigate('/three-card')
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
