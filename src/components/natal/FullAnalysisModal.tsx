import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, LoadingSpinner } from '@/components/ui'
import { api } from '@/lib/api'
import { useUserStore } from '@/stores'

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
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedPages, setParsedPages] = useState<{ title: string; content: string }[]>([])
  const defaultCharacter = useUserStore((s) => s.defaultCharacter)

  // Reset and load AI interpretation when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setCurrentPage(0)
      setAiInterpretation(null)
      setParsedPages([])
      setError(null)
      return
    }

    // If we already have interpretation and parsed pages, don't reload
    if (aiInterpretation && parsedPages.length > 0) return

    const loadInterpretation = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await api.interpretNatalChart(
          sunSign,
          moonSign,
          ascSign,
          defaultCharacter
        )

        console.log('API Response:', response)

        // Check if interpretation exists
        if (!response || !response.interpretation) {
          throw new Error('AI не вернул толкование')
        }

        setAiInterpretation(response.interpretation)

        // Parse AI response into 5 pages
        const pages = parseAiInterpretation(response.interpretation)
        console.log('Parsed pages:', pages)
        setParsedPages(pages)
      } catch (err: any) {
        console.error('Failed to load AI interpretation:', err)
        setError(err.message || 'Не удалось загрузить толкование')

        // Fallback to static content
        setParsedPages(PAGES.map(p => ({
          title: p.title,
          content: p.content(sunSign, moonSign, ascSign)
        })))
      } finally {
        setIsLoading(false)
      }
    }

    loadInterpretation()
  }, [isOpen, sunSign, moonSign, ascSign, defaultCharacter])

  const parseAiInterpretation = (text: string): { title: string; content: string }[] => {
    // Safety check: if text is null/undefined/empty, return fallback
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return [{
        title: 'Ошибка',
        content: 'Не удалось получить толкование от AI'
      }]
    }

    // Try multiple parsing strategies

    // Strategy 1: "Страница N - "Title""
    const pattern1 = /Страница \d+ - "([^"]+)"[:\s]*([\s\S]*?)(?=Страница \d+|$)/g
    let matches = [...text.matchAll(pattern1)]

    if (matches.length >= 3) {
      return matches.slice(0, 5).map(match => ({
        title: match[1],
        content: match[2].trim()
      }))
    }

    // Strategy 2: "**Title**" or "## Title"
    const pattern2 = /(?:\*\*|##)\s*(.+?)\s*(?:\*\*|##)?\s*\n([\s\S]*?)(?=(?:\*\*|##)|$)/g
    matches = [...text.matchAll(pattern2)]

    if (matches.length >= 3) {
      return matches.slice(0, 5).map(match => ({
        title: match[1].replace(/\*\*/g, '').trim(),
        content: match[2].trim()
      }))
    }

    // Strategy 3: Split by double newlines and take chunks
    const chunks = text.split(/\n\n+/).filter(chunk => chunk.trim().length > 50)
    if (chunks.length >= 3) {
      return chunks.slice(0, 5).map((chunk, i) => {
        const lines = chunk.split('\n')
        const title = lines[0].replace(/\*\*/g, '').replace(/##/g, '').trim()
        const content = lines.slice(1).join('\n').trim()
        return {
          title: title || `Часть ${i + 1}`,
          content: content || chunk
        }
      })
    }

    // Fallback: return whole text as one page
    return [{
      title: 'Ваша Натальная Карта',
      content: text.trim()
    }]
  }

  const nextPage = () => {
    if (currentPage < parsedPages.length - 1) {
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

  if (!isOpen) return null

  const currentPageData = parsedPages[currentPage] || { title: '', content: '' }

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
              className="relative w-full max-w-[90vw] md:max-w-2xl"
              style={{ perspective: 1000 }}
            >
              <GlassCard className="p-8 max-h-[75vh] flex flex-col">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                >
                  ✕
                </button>

                {/* Page indicator */}
                <div className="absolute top-4 left-4 text-xs text-muted-gray">
                  {parsedPages.length > 0 && `${currentPage + 1} / ${parsedPages.length}`}
                </div>

                {/* Loading state */}
                {isLoading ? (
                  <div className="min-h-[400px] flex flex-col items-center justify-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-muted-gray mt-4">Генерируем ваше персональное толкование...</p>
                  </div>
                ) : parsedPages.length > 0 ? (
                  <>
                    {/* Error notification if AI failed */}
                    {error && (
                      <div className="mb-3 p-2 rounded-lg bg-mystical-gold/10 border border-mystical-gold/30">
                        <p className="text-mystical-gold text-xs text-center">
                          🌙✨ Звёзды немного устали... Читаем классику астрологии! 📜
                        </p>
                      </div>
                    )}

                    {/* Page content with flip animation */}
                    <div className="flex-1 flex flex-col min-h-0 mb-4">
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
                          className="h-full flex flex-col"
                        >
                          {/* Title */}
                          <h2 className="text-3xl md:text-4xl font-display font-bold text-mystical-gold mb-6 text-center flex-shrink-0">
                            {currentPageData.title}
                          </h2>

                          {/* Content */}
                          <div className="flex-1 flex items-center justify-center">
                            <p className="text-soft-white text-lg md:text-xl leading-relaxed whitespace-pre-line text-center">
                              {currentPageData.content}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-shrink-0">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Назад
                      </button>

                      <div className="flex gap-1">
                        {parsedPages.map((_, i) => (
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
                        disabled={currentPage === parsedPages.length - 1}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Далее →
                      </button>
                    </div>
                  </>
                ) : null}
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
