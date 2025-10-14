import { Button } from '@/shared/ui/kit'
import React, { useCallback } from 'react'
import { Product } from '@/entities/product'
import { GoBack } from '@/shared/ui/kit-pro'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/shared/store/useCartStore'
import { getCheckoutPath, getProductPath } from '@/shared/config'

export const BasketPage: React.FC = () => {
    const cart = useCartStore((state) => state.cart)
    const navigate = useNavigate()
    const removeFromCart = useCartStore((state) => state.removeFromCart)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const getTotalPrice = useCartStore((state) => state.getTotalPrice)
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)

    const goShowProduct = useCallback(
        (product: Product) => {
            setSelectedProduct(product)
            navigate(getProductPath(product.id))
        },
        [navigate, setSelectedProduct],
    )

    const goToCheckOut = () => navigate(getCheckoutPath())

    const handleRemove = (product_id: number) => {
        const is_confirm = confirm(
            'Вы действительно собираетесь удалить этот продукт?',
        )

        if (is_confirm) {
            removeFromCart(product_id)
        }
    }

    if (cart.length === 0) {
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
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl p-4 border cursor-pointer"
                        >
                            <div
                                className="flex gap-3"
                                onClick={() => goShowProduct(item)}
                            >
                                {/* Product Image */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm font-bold text-primary mb-1">
                                        {item.price.toLocaleString()} UZS
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Цена продажи
                                    </p>
                                </div>
                            </div>

                            {/* Quantity Controls & Delete */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-start pt-1">
                                    <input
                                        defaultChecked
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        className="w-8 h-8 rounded-lg flex items-center p-0 justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1,
                                            )
                                        }}
                                    >
                                        <Minus
                                            size={16}
                                            className="text-gray-700"
                                        />
                                    </Button>
                                    <span className="text-base font-medium w-8 text-center">
                                        {item.quantity}
                                    </span>
                                    <Button
                                        className="w-8 h-8 rounded-lg flex items-center p-0 justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1,
                                            )
                                        }}
                                    >
                                        <Plus
                                            size={16}
                                            className="text-gray-700"
                                        />
                                    </Button>
                                </div>

                                <button
                                    className="p-2 text-gray-400 hover:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemove(item.id)
                                        // removeFromCart(item.id)
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom fixed bar */}
            <div className="fixed flex justify-between items-start bottom-0 h-20 left-0 right-0 py-2 px-4 bg-white border-t">
                <div>
                    <p className="text-primary font-bold">
                        {getTotalPrice().toLocaleString()} UZS
                    </p>
                    <p className="text-xs font-light">Общая сумма:</p>
                </div>
                <Button
                    variant="solid"
                    shape="round"
                    className="w-auto min-w-32 font-medium"
                    onClick={goToCheckOut}
                >
                    Оформление заказ
                </Button>
            </div>
        </div>
    )
}
