import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui'
import { useHaptic } from '@/hooks'

interface AvatarSelectorProps {
  isOpen: boolean
  onClose: () => void
  currentAvatar: string
  onSelect: (emoji: string) => void
}

const AVATARS = [
  { emoji: '🌟', name: 'Звезда', gradient: 'from-yellow-400 to-orange-500' },
  { emoji: '🌙', name: 'Луна', gradient: 'from-blue-400 to-purple-500' },
  { emoji: '✨', name: 'Искры', gradient: 'from-purple-400 to-pink-500' },
  { emoji: '🔮', name: 'Шар', gradient: 'from-purple-500 to-indigo-600' },
  { emoji: '💫', name: 'Комета', gradient: 'from-cyan-400 to-blue-500' },
  { emoji: '🌌', name: 'Галактика', gradient: 'from-indigo-500 to-purple-600' },
  { emoji: '⭐', name: 'Звёздочка', gradient: 'from-yellow-300 to-red-500' },
  { emoji: '🪐', name: 'Сатурн', gradient: 'from-orange-400 to-red-500' },
  { emoji: '🌠', name: 'Метеор', gradient: 'from-blue-300 to-purple-500' },
  { emoji: '🌞', name: 'Солнце', gradient: 'from-yellow-400 to-orange-600' },
  { emoji: '🌚', name: 'Ночь', gradient: 'from-gray-700 to-blue-900' },
  { emoji: '🌝', name: 'День', gradient: 'from-yellow-200 to-gray-300' },
]

export function AvatarSelector({ isOpen, onClose, currentAvatar, onSelect }: AvatarSelectorProps) {
  const haptic = useHaptic()

  const handleSelect = (emoji: string) => {
    haptic.medium()
    onSelect(emoji)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateY: 15 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-gradient">
                    Выбери аватар
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map((avatar, index) => {
                    const isSelected = currentAvatar === avatar.emoji

                    return (
                      <motion.button
                        key={avatar.emoji}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{
                          delay: index * 0.05,
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                        whileHover={{
                          scale: 1.15,
                          rotate: [0, -5, 5, -5, 0],
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelect(avatar.emoji)}
                        className="relative aspect-square"
                      >
                        {/* Glow effect */}
                        {isSelected && (
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${avatar.gradient} rounded-2xl blur-xl opacity-60`}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.6, 0.8, 0.6],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        )}

                        {/* Avatar card */}
                        <div
                          className={`relative w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? `bg-gradient-to-br ${avatar.gradient} ring-2 ring-mystical-gold shadow-lg shadow-mystical-gold/50`
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-3xl mb-1">{avatar.emoji}</span>
                          <span className="text-[10px] text-white/80 font-medium">
                            {avatar.name}
                          </span>

                          {/* Selected checkmark */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-mystical-gold rounded-full flex items-center justify-center text-deep-space text-xs"
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>

                        {/* Sparkle particles on hover */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-mystical-gold rounded-full"
                              style={{
                                left: `${25 + i * 25}%`,
                                top: `${25 + i * 25}%`,
                              }}
                              animate={{
                                y: [-10, -20, -10],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </motion.div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Footer hint */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-center text-xs text-muted-gray"
                >
                  ✨ Выбери символ, который отражает твою энергию
                </motion.p>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
