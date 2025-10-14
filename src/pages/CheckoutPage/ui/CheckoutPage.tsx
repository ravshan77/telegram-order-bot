// VARIANT 1: Telegram MainButton ishlatish (ENG YAXSHI YECHIM)
import { useState, useEffect } from 'react'
import { SingleValue } from 'react-select'
import { GoBack } from '@/shared/ui/kit-pro'
import { Input } from '@/shared/ui/kit/Input'
import { Select } from '@/shared/ui/kit/Select'
import { Form, FormItem } from '@/shared/ui/kit/Form'
import { DatePicker } from '@/shared/ui/kit/DatePicker'
import { useCartStore } from '@/shared/store/useCartStore'
import { useTelegram } from '@/shared/lib/hooks'

const paymentOptions: Option[] = [
    { value: 'cash', label: 'Наличные' },
    { value: 'card', label: 'Карта' },
    { value: 'transfer', label: 'Перевод' },
]

const locationOptions: Option[] = [
    { value: 'map_1', label: 'Ташкент город, проспект мустакиллик, 17 дом' },
    { value: 'map_2', label: 'Самарканд город, проспект мустакиллик, 17 дом' },
]

type Option = {
    value: string
    label: string
}

interface FormDataType {
    paymentType: Option | null
    locationType: Option | null
    orderDate: Date | null
    additionalInfo: string | null
}

