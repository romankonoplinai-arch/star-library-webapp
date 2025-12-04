import { motion, AnimatePresence } from 'framer-motion'
import {
  HOUSES_INFO,
  HOUSES_EXTENDED,
  ZODIAC_SIGNS,
  formatDegree,
  getSignFromDegree,
} from '@/lib/natalData'

// Градиенты по стихиям
const ELEMENT_GRADIENTS: Record<string, string> = {
  fire: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%)',
  earth: 'linear-gradient(135deg, #6B8E23 0%, #556B2F 100%)',
  air: 'linear-gradient(135deg, #74B9FF 0%, #0984E3 100%)',
  water: 'linear-gradient(135deg, #6C5CE7 0%, #341F97 100%)',
  special: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
}

interface HouseModalProps {
  house: number | null
  cusp: number
  planets?: string[]
  onClose: () => void
}

export function HouseModal({
  house,
  cusp,
  planets,
  onClose,
}: HouseModalProps) {
  if (house === null) return null

  const houseInfo = HOUSES_INFO.find((h) => h.house === house)
  const extended = HOUSES_EXTENDED[house]
  const signKey = getSignFromDegree(cusp)
  const sign = ZODIAC_SIGNS[signKey as keyof typeof ZODIAC_SIGNS]

  if (!houseInfo || !sign) return null

  const gradient = ELEMENT_GRADIENTS[houseInfo.element] || ELEMENT_GRADIENTS.special

  return (
    <AnimatePresence>
      {house !== null && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-h-[80vh] overflow-auto"
          >
            <div className="bg-gradient-to-br from-deep-space/95 to-cosmic-navy/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header с градиентом стихии */}
              <div
                className="p-4 relative overflow-hidden"
                style={{ background: gradient }}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl shadow-lg font-bold">
                    {house === 0 ? '⬆' : house}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white drop-shadow-lg">
                      {houseInfo.nameRu}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {houseInfo.theme} • {sign.nameRu} {sign.symbol}
                    </p>
                  </div>
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Position */}
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl text-sm">
                  <span className="text-mystical-gold font-mono text-base">
                    {sign.symbol} {formatDegree(cusp)}
                  </span>
                  <span className="text-white/50">•</span>
                  <span className="text-muted-gray">Куспид в {sign.nameRu}</span>
                </div>

                {/* Main description */}
                <div>
                  <h3 className="text-mystical-gold text-sm font-semibold mb-2">
                    ✨ Что это значит
                  </h3>
                  <div className="bg-gradient-to-br from-accent-purple/10 to-mystical-gold/10 rounded-xl p-4 border border-white/5">
                    <p className="text-soft-white leading-relaxed">
                      {houseInfo.description}
                    </p>
                  </div>
                </div>

                {/* Manifestations */}
                {extended?.manifestations && (
                  <div>
                    <h3 className="text-mystical-gold text-sm font-semibold mb-2">
                      🔮 За что отвечает
                    </h3>
                    <div className="bg-white/5 rounded-xl p-4 space-y-2">
                      {extended.manifestations.map((item, i) => (
                        <p key={i} className="text-soft-white/90 text-sm leading-relaxed">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions */}
                {extended?.questions && (
                  <div>
                    <h3 className="text-mystical-gold text-sm font-semibold mb-2">
                      ❓ Ключевые вопросы
                    </h3>
                    <div className="bg-white/5 rounded-xl p-4 space-y-1">
                      {extended.questions.map((q, i) => (
                        <p key={i} className="text-soft-white/80 text-sm italic">
                          «{q}»
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advice */}
                {extended?.advice && (
                  <div>
                    <h3 className="text-mystical-gold text-sm font-semibold mb-2">
                      🌟 Совет от звёзд
                    </h3>
                    <div className="bg-gradient-to-r from-mystical-gold/10 to-transparent rounded-xl p-4 border-l-2 border-mystical-gold">
                      <p className="text-soft-white leading-relaxed italic">
                        {extended.advice}
                      </p>
                    </div>
                  </div>
                )}

                {/* Planets in house */}
                {planets && planets.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-sm text-muted-gray mb-2">Планеты в доме:</p>
                    <div className="flex flex-wrap gap-2">
                      {planets.map((p) => (
                        <span
                          key={p}
                          className="px-3 py-1 bg-white/10 rounded-full text-sm text-soft-white"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
