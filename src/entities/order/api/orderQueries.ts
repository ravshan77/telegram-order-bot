import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query'
import { orderApi } from './orderApi'
import type {
    Order,
    RegisterOrderRequest,
    AddOrderItemRequest,
    UpdateOrderItemRequest,
    DeleteOrderItemRequest,
    ApproveOrderRequest,
    DeleteOrderRequest,
} from '../model/types'

// Query Keys
export const ORDER_KEYS = {
    all: ['orders'] as const,
    lists: () => [...ORDER_KEYS.all, 'list'] as const,
    count: () => [...ORDER_KEYS.all, 'count'] as const,
    notApproved: () => [...ORDER_KEYS.all, 'not-approved'] as const,
    details: () => [...ORDER_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...ORDER_KEYS.details(), id] as const,
}

// ============ QUERIES ============

/**
 * Get all orders
 */
export const useOrders = (
    options?: Omit<UseQueryOptions<Order[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Order[], Error>({
        queryKey: ORDER_KEYS.lists(),
        queryFn: () => orderApi.getOrders(),
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

/**
 * Get orders count
 */
export const useOrdersCount = (
    options?: Omit<UseQueryOptions<number, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<number, Error>({
        queryKey: ORDER_KEYS.count(),
        queryFn: () => orderApi.getOrdersCount(),
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

/**
 * Get not approved order (active cart)
 * This is the main cart/draft order
 */
export const useNotApprovedOrder = (
    options?: Omit<
        UseQueryOptions<Order | null, Error>,
        'queryKey' | 'queryFn'
    >,
) => {
    return useQuery<Order | null, Error>({
        queryKey: ORDER_KEYS.notApproved(),
        queryFn: () => orderApi.getNotApprovedOrder(),
        staleTime: 1 * 60 * 1000, // 1 minute
        retry: 1, // Only retry once for 404 errors
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

// ============ MUTATIONS ============

/**
 * Register new order (create cart)
 */
export const useRegisterOrder = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, RegisterOrderRequest>({
        mutationFn: (data) => orderApi.registerOrder(data),
        onSuccess: (newOrder) => {
            // Update not approved order cache
            queryClient.setQueryData(ORDER_KEYS.notApproved(), newOrder)

            // Invalidate orders list
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.lists(),
            })
        },
    })
}

/**
 * Add item to order
 */
export const useAddOrderItem = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, AddOrderItemRequest>({
        mutationFn: (data) => orderApi.addOrderItem(data),
        onSuccess: (updatedOrder) => {
            // Update not approved order cache
            queryClient.setQueryData(ORDER_KEYS.notApproved(), updatedOrder)

            // Update specific order cache if exists
            queryClient.setQueryData(
                ORDER_KEYS.detail(updatedOrder.id),
                updatedOrder,
            )
        },
    })
}

/**
 * Update order item
 */
export const useUpdateOrderItem = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, UpdateOrderItemRequest>({
        mutationFn: (data) => orderApi.updateOrderItem(data),
        onSuccess: (updatedOrder) => {
            // Update not approved order cache
            queryClient.setQueryData(ORDER_KEYS.notApproved(), updatedOrder)

            // Update specific order cache
            queryClient.setQueryData(
                ORDER_KEYS.detail(updatedOrder.id),
                updatedOrder,
            )
        },
    })
}

/**
 * Delete order item
 */
export const useDeleteOrderItem = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, DeleteOrderItemRequest>({
        mutationFn: (data) => orderApi.deleteOrderItem(data),
        onSuccess: (updatedOrder) => {
            // Update not approved order cache
            queryClient.setQueryData(ORDER_KEYS.notApproved(), updatedOrder)

            // Update specific order cache
            queryClient.setQueryData(
                ORDER_KEYS.detail(updatedOrder.id),
                updatedOrder,
            )
        },
    })
}

/**
 * Approve order (checkout)
 */
export const useApproveOrder = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, ApproveOrderRequest>({
        mutationFn: (data) => orderApi.approveOrder(data),
        onSuccess: (approvedOrder) => {
            // Clear not approved order cache
            queryClient.setQueryData(ORDER_KEYS.notApproved(), null)

            // Update orders list
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.lists(),
            })

            // Update specific order cache
            queryClient.setQueryData(
                ORDER_KEYS.detail(approvedOrder.id),
                approvedOrder,
            )
        },
    })
}

/**
 * Delete order (cancel)
 */
export const useDeleteOrder = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, DeleteOrderRequest>({
        mutationFn: (data) => orderApi.deleteOrder(data),
        onSuccess: (_, variables) => {
            // Clear not approved order cache
            queryClient.setQueryData(ORDER_KEYS.notApproved(), null)

            // Remove from orders list
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.lists(),
            })

            // Remove specific order cache
            queryClient.removeQueries({
                queryKey: ORDER_KEYS.detail(variables.id),
            })
        },
    })
}

// import {
//     useQuery,
//     useMutation,
//     useQueryClient,
//     type UseQueryOptions,
// } from '@tanstack/react-query'
// import { orderApi } from './orderApi'
// import type { Order, RegisterOrderRequest } from '../model/types'

// // Query Keys
// export const ORDER_KEYS = {
//     all: ['orders'] as const,
//     lists: () => [...ORDER_KEYS.all, 'list'] as const,
//     details: () => [...ORDER_KEYS.all, 'detail'] as const,
//     detail: (id: string) => [...ORDER_KEYS.details(), id] as const,
// }

// /**
//  * Get all orders
//  */
// export const useOrders = (
//     options?: Omit<UseQueryOptions<Order[], Error>, 'queryKey' | 'queryFn'>,
// ) => {
//     return useQuery<Order[], Error>({
//         queryKey: ORDER_KEYS.lists(),
//         queryFn: () => orderApi.getOrders(),
//         staleTime: 2 * 60 * 1000, // 2 minutes
//         ...options,
//     })
// }

// /**
//  * Get order by ID
//  */
// export const useOrder = (
//     id: string,
//     options?: Omit<UseQueryOptions<Order, Error>, 'queryKey' | 'queryFn'>,
// ) => {
//     return useQuery<Order, Error>({
//         queryKey: ORDER_KEYS.detail(id),
//         queryFn: () => orderApi.getOrderById(id),
//         enabled: !!id,
//         staleTime: 5 * 60 * 1000,
//         ...options,
//     })
// }

// /**
//  * Register new order mutation
//  */
// export const useRegisterOrder = () => {
//     const queryClient = useQueryClient()

//     return useMutation<Order, Error, RegisterOrderRequest>({
//         mutationFn: (data) => orderApi.registerOrder(data),

//         onSuccess: (newOrder) => {
//             // Add to cache
//             queryClient.setQueryData(ORDER_KEYS.detail(newOrder.id), newOrder)

//             // Invalidate orders list
//             queryClient.invalidateQueries({
//                 queryKey: ORDER_KEYS.lists(),
//             })
//         },
//     })
// }
