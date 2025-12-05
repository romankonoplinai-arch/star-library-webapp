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

// Градиентные цвета планет как в нижней панели
const PLANET_GRADIENTS: Record<string, { from: string; to: string }> = {
  Sun: { from: '#FFE566', to: '#FFB800' },
  Moon: { from: '#E8E8E8', to: '#B0B0B0' },
  Mercury: { from: '#FFB366', to: '#FF8C00' },
  Venus: { from: '#66FF66', to: '#228B22' },
  Mars: { from: '#FF6B6B', to: '#CC0000' },
  Jupiter: { from: '#DEB887', to: '#8B4513' },
  Saturn: { from: '#87CEEB', to: '#4682B4' },
  Uranus: { from: '#40E0D0', to: '#008B8B' },
  Neptune: { from: '#6495ED', to: '#0000CD' },
  Pluto: { from: '#8B4513', to: '#4A2500' },
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

  // Конвертация эклиптических градусов в угол на карте
  // ASC всегда слева (180°), против часовой стрелки
  const degToAngle = (longitude: number) => {
    return 180 - (longitude - ascendant)
  }

  const angleToPos = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),  // + для инверсии направления
    }
  }

  const degToPos = (longitude: number, r: number) => {
    return angleToPos(degToAngle(longitude), r)
  }

  // Создание дуги для сектора используя describeArc
  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = {
      x: cx + r * Math.cos((startAngle * Math.PI) / 180),
      y: cy + r * Math.sin((startAngle * Math.PI) / 180)
    }
    const end = {
      x: cx + r * Math.cos((endAngle * Math.PI) / 180),
      y: cy + r * Math.sin((endAngle * Math.PI) / 180)
    }
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
    const sweep = endAngle > startAngle ? 1 : 0
    return { start, end, largeArc, sweep }
  }

  const createSectorPath = (startLong: number, endLong: number, innerR: number, outerR: number) => {
    const startAngle = degToAngle(startLong)
    const endAngle = degToAngle(endLong)

    const outer = describeArc(center, center, outerR, startAngle, endAngle)
    const inner = describeArc(center, center, innerR, endAngle, startAngle)

    return `M ${outer.start.x} ${outer.start.y}
            A ${outerR} ${outerR} 0 ${outer.largeArc} ${outer.sweep} ${outer.end.x} ${outer.end.y}
            L ${inner.start.x} ${inner.start.y}
            A ${innerR} ${innerR} 0 ${inner.largeArc} ${inner.sweep} ${inner.end.x} ${inner.end.y}
            Z`
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
      <circle cx={center} cy={center} r={houseInnerR} fill="#FFF8E7" stroke="#C9A227" strokeWidth="1" />

      {/* Солнце и Луна в центре - картинка */}
      <defs>
        <clipPath id="centerClip">
          <circle cx={center} cy={center} r={houseInnerR - 2} />
        </clipPath>
      </defs>
      <image
        href={`${import.meta.env.BASE_URL}sun-moon-center.png`}
        x={center - houseInnerR}
        y={center - houseInnerR}
        width={houseInnerR * 2}
        height={houseInnerR * 2}
        clipPath="url(#centerClip)"
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Оси ASC-DSC и MC-IC - только в кольце домов, не заходят в центр */}
      {(() => {
        const ascPosOuter = degToPos(ascendant, zodiacOuterR)
        const ascPosInner = degToPos(ascendant, houseInnerR)
        const dscPosOuter = degToPos(ascendant + 180, zodiacOuterR)
        const dscPosInner = degToPos(ascendant + 180, houseInnerR)

        const mc = houses[9] || (ascendant + 270) % 360
        const mcPosOuter = degToPos(mc, zodiacOuterR)
        const mcPosInner = degToPos(mc, houseInnerR)
        const icPosOuter = degToPos((mc + 180) % 360, zodiacOuterR)
        const icPosInner = degToPos((mc + 180) % 360, houseInnerR)

        return (
          <g>
            {/* ASC линия */}
            <line x1={ascPosOuter.x} y1={ascPosOuter.y} x2={ascPosInner.x} y2={ascPosInner.y} stroke="#333" strokeWidth="1.5" />
            {/* DSC линия */}
            <line x1={dscPosOuter.x} y1={dscPosOuter.y} x2={dscPosInner.x} y2={dscPosInner.y} stroke="#333" strokeWidth="1.5" />
            {/* MC линия */}
            <line x1={mcPosOuter.x} y1={mcPosOuter.y} x2={mcPosInner.x} y2={mcPosInner.y} stroke="#333" strokeWidth="1.5" />
            {/* IC линия */}
            <line x1={icPosOuter.x} y1={icPosOuter.y} x2={icPosInner.x} y2={icPosInner.y} stroke="#333" strokeWidth="1.5" />
            <text x={ascPosOuter.x - 18} y={ascPosOuter.y} fontSize="10" fill="#333" fontWeight="bold">Asc</text>
          </g>
        )
      })()}

      {/* Градиенты для планет */}
      <defs>
        {planets.map((planet) => {
          const gradient = PLANET_GRADIENTS[planet.name] || { from: '#888', to: '#555' }
          return (
            <radialGradient key={`grad-${planet.name}`} id={`planet-${planet.name}`} cx="30%" cy="30%">
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </radialGradient>
          )
        })}
      </defs>

      {/* Планеты - цветные шарики с градиентом */}
      {planets.map((planet) => {
        const pos = degToPos(planet.degree, planetR)
        const isHovered = hoveredPlanet === planet.name

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
            {/* Тень */}
            <circle cx={pos.x + 1} cy={pos.y + 1} r={11} fill="rgba(0,0,0,0.2)" />
            {/* Основной шарик с градиентом */}
            <circle cx={pos.x} cy={pos.y} r={11} fill={`url(#planet-${planet.name})`} />
            {/* Блик */}
            <ellipse cx={pos.x - 3} cy={pos.y - 3} rx={4} ry={3} fill="rgba(255,255,255,0.4)" />
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
