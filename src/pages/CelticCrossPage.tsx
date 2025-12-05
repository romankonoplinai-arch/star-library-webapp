import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CelticCrossLayout } from '@/components/tarot'
import { GlassCard, MagicButton, LoadingSpinner } from '@/components/ui'
import { useHaptic, useBackButton, useShare } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { api, type CardInSpread as ApiCardInSpread } from '@/lib/api'

// Component card type (camelCase for UI components)
interface CardInSpread {
  card: {
    id: number
    name: string
    nameRu: string
    imageUrl: string
    reversed: boolean
  }
  position: number
  positionName: string
}
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { useUserStore } from '@/stores'
import { getTarotCardImage } from '@/lib/tarot'

export function CelticCrossPage() {
  const navigate = useNavigate()
  const haptic = useHaptic()
  const { share } = useShare()
  const isPremium = useUserStore((s) => s.isPremium)
  const defaultCharacter = useUserStore((s) => s.defaultCharacter)

  const [cards, setCards] = useState<CardInSpread[] | null>(null)
  const [interpretation, setInterpretation] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [isInterpreting, setIsInterpreting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useBackButton(() => navigate('/tarot'))

  const handleDraw = async () => {
    if (!isPremium()) {
      haptic.warning()
      setError('Кельтский крест доступен только для Premium подписчиков')
      return
    }

    haptic.medium()
    setIsDrawing(true)
    setError(null)

    try {
      const response = await api.drawTarotSpread('celtic_cross', question || undefined)

      // Convert API response to component format (snake_case to camelCase)
      const convertedCards = response.cards.map(c => ({
        card: {
          id: c.card.id,
          name: c.card.name,
          nameRu: c.card.name_ru,
          imageUrl: getTarotCardImage(c.card.name, c.card.arcana),
          reversed: c.card.reversed,
        },
        position: c.position,
        positionName: c.position_name,
      }))

      setCards(convertedCards)

      // Auto-interpret (use original API format)
      setIsInterpreting(true)
      const interpretResponse = await api.interpretTarotSpread(
        response.cards, // Use original snake_case format for API
        question || undefined,
        defaultCharacter
      )
      setInterpretation(interpretResponse.interpretation)
    } catch (err: any) {
      console.error('Failed to draw Celtic Cross:', err)
      setError(err.message || 'Не удалось вытянуть карты')
      haptic.error()
    } finally {
      setIsDrawing(false)
      setIsInterpreting(false)
    }
  }

  const handleReset = () => {
    haptic.light()
    setCards(null)
    setInterpretation(null)
    setQuestion('')
    setError(null)
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
          🔮 Кельтский Крест
        </h1>
        <p className="text-muted-gray">Глубокий анализ ситуации</p>
      </motion.header>

      <motion.main
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {!cards ? (
          <>
            {/* Question Input */}
            <motion.div variants={staggerItem}>
              <GlassCard className="p-4">
                <label className="block text-sm font-semibold mb-2 text-mystical-gold">
                  Ваш вопрос (необязательно)
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="О чём вы хотите узнать?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-soft-white placeholder-muted-gray/50 focus:outline-none focus:border-mystical-gold/50 resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-gray mt-1">
                  {question.length}/200
                </p>
              </GlassCard>
            </motion.div>

            {/* Draw Button */}
            <motion.div variants={staggerItem} className="text-center">
              <MagicButton
                onClick={handleDraw}
                disabled={isDrawing}
                haptic="medium"
                size="lg"
              >
                {isDrawing ? 'Раскладываю карты...' : 'Разложить карты'}
              </MagicButton>
            </motion.div>

            {error && (
              <motion.div variants={staggerItem}>
                <GlassCard className="p-4 border-red-500/30">
                  <p className="text-red-400 text-sm">{error}</p>
                </GlassCard>
              </motion.div>
            )}
          </>
        ) : (
          <>
            {/* Celtic Cross Layout */}
            <motion.div variants={staggerItem}>
              <CelticCrossLayout
                cards={cards}
                onCardReveal={(position) => {
                  haptic.light()
                  console.log('Revealed card at position:', position)
                }}
              />
            </motion.div>

            {/* Interpretation */}
            <motion.div variants={staggerItem}>
              <GlassCard className="p-4">
                <h2 className="text-lg font-semibold mb-3 text-mystical-gold">
                  Толкование
                </h2>
                {isInterpreting ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : interpretation ? (
                  <p className="text-soft-white/90 whitespace-pre-wrap leading-relaxed">
                    {interpretation}
                  </p>
                ) : (
                  <p className="text-muted-gray italic">
                    Загрузка толкования...
                  </p>
                )}
              </GlassCard>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={staggerItem} className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  haptic.medium()
                  // Share interpretation, not just card names
                  const shareText = interpretation
                    ? `🔮 Кельтский Крест\n\n${interpretation}\n\n✨ Узнай свою судьбу в @Star_library_robot`
                    : `🔮 Мой Кельтский Крест\n\n✨ Узнай свою судьбу в @Star_library_robot`

                  share(shareText)
                }}
                className="px-5 py-2.5 bg-mystical-gold/20 hover:bg-mystical-gold/40 rounded-xl text-sm font-medium transition-colors border border-mystical-gold/40 text-mystical-gold"
              >
                ✨ Поделиться
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-accent-purple/20 hover:bg-accent-purple/40 rounded-xl text-sm font-medium transition-colors border border-accent-purple/40 text-accent-purple"
              >
                🔄 Новый расклад
              </button>
            </motion.div>
          </>
        )}
      </motion.main>
    </div>
  )
}
