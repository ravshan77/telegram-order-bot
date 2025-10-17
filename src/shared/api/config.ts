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
        getAll: '/get-contractor', // Gets contractor with locations
        create: '/contractor/location/register',
        update: (id: string) => `/contractor/location/update/${id}`,
        delete: (id: string) => `/contractor/location/delete/${id}`,
    },

    cart: {
        get: '/cart',
        addItem: '/cart/items',
        updateItem: (id: number | string) => `/cart/items/${id}`,
        removeItem: (id: number | string) => `/cart/items/${id}`,
        clear: '/cart/clear',
    },
    orders: {
        register: '/order/register', // POST
        getAll: '/orders', // GET (if available)
        getById: (id: string) => `/order/${id}`, // GET (if available)
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

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
