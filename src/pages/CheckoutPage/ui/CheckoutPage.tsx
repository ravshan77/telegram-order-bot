import { useState } from 'react'
import { Button } from '@/shared/ui/kit'
import { SingleValue } from 'react-select'
import { GoBack } from '@/shared/ui/kit-pro'
import { Input } from '@/shared/ui/kit/Input'
import { Select } from '@/shared/ui/kit/Select'
import { Form, FormItem } from '@/shared/ui/kit/Form'
import { DatePicker } from '@/shared/ui/kit/DatePicker'
import { useCartStore } from '@/shared/store/useCartStore'

const paymentOptions: Option[] = [
    { value: 'cash', label: 'Наличные' },
    { value: 'card', label: 'Карта' },
    { value: 'transfer', label: 'Перевод' },
]

type Option = {
    value: string
    label: string
}

interface FormDataType {
    paymentType: Option | null
    orderDate: Date | null
    additionalInfo: string | null
}

export const CheckoutPage = () => {
    const getTotalPrice = useCartStore((state) => state.getTotalPrice)
    const cart = useCartStore((state) => state.cart)

    const [formData, setFormData] = useState<FormDataType>({
        paymentType: null as Option | null,
        orderDate: null,
        additionalInfo: '',
    })

    const handleSubmitOrder = () => {
        console.log('Order submitted:', {
            cart,
            totalPrice: getTotalPrice(),
            ...formData,
        })
        // Здесь можно добавить логику отправки заказа
    }

    const totalAmount = getTotalPrice()
    const uzsAmount = `${totalAmount.toLocaleString()} сум`
    const usdAmount = `${(totalAmount / 12500).toFixed(2)}$`

    return (
        <div className="pb-16">
            <div className="border flex flex-col justify-between border-red-500 h-full">
                <div className="bg-white w-full">
                    <GoBack text={'Оформление заказа'} />
                </div>
                <div className="mt-4">
                    <p>
                        После оформления начнутся этапы по выполнению вашего
                        заказа
                    </p>
                </div>
                <div className="mt-4">
                    <Form onSubmit={handleSubmitOrder}>
                        <FormItem label="Выберите тип оплаты">
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

                        <FormItem label="Дата заказа">
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
                </div>
            </div>
            <div className="border fixed bg-white bottom-0 left-0 w-full border-red-500">
                <div className="border border-red-500 p-4">
                    <div className="border-t py-2">
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
                        className="w-full mt-2 rounded-lg font-medium"
                        disabled={!formData.paymentType || !formData.orderDate}
                        onClick={handleSubmitOrder}
                    >
                        Оформить
                    </Button>
                </div>
            </div>
        </div>
    )
}
