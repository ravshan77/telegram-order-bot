import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query'
import type {
    Order,
    OrderItem,
    OrderFilters,
    DeleteOrderRequest,
    ApproveOrderRequest,
    AddOrderItemRequest,
    RegisterOrderRequest,
    UpdateOrderItemRequest,
    DeleteOrderItemRequest,
} from '../model/types'
import toast from 'react-hot-toast'
import { orderApi } from './orderApi'

// ============ QUERY KEYS ============

export const ORDER_KEYS = {
    all: ['orders'] as const,
    lists: (filters?: OrderFilters) => [...ORDER_KEYS.all, filters] as const,
    count: () => [...ORDER_KEYS.all, 'count'] as const,
    notApproved: () => [...ORDER_KEYS.all, 'not-approved'] as const,
    details: () => [...ORDER_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...ORDER_KEYS.details(), id] as const,
}

// ============ QUERIES ============

export const useOrders = (
    filters?: OrderFilters,
    options?: Omit<UseQueryOptions<Order[], Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Order[], Error>({
        queryKey: ORDER_KEYS.lists(filters),
        queryFn: () => orderApi.getOrders(filters),
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

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

export const useNotApprovedOrder = (
    options?: Omit<
        UseQueryOptions<Order | null, Error>,
        'queryKey' | 'queryFn'
    >,
) => {
    return useQuery<Order | null, Error>({
        queryKey: ORDER_KEYS.notApproved(),
        queryFn: () => orderApi.getNotApprovedOrder(),
        // staleTime: 0, // 1 minute
        staleTime: 1 * 60 * 1000, // 1 minute
        retry: 1, // 404 bo'lganda qayta yana bir martta yuborsh
        refetchOnWindowFocus: false,
        ...options,
    })
}

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

export const useRegisterOrder = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, RegisterOrderRequest>({
        mutationFn: (data) => orderApi.registerOrder(data),
        onSuccess: (newOrder) => {
            queryClient.setQueryData(ORDER_KEYS.notApproved(), newOrder)
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.notApproved(),
            })
            toast.success('Товар добавлен в корзину')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ошибка при создании заказа')
        },
    })
}

export const useAddOrderItem = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, AddOrderItemRequest>({
        mutationFn: (data) => orderApi.addOrderItem(data),
        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(ORDER_KEYS.notApproved(), updatedOrder)

            queryClient.setQueryData(
                ORDER_KEYS.detail(updatedOrder.id),
                updatedOrder,
            )

            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.notApproved(),
            })
            toast.success('Товар добавлен в корзину')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ошибка при добавлении товара')
        },
    })
}

type UpdateOrderContext = {
    previousOrder?: Order
}

export const useUpdateOrderItem = () => {
    const queryClient = useQueryClient()

    return useMutation<
        Order,
        Error,
        UpdateOrderItemRequest,
        UpdateOrderContext
    >({
        mutationFn: (data) => orderApi.updateOrderItem(data),
        onMutate: async (data) => {
            await queryClient.cancelQueries({
                queryKey: ORDER_KEYS.notApproved(),
            })

            const previousOrder = queryClient.getQueryData<Order>(
                ORDER_KEYS.notApproved(),
            )

            if (previousOrder) {
                const updatedItems = previousOrder.items.map((item) => {
                    if (item.id === data.position_id) {
                        return { ...item, quantity: data.item.quantity }
                    }
                    return item
                })
                const newOrder = { ...previousOrder, items: updatedItems }

                queryClient.setQueryData<Order>(
                    ORDER_KEYS.notApproved(),
                    newOrder,
                )
            }

            return { previousOrder }
        },

        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(
                ORDER_KEYS.detail(updatedOrder.id),
                updatedOrder,
            )

            toast.success('Количество обновлено ✅')
        },

        onError: (error, _variables, context) => {
            // rollback
            if (context?.previousOrder !== undefined) {
                queryClient.setQueryData<Order | null>(
                    ORDER_KEYS.notApproved(),
                    context.previousOrder ?? null,
                )
            }
            toast.error(error.message || 'Ошибка при обновлении товара ❌')
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.notApproved(),
            })
        },
    })
}

export const useDeleteOrderItem = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, DeleteOrderItemRequest>({
        mutationFn: (data) => orderApi.deleteOrderItem(data),
        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(ORDER_KEYS.notApproved(), updatedOrder)
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.notApproved(),
            })

            queryClient.setQueryData(
                ORDER_KEYS.notApproved(),
                (old: Order) => ({
                    ...old,
                    items: old?.items?.map((i: OrderItem) =>
                        i?.id === updatedOrder?.id ? updatedOrder : i,
                    ),
                }),
            )
            toast.success('Товар удален из корзины')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ошибка при удалении товара')
        },
    })
}

export const useApproveOrder = () => {
    const queryClient = useQueryClient()

    return useMutation<Order, Error, ApproveOrderRequest>({
        mutationFn: (data) => orderApi.approveOrder(data),
        onSuccess: (approvedOrder) => {
            queryClient.setQueryData(ORDER_KEYS.notApproved(), null)
            queryClient.setQueryData(
                ORDER_KEYS.detail(approvedOrder.id),
                approvedOrder,
            )
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.notApproved(),
            })
            toast.success('Заказ успешно оформлен!')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ошибка при оформлении заказа')
        },
    })
}

export const useDeleteOrder = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, DeleteOrderRequest>({
        mutationFn: (data) => orderApi.deleteOrder(data),
        onSuccess: (_, variables) => {
            queryClient.setQueryData(ORDER_KEYS.notApproved(), null)

            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.notApproved(),
            })

            queryClient.removeQueries({
                queryKey: ORDER_KEYS.detail(variables.id),
            })
            toast.success('Заказ удален')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ошибка при удалении заказа')
        },
    })
}
