import { useState, useRef, useCallback } from 'react'
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

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700',
  Moon: '#C0C0C0',
  Mercury: '#87CEEB',
  Venus: '#FF69B4',
  Mars: '#FF4500',
  Jupiter: '#FFA500',
  Saturn: '#8B4513',
  Uranus: '#00CED1',
  Neptune: '#4169E1',
  Pluto: '#800080',
}

export function NatalChartSVG({
  planets,
  houses,
  ascendant,
  onPlanetClick,
}: NatalChartSVGProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)

  // Zoom/Pan state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const lastTouchDist = useRef(0)

  // Helper: get distance between two touches
  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(z => Math.min(Math.max(z * delta, 0.5), 3))
  }, [])

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return // Left click only
    setIsDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastTouchDist.current = getTouchDistance(e.touches)
    } else if (e.touches.length === 1) {
      setIsDragging(true)
      dragStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y }
    }
  }, [pan])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      const dist = getTouchDistance(e.touches)
      if (lastTouchDist.current > 0) {
        const scale = dist / lastTouchDist.current
        setZoom(z => Math.min(Math.max(z * scale, 0.5), 3))
      }
      lastTouchDist.current = dist
    } else if (e.touches.length === 1 && isDragging) {
      // Pan
      setPan({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y })
    }
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    lastTouchDist.current = 0
  }, [])

  // Double click/tap to reset
  const handleDoubleClick = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const isZoomed = zoom !== 1 || pan.x !== 0 || pan.y !== 0

  const size = 320
  const center = size / 2
  const outerRadius = size / 2 - 10
  const zodiacRadius = outerRadius - 25
  const houseRadius = zodiacRadius - 30
  const planetRadius = houseRadius - 25

  // Конвертация градусов в координаты
  const degToCoord = (deg: number, radius: number) => {
    const adjustedDeg = 180 - deg + ascendant
    const rad = (adjustedDeg * Math.PI) / 180
    return {
      x: center + radius * Math.cos(rad),
      y: center - radius * Math.sin(rad),
    }
  }

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      {/* Reset button */}
      {isZoomed && (
        <button
          onClick={handleDoubleClick}
          className="absolute top-2 right-2 z-10 px-2 py-1 text-xs bg-cosmic-black/80 border border-mystical-gold/30 rounded text-mystical-gold hover:bg-cosmic-black"
        >
          Сброс
        </button>
      )}

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full touch-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        {/* Градиент фона */}
        <defs>
          <radialGradient id="cosmicGradient">
            <stop offset="0%" stopColor="#1a1033" />
            <stop offset="100%" stopColor="#0A0812" />
          </radialGradient>
        </defs>

        {/* Transform group for zoom/pan */}
        <g transform={`translate(${center + pan.x}, ${center + pan.y}) scale(${zoom}) translate(${-center}, ${-center})`}>
          {/* Фон */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="url(#cosmicGradient)"
            stroke="rgba(180,162,112,0.3)"
            strokeWidth="1"
          />

      {/* Зодиакальный круг (12 секторов) */}
      {ZODIAC_SIGNS.map((sign, i) => {
        const startDeg = i * 30
        const midDeg = startDeg + 15
        const { x, y } = degToCoord(midDeg, zodiacRadius)

        return (
          <g key={sign}>
            {/* Разделительная линия */}
            <line
              x1={center}
              y1={center}
              x2={degToCoord(startDeg, outerRadius).x}
              y2={degToCoord(startDeg, outerRadius).y}
              stroke="rgba(180,162,112,0.2)"
              strokeWidth="1"
            />
            {/* Символ знака */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#B4A270"
              fontSize="14"
            >
              {sign}
            </text>
          </g>
        )
      })}

      {/* Дома (линии от центра) */}
      {houses.map((cusp, i) => {
        const { x, y } = degToCoord(cusp, houseRadius)
        return (
          <line
            key={`house-${i}`}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        )
      })}

      {/* Внутренний круг */}
      <circle
        cx={center}
        cy={center}
        r={planetRadius - 15}
        fill="none"
        stroke="rgba(180,162,112,0.2)"
        strokeWidth="1"
      />

      {/* Планеты */}
      {planets.map((planet) => {
        const { x, y } = degToCoord(planet.degree, planetRadius)
        const isHovered = hoveredPlanet === planet.name

        return (
          <motion.g
            key={planet.name}
            onClick={() => onPlanetClick?.(planet)}
            onMouseEnter={() => setHoveredPlanet(planet.name)}
            onMouseLeave={() => setHoveredPlanet(null)}
            style={{ cursor: 'pointer' }}
            animate={{ scale: isHovered ? 1.3 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <circle
              cx={x}
              cy={y}
              r={isHovered ? 14 : 10}
              fill={PLANET_COLORS[planet.name] || '#fff'}
              opacity={isHovered ? 1 : 0.8}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#0A0812"
              fontSize="10"
              fontWeight="bold"
            >
              {planet.symbol}
            </text>
          </motion.g>
        )
      })}

          {/* Асцендент маркер */}
          <text
            x={degToCoord(0, outerRadius - 5).x - 15}
            y={degToCoord(0, outerRadius - 5).y}
            fill="#FFD700"
            fontSize="10"
            fontWeight="bold"
          >
            ASC
          </text>
        </g>
      </svg>
    </div>
  )
}

// Tooltip для планеты
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
