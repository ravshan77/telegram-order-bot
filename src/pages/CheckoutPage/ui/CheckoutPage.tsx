import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { SingleValue } from 'react-select'
import DatePicker from 'react-datepicker'
import { GoBack } from '@/shared/ui/kit-pro'
import { useEffect, useState } from 'react'
import { Input } from '@/shared/ui/kit/Input'
import { SelectOption } from '@/shared/types'
import { Select } from '@/shared/ui/kit/Select'
import { useNavigate } from 'react-router-dom'
import { getOrdersPath } from '@/shared/config'
import { formatHour } from '@/shared/lib/DateFormat'
import { Form, FormItem } from '@/shared/ui/kit/Form'
import { Button, Spinner, Alert } from '@/shared/ui/kit'
import { numericFormat } from '@/shared/lib/numericFormat'
import useBotConfigStore from '@/shared/store/useBotConfigStore'
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
    const { botConfigs } = useBotConfigStore()

    const current_hour = dayjs().hour()

    const is_accept_order =
        botConfigs?.order_acceptance_time_hour_start &&
        botConfigs?.order_acceptance_time_hour_end &&
        current_hour >= botConfigs.order_acceptance_time_hour_start &&
        current_hour <= botConfigs.order_acceptance_time_hour_end

    const {
        data: order,
        isLoading: isLoadingOrder,
        isError: isErrorOrder,
        error: orderError,
    } = useNotApprovedOrder()

    const { data: addresses } = useDeliveryAddresses()
    const approveOrder = useApproveOrder()

    const filteredPayments = paymentOptions.filter((opt) =>
        botConfigs?.order_allowed_payment_types.includes(Number(opt.value)),
    )

    const [formData, setFormData] = useState<FormDataType>({
        paymentType: filteredPayments[0],
        locationType: null,
        orderDate: today,
        additionalInfo: '',
    })

    const locationOptions: SelectOption<string>[] =
        addresses?.locations?.map((loc) => ({
            value: loc?.id,
            label: loc?.name,
        })) || []

    const defaultLocation = addresses?.locations?.find((loc) => loc?.is_default)

    useEffect(() => {
        if (defaultLocation && !formData?.locationType) {
            setFormData((prev) => ({
                ...prev,
                locationType: {
                    value: defaultLocation?.id,
                    label: defaultLocation?.name,
                },
            }))
        }
    }, [addresses?.locations])

    const handleSubmitOrder = async () => {
        if (botConfigs?.has_order_acceptance_time) {
            if (!is_accept_order) {
                toast.error(
                    `Заказы можно размещать только с ${formatHour(botConfigs?.order_acceptance_time_hour_start)}:00 до ${formatHour(botConfigs?.order_acceptance_time_hour_end)}:00!`,
                )
                return
            }
        }
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
                id: order?.id,
                date: formData?.orderDate,
                comment: formData?.additionalInfo || '',
                location_id: formData?.locationType?.value || null,
                payment_type: formData?.paymentType
                    ? Number(formData?.paymentType?.value)
                    : null,
            })
            navigate(getOrdersPath())
        } catch (err: any) {
            console.log(err)
        }
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

    return (
        <div className="pb-32 h-full">
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
                                options={filteredPayments}
                                isSearchable={false}
                                value={formData?.paymentType}
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
                            <DatePicker
                                dateFormat="dd.MM.yyyy"
                                name="orderDate"
                                disabledKeyboardNavigation={true}
                                popperPlacement="bottom-end"
                                selected={
                                    formData?.orderDate
                                        ? dayjs(
                                              formData?.orderDate,
                                              'YYYY-MM-DD',
                                          ).toDate()
                                        : null
                                }
                                customInput={
                                    <Input
                                        readOnly
                                        value={dayjs(formData.orderDate).format(
                                            'DD.MM.YYYY',
                                        )}
                                        inputMode="none"
                                        style={{
                                            width: 'calc(100vw - 34px)',
                                        }}
                                        className=""
                                        onFocus={(e) => e.target.blur()}
                                    />
                                }
                                onChange={(date) =>
                                    setFormData({
                                        ...formData,
                                        orderDate:
                                            dayjs(date).format('YYYY-MM-DD'),
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
                                value={formData?.locationType}
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
                                value={formData?.additionalInfo || ''}
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

                <div className="w-full bg-white fixed flex flex-col h-36 bottom-0 left-0 right-0 py-3 space-y-3 pb-3 px-4 border-t">
                    <div className="w-full h-10 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                        <span className="text-sm text-gray-600">
                            Общая сумма:
                        </span>
                        <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                            {order.net_price.map((prc) => {
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
                    </div>
                    <Button
                        variant="solid"
                        className="w-full rounded-lg font-medium"
                        disabled={
                            !formData?.orderDate ||
                            approveOrder?.isPending ||
                            order?.items?.length === 0
                        }
                        loading={approveOrder?.isPending}
                        onClick={handleSubmitOrder}
                    >
                        Оформить
                    </Button>
                </div>
            </div>
        </div>
    )
}
