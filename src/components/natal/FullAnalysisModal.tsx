import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui'

interface FullAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  sunSign: string
  moonSign: string
  ascSign: string
}

const PAGES = [
  {
    title: 'Ваша Большая Тройка',
    content: (sun: string, moon: string, asc: string) => `
      Солнце в ${sun} говорит о том, кто вы есть в глубине души. Это ваш стержень, ваша суть.

      Луна в ${moon} показывает, как вы чувствуете и реагируете эмоционально. Это ваш внутренний мир.

      Асцендент в ${asc} определяет, как вас видят другие при первом знакомстве. Это ваша "маска".
    `
  },
  {
    title: 'Солнце: Ваша Суть',
    content: (sun: string, _moon?: string, _asc?: string) => `
      С Солнцем в ${sun}, вы обладаете уникальным набором качеств.

      Это не просто знак зодиака - это ваша жизненная миссия, то, что делает вас собой.

      Позвольте этой энергии проявляться в полной мере, и вы найдёте свой путь к счастью.
    `
  },
  {
    title: 'Луна: Ваши Эмоции',
    content: (_sun: string, moon: string, _asc?: string) => `
      Луна в ${moon} раскрывает, что вам нужно для эмоционального комфорта.

      Это ваш внутренний ребёнок, который нуждается в заботе и понимании.

      Слушайте свои чувства - они ваш внутренний компас.
    `
  },
  {
    title: 'Асцендент: Ваша Маска',
    content: (_sun: string, _moon: string, asc: string) => `
      Асцендент в ${asc} показывает, как вы входите в новые ситуации.

      Это ваш стиль, ваша "упаковка", первое впечатление.

      Помните: это не обман, а способ адаптации к миру.
    `
  },
  {
    title: 'Рекомендации',
    content: (_sun?: string, _moon?: string, _asc?: string) => `
      1. Изучайте свою карту глубже - каждая планета добавляет нюансы

      2. Наблюдайте за транзитами - они показывают текущие энергии

      3. Используйте знания о себе для роста, а не для самооправдания

      4. Помните: карта показывает потенциал, но выбор всегда за вами
    `
  }
]

export function FullAnalysisModal({ isOpen, onClose, sunSign, moonSign, ascSign }: FullAnalysisModalProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextPage = () => {
    if (currentPage < PAGES.length - 1) {
      setDirection(1)
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1)
      setCurrentPage(currentPage - 1)
    }
  }

  const getContent = (page: typeof PAGES[0]) => {
    return page.content(sunSign, moonSign, ascSign)
  }

  if (!isOpen) return null

  const currentPageData = PAGES[currentPage]

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
    }),
  }

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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md"
              style={{ perspective: 1000 }}
            >
              <GlassCard className="p-6 overflow-hidden">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                >
                  ✕
                </button>

                {/* Page indicator */}
                <div className="absolute top-4 left-4 text-xs text-muted-gray">
                  {currentPage + 1} / {PAGES.length}
                </div>

                {/* Page content with flip animation */}
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      rotateY: { duration: 0.5 },
                    }}
                    className="min-h-[400px] flex flex-col"
                  >
                    {/* Title */}
                    <h2 className="text-2xl font-display font-bold text-mystical-gold mb-4 text-center">
                      {currentPageData.title}
                    </h2>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      <p className="text-soft-white leading-relaxed whitespace-pre-line">
                        {getContent(currentPageData)}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Назад
                  </button>

                  <div className="flex gap-1">
                    {PAGES.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentPage ? 'bg-mystical-gold' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === PAGES.length - 1}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Далее →
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
