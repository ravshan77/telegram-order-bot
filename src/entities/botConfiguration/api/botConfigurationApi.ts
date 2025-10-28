import { BotConfigurations } from '../model/types'
import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'

class BotConfigurationsApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getBotConfigurations(): Promise<BotConfigurations> {
        console.log(
            this.get<BotConfigurations>(API_ENDPOINTS.botConfigs.getAll),
        )

        return this.get<BotConfigurations>(API_ENDPOINTS.botConfigs.getAll)
    }
}

export const botConfigurationsApi = new BotConfigurationsApi()
