import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import {
    ItemResponse,
    PaginatedResponse,
    ProductFilters,
    ProductItem,
} from '../model/types'

class ProductApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getAllProducts(filters?: ProductFilters): Promise<ItemResponse> {
        return this.get<ItemResponse>(API_ENDPOINTS.products.getAll, {
            params: filters,
        })
    }

    async getPaginatedProducts(
        page: number = 1,
        limit: number = 20,
        filters?: ProductFilters,
    ): Promise<PaginatedResponse<ProductItem>> {
        return this.get<PaginatedResponse<ProductItem>>(
            API_ENDPOINTS.products.getAll,
            {
                params: { page, limit, ...filters },
            },
        )
    }

    async getProductById(id: string): Promise<ProductItem> {
        return this.get<ProductItem>(API_ENDPOINTS.products.getById(id))
    }
}

export const productApi = new ProductApi()
