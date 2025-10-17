import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query'
import { deliveryAddressApi } from './deliveryAddressApi'
import type {
    Location,
    LocationFormData,
    LocationResponse,
} from '../model/types'

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

// import {
//     useQuery,
//     useMutation,
//     useQueryClient,
//     type UseQueryOptions,
// } from '@tanstack/react-query'
// import { deliveryAddressApi } from './deliveryAddressApi'
// import type {
//     Location,
//     LocationFormData,
//     LocationResponse,
// } from '../model/types'

// // ============ QUERY KEYS ============

// export const DELIVERY_ADDRESS_KEYS = {
//     all: ['deliveryAddress'] as const,
//     contractor: () => [...DELIVERY_ADDRESS_KEYS.all, 'contractor'] as const,
//     locations: () => [...DELIVERY_ADDRESS_KEYS.all, 'locations'] as const,
//     location: (id: string) =>
//         [...DELIVERY_ADDRESS_KEYS.all, 'location', id] as const,
// }

// // ============ TYPES ============

// type CreateLocationVariables = LocationFormData

// type UpdateLocationVariables = {
//     id: string
//     data: LocationFormData
// }

// // ============ QUERIES ============

// /**
//  * Get all delivery addresses (locations)
//  * @example
//  * const { data: locations } = useDeliveryAddresses()
//  */
// export const useDeliveryAddresses = (
//     options?: Omit<
//         UseQueryOptions<LocationResponse, Error>,
//         'queryKey' | 'queryFn'
//     >,
// ) => {
//     return useQuery<LocationResponse, Error>({
//         queryKey: DELIVERY_ADDRESS_KEYS.locations(),
//         queryFn: () => deliveryAddressApi.getAllLocations(),
//         staleTime: 5 * 60 * 1000,
//         ...options,
//     })
// }

// /**
//  * Get single delivery address by ID
//  * @example
//  * const { data: location } = useDeliveryAddress('123')
//  */
// export const useDeliveryAddress = (
//     id: string,
//     options?: Omit<UseQueryOptions<Location, Error>, 'queryKey' | 'queryFn'>,
// ) => {
//     return useQuery<Location, Error>({
//         queryKey: DELIVERY_ADDRESS_KEYS.location(id),
//         queryFn: () => deliveryAddressApi.getLocationById(id),
//         enabled: !!id,
//         staleTime: 5 * 60 * 1000,
//         ...options,
//     })
// }

// // ============ MUTATIONS ============

// /**
//  * Create new delivery address
//  * @example
//  * const createLocation = useCreateDeliveryAddress()
//  * createLocation.mutate(
//  *   { name: 'Home', longitude: 69.279737, latitude: 41.311151 },
//  *   {
//  *     onSuccess: () => toast.success('Location created!'),
//  *   }
//  * )
//  */
// export const useCreateDeliveryAddress = () => {
//     const queryClient = useQueryClient()

//     return useMutation<LocationResponse, Error, CreateLocationVariables>({
//         mutationFn: (data) => deliveryAddressApi.createLocation(data),

//         onSuccess: (response) => {
//             // Update contractor cache
//             queryClient.setQueryData(
//                 DELIVERY_ADDRESS_KEYS.contractor(),
//                 response,
//             )

//             // Update locations cache
//             queryClient.setQueryData(
//                 DELIVERY_ADDRESS_KEYS.locations(),
//                 response.locations,
//             )

//             // Add individual location to cache
//             queryClient.setQueryData(
//                 DELIVERY_ADDRESS_KEYS.location(response.id),
//                 response,
//             )

//             // Invalidate to refetch
//             queryClient.invalidateQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.contractor(),
//             })
//         },
//     })
// }

// /**
//  * Update existing delivery address
//  * @example
//  * const updateLocation = useUpdateDeliveryAddress()
//  * updateLocation.mutate(
//  *   {
//  *     id: '123',
//  *     data: { name: 'Updated Name', longitude: 69.28, latitude: 41.31 }
//  *   },
//  *   {
//  *     onSuccess: () => toast.success('Location updated!'),
//  *   }
//  * )
//  */
// export const useUpdateDeliveryAddress = () => {
//     const queryClient = useQueryClient()

//     return useMutation<
//         LocationResponse,
//         Error,
//         UpdateLocationVariables,
//         { previousLocation?: Location }
//     >({
//         mutationFn: ({ id, data }) =>
//             deliveryAddressApi.updateLocation(id, data),

