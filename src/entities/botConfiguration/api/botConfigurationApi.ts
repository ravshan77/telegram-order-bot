import { BotConfigurations, Me } from '../model/types'
import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'

class BotConfigurationsApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getBotConfigurations(): Promise<BotConfigurations> {
        return this.get<BotConfigurations>(
            API_ENDPOINTS.botConfigs.getBotConfig,
        )
    }

    async getMe(): Promise<Me> {
        return this.get<Me>(API_ENDPOINTS.botConfigs.getMe)
    }
}

export const botConfigurationsApi = new BotConfigurationsApi()
