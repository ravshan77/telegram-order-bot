import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'
import {
    getBasketPath,
    getCategoryPath,
    getCheckoutPath,
    getDebtPath,
    getDeliveryAddressMapPath,
    getDeliveryAddressPath,
    getMainPath,
    getOrderDetailsPath,
    getOrdersPath,
    getPaymentsPath,
    getPayoutsPath,
    getProductPath,
    getProfilePath,
    getReconciliationActPath,
    getSaleDetailPath,
    getSalesPath,
} from '@/shared/config'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: getMainPath(),
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
        key: 'sales-detail',
        path: getSaleDetailPath(),
        component: lazy(() => import('@/pages/SalesPage/ui/SalesViewPage')),
        authority: [],
    },
    {
        key: 'profile',
        path: getProfilePath(),
        component: lazy(() => import('@/pages/ProfilePage/index')),
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
        key: 'reconciliation-act',
        path: getReconciliationActPath(),
        component: lazy(() => import('@/pages/ReconciliationActPage')),
        authority: [],
    },
    {
        key: 'delivery-address',
        path: getDeliveryAddressPath(),
        component: lazy(() => import('@/pages/DeliveryAddressPage')),
        authority: [],
    },
    {
        key: 'delivery-address-map',
        path: getDeliveryAddressMapPath(),
        component: lazy(
            () =>
                import('@/pages/DeliveryAddressPage/ui/DeliveryAdressMapPage'),
        ),
        authority: [],
    },
    {
        key: 'basket',
        path: getBasketPath(),
        component: lazy(() => import('@/pages/BasketPage')),
        authority: [],
        // meta: {
        //     layout: 'collapsibleSide',
        // },
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
