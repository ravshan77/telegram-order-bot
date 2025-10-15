// Location (Delivery Address)
export interface Location {
    id: string
    name: string
    longitude: number
    latitude: number
}

// Contact
export interface Contact {
    type: number
    value: string
    description: string
}

// Debt
export interface Debt {
    amount: number
    currency: {
        id: number
        is_national: boolean
        name: string
    }
}

// Contractor (User profile with locations)
export interface Contractor {
    id: string
    name: string
    inn: string | null
    contacts: Contact[]
    organization_id: string
    debts: Debt[]
    locations: Location[]
}

// Create/Update Location Data
export interface LocationFormData {
    name: string
    longitude: number | string
    latitude: number | string
}

// Response when creating/updating location
export interface LocationResponse {
    contractor: Contractor
    location: Location
}

// Simplified view for UI
export interface LocationView {
    id: string
    name: string
    longitude: number
    latitude: number
    address?: string // Yandex Maps API dan olingan address
}
