import { motion } from 'framer-motion'
import { HOUSES_INFO, ZODIAC_SIGNS, formatDegree, getSignFromDegree } from '@/lib/natalData'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface HouseData {
  house: number
  cusp: number // градус куспида
  planets?: string[] // планеты в доме
}

interface HouseGridProps {
  houses: HouseData[]
  ascendant: number
  selectedHouse: number | null
  onHouseSelect: (house: number) => void
}

// Римские цифры
const ROMAN_NUMERALS: Record<number, string> = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
  7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
}

// Градиенты по стихиям (более яркие)
const ELEMENT_COLORS: Record<string, { gradient: string; glow: string; border: string }> = {
  fire: {
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FE5F55 100%)',
    glow: 'rgba(255, 107, 107, 0.5)',
    border: '#FF6B6B'
  },
  earth: {
    gradient: 'linear-gradient(135deg, #7CB342 0%, #558B2F 50%, #33691E 100%)',
    glow: 'rgba(124, 179, 66, 0.5)',
    border: '#7CB342'
  },
  air: {
    gradient: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 50%, #1E88E5 100%)',
    glow: 'rgba(100, 181, 246, 0.5)',
    border: '#64B5F6'
  },
  water: {
    gradient: 'linear-gradient(135deg, #9575CD 0%, #7E57C2 50%, #5E35B1 100%)',
    glow: 'rgba(149, 117, 205, 0.5)',
    border: '#9575CD'
  },
  special: {
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    glow: 'rgba(255, 215, 0, 0.6)',
    border: '#FFD700'
  },
}

// Гексагон с римской цифрой
const HouseHexagon = ({
  houseNumber,
  element,
  size = 36,
  isSelected = false
}: {
  houseNumber: number
  element: string
  size?: number
  isSelected?: boolean
}) => {
  const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.special
  const roman = houseNumber === 0 ? '↑' : ROMAN_NUMERALS[houseNumber]

  // SVG гексагон
  const hexPath = "M50,3 L97,25 L97,75 L50,97 L3,75 L3,25 Z"

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Свечение */}
      <div
        className={cn(
          "absolute inset-0 blur-md transition-opacity",
          isSelected ? "opacity-80" : "opacity-40"
        )}
        style={{
          background: colors.glow,
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        }}
      />

      {/* SVG гексагон */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        style={{ filter: isSelected ? 'drop-shadow(0 0 8px ' + colors.glow + ')' : 'none' }}
      >
        {/* Градиентный фон */}
        <defs>
          <linearGradient id={`hex-grad-${houseNumber}-${element}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={element === 'fire' ? '#FF6B6B' : element === 'earth' ? '#7CB342' : element === 'air' ? '#64B5F6' : element === 'water' ? '#9575CD' : '#FFD700'} />
            <stop offset="100%" stopColor={element === 'fire' ? '#FE5F55' : element === 'earth' ? '#33691E' : element === 'air' ? '#1E88E5' : element === 'water' ? '#5E35B1' : '#FF8C00'} />
          </linearGradient>
        </defs>

        {/* Гексагон с заливкой */}
        <path
          d={hexPath}
          fill={`url(#hex-grad-${houseNumber}-${element})`}
          stroke={isSelected ? '#fff' : colors.border}
          strokeWidth={isSelected ? 4 : 2}
          opacity={isSelected ? 1 : 0.9}
        />
      </svg>

      {/* Римская цифра */}
      <span
        className={cn(
          "relative z-10 font-bold text-white drop-shadow-lg",
          houseNumber >= 10 ? "text-[9px]" : "text-[11px]"
        )}
        style={{
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          letterSpacing: '-0.5px'
        }}
      >
        {roman}
      </span>
    </div>
  )
}

export function HouseGrid({ houses, ascendant, selectedHouse, onHouseSelect }: HouseGridProps) {
  // Асцендент отдельно
  const ascendantInfo = HOUSES_INFO.find((h) => h.house === 0)
  const ascendantSign = ZODIAC_SIGNS[getSignFromDegree(ascendant) as keyof typeof ZODIAC_SIGNS]

  return (
    <motion.div
      className="space-y-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Асцендент - отдельный блок с гексагоном */}
      {ascendantInfo && (
        <motion.button
          variants={staggerItem}
          onClick={() => onHouseSelect(0)}
          className={cn(
            'w-full flex items-center gap-3 p-3 rounded-xl transition-all',
            selectedHouse === 0
              ? 'bg-gradient-to-r from-mystical-gold/30 to-accent-purple/30 ring-2 ring-mystical-gold/50'
              : 'bg-gradient-to-r from-mystical-gold/10 to-accent-purple/10 hover:from-mystical-gold/20 hover:to-accent-purple/20'
          )}
        >
          <HouseHexagon
            houseNumber={0}
            element="special"
            size={40}
            isSelected={selectedHouse === 0}
          />
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-soft-white">
                {ascendantInfo.nameRu}
              </span>
              <span className="text-xs text-mystical-gold">{ascendantInfo.theme}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-gray">
              <span>{ascendantSign?.symbol} {ascendantSign?.nameRu}</span>
              <span className="text-mystical-gold/70">{formatDegree(ascendant)}</span>
            </div>
          </div>
        </motion.button>
      )}

      {/* Сетка домов 4x3 */}
      <div className="grid grid-cols-4 gap-2">
        {houses.map((houseData) => {
          const info = HOUSES_INFO.find((h) => h.house === houseData.house)
          const signKey = getSignFromDegree(houseData.cusp)
          const sign = ZODIAC_SIGNS[signKey as keyof typeof ZODIAC_SIGNS]
          const isSelected = selectedHouse === houseData.house

          if (!info) return null

          return (
            <motion.button
              key={houseData.house}
              variants={staggerItem}
              onClick={() => onHouseSelect(houseData.house)}
              className={cn(
                'flex flex-col items-center p-2 rounded-xl transition-all',
                isSelected
                  ? 'bg-gradient-to-br from-accent-purple/40 to-mystical-gold/40 ring-2 ring-mystical-gold/50'
                  : 'bg-white/5 hover:bg-white/10 active:scale-95'
              )}
            >
              {/* Гексагон с римской цифрой */}
              <HouseHexagon
                houseNumber={houseData.house}
                element={info.element}
                size={32}
                isSelected={isSelected}
              />

              {/* Тема */}
              <span className="text-[10px] font-medium text-soft-white mt-1.5">
                {info.theme}
              </span>

              {/* Знак куспида */}
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="text-[11px]">{sign?.symbol}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
