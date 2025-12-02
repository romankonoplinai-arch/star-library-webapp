import { motion, type HTMLMotionProps } from 'framer-motion'
import { fadeScale, glowPulse } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  glow?: boolean
  hoverable?: boolean
}

export function GlassCard({
  children,
  className,
  glow = false,
  hoverable = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'glass-card p-4',
        hoverable && 'cursor-pointer',
        className
      )}
      variants={glow ? glowPulse : fadeScale}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? 'hover' : undefined}
      whileTap={hoverable ? 'tap' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
