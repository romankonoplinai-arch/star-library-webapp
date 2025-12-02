import { create } from 'zustand'

export type SubscriptionTier = 'free' | 'premium' | 'vip'

interface UserState {
  telegramId: number | null
  firstName: string
  isPremiumTelegram: boolean
  subscriptionTier: SubscriptionTier
  birthDate: string | null
  birthPlace: string | null
  birthTime: string | null
  defaultCharacter: string
  isLoading: boolean
  isLoaded: boolean

  // Actions
  setUser: (telegramId: number, firstName: string, isPremium: boolean) => void
  setSubscription: (tier: SubscriptionTier) => void
  setBirthData: (date: string, place: string, time: string | null) => void
  setCharacter: (character: string) => void
  setLoading: (loading: boolean) => void
  syncFromApi: (data: ApiUserData) => void
  isPremium: () => boolean
  isVip: () => boolean
}

interface ApiUserData {
  telegram_id: number
  first_name: string
  subscription_tier: string
  birth_date?: string
  birth_place?: string
  birth_time?: string
  default_character?: string
}

export const useUserStore = create<UserState>((set, get) => ({
  telegramId: null,
  firstName: '',
  isPremiumTelegram: false,
  subscriptionTier: 'free',
  birthDate: null,
  birthPlace: null,
  birthTime: null,
  defaultCharacter: 'lunara',
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
      defaultCharacter: data.default_character || 'lunara',
      isLoading: false,
      isLoaded: true,
    }),

  isPremium: () => {
    const tier = get().subscriptionTier
    return tier === 'premium' || tier === 'vip'
  },

  isVip: () => get().subscriptionTier === 'vip',
}))
