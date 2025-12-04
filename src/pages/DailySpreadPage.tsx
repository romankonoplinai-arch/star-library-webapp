import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TarotCard } from '@/components/tarot'
import { GlassCard, MagicButton, LoadingSpinner } from '@/components/ui'
import { useHaptic, useBackButton, useShare } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { api, type DailySpreadCard, type DailySpreadResponse } from '@/lib/api'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { useUserStore } from '@/stores'

export function DailySpreadPage() {
  const navigate = useNavigate()
  const haptic = useHaptic()
  const { share } = useShare()
  const defaultCharacter = useUserStore((s) => s.defaultCharacter)

  const [spread, setSpread] = useState<DailySpreadResponse | null>(null)
  const [interpretation, setInterpretation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInterpreting, setIsInterpreting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set())

  useBackButton(() => navigate('/'))

  // Load spread on mount
  useEffect(() => {
    loadSpread()
  }, [])

  const loadSpread = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.getDailySpread()
      setSpread(response)
      haptic.success()
    } catch (err: any) {
      console.error('Failed to load daily spread:', err)
      setError(err.message || 'Не удалось загрузить расклад')
      haptic.error()
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardReveal = (position: number) => {
    setRevealedCards((prev) => new Set([...prev, position]))
    haptic.medium()
  }

  const handleGetInterpretation = async () => {
    if (!spread?.cards) return

    haptic.medium()
    setIsInterpreting(true)

    try {
      // Convert cards to CardInSpread format for interpretation API
      const cardsForApi = spread.cards.map((c) => ({
        card: {
          id: c.id,
          name: c.name,
          name_ru: c.name_ru,
          arcana: c.arcana,
          suit: c.suit,
          reversed: c.reversed,
          keywords: c.keywords,
          image_url: c.image,
        },
        position: c.position,
        position_name: c.position_name,
        position_meaning: c.position_meaning,
      }))

      const response = await api.interpretTarotSpread(
        cardsForApi,
        'Расклад дня',
        defaultCharacter
      )
      setInterpretation(response.interpretation)
      haptic.success()
    } catch (err: any) {
      console.error('Failed to get interpretation:', err)
      setError(err.message || 'Не удалось получить толкование')
      haptic.error()
    } finally {
      setIsInterpreting(false)
    }
  }

  const allCardsRevealed = spread?.cards && revealedCards.size >= spread.cards.length

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-gray">Готовлю твой расклад...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 py-6 flex items-center justify-center">
        <GlassCard className="p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <MagicButton onClick={loadSpread} haptic="medium">
            Попробовать снова
          </MagicButton>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <motion.header
        className="mb-6 text-center"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-2xl font-display font-bold text-gradient">
          🌟 Расклад дня
        </h1>
        <p className="text-muted-gray">
          {spread?.date ? formatDate(spread.date) : 'Сегодня'}
        </p>
      </motion.header>

      <motion.main
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* 5 Cards Layout: 2-1-2 pattern */}
        <motion.div variants={staggerItem}>
          {/* Top row: 2 cards */}
          <div className="flex justify-center gap-4 mb-4">
            {spread?.cards.slice(0, 2).map((card, index) => (
              <CardWithPosition
                key={card.position}
                card={card}
                revealed={revealedCards.has(card.position)}
                onReveal={() => handleCardReveal(card.position)}
                delay={index * 0.2}
              />
            ))}
          </div>

          {/* Middle row: 1 card (centered) */}
          <div className="flex justify-center mb-4">
            {spread?.cards[2] && (
              <CardWithPosition
                card={spread.cards[2]}
                revealed={revealedCards.has(spread.cards[2].position)}
                onReveal={() => handleCardReveal(spread.cards[2].position)}
                delay={0.4}
              />
            )}
          </div>

          {/* Bottom row: 2 cards */}
          <div className="flex justify-center gap-4">
            {spread?.cards.slice(3, 5).map((card, index) => (
              <CardWithPosition
                key={card.position}
                card={card}
                revealed={revealedCards.has(card.position)}
                onReveal={() => handleCardReveal(card.position)}
                delay={0.6 + index * 0.2}
              />
            ))}
          </div>
        </motion.div>

        {/* Hint to tap cards */}
        {!allCardsRevealed && (
          <motion.p
            variants={staggerItem}
            className="text-center text-sm text-muted-gray"
          >
            Нажми на карты, чтобы открыть их
          </motion.p>
        )}

        {/* Interpretation button */}
        {allCardsRevealed && !interpretation && (
          <motion.div variants={staggerItem} className="text-center">
            <MagicButton
              onClick={handleGetInterpretation}
              disabled={isInterpreting}
              haptic="medium"
              size="lg"
            >
              {isInterpreting ? 'Получаю толкование...' : '🔮 Получить толкование'}
            </MagicButton>
          </motion.div>
        )}

        {/* Interpretation */}
        {interpretation && (
          <motion.div variants={staggerItem}>
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-3 text-mystical-gold">
                Толкование
              </h2>
              <p className="text-soft-white/90 whitespace-pre-wrap leading-relaxed">
                {interpretation}
              </p>
            </GlassCard>
          </motion.div>
        )}

        {/* Share button */}
        {allCardsRevealed && (
          <motion.div variants={staggerItem} className="text-center">
            <button
              onClick={() => {
                haptic.light()
                const cardsText = spread?.cards.map((c) => c.name_ru).join(', ')
                share(`Мой расклад дня: ${cardsText} 🌟`)
              }}
              className="text-mystical-gold hover:underline flex items-center gap-1 mx-auto"
            >
              <span>↗️</span> Поделиться
            </button>
          </motion.div>
        )}
      </motion.main>
    </div>
  )
}

// Helper component for card with position label
function CardWithPosition({
  card,
  revealed,
  onReveal,
  delay,
}: {
  card: DailySpreadCard
  revealed: boolean
  onReveal: () => void
  delay: number
}) {
  // Use image path from API directly (it's relative like /cards/Cards-png/...)
  const imageUrl = `${import.meta.env.BASE_URL}${card.image.replace(/^\//, '')}`

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <TarotCard
        card={{
          id: card.id,
          name: card.name,
          nameRu: card.name_ru,
          imageUrl,
          reversed: card.reversed,
        }}
        size="sm"
        revealed={revealed}
        onReveal={onReveal}
      />
      <p className="mt-1 text-xs text-mystical-gold font-semibold text-center">
        {card.position_name}
      </p>
      <p className="text-[10px] text-muted-gray text-center max-w-[80px]">
        {card.position_meaning}
      </p>
    </motion.div>
  )
}
