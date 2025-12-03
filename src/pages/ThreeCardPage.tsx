import { useState } from 'react'
import { motion } from 'framer-motion'
import { TarotCard } from '@/components/tarot'
import { GlassCard, MagicButton, LoadingSpinner } from '@/components/ui'
import { useHaptic, useBackButton, useShare } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { api, type CardInSpread } from '@/lib/api'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { useUserStore } from '@/stores'
import { getTarotCardImage } from '@/lib/tarot'

export function ThreeCardPage() {
  const navigate = useNavigate()
  const haptic = useHaptic()
  const { share } = useShare()
  const defaultCharacter = useUserStore((s) => s.defaultCharacter)

  const [cards, setCards] = useState<CardInSpread[] | null>(null)
  const [interpretation, setInterpretation] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [isInterpreting, setIsInterpreting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useBackButton(() => navigate('/tarot'))

  const handleDraw = async () => {
    haptic.medium()
    setIsDrawing(true)
    setError(null)

    try {
      const response = await api.drawTarotSpread('three_card', question || undefined)
      setCards(response.cards)

      // Auto-interpret
      setIsInterpreting(true)
      const interpretResponse = await api.interpretTarotSpread(
        response.cards,
        question || undefined,
        defaultCharacter
      )
      setInterpretation(interpretResponse.interpretation)
    } catch (err: any) {
      console.error('Failed to draw three card spread:', err)
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
          ⏳ Прошлое-Настоящее-Будущее
        </h1>
        <p className="text-muted-gray">Три карты на вашу ситуацию</p>
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
                {isDrawing ? 'Вытягиваю карты...' : 'Вытянуть карты'}
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
            {/* Three Cards Layout */}
            <motion.div variants={staggerItem}>
              <div className="grid grid-cols-3 gap-3">
                {cards.map((cardInSpread, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <TarotCard
                      card={{
                        id: cardInSpread.card.id,
                        name: cardInSpread.card.name,
                        nameRu: cardInSpread.card.name_ru,
                        imageUrl: getTarotCardImage(cardInSpread.card.name, cardInSpread.card.arcana),
                        reversed: cardInSpread.card.reversed,
                      }}
                      size="md"
                      revealed
                    />
                    <p className="text-xs text-mystical-gold font-semibold">
                      {cardInSpread.position_name}
                    </p>
                    <p className="text-[10px] text-muted-gray text-center">
                      {cardInSpread.position_meaning}
                    </p>
                  </div>
                ))}
              </div>
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

            {/* Share and Reset Buttons */}
            <motion.div variants={staggerItem} className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  haptic.light()
                  const cardsText = cards.map((c) => c.card.name_ru).join(', ')
                  share(`Мой расклад Таро: ${cardsText} 🔮`)
                }}
                className="text-mystical-gold hover:underline flex items-center gap-1"
              >
                <span>↗️</span> Поделиться
              </button>
              <button
                onClick={handleReset}
                className="text-accent-purple hover:underline"
              >
                Новый расклад
              </button>
            </motion.div>
          </>
        )}
      </motion.main>
    </div>
  )
}
