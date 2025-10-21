import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { PaymentFilters } from '@/entities/payment'
import { PayOut } from '../model/types'
import { payoutApi } from './payoutApi'

export const PAYOUT_KEYS = {
    all: ['payouts'] as const,
    lists: () => [...PAYOUT_KEYS.all, 'list'] as const,
    list: (filters?: PaymentFilters) =>
        [...PAYOUT_KEYS.lists(), filters] as const,
    details: () => [...PAYOUT_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...PAYOUT_KEYS.details(), id] as const,
}

export const usePayouts = (
    filters?: PaymentFilters,
    options?: Omit<UseQueryOptions<PayOut[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<PayOut[], Error>({
        queryKey: PAYOUT_KEYS.list(filters),
        queryFn: () => payoutApi.getPayouts(filters),
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

export const usePayout = (
    id: string,
    options?: Omit<UseQueryOptions<PayOut, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<PayOut, Error>({
        queryKey: PAYOUT_KEYS.detail(id),
        queryFn: () => payoutApi.getPayoutById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}
