import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, MagicButton } from '@/components/ui'
import { useHaptic, useShare } from '@/hooks'
import { useUserStore } from '@/stores'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'

interface FriendData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
}

const ZODIAC_DATES = [
  { sign: 'aries', name: 'Овен', start: '03-21', end: '04-19', emoji: '♈' },
  { sign: 'taurus', name: 'Телец', start: '04-20', end: '05-20', emoji: '♉' },
  { sign: 'gemini', name: 'Близнецы', start: '05-21', end: '06-20', emoji: '♊' },
  { sign: 'cancer', name: 'Рак', start: '06-21', end: '07-22', emoji: '♋' },
  { sign: 'leo', name: 'Лев', start: '07-23', end: '08-22', emoji: '♌' },
  { sign: 'virgo', name: 'Дева', start: '08-23', end: '09-22', emoji: '♍' },
  { sign: 'libra', name: 'Весы', start: '09-23', end: '10-22', emoji: '♎' },
  { sign: 'scorpio', name: 'Скорпион', start: '10-23', end: '11-21', emoji: '♏' },
  { sign: 'sagittarius', name: 'Стрелец', start: '11-22', end: '12-21', emoji: '♐' },
  { sign: 'capricorn', name: 'Козерог', start: '12-22', end: '01-19', emoji: '♑' },
  { sign: 'aquarius', name: 'Водолей', start: '01-20', end: '02-18', emoji: '♒' },
  { sign: 'pisces', name: 'Рыбы', start: '02-19', end: '03-20', emoji: '♓' },
]

function getZodiacSign(dateStr: string) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const mmdd = `${month}-${day}`

  for (const z of ZODIAC_DATES) {
    if (z.sign === 'capricorn') {
      if (mmdd >= '12-22' || mmdd <= '01-19') return z
    } else if (mmdd >= z.start && mmdd <= z.end) {
      return z
    }
  }
  return ZODIAC_DATES[0]
}

export function FriendChartPage() {
  const haptic = useHaptic()
  const { share } = useShare()
  const firstName = useUserStore((s) => s.firstName)

  const [step, setStep] = useState<'input' | 'result'>('input')
  const [friendData, setFriendData] = useState<FriendData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  })
  const [result, setResult] = useState<any>(null)

  const handleCalculate = () => {
    haptic.medium()

    const zodiac = getZodiacSign(friendData.birthDate)
    if (!zodiac) return

    // Generate simple natal insight
    const insights = [
      `${zodiac.emoji} **${friendData.name}** — ${zodiac.name}`,
      '',
      '🌟 **Ключевые качества:**',
      getQualitiesForSign(zodiac.sign),
      '',
      '💫 **Совет на период:**',
      getAdviceForSign(zodiac.sign),
    ]

    setResult({
      name: friendData.name,
      zodiac,
      text: insights.join('\n'),
    })
    setStep('result')
  }

  const handleShare = () => {
    haptic.success()
    const botUsername = 'Star_library_robot'
    const deepLink = `https://t.me/${botUsername}?start=friend_${encodeURIComponent(friendData.name)}`

    share(
      `✨ ${firstName} рассчитал(а) натальную карту для ${friendData.name}!\n\n${result.zodiac.emoji} ${result.zodiac.name}\n\nУзнай свою судьбу в Звёздной Библиотеке:`,
      deepLink
    )
  }

  const handleNewCalculation = () => {
    haptic.light()
    setStep('input')
    setFriendData({ name: '', birthDate: '', birthTime: '', birthPlace: '' })
    setResult(null)
  }

  if (step === 'result' && result) {
    return (
      <div className="min-h-screen px-4 py-6 pb-24">
        <motion.header
          className="mb-6 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-2xl font-display font-bold text-gradient">
            Расчёт готов!
          </h1>
          <p className="text-muted-gray">
            Натальная карта для {result.name}
          </p>
        </motion.header>

        <motion.main
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <GlassCard glow>
              <div className="text-center mb-4">
                <span className="text-6xl">{result.zodiac.emoji}</span>
                <h2 className="text-2xl font-bold mt-2">{result.zodiac.name}</h2>
                <p className="text-muted-gray">{result.name}</p>
              </div>

              <div className="text-soft-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                {result.text.split('\n').map((line: string, i: number) => (
                  <p key={i} className={line.startsWith('**') ? 'font-semibold mt-3' : ''}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-3">
            <MagicButton onClick={handleShare} className="w-full">
              📤 Поделиться с {result.name}
            </MagicButton>

            <button
              onClick={handleNewCalculation}
              className="w-full py-3 text-mystical-gold hover:text-mystical-gold/80 transition-colors"
            >
              Рассчитать для другого друга →
            </button>
          </motion.div>
        </motion.main>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <motion.header
        className="mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-2xl font-display font-bold text-gradient">
          Расчёт для друга
        </h1>
        <p className="text-muted-gray">
          Узнай судьбу близкого человека
        </p>
      </motion.header>

      <motion.main
        className="space-y-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerItem}>
          <GlassCard>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-gray mb-1">Имя друга</label>
                <input
                  type="text"
                  value={friendData.name}
                  onChange={(e) => setFriendData({ ...friendData, name: e.target.value })}
                  placeholder="Как зовут?"
                  className="w-full bg-cosmic-void/50 border border-accent-purple/30 rounded-lg px-4 py-3 text-soft-white placeholder:text-muted-gray/50 focus:outline-none focus:border-mystical-gold/50"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-gray mb-1">Дата рождения</label>
                <input
                  type="date"
                  value={friendData.birthDate}
                  onChange={(e) => setFriendData({ ...friendData, birthDate: e.target.value })}
                  className="w-full bg-cosmic-void/50 border border-accent-purple/30 rounded-lg px-4 py-3 text-soft-white focus:outline-none focus:border-mystical-gold/50"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-gray mb-1">Время рождения (если знаешь)</label>
                <input
                  type="time"
                  value={friendData.birthTime}
                  onChange={(e) => setFriendData({ ...friendData, birthTime: e.target.value })}
                  className="w-full bg-cosmic-void/50 border border-accent-purple/30 rounded-lg px-4 py-3 text-soft-white focus:outline-none focus:border-mystical-gold/50"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-gray mb-1">Место рождения</label>
                <input
                  type="text"
                  value={friendData.birthPlace}
                  onChange={(e) => setFriendData({ ...friendData, birthPlace: e.target.value })}
                  placeholder="Город"
                  className="w-full bg-cosmic-void/50 border border-accent-purple/30 rounded-lg px-4 py-3 text-soft-white placeholder:text-muted-gray/50 focus:outline-none focus:border-mystical-gold/50"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <MagicButton
            onClick={handleCalculate}
            disabled={!friendData.name || !friendData.birthDate}
            className="w-full"
          >
            ✨ Рассчитать карту
          </MagicButton>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard>
            <div className="text-center py-2">
              <p className="text-muted-gray text-sm">
                🎁 Отправь другу его личный расчёт и получи бонус!
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.main>
    </div>
  )
}

