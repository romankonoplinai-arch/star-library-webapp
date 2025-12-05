import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'

interface Planet {
  name: string
  longitude: number
  sign: string
  degree: number
  house: number
  formatted?: string
}

interface House {
  number: number
  cusp_longitude: number
  sign: string
}

interface ChartWheelProps {
  planets: Planet[]
  houses: House[]
  size?: number
  onPlanetClick?: (planet: Planet) => void
}

// Русские названия планет
const PLANET_NAMES_RU: Record<string, string> = {
  Sun: 'Солнце',
  Moon: 'Луна',
  Mercury: 'Меркурий',
  Venus: 'Венера',
  Mars: 'Марс',
  Jupiter: 'Юпитер',
  Saturn: 'Сатурн',
  Uranus: 'Уран',
  Neptune: 'Нептун',
  Pluto: 'Плутон',
}

// Краткие описания планет
const PLANET_DESCRIPTIONS: Record<string, string> = {
  Sun: 'Сущность, эго, жизненная сила',
  Moon: 'Эмоции, подсознание, интуиция',
  Mercury: 'Мышление, коммуникация, обучение',
  Venus: 'Любовь, красота, ценности',
  Mars: 'Энергия, действие, страсть',
  Jupiter: 'Удача, расширение, мудрость',
  Saturn: 'Дисциплина, ограничения, уроки',
  Uranus: 'Перемены, оригинальность, свобода',
  Neptune: 'Мечты, духовность, иллюзии',
  Pluto: 'Трансформация, власть, возрождение',
}

// Цвета знаков зодиака по стихиям
const SIGN_COLORS = {
  // Огонь
  aries: ['#FF6B6B', '#FF8E53'],
  leo: ['#FF6B6B', '#FF8E53'],
  sagittarius: ['#FF6B6B', '#FF8E53'],

  // Земля
  taurus: ['#51CF66', '#94D82D'],
  virgo: ['#51CF66', '#94D82D'],
  capricorn: ['#51CF66', '#94D82D'],

  // Воздух
  gemini: ['#4DABF7', '#74C0FC'],
  libra: ['#4DABF7', '#74C0FC'],
  aquarius: ['#4DABF7', '#74C0FC'],

  // Вода
  cancer: ['#845EF7', '#5C7CFA'],
  scorpio: ['#845EF7', '#5C7CFA'],
  pisces: ['#845EF7', '#5C7CFA'],
}

// Символы знаков зодиака
const ZODIAC_SYMBOLS = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓',
}

// Символы планет
const PLANET_SYMBOLS = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
}

