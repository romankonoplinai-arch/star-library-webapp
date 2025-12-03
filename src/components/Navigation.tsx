import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useHaptic } from '@/hooks'
import { cn } from '@/lib/utils'

interface NavItem {
  path: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Главная', icon: '🏠' },
  { path: '/tarot', label: 'Таро', icon: '🎴' },
  { path: '/natal', label: 'Карта', icon: '🌌' },
  { path: '/profile', label: 'Профиль', icon: '✨' },
]

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const haptic = useHaptic()

  const handleNavClick = (path: string) => {
    if (location.pathname !== path) {
      haptic.selection()
      navigate(path)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cosmic-black/90 backdrop-blur-lg border-t border-white/10">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors',
                isActive ? 'text-mystical-gold' : 'text-muted-gray'
              )}
            >
              <motion.span
                className="text-2xl mb-1"
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item.icon}
              </motion.span>
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-1 w-8 h-1 bg-mystical-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
