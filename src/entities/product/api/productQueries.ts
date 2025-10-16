import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from '@tanstack/react-query'
import {
    productApi,
    type ProductFilters,
    type PaginatedResponse,
} from './productApi'
import type { BaseProducts, Product } from '../model/types'

// Query Keys
export const PRODUCT_KEYS = {
    all: ['products'] as const,
    lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
    list: (filters?: ProductFilters) =>
        [...PRODUCT_KEYS.lists(), filters] as const,
    details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
    search: (query: string) => [...PRODUCT_KEYS.all, 'search', query] as const,
    byCategory: (categoryId: string) =>
        [...PRODUCT_KEYS.all, 'category', categoryId] as const,
    favorites: () => [...PRODUCT_KEYS.all, 'favorites'] as const,
    infinite: (filters?: ProductFilters) =>
        [...PRODUCT_KEYS.lists(), 'infinite', filters] as const,
}

// ============ QUERIES ============

export const useProducts = (
    filters?: ProductFilters,
    options?: Omit<
        UseQueryOptions<BaseProducts, Error>,
        'queryKey' | 'queryFn'
    >,
) => {
    return useQuery<BaseProducts, Error>({
        queryKey: PRODUCT_KEYS.list(filters),
        queryFn: () => {
            return productApi.getAllProducts(filters)
        },
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

export const useProduct = (
    id: string,
    options?: Omit<UseQueryOptions<Product, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Product, Error>({
        queryKey: PRODUCT_KEYS.detail(id),
        queryFn: () => productApi.getProductById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

export const useSearchProducts = (
    query: string,
    options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Product[], Error>({
        queryKey: PRODUCT_KEYS.search(query),
        queryFn: () => productApi.searchProducts(query),
        enabled: query.length > 2,
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

export const useProductsByCategory = (
    categoryId: string,
    options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Product[], Error>({
        queryKey: PRODUCT_KEYS.byCategory(categoryId),
        queryFn: () => productApi.getProductsByCategory(categoryId),
        enabled: !!categoryId,
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

export const useFavoriteProducts = (
    options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Product[], Error>({
        queryKey: PRODUCT_KEYS.favorites(),
        queryFn: () => productApi.getFavoriteProducts(),
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

export const useInfiniteProducts = (
    filters?: ProductFilters,
    limit: number = 20,
) => {
    return useInfiniteQuery({
        queryKey: PRODUCT_KEYS.infinite(filters),
        queryFn: ({ pageParam = 1 }) =>
            productApi.getPaginatedProducts(
                pageParam as number,
                limit,
                filters,
            ),
        getNextPageParam: (lastPage: PaginatedResponse<Product>) => {
            if (lastPage.hasMore) {
                return lastPage.page + 1
            }
            return undefined
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
    })
}
