import { create } from 'zustand'

interface HeaderSearchStore {
    searchItemName: string
    setSearchItemName: (text: string) => void
}

export const useHeaderSearchStore = create<HeaderSearchStore>((set) => ({
    searchItemName: '',
    setSearchItemName: (text) => set({ searchItemName: text }),
}))

export default useHeaderSearchStore
