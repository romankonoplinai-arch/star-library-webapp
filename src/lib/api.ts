const API_BASE = import.meta.env.VITE_API_URL || 'https://star-library-bot-production.up.railway.app/api'

// Types
export interface DailyHubResponse {
  horoscope: {
    text: string
    character: string
  }
  transits: TransitData[]
  tier: 'FREE' | 'PREMIUM' | 'VIP'
  character: {
    name: string
    emoji: string
  }
}

export interface TransitData {
  planet: string
  aspect: string
  natalPlanet: string
  energyLevel: number
  dos: string[]
  donts: string[]
  emoji: string
}

export interface Planet {
  name: string
  symbol: string
  sign: string
  degree: number
  house: number
}

export interface NatalChartApiResponse {
  has_data: boolean
  message?: string
  chart?: {
    birth_info: {
      date: string
      time: string
      place: string
      latitude: number
      longitude: number
      timezone: string
    }
    key_points: {
      sun_sign: string
      moon_sign: string
      rising_sign: string
    }
    planets: Array<{
      name: string
      longitude: number
      sign: string
      degree: number
      house: number
      formatted: string
    }>
    houses: Array<{
      number: number
      cusp_longitude: number
      sign: string
      degree: number
      formatted: string
    }>
    angles: {
      ascendant: {
        longitude: number
        sign: string
        degree: number
        formatted: string
      }
      mc: {
        longitude: number
        sign: string
        degree: number
        formatted: string
      }
    }
    aspects: Array<{
      planet1: string
      planet2: string
      aspect: string
      angle: number
      orb: number
    }>
  }
  error?: string
  subscription_tier?: string
}

// Legacy type for backwards compatibility
export interface NatalChartResponse {
  planets: Planet[]
  houses: number[]
  ascendant: number
  bigThree: {
    sun: string
    moon: string
    ascendant: string
  }
}

export interface TarotCardData {
  id: number
  name: string
  name_ru: string
  arcana: string
  suit: string | null
  reversed: boolean
  keywords: string[]
  image_url: string
}

export interface CardInSpread {
  card: TarotCardData
  position: number
  position_name: string
  position_meaning: string
}

export interface TarotDrawResponse {
  success: boolean
  spread_type: 'single' | 'three_card' | 'celtic_cross'
  question: string | null
  cards: CardInSpread[]
}

export interface TarotInterpretResponse {
  success: boolean
  interpretation: string
  character: string
}

export interface AgentResponse {
  text: string
  blocked?: boolean
  tokensUsed?: number
  character?: string
}

export interface SubscriptionResponse {
  tier: 'FREE' | 'PREMIUM' | 'VIP'
  expiresAt?: string
  starsBalance: number
}

class ApiClient {
  private initData: string = ''

  setInitData(initData: string) {
    this.initData = initData
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': this.initData,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || 'API Error')
    }

    return response.json()
  }

  // Daily Hub
  async getDailyHub(): Promise<DailyHubResponse> {
    return this.fetch<DailyHubResponse>('/daily-hub')
  }

  // Natal Chart (full API response)
  async getNatalChartFull(): Promise<NatalChartApiResponse> {
    return this.fetch<NatalChartApiResponse>('/natal-chart')
  }

  // Natal Chart (legacy)
  async getNatalChart(): Promise<NatalChartResponse> {
    return this.fetch<NatalChartResponse>('/natal-chart')
  }

  // Tarot
  async drawTarotSpread(
    spreadType: 'single' | 'three_card' | 'celtic_cross',
    question?: string
  ): Promise<TarotDrawResponse> {
    return this.fetch<TarotDrawResponse>('/tarot/draw', {
      method: 'POST',
      body: JSON.stringify({ spread_type: spreadType, question }),
    })
  }

  async interpretTarotSpread(
    cards: CardInSpread[],
    question?: string,
    character: string = 'lunara'
  ): Promise<TarotInterpretResponse> {
    return this.fetch<TarotInterpretResponse>('/tarot/interpret', {
      method: 'POST',
      body: JSON.stringify({ cards, question, character }),
    })
  }

  // Natal Chart AI Interpretation
  async interpretNatalChart(
    sunSign: string,
    moonSign: string,
    ascSign: string,
    character: string = 'lunara'
  ): Promise<{ success: boolean; interpretation: string; character: string }> {
    return this.fetch('/natal-chart/interpret', {
      method: 'POST',
      body: JSON.stringify({
        sun_sign: sunSign,
        moon_sign: moonSign,
        asc_sign: ascSign,
        character,
      }),
    })
  }

  // AI Agent
  async sendAgentMessage(message: string, character: string = 'lunara'): Promise<AgentResponse> {
    return this.fetch<AgentResponse>('/agent/chat', {
      method: 'POST',
      body: JSON.stringify({ message, character }),
    })
  }

  // Subscription
  async getSubscriptionStatus(): Promise<SubscriptionResponse> {
    return this.fetch<SubscriptionResponse>('/subscription/status')
  }

  // User data (includes birth data)
  async getUserData(): Promise<{
    success: boolean
    user: {
      telegram_id: number
      first_name: string
      subscription_tier: string
      birth_date: string | null
      birth_time: string | null
      birth_place: string | null
      birth_latitude: number | null
      birth_longitude: number | null
      birth_timezone: string | null
    }
  }> {
    return this.fetch('/user')
  }
}

export const api = new ApiClient()
