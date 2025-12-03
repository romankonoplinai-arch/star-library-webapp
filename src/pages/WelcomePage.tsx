import { motion } from 'framer-motion'
import { GlassCard, MagicButton } from '@/components/ui'
import { useTelegram } from '@/hooks'
import { fadeUp } from '@/lib/animations'
import welcomeImage from '/welcome-illustration.webp'

declare const __CACHE_VERSION__: string

interface WelcomePageProps {
  onComplete: () => void
}

export function WelcomePage({ onComplete }: WelcomePageProps) {
  const { user } = useTelegram()
  const firstName = user?.firstName || 'путник'

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Cosmic Background with AI Illustration */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0033] via-[#2d004d] to-[#0a0e27]" />

      {/* AI Generated Illustration */}
      <motion.div
        className="absolute inset-0 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      >
        <img
          src={`${welcomeImage}?v=${__CACHE_VERSION__}`}
          alt="Cosmic Library Guardians"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Floating Stars Overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                            radial-gradient(2px 2px at 60% 70%, white, transparent),
                            radial-gradient(1px 1px at 50% 50%, white, transparent),
                            radial-gradient(1px 1px at 80% 10%, white, transparent),
                            radial-gradient(2px 2px at 15% 80%, white, transparent),
                            radial-gradient(1px 1px at 90% 50%, white, transparent)`,
          backgroundSize: '200% 200%'
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-md"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >

        {/* Main Card with Welcome Text */}
        <GlassCard className="backdrop-blur-xl">
          <motion.p
            className="text-muted-gray text-sm mb-4 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            *Мерцание звёзд... Шорох древних страниц...*
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h1 className="text-2xl font-display font-bold text-gradient mb-4">
              Звёздная Библиотека
            </h1>
          </motion.div>

          <motion.p
            className="text-soft-white/90 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            🌙 Приветствую тебя, <span className="text-mystical-gold font-semibold">{firstName}</span>.
          </motion.p>

          <motion.p
            className="text-soft-white/80 text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            Я - Лунара, Хранительница этого места.<br/>
            Твоя Книга Судьбы уже ждёт тебя...
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 }}
          >
            <MagicButton
              fullWidth
              onClick={onComplete}
            >
              🌟 Войти в Библиотеку
            </MagicButton>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
