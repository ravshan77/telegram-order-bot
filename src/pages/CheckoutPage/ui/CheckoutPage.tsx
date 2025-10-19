import dayjs from 'dayjs'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Spinner, Alert } from '@/shared/ui/kit'
import { SingleValue } from 'react-select'
import { GoBack } from '@/shared/ui/kit-pro'
import { Input } from '@/shared/ui/kit/Input'
import { Dot, MapPinPlus } from 'lucide-react'
import { Select } from '@/shared/ui/kit/Select'
import { Form, FormItem } from '@/shared/ui/kit/Form'
import { getDeliveryAddressPath, getOrdersPath } from '@/shared/config'
import { useNotApprovedOrder, useApproveOrder } from '@/entities/order'
import { useDeliveryAddresses } from '@/entities/deliveryAddress'

const paymentOptions: Option[] = [
    { value: '1', label: 'Наличные' },
    { value: '2', label: 'Карта' },
    { value: '3', label: 'Перевод' },
]

type Option = {
    value: string
    label: string
}

interface FormDataType {
    paymentType: Option | null
    locationType: Option | null
    orderDate: string | null
    additionalInfo: string | null
}

export const CheckoutPage = () => {
    const navigate = useNavigate()
    const today = dayjs().format('YYYY-MM-DD')

    // Get active order
    const {
        data: order,
        isLoading: isLoadingOrder,
        isError: isErrorOrder,
        error: orderError,
    } = useNotApprovedOrder()

    // Get delivery addresses
    const { data: addresses } = useDeliveryAddresses()

    // Approve order mutation
    const approveOrder = useApproveOrder()

    const [formData, setFormData] = useState<FormDataType>({
        paymentType: null,
        locationType: null,
        orderDate: today,
        additionalInfo: '',
    })

    // Convert locations to select options
    const locationOptions: Option[] =
        addresses?.locations?.map((loc) => ({
            value: loc.id,
            label: loc.name,
        })) || []

    // Set default location
    useState(() => {
        const defaultLocation = addresses?.locations?.find(
            (loc) => loc.is_default,
        )
        if (defaultLocation && !formData.locationType) {
            setFormData((prev) => ({
                ...prev,
                locationType: {
                    value: defaultLocation.id,
                    label: defaultLocation.name,
                },
            }))
        }
    })

    const handleSubmitOrder = async () => {
        if (!order) {
            toast.error('Корзина пуста')
            return
        }

        if (!formData.orderDate) {
            toast.error('Выберите дату заказа')
            return
        }

        try {
            await approveOrder.mutateAsync({
                id: order.id,
                date: formData.orderDate,
                comment: formData.additionalInfo || '',
                location_id: formData.locationType?.value || null,
                payment_type: formData.paymentType
                    ? Number(formData.paymentType.value)
                    : null,
            })

            toast.success('Заказ успешно оформлен!')
            navigate(getOrdersPath())
        } catch (err: any) {
            toast.error(err.message || 'Ошибка при оформлении заказа')
        }
    }

    const getTotalPrice = () => {
        if (!order) return 0
        return order.items.reduce(
            (sum, item) => sum + item.net_price.amount * item.quantity,
            0,
        )
    }

    if (isLoadingOrder) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    if (isErrorOrder || !order) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    {orderError?.message || 'Заказ не найден'}
                </Alert>
            </div>
        )
    }

    const totalAmount = getTotalPrice()
    const uzsAmount = `${totalAmount.toLocaleString()} сум`
    const usdAmount = `${(totalAmount / 12500).toFixed(2)}$`

    return (
        <div className="pb-32 h-full relative">
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
                            <Input
                                type="date"
                                placeholder="Введите"
                                value={formData.orderDate || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        orderDate: e.target.value,
                                    })
                                }
                            />
                        </FormItem>

                        <FormItem label="Локация">
                            <div className="flex gap-1">
                                <Select
                                    placeholder="Выберите адрес"
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
                                <Link to={getDeliveryAddressPath()}>
                                    <Button icon={<MapPinPlus />} />
                                </Link>
                            </div>
                        </FormItem>

                        <FormItem label="Дополнительная информация">
                            <Input
                                textArea
                                rows={4}
                                placeholder="Введите дополнительную информацию"
                                value={formData.additionalInfo || ''}
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

                <div className="w-full bg-white absolute flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-3 px-0 border-t">
                    <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                        <span className="text-sm text-gray-600">
                            Общая сумма:
                        </span>
                        <div className="text-right">
                            <p className="font-bold flex text-primary">
                                {usdAmount} <Dot /> {uzsAmount}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="solid"
                        className="w-full mt-2 rounded-lg font-medium"
                        disabled={
                            !formData.orderDate ||
                            approveOrder.isPending ||
                            order.items.length === 0
                        }
                        loading={approveOrder.isPending}
                        onClick={handleSubmitOrder}
                    >
                        Оформить
                    </Button>
                </div>
            </div>
        </div>
    )
}