//         onMutate: async ({ id, data }) => {
//             // Cancel outgoing refetches
//             await queryClient.cancelQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.location(id),
//             })

//             // Snapshot previous value
//             const previousLocation = queryClient.getQueryData<Location>(
//                 DELIVERY_ADDRESS_KEYS.location(id),
//             )

//             // Optimistically update
//             if (previousLocation) {
//                 queryClient.setQueryData<Location>(
//                     DELIVERY_ADDRESS_KEYS.location(id),
//                     {
//                         ...previousLocation,
//                         name: data.name,
//                         longitude: Number(data.longitude),
//                         latitude: Number(data.latitude),
//                     },
//                 )
//             }

//             return { previousLocation }
//         },

//         onError: (_error, { id }, context) => {
//             // Rollback on error
//             if (context?.previousLocation) {
//                 queryClient.setQueryData(
//                     DELIVERY_ADDRESS_KEYS.location(id),
//                     context.previousLocation,
//                 )
//             }
//         },

//         onSuccess: (response, { id }) => {
//             // Update contractor cache
//             queryClient.setQueryData(
//                 DELIVERY_ADDRESS_KEYS.contractor(),
//                 response,
//             )

//             // Update locations cache
//             queryClient.setQueryData(
//                 DELIVERY_ADDRESS_KEYS.locations(),
//                 response.locations,
//             )

//             // Update individual location cache
//             queryClient.setQueryData(
//                 DELIVERY_ADDRESS_KEYS.location(id),
//                 response.id,
//             )

//             // Invalidate to refetch
//             queryClient.invalidateQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.contractor(),
//             })
//         },

//         onSettled: (_data, _error, { id }) => {
//             // Always refetch
//             queryClient.invalidateQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.location(id),
//             })
//         },
//     })
// }

// /**
//  * Delete delivery address
//  * @example
//  * const deleteLocation = useDeleteDeliveryAddress()
//  * deleteLocation.mutate(
//  *   {
//  *     id: '123',
//  *     data: { name: 'Deleted Name', longitude: 69.28, latitude: 41.31 }
//  *   },
//  *   {
//  *     onSuccess: () => toast.success('Location deleted!'),
//  *   }
//  * )
//  */

// export const useDeleteDeliveryAddress = () => {
//     const queryClient = useQueryClient()

//     return useMutation<
//         LocationResponse,
//         Error,
//         UpdateLocationVariables,
//         { previousLocation?: Location; previousLocations?: Location[] }
//     >({
//         mutationFn: ({ id, data }) => {
//             console.log({ id, data })

//             return deliveryAddressApi.deleteLocation(id, data)
//         },

//         onMutate: async ({ id }) => {
//             // Cancel queries
//             await queryClient.cancelQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.location(id),
//             })

//             // Snapshot
//             const previousLocation = queryClient.getQueryData<Location>(
//                 DELIVERY_ADDRESS_KEYS.location(id),
//             )

//             const previousLocations = queryClient.getQueryData<Location[]>(
//                 DELIVERY_ADDRESS_KEYS.locations(),
//             )

//             // Optimistically remove from locations list
//             if (previousLocations) {
//                 queryClient.setQueryData<Location[]>(
//                     DELIVERY_ADDRESS_KEYS.locations(),
//                     previousLocations.filter((loc) => loc.id !== id),
//                 )
//             }

//             // Remove from cache
//             queryClient.removeQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.location(id),
//             })

//             return { previousLocation, previousLocations }
//         },

//         onError: (_error, { id }, context) => {
//             // Rollback
//             if (context?.previousLocation) {
//                 queryClient.setQueryData(
//                     DELIVERY_ADDRESS_KEYS.location(id),
//                     context.previousLocation,
//                 )
//             }
//             if (context?.previousLocations) {
//                 queryClient.setQueryData(
//                     DELIVERY_ADDRESS_KEYS.locations(),
//                     context.previousLocations,
//                 )
//             }
//         },

//         onSuccess: (response, { id }) => {
//             // Remove from cache
//             queryClient.removeQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.location(id),
//             })

//             // Invalidate contractor and locations
//             queryClient.invalidateQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.contractor(),
//             })
//             queryClient.invalidateQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.locations(),
//             })
//         },

//         onSettled: (_data, _error, { id }) => {
//             // Always refetch
//             queryClient.invalidateQueries({
//                 queryKey: DELIVERY_ADDRESS_KEYS.location(id),
//             })
//         },
//     })
// }
