import { themeConfig } from '@/app/config/theme.config'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, LayoutType, Direction } from '@/@types/theme'

type ThemeState = Theme

type ThemeAction = {
    setSchema: (payload: string) => void
    setMode: (payload: ThemeState['mode']) => void
    setSideNavCollapse: (payload: boolean) => void
    setDirection: (payload: Direction) => void
    setPanelExpand: (payload: boolean) => void
    setLayout: (payload: LayoutType) => void
    setPreviousLayout: (payload: LayoutType | '') => void
}

const initialThemeState = themeConfig

export const useThemeStore = create<ThemeState & ThemeAction>()(
    persist(
        (set) => ({
            ...initialThemeState,
            setSchema: (payload) => set(() => ({ themeSchema: payload })),
            setMode: (payload) => set(() => ({ mode: payload })),
            setSideNavCollapse: (payload) =>
                set((state) => ({
                    layout: { ...state.layout, sideNavCollapse: payload },
                })),
            setDirection: (payload) => set(() => ({ direction: payload })),
            setPanelExpand: (payload) => set(() => ({ panelExpand: payload })),
            setLayout: (payload) =>
                set((state) => ({
                    layout: { ...state.layout, type: payload },
                })),
            setPreviousLayout: (payload) =>
                set((state) => ({
                    layout: { ...state.layout, previousType: payload },
                })),
        }),
        {
            name: 'theme',
        },
    ),
)
