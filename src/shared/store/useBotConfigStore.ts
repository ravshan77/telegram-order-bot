import { create } from 'zustand'
import { BotConfigurations } from '@/entities/botConfiguration'

interface BotConfigsStore {
    botConfigs: BotConfigurations | null
    setBotConfigs: (conf: BotConfigurations) => void
}

export const useBotConfigStore = create<BotConfigsStore>((set) => ({
    botConfigs: null,
    setBotConfigs: (conf) => set({ botConfigs: conf }),
}))

export default useBotConfigStore
