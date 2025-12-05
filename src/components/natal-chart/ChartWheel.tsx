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

const PLANET_NAMES_RU: Record<string, string> = {
  Sun: 'Солнце', Moon: 'Луна', Mercury: 'Меркурий', Venus: 'Венера',
  Mars: 'Марс', Jupiter: 'Юпитер', Saturn: 'Сатурн', Uranus: 'Уран',
  Neptune: 'Нептун', Pluto: 'Плутон',
}

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

const SIGN_COLORS: Record<string, [string, string]> = {
  aries: ['#FF6B6B', '#FF8E53'], leo: ['#FF6B6B', '#FF8E53'], sagittarius: ['#FF6B6B', '#FF8E53'],
  taurus: ['#51CF66', '#94D82D'], virgo: ['#51CF66', '#94D82D'], capricorn: ['#51CF66', '#94D82D'],
  gemini: ['#4DABF7', '#74C0FC'], libra: ['#4DABF7', '#74C0FC'], aquarius: ['#4DABF7', '#74C0FC'],
  cancer: ['#845EF7', '#5C7CFA'], scorpio: ['#845EF7', '#5C7CFA'], pisces: ['#845EF7', '#5C7CFA'],
}

const ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
const ZODIAC_SYMBOLS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
  libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
}

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
}

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#C0C0C0', Mercury: '#FFA500', Venus: '#FF69B4', Mars: '#FF4500',
  Jupiter: '#8B4513', Saturn: '#4169E1', Uranus: '#00CED1', Neptune: '#1E90FF', Pluto: '#8B0000',
}

export function ChartWheel({ planets, houses, size = 400, onPlanetClick }: ChartWheelProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const center = size / 2
  const outerRadius = size / 2 - 10
  const zodiacRadius = outerRadius - 40
  const housesRadius = zodiacRadius - 40
  const planetsRadius = housesRadius - 50

  // Конвертация астрологических градусов в SVG координаты
  // 0° = Овен справа, против часовой стрелки
  const degToPos = (deg: number, r: number) => {
    // Минус для против часовой стрелки в SVG
    const rad = (-deg * Math.PI) / 180
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    }
  }

  // Градиенты
  const zodiacGradients = useMemo(() => (
    Object.entries(SIGN_COLORS).map(([sign, [c1, c2]]) => (
      <linearGradient key={sign} id={`grad-${sign}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={c1} stopOpacity={0.3} />
        <stop offset="100%" stopColor={c2} stopOpacity={0.3} />
      </linearGradient>
    ))
  ), [])

  // 12 секторов зодиака
  const zodiacSectors = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, i) => {
      const start = i * 30
      const end = (i + 1) * 30

      // 4 точки сектора (против часовой = минус угол)
      const p1 = degToPos(start, outerRadius)
      const p2 = degToPos(end, outerRadius)
      const p3 = degToPos(end, zodiacRadius)
      const p4 = degToPos(start, zodiacRadius)

      // SVG path: дуга против часовой = sweep-flag 0
      const path = `
        M ${p1.x} ${p1.y}
        A ${outerRadius} ${outerRadius} 0 0 0 ${p2.x} ${p2.y}
        L ${p3.x} ${p3.y}
        A ${zodiacRadius} ${zodiacRadius} 0 0 1 ${p4.x} ${p4.y}
        Z
      `

      // Символ в середине сектора
      const mid = degToPos(start + 15, (outerRadius + zodiacRadius) / 2)

      return (
        <g key={sign}>
          <path d={path} fill={`url(#grad-${sign})`} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="white" opacity={0.6}>
            {ZODIAC_SYMBOLS[sign]}
          </text>
        </g>
      )
    })
  }, [center, outerRadius, zodiacRadius])

  // Линии домов
  const houseLines = useMemo(() => {
    return houses.map((house) => {
      const p1 = degToPos(house.cusp_longitude, housesRadius + 20)
      const p2 = degToPos(house.cusp_longitude, center * 0.2)
      return (
        <line key={house.number} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
      )
    })
  }, [houses, housesRadius, center])

  // Номера домов
  const houseNumbers = useMemo(() => {
    const sorted = [...houses].sort((a, b) => a.number - b.number)
    return sorted.map((house) => {
      const nextNum = house.number === 12 ? 1 : house.number + 1
      const next = sorted.find(h => h.number === nextNum)

      let mid = house.cusp_longitude
      if (next) {
        let nextCusp = next.cusp_longitude
        if (nextCusp < house.cusp_longitude) nextCusp += 360
        mid = (house.cusp_longitude + nextCusp) / 2
        if (mid >= 360) mid -= 360
      }

      const pos = degToPos(mid, housesRadius - 15)
      return (
        <text key={`h-${house.number}`} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
          fontSize="14" fontWeight="bold" fill="rgba(255,255,255,0.4)">
          {house.number}
        </text>
      )
    })
  }, [houses, housesRadius])

  // Планеты
  const planetMarkers = useMemo(() => {
    return planets.map((planet, i) => {
      const pos = degToPos(planet.longitude, planetsRadius)
      const hovered = hoveredPlanet?.name === planet.name
      return (
        <motion.g key={planet.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: hovered ? 1.2 : 1 }}
          transition={{ delay: i * 0.1, type: 'spring' }}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => { setHoveredPlanet(planet); setTooltipPos({ x: pos.x, y: pos.y - 30 }) }}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={() => onPlanetClick?.(planet)}
        >
          <circle cx={pos.x} cy={pos.y} r={hovered ? 20 : 16}
            fill={PLANET_COLORS[planet.name] || '#fff'} fillOpacity={hovered ? 0.4 : 0.2}
            stroke={PLANET_COLORS[planet.name] || '#fff'} strokeWidth={hovered ? 3 : 2} />
          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
            fontSize={hovered ? 20 : 18} fontWeight="bold" fill="white">
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
      <AnimatePresence>
        {hoveredPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 pointer-events-none"
            style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-gray-900/95 border border-purple-500/30 rounded-xl px-3 py-2 shadow-lg backdrop-blur-sm min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg" style={{ color: PLANET_COLORS[hoveredPlanet.name] }}>
                  {PLANET_SYMBOLS[hoveredPlanet.name as keyof typeof PLANET_SYMBOLS]}
                </span>
                <span className="font-bold text-white text-sm">{PLANET_NAMES_RU[hoveredPlanet.name]}</span>
              </div>
              <div className="text-xs text-gray-300 capitalize">{hoveredPlanet.sign} • Дом {hoveredPlanet.house}</div>
              <div className="text-xs text-purple-400 mt-1">{PLANET_DESCRIPTIONS[hoveredPlanet.name]}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
        <defs>
          {zodiacGradients}
          <radialGradient id="centerGrad">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0f0f1e" />
          </radialGradient>
        </defs>

        <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        {zodiacSectors}
        <circle cx={center} cy={center} r={zodiacRadius} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        {houseLines}
        {houseNumbers}
        <circle cx={center} cy={center} r={housesRadius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <circle cx={center} cy={center} r={center * 0.2} fill="url(#centerGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        {planetMarkers}
      </svg>
    </motion.div>
  )
}
