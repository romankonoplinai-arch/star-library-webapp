import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'

// Animated star background with tsParticles
export function StarsBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine) // Загружаем slim версию
    }).then(() => {
      setInit(true)
    })
  }, [])

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: 'transparent', // Прозрачный фон
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab', // При наведении звёзды "притягиваются"
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.3,
            },
          },
        },
      },
      particles: {
        color: {
          value: ['#ffd700', '#ffffff', '#7c3aed'], // Золотой, белый, фиолетовый
        },
        links: {
          color: '#7c3aed', // Фиолетовые линии между звёздами
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: true, // Случайное движение
          speed: 0.5, // Медленная скорость
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80, // Количество звёзд
        },
        opacity: {
          value: { min: 0.1, max: 0.8 }, // Мерцание
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: 'circle', // Круглые звёзды
        },
        size: {
          value: { min: 1, max: 3 }, // Разный размер
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
      },
      detectRetina: true, // Поддержка retina экранов
    }),
    []
  )

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="fixed inset-0 -z-10" // Позади всего контента
    />
  )
}
