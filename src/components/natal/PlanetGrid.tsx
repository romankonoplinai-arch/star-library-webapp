import { motion } from 'framer-motion'
import { PLANETS_INFO } from '@/lib/natalData'
import { cn } from '@/lib/utils'

export interface PlanetData {
  name: string
  degree: number
  house: number
  retrograde?: boolean
}

interface PlanetGridProps {
  planets: PlanetData[]
  selectedPlanet: string | null
  onPlanetSelect: (planetName: string) => void
}

// SVG иконки планет (реалистичные)
const PlanetIcon = ({ planet, size = 40 }: { planet: string; size?: number }) => {
  const colors: Record<string, { bg: string }> = {
    Sun: { bg: 'linear-gradient(135deg, #FFD93D 0%, #FF8C00 100%)' },
    Moon: { bg: 'linear-gradient(135deg, #E8E8E8 0%, #A0A0A0 100%)' },
    Mercury: { bg: 'linear-gradient(135deg, #B5A642 0%, #8B7355 100%)' },
    Venus: { bg: 'linear-gradient(135deg, #E6A947 0%, #CD853F 100%)' },
    Mars: { bg: 'linear-gradient(135deg, #CD5C5C 0%, #8B0000 100%)' },
    Jupiter: { bg: 'linear-gradient(135deg, #D4A574 0%, #8B4513 100%)' },
    Saturn: { bg: 'linear-gradient(135deg, #C4A35A 0%, #8B7355 100%)' },
    Uranus: { bg: 'linear-gradient(135deg, #7EC8E3 0%, #4682B4 100%)' },
    Neptune: { bg: 'linear-gradient(135deg, #4169E1 0%, #191970 100%)' },
    Pluto: { bg: 'linear-gradient(135deg, #8B4513 0%, #3D2314 100%)' },
  }

  const c = colors[planet] || { bg: '#888' }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Свечение */}
      <div
        className="absolute inset-0 rounded-full blur-sm opacity-50"
        style={{ background: c.bg }}
      />
      {/* Планета */}
      <div
        className="absolute inset-1 rounded-full shadow-lg"
        style={{ background: c.bg }}
      />
    </div>
  )
}

export function PlanetGrid({ planets, selectedPlanet, onPlanetSelect }: PlanetGridProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {planets.map((planet, index) => {
        const info = PLANETS_INFO[planet.name as keyof typeof PLANETS_INFO]
        const isSelected = selectedPlanet === planet.name

        if (!info) return null

        return (
          <motion.button
            key={planet.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onPlanetSelect(planet.name)}
            className={cn(
              'flex flex-col items-center p-2 rounded-xl transition-all relative',
              isSelected
                ? 'bg-gradient-to-br from-accent-purple/40 to-mystical-gold/40 ring-2 ring-mystical-gold/50'
                : 'bg-white/5 hover:bg-white/10 active:scale-95'
            )}
          >
            {/* Иконка планеты */}
            <PlanetIcon planet={planet.name} size={36} />

            {/* Название */}
            <span className="text-[11px] font-semibold text-soft-white mt-1">
              {info.nameRu}
            </span>

            {/* Тема */}
            <span className="text-[9px] text-muted-gray leading-tight">
              {info.theme}
            </span>

            {/* Ретроград */}
            {planet.retrograde && (
              <span className="absolute top-1 right-1 text-[10px] text-red-400 font-bold">
                R
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
