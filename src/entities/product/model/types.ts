// API dan keladigan ma'lumotlar
export interface ProductItem {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    is_deleted: boolean
    name: string
    measurement: number
    package_measurements: any[]
    code: string | null
    sku: string | null
    barcodes: string[]
    is_state_controlled: boolean
    is_favorite: boolean
    category: any | null
    tax: {
        measurement: any | null
        catalog: any | null
        benefit: any | null
        tax_rate: any | null
        origin: any | null
    }
    images: any[]
    description: string
    organization_id: string
    tasnif_info: any | null
    description_attributes: any[]
    legal_type: number
}

export interface ProductPrice {
    id: number
    created_at: string
    updated_at: string
    is_active: boolean
    item: {
        id: number
        global_item_id: string
        global_organization_id: string
    }
    common_price: {
        id: number
        created_at: string
        updated_at: string
        mount: number
        currency: {
            id: number
            global_currency_id: number
            name: string
            global_organization_id: string
            is_national: boolean
        }
    }
    bulk_price: {
        id: number
        created_at: string
        updated_at: string
        amount: number
        currency: {
            id: number
            global_currency_id: number
            name: string
            global_organization_id: string
            is_national: boolean
        }
    }
    contractor: any | null
    global_account_id: any | null
}

export interface WarehouseState {
    id: string
    name: string
    organization_id: string
    warehouse_items: {
        id: number
        name: string
        state: number
        alert_on: any | null
        purchase_price: any | null
    }[]
}

export interface BranchState {
    id: string
    created_at: string
    updated_at: string
    is_deleted: boolean
    deleted_at: string | null
    code: string
    name: string
    owner: {
        id: string
        inn: string | null
        name: string
    }
    roaming_branch: {
        branch_number: string
        branch_name: string
        address: string | null
        longitude: number | null
        latitude: number | null
    }
    roaming_address: string | null
    warehouses: any[]
    state: number
}

// Asosiy Product interface
export interface Product {
    item: ProductItem
    price: ProductPrice
    warehouse_states: WarehouseState[]
    branch_states: BranchState[]
}

// UI uchun soddalashtirilgan Product interface
export interface ProductView {
    id: string
    name: string
    price: number
    currency: string
    oldPrice?: number
    discount?: number
    image: string
    images: string[]
    category: string | null
    description: string
    brand?: string
    article?: string
    code: string | null
    sku: string | null
    barcodes: string[]
    package?: string
    nds?: number
    not_available: boolean
    is_favorite: boolean
    stock: number
    measurement: number
    created_at: string
    updated_at: string
}

// Product ni ProductView ga o'zgartirish helper function
export const transformProductToView = (product: Product): ProductView => {
    const totalStock = product.warehouse_states.reduce((sum, warehouse) => {
        return (
            sum +
            warehouse.warehouse_items.reduce(
                (itemSum, item) => itemSum + item.state,
                0,
            )
        )
    }, 0)

    return {
        id: product.item.id,
        name: product.item.name,
        price: product.price.common_price.mount,
        currency: product.price.common_price.currency.name,
        image: product.item.images[0] || '/placeholder.png',
        images: product.item.images || [],
        category: product.item.category?.name || null,
        description: product.item.description || '',
        code: product.item.code,
        sku: product.item.sku,
        barcodes: product.item.barcodes,
        not_available: totalStock === 0,
        is_favorite: product.item.is_favorite,
        stock: totalStock,
        measurement: product.item.measurement,
        created_at: product.item.created_at,
        updated_at: product.item.updated_at,
        nds: product.item.tax.tax_rate || 0,
    }
}

// export interface Product {
//     id: number
//     name: string
//     price: number
//     oldPrice?: number
//     discount?: number
//     image: string
//     category: string
//     description?: string
//     brand?: string
//     article?: string
//     color?: string
//     package?: string
//     barcode?: string
//     nds?: number
//     not_available?: boolean
// }
