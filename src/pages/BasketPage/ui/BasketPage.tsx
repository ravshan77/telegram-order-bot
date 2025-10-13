import { Button } from '@/shared/ui/kit'
// import { SingleValue } from 'react-select'
import { Product } from '@/entities/product'
import { GoBack } from '@/shared/ui/kit-pro'
// import { Input } from '@/shared/ui/kit/Input'
import { useNavigate } from 'react-router-dom'
// import { Select } from '@/shared/ui/kit/Select'
// import { Drawer } from '@/shared/ui/kit/Drawer'
import { getCheckoutPath, getProductPath } from '@/shared/config'
import { Minus, Plus, Trash2 } from 'lucide-react'
import React, { useCallback } from 'react'
// import { Form, FormItem } from '@/shared/ui/kit/Form'
// import { DatePicker } from '@/shared/ui/kit/DatePicker'
import { useCartStore } from '@/shared/store/useCartStore'
// import { SheetDemo } from './SheetDriver'

// const paymentOptions: Option[] = [
//     { value: 'cash', label: 'Наличные' },
//     { value: 'card', label: 'Карта' },
//     { value: 'transfer', label: 'Перевод' },
// ]

// type Option = {
//     value: string
//     label: string
// }

// interface FormDataType {
//     paymentType: Option | null
//     orderDate: Date | null
//     additionalInfo: string | null
// }

export const BasketPage: React.FC = () => {
    const cart = useCartStore((state) => state.cart)
    const navigate = useNavigate()
    const removeFromCart = useCartStore((state) => state.removeFromCart)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const getTotalPrice = useCartStore((state) => state.getTotalPrice)
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)

    // const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    // const [formData, setFormData] = useState<FormDataType>({
    //     paymentType: null as Option | null,
    //     orderDate: null,
    //     additionalInfo: '',
    // })

    const goShowProduct = useCallback(
        (product: Product) => {
            setSelectedProduct(product)
            navigate(getProductPath(product.id))
        },
        [navigate, setSelectedProduct],
    )

    const goToCheckOut = () => navigate(getCheckoutPath())

    // const handleCloseDrawer = () => {
    //     setIsDrawerOpen(false)
    // }

    // const handleSubmitOrder = () => {
    //     console.log('Order submitted:', {
    //         cart,
    //         totalPrice: getTotalPrice(),
    //         ...formData,
    //     })
    //     // Здесь можно добавить логику отправки заказа
    //     handleCloseDrawer()
    // }

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

    // const totalAmount = getTotalPrice()
    // const uzsAmount = `${totalAmount.toLocaleString()} сум`
    // const usdAmount = `${(totalAmount / 12500).toFixed(2)}$`

    return (
        <div className="pb-16">
            {/* <SheetDemo open={isDrawerOpen} setOpen={setIsDrawerOpen} /> */}
            {/* Header */}
            <div className="bg-white w-full">
                <GoBack />
            </div>

            {/* Cart Items */}
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
                                    <p className="text-sm font-bold text-cyan-600 mb-1">
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
                                        className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
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
                                        removeFromCart(item.id)
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
            <div className="header-wrapper fixed flex justify-between items-start bottom-0 h-20 left-0 right-0 py-2 bg-white border-t">
                <div>
                    <p className="text-cyan-500 font-bold">
                        {getTotalPrice().toLocaleString()} UZS
                    </p>
                    <p className="text-xs font-light">Общая сумма:</p>
                </div>
                <Button
                    variant="solid"
                    className="w-auto min-w-32 rounded-lg font-medium"
                    onClick={goToCheckOut}
                >
                    Оформление заказ
                </Button>
            </div>

            {/* Order Form Drawer */}
            {/* <Drawer
                isOpen={isDrawerOpen}
                placement="bottom"
                height="auto"
                closable={true}
                title="Оформление заказа"
                bodyClass="pb-6"
                headerClass="border-b"
                onClose={handleCloseDrawer}
            >
                <div className="space-y-4">
                    <Form>
                        <FormItem asterisk label="Выберите тип оплаты">
                            <Select
                                placeholder="Выберите"
                                options={paymentOptions}
                                isSearchable={false}
                                value={formData.paymentType}
                                onChange={(option: SingleValue<Option>) =>
                                    setFormData({
                                        ...formData,
                                        paymentType: option,
                                    })
                                }
                            />
                        </FormItem>

                        <FormItem asterisk label="Дата заказа">
                            <DatePicker
                                placeholder="Выберите"
                                value={formData.orderDate}
                                onChange={(date) =>
                                    setFormData({
                                        ...formData,
                                        orderDate: date,
                                    })
                                }
                            />
                        </FormItem>

                        <FormItem label="Дополнительная информация">
                            <Input
                                textArea
                                rows={4}
                                placeholder="Введите дополнительную информацию"
                                value={formData.additionalInfo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        additionalInfo: e.target.value,
                                    })
                                }
                            />
                        </FormItem>
                    </Form>

                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Общая сумма:
                            </span>
                            <div className="text-right">
                                <p className="text-base font-bold text-cyan-600">
                                    {usdAmount}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {uzsAmount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="solid"
                        className="w-full rounded-lg font-medium"
                        disabled={!formData.paymentType || !formData.orderDate}
                        onClick={handleSubmitOrder}
                    >
                        Оформить
                    </Button>
                </div>
            </Drawer> */}
        </div>
    )
}
