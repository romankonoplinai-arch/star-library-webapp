import { create } from 'zustand'

export type SubscriptionTier = 'free' | 'vip'

interface UserState {
  telegramId: number | null
  firstName: string
  isPremiumTelegram: boolean
  subscriptionTier: SubscriptionTier
  birthDate: string | null
  birthPlace: string | null
  birthTime: string | null
  zodiacSign: string | null
  defaultCharacter: string
  totalHoroscopes: number
  totalActiveDays: number
  starDust: number
  natalChartLevel: number
  isLoading: boolean
  isLoaded: boolean

  // Actions
  setUser: (telegramId: number, firstName: string, isPremium: boolean) => void
  setSubscription: (tier: SubscriptionTier) => void
  setBirthData: (date: string, place: string, time: string | null) => void
  setCharacter: (character: string) => void
  setLoading: (loading: boolean) => void
  syncFromApi: (data: ApiUserData) => void
  setNatalChartUpgrade: (newLevel: number, newStarDust: number) => void
  isPremium: () => boolean
  isVip: () => boolean
}

interface ApiUserData {
  telegram_id: number
  first_name: string
  subscription_tier: string
  birth_date?: string | null
  birth_place?: string | null
  birth_time?: string | null
  birth_latitude?: number | null
  birth_longitude?: number | null
  birth_timezone?: string | null
  zodiac_sign?: string | null
  default_character?: string
  total_horoscopes?: number
  total_active_days?: number
  star_dust?: number
  natal_chart_level?: number
}

export const useUserStore = create<UserState>((set, get) => ({
  telegramId: null,
  firstName: '',
  isPremiumTelegram: false,
  subscriptionTier: 'free',
  birthDate: null,
  birthPlace: null,
  birthTime: null,
  zodiacSign: null,
  defaultCharacter: 'lunara',
  totalHoroscopes: 0,
  totalActiveDays: 0,
  starDust: 0,
  natalChartLevel: 1,
  isLoading: false,
  isLoaded: false,

  setUser: (telegramId, firstName, isPremium) =>
    set({ telegramId, firstName, isPremiumTelegram: isPremium }),

  setSubscription: (tier) => set({ subscriptionTier: tier }),

  setBirthData: (date, place, time) =>
    set({ birthDate: date, birthPlace: place, birthTime: time }),

  setCharacter: (character) => set({ defaultCharacter: character }),

  setLoading: (loading) => set({ isLoading: loading }),

  syncFromApi: (data) =>
    set({
      telegramId: data.telegram_id,
      firstName: data.first_name,
      subscriptionTier: data.subscription_tier as SubscriptionTier,
      birthDate: data.birth_date || null,
      birthPlace: data.birth_place || null,
      birthTime: data.birth_time || null,
      zodiacSign: data.zodiac_sign || null,
      defaultCharacter: data.default_character || 'lunara',
      totalHoroscopes: data.total_horoscopes || 0,
      totalActiveDays: data.total_active_days || 0,
      starDust: data.star_dust || 0,
      natalChartLevel: data.natal_chart_level || 1,
      isLoading: false,
      isLoaded: true,
    }),

  setNatalChartUpgrade: (newLevel, newStarDust) =>
    set({ natalChartLevel: newLevel, starDust: newStarDust }),

  isPremium: () => {
    return get().subscriptionTier === 'vip'
  },

  isVip: () => get().subscriptionTier === 'vip',
}))
