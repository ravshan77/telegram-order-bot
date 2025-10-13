import { useState } from 'react'
import {
    Drawer,
    DrawerTitle,
    DrawerFooter,
    DrawerHeader,
    DrawerContent,
    DrawerDescription,
} from '@/shared/ui/kit/Sheet'
import { Button } from '@/shared/ui/kit'
import { SingleValue } from 'react-select'
import { Input } from '@/shared/ui/kit/Input'
import { Select } from '@/shared/ui/kit/Select'
import { Form, FormItem } from '@/shared/ui/kit/Form'
import { DatePicker } from '@/shared/ui/kit/DatePicker'
import { useCartStore } from '@/shared/store/useCartStore'
import useFixDrawerKeyboard from '@/shared/ui/kit/hooks/useFixDrawerKeyboard'
// import useFixDrawerKeyboard from '@/shared/ui/kit/hooks/useFixDrawerKeyboard'

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

interface BottomSheetProps {
    open: boolean
    setOpen: (prev: boolean) => void
}

export function SheetDemo({ open, setOpen }: BottomSheetProps) {
    useFixDrawerKeyboard()
    const getTotalPrice = useCartStore((state) => state.getTotalPrice)
    const cart = useCartStore((state) => state.cart)

    const [formData, setFormData] = useState<FormDataType>({
        paymentType: null as Option | null,
        orderDate: null,
        additionalInfo: '',
    })

    const handleCloseDrawer = () => {
        setOpen(false)
    }

    const handleSubmitOrder = () => {
        console.log('Order submitted:', {
            cart,
            totalPrice: getTotalPrice(),
            ...formData,
        })
        // Здесь можно добавить логику отправки заказа
        handleCloseDrawer()
    }

    const totalAmount = getTotalPrice()
    const uzsAmount = `${totalAmount.toLocaleString()} сум`
    const usdAmount = `${(totalAmount / 12500).toFixed(2)}$`

    return (
        <Drawer open={open} onOpenChange={(prew) => setOpen(prew)}>
            <DrawerContent className="bg-white mb-4">
                <div className="mx-auto w-full px-4">
                    <DrawerHeader className="p-0">
                        <DrawerTitle className="text-start text-xl">
                            Оформление заказа
                        </DrawerTitle>
                        <DrawerDescription className="text-start">
                            После оформления начнутся этапы по выполнению вашего
                            заказа
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="mt-3">
                        <Form>
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

                        <div className="border-t space-y-2">
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
                    </div>
                    <DrawerFooter>
                        <Button
                            variant="solid"
                            className="w-full rounded-lg font-medium"
                            disabled={
                                !formData.paymentType || !formData.orderDate
                            }
                            onClick={handleSubmitOrder}
                        >
                            Оформить
                        </Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
