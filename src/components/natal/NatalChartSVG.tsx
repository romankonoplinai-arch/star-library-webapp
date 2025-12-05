import { useState } from 'react'
import { motion } from 'framer-motion'

export interface Planet {
  name: string
  symbol: string
  sign: string
  degree: number
  house: number
}

interface NatalChartSVGProps {
  planets: Planet[]
  houses: number[]
  ascendant: number
  onPlanetClick?: (planet: Planet) => void
}

// Цвета по стихиям (как на классических картах)
const ELEMENT_COLORS: Record<string, string> = {
  fire: '#FFB3B3',    // Огонь - розовый
  earth: '#FFFFB3',   // Земля - жёлтый
  air: '#B3D9FF',     // Воздух - голубой
  water: '#B3FFB3',   // Вода - зелёный
}

const SIGN_ELEMENTS = ['fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water']

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700',
  Moon: '#C0C0C0',
  Mercury: '#FFA500',
  Venus: '#FF69B4',
  Mars: '#FF4500',
  Jupiter: '#DAA520',
  Saturn: '#4682B4',
  Uranus: '#40E0D0',
  Neptune: '#4169E1',
  Pluto: '#8B0000',
}

export function NatalChartSVG({
  planets,
  houses,
  ascendant,
  onPlanetClick,
}: NatalChartSVGProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)

  const size = 360
  const center = size / 2
  const outerRadius = size / 2 - 5
  const zodiacOuterR = outerRadius
  const zodiacInnerR = outerRadius - 32
  const houseOuterR = zodiacInnerR
  const houseInnerR = zodiacInnerR - 45
  const planetR = (houseOuterR + houseInnerR) / 2
  const aspectR = houseInnerR - 10

  // Конвертация эклиптических градусов в угол на карте
  // ASC всегда слева (180°), против часовой стрелки
  // Используем + вместо - чтобы дома шли против часовой
  const degToAngle = (longitude: number) => {
    return 180 + (longitude - ascendant)
  }

  const angleToPos = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180
    return {
      x: center + r * Math.cos(rad),
      y: center - r * Math.sin(rad),
    }
  }

  const degToPos = (longitude: number, r: number) => {
    return angleToPos(degToAngle(longitude), r)
  }

  // Создание дуги для сектора
  const createSectorPath = (startLong: number, endLong: number, innerR: number, outerR: number) => {
    const startAngle = degToAngle(startLong)
    const endAngle = degToAngle(endLong)

    const p1 = angleToPos(startAngle, outerR)
    const p2 = angleToPos(endAngle, outerR)
    const p3 = angleToPos(endAngle, innerR)
    const p4 = angleToPos(startAngle, innerR)

    // sweep=1 для дуги по часовой, sweep=0 против часовой
    // При + формуле endAngle > startAngle, нужен sweep=1
    const sweep = endAngle > startAngle ? 1 : 0

    return `M ${p1.x} ${p1.y}
            A ${outerR} ${outerR} 0 0 ${sweep} ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            A ${innerR} ${innerR} 0 0 ${1-sweep} ${p4.x} ${p4.y}
            Z`
  }

  // Аспекты между планетами
  const aspectLines: React.ReactNode[] = []
  const ASPECT_COLORS: Record<string, string> = {
    conjunction: '#FFD700',
    opposition: '#FF0000',
    trine: '#00AA00',
    square: '#FF0000',
    sextile: '#00AA00',
  }
  const ASPECT_ANGLES: Record<string, number> = {
    conjunction: 0,
    opposition: 180,
    trine: 120,
    square: 90,
    sextile: 60,
  }

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      let diff = Math.abs(planets[i].degree - planets[j].degree)
      if (diff > 180) diff = 360 - diff

      for (const [aspect, angle] of Object.entries(ASPECT_ANGLES)) {
        if (Math.abs(diff - angle) <= 8) {
          const pos1 = degToPos(planets[i].degree, aspectR)
          const pos2 = degToPos(planets[j].degree, aspectR)
          aspectLines.push(
            <line
              key={`${planets[i].name}-${planets[j].name}`}
              x1={pos1.x} y1={pos1.y}
              x2={pos2.x} y2={pos2.y}
              stroke={ASPECT_COLORS[aspect]}
              strokeWidth="1"
              opacity="0.6"
            />
          )
          break
        }
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full mx-auto drop-shadow-xl">
      {/* Фон */}
      <circle cx={center} cy={center} r={outerRadius} fill="#fafafa" />

      {/* Знаки зодиака */}
      {ZODIAC_SYMBOLS.map((symbol, i) => {
        const startLong = i * 30
        const endLong = (i + 1) * 30
        const element = SIGN_ELEMENTS[i]
        const color = ELEMENT_COLORS[element]

        const midAngle = degToAngle(startLong + 15)
        const symbolPos = angleToPos(midAngle, (zodiacOuterR + zodiacInnerR) / 2)

        return (
          <g key={i}>
            <path
              d={createSectorPath(startLong, endLong, zodiacInnerR, zodiacOuterR)}
              fill={color}
              stroke="#666"
              strokeWidth="1"
            />
            <text
              x={symbolPos.x}
              y={symbolPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#333"
              fontSize="16"
              fontWeight="bold"
            >
              {symbol}
            </text>
          </g>
        )
      })}

      {/* Секторы домов */}
      {houses.map((cusp, i) => {
        const nextCusp = houses[(i + 1) % 12]
        const isEven = (i + 1) % 2 === 0

        // Середина дома для номера
        let midLong = (cusp + nextCusp) / 2
        if (nextCusp < cusp) {
          midLong = (cusp + nextCusp + 360) / 2
          if (midLong >= 360) midLong -= 360
        }
        const numPos = degToPos(midLong, (houseOuterR + houseInnerR) / 2)

        return (
          <g key={`house-${i}`}>
            <path
              d={createSectorPath(cusp, nextCusp, houseInnerR, houseOuterR)}
              fill={isEven ? '#f0f0f0' : '#e0e0e0'}
              stroke="#999"
              strokeWidth="0.5"
            />
            <text
              x={numPos.x}
              y={numPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#666"
              fontSize="11"
              fontWeight="bold"
            >
              {i + 1}
            </text>
          </g>
        )
      })}

      {/* Центральный круг */}
      <circle cx={center} cy={center} r={houseInnerR} fill="white" stroke="#ccc" strokeWidth="1" />

      {/* Аспекты */}
      {aspectLines}

      {/* Оси ASC-DSC и MC-IC */}
      {(() => {
        const ascPos = degToPos(ascendant, zodiacOuterR)
        const dscPos = degToPos(ascendant + 180, houseInnerR)
        const mc = houses[9] || (ascendant + 270) % 360
        const mcPos = degToPos(mc, zodiacOuterR)
        const icPos = degToPos((mc + 180) % 360, houseInnerR)

        return (
          <g>
            <line x1={ascPos.x} y1={ascPos.y} x2={dscPos.x} y2={dscPos.y} stroke="#333" strokeWidth="1.5" />
            <line x1={mcPos.x} y1={mcPos.y} x2={icPos.x} y2={icPos.y} stroke="#333" strokeWidth="1.5" />
            <text x={ascPos.x - 18} y={ascPos.y} fontSize="10" fill="#333" fontWeight="bold">Asc</text>
          </g>
        )
      })()}

      {/* Планеты */}
      {planets.map((planet) => {
        const pos = degToPos(planet.degree, planetR)
        const isHovered = hoveredPlanet === planet.name
        const color = PLANET_COLORS[planet.name] || '#888'

        return (
          <motion.g
            key={planet.name}
            onClick={() => onPlanetClick?.(planet)}
            onMouseEnter={() => setHoveredPlanet(planet.name)}
            onMouseLeave={() => setHoveredPlanet(null)}
            style={{ cursor: 'pointer' }}
            animate={{ scale: isHovered ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <circle cx={pos.x} cy={pos.y} r={12} fill="white" stroke={color} strokeWidth="2" />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={color}
              fontSize="12"
              fontWeight="bold"
            >
              {planet.symbol}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}

export function PlanetTooltip({ planet }: { planet: Planet }) {
  return (
    <div className="bg-cosmic-black/95 border border-mystical-gold/30 rounded-lg p-3 text-sm">
      <p className="text-mystical-gold font-semibold">
        {planet.symbol} {planet.name}
      </p>
      <p className="text-soft-white">
        {planet.sign} {planet.degree.toFixed(1)}°
      </p>
      <p className="text-muted-gray">Дом {planet.house}</p>
    </div>
  )
}
