export const API_ENDPOINTS = {
    products: {
        getAll: '/item/get',
        getById: (id: number | string) => `/item/get/${id}`,
        search: '/products/search',
        byCategory: '/products/by-category',
        create: '/products',
        update: (id: number | string) => `/products/${id}`,
        delete: (id: number | string) => `/products/${id}`,
    },
    categories: {
        getAll: '/item-category/get',
        getById: (id: string) => `/item-category/get/${id}`,
        create: '/categories',
        update: (id: number | string) => `/categories/${id}`,
        delete: (id: number | string) => `/categories/${id}`,
    },
    deliveryAddress: {
        getAll: '/get-contractor',
        create: '/contractor/location/register',
        update: (id: string) => `/contractor/location/update/${id}`,
        delete: (id: string) => `/contractor/location/delete/${id}`,
        setDefault: (id: string) => `/contractor/location/set-default/${id}`,
    },
    orders: {
        getAll: '/order/get',
        getCount: '/order/get/count',
        getNotApproved: '/order/get-not-approved',
        getById: (id: string) => `/order/get/${id}`,
        register: '/order/register',
        addItem: '/order/add-item',
        updateItem: '/order/update-item',
        deleteItem: '/order/delete-item',
        approve: '/order/approve',
        delete: '/order/delete',
    },
    sales: {
        getAll: '/get-sales',
        getById: (id: string) => `/get-sale/${id}`,
        downloadExcel: (id: string) => `/get-sale-excel/${id}`,
    },
    refunds: {
        getAll: '/get-refunds',
        getById: (id: string) => `/get-refund/${id}`,
        downloadExcel: (id: string) => `/get-refund-excel/${id}`,
    },
    payments: {
        getAll: '/get-payments',
        getById: (id: string) => `/get-payment/${id}`,
    },
    payouts: {
        getAll: '/get-payouts',
        getById: (id: number | string) => `/get-payout/${id}`,
    },
    reconciliationAct: {
        get: '/reconciliation-act',
    },
} as const

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const APP_CDN = import.meta.env.VITE_APP_CDN
