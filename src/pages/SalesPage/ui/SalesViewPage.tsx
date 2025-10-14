import React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/shared/ui/kit'
import { GoBack } from '@/shared/ui/kit-pro'

export const SalesViewPage: React.FC = () => {
    const orderData = {
        status: 'Не подтвержден',
        saleDate: '15.09.2025',
        createdDate: '15.09.2025',
        info: 'Не введено',
        products: [
            {
                id: 1,
                name: 'Карандаш косметический детский декоративнай в наборе 6шт vnb',
                quantity: 20,
                packagesCount: 56,
                price: 7000,
                discount: 0,
                priceWithDiscount: 7000,
                totalPrice: 140000,
                warehouse: 'Беруни',
            },
            {
                id: 2,
                name: 'Карандаш косметический детский декоративнай в наборе 6шт vnb',
                quantity: 20,
                packagesCount: 56,
                price: 7000,
                discount: 0,
                priceWithDiscount: 7000,
                totalPrice: 140000,
                warehouse: 'Беруни',
            },
        ],
        summary: {
            total: 400000,
            discount: 400000,
            payment: 400000,
            debt: 400000,
        },
    }

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-US').replace(/,/g, ' ')
    }

    return (
        <div className="pb-32">
            <div>
                {/* Header */}
                <div className="bg-white w-full">
                    <GoBack />
                </div>

                {/* Content */}
                <div className="py-4">
                    {/* Status Card */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm border">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-base font-semibold">
                                Продавец
                            </h2>
                            <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-medium rounded-full">
                                {orderData.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Дата продажи:
                                </p>
                                <p className="text-sm font-medium">
                                    {orderData.saleDate}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Дата создания:
                                </p>
                                <p className="text-sm font-medium">
                                    {orderData.createdDate}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">
                                Информация
                            </p>
                            <p className="text-sm font-medium">
                                {orderData.info}
                            </p>
                        </div>

                        {/* PDF Download Button */}
                        <Button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            <Download size={18} />
                            PDF скачать
                        </Button>
                    </div>

                    {/* Product Cards */}
                    {orderData.products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl p-4 mb-3 shadow-sm border"
                        >
                            {/* Header - Quantity Info */}
                            <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                                <span>Количество: {product.quantity} шт.</span>
                                <span>
                                    Количество упаковок: {product.packagesCount}
                                </span>
                            </div>

                            {/* Product Name */}
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 leading-snug">
                                {product.name}
                            </h3>

                            {/* Price Details */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Цена:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatNumber(product.price)} UZS
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Скидка:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {product.discount}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Цена со скидкой:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatNumber(
                                            product.priceWithDiscount,
                                        )}{' '}
                                        UZS
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Количество:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatNumber(product.totalPrice)} UZS
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Склад:
                                    </span>
                                    <span className="text-sm font-medium">
                                        {product.warehouse}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fixed Footer - Summary */}
                <div className="fixed bottom-0 h-40 left-0 right-0 bg-white border-t shadow-2xl">
                    <div className="px-4 py-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Общая сумма:
                            </span>
                            <span className="text-sm font-semibold">
                                {formatNumber(orderData.summary.total)} UZS
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Скидка:
                            </span>
                            <span className="text-sm font-semibold">
                                {formatNumber(orderData.summary.discount)} UZS
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Оплата:
                            </span>
                            <span className="text-sm font-semibold">
                                {formatNumber(orderData.summary.payment)} UZS
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Долг:</span>
                            <span className="text-sm font-semibold">
                                {formatNumber(orderData.summary.debt)} UZS
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesViewPage
