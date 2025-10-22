import { Sale, SalesFilters } from '@/entities/sales'
import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'

class RefundsApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getRefunds(filters?: SalesFilters): Promise<Sale[]> {
        return this.get<Sale[]>(API_ENDPOINTS.refunds.getAll, {
            params: filters,
        })
    }

    async getRefundById(id: string): Promise<Sale> {
        return this.get<Sale>(API_ENDPOINTS.refunds.getById(id))
    }

    async downloadRefundExcel(id: string): Promise<Blob> {
        return this.download(API_ENDPOINTS.refunds.downloadExcel(id))
    }
}

export const refundsApi = new RefundsApi()
