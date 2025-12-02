import { motion } from 'framer-motion'
import { TarotCard } from './TarotCard'
import { celticCrossSequence, staggerItem } from '@/lib/animations'

interface CardData {
  id: number
  name: string
  nameRu: string
  imageUrl: string
  reversed: boolean
}

interface CardInSpread {
  card: CardData
  position: number
  positionName: string
}

interface CelticCrossLayoutProps {
  cards: CardInSpread[]
  onCardReveal?: (position: number) => void
}

// Позиции Celtic Cross
const POSITIONS = [
  { position: 1, name: 'Ситуация', gridArea: 'center', rotate: 0 },
  { position: 2, name: 'Препятствие', gridArea: 'cross', rotate: 90 },
  { position: 3, name: 'Корона', gridArea: 'crown', rotate: 0 },
  { position: 4, name: 'Основа', gridArea: 'base', rotate: 0 },
  { position: 5, name: 'Прошлое', gridArea: 'past', rotate: 0 },
  { position: 6, name: 'Будущее', gridArea: 'future', rotate: 0 },
  { position: 7, name: 'Вы сами', gridArea: 'self', rotate: 0 },
  { position: 8, name: 'Окружение', gridArea: 'environment', rotate: 0 },
  { position: 9, name: 'Надежды', gridArea: 'hopes', rotate: 0 },
  { position: 10, name: 'Итог', gridArea: 'outcome', rotate: 0 },
]

export function CelticCrossLayout({ cards, onCardReveal }: CelticCrossLayoutProps) {
  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      variants={celticCrossSequence}
      initial="hidden"
      animate="visible"
    >
      {/* Grid Layout для Celtic Cross */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(5, auto)',
          gridTemplateAreas: `
            ". crown crown ."
            "past center center future"
            "past cross cross future"
            ". base base ."
            "self environment hopes outcome"
          `,
        }}
      >
        {cards.map((cardInSpread, index) => {
          const positionInfo = POSITIONS[index]
          if (!positionInfo) return null

          return (
            <motion.div
              key={positionInfo.position}
              className="flex justify-center"
              style={{
                gridArea: positionInfo.gridArea,
                transform: positionInfo.rotate ? `rotate(${positionInfo.rotate}deg)` : undefined,
              }}
              variants={staggerItem}
            >
              <TarotCard
                card={cardInSpread.card}
                position={positionInfo.position}
                positionName={positionInfo.name}
                size="sm"
                onReveal={() => onCardReveal?.(positionInfo.position)}
              />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
