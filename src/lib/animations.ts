import type { Variants } from 'framer-motion'

// Базовые transition (inline для избежания проблем с типами)

// Fade варианты
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0 },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, y: -20 },
}

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
  exit: { opacity: 0, scale: 0.8 },
}

// Flip карты Таро
export const cardFlip: Variants = {
  faceDown: {
    rotateY: 180,
    scale: 0.9,
  },
  faceUp: {
    rotateY: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.8 },
  },
}

// Glow эффект
export const glowPulse: Variants = {
  rest: {
    boxShadow: '0 0 0px rgba(180, 162, 112, 0)',
  },
  hover: {
    boxShadow: '0 0 30px rgba(180, 162, 112, 0.5)',
    transition: { duration: 0.3 },
  },
  tap: {
    boxShadow: '0 0 50px rgba(180, 162, 112, 0.8)',
    scale: 0.98,
  },
}

// Stagger для списков
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

// Celtic Cross раскладка (последовательное появление)
export const celticCrossSequence: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

// Slide для страниц
export const slideFromRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: { x: '-100%', opacity: 0 },
}

export const slideFromBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
  exit: { y: '100%', opacity: 0 },
}

// Плавное раскрытие карточки снизу
export const cardExpand: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
}

// Floating animation (для фоновых элементов)
export const floating = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Stars twinkling
export const twinkle = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
