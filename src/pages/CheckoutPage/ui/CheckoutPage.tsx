import React, { useState } from 'react'
import { Button } from '@/shared/ui/kit'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/shared/store/useCartStore'

export const CheckoutPage: React.FC = () => {
    const cart = useCartStore((state) => state.cart)
    const setPage = useCartStore((state) => state.setPage)
    const clearCart = useCartStore((state) => state.clearCart)
    const removeFromCart = useCartStore((state) => state.removeFromCart)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const getTotalPrice = useCartStore((state) => state.getTotalPrice)

    const [paymentType, setPaymentType] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')

    const handleCheckout = () => {
        alert('Заказ оформлен!')
        clearCart()
        setPage('main')
    }

    return (
        <div className="pb-24">
            <div className="bg-white p-4 border-b sticky top-14 z-10">
                <Button
                    variant="plain"
                    className="text-cyan-500 mb-2"
                    onClick={() => setPage('cart')}
                >
                    Закрыт
                </Button>
                <h2 className="text-xl font-semibold">Оформление заказа</h2>
            </div>

            <div className="p-4">
                <div className="bg-white rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-3">Корзина</h3>
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 mb-3">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="text-sm">{item.name}</p>
                                <p className="text-cyan-600 font-bold">
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString()}{' '}
                                    сўм
                                </p>
                                <p className="text-xs text-gray-500">
                                    Цена продажи
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity - 1,
                                        )
                                    }
                                >
                                    <Minus size={14} />
                                </Button>
                                <span className="text-sm">{item.quantity}</span>
                                <Button
                                    className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity + 1,
                                        )
                                    }
                                >
                                    <Plus size={14} />
                                </Button>
                                <Button
                                    className="text-gray-400 ml-2"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-3">Выберите тип оплаты</h3>
                    <select
                        value={paymentType}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-cyan-500"
                        onChange={(e) => setPaymentType(e.target.value)}
                    >
                        <option value="">Выберите</option>
                        <option value="cash">Наличные</option>
                        <option value="card">Карта</option>
                    </select>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-3">Дата заказа</h3>
                    <input
                        type="date"
                        value={deliveryDate}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-cyan-500"
                        onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold mb-3">
                        Дополнительный информация
                    </h3>
                    <textarea
                        placeholder="Введите комментарий..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-cyan-500 min-h-24"
                    />
                </div>
            </div>

            <div className="fixed bottom-10 left-0 right-0 bg-white border-t p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Общая сумма:</span>
                    <span className="text-xl font-bold">
                        {getTotalPrice().toLocaleString()} сўм
                    </span>
                </div>
                <Button
                    className="w-full bg-cyan-500 text-white py-3 rounded-lg font-medium hover:bg-cyan-600"
                    onClick={handleCheckout}
                >
                    Оформить
                </Button>
            </div>
        </div>
    )
}
