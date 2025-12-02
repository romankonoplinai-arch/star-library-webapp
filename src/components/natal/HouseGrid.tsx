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

// Градиенты по стихиям
const ELEMENT_GRADIENTS: Record<string, string> = {
  fire: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%)',
  earth: 'linear-gradient(135deg, #6B8E23 0%, #556B2F 100%)',
  air: 'linear-gradient(135deg, #74B9FF 0%, #0984E3 100%)',
  water: 'linear-gradient(135deg, #6C5CE7 0%, #341F97 100%)',
  special: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
}

// Иконка дома с градиентом
const HouseIcon = ({ element, size = 32 }: { element: string; size?: number }) => {
  const gradient = ELEMENT_GRADIENTS[element] || ELEMENT_GRADIENTS.special

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Свечение */}
      <div
        className="absolute inset-0 rounded-full blur-sm opacity-50"
        style={{ background: gradient }}
      />
      {/* Основной круг */}
      <div
        className="absolute inset-1 rounded-full shadow-lg"
        style={{ background: gradient }}
      />
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
      {/* Асцендент - отдельный блок */}
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
          <HouseIcon element="special" size={36} />
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
              {/* Иконка с градиентом */}
              <HouseIcon element={info.element} size={28} />

              {/* Номер дома */}
              <span className="text-[11px] font-semibold text-soft-white mt-1">
                {houseData.house} дом
              </span>

              {/* Тема */}
              <span className="text-[9px] text-muted-gray leading-tight">
                {info.theme}
              </span>

              {/* Знак куспида */}
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="text-[10px]">{sign?.symbol}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
