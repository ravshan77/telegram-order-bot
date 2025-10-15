import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import type { Category } from '../model/types'

class CategoryApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getAllCategories(): Promise<Category[]> {
        return this.get<Category[]>(API_ENDPOINTS.categories.getAll)
    }

    async getCategoryById(id: number | string): Promise<Category> {
        return this.get<Category>(API_ENDPOINTS.categories.getById(id))
    }

    async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
        return this.post<Category>(API_ENDPOINTS.categories.create, data)
    }

    async updateCategory(
        id: number | string,
        data: Partial<Category>,
    ): Promise<Category> {
        return this.put<Category>(API_ENDPOINTS.categories.update(id), data)
    }

    async deleteCategory(id: number | string): Promise<void> {
        return this.delete<void>(API_ENDPOINTS.categories.delete(id))
    }
}

export const categoryApi = new CategoryApi()
