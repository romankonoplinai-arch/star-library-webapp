import { useState } from 'react'
import { motion } from 'framer-motion'
import { useHaptic } from '@/hooks'
import { cardFlip } from '@/lib/animations'

interface TarotCardData {
  id: number
  name: string
  nameRu: string
  imageUrl: string
  reversed: boolean
}

interface TarotCardProps {
  card?: TarotCardData
  position?: number
  positionName?: string
  revealed?: boolean
  onReveal?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function TarotCard({
  card,
  position,
  positionName,
  revealed = false,
  onReveal,
  size = 'md',
}: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(revealed)
  const haptic = useHaptic()

  const sizes = {
    sm: { width: 80, height: 140 },
    md: { width: 120, height: 210 },
    lg: { width: 160, height: 280 },
  }

  const handleFlip = () => {
    if (isFlipped || !card) return

    haptic.medium()
    setIsFlipped(true)
    onReveal?.()
  }

  const { width, height } = sizes[size]

  return (
    <div className="relative flex flex-col items-center" style={{ width }}>
      {/* Позиция расклада */}
      {positionName && (
        <div className="mb-2 text-center text-xs text-muted-gray">
          {position}. {positionName}
        </div>
      )}

      <div style={{ width, height, perspective: 1000 }}>
        <motion.div
          className="absolute inset-0 cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
          variants={cardFlip}
          initial="faceDown"
          animate={isFlipped ? 'faceUp' : 'faceDown'}
          onClick={handleFlip}
        >
          {/* Рубашка карты */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-deep-purple to-midnight-blue border-2 border-mystical-gold/30 rounded-xl flex items-center justify-center">
              <motion.div
                className="text-mystical-gold text-4xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✧
              </motion.div>
            </div>
          </div>

          {/* Лицо карты */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {card && (
              <div
                className={`w-full h-full ${card.reversed ? 'rotate-180' : ''}`}
              >
                <img
                  src={card.imageUrl}
                  alt={card.nameRu}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Название карты */}
      {isFlipped && card && (
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm font-medium text-soft-white">{card.nameRu}</p>
          {card.reversed && (
            <p className="text-xs text-muted-gray">(перевёрнутая)</p>
          )}
        </motion.div>
      )}
    </div>
  )
}
