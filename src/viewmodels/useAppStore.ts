import { create } from 'zustand'

export type AppLanguage = 'en' | 'sw'
export type ActiveView = 'dashboard' | 'farm'

interface AppState {
  selectedLocation: string | null
  language: AppLanguage
  activeView: ActiveView
  setSelectedLocation: (location: string | null) => void
  setLanguage: (language: AppLanguage) => void
  setActiveView: (view: ActiveView) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedLocation: null,
  language: 'en',
  activeView: 'dashboard',
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setLanguage: (language) => set({ language }),
  setActiveView: (activeView) => set({ activeView }),
}))
