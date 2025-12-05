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

      {/* Солнце и Луна в центре - детальная прорисовка как на референсе */}
      <g transform={`translate(${center}, ${center})`}>
        {/* Внешние длинные лучи (32 штуки, чередуются длинные и короткие) */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i * 11.25 * Math.PI) / 180
          const isLong = i % 2 === 0
          const innerR = 30
          const outerR = isLong ? 55 : 42
          const width = isLong ? 3 : 1.5
          // Треугольный луч
          const a1 = angle - (width * Math.PI) / 180 / 2
          const a2 = angle + (width * Math.PI) / 180 / 2
          return (
            <path
              key={`ray-${i}`}
              d={`M ${innerR * Math.cos(a1)} ${innerR * Math.sin(a1)}
                  L ${outerR * Math.cos(angle)} ${outerR * Math.sin(angle)}
                  L ${innerR * Math.cos(a2)} ${innerR * Math.sin(a2)} Z`}
              fill="#C4A052"
            />
          )
        })}

        {/* Основной круг солнца */}
        <circle cx={0} cy={0} r={30} fill="#FDF6E3" stroke="#C4A052" strokeWidth="1.5" />

        {/* Луна - большой полумесяц слева */}
        <g transform="translate(-8, 0)">
          {/* Тело луны */}
          <path
            d={`M 5 -28
                A 28 28 0 0 0 5 28
                Q -15 20, -20 0
                Q -15 -20, 5 -28`}
            fill="#C4A052"
          />
          {/* Профиль лица луны */}
          <path
            d={`M -2 -15
                Q -8 -12, -10 -8
                Q -12 -4, -8 0
                Q -10 2, -12 8
                Q -10 14, -5 18`}
            fill="none"
            stroke="#FDF6E3"
            strokeWidth="1"
          />
          {/* Глаз луны */}
          <ellipse cx={-5} cy={-6} rx={3} ry={4} fill="none" stroke="#FDF6E3" strokeWidth="0.8" />
          <circle cx={-5} cy={-5} r={1.5} fill="#FDF6E3" />
          {/* Бровь луны */}
          <path d="M -9 -12 Q -5 -14, -1 -12" fill="none" stroke="#FDF6E3" strokeWidth="0.8" />
          {/* Нос луны */}
          <path d="M -6 -2 Q -9 2, -6 6" fill="none" stroke="#FDF6E3" strokeWidth="0.8" />
          {/* Губы луны */}
          <path d="M -8 10 Q -4 12, 0 10" fill="none" stroke="#FDF6E3" strokeWidth="0.8" />
        </g>

        {/* Лицо солнца - справа */}
        <g transform="translate(5, 0)">
          {/* Левый глаз */}
          <ellipse cx={-2} cy={-8} rx={4} ry={5} fill="none" stroke="#C4A052" strokeWidth="1" />
          <circle cx={-2} cy={-7} r={2} fill="#C4A052" />
          {/* Левая бровь */}
          <path d="M -7 -15 Q -2 -17, 3 -15" fill="none" stroke="#C4A052" strokeWidth="1" />

          {/* Правый глаз */}
          <ellipse cx={12} cy={-8} rx={4} ry={5} fill="none" stroke="#C4A052" strokeWidth="1" />
          <circle cx={12} cy={-7} r={2} fill="#C4A052" />
          {/* Правая бровь */}
          <path d="M 7 -15 Q 12 -17, 17 -15" fill="none" stroke="#C4A052" strokeWidth="1" />

          {/* Нос */}
          <path d="M 5 -5 L 3 5 L 7 5" fill="none" stroke="#C4A052" strokeWidth="1" />

          {/* Рот */}
          <path d="M -3 12 Q 5 18, 13 12" fill="none" stroke="#C4A052" strokeWidth="1" />
          <path d="M -1 14 Q 5 16, 11 14" fill="none" stroke="#C4A052" strokeWidth="0.5" />

          {/* Щёки - декоративные линии */}
          <path d="M -8 5 Q -10 8, -8 11" fill="none" stroke="#C4A052" strokeWidth="0.5" />
          <path d="M 18 5 Q 20 8, 18 11" fill="none" stroke="#C4A052" strokeWidth="0.5" />
        </g>

        {/* Декоративная звезда в центре лба солнца */}
        <path
          d="M 5 -22 L 6 -20 L 8 -20 L 6.5 -18.5 L 7 -16 L 5 -17.5 L 3 -16 L 3.5 -18.5 L 2 -20 L 4 -20 Z"
          fill="#C4A052"
        />
      </g>

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
