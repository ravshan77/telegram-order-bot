import dayjs from 'dayjs'
import { useOrders } from '@/entities/order'
import { MoreHorizontal } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrderDetailsPath } from '@/shared/config'
import { Button, Spinner, Alert } from '@/shared/ui/kit'
import DatePickerRange from '@/shared/ui/kit/DatePicker/DatePickerRange'

export const OrdersPage = () => {
    const navigate = useNavigate()
    const today = dayjs().startOf('day').toDate()
    const [filters, setFilters] = useState<{
        date_start: Date | null
        date_end: Date | null
    }>({
        date_end: today,
        date_start: today,
    })

    const {
        data: orders,
        isLoading,
        isError,
        error,
    } = useOrders({
        date_start: dayjs(
            filters?.date_start ? filters?.date_start : '',
        ).format('YYYY-MM-DD'),
        date_end: dayjs(filters?.date_end ? filters?.date_end : '').format(
            'YYYY-MM-DD',
        ),
    })

    const goToOrderDetails = useCallback(
        (orderId: string) => navigate(getOrderDetailsPath(orderId)),
        [navigate],
    )

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки заказов: {error?.message}
                </Alert>
            </div>
        )
    }

    const total_currency_sum = orders?.length
        ? Object.values(
              orders.reduce(
                  (acc, order) => {
                      order.net_price.forEach((net) => {
                          const currencyName = net.currency.name
                          const amount = net.amount

                          if (!acc[currencyName]) {
                              acc[currencyName] = {
                                  currency_name: currencyName,
                                  total_sum: 0,
                              }
                          }

                          acc[currencyName].total_sum += amount
                      })

                      return acc
                  },
                  {} as Record<
                      string,
                      { currency_name: string; total_sum: number }
                  >,
              ),
          )
        : []

    return (
        <div className="pb-16">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Заказы</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <DatePickerRange
                            value={[filters?.date_start, filters?.date_end]}
                            closePickerOnChange={false} // End sana tanlanganda yopiladi
                            singleDate={true}
                            onChange={(e) => {
                                setFilters((prev) => ({
                                    ...prev,
                                    date_start: e[0],
                                    date_end: e[1],
                                }))
                            }}
                        />
                    </div>
                </div>
                <div className="space-y-4 mb-4 overflow-y-auto">
                    {orders?.length === 0 ? (
                        <div className="h-72 flex flex-col items-center justify-center">
                            <p className="text-gray-500">
                                У вас пока нет заказов
                            </p>
                        </div>
                    ) : (
                        orders?.map((order) => {
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white border rounded-lg shadow-sm p-3"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded ${
                                                order.is_approved
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {order.is_approved
                                                ? 'Подтверждён'
                                                : 'Не подтверждён'}
                                        </span>
                                        <Button
                                            variant="plain"
                                            size="xs"
                                            icon={<MoreHorizontal size={20} />}
                                        />
                                    </div>

                                    <h2 className="text-lg font-bold mb-3">
                                        {order?.contractor?.name || 'Заказ'}
                                    </h2>

                                    <div
                                        className="space-y-2 text-sm cursor-pointer"
                                        onClick={() =>
                                            goToOrderDetails(order?.id)
                                        }
                                    >
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Продажа:
                                            </span>
                                            <span className="font-medium text-black">
                                                {order.sale_info?.number || '-'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Дата заказа:
                                            </span>
                                            <span className="font-medium text-black">
                                                {dayjs(order.date).format(
                                                    'DD.MM.YYYY',
                                                )}
                                            </span>
                                        </div>

                                        {order.approved_at && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    Дата подтверждена:
                                                </span>
                                                <span className="font-medium text-black">
                                                    {dayjs(
                                                        order?.approved_at,
                                                    ).format('DD.MM.YYYY')}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className="flex justify-between pt-2 border-t border-dashed mt-3"
                                            style={{
                                                borderImage:
                                                    'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                            }}
                                        >
                                            <span className="text-gray-500">
                                                Общая сумма:
                                            </span>
                                            <div className="flex gap-2">
                                                {order.net_price.map(
                                                    (pric, ind) => {
                                                        return (
                                                            <span
                                                                key={`${pric?.currency}-${ind}`}
                                                                className="font-bold text-black"
                                                            >
                                                                {pric.amount.toLocaleString()}{' '}
                                                                {
                                                                    pric
                                                                        .currency
                                                                        .name
                                                                }
                                                            </span>
                                                        )
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Total Summary */}
                <div className="w-full bg-white fixed flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-4 border-t">
                    <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                        <span className="text-sm font-semibold">
                            Всего заказов:
                        </span>
                        <div className="flex gap-4">
                            {total_currency_sum?.map((crn) => {
                                return (
                                    <span
                                        key={crn?.currency_name}
                                        className="text-sm font-semibold flex text-primary"
                                    >
                                        {crn?.total_sum?.toLocaleString()}{' '}
                                        {crn?.currency_name}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
