import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, MagicButton, LoadingSpinner } from '@/components/ui'
import { useHaptic, useShare } from '@/hooks'
import { useUserStore } from '@/stores'
import { api, type CompatibilityResponse } from '@/lib/api'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'

const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Овен', icon: '♈' },
  { id: 'taurus', name: 'Телец', icon: '♉' },
  { id: 'gemini', name: 'Близнецы', icon: '♊' },
  { id: 'cancer', name: 'Рак', icon: '♋' },
  { id: 'leo', name: 'Лев', icon: '♌' },
  { id: 'virgo', name: 'Дева', icon: '♍' },
  { id: 'libra', name: 'Весы', icon: '♎' },
  { id: 'scorpio', name: 'Скорпион', icon: '♏' },
  { id: 'sagittarius', name: 'Стрелец', icon: '♐' },
  { id: 'capricorn', name: 'Козерог', icon: '♑' },
  { id: 'aquarius', name: 'Водолей', icon: '♒' },
  { id: 'pisces', name: 'Рыбы', icon: '♓' },
]

const getSignInfo = (signId: string) =>
  ZODIAC_SIGNS.find(s => s.id === signId) || { id: signId, name: signId, icon: '⭐' }

export function CompatibilityPage() {
  const haptic = useHaptic()
  const { share } = useShare()
  const userZodiacSign = useUserStore((s) => s.zodiacSign)

  const [partnerSign, setPartnerSign] = useState<string | null>(null)
  const [result, setResult] = useState<CompatibilityResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userSignInfo = userZodiacSign ? getSignInfo(userZodiacSign) : null
  const partnerSignInfo = partnerSign ? getSignInfo(partnerSign) : null

  const handleSelectSign = (signId: string) => {
    haptic.light()
    setPartnerSign(signId)
    setResult(null)
    setError(null)
  }

  const handleCalculate = async () => {
    if (!partnerSign) return

    haptic.medium()
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.getCompatibility(partnerSign)
      setResult(response)
      haptic.success()
    } catch (err: any) {
      console.error('Compatibility error:', err)
      setError(err.message || 'Не удалось рассчитать совместимость')
      haptic.error()
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    haptic.light()
    setPartnerSign(null)
    setResult(null)
    setError(null)
  }

  const handleShare = () => {
    if (!result || !partnerSignInfo || !userSignInfo) return
    haptic.medium()

    const shareText = `💕 Совместимость ${userSignInfo.icon} ${userSignInfo.name} + ${partnerSignInfo.icon} ${partnerSignInfo.name}

❤️ ${result.compatibility_percentage}%

💖 Любовь: ${result.love}%
💬 Общение: ${result.communication}%
🤝 Доверие: ${result.trust}%
🔥 Страсть: ${result.passion}%

✨ Узнай свою совместимость в @Star_library_robot`

    share(shareText)
  }

  // No user zodiac sign
  if (!userZodiacSign) {
    return (
      <div className="min-h-screen px-4 py-6 pb-24 flex items-center justify-center">
        <GlassCard className="p-6 text-center max-w-sm">
          <span className="text-5xl mb-4 block">💕</span>
          <h2 className="text-xl font-semibold mb-2">Совместимость</h2>
          <p className="text-muted-gray mb-4">
            Для проверки совместимости нужно указать дату рождения в профиле
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24 relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            initial={{
              x: `${Math.random() * 100}%`,
              y: '110%',
              rotate: Math.random() * 360
            }}
            animate={{
              y: '-10%',
              rotate: Math.random() * 360 + 180
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear'
            }}
          >
            {['💕', '💖', '❤️', '💗', '💝', '💘'][i % 6]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="mb-6 text-center relative z-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
          💕 Совместимость
        </h1>
        <p className="text-muted-gray">Узнай вашу космическую связь</p>
      </motion.header>

      <motion.main
        className="space-y-5 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Signs circles */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* User sign */}
            <motion.div
              className="flex flex-col items-center"
              animate={isLoading ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 border-2 border-pink-400/50 flex items-center justify-center shadow-lg shadow-pink-500/20">
                <span className="text-3xl">{userSignInfo?.icon}</span>
              </div>
              <p className="text-sm mt-2 text-soft-white font-medium">{userSignInfo?.name}</p>
              <p className="text-xs text-muted-gray">Ты</p>
            </motion.div>

            {/* Connection line */}
            <motion.div
              className="flex items-center"
              animate={isLoading ? { opacity: [0.3, 1, 0.3] } : { opacity: partnerSign ? 1 : 0.3 }}
              transition={{ duration: 1.5, repeat: isLoading ? Infinity : 0 }}
            >
              <div className="w-8 h-0.5 bg-gradient-to-r from-pink-400 to-transparent" />
              <span className="text-2xl mx-1">{result ? '❤️' : '💫'}</span>
              <div className="w-8 h-0.5 bg-gradient-to-l from-purple-400 to-transparent" />
            </motion.div>

            {/* Partner sign */}
            <motion.div
              className="flex flex-col items-center"
              animate={isLoading ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0, delay: 0.5 }}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                partnerSign
                  ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 shadow-purple-500/20'
                  : 'bg-white/5 border-2 border-dashed border-white/20'
              }`}>
                <span className="text-3xl">{partnerSign ? partnerSignInfo?.icon : '?'}</span>
              </div>
              <p className="text-sm mt-2 text-soft-white font-medium">
                {partnerSign ? partnerSignInfo?.name : 'Выбери'}
              </p>
              <p className="text-xs text-muted-gray">Партнёр</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Percentage */}
              <GlassCard className="p-5 text-center bg-gradient-to-br from-pink-500/10 to-purple-500/10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <span className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {result.compatibility_percentage}%
                  </span>
                </motion.div>
                <p className="text-muted-gray mt-2">Общая совместимость</p>
              </GlassCard>

              {/* Score bars */}
              <GlassCard className="p-4">
                <div className="space-y-3">
                  <ScoreBar label="Любовь" value={result.love} icon="💖" color="from-pink-500 to-rose-400" delay={0.3} />
                  <ScoreBar label="Общение" value={result.communication} icon="💬" color="from-blue-500 to-cyan-400" delay={0.4} />
                  <ScoreBar label="Доверие" value={result.trust} icon="🤝" color="from-green-500 to-emerald-400" delay={0.5} />
                  <ScoreBar label="Страсть" value={result.passion} icon="🔥" color="from-orange-500 to-amber-400" delay={0.6} />
                </div>
              </GlassCard>

              {/* AI Analysis */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-pink-300">🌙 Анализ</h3>
                <p className="text-soft-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {result.analysis}
                </p>
                {result.advice && (
                  <>
                    <div className="h-px bg-white/10 my-4" />
                    <p className="text-soft-white/80 text-sm italic">
                      {result.advice}
                    </p>
                  </>
                )}
              </GlassCard>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleShare}
                  className="px-5 py-2.5 bg-pink-500/20 hover:bg-pink-500/40 rounded-xl text-sm font-medium transition-colors border border-pink-500/40 text-pink-300"
                >
                  💕 Поделиться
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-accent-purple/20 hover:bg-accent-purple/40 rounded-xl text-sm font-medium transition-colors border border-accent-purple/40 text-accent-purple"
                >
                  🔄 Новый расчёт
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sign selection grid */}
              <motion.div variants={staggerItem}>
                <GlassCard className="p-4">
                  <h3 className="text-sm font-semibold mb-3 text-center text-muted-gray">
                    Выбери знак партнёра
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {ZODIAC_SIGNS.map((sign) => (
                      <button
                        key={sign.id}
                        onClick={() => handleSelectSign(sign.id)}
                        className={`p-3 rounded-xl transition-all ${
                          partnerSign === sign.id
                            ? 'bg-gradient-to-br from-pink-500/30 to-purple-500/30 border border-pink-400/50 scale-105'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-2xl block">{sign.icon}</span>
                        <span className="text-[10px] text-muted-gray">{sign.name}</span>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Calculate button */}
              {partnerSign && (
                <motion.div
                  variants={staggerItem}
                  className="text-center mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <MagicButton
                    onClick={handleCalculate}
                    disabled={isLoading}
                    haptic="medium"
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-500"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Рассчитываю...
                      </span>
                    ) : (
                      '💕 Рассчитать совместимость'
                    )}
                  </MagicButton>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <GlassCard className="p-4 border-red-500/30">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  )
}

// Score bar component
function ScoreBar({
  label,
  value,
  icon,
  color,
  delay
}: {
  label: string
  value: number
  icon: string
  color: string
  delay: number
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-soft-white flex items-center gap-1">
          <span>{icon}</span>
          {label}
        </span>
        <span className="text-sm font-semibold text-soft-white">{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay }}
        />
      </div>
    </div>
  )
}
