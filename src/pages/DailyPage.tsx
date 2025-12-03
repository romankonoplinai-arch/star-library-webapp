import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, LoadingSpinner } from '@/components/ui'
import { useHaptic } from '@/hooks'
import { useUserStore } from '@/stores'
import { api, DailyHubResponse } from '@/lib/api'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'

const CHARACTER_EMOJIS: Record<string, string> = {
  lunara: '🌙',
  marsik: '⚡',
  selena: '✨',
  mercury: '💫',
  aristarch: '📚'
}

export function DailyPage() {
  const haptic = useHaptic()
  const firstName = useUserStore((s) => s.firstName) || 'путник'
  const [dailyData, setDailyData] = useState<DailyHubResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDailyHub()
  }, [])

  const loadDailyHub = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getDailyHub()
      setDailyData(data)
    } catch (err) {
      console.error('Failed to load daily hub:', err)
      setError('Не удалось загрузить данные. Попробуй позже.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !dailyData) {
    return (
      <div className="min-h-screen px-4 py-6 pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mt-20"
        >
          <p className="text-red-400 mb-4">{error || 'Произошла ошибка'}</p>
          <button
            onClick={loadDailyHub}
            className="text-mystical-gold hover:text-mystical-gold/80 transition-colors"
          >
            Попробовать снова →
          </button>
        </motion.div>
      </div>
    )
  }

  const characterEmoji = CHARACTER_EMOJIS[dailyData.horoscope.character] || '✨'
  const characterName = dailyData.horoscope.character.charAt(0).toUpperCase() + dailyData.horoscope.character.slice(1)

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
          Daily Hub
        </h1>
        <p className="text-muted-gray">
          Твой день, {firstName}
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
              <span className="text-2xl">{characterEmoji}</span>
              <h2 className="text-lg font-semibold">Гороскоп от {characterName}</h2>
            </div>
            <p className="text-soft-white/90 text-sm leading-relaxed whitespace-pre-wrap">
              {dailyData.horoscope.text}
            </p>
          </GlassCard>
        </motion.div>

        {/* Транзиты секция */}
        {dailyData.transits && dailyData.transits.length > 0 && (
          <motion.div variants={staggerItem}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🌟</span>
                <h2 className="text-lg font-semibold">Транзиты дня</h2>
              </div>

              <div className="space-y-3">
                {dailyData.transits.map((transit, idx) => (
                  <div
                    key={idx}
                    className="bg-cosmic-void/30 rounded-lg p-3 border border-accent-purple/20"
                    onClick={() => haptic.light()}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{transit.emoji}</span>
                      <span className="text-sm font-medium text-mystical-gold">
                        {transit.planet} {transit.aspect} {transit.natal_planet}
                      </span>
                      <span className="text-xs text-muted-gray ml-auto">
                        Энергия: {transit.energy_level}/10
                      </span>
                    </div>

                    {transit.dos && transit.dos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-green-400 font-medium mb-1">✓ Рекомендуется:</p>
                        <ul className="text-xs text-soft-white/80 space-y-0.5 ml-4">
                          {transit.dos.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {transit.donts && transit.donts.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-red-400 font-medium mb-1">✗ Избегать:</p>
                        <ul className="text-xs text-soft-white/80 space-y-0.5 ml-4">
                          {transit.donts.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* VIP upgrade card если нет транзитов */}
        {(!dailyData.transits || dailyData.transits.length === 0) && dailyData.tier !== 'vip' && (
          <motion.div variants={staggerItem}>
            <GlassCard>
              <div className="text-center py-6">
                <span className="text-4xl mb-3 block">🔮</span>
                <h3 className="text-lg font-semibold mb-2">Персональные транзиты</h3>
                <p className="text-soft-white/70 text-sm mb-4">
                  Доступно для VIP пользователей с натальной картой
                </p>
                <button
                  onClick={() => haptic.medium()}
                  className="text-mystical-gold hover:text-mystical-gold/80 transition-colors text-sm"
                >
                  Узнать подробнее →
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.main>
    </div>
  )
}
