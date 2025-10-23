import { categoryApi } from './categoryApi'
import type { CategoryResponse, CategoriesResponse } from '../model/types'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

// ============ QUERY KEYS ============

export const CATEGORY_KEYS = {
    all: ['categories'] as const,
    lists: () => [...CATEGORY_KEYS.all, 'list'] as const,
    details: () => [...CATEGORY_KEYS.all, 'detail'] as const,
    detail: (id: number | string) => [...CATEGORY_KEYS.details(), id] as const,
}

// ============ QUERIES ============

export const useCategories = (
    options?: Omit<
        UseQueryOptions<CategoriesResponse, Error>,
        'queryKey' | 'queryFn'
    >,
) => {
    return useQuery<CategoriesResponse, Error>({
        queryKey: CATEGORY_KEYS.lists(),
        queryFn: () => categoryApi.getAllCategories(),
        staleTime: 10 * 60 * 1000, // 10 minutes (categories rarely change)
        ...options,
    })
}

export const useCategory = (
    id: string,
    options?: Omit<
        UseQueryOptions<CategoryResponse, Error>,
        'queryKey' | 'queryFn'
    >,
) => {
    return useQuery<CategoryResponse, Error>({
        queryKey: CATEGORY_KEYS.detail(id),
        queryFn: () => categoryApi.getCategoryById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        ...options,
    })
}
