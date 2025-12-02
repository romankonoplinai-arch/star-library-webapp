import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  NatalChartSVG,
  PlanetGrid,
  HouseGrid,
  PlanetModal,
  HouseModal,
  type PlanetData,
} from '@/components/natal'
import { GlassCard, LoadingSpinner } from '@/components/ui'
import { TabSwitcher } from '@/components/ui/TabSwitcher'
import { useBackButton, useHaptic } from '@/hooks'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useNavigate } from 'react-router-dom'
import { ZODIAC_SIGNS, getSignFromDegree } from '@/lib/natalData'
import { api, type NatalChartApiResponse } from '@/lib/api'

// Mock data - заменить на API
const MOCK_PLANETS: PlanetData[] = [
  { name: 'Sun', degree: 105, house: 4, retrograde: false }, // Рак
  { name: 'Moon', degree: 195, house: 7, retrograde: false }, // Весы
  { name: 'Mercury', degree: 90, house: 4, retrograde: true }, // Рак
  { name: 'Venus', degree: 45, house: 2, retrograde: false }, // Телец
  { name: 'Mars', degree: 135, house: 5, retrograde: false }, // Лев
  { name: 'Jupiter', degree: 255, house: 9, retrograde: false }, // Стрелец
  { name: 'Saturn', degree: 285, house: 10, retrograde: true }, // Козерог
  { name: 'Uranus', degree: 315, house: 11, retrograde: false }, // Водолей
  { name: 'Neptune', degree: 282, house: 10, retrograde: true }, // Козерог
  { name: 'Pluto', degree: 225, house: 8, retrograde: false }, // Скорпион
]

const MOCK_HOUSES = [
  { house: 1, cusp: 0 },
  { house: 2, cusp: 30 },
  { house: 3, cusp: 60 },
  { house: 4, cusp: 90 },
  { house: 5, cusp: 120 },
  { house: 6, cusp: 150 },
  { house: 7, cusp: 180 },
  { house: 8, cusp: 210 },
  { house: 9, cusp: 240 },
  { house: 10, cusp: 270 },
  { house: 11, cusp: 300 },
  { house: 12, cusp: 330 },
]

const MOCK_ASCENDANT = 0 // Овен

const TABS = [
  { id: 'planets', label: 'Планеты в Знаках' },
  { id: 'houses', label: 'Планеты в Домах' },
]

