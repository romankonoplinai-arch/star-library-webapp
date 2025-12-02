import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number
}

const SIZE_MAP = {
  sm: 24,
  md: 40,
  lg: 56,
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeValue = typeof size === 'number' ? size : SIZE_MAP[size]

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="border-2 border-mystical-gold/30 border-t-mystical-gold rounded-full"
        style={{ width: sizeValue, height: sizeValue }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
