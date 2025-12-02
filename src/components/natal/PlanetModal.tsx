import { motion, AnimatePresence } from 'framer-motion'
import {
  PLANETS_INFO,
  ZODIAC_SIGNS,
  HOUSES_INFO,
  PLANET_IN_SIGN,
  formatDegree,
  getSignFromDegree,
} from '@/lib/natalData'

interface PlanetModalProps {
  planetName: string | null
  degree: number
  house: number
  retrograde?: boolean
  onClose: () => void
}

export function PlanetModal({
  planetName,
  degree,
  house,
  retrograde,
  onClose,
}: PlanetModalProps) {
  if (!planetName) return null

  const planet = PLANETS_INFO[planetName as keyof typeof PLANETS_INFO]
  const signKey = getSignFromDegree(degree)
  const sign = ZODIAC_SIGNS[signKey as keyof typeof ZODIAC_SIGNS]
  const houseInfo = HOUSES_INFO.find((h) => h.house === house)
  const interpretation = PLANET_IN_SIGN[planetName]?.[signKey]

  if (!planet || !sign) return null

  return (
    <AnimatePresence>
      {planetName && (
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
              {/* Header с градиентом планеты */}
              <div
                className="p-4 relative overflow-hidden"
                style={{ background: planet.gradient }}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl shadow-lg">
                    {sign.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white drop-shadow-lg">
                      {planet.nameRu} в {sign.nameRu}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {planet.theme} • Дом {house}
                      {retrograde && <span className="text-red-300 font-bold ml-2">R</span>}
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
                    {sign.symbol} {formatDegree(degree)}
                  </span>
                  <span className="text-white/50">•</span>
                  {houseInfo && (
                    <span className="text-muted-gray">{houseInfo.theme}</span>
                  )}
                </div>

                {/* Main interpretation */}
                {interpretation && (
                  <div className="bg-gradient-to-br from-accent-purple/10 to-mystical-gold/10 rounded-xl p-4 border border-white/5">
                    <p className="text-soft-white leading-relaxed">
                      {interpretation}
                    </p>
                  </div>
                )}

                {/* Planet info */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-sm text-muted-gray">
                    <span className="text-mystical-gold">{planet.symbol} {planet.nameRu}</span>
                    {' — '}
                    {planet.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
