import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query'
import { orderApi } from './orderApi'
import type { Order, RegisterOrderRequest } from '../model/types'

// Query Keys
export const ORDER_KEYS = {
    all: ['orders'] as const,
    lists: () => [...ORDER_KEYS.all, 'list'] as const,
    details: () => [...ORDER_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...ORDER_KEYS.details(), id] as const,
}

/**
 * Get all orders
 */
export const useOrders = (
    options?: Omit<UseQueryOptions<Order[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Order[], Error>({
        queryKey: ORDER_KEYS.lists(),
        queryFn: () => orderApi.getOrders(),
        staleTime: 2 * 60 * 1000, // 2 minutes
        ...options,
    })
}

/**
 * Get order by ID
 */
export const useOrder = (
    id: string,
    options?: Omit<UseQueryOptions<Order, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Order, Error>({
        queryKey: ORDER_KEYS.detail(id),
        queryFn: () => orderApi.getOrderById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

/**
 * Register new order mutation
 */
export const useRegisterOrder = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, RegisterOrderRequest>({
        mutationFn: (data) => orderApi.registerOrder(data),

        onSuccess: (newOrder) => {
            // Add to cache
            queryClient.setQueryData(ORDER_KEYS.detail(newOrder.id), newOrder)

            // Invalidate orders list
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.lists(),
            })
        },
    })
}
