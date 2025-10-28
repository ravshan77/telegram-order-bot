import {
    useUpdateOrderItem,
    useDeleteOrderItem,
    useNotApprovedOrder,
} from '@/entities/order'
import React from 'react'
import toast from 'react-hot-toast'
import { GoBack } from '@/shared/ui/kit-pro'
import { useNavigate } from 'react-router-dom'
import { BasketItem } from '@/widgets/BasketItem'
import { getCheckoutPath } from '@/shared/config/'
import { Button, Spinner, Alert } from '@/shared/ui/kit'
import { numericFormat } from '@/shared/lib/numericFormat'
import useBotConfigStore from '@/shared/store/useBotConfigStore'

export const BasketPage: React.FC = () => {
    const navigate = useNavigate()
    const { data: order, isLoading, isError, error } = useNotApprovedOrder()
    const { botConfigs } = useBotConfigStore()

    const updateItem = useUpdateOrderItem()
    const deleteItem = useDeleteOrderItem()

    const cart = order?.items ?? []
    const is_active_products = cart?.filter((itm) => !itm?.is_deleted)

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
                id: order?.id,
                position_id: positionId,
                item: {
                    item_id: itemId,
                    quantity: newQuantity,
                },
            })
        } catch (err: any) {
            console.log(err)
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
                id: order?.id,
                position_id: positionId,
            })
        } catch (err: any) {
            console.log(err)
        }
    }

    const goToCheckout = () => {
        if (!order || cart?.length === 0) {
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
        if (error.message === 'Заказ не найден') {
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
            <div className="p-4">
                <Alert showIcon type="danger">
                    {error?.message}
                </Alert>
            </div>
        )
    }

    if (!order || cart.length === 0 || is_active_products.length === 0) {
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
                    {is_active_products?.map((orderItem) => (
                        <BasketItem
                            key={orderItem?.id}
                            item={orderItem}
                            updating={updateItem.isPending}
                            deleting={deleteItem.isPending}
                            onRemove={handleRemove}
                            onUpdateQuantity={handleUpdateQuantity}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom fixed bar */}
            <div className="fixed flex justify-between items-start bottom-0 h-20 left-0 right-0 py-2 px-4 bg-white border-t">
                {botConfigs?.display_item_prices ? (
                    <div>
                        <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                            {order?.net_price?.map((prc) => {
                                return (
                                    <span
                                        key={prc.currency.id}
                                        className="font-bold flex text-primary"
                                    >
                                        {numericFormat(prc?.amount)}{' '}
                                        {prc?.currency?.name}
                                    </span>
                                )
                            })}
                        </div>
                        <p className="text-xs font-light">Общая сумма:</p>
                    </div>
                ) : null}
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
