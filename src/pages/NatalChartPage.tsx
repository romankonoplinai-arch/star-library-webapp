import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  NatalChartSVG,
  PlanetGrid,
  HouseGrid,
  PlanetModal,
  HouseModal,
  FullAnalysisModal,
  type PlanetData,
} from '@/components/natal'
import { GlassCard, LoadingSpinner } from '@/components/ui'
import { TabSwitcher } from '@/components/ui/TabSwitcher'
import { useBackButton, useHaptic, useShare } from '@/hooks'
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
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)
  const [chartData, setChartData] = useState<NatalChartApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const haptic = useHaptic()
  const { share } = useShare()
  const isVip = useUserStore((s) => s.isVip)
  const birthDate = useUserStore((s) => s.birthDate)
  const birthPlace = useUserStore((s) => s.birthPlace)
  const birthTime = useUserStore((s) => s.birthTime)
  const natalChartLevel = useUserStore((s) => s.natalChartLevel)

  useBackButton(() => navigate('/'))

  // Загрузка натальной карты - перезагружается при любом изменении данных рождения
  useEffect(() => {
    if (!birthDate) {
      setLoading(false)
      setError('Данные рождения не указаны')
      return
    }

    setLoading(true)
    setError(null)
    setChartData(null)

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
  }, [birthDate, birthPlace, birthTime])

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
        {/* Header - Interactive Book Button */}
        <motion.header variants={staggerItem}>
          <button
            onClick={() => {
              haptic.medium()
              setShowFullAnalysis(true)
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-mystical-gold/20 to-accent-purple/20 border border-mystical-gold/30 hover:border-mystical-gold/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">📖</span>
              <h1 className="text-xl font-display font-bold">
                <span className="bg-gradient-to-r from-mystical-gold via-accent-purple to-mystical-gold bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
                  Натальная карта
                </span>
              </h1>
              <span className="ml-1 px-2 py-0.5 bg-mystical-gold/20 rounded-full text-[10px] font-medium text-mystical-gold">
                Lv.{natalChartLevel}
              </span>
            </div>
            <p className="text-[10px] text-muted-gray mt-1">
              Изучай астрологию — открывай секреты звёзд
            </p>
          </button>
        </motion.header>

        {/* Intro Text */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-4 bg-gradient-to-br from-accent-purple/10 to-mystical-gold/10">
            <p className="text-soft-white text-sm leading-relaxed">
              <span className="text-mystical-gold font-semibold">Натальная карта</span> — это космический портрет момента твоего рождения. Она показывает:
            </p>
            <ul className="text-soft-white/80 text-xs mt-2 space-y-1">
              <li>☉ <span className="text-mystical-gold">Солнце</span> — кто ты на самом деле</li>
              <li>☽ <span className="text-mystical-gold">Луна</span> — как ты чувствуешь</li>
              <li>🪐 <span className="text-mystical-gold">Планеты</span> — разные грани личности</li>
              <li>🏠 <span className="text-mystical-gold">Дома</span> — сферы жизни</li>
            </ul>
          </GlassCard>
        </motion.div>

        {/* Big Three */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-3">
            <p className="text-[10px] text-muted-gray text-center mb-2">
              Кто вы внутри (☉) • Как чувствуете (☽) • Как выглядите (⬆)
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="text-xl">{sunSign?.icon}</span>
                <p className="text-[11px] font-semibold mt-0.5">{sunSign?.nameRu}</p>
                <p className="text-[10px] text-muted-gray">☉ Солнце</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl">{moonSign?.icon}</span>
                <p className="text-[11px] font-semibold mt-0.5">{moonSign?.nameRu}</p>
                <p className="text-[10px] text-muted-gray">☽ Луна</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl">{ascSign?.icon}</span>
                <p className="text-[11px] font-semibold mt-0.5">{ascSign?.nameRu}</p>
                <p className="text-[10px] text-muted-gray">⬆ Асцендент</p>
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
            <p className="text-center text-muted-gray text-xs mt-2">
              👆 Нажми на планету для подробного описания
            </p>
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

        {/* Action Buttons */}
        <motion.div variants={staggerItem} className="flex gap-3 justify-center">
          <button
            onClick={() => {
              haptic.medium()
              navigate('/natal-form')
            }}
            className="px-5 py-2.5 bg-accent-purple/30 hover:bg-accent-purple/50 rounded-xl text-sm font-medium transition-colors border border-accent-purple/40"
          >
            🔄 Пересчитать
          </button>
          <button
            onClick={() => {
              haptic.light()
              const botUsername = 'Star_library_robot'
              const deepLink = `https://t.me/${botUsername}?start=natal`

              const planetsList = planets.slice(0, 7).map(p => {
                const sign = ZODIAC_SIGNS[getSignFromDegree(p.degree) as keyof typeof ZODIAC_SIGNS]
                const planetNames: Record<string, string> = {
                  'Sun': '☉ Солнце',
                  'Moon': '☽ Луна',
                  'Mercury': '☿ Меркурий',
                  'Venus': '♀ Венера',
                  'Mars': '♂ Марс',
                  'Jupiter': '♃ Юпитер',
                  'Saturn': '♄ Сатурн'
                }
                return `${planetNames[p.name] || p.name}: ${sign?.nameRu || ''}`
              }).join('\n')

              const shareText = `🌌 Моя натальная карта

✨ Большая тройка:
☉ Солнце: ${sunSign?.nameRu}
☽ Луна: ${moonSign?.nameRu}
⬆ Асцендент: ${ascSign?.nameRu}

🪐 Планеты в знаках:
${planetsList}

🔮 Узнай свою судьбу:`

              share(shareText, deepLink)
            }}
            className="px-5 py-2.5 bg-mystical-gold/20 hover:bg-mystical-gold/40 rounded-xl text-sm font-medium transition-colors border border-mystical-gold/40 text-mystical-gold"
          >
            ✨ Поделиться
          </button>
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

      {/* Full Analysis Modal */}
      <FullAnalysisModal
        isOpen={showFullAnalysis}
        onClose={() => setShowFullAnalysis(false)}
        sunSign={sunSign?.nameRu || ''}
        moonSign={moonSign?.nameRu || ''}
        ascSign={ascSign?.nameRu || ''}
      />
    </div>
  )
}
