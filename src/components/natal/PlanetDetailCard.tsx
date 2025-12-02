import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui'
import {
  PLANETS_INFO,
  ZODIAC_SIGNS,
  HOUSES_INFO,
  PLANET_IN_SIGN,
  formatDegree,
  getSignFromDegree,
} from '@/lib/natalData'
import { cardExpand } from '@/lib/animations'

interface PlanetDetailCardProps {
  planetName: string
  degree: number
  house: number
  retrograde?: boolean
}

export function PlanetDetailCard({
  planetName,
  degree,
  house,
  retrograde,
}: PlanetDetailCardProps) {
  const planet = PLANETS_INFO[planetName as keyof typeof PLANETS_INFO]
  const signKey = getSignFromDegree(degree)
  const sign = ZODIAC_SIGNS[signKey as keyof typeof ZODIAC_SIGNS]
  const houseInfo = HOUSES_INFO.find((h) => h.house === house)
  const interpretation = PLANET_IN_SIGN[planetName]?.[signKey]

  if (!planet || !sign) return null

  return (
    <motion.div
      variants={cardExpand}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <GlassCard glow className="p-3">
        {/* Header - компактнее */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
            style={{ background: planet.gradient }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-soft-white truncate">
                {planet.nameRu} в {sign.nameRu}
              </span>
              <span className="text-base">{sign.icon}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-gray">
              <span>{planet.theme}</span>
              <span>•</span>
              <span>Дом {house}</span>
              {retrograde && <span className="text-red-400 font-bold ml-1">R</span>}
            </div>
          </div>
        </div>

        {/* Position - одна строка */}
        <div className="flex items-center gap-3 mb-2 px-2 py-1.5 bg-white/5 rounded-lg text-xs">
          <span className="text-mystical-gold font-mono">
            {sign.symbol} {formatDegree(degree)}
          </span>
          {houseInfo && (
            <span className="text-muted-gray">{houseInfo.theme}</span>
          )}
        </div>

        {/* Interpretation - компактный текст */}
        {interpretation && (
          <p className="text-soft-white/90 leading-snug text-[13px] mb-2">
            {interpretation}
          </p>
        )}

        {/* Planet Description - мелкий шрифт */}
        <p className="text-[11px] text-muted-gray/80 leading-tight">
          <span className="text-mystical-gold/80">{planet.symbol}</span>
          {' '}
          {planet.description}
        </p>
      </GlassCard>
    </motion.div>
  )
}

interface HouseDetailCardProps {
  house: number
  cusp: number
  planets?: string[]
}

export function HouseDetailCard({ house, cusp, planets }: HouseDetailCardProps) {
  const houseInfo = HOUSES_INFO.find((h) => h.house === house)
  const signKey = getSignFromDegree(cusp)
  const sign = ZODIAC_SIGNS[signKey as keyof typeof ZODIAC_SIGNS]

  if (!houseInfo || !sign) return null

  return (
    <motion.div
      variants={cardExpand}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <GlassCard glow className="p-3">
        {/* Header - компактнее */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center text-xl shrink-0">
            {houseInfo.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-soft-white truncate">
                {houseInfo.nameRu}
              </span>
              <span className="text-mystical-gold text-sm">{houseInfo.theme}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-gray">
              <span>Куспид в {sign.nameRu}</span>
              <span>{sign.symbol}</span>
            </div>
          </div>
        </div>

        {/* Position - одна строка */}
        <div className="flex items-center gap-3 mb-2 px-2 py-1.5 bg-white/5 rounded-lg text-xs">
          <span className="text-mystical-gold font-mono">
            {sign.symbol} {formatDegree(cusp)}
          </span>
          {planets && planets.length > 0 && (
            <span className="text-soft-white">{planets.join(', ')}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-soft-white/90 leading-snug text-[13px]">
          {houseInfo.description}
        </p>
      </GlassCard>
    </motion.div>
  )
}
