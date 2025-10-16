import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import type {
    CategoriesResponse,
    Category,
    CategoryResponse,
} from '../model/types'

class CategoryApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getAllCategories(): Promise<CategoriesResponse> {
        return this.get<CategoriesResponse>(API_ENDPOINTS.categories.getAll)
    }

    async getCategoryById(id: string): Promise<CategoryResponse> {
        return this.get<CategoryResponse>(API_ENDPOINTS.categories.getById(id))
    }
}

export const categoryApi = new CategoryApi()