export function ChartWheel({ planets, houses, size = 400, onPlanetClick }: ChartWheelProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const center = size / 2
  const outerRadius = size / 2 - 10
  const zodiacRadius = outerRadius - 40
  const housesRadius = zodiacRadius - 40
  const planetsRadius = housesRadius - 50

  // Конвертация градусов в позицию на круге
  const degToPos = (degree: number, radius: number) => {
    // Астрологический круг: 0° Овна справа, движение против часовой стрелки
    // ASC (cusp 1-го дома) слева, дома нумеруются против часовой
    const rad = ((90 - degree) * Math.PI) / 180
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    }
  }

  // Создаём градиенты для знаков
  const zodiacGradients = useMemo(() => {
    return Object.entries(SIGN_COLORS).map(([sign, colors]) => (
      <linearGradient key={sign} id={`grad-${sign}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={colors[0]} stopOpacity={0.3} />
        <stop offset="100%" stopColor={colors[1]} stopOpacity={0.3} />
      </linearGradient>
    ))
  }, [])

  // Рисуем 12 секторов знаков зодиака (против часовой стрелки)
  const zodiacSectors = useMemo(() => {
    const signs = Object.keys(ZODIAC_SYMBOLS)
    return signs.map((sign, index) => {
      // Против часовой: 90 - angle вместо angle - 90
      const startAngle = 90 - index * 30
      const endAngle = 90 - (index + 1) * 30

      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180

      const x1 = center + outerRadius * Math.cos(startRad)
      const y1 = center + outerRadius * Math.sin(startRad)
      const x2 = center + zodiacRadius * Math.cos(startRad)
      const y2 = center + zodiacRadius * Math.sin(startRad)
      const x3 = center + zodiacRadius * Math.cos(endRad)
      const y3 = center + zodiacRadius * Math.sin(endRad)
      const x4 = center + outerRadius * Math.cos(endRad)
      const y4 = center + outerRadius * Math.sin(endRad)

      const largeArc = 0

      const path = `
        M ${x1} ${y1}
        A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${x4} ${y4}
        L ${x3} ${y3}
        A ${zodiacRadius} ${zodiacRadius} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `

      // Позиция символа знака (против часовой)
      const midAngle = (90 - index * 30 - 15) * Math.PI / 180
      const symbolRadius = (outerRadius + zodiacRadius) / 2
      const symbolX = center + symbolRadius * Math.cos(midAngle)
      const symbolY = center + symbolRadius * Math.sin(midAngle)

      return (
        <g key={sign}>
          <path
            d={path}
            fill={`url(#grad-${sign})`}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          <text
            x={symbolX}
            y={symbolY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fill="white"
            opacity={0.6}
          >
            {ZODIAC_SYMBOLS[sign as keyof typeof ZODIAC_SYMBOLS]}
          </text>
        </g>
      )
    })
  }, [center, outerRadius, zodiacRadius])

  // Рисуем линии домов
  const houseLines = useMemo(() => {
    return houses.map((house) => {
      const pos1 = degToPos(house.cusp_longitude, housesRadius + 20)
      const pos2 = degToPos(house.cusp_longitude, center * 0.2)

      return (
        <line
          key={house.number}
          x1={pos1.x}
          y1={pos1.y}
          x2={pos2.x}
          y2={pos2.y}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      )
    })
  }, [houses, housesRadius, center])

  // Номера домов
  const houseNumbers = useMemo(() => {
    // Сортируем дома по номеру для правильного доступа
    const sortedHouses = [...houses].sort((a, b) => a.number - b.number)

    return sortedHouses.map((house) => {
      // Следующий дом (1→2→3...12→1)
      const nextHouseNum = house.number === 12 ? 1 : house.number + 1
      const nextHouse = sortedHouses.find(h => h.number === nextHouseNum)

      // Середина дома между текущим cusp и следующим
      let midLongitude
      if (nextHouse) {
        let nextCusp = nextHouse.cusp_longitude
        // Если следующий cusp меньше текущего, добавляем 360
        if (nextCusp < house.cusp_longitude) {
          nextCusp += 360
        }
        midLongitude = (house.cusp_longitude + nextCusp) / 2
        if (midLongitude >= 360) midLongitude -= 360
      } else {
        midLongitude = house.cusp_longitude
      }

      const pos = degToPos(midLongitude, housesRadius - 15)

      return (
        <text
          key={`house-num-${house.number}`}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="bold"
          fill="rgba(255,255,255,0.4)"
        >
          {house.number}
        </text>
      )
    })
  }, [houses, housesRadius])

  // Цвета планет
  const planetColors: Record<string, string> = {
    Sun: '#FFD700',
    Moon: '#C0C0C0',
    Mercury: '#FFA500',
    Venus: '#FF69B4',
    Mars: '#FF4500',
    Jupiter: '#8B4513',
    Saturn: '#4169E1',
    Uranus: '#00CED1',
    Neptune: '#1E90FF',
    Pluto: '#8B0000',
  }

  // Обработчик наведения на планету
  const handlePlanetHover = (planet: Planet, pos: { x: number; y: number }) => {
    setHoveredPlanet(planet)
    setTooltipPos({ x: pos.x, y: pos.y - 30 })
  }

  // Рисуем планеты
  const planetMarkers = useMemo(() => {
    return planets.map((planet, index) => {
      const pos = degToPos(planet.longitude, planetsRadius)
      const isHovered = hoveredPlanet?.name === planet.name

      return (
        <motion.g
          key={planet.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: isHovered ? 1.2 : 1 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => handlePlanetHover(planet, pos)}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={() => onPlanetClick?.(planet)}
        >
          {/* Круг планеты */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r={isHovered ? 20 : 16}
            fill={planetColors[planet.name] || '#fff'}
            fillOpacity={isHovered ? 0.4 : 0.2}
            stroke={planetColors[planet.name] || '#fff'}
            strokeWidth={isHovered ? 3 : 2}
          />

          {/* Символ планеты */}
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={isHovered ? 20 : 18}
            fontWeight="bold"
            fill="white"
          >
            {PLANET_SYMBOLS[planet.name as keyof typeof PLANET_SYMBOLS]}
          </text>
        </motion.g>
      )
    })
  }, [planets, planetsRadius, hoveredPlanet, onPlanetClick])

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1.5, type: 'spring' }}
      className="flex items-center justify-center relative"
    >
      {/* Tooltip для планеты */}
      <AnimatePresence>
        {hoveredPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-gray-900/95 border border-purple-500/30 rounded-xl px-3 py-2 shadow-lg backdrop-blur-sm min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-lg"
                  style={{ color: planetColors[hoveredPlanet.name] }}
                >
                  {PLANET_SYMBOLS[hoveredPlanet.name as keyof typeof PLANET_SYMBOLS]}
                </span>
                <span className="font-bold text-white text-sm">
                  {PLANET_NAMES_RU[hoveredPlanet.name]}
                </span>
              </div>
              <div className="text-xs text-gray-300 capitalize">
                {hoveredPlanet.sign} • Дом {hoveredPlanet.house}
              </div>
              <div className="text-xs text-purple-400 mt-1">
                {PLANET_DESCRIPTIONS[hoveredPlanet.name]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl"
      >
        <defs>
          {zodiacGradients}

          {/* Градиент для центрального круга */}
          <radialGradient id="centerGrad">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0f0f1e" />
          </radialGradient>
        </defs>

        {/* Внешний круг */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />

        {/* Знаки зодиака */}
        {zodiacSectors}

        {/* Круг домов */}
        <circle
          cx={center}
          cy={center}
          r={zodiacRadius}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />

        {/* Линии домов */}
        {houseLines}

        {/* Номера домов */}
        {houseNumbers}

        {/* Внутренний круг */}
        <circle
          cx={center}
          cy={center}
          r={housesRadius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
        />

        {/* Центральный круг */}
        <circle
          cx={center}
          cy={center}
          r={center * 0.2}
          fill="url(#centerGrad)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />

        {/* Планеты */}
        {planetMarkers}
      </svg>
    </motion.div>
  )
}