export function NatalChartPage() {
  const [activeTab, setActiveTab] = useState('planets')
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
  const [chartData, setChartData] = useState<NatalChartApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const haptic = useHaptic()

  useBackButton(() => navigate('/'))

  // Загрузка данных натальной карты
  useEffect(() => {
    async function loadChart() {
      try {
        setLoading(true)
        const data = await api.getNatalChartFull()
        setChartData(data)
        setError(null)
      } catch (err) {
        // Если нет VIP или нет данных - используем mock
        console.log('Using mock data:', err)
        setError(null)
        setChartData(null)
      } finally {
        setLoading(false)
      }
    }
    loadChart()
  }, [])

  const handlePlanetSelect = (planetName: string) => {
    haptic.light()
    setSelectedPlanet(selectedPlanet === planetName ? null : planetName)
    setSelectedHouse(null)
  }

  const handleHouseSelect = (house: number) => {
    haptic.light()
    setSelectedHouse(selectedHouse === house ? null : house)
    setSelectedPlanet(null)
  }

  const handleTabChange = (tabId: string) => {
    haptic.selection()
    setActiveTab(tabId)
    setSelectedPlanet(null)
    setSelectedHouse(null)
  }

  // Преобразуем API данные в формат компонентов или используем mock
  const planets: PlanetData[] = chartData?.chart?.planets?.map(p => ({
    name: p.name,
    degree: p.longitude,
    house: p.house,
    retrograde: false, // TODO: API должен вернуть это
  })) || MOCK_PLANETS

  const houses = chartData?.chart?.houses?.map(h => ({
    house: h.number,
    cusp: h.cusp_longitude,
  })) || MOCK_HOUSES

  const ascendant = chartData?.chart?.angles?.ascendant?.longitude || MOCK_ASCENDANT

  // Big Three
  const sun = planets.find((p) => p.name === 'Sun')
  const moon = planets.find((p) => p.name === 'Moon')
  const sunSign = sun ? ZODIAC_SIGNS[getSignFromDegree(sun.degree) as keyof typeof ZODIAC_SIGNS] : null
  const moonSign = moon ? ZODIAC_SIGNS[getSignFromDegree(moon.degree) as keyof typeof ZODIAC_SIGNS] : null
  const ascSign = ZODIAC_SIGNS[getSignFromDegree(ascendant) as keyof typeof ZODIAC_SIGNS]

  // Получить выбранную планету
  const selectedPlanetData = selectedPlanet
    ? planets.find((p) => p.name === selectedPlanet)
    : null

  // Получить выбранный дом
  const selectedHouseData = selectedHouse !== null
    ? houses.find((h) => h.house === selectedHouse) || { house: 0, cusp: ascendant }
    : null

  // Показать загрузку
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {/* Header */}
        <motion.header variants={staggerItem} className="text-center mb-2">
          <h1 className="text-3xl font-display font-bold">
            <span className="bg-gradient-to-r from-mystical-gold via-accent-purple to-mystical-gold bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
              ✦ Натальная карта ✦
            </span>
          </h1>
        </motion.header>

        {/* Big Three */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            <h2 className="text-mystical-gold font-semibold mb-1 text-center">
              Большая тройка
            </h2>
            <p className="text-[11px] text-muted-gray text-center mb-3">
              Кто вы внутри (☉) • Как чувствуете (☽) • Как выглядите (⬆)
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">{sunSign?.icon}</span>
                <p className="text-sm font-semibold mt-1">{sunSign?.nameRu}</p>
                <p className="text-xs text-muted-gray">☉ Солнце</p>
              </div>
              <div className="p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">{moonSign?.icon}</span>
                <p className="text-sm font-semibold mt-1">{moonSign?.nameRu}</p>
                <p className="text-xs text-muted-gray">☽ Луна</p>
              </div>
              <div className="p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">{ascSign?.icon}</span>
                <p className="text-sm font-semibold mt-1">{ascSign?.nameRu}</p>
                <p className="text-xs text-muted-gray">⬆ Асцендент</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* SVG Chart (collapsed) */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-3">
            <NatalChartSVG
              planets={planets.map((p) => ({
                name: p.name,
                symbol: '',
                sign: '',
                degree: p.degree,
                house: p.house,
              }))}
              houses={houses.map((h) => h.cusp)}
              ascendant={ascendant}
              onPlanetClick={(planet) => handlePlanetSelect(planet.name)}
            />
          </GlassCard>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div variants={staggerItem}>
          <TabSwitcher
            tabs={TABS}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </motion.div>

        {/* Planet Grid or House Grid */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4">
            {activeTab === 'planets' ? (
              <PlanetGrid
                planets={planets}
                selectedPlanet={selectedPlanet}
                onPlanetSelect={handlePlanetSelect}
              />
            ) : (
              <HouseGrid
                houses={houses}
                ascendant={ascendant}
                selectedHouse={selectedHouse}
                onHouseSelect={handleHouseSelect}
              />
            )}
          </GlassCard>
        </motion.div>

      </motion.div>

      {/* Planet Modal */}
      <PlanetModal
        planetName={selectedPlanetData?.name || null}
        degree={selectedPlanetData?.degree || 0}
        house={selectedPlanetData?.house || 0}
        retrograde={selectedPlanetData?.retrograde}
        onClose={() => setSelectedPlanet(null)}
      />

      {/* House Modal */}
      <HouseModal
        house={selectedHouse}
        cusp={selectedHouseData?.cusp || ascendant}
        onClose={() => setSelectedHouse(null)}
      />
    </div>
  )
}
