import { CashBox, Payment } from '@/entities/payment'

export interface Purchase {
    id: string
}

export interface PayOut extends Payment {
    cash_box: CashBox
    purchase: Purchase | null
    refund: Purchase | null
}
