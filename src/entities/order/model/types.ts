// Request types
export interface OrderItemRequest {
    item_id: string
    quantity: number
}

export interface RegisterOrderRequest {
    items: OrderItemRequest[]
}

export interface AddOrderItemRequest {
    id: string // order ID
    item: OrderItemRequest
}

export interface UpdateOrderItemRequest {
    id: string // order ID
    position_id: string // order item ID
    item: OrderItemRequest
}

export interface DeleteOrderItemRequest {
    id: string // order ID
    position_id: string // order item ID
}

export interface ApproveOrderRequest {
    id: string // order ID
    date: string
    comment?: string
    location_id?: string | null
    payment_type?: number | null
}

export interface DeleteOrderRequest {
    id: string // order ID
}

// Response types (existing, keep them)
export interface Item {
    id: string
    name: string
}

export interface Currency {
    id: number
    is_national: boolean
    name: string
}

export interface CurrencyAmount {
    amount: number
    currency: Currency
}

export interface OrderItem {
    id: string
    item: Item
    price: CurrencyAmount
    net_price: CurrencyAmount
    is_deleted: boolean
    quantity: number
}

export interface User {
    first_name: string
    last_name: string
    phone_number: string | null
}

export interface Contractor {
    id: string
    name: string
}

export interface Location {
    id: string
    name: string
    longitude: number
    latitude: number
}

export interface SaleInfo {
    id: string
    number: string
}

export interface Order {
    id: string
    created_at: string
    updated_at: string
    is_deleted: boolean
    deleted_at: string | null
    date: string
    organization_id: string
    items: OrderItem[]
    bot_id: number
    user_id: number
    user: User
    net_price: CurrencyAmount[]
    contractor: Contractor | null
    is_approved: boolean
    approved_at: string | null
    payment_type: number | null
    comment: string
    location: Location | null
    is_sale_created: boolean
    sale_info: SaleInfo | null
}

// UI types
export interface OrderFormData {
    paymentType: number | null
    locationId: string | null
    comment: string
}

// Error types
export enum OrderErrorType {
    BotUserNotFound = 'bot_user_not_found',
    BotConfigurationNotFound = 'bot_configuration_not_found',
    NotApprovedOrderExist = 'not_approved_order_exist',
    HasOrderAcceptanceTime = 'has_order_acceptance_time',
}

// // Request types
// export interface OrderItemRequest {
//     item_id: string
//     quantity: number
// }

// export interface RegisterOrderRequest {
//     items: OrderItemRequest[]
// }

// // Response types
// export interface Item {
//     id: string
//     name: string
// }

// export interface Currency {
//     id: number
//     is_national: boolean
//     name: string
// }

// export interface CurrencyAmount {
//     amount: number
//     currency: Currency
// }

// export interface OrderItem {
//     id: string
//     item: Item
//     price: CurrencyAmount
//     net_price: CurrencyAmount
//     is_deleted: boolean
//     quantity: number
// }

// export interface User {
//     first_name: string
//     last_name: string
//     phone_number: string | null
// }

// export interface Contractor {
//     id: string
//     name: string
// }

// export interface Location {
//     id: string
//     name: string
//     longitude: number
//     latitude: number
// }

// export interface SaleInfo {
//     id: string
//     number: string
// }

// export interface Order {
//     id: string
//     created_at: string
//     updated_at: string
//     is_deleted: boolean
//     deleted_at: string | null
//     date: string
//     organization_id: string
//     items: OrderItem[]
//     bot_id: number
//     user_id: number
//     user: User
//     net_price: CurrencyAmount[]
//     contractor: Contractor | null
//     is_approved: boolean
//     approved_at: string | null
//     payment_type: number | null
//     comment: string
//     location: Location | null
//     is_sale_created: boolean
//     sale_info: SaleInfo | null
// }

// // Error types
// export enum OrderErrorType {
//     BotUserNotFound = 'bot_user_not_found',
//     BotConfigurationNotFound = 'bot_configuration_not_found',
//     ScriptNotFound = 'script_not_found',
//     RegisterOrderNotAllowed = 'register_order_not_allowed',
//     AllowedContractorsOnly = 'allowed_contractors_only',
//     HasOrderAcceptanceTime = 'has_order_acceptance_time',
//     NotApprovedOrderExist = 'not_approved_order_exist',
//     EnableOrderWithAvailableItems = 'enable_order_with_available_items',
// }

// export interface OrderErrorResponse {
//     bot_user_not_found?: string
//     bot_configuration_not_found?: string
//     script_not_found?: string
//     register_order_not_allowed?: string
//     allowed_contractors_only?: string
//     has_order_acceptance_time?: string
//     not_approved_order_exist?: string
//     enable_order_with_available_items?: string
// }

// // UI types
// export interface OrderFormData {
//     paymentType: number | null
//     locationId: string | null
//     comment: string
// }