// import dayjs from 'dayjs'
// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { Button } from '@/shared/ui/kit'
// import { SingleValue } from 'react-select'
// import { GoBack } from '@/shared/ui/kit-pro'
// import { Input } from '@/shared/ui/kit/Input'
// import { Dot, MapPinPlus } from 'lucide-react'
// import { Select } from '@/shared/ui/kit/Select'
// import { Form, FormItem } from '@/shared/ui/kit/Form'
// import { getDeliveryAddressPath } from '@/shared/config'
// import { useCartStore } from '@/shared/store/useCartStore'
// import AsyncSelect from 'react-select/async'

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
//     orderDate: string | null
//     additionalInfo: string | null
// }

// export const CheckoutPage = () => {
//     const getTotalPrice = useCartStore((state) => state.getTotalPrice)
//     const cart = useCartStore((state) => state.cart)
//     const today = dayjs().format('YYYY-MM-DD')

//     const [formData, setFormData] = useState<FormDataType>({
//         paymentType: null as Option | null,
//         locationType: locationOptions[0],
//         orderDate: today,
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

//     // DeliveryAddressdan get all qilib barcha locationlarni olib kelishi kerak loadOptions
//     const loadOptions = async (inputValue: string): Promise<Option[]> => {
//         if (!inputValue) return []

//         try {
//             // API ga request yuborish
//             const response = await fetch(
//                 `/api/search?q=${encodeURIComponent(inputValue)}`,
//             )
//             const data = await response.json()

//             // Data ni Select formatiga o'tkazish
//             return data.map((item: any) => ({
//                 value: item.id,
//                 label: item.name,
//             }))
//         } catch (error) {
//             console.error('Xato:', error)
//             return []
//         }
//     }

//     return (
//         <div className="pb-32 h-full relative">
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
//                             <Input
//                                 type="date"
//                                 placeholder="Введите"
//                                 value={
//                                     formData.orderDate
//                                         ? String(formData.orderDate)
//                                         : null
//                                 }
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         additionalInfo: e.target.value,
//                                     })
//                                 }
//                             />
//                         </FormItem>

//                         <FormItem label="Локация async">
//                             <div className="flex gap-1">
//                                 <Select
//                                     componentAs={AsyncSelect}
//                                     loadOptions={loadOptions}
//                                     value={formData.locationType}
//                                     placeholder="Izlang..."
//                                     // isSearchable
//                                     // isClearable
//                                     onChange={(option: SingleValue<Option>) =>
//                                         setFormData({
//                                             ...formData,
//                                             locationType: option,
//                                         })
//                                     }
//                                 />
//                                 <Link to={getDeliveryAddressPath()}>
//                                     <Button icon={<MapPinPlus />} />
//                                 </Link>
//                             </div>
//                         </FormItem>

//                         {/* <FormItem label="Локация">
//                             <div className="flex gap-1">
//                                 <Select
//                                     placeholder="Выберите"
//                                     options={locationOptions}
//                                     isSearchable={false}
//                                     value={formData.locationType}
//                                     onChange={(option: SingleValue<Option>) =>
//                                         setFormData({
//                                             ...formData,
//                                             locationType: option,
//                                         })
//                                     }
//                                 />
//                                 <Link to={getDeliveryAddressPath()}>
//                                     <Button icon={<MapPinPlus />} />
//                                 </Link>
//                             </div>
//                         </FormItem> */}

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

//                 <div className="w-full bg-white absolute flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-3 px-0 border-t">
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
