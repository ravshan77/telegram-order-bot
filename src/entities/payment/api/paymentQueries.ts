import { paymentApi } from './paymentApi'
import type { Payment, PaymentFilters } from '../model/types'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

// ============ QUERY KEYS ============

export const PAYMENT_KEYS = {
    all: ['payments'] as const,
    lists: () => [...PAYMENT_KEYS.all, 'list'] as const,
    list: (filters?: PaymentFilters) =>
        [...PAYMENT_KEYS.lists(), filters] as const,
    details: () => [...PAYMENT_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...PAYMENT_KEYS.details(), id] as const,
}

// ============ QUERIES ============

export const usePayments = (
    filters?: PaymentFilters,
    options?: Omit<UseQueryOptions<Payment[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Payment[], Error>({
        queryKey: PAYMENT_KEYS.list(filters),
        queryFn: () => paymentApi.getPayments(filters),
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

export const usePayment = (
    id: string,
    options?: Omit<UseQueryOptions<Payment, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Payment, Error>({
        queryKey: PAYMENT_KEYS.detail(id),
        queryFn: () => paymentApi.getPaymentById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}
