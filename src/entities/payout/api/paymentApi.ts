import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import type { Payment, PaymentFilters } from '../model/types'

class PaymentApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getPayments(filters?: PaymentFilters): Promise<Payment[]> {
        return this.get<Payment[]>(API_ENDPOINTS.payments.getAll, {
            params: filters,
        })
    }

    async getPaymentById(id: string): Promise<Payment> {
        return this.get<Payment>(API_ENDPOINTS.payments.getById(id))
    }
}

export const paymentApi = new PaymentApi()
