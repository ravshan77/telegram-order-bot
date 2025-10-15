export const API_ENDPOINTS = {
    products: {
        getAll: '/items/get',
        getById: (id: number | string) => `/item/get/${id}`,
        search: '/products/search',
        byCategory: '/products/by-category',
        create: '/products',
        update: (id: number | string) => `/products/${id}`,
        delete: (id: number | string) => `/products/${id}`,
    },
    categories: {
        getAll: '/categories',
        getById: (id: number | string) => `/categories/${id}`,
        create: '/categories',
        update: (id: number | string) => `/categories/${id}`,
        delete: (id: number | string) => `/categories/${id}`,
    },
    deliveryAddress: {
        getAll: '/web-app/get-contractor', // Gets contractor with locations
        create: '/web-app/contractor/location/register',
        update: (id: string) => `/web-app/contractor/location/update/${id}`,
        delete: (id: string) => `/web-app/contractor/location/delete/${id}`,
    },

    cart: {
        get: '/cart',
        addItem: '/cart/items',
        updateItem: (id: number | string) => `/cart/items/${id}`,
        removeItem: (id: number | string) => `/cart/items/${id}`,
        clear: '/cart/clear',
    },
    orders: {
        getAll: '/orders',
        getById: (id: number | string) => `/orders/${id}`,
        create: '/orders',
        update: (id: number | string) => `/orders/${id}`,
    },
    sales: {
        getAll: '/sales',
        getById: (id: number | string) => `/sales/${id}`,
    },
    payments: {
        getAll: '/payments',
        getById: (id: number | string) => `/payments/${id}`,
    },
    payouts: {
        getAll: '/payouts',
        getById: (id: number | string) => `/payouts/${id}`,
    },
    debt: {
        get: '/debt',
    },
    reconciliationAct: {
        get: '/reconciliation-act',
    },
} as const

export const API_BASE_URL = 'https://staging.hippo.uz/telegram-order-bot'
