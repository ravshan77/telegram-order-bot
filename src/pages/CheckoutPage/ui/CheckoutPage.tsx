import dayjs from 'dayjs'
import { useState } from 'react'
import { Dot } from 'lucide-react'
import toast from 'react-hot-toast'
import { SingleValue } from 'react-select'
import { GoBack } from '@/shared/ui/kit-pro'
import { Input } from '@/shared/ui/kit/Input'
import { SelectOption } from '@/shared/types'
import { Select } from '@/shared/ui/kit/Select'
import { useNavigate } from 'react-router-dom'
import { getOrdersPath } from '@/shared/config'
import { Form, FormItem } from '@/shared/ui/kit/Form'
import { Button, Spinner, Alert } from '@/shared/ui/kit'
import { useDeliveryAddresses } from '@/entities/deliveryAddress'
import { useNotApprovedOrder, useApproveOrder } from '@/entities/order'
import { paymentOptions } from '@/shared/config/constants/paymentTypes.constant'

interface FormDataType {
    paymentType: SelectOption<string> | null
    locationType: SelectOption<string> | null
    orderDate: string | null
    additionalInfo: string | null
}

export const CheckoutPage = () => {
    const navigate = useNavigate()
    const today = dayjs().format('YYYY-MM-DD')

    const {
        data: order,
        isLoading: isLoadingOrder,
        isError: isErrorOrder,
        error: orderError,
    } = useNotApprovedOrder()

    const { data: addresses } = useDeliveryAddresses()

    const approveOrder = useApproveOrder()

    const [formData, setFormData] = useState<FormDataType>({
        paymentType: paymentOptions[0],
        locationType: null,
        orderDate: today,
        additionalInfo: '',
    })

    const locationOptions: SelectOption<string>[] =
        addresses?.locations?.map((loc) => ({
            value: loc.id,
            label: loc.name,
        })) || []

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
    const uzsAmount = `${totalAmount.toLocaleString()} UZS`
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
                                onChange={(
                                    option: SingleValue<SelectOption<string>>,
                                ) =>
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
                                className="text-start"
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
                            <Select
                                placeholder="Выберите адрес"
                                className="w-full"
                                options={locationOptions}
                                isSearchable={false}
                                value={formData.locationType}
                                onChange={(
                                    option: SingleValue<SelectOption<string>>,
                                ) =>
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

                <div className="m-4 bg-white fixed flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-3 px-0 border-t">
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
