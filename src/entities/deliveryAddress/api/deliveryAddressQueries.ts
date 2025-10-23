import type {
    Location,
    LocationFormData,
    LocationResponse,
} from '../model/types'
import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query'
import { deliveryAddressApi } from './deliveryAddressApi'

// ============ QUERY KEYS ============

export const DELIVERY_ADDRESS_KEYS = {
    all: ['deliveryAddress'] as const,
    contractor: () => [...DELIVERY_ADDRESS_KEYS.all, 'contractor'] as const,
    locations: () => [...DELIVERY_ADDRESS_KEYS.all, 'locations'] as const,
    location: (id: string) =>
        [...DELIVERY_ADDRESS_KEYS.all, 'location', id] as const,
}

type CreateLocationVariables = LocationFormData

type UpdateLocationVariables = {
    id: string
    data: LocationFormData
}

type UpdateDefaultVariables = {
    id: string
}

// ============ QUERIES ============

export const useDeliveryAddresses = (
    options?: Omit<
        UseQueryOptions<LocationResponse, Error>,
        'queryKey' | 'queryFn'
    >,
) => {
    return useQuery<LocationResponse, Error>({
        queryKey: DELIVERY_ADDRESS_KEYS.locations(),
        queryFn: () => deliveryAddressApi.getAllLocations(),
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

export const useDeliveryAddress = (
    id: string,
    options?: Omit<UseQueryOptions<Location, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<Location, Error>({
        queryKey: DELIVERY_ADDRESS_KEYS.location(id),
        queryFn: () => deliveryAddressApi.getLocationById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options,
    })
}

export const useCreateDeliveryAddress = () => {
    const queryClient = useQueryClient()

    return useMutation<LocationResponse, Error, CreateLocationVariables>({
        mutationFn: (data) => deliveryAddressApi.createLocation(data),

        onSuccess: (response) => {
            queryClient.setQueryData(
                DELIVERY_ADDRESS_KEYS.locations(),
                response,
            )
            queryClient.invalidateQueries({
                queryKey: DELIVERY_ADDRESS_KEYS.locations(),
            })
        },
    })
}

export const useUpdateDeliveryAddress = () => {
    const queryClient = useQueryClient()

    return useMutation<
        LocationResponse,
        Error,
        UpdateLocationVariables,
        { previousResponse?: LocationResponse }
    >({
        mutationFn: ({ id, data }) =>
            deliveryAddressApi.updateLocation(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({
                queryKey: DELIVERY_ADDRESS_KEYS.locations(),
            })

            const previousResponse = queryClient.getQueryData<LocationResponse>(
                DELIVERY_ADDRESS_KEYS.locations(),
            )

            if (previousResponse) {
                const updatedLocations = previousResponse.locations.map(
                    (loc) =>
                        loc.id === id
                            ? {
                                  ...loc,
                                  name: data.name,
                                  longitude: Number(data.longitude),
                                  latitude: Number(data.latitude),
                                  is_default: data.is_default ?? loc.is_default,
                              }
                            : loc,
                )

                queryClient.setQueryData<LocationResponse>(
                    DELIVERY_ADDRESS_KEYS.locations(),
                    {
                        ...previousResponse,
                        locations: updatedLocations,
                    },
                )
            }

            return { previousResponse }
        },

        onError: (_error, _variables, context) => {
            if (context?.previousResponse) {
                queryClient.setQueryData(
                    DELIVERY_ADDRESS_KEYS.locations(),
                    context.previousResponse,
                )
            }
        },

        onSuccess: (response) => {
            queryClient.setQueryData(
                DELIVERY_ADDRESS_KEYS.locations(),
                response,
            )
            queryClient.invalidateQueries({
                queryKey: DELIVERY_ADDRESS_KEYS.locations(),
            })
        },
    })
}

export const useUpdateDefaultLocation = () => {
    const queryClient = useQueryClient()

    return useMutation<
        LocationResponse,
        Error,
        UpdateDefaultVariables,
        { previousResponse?: LocationResponse }
    >({
        mutationFn: ({ id }) => deliveryAddressApi.updateDefaultLocation(id),

        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({
                queryKey: DELIVERY_ADDRESS_KEYS.locations(),
            })

            const previousResponse = queryClient.getQueryData<LocationResponse>(
                DELIVERY_ADDRESS_KEYS.locations(),
            )

            if (previousResponse) {
                const updatedLocations = previousResponse.locations.map(
                    (loc) => ({
                        ...loc,
                        is_default: loc.id === id,
                    }),
                )

                queryClient.setQueryData<LocationResponse>(
                    DELIVERY_ADDRESS_KEYS.locations(),
                    {
                        ...previousResponse,
                        locations: updatedLocations,
                    },
                )
            }

            return { previousResponse }
        },

        onError: (_error, _variables, context) => {
            if (context?.previousResponse) {
                queryClient.setQueryData(
                    DELIVERY_ADDRESS_KEYS.locations(),
                    context.previousResponse,
                )
            }
        },

        onSuccess: (response) => {
            queryClient.setQueryData(
                DELIVERY_ADDRESS_KEYS.locations(),
                response,
            )
            queryClient.invalidateQueries({
                queryKey: DELIVERY_ADDRESS_KEYS.locations(),
            })
        },
    })
}

export const useDeleteDeliveryAddress = () => {
    const queryClient = useQueryClient()

    return useMutation<
        LocationResponse,
        Error,
        { id: string; data: Location },
        { previousResponse?: LocationResponse }
    >({
        mutationFn: ({ id, data }) =>
            deliveryAddressApi.deleteLocation(id, data),

        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({
                queryKey: DELIVERY_ADDRESS_KEYS.locations(),
            })

            const previousResponse = queryClient.getQueryData<LocationResponse>(
                DELIVERY_ADDRESS_KEYS.locations(),
            )

            if (previousResponse) {
                queryClient.setQueryData<LocationResponse>(
                    DELIVERY_ADDRESS_KEYS.locations(),
                    {
                        ...previousResponse,
                        locations: previousResponse.locations.filter(
                            (loc) => loc.id !== id,
                        ),
                    },
                )
            }

            return { previousResponse }
        },

        onError: (_error, _variables, context) => {
            if (context?.previousResponse) {
                queryClient.setQueryData(
                    DELIVERY_ADDRESS_KEYS.locations(),
                    context.previousResponse,
                )
            }
        },

        onSuccess: (response) => {
            queryClient.setQueryData(
                DELIVERY_ADDRESS_KEYS.locations(),
                response,
            )
            queryClient.invalidateQueries({
                queryKey: DELIVERY_ADDRESS_KEYS.locations(),
            })
        },
    })
}
