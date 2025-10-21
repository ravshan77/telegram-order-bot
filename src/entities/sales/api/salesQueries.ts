import {
    useQuery,
    useMutation,
    type UseQueryOptions,
} from '@tanstack/react-query'
import { salesApi } from './salesApi'
import type { Sale, SalesFilters } from '../model/types'

export const SALES_KEYS = {
    all: ['sales'] as const,
    lists: () => [...SALES_KEYS.all, 'list'] as const,
    list: (filters?: SalesFilters) => [...SALES_KEYS.lists(), filters] as const,
    details: () => [...SALES_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...SALES_KEYS.details(), id] as const,
}

export const useSales = (
    filters?: SalesFilters,
    options?: Omit<UseQueryOptions<Sale[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Sale[], Error>({
        queryKey: SALES_KEYS.list(filters),
        queryFn: () => salesApi.getSales(filters),
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

export const useSale = (
    id: string,
    options?: Omit<UseQueryOptions<Sale, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Sale, Error>({
        queryKey: SALES_KEYS.detail(id),
        queryFn: () => salesApi.getSaleById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

export const useDownloadSaleExcel = () => {
    return useMutation<Blob, Error, string>({
        mutationFn: (id: string) => salesApi.downloadSaleExcel(id),
    })
}
