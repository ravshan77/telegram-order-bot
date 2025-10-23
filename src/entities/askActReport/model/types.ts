export interface DebtCurrency {
    id: number
    is_national: boolean
    name: string
}

export interface DebtState {
    amount: number
    currency: DebtCurrency
}

export interface Contact {
    type: number
    value: string
    description: string
}

export interface Location {
    id: string
    name: string
    longitude: number
    latitude: number
    is_default: boolean
}

export interface Contractor {
    id: string
    name: string
    inn: string | null
    contacts: Contact[]
    organization_id: string
    debts: DebtState[]
    locations: Location[]
}

export interface OperationContractor {
    id: string
    name: string
}

export interface Account {
    id: string
    username: string
    name: string
}

export interface Payment {
    id: string
}

export interface Sale {
    id: string
}

export interface Operation {
    id: string
    created_at: string
    updated_at: string
    is_deleted: boolean
    deleted_at: string | null
    contractor: OperationContractor
    type: number
    date: string
    account: Account
    debt_states: DebtState[]
    payment: Payment | null
    payout: any | null
    sale: Sale | null
    purchase: any | null
    refund: any | null
    return: any | null
}

export interface ActReportFilters {
    date_start?: string
    date_end?: string
    limit?: number
    skip?: number
}

export interface DowlandExcelFilter {
    date_start: string
    date_end: string
}

export interface ActReport {
    contractor: Contractor
    operations: Operation[]
    before_debts: DebtState[]
    after_debts: DebtState[]
    start: string
    end: string
}
