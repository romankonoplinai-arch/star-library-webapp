import { motion } from 'framer-motion'
import welcomeImage from '/welcome-illustration.webp'

declare const __CACHE_VERSION__: string

interface WelcomePageProps {
  onComplete: () => void
}

export function WelcomePage({ onComplete }: WelcomePageProps) {
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

      {/* Transparent Enter Button at Bottom */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <button
          onClick={onComplete}
          className="px-8 py-3 text-sm font-medium text-soft-white/90 bg-deep-space/30 backdrop-blur-sm border border-soft-white/20 rounded-full hover:bg-deep-space/50 hover:border-mystical-gold/40 transition-all duration-300"
        >
          ✨ Войти
        </button>
      </motion.div>
    </div>
  )
}
