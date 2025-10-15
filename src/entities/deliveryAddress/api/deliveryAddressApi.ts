import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import type {
    Contractor,
    LocationFormData,
    LocationResponse,
    Location,
} from '../model/types'

class DeliveryAddressApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    /**
     * Get contractor with all locations
     */
    async getContractor(): Promise<Contractor> {
        return this.get<Contractor>(API_ENDPOINTS.deliveryAddress.getAll)
    }

    /**
     * Get all delivery addresses
     */
    async getAllLocations(): Promise<Location[]> {
        const contractor = await this.getContractor()
        return contractor.locations
    }

    /**
     * Get single location by ID
     */
    async getLocationById(id: string): Promise<Location> {
        const contractor = await this.getContractor()
        const location = contractor.locations.find((loc) => loc.id === id)

        if (!location) {
            throw new Error(`Location with id ${id} not found`)
        }

        return location
    }

    /**
     * Create new location
     */
    async createLocation(data: LocationFormData): Promise<LocationResponse> {
        // Convert string to number if needed
        const payload = {
            name: data.name,
            longitude: Number(data.longitude),
            latitude: Number(data.latitude),
        }

        return this.post<LocationResponse>(
            API_ENDPOINTS.deliveryAddress.create,
            payload,
        )
    }

    /**
     * Update existing location
     */
    async updateLocation(
        id: string,
        data: LocationFormData,
    ): Promise<LocationResponse> {
        // Convert string to number if needed
        const payload = {
            name: data.name,
            longitude: Number(data.longitude),
            latitude: Number(data.latitude),
        }

        return this.post<LocationResponse>(
            API_ENDPOINTS.deliveryAddress.update(id),
            payload,
        )
    }

    /**
     * Delete location
     */
    async deleteLocation(id: string): Promise<void> {
        return this.post<void>(API_ENDPOINTS.deliveryAddress.delete(id))
    }
}

export const deliveryAddressApi = new DeliveryAddressApi()
