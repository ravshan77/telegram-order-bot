import { PaymentFilters } from '@/entities/payment'
import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import { PayOut } from '../model/types'

class PayoutApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getPayouts(filters?: PaymentFilters): Promise<PayOut[]> {
        return this.get<PayOut[]>(API_ENDPOINTS.payouts.getAll, {
            params: filters,
        })
    }

    async getPayoutById(id: string): Promise<PayOut> {
        return this.get<PayOut>(API_ENDPOINTS.payouts.getById(id))
    }
}

export const payoutApi = new PayoutApi()
