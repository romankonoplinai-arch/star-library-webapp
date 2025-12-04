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

const ZODIAC_SIGNS = [
  { symbol: '♈', color: '#E74C3C' },  // Aries - red
  { symbol: '♉', color: '#27AE60' },  // Taurus - green
  { symbol: '♊', color: '#F1C40F' },  // Gemini - yellow
  { symbol: '♋', color: '#3498DB' },  // Cancer - blue
  { symbol: '♌', color: '#E67E22' },  // Leo - orange
  { symbol: '♍', color: '#8E44AD' },  // Virgo - purple
  { symbol: '♎', color: '#E91E63' },  // Libra - pink
  { symbol: '♏', color: '#C0392B' },  // Scorpio - dark red
  { symbol: '♐', color: '#9B59B6' },  // Sagittarius - violet
  { symbol: '♑', color: '#34495E' },  // Capricorn - dark gray
  { symbol: '♒', color: '#00BCD4' },  // Aquarius - cyan
  { symbol: '♓', color: '#1ABC9C' },  // Pisces - teal
]

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700',
  Moon: '#E8E8E8',
  Mercury: '#87CEEB',
  Venus: '#FF69B4',
  Mars: '#FF4500',
  Jupiter: '#FFA500',
  Saturn: '#DEB887',
  Uranus: '#00CED1',
  Neptune: '#6495ED',
  Pluto: '#9370DB',
}

const PLANET_SIZES: Record<string, number> = {
  Sun: 16,
  Moon: 14,
  Jupiter: 14,
  Saturn: 13,
  Mars: 12,
  Venus: 12,
  Mercury: 11,
  Uranus: 11,
  Neptune: 11,
  Pluto: 10,
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
  const zodiacOuterRadius = outerRadius
  const zodiacInnerRadius = outerRadius - 28
  const houseRadius = zodiacInnerRadius - 5
  const planetRadius = houseRadius - 35
  const innerCircleRadius = planetRadius - 25

  // Convert degrees to coordinates (ASC at left = 180°)
  const degToCoord = (deg: number, radius: number) => {
    const adjustedDeg = 180 - deg + ascendant
    const rad = (adjustedDeg * Math.PI) / 180
    return {
      x: center + radius * Math.cos(rad),
      y: center - radius * Math.sin(rad),
    }
  }

  // Create arc path for zodiac segment
  const createArcPath = (startDeg: number, endDeg: number, innerR: number, outerR: number) => {
    const start1 = degToCoord(startDeg, outerR)
    const end1 = degToCoord(endDeg, outerR)
    const start2 = degToCoord(endDeg, innerR)
    const end2 = degToCoord(startDeg, innerR)

    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0

    return `M ${start1.x} ${start1.y}
            A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y}
            L ${start2.x} ${start2.y}
            A ${innerR} ${innerR} 0 ${largeArc} 0 ${end2.x} ${end2.y}
            Z`
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full mx-auto">
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="#0D0B14"
      />

      {/* Zodiac colored segments */}
      {ZODIAC_SIGNS.map((sign, i) => {
        const startDeg = i * 30
        const endDeg = (i + 1) * 30
        const midDeg = startDeg + 15
        const symbolPos = degToCoord(midDeg, (zodiacOuterRadius + zodiacInnerRadius) / 2)

        return (
          <g key={i}>
            {/* Colored segment */}
            <path
              d={createArcPath(startDeg, endDeg, zodiacInnerRadius, zodiacOuterRadius)}
              fill={sign.color}
              opacity={0.85}
              stroke="#1a1a2e"
              strokeWidth="1"
            />
            {/* Zodiac symbol */}
            <text
              x={symbolPos.x}
              y={symbolPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="13"
              fontWeight="bold"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              {sign.symbol}
            </text>
          </g>
        )
      })}

      {/* Inner dark circle for houses */}
      <circle
        cx={center}
        cy={center}
        r={zodiacInnerRadius}
        fill="#0D0B14"
      />

      {/* House lines (from center to zodiac ring) */}
      {houses.map((cusp, i) => {
        const outer = degToCoord(cusp, zodiacInnerRadius)
        const inner = degToCoord(cusp, innerCircleRadius)
        const isAngular = i === 0 || i === 3 || i === 6 || i === 9

        return (
          <line
            key={`house-${i}`}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={isAngular ? 'rgba(180,162,112,0.6)' : 'rgba(255,255,255,0.2)'}
            strokeWidth={isAngular ? 1.5 : 1}
          />
        )
      })}

      {/* House numbers - Roman numerals */}
      {houses.map((cusp, i) => {
        const nextCusp = houses[(i + 1) % 12]
        // Calculate middle of the house sector
        let diff = nextCusp - cusp
        if (diff < 0) diff += 360 // Handle wrap-around
        const midDeg = cusp + diff / 2
        // Номер дома = i + 1, но массив romanNumerals индексируется с 0
        const pos = degToCoord(midDeg, innerCircleRadius + 25)
        const isAngular = i === 0 || i === 3 || i === 6 || i === 9
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

        return (
          <text
            key={`house-num-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={isAngular ? 'rgba(180,162,112,0.8)' : 'rgba(180,162,112,0.5)'}
            fontSize={isAngular ? '11' : '9'}
            fontWeight={isAngular ? 'bold' : 'normal'}
          >
            {romanNumerals[i]}
          </text>
        )
      })}

      {/* Inner circle */}
      <circle
        cx={center}
        cy={center}
        r={innerCircleRadius}
        fill="none"
        stroke="rgba(180,162,112,0.3)"
        strokeWidth="1"
      />

      {/* Planets */}
      {planets.map((planet) => {
        const { x, y } = degToCoord(planet.degree, planetRadius)
        const isHovered = hoveredPlanet === planet.name
        const planetSize = PLANET_SIZES[planet.name] || 12

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
            {/* Planet glow */}
            <circle
              cx={x}
              cy={y}
              r={planetSize + 4}
              fill={PLANET_COLORS[planet.name] || '#fff'}
              opacity={isHovered ? 0.3 : 0.15}
            />
            {/* Planet circle */}
            <circle
              cx={x}
              cy={y}
              r={planetSize}
              fill={PLANET_COLORS[planet.name] || '#fff'}
              stroke="#0D0B14"
              strokeWidth="1.5"
            />
          </motion.g>
        )
      })}

      {/* ASC marker - рисуется на градусе ascendant (слева на карте) */}
      <text
        x={degToCoord(ascendant, zodiacInnerRadius + 15).x - 20}
        y={degToCoord(ascendant, zodiacInnerRadius + 15).y}
        fill="#FFD700"
        fontSize="11"
        fontWeight="bold"
      >
        ASC
      </text>
    </svg>
  )
}

// Tooltip for planet
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
