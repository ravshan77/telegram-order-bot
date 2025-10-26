export interface Currency {
    id: number
    is_national: boolean
    name: string
}

export interface CurrencyAmount {
    amount: number
    currency: Currency
}

export interface WarehouseItem {
    id: string
    name: string
}

export interface OperationItemDiscount {
    value: number
    amount: number
    type: number
}

export interface SaleItem {
    id: string
    is_deleted: boolean
    quantity: number
    price: CurrencyAmount
    warehouse_item: WarehouseItem
    discount: OperationItemDiscount | null
    net_price: CurrencyAmount
}

export interface Payment {
    id: string
    date: string
    notes: string | null
    debt_states: CurrencyAmount[]
}

export interface Sale {
    id: string
    number: string
    date: string
    updated_at: string
    created_at: string
    approved_at: string | null
    is_approved: boolean
    notes?: string // for refund
    items: SaleItem[]
    payment: Payment | null
    net_price: CurrencyAmount[]
    totals: CurrencyAmount[]
    totals_after_exact_discount: CurrencyAmount[]
    after_exact_discounts_and_percent_discount: CurrencyAmount[]
    exact_discounts: CurrencyAmount[]
    percent_discount: number | null
    debts: CurrencyAmount[]
}

export interface SalesFilters {
    date_time_start?: string
    date_time_end?: string
    limit?: number
    skip?: number
}

export interface SalesResponse {
    sales: Sale[]
}