function getQualitiesForSign(sign: string): string {
  const qualities: Record<string, string> = {
    aries: '• Лидерство и смелость\n• Энергичность\n• Прямолинейность',
    taurus: '• Надёжность и стабильность\n• Терпение\n• Практичность',
    gemini: '• Коммуникабельность\n• Любознательность\n• Адаптивность',
    cancer: '• Заботливость\n• Интуиция\n• Эмоциональная глубина',
    leo: '• Харизма и творчество\n• Щедрость\n• Уверенность',
    virgo: '• Аналитический ум\n• Внимание к деталям\n• Помощь другим',
    libra: '• Дипломатичность\n• Чувство гармонии\n• Справедливость',
    scorpio: '• Глубина и страстность\n• Проницательность\n• Трансформация',
    sagittarius: '• Оптимизм и свобода\n• Философский склад\n• Приключения',
    capricorn: '• Амбициозность\n• Дисциплина\n• Ответственность',
    aquarius: '• Оригинальность\n• Независимость\n• Гуманизм',
    pisces: '• Эмпатия и творчество\n• Интуиция\n• Духовность',
  }
  return qualities[sign] || '• Уникальные качества'
}

function getAdviceForSign(sign: string): string {
  const advice: Record<string, string> = {
    aries: 'Направь свою энергию на созидание. Не торопись с важными решениями.',
    taurus: 'Доверься переменам — они принесут новые возможности.',
    gemini: 'Сфокусируйся на главном. Общение принесёт важные открытия.',
    cancer: 'Прислушайся к интуиции. Время для семьи и близких.',
    leo: 'Твоё творчество на подъёме. Делись светом с другими.',
    virgo: 'Не требуй от себя совершенства. Забота о здоровье важна.',
    libra: 'Найди баланс между собой и другими. Гармония — твой ключ.',
    scorpio: 'Время трансформации. Отпусти старое, впусти новое.',
    sagittarius: 'Расширяй горизонты. Путешествия и обучение благоприятны.',
    capricorn: 'Твои усилия скоро принесут плоды. Не сдавайся.',
    aquarius: 'Твои идеи опережают время. Найди единомышленников.',
    pisces: 'Творчество и духовные практики наполнят силой.',
  }
  return advice[sign] || 'Следуй за своей звездой.'
}
