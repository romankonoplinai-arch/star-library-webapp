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
import { useUserStore } from '@/stores'

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
  const isVip = useUserStore((s) => s.isVip)
  const birthDate = useUserStore((s) => s.birthDate)

  useBackButton(() => navigate('/'))

  // Загрузка натальной карты
  useEffect(() => {
    if (!birthDate) {
      setLoading(false)
      setError('Данные рождения не указаны')
      return
    }

    api.getNatalChartFull()
      .then((data) => {
        if (data.has_data && data.chart) {
          setChartData(data)
        } else {
          setError(data.message || 'Не удалось загрузить карту')
        }
      })
      .catch((err) => {
        console.error('Failed to load natal chart:', err)
        setError('Ошибка загрузки натальной карты')
      })
      .finally(() => setLoading(false))
  }, [birthDate])

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

  // Показываем загрузку
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-muted-gray mt-4">Рассчитываем вашу карту...</p>
        </div>
      </div>
    )
  }

  // Показываем ошибку
  if (error || !chartData?.chart) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-6 text-center max-w-sm">
          <span className="text-4xl mb-4 block">🌟</span>
          <h2 className="text-xl font-semibold mb-2">Натальная карта</h2>
          <p className="text-muted-gray mb-4">
            {error || 'Для расчёта карты необходимы данные рождения'}
          </p>
          {!isVip() && (
            <p className="text-sm text-mystical-gold">
              Натальная карта доступна для VIP подписчиков
            </p>
          )}
        </GlassCard>
      </div>
    )
  }

  // Преобразуем данные API
  const planets: PlanetData[] = chartData.chart.planets.map(p => ({
    name: p.name,
    degree: p.longitude,
    house: p.house,
    retrograde: false,
  }))

  const houses = chartData.chart.houses.map(h => ({
    house: h.number,
    cusp: h.cusp_longitude,
  }))

  const ascendant = chartData.chart.angles.ascendant.longitude

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

        {/* SVG Chart */}
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
