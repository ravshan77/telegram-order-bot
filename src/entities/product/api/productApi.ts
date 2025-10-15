import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import type { Product } from '../model/types'

export interface ProductFilters {
    search?: string
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    available?: boolean
    is_favorite?: boolean
    warehouse_id?: string
    branch_id?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    hasMore?: boolean
}

class ProductApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    // Get all products with filters
    async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
        return this.get<Product[]>(API_ENDPOINTS.products.getAll, {
            params: filters,
        })
    }

    // Get paginated products
    async getPaginatedProducts(
        page: number = 1,
        limit: number = 20,
        filters?: ProductFilters,
    ): Promise<PaginatedResponse<Product>> {
        return this.get<PaginatedResponse<Product>>(
            API_ENDPOINTS.products.getAll,
            {
                params: { page, limit, ...filters },
            },
        )
    }

    // Get product by ID
    async getProductById(id: string): Promise<Product> {
        return this.get<Product>(API_ENDPOINTS.products.getById(id))
    }

    // Search products
    async searchProducts(query: string): Promise<Product[]> {
        return this.get<Product[]>(API_ENDPOINTS.products.search, {
            params: { q: query },
        })
    }

    // Get products by category
    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        return this.get<Product[]>(API_ENDPOINTS.products.byCategory, {
            params: { categoryId },
        })
    }

    // Toggle favorite
    async toggleFavorite(id: string): Promise<Product> {
        return this.post<Product>(
            `${API_ENDPOINTS.products.getById(id)}/favorite`,
        )
    }

    // Get favorite products
    async getFavoriteProducts(): Promise<Product[]> {
        return this.get<Product[]>(API_ENDPOINTS.products.getAll, {
            params: { is_favorite: true },
        })
    }

    // Create product (admin)
    async createProduct(data: Partial<Product>): Promise<Product> {
        return this.post<Product>(API_ENDPOINTS.products.create, data)
    }

    // Update product (admin)
    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        return this.put<Product>(API_ENDPOINTS.products.update(id), data)
    }

    // Delete product (admin)
    async deleteProduct(id: string): Promise<void> {
        return this.delete<void>(API_ENDPOINTS.products.delete(id))
    }
}

export const productApi = new ProductApi()
