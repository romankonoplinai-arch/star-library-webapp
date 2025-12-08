import { motion } from 'framer-motion'

interface ChapterPanelProps {
  currentChapter: number // 0-12
  onChapterClick: (chapterNumber: number) => void
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export default function ChapterPanel({ currentChapter, onChapterClick }: ChapterPanelProps) {
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4 text-center">📚 Главы Книги</h3>

      {/* Chapter 0 - Free */}
      <div className="mb-4">
        <motion.button
          onClick={() => onChapterClick(0)}
          className="w-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-xl p-4 text-amber-100 hover:from-amber-500/30 hover:to-yellow-500/30 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="font-medium">Введение</span>
          </div>
        </motion.button>
      </div>

      {/* Chapters 1-12 - VIP */}
      <div className="grid grid-cols-6 gap-3">
        {ROMAN_NUMERALS.map((numeral, index) => {
          const chapterNum = index + 1
          const isUnlocked = currentChapter >= chapterNum

          return (
            <motion.button
              key={chapterNum}
              onClick={() => onChapterClick(chapterNum)}
              className={`
                relative aspect-square rounded-xl border-2 flex items-center justify-center text-lg font-bold
                transition-all duration-300
                ${isUnlocked
                  ? 'bg-gradient-to-br from-amber-500/30 to-yellow-600/30 border-amber-400/50 text-amber-100 hover:from-amber-500/40 hover:to-yellow-600/40 shadow-lg shadow-amber-500/20'
                  : 'bg-gray-800/30 border-gray-600/30 text-gray-500'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isUnlocked}
            >
              {isUnlocked ? (
                <span>{numeral}</span>
              ) : (
                <motion.span
                  className="text-2xl"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ❓
                </motion.span>
              )}

              {/* Unlock indicator */}
              {isUnlocked && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Progress info */}
      <div className="mt-4 text-center text-sm text-gray-400">
        <p>Открыто глав: {currentChapter}/12</p>
      </div>
    </div>
  )
}
