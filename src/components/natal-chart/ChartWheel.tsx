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
  ascendant?: number
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

// Цвета по стихиям (как на референсе)
const ELEMENT_COLORS: Record<string, string> = {
  fire: '#FFB3B3',    // Огонь - розовый/красный
  earth: '#FFFFB3',   // Земля - жёлтый
  air: '#B3D9FF',     // Воздух - голубой
  water: '#B3FFB3',   // Вода - зелёный
}

const SIGN_ELEMENTS: Record<string, string> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
}

const ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']

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
  Jupiter: '#DAA520', Saturn: '#4682B4', Uranus: '#40E0D0', Neptune: '#4169E1', Pluto: '#8B0000',
}

export function ChartWheel({ planets, houses, size = 400, onPlanetClick }: ChartWheelProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const center = size / 2
  const outerRadius = size / 2 - 5
  const zodiacOuterR = outerRadius
  const zodiacInnerR = outerRadius - 35
  const houseOuterR = zodiacInnerR
  const houseInnerR = zodiacInnerR - 50
  const planetR = (houseOuterR + houseInnerR) / 2
  const aspectR = houseInnerR - 10

  // Получаем ASC из первого дома
  const ascendant = houses.find(h => h.number === 1)?.cusp_longitude || 0

  // Конвертация эклиптических градусов в угол на карте
  // ASC всегда слева (180° на экране), карта вращается относительно ASC
  const degToAngle = (longitude: number) => {
    // ASC слева = 180°, против часовой стрелки
    return 180 - (longitude - ascendant)
  }

  const angleToPos = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180
    return {
      x: center + r * Math.cos(rad),
      y: center - r * Math.sin(rad), // минус потому что SVG Y вниз
    }
  }

  const degToPos = (longitude: number, r: number) => {
    return angleToPos(degToAngle(longitude), r)
  }

  // Рисуем секторы знаков зодиака
  const zodiacSectors = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, i) => {
      const startLong = i * 30
      const endLong = (i + 1) * 30

      const startAngle = degToAngle(startLong)
      const endAngle = degToAngle(endLong)

      const p1 = angleToPos(startAngle, zodiacOuterR)
      const p2 = angleToPos(endAngle, zodiacOuterR)
      const p3 = angleToPos(endAngle, zodiacInnerR)
      const p4 = angleToPos(startAngle, zodiacInnerR)

      // Определяем sweep direction (против часовой = 0 когда end < start)
      const sweep = endAngle < startAngle ? 0 : 1

      const path = `
        M ${p1.x} ${p1.y}
        A ${zodiacOuterR} ${zodiacOuterR} 0 0 ${sweep} ${p2.x} ${p2.y}
        L ${p3.x} ${p3.y}
        A ${zodiacInnerR} ${zodiacInnerR} 0 0 ${1-sweep} ${p4.x} ${p4.y}
        Z
      `

      const midAngle = (startAngle + endAngle) / 2
      const symbolPos = angleToPos(midAngle, (zodiacOuterR + zodiacInnerR) / 2)
      const element = SIGN_ELEMENTS[sign]
      const color = ELEMENT_COLORS[element]

      return (
        <g key={sign}>
          <path d={path} fill={color} stroke="#666" strokeWidth="1" />
          <text
            x={symbolPos.x}
            y={symbolPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fill="#333"
            fontWeight="bold"
          >
            {ZODIAC_SYMBOLS[sign]}
          </text>
        </g>
      )
    })
  }, [ascendant, center, zodiacOuterR, zodiacInnerR])

  // Рисуем секторы домов
  const houseSectors = useMemo(() => {
    const sorted = [...houses].sort((a, b) => a.number - b.number)

    return sorted.map((house, i) => {
      const nextHouse = sorted[(i + 1) % 12]
      const startAngle = degToAngle(house.cusp_longitude)
      const endAngle = degToAngle(nextHouse.cusp_longitude)

      const p1 = angleToPos(startAngle, houseOuterR)
      const p2 = angleToPos(endAngle, houseOuterR)
      const p3 = angleToPos(endAngle, houseInnerR)
      const p4 = angleToPos(startAngle, houseInnerR)

      const sweep = endAngle < startAngle ? 0 : 1
      const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0

      const path = `
        M ${p1.x} ${p1.y}
        A ${houseOuterR} ${houseOuterR} 0 ${largeArc} ${sweep} ${p2.x} ${p2.y}
        L ${p3.x} ${p3.y}
        A ${houseInnerR} ${houseInnerR} 0 ${largeArc} ${1-sweep} ${p4.x} ${p4.y}
        Z
      `

      // Номер дома в середине сектора
      let midLong = (house.cusp_longitude + nextHouse.cusp_longitude) / 2
      if (nextHouse.cusp_longitude < house.cusp_longitude) {
        midLong = (house.cusp_longitude + nextHouse.cusp_longitude + 360) / 2
        if (midLong >= 360) midLong -= 360
      }
      const numPos = degToPos(midLong, (houseOuterR + houseInnerR) / 2)

      const isEven = house.number % 2 === 0

      return (
        <g key={house.number}>
          <path d={path} fill={isEven ? '#f5f5f5' : '#e8e8e8'} stroke="#999" strokeWidth="1" />
          <text
            x={numPos.x}
            y={numPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#666"
            fontWeight="bold"
          >
            {house.number}
          </text>
        </g>
      )
    })
  }, [houses, ascendant, center, houseOuterR, houseInnerR])

  // Линии осей ASC-DSC и MC-IC
  const axisLines = useMemo(() => {
    const ascPos1 = degToPos(ascendant, zodiacOuterR)
    const ascPos2 = degToPos(ascendant, houseInnerR)
    const dscPos1 = degToPos(ascendant + 180, zodiacOuterR)
    const dscPos2 = degToPos(ascendant + 180, houseInnerR)

    // MC обычно дом 10
    const mc = houses.find(h => h.number === 10)?.cusp_longitude || (ascendant + 270) % 360
    const mcPos1 = degToPos(mc, zodiacOuterR)
    const mcPos2 = degToPos(mc, houseInnerR)
    const icPos1 = degToPos((mc + 180) % 360, zodiacOuterR)
    const icPos2 = degToPos((mc + 180) % 360, houseInnerR)

    return (
      <g>
        {/* ASC-DSC линия */}
        <line x1={ascPos1.x} y1={ascPos1.y} x2={dscPos2.x} y2={dscPos2.y} stroke="#333" strokeWidth="2" />
        {/* MC-IC линия */}
        <line x1={mcPos1.x} y1={mcPos1.y} x2={icPos2.x} y2={icPos2.y} stroke="#333" strokeWidth="2" />

        {/* Подписи */}
        <text x={ascPos1.x - 15} y={ascPos1.y} fontSize="10" fill="#333" fontWeight="bold">Asc</text>
        <text x={dscPos1.x + 5} y={dscPos1.y} fontSize="10" fill="#333" fontWeight="bold">Ds</text>
        <text x={mcPos1.x} y={mcPos1.y - 8} fontSize="10" fill="#333" fontWeight="bold" textAnchor="middle">MC</text>
        <text x={icPos1.x} y={icPos1.y + 15} fontSize="10" fill="#333" fontWeight="bold" textAnchor="middle">IC</text>
      </g>
    )
  }, [houses, ascendant, center, zodiacOuterR, houseInnerR])

  // Аспекты между планетами
  const aspectLines = useMemo(() => {
    const aspects: React.ReactNode[] = []
    const ASPECT_COLORS: Record<string, string> = {
      conjunction: '#FFD700',
      opposition: '#FF0000',
      trine: '#00FF00',
      square: '#FF0000',
      sextile: '#00FF00',
    }
    const ASPECT_ANGLES: Record<string, number> = {
      conjunction: 0,
      opposition: 180,
      trine: 120,
      square: 90,
      sextile: 60,
    }
    const ORB = 8

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        let diff = Math.abs(planets[i].longitude - planets[j].longitude)
        if (diff > 180) diff = 360 - diff

        for (const [aspect, angle] of Object.entries(ASPECT_ANGLES)) {
          if (Math.abs(diff - angle) <= ORB) {
            const pos1 = degToPos(planets[i].longitude, aspectR)
            const pos2 = degToPos(planets[j].longitude, aspectR)
            aspects.push(
              <line
                key={`${planets[i].name}-${planets[j].name}-${aspect}`}
                x1={pos1.x} y1={pos1.y}
                x2={pos2.x} y2={pos2.y}
                stroke={ASPECT_COLORS[aspect]}
                strokeWidth="1"
                opacity="0.7"
              />
            )
            break
          }
        }
      }
    }
    return aspects
  }, [planets, ascendant, center, aspectR])

  // Планеты
  const planetMarkers = useMemo(() => {
    return planets.map((planet, i) => {
      const pos = degToPos(planet.longitude, planetR)
      const hovered = hoveredPlanet?.name === planet.name

      return (
        <motion.g
          key={planet.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: hovered ? 1.3 : 1 }}
          transition={{ delay: i * 0.05, type: 'spring' }}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => { setHoveredPlanet(planet); setTooltipPos({ x: pos.x, y: pos.y - 25 }) }}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={() => onPlanetClick?.(planet)}
        >
          <circle cx={pos.x} cy={pos.y} r={12} fill="white" stroke={PLANET_COLORS[planet.name]} strokeWidth="2" />
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fill={PLANET_COLORS[planet.name]}
            fontWeight="bold"
          >
            {PLANET_SYMBOLS[planet.name]}
          </text>
        </motion.g>
      )
    })
  }, [planets, ascendant, hoveredPlanet, onPlanetClick, center, planetR])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center relative"
    >
      <AnimatePresence>
        {hoveredPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 pointer-events-none"
            style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-gray-900/95 border border-purple-500/30 rounded-xl px-3 py-2 shadow-lg backdrop-blur-sm min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg" style={{ color: PLANET_COLORS[hoveredPlanet.name] }}>
                  {PLANET_SYMBOLS[hoveredPlanet.name]}
                </span>
                <span className="font-bold text-white text-sm">{PLANET_NAMES_RU[hoveredPlanet.name]}</span>
              </div>
              <div className="text-xs text-gray-300 capitalize">{hoveredPlanet.sign} {hoveredPlanet.degree.toFixed(0)}° • Дом {hoveredPlanet.house}</div>
              <div className="text-xs text-purple-400 mt-1">{PLANET_DESCRIPTIONS[hoveredPlanet.name]}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-xl">
        {/* Фон */}
        <circle cx={center} cy={center} r={outerRadius} fill="#fafafa" />

        {/* Знаки зодиака */}
        {zodiacSectors}

        {/* Дома */}
        {houseSectors}

        {/* Центральный круг для аспектов */}
        <circle cx={center} cy={center} r={houseInnerR} fill="white" stroke="#ccc" strokeWidth="1" />

        {/* Аспекты */}
        {aspectLines}

        {/* Оси */}
        {axisLines}

        {/* Планеты */}
        {planetMarkers}
      </svg>
    </motion.div>
  )
}
