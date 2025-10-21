import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import type { Sale, SalesFilters } from '../model/types'

class SalesApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getSales(filters?: SalesFilters): Promise<Sale[]> {
        return this.get<Sale[]>(API_ENDPOINTS.sales.getAll, {
            params: filters,
        })
    }

    async getSaleById(id: string): Promise<Sale> {
        return this.get<Sale>(API_ENDPOINTS.sales.getById(id))
    }

    async downloadSaleExcel(id: string): Promise<Blob> {
        return this.download(API_ENDPOINTS.sales.downloadExcel(id))
    }
}

export const salesApi = new SalesApi()
