import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, MagicButton } from '@/components/ui'
import { useHaptic } from '@/hooks'
import { fadeUp, slideFromRight } from '@/lib/animations'

type OnboardingStep = 'welcome' | 'birthDate' | 'birthPlace' | 'birthTime' | 'complete'

interface OnboardingData {
  birthDate: string
  birthPlace: string
  birthTime: string | null
  knowsExactTime: boolean
}

interface OnboardingPageProps {
  onComplete: (data: OnboardingData) => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const haptic = useHaptic()
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [data, setData] = useState<OnboardingData>({
    birthDate: '',
    birthPlace: '',
    birthTime: null,
    knowsExactTime: false,
  })

  const nextStep = (nextStepName: OnboardingStep) => {
    haptic.light()
    setStep(nextStepName)
  }

  const handleComplete = () => {
    haptic.success()
    onComplete(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center"
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📚
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-gradient mb-4">
              Добро пожаловать в<br />Звёздную Библиотеку
            </h1>
            <p className="text-muted-gray mb-8">
              Магическое место, где звёзды раскрывают свои тайны
            </p>
            <MagicButton onClick={() => nextStep('birthDate')}>
              Начать путешествие
            </MagicButton>
          </motion.div>
        )}

        {step === 'birthDate' && (
          <motion.div
            key="birthDate"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm"
          >
            <GlassCard>
              <h2 className="text-xl font-semibold mb-2">Когда ты родился(ась)?</h2>
              <p className="text-muted-gray text-sm mb-4">
                Это нужно для расчёта твоей натальной карты
              </p>
              <input
                type="date"
                value={data.birthDate}
                onChange={(e) => setData({ ...data, birthDate: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-soft-white mb-4"
              />
              <MagicButton
                fullWidth
                disabled={!data.birthDate}
                onClick={() => nextStep('birthPlace')}
              >
                Далее
              </MagicButton>
            </GlassCard>
          </motion.div>
        )}

        {step === 'birthPlace' && (
          <motion.div
            key="birthPlace"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm"
          >
            <GlassCard>
              <h2 className="text-xl font-semibold mb-2">Где ты родился(ась)?</h2>
              <p className="text-muted-gray text-sm mb-4">
                Город рождения для точных расчётов
              </p>
              <input
                type="text"
                value={data.birthPlace}
                onChange={(e) => setData({ ...data, birthPlace: e.target.value })}
                placeholder="Например: Москва"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-soft-white placeholder:text-muted-gray mb-4"
              />
              <MagicButton
                fullWidth
                disabled={!data.birthPlace}
                onClick={() => nextStep('birthTime')}
              >
                Далее
              </MagicButton>
            </GlassCard>
          </motion.div>
        )}

        {step === 'birthTime' && (
          <motion.div
            key="birthTime"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm"
          >
            <GlassCard>
              <h2 className="text-xl font-semibold mb-2">Знаешь время рождения?</h2>
              <p className="text-muted-gray text-sm mb-4">
                Время нужно для расчёта Асцендента
              </p>

              <div className="space-y-3 mb-4">
                <button
                  onClick={() => {
                    setData({ ...data, knowsExactTime: true })
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    data.knowsExactTime
                      ? 'border-mystical-gold bg-mystical-gold/10'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <span className="font-medium">Да, знаю точно</span>
                </button>

                {data.knowsExactTime && (
                  <motion.input
                    type="time"
                    value={data.birthTime || ''}
                    onChange={(e) => setData({ ...data, birthTime: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-soft-white"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  />
                )}

                <button
                  onClick={() => {
                    setData({ ...data, knowsExactTime: false, birthTime: null })
                    nextStep('complete')
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-white/20 bg-white/5"
                >
                  <span className="font-medium">Примерно / Не знаю</span>
                  <p className="text-xs text-muted-gray">
                    Используем полдень для расчётов
                  </p>
                </button>
              </div>

              {data.knowsExactTime && (
                <MagicButton
                  fullWidth
                  disabled={!data.birthTime}
                  onClick={() => nextStep('complete')}
                >
                  Далее
                </MagicButton>
              )}
            </GlassCard>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center"
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-gradient mb-4">
              Карта готова!
            </h1>
            <p className="text-muted-gray mb-8">
              Твои звёздные хранители ждут тебя
            </p>
            <MagicButton onClick={handleComplete}>
              Войти в Библиотеку
            </MagicButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
