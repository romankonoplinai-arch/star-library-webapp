import { motion } from 'framer-motion'
import { useHaptic } from '@/hooks'
import { cn } from '@/lib/utils'

interface MagicButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  haptic?: 'light' | 'medium' | 'heavy'
}

export function MagicButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className,
  haptic: hapticType = 'light',
}: MagicButtonProps) {
  const haptic = useHaptic()

  const handleClick = () => {
    if (disabled) return
    haptic[hapticType]?.()
    onClick?.()
  }

  const variants = {
    primary: 'bg-mystical-gold text-cosmic-black font-semibold',
    secondary: 'bg-white/10 text-soft-white border border-white/20',
    ghost: 'bg-transparent text-mystical-gold',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      className={cn(
        'rounded-full transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
    >
      {children}
    </motion.button>
  )
}
