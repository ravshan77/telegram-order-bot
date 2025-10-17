import { Category } from '@/entities/category'
import { CategoryTree } from '@/entities/category/model/types'

// API dan keladigan ma'lumotlar
export interface ProductItem {
    barcodes: string[]
    category: string | null
    code: string | null
    description: string
    description_attributes: any[]
    id: string
    images: ProductImages[]
    is_favorite: boolean
    legal_type: number
    measurement: number
    name: string
    organization_id: string
    package_measurements: Package_measurements[]
    sku: string | null
}

interface ProductPrice {
    bulk_price: Price
    common_price: Price
    contractor: null | string | number | object // agar contractor keyingi bosqichlarda object bo‘lishi mumkin bo‘lsa
}

interface WarehouseState {
    id: string
    name: string
    organization_id: string
    warehouse_items: WarehouseItem[]
}

interface BranchState {
    code: string
    created_at: string
    deleted_at: string | null
    id: string
    is_deleted: boolean
    name: string
    owner: BranchOwner
    roaming_address: string | null
    roaming_branch: RoamingBranch
    state: number
    updated_at: string
    warehouses: any[] // agar warehouse strukturasi aniq bo‘lsa, WarehouseItem[] deb yozish mumkin
}

interface Currency {
    global_currency_id: number
    is_national: boolean
    name: string
}

interface Price {
    amount: number
    currency: Currency
}

interface Package_measurements {
    name: string
    quantity: number
}

interface ProductImages {
    id: string
    name: string
    path: string
}

interface WarehouseItem {
    alert_on: string | null
    id: number
    name: string
    purchase_price: number | null
    state: number
}

interface BranchOwner {
    id: string
    inn: string | null
    name: string
}

interface RoamingBranch {
    address: string | null
    branch_name: string
    branch_number: string
    latitude: number | null
    longitude: number | null
}

// Asosiy Product interface
export interface Items {
    item: ProductItem
    price: ProductPrice
    warehouse_states: WarehouseState
    branch_states: BranchState[]
}

// UI uchun qo'shimcha propertylar Product interfacei
export interface ProductView extends ProductItem {
    price: number
    stock: number
    discount?: number | string | null
}

export interface ItemResponse {
    categories: Category[]
    categoriesTree: CategoryTree[]
    data: Items[]
}

export interface ProductFilters {
    contractorId?: string
    name?: string
    sku?: string
    category_id?: string
    measurment?: string
    desc?: boolean
    sort?: string
    skip?: number
    limit?: number
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    hasMore?: boolean
}
