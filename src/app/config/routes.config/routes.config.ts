import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'
import {
    getCardPath,
    getCategoryPath,
    getCheckoutPath,
    getDebtPath,
    getDeliveryAddressPath,
    getHomePath,
    getOrderDetailsPath,
    getOrdersPath,
    getPaymentsPath,
    getPayoutsPath,
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
        component: lazy(() => import('@/pages/SalesPage')),
        authority: [],
    },
    {
        key: 'orders',
        path: getOrdersPath(),
        component: lazy(() => import('@/pages/OrdersPage')),
        authority: [],
    },
    {
        key: 'order-details',
        path: getOrderDetailsPath(),
        component: lazy(() => import('@/pages/OrdersPage/ui/OrderDetailsPage')),
        authority: [],
    },
    {
        key: 'payments',
        path: getPaymentsPath(),
        component: lazy(() => import('@/pages/PaymentsPage')),
        authority: [],
    },
    {
        key: 'payouts',
        path: getPayoutsPath(),
        component: lazy(() => import('@/pages/PayoutsPage')),
        authority: [],
    },
    {
        key: 'debts',
        path: getDebtPath(),
        component: lazy(() => import('@/pages/DebtPage')),
        authority: [],
    },
    {
        key: 'reconciliation-statement',
        path: getReconciliationStatementPath(),
        component: lazy(() => import('@/pages/ReconciliationStatementPage')),
        authority: [],
    },
    {
        key: 'delivery-address',
        path: getDeliveryAddressPath(),
        component: lazy(() => import('@/pages/DeliveryAddressPage')),
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
