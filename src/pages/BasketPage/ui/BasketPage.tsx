import React from 'react'
import toast from 'react-hot-toast'
import { GoBack } from '@/shared/ui/kit-pro'
import { useNavigate } from 'react-router-dom'
import { getCheckoutPath } from '@/shared/config/'
import { Button, Spinner, Alert } from '@/shared/ui/kit'
import { Image, Minus, Plus, Trash2 } from 'lucide-react'
import {
    useNotApprovedOrder,
    useUpdateOrderItem,
    useDeleteOrderItem,
} from '@/entities/order'

// const APP_CDN = import.meta.env.VITE_APP_CDN

export const BasketPage: React.FC = () => {
    const navigate = useNavigate()
    const { data: order, isLoading, isError, error } = useNotApprovedOrder()

    // Mutations
    const updateItem = useUpdateOrderItem()
    const deleteItem = useDeleteOrderItem()

    const cart = order?.items ?? []

    const handleUpdateQuantity = async (
        positionId: string,
        itemId: string,
        newQuantity: number,
    ) => {
        if (!order) return

        if (newQuantity === 0) {
            handleRemove(positionId)
            return
        }

        try {
            await updateItem.mutateAsync({
                id: order.id,
                position_id: positionId,
                item: {
                    item_id: itemId,
                    quantity: newQuantity,
                },
            })
        } catch (err: any) {
            toast.error(err.message || 'Ошибка при обновлении количества')
        }
    }

    const handleRemove = async (positionId: string) => {
        if (!order) return

        const confirmed = confirm(
            'Вы действительно собираетесь удалить этот продукт?',
        )

        if (!confirmed) return

        try {
            await deleteItem.mutateAsync({
                id: order.id,
                position_id: positionId,
            })
            toast.success('Товар удален из корзины')
        } catch (err: any) {
            toast.error(err.message || 'Ошибка при удалении товара')
        }
    }

    const getTotalPrice = () => {
        return cart.reduce(
            (sum, item) => sum + item.net_price.amount * item.quantity,
            0,
        )
    }

    const goToCheckout = () => {
        if (!order || cart.length === 0) {
            toast.error('Корзина пуста')
            return
        }
        navigate(getCheckoutPath())
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    {error?.message}
                </Alert>
            </div>
        )
    }

    if (!order || cart.length === 0) {
        return (
            <div className="h-full">
                <div className="bg-white w-full">
                    <GoBack />
                </div>
                <div className="h-full flex-1 flex flex-col items-center justify-around">
                    <p className="text-gray-500">Корзина пуста</p>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-16">
            <div className="bg-white w-full">
                <GoBack />
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="py-2 space-y-3">
                    {cart.map((orderItem) => (
                        <div
                            key={orderItem.id}
                            className="bg-white rounded-2xl p-4 border cursor-pointer"
                        >
                            <div className="flex gap-3">
                                {/* Product Image */}
                                <div className="w-20 h-20 flex-shrink-0 border rounded-lg overflow-hidden">
                                    <Image
                                        size={40}
                                        className="w-full h-full"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                                        {orderItem.item.name}
                                    </h3>
                                    <p className="text-sm font-bold text-primary mb-1">
                                        {orderItem.net_price.amount.toLocaleString()}{' '}
                                        {orderItem.net_price.currency.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Цена продажи
                                    </p>
                                </div>
                            </div>

                            {/* Quantity Controls & Delete */}
                            <div className="flex items-center justify-evenly mt-4">
                                <button
                                    className="p-2 text-gray-400 hover:text-red-500"
                                    disabled={deleteItem.isPending}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemove(orderItem.id)
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>

                                <div className="flex items-center gap-3">
                                    <Button
                                        className="w-8 h-8 rounded-lg flex items-center p-0 justify-center"
                                        disabled={updateItem.isPending}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUpdateQuantity(
                                                orderItem.id,
                                                orderItem.item.id,
                                                orderItem.quantity - 1,
                                            )
                                        }}
                                    >
                                        <Minus
                                            size={16}
                                            className="text-gray-700"
                                        />
                                    </Button>
                                    <span className="text-base font-medium w-8 text-center">
                                        {orderItem.quantity}
                                    </span>
                                    <Button
                                        className="w-8 h-8 rounded-lg flex items-center p-0 justify-center"
                                        disabled={updateItem.isPending}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUpdateQuantity(
                                                orderItem.id,
                                                orderItem.item.id,
                                                orderItem.quantity + 1,
                                            )
                                        }}
                                    >
                                        <Plus
                                            size={16}
                                            className="text-gray-700"
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom fixed bar */}
            <div className="fixed flex justify-between items-start bottom-0 h-20 left-0 right-0 py-2 px-4 bg-white border-t">
                <div>
                    <p className="text-primary font-bold">
                        {getTotalPrice().toLocaleString()}{' '}
                        {order.net_price[0]?.currency.name || 'UZS'}
                    </p>
                    <p className="text-xs font-light">Общая сумма:</p>
                </div>
                <Button
                    variant="solid"
                    shape="round"
                    className="w-auto min-w-32 font-medium"
                    disabled={cart.length === 0}
                    onClick={goToCheckout}
                >
                    Оформление заказ
                </Button>
            </div>
        </div>
    )
}
