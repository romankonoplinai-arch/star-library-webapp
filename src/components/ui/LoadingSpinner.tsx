import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: number
}

export function LoadingSpinner({ size = 40 }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="border-2 border-mystical-gold/30 border-t-mystical-gold rounded-full"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
