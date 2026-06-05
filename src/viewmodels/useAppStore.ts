import { create } from 'zustand'

export type AppLanguage = 'en' | 'sw'
export type LocationSource = 'geo' | 'manual' | null

interface AppStore {
  lat: number | null
  lon: number | null
  city: string
  region: string
  country: string
  countryCode: string
  lang: AppLanguage
  units: 'metric' | 'imperial'
  locationSource: LocationSource
  setLocation: (
    lat: number,
    lon: number,
    city: string,
    region: string,
    country?: string,
    countryCode?: string,
    source?: 'geo' | 'manual',
  ) => void
  setLang: (lang: AppLanguage) => void
  setUnits: (units: 'metric' | 'imperial') => void
}

export const useAppStore = create<AppStore>((set) => ({
  lat: null,
  lon: null,
  city: '',
  region: '',
  country: '',
  countryCode: '',
  lang: 'en',
  units: 'metric',
  locationSource: null,
  setLocation: (lat, lon, city, region, country = '', countryCode = '', source = 'geo') =>
    set({
      lat,
      lon,
      city,
      region,
      country,
      countryCode,
      locationSource: source,
    }),
  setLang: (lang) => set({ lang }),
  setUnits: (units) => set({ units }),
}))