export const CheckoutPage = () => {
    const tg = useTelegram()
    const getTotalPrice = useCartStore((state) => state.getTotalPrice)
    const cart = useCartStore((state) => state.cart)
    const [formData, setFormData] = useState<FormDataType>({
        paymentType: null,
        locationType: null,
        orderDate: null,
        additionalInfo: '',
    })

    const totalAmount = getTotalPrice()
    const uzsAmount = `${totalAmount.toLocaleString()} сум`

    const handleSubmitOrder = () => {
        console.log('Order submitted:', {
            cart,
            totalPrice: getTotalPrice(),
            ...formData,
        })
        // Telegram bot ga yuborish
        tg?.sendData(
            JSON.stringify({
                cart,
                totalPrice: getTotalPrice(),
                ...formData,
            }),
        )
    }

    // Telegram MainButton ni sozlash
    useEffect(() => {
        if (!tg) return

        const isValid = formData.paymentType && formData.orderDate

        // Button textini sozlash
        tg.MainButton.setText(`Оформить (${uzsAmount})`)

        if (isValid) {
            tg.MainButton.enable()
            tg.MainButton.show()
        } else {
            tg.MainButton.disable()
        }

        // Click handler
        const handleClick = () => {
            if (isValid) {
                handleSubmitOrder()
            }
        }

        tg.MainButton.onClick(handleClick)

        // Cleanup
        return () => {
            tg.MainButton.hide()
            tg.MainButton.offClick(handleClick)
        }
    }, [tg, formData, uzsAmount])

    return (
        <div className="pb-8 h-full">
            {/* Main Content - Fixed bottom yo'q! */}
            <div>
                <div className="">
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

                        <FormItem label="Локация">
                            <Select
                                placeholder="Выберите"
                                options={locationOptions}
                                isSearchable={false}
                                value={formData.locationType}
                                onChange={(option: SingleValue<Option>) =>
                                    setFormData({
                                        ...formData,
                                        locationType: option,
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
        </div>
    )
}

/* 
AFZALLIKLARI:
✅ Keyboard bilan HECH QANDAY muammo yo'q
✅ Telegram'ning native buttoni
✅ Telegram theme bilan avtomatik mos keladi
✅ User experience yaxshi
✅ Code soddaroq

QANDAY ISHLAYDI:
- Telegram'ning o'z MainButton'i ishlatiladi
- Bu button har doim ekranning pastida bo'ladi
- Keyboard ochilganda avtomatik boshqariladi
- Fixed position bilan bog'liq muammolar yo'q
*/

// import { useState } from 'react'
// import { Dot } from 'lucide-react'
// import { Button } from '@/shared/ui/kit'
// import { SingleValue } from 'react-select'
// import { GoBack } from '@/shared/ui/kit-pro'
// import { Input } from '@/shared/ui/kit/Input'
// import { Select } from '@/shared/ui/kit/Select'
// import { Form, FormItem } from '@/shared/ui/kit/Form'
// import { DatePicker } from '@/shared/ui/kit/DatePicker'
// import { useCartStore } from '@/shared/store/useCartStore'

// const paymentOptions: Option[] = [
//     { value: 'cash', label: 'Наличные' },
//     { value: 'card', label: 'Карта' },
//     { value: 'transfer', label: 'Перевод' },
// ]

// const locationOptions: Option[] = [
//     { value: 'map_1', label: 'Ташкент город, проспект мустакиллик, 17 дом' },
//     { value: 'map_2', label: 'Самарканд город, проспект мустакиллик, 17 дом' },
// ]

// type Option = {
//     value: string
//     label: string
// }

// interface FormDataType {
//     paymentType: Option | null
//     locationType: Option | null
//     orderDate: Date | null
//     additionalInfo: string | null
// }

// export const CheckoutPage = () => {
//     const getTotalPrice = useCartStore((state) => state.getTotalPrice)
//     const cart = useCartStore((state) => state.cart)
//     const [formData, setFormData] = useState<FormDataType>({
//         paymentType: null as Option | null,
//         locationType: null,
//         orderDate: null,
//         additionalInfo: '',
//     })

//     const handleSubmitOrder = () => {
//         console.log('Order submitted:', {
//             cart,
//             totalPrice: getTotalPrice(),
//             ...formData,
//         })
//         // Здесь можно добавить логику отправки заказа
//     }

//     const totalAmount = getTotalPrice()
//     const uzsAmount = `${totalAmount.toLocaleString()} сум`
//     const usdAmount = `${(totalAmount / 12500).toFixed(2)}$`

//     return (
//         <div className="pb-16 h-full relative">
//             <div>
//                 <div className="">
//                     <GoBack text={'Оформление заказа'} />
//                 </div>
//                 <div className="mt-4">
//                     <p>
//                         После оформления начнутся этапы по выполнению вашего
//                         заказа
//                     </p>
//                 </div>
//                 <div className="mt-4">
//                     <Form onSubmit={handleSubmitOrder}>
//                         <FormItem label="Выберите тип оплаты">
//                             <Select
//                                 placeholder="Выберите"
//                                 options={paymentOptions}
//                                 isSearchable={false}
//                                 value={formData.paymentType}
//                                 onChange={(option: SingleValue<Option>) =>
//                                     setFormData({
//                                         ...formData,
//                                         paymentType: option,
//                                     })
//                                 }
//                             />
//                         </FormItem>

//                         <FormItem label="Дата заказа">
//                             <DatePicker
//                                 placeholder="Выберите"
//                                 value={formData.orderDate}
//                                 onChange={(date) =>
//                                     setFormData({
//                                         ...formData,
//                                         orderDate: date,
//                                     })
//                                 }
//                             />
//                         </FormItem>

//                         <FormItem label="Локация">
//                             <Select
//                                 placeholder="Выберите"
//                                 options={locationOptions}
//                                 isSearchable={false}
//                                 value={formData.locationType}
//                                 onChange={(option: SingleValue<Option>) =>
//                                     setFormData({
//                                         ...formData,
//                                         locationType: option,
//                                     })
//                                 }
//                             />
//                         </FormItem>

//                         <FormItem label="Дополнительная информация">
//                             <Input
//                                 textArea
//                                 rows={4}
//                                 placeholder="Введите дополнительную информацию"
//                                 value={formData.additionalInfo}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         additionalInfo: e.target.value,
//                                     })
//                                 }
//                             />
//                         </FormItem>
//                     </Form>
//                 </div>
//                 {/* <div
//                     className={`w-full absolute bg-white bottom-0 pt-0 left-0`}
//                 >
//                     <div className="border-t py-1">
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm text-gray-600">
//                                 Общая сумма:
//                             </span>
//                             <div className="text-right">
//                                 <p className="text-base font-bold text-primary">
//                                     {usdAmount}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                     {uzsAmount}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <Button
//                         variant="solid"
//                         className="w-full mt-2 rounded-lg font-medium"
//                         disabled={!formData.paymentType || !formData.orderDate}
//                         onClick={handleSubmitOrder}
//                     >
//                         Оформить
//                     </Button>
//                 </div> */}

//                 <div className="w-full bg-white absolute z-0 flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-0 border-t">
//                     <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
//                         <span className="text-sm text-gray-600">
//                             Общая сумма:
//                         </span>
//                         <div className="text-right">
//                             <p className=" font-bold flex text-primary">
//                                 {usdAmount} <Dot /> {uzsAmount}
//                             </p>
//                         </div>
//                     </div>
//                     <Button
//                         variant="solid"
//                         className="w-full mt-2 rounded-lg font-medium"
//                         disabled={!formData.paymentType || !formData.orderDate}
//                         onClick={handleSubmitOrder}
//                     >
//                         Оформить
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }
