import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, LoadingSpinner } from '@/components/ui'
import { useHaptic } from '@/hooks'
import { useUserStore } from '@/stores'
import { api, DailyHubResponse } from '@/lib/api'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'

const CHARACTER_EMOJIS: Record<string, string> = {
  lunara: '🌙',
  marsik: '🔥',
  selena: '🌑',
  mercury: '✨',
  aristarch: '🌌'
}

const CHARACTER_NAMES: Record<string, string> = {
  lunara: 'Лунары',
  marsik: 'Марсика',
  selena: 'Селены',
  mercury: 'Меркурия',
  aristarch: 'Аристарха'
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
  const characterName = CHARACTER_NAMES[dailyData.horoscope.character] || 'Лунары'

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

              <div className="space-y-4">
                {dailyData.transits.map((transit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-purple/20 via-cosmic-void/40 to-mystical-gold/10 p-4 border border-accent-purple/30"
                    onClick={() => haptic.light()}
                  >
                    {/* Декоративный градиент */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-mystical-gold/20 to-transparent rounded-full blur-2xl" />

                    {/* Заголовок транзита */}
                    <div className="relative flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/40 to-mystical-gold/30 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">{transit.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-soft-white">
                          {transit.planet} {transit.aspect} {transit.natal_planet}
                        </p>
                        <p className="text-xs text-muted-gray">Космическое влияние</p>
                      </div>
                    </div>

                    {/* Шкала энергии */}
                    <div className="relative mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-soft-white/70">Сила влияния</span>
                        <span className="text-xs font-semibold text-mystical-gold">{transit.energy_level}/10</span>
                      </div>
                      <div className="h-2 bg-cosmic-void/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${transit.energy_level * 10}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 + 0.3 }}
                          className="h-full rounded-full bg-gradient-to-r from-accent-purple via-mystical-gold to-accent-purple"
                        />
                      </div>
                    </div>

                    {/* DO / DON'T карточки */}
                    <div className="grid grid-cols-2 gap-3">
                      {transit.dos && transit.dos.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/10 p-3 border border-emerald-500/30">
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400/20 rounded-full blur-lg" />
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center">
                              <span className="text-emerald-400 text-sm">✓</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Делай</span>
                          </div>
                          <ul className="space-y-1.5">
                            {transit.dos.slice(0, 3).map((item, i) => (
                              <li key={i} className="text-[11px] text-soft-white/90 flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5">→</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {transit.donts && transit.donts.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-900/10 p-3 border border-rose-500/30">
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-400/20 rounded-full blur-lg" />
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-rose-500/30 flex items-center justify-center">
                              <span className="text-rose-400 text-sm">✗</span>
                            </div>
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">Избегай</span>
                          </div>
                          <ul className="space-y-1.5">
                            {transit.donts.slice(0, 3).map((item, i) => (
                              <li key={i} className="text-[11px] text-soft-white/90 flex items-start gap-2">
                                <span className="text-rose-400 mt-0.5">→</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Подсказка если нет транзитов */}
        {(!dailyData.transits || dailyData.transits.length === 0) && (
          <motion.div variants={staggerItem}>
            <GlassCard>
              <div className="text-center py-6">
                <span className="text-4xl mb-3 block">🌟</span>
                <h3 className="text-lg font-semibold mb-2">Персональные транзиты</h3>
                <p className="text-soft-white/70 text-sm mb-3">
                  Транзиты — это текущие положения планет относительно твоей натальной карты.
                </p>
                <p className="text-soft-white/60 text-xs mb-4">
                  Они показывают какие энергии активны именно для тебя сейчас и помогают понять лучшие моменты для действий.
                </p>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-muted-gray text-xs">
                    Заполни данные рождения в Натальной карте, чтобы видеть свои транзиты
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.main>
    </div>
  )
}
