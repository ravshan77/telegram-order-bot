import { create } from 'zustand'
import { BotConfigurations, Me } from '@/entities/botConfiguration'

interface BotConfigsStore {
    botConfigs: BotConfigurations | null
    me: Me | null
    setBotConfigs: (conf: BotConfigurations) => void
    setBotMe: (conf: Me) => void
}

export const useBotConfigStore = create<BotConfigsStore>((set) => ({
    botConfigs: null,
    me: null,
    setBotConfigs: (conf) => set({ botConfigs: conf }),
    setBotMe: (conf) => set({ me: conf }),
}))

export default useBotConfigStore
