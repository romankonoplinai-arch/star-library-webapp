import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
}

interface TabSwitcherProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function TabSwitcher({ tabs, activeTab, onChange, className }: TabSwitcherProps) {
  return (
    <div className={cn('flex rounded-full bg-white/5 p-1', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex-1 px-4 py-2 text-sm font-medium rounded-full transition-colors',
              isActive ? 'text-white' : 'text-muted-gray hover:text-soft-white'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-purple to-mystical-gold"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
