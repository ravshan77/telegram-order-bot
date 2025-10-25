import dayjs from 'dayjs'
import { useOrder } from '@/entities/order'
import { GoBack } from '@/shared/ui/kit-pro'
import { useParams } from 'react-router-dom'
import { Alert, Spinner } from '@/shared/ui/kit'
import { paymentOptions } from '@/shared/config/constants/paymentTypes.constant'
import { numericFormat } from '@/shared/lib/numericFormat'
import { useEffect } from 'react'

export const OrderDetailsPage = () => {
    const { orderId } = useParams<{ orderId: string }>()
    const { data: order, isLoading, isError, error } = useOrder(orderId!)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [orderId])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    if (isError || !order) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки заказа: {error?.message}
                </Alert>
            </div>
        )
    }

    return (
        <div className="pb-16">
            <div>
                <div className="bg-white w-full">
                    <GoBack text={'Информация для заказа'} />
                </div>

                <div className="my-4">
                    <div className="mb-4">
                        <span
                            className={`text-xs font-semibold px-3 py-1 rounded ${
                                order?.is_approved
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-300 text-yellow-700'
                            }`}
                        >
                            {order.is_approved
                                ? 'Подтвержден'
                                : 'Не подтвержден'}
                        </span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Дата создания:
                            </span>
                            <span className="font-medium text-black">
                                {dayjs(order?.created_at).format(
                                    'DD.MM.YYYY HH:mm',
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Дата заказа:</span>
                            <span className="font-medium text-black">
                                {dayjs(order?.date).format('DD.MM.YYYY')}
                            </span>
                        </div>

                        {order?.approved_at && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Дата подтверждена:
                                </span>
                                <span className="font-medium text-black">
                                    {dayjs(order?.approved_at).format(
                                        'DD.MM.YYYY HH:mm',
                                    )}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-gray-500">Тип оплаты:</span>
                            <span className="font-medium text-black">
                                {
                                    paymentOptions?.find(
                                        (pty) =>
                                            pty?.value ==
                                            String(order?.payment_type),
                                    )?.label
                                }
                            </span>
                        </div>

                        {order.location && (
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">Адрес:</span>
                                <span className="font-medium text-black text-end hover:text-blue-500 hover:underline">
                                    {order.location.name}
                                </span>
                            </div>
                        )}

                        <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                            <span className="text-sm font-semibold">
                                Общая сумма:
                            </span>
                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {order.net_price.map((prc) => {
                                    return (
                                        <span
                                            key={`${prc?.currency.name}`}
                                            className="text-sm font-semibold flex text-primary"
                                        >
                                            {numericFormat(prc?.amount)}{' '}
                                            {prc?.currency.name}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="mb-4" />

                {order?.comment && (
                    <>
                        <div className="mb-4">
                            <h2 className="text-base font-semibold mb-3">
                                Информация о заказе
                            </h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {order.comment}
                            </p>
                        </div>
                        <hr className="mb-4" />
                    </>
                )}

                <div>
                    <h2 className="text-base font-semibold mb-4">Товары</h2>

                    <div className="space-y-4">
                        {order.items
                            .filter((itm) => !itm?.is_deleted)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className={`border p-3 rounded-2xl`}
                                >
                                    <h3 className="font-semibold text-sm mb-3">
                                        {item.item.name}
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Количество:
                                            </span>
                                            <span className="font-medium text-black">
                                                {item?.quantity} шт
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Цена за единицу:
                                            </span>
                                            <span className="font-medium text-black">
                                                {numericFormat(
                                                    item.price?.amount,
                                                )}{' '}
                                                {item.price?.currency?.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Стоимость:
                                            </span>
                                            <span className="font-semibold text-black">
                                                {numericFormat(
                                                    item.net_price.amount,
                                                )}{' '}
                                                {item.net_price.currency.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsPage
