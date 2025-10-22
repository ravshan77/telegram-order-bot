export interface Location {
    id: string
    name: string
    longitude: number
    latitude: number
    is_default: boolean
}

export interface Contact {
    type: number
    value: string
    description: string
}

export interface Debt {
    amount: number
    currency: {
        id: number
        is_national: boolean
        name: string
    }
}

export interface LocationFormData {
    name: string
    longitude: number | string
    latitude: number | string
    is_default?: boolean
}

export interface LocationView {
    id: string
    name: string
    longitude: number
    latitude: number
    address?: string
}

export interface LocationResponse {
    id: string
    name: string
    inn: string | null
    contacts: Contact[]
    organization_id: string
    debts: Debt[]
    locations: Location[]
}
