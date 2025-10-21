export interface Currency {
    id: number
    is_national: boolean
    name: string
}

export interface CurrencyAmount {
    amount: number
    currency: Currency
}

export interface CashBoxState {
    amount: number
    currency: Currency
    payment_type: number
}

export interface Contractor {
    id: string
    name: string
}

export interface CashBox {
    id: string
    name: string
}

export interface Sale {
    id: string
}

export interface Payment {
    id: string
    created_at: string
    updated_at: string
    is_deleted: boolean
    deleted_at: string | null
    organization_id: string
    contractor: Contractor
    date: string
    notes: string | null
    debt_states: CurrencyAmount[]
    cash_box_states: CashBoxState[]
    sale: Sale | null
    return: any | null
    payment_source: number
    cash_box: CashBox
}

export interface PaymentFilters {
    date_start?: string
    date_end?: string
    limit?: number
    skip?: number
}

export interface PaymentSummary {
    payment_type: number
    label: string
    total: number
    currency: string
}
