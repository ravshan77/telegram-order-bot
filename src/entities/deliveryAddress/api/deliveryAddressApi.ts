import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import type {
    LocationFormData,
    LocationResponse,
    Location,
} from '../model/types'

class DeliveryAddressApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getAllLocations(): Promise<LocationResponse> {
        const contractor = await this.get<LocationResponse>(
            API_ENDPOINTS.deliveryAddress.getAll,
        )
        return contractor
    }

    async getLocationById(id: string): Promise<Location> {
        const contractor = await this.getAllLocations()
        const location = contractor.locations.find((loc) => loc.id === id)

        if (!location) {
            throw new Error(`Location with id ${id} not found`)
        }

        return location
    }

    async createLocation(data: LocationFormData): Promise<LocationResponse> {
        const payload = {
            name: data.name,
            longitude: Number(data.longitude),
            latitude: Number(data.latitude),
            is_default: data.is_default ?? false,
        }

        return this.post<LocationResponse>(
            API_ENDPOINTS.deliveryAddress.create,
            payload,
        )
    }

    async updateLocation(
        id: string,
        data: LocationFormData,
    ): Promise<LocationResponse> {
        const payload = {
            name: data.name,
            longitude: Number(data.longitude),
            latitude: Number(data.latitude),
            is_default: data.is_default ?? false,
        }

        return this.post<LocationResponse>(
            API_ENDPOINTS.deliveryAddress.update(id),
            payload,
        )
    }

    async updateDefaultLocation(id: string): Promise<LocationResponse> {
        return this.post<LocationResponse>(
            API_ENDPOINTS.deliveryAddress.setDefault(id),
            {},
        )
    }

    async deleteLocation(
        id: string,
        data: Location,
    ): Promise<LocationResponse> {
        return this.post<LocationResponse>(
            API_ENDPOINTS.deliveryAddress.delete(id),
            { ...data },
        )
    }
}

export const deliveryAddressApi = new DeliveryAddressApi()

// import { BaseRestClient } from '@/shared/api/ApiService'
// import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
// import type {
//     // Contractor,
//     LocationFormData,
//     LocationResponse,
//     Location,
// } from '../model/types'

// class DeliveryAddressApi extends BaseRestClient {
//     constructor() {
//         super(API_BASE_URL)
//     }

//     /**
//      * Get all delivery addresses
//      */
//     async getAllLocations(): Promise<LocationResponse> {
//         const contractor = await this.get<LocationResponse>(
//             API_ENDPOINTS.deliveryAddress.getAll,
//         )

//         return contractor
//     }

//     /**
//      * Get single location by ID
//      */
//     async getLocationById(id: string): Promise<Location> {
//         const contractor = await this.getAllLocations()
//         const location = contractor.locations.find((loc) => loc.id === id)

//         if (!location) {
//             throw new Error(`Location with id ${id} not found`)
//         }

//         return location
//     }

//     /**
//      * Create new location
//      */
//     async createLocation(data: LocationFormData): Promise<LocationResponse> {
//         // Convert string to number if needed
//         const payload = {
//             name: data.name,
//             longitude: Number(data.longitude),
//             latitude: Number(data.latitude),
//         }

//         return this.post<LocationResponse>(
//             API_ENDPOINTS.deliveryAddress.create,
//             payload,
//         )
//     }

//     /**
//      * Update existing location
//      */
//     async updateLocation(
//         id: string,
//         data: LocationFormData,
//     ): Promise<LocationResponse> {
//         // Convert string to number if needed
//         const payload = {
//             name: data.name,
//             longitude: Number(data.longitude),
//             latitude: Number(data.latitude),
//         }

//         return this.post<LocationResponse>(
//             API_ENDPOINTS.deliveryAddress.update(id),
//             payload,
//         )
//     }

//     /**
//      * Delete location
//      */
//     async deleteLocation(
//         id: string,
//         data: LocationFormData,
//     ): Promise<LocationResponse> {
//         // Convert string to number if needed

//         console.log({ id, data })

//         const payload = {
//             name: data.name,
//             longitude: Number(data.longitude),
//             latitude: Number(data.latitude),
//         }

//         return this.post<LocationResponse>(
//             API_ENDPOINTS.deliveryAddress.delete(id),
//             payload,
//         )
//     }
// }

// export const deliveryAddressApi = new DeliveryAddressApi()
