import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'
import {
    getAccountsPayablePath,
    getCardPath,
    getCategoryPath,
    getCheckoutPath,
    getDeliveryAddressPath,
    getDisbursementsPath,
    getHomePath,
    getOrderDetailsPath,
    getOrdersPath,
    getPaymentsPath,
    getProductPath,
    getReconciliationStatementPath,
    getSalesPath,
} from '@/shared/config'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: getHomePath(),
        component: lazy(() => import('@/pages/MainPage')),
        authority: [],
    },
    {
        key: 'sales',
        path: getSalesPath(),
        component: lazy(() => import('@/pages/Sales')),
        authority: [],
    },
    {
        key: 'orders',
        path: getOrdersPath(),
        component: lazy(() => import('@/pages/Orders')),
        authority: [],
    },
    {
        key: 'order-details',
        path: getOrderDetailsPath(),
        component: lazy(() => import('@/pages/Orders/ui/OrderDetailsPage')),
        authority: [],
    },
    {
        key: 'payments',
        path: getPaymentsPath(),
        component: lazy(() => import('@/pages/Payments')),
        authority: [],
    },
    {
        key: 'disbursements',
        path: getDisbursementsPath(),
        component: lazy(() => import('@/pages/Disbursements')),
        authority: [],
    },
    {
        key: 'accounts-payable',
        path: getAccountsPayablePath(),
        component: lazy(() => import('@/pages/AccountsPayable')),
        authority: [],
    },
    {
        key: 'reconciliation-statement',
        path: getReconciliationStatementPath(),
        component: lazy(() => import('@/pages/ReconciliationStatement')),
        authority: [],
    },
    {
        key: 'delivery-address',
        path: getDeliveryAddressPath(),
        component: lazy(() => import('@/pages/DeliveryAddress')),
        authority: [],
    },
    {
        key: 'cartPage',
        path: getCardPath(),
        component: lazy(() => import('@/pages/CartPage')),
        authority: [],
    },
    {
        key: 'categoryPage',
        path: getCategoryPath(),
        component: lazy(() => import('@/pages/CategoryPage')),
        authority: [],
    },
    {
        key: 'checkoutPage',
        path: getCheckoutPath(),
        component: lazy(() => import('@/pages/CheckoutPage')),
        authority: [],
    },
    {
        key: 'productPage',
        path: getProductPath(),
        component: lazy(() => import('@/pages/ProductPage')),
        authority: [],
    },
    ...othersRoute,
]
