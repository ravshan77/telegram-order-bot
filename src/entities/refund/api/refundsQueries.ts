import {
    useQuery,
    useMutation,
    type UseQueryOptions,
} from '@tanstack/react-query'
import { refundsApi } from './refundsApi'
import { Sale, SalesFilters } from '@/entities/sales'

export const REFUNDS_KEYS = {
    all: ['refunds'] as const,
    lists: () => [...REFUNDS_KEYS.all, 'list'] as const,
    list: (filters?: SalesFilters) =>
        [...REFUNDS_KEYS.lists(), filters] as const,
    details: () => [...REFUNDS_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...REFUNDS_KEYS.details(), id] as const,
}

export const useRefunds = (
    filters?: SalesFilters,
    options?: Omit<UseQueryOptions<Sale[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Sale[], Error>({
        queryKey: REFUNDS_KEYS.list(filters),
        queryFn: () => refundsApi.getRefunds(filters),
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

export const useRefund = (
    id: string,
    options?: Omit<UseQueryOptions<Sale, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Sale, Error>({
        queryKey: REFUNDS_KEYS.detail(id),
        queryFn: () => refundsApi.getRefundById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

export const useDownloadRefundExcel = () => {
    return useMutation<Blob, Error, string>({
        mutationFn: (id: string) => refundsApi.downloadRefundExcel(id),
    })
}
