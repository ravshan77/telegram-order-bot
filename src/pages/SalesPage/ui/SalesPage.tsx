import dayjs from 'dayjs'
import { useSales } from '@/entities/sales'
import { MoreHorizontal } from 'lucide-react'
import { getSaleDetailPath } from '@/shared/config'
import { Button, Spinner, Alert, Input } from '@/shared/ui/kit'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

export const SalesPage = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const today = dayjs().startOf('day').format('YYYY-MM-DD')
    const urlDateStart = searchParams.get('date_start')
    const urlDateEnd = searchParams.get('date_end')

    const initialDateStart = urlDateStart ? urlDateStart : today
    const initialDateEnd = urlDateEnd ? urlDateEnd : today

    const [filters, setFilters] = useState<{
        date_start: string | null
        date_end: string | null
    }>({
        date_start: initialDateStart,
        date_end: initialDateEnd,
    })

    useEffect(() => {
        const params: Record<string, string> = {}

        if (filters.date_start && dayjs(filters.date_start).isValid()) {
            params.date_start = dayjs(filters.date_start).format('YYYY-MM-DD')
        }

        if (filters.date_end && dayjs(filters.date_end).isValid()) {
            params.date_end = dayjs(filters.date_end).format('YYYY-MM-DD')
        }

        setSearchParams(params)
    }, [filters, setSearchParams])

    const apiParams: Record<string, string> = {}

    if (filters?.date_start && dayjs(filters.date_start).isValid()) {
        apiParams.date_time_start = dayjs(filters.date_start).format(
            'YYYY-MM-DD',
        )
    }

    if (filters?.date_end && dayjs(filters.date_end).isValid()) {
        apiParams.date_time_end = dayjs(filters.date_end).format('YYYY-MM-DD')
    }

    const shouldFetch =
        !!filters.date_start &&
        !!filters.date_end &&
        dayjs(filters.date_start).isValid() &&
        dayjs(filters.date_end).isValid()

    const {
        data: sales,
        isLoading,
        isError,
        error,
    } = useSales(apiParams, {
        enabled: shouldFetch,
    })

    const goToSaleDetail = useCallback(
        (saleId: string) => {
            const dateStart = filters.date_start
                ? dayjs(filters.date_start).format('YYYY-MM-DD')
                : undefined
            const dateEnd = filters.date_end
                ? dayjs(filters.date_end).format('YYYY-MM-DD')
                : undefined

            navigate(getSaleDetailPath(saleId, dateStart, dateEnd))
        },
        [navigate, filters],
    )

    if (isError) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки продаж: {error?.message}
                </Alert>
            </div>
        )
    }

    const total_currency_sum = sales?.length
        ? Object.values(
              sales.reduce(
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

    const handleFilter = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        // if (e.target.name === 'date_start') {
        //     setFilters({ date_start: e.target.value, date_end: null })
        //     return
        // }
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="pb-32">
            <div>
                <div className="mb-3">
                    <h2 className="text-lg font-semibold pb-2">Продажи</h2>
                    <div className="flex items-center justify-between gap-2 text-sm">
                        <Input
                            type="date"
                            name="date_start"
                            value={filters?.date_start}
                            onChange={handleFilter}
                        />

                        <Input
                            type="date"
                            name="date_end"
                            value={filters?.date_end}
                            onChange={handleFilter}
                        />
                    </div>
                </div>

                <div className="space-y-4 mb-4 overflow-y-auto">
                    {isLoading && (
                        <div className="flex justify-center items-center h-72">
                            <Spinner size={40} />
                        </div>
                    )}

                    {!isLoading && sales?.length === 0 ? (
                        <div className="h-72 flex flex-col items-center justify-center">
                            <p className="text-gray-500">
                                У вас пока нет продаж
                            </p>
                        </div>
                    ) : (
                        sales?.map((sale) => {
                            // Calculate payment total
                            const paymentTotal =
                                sale.payment?.debt_states.reduce(
                                    (sum, debt) => sum + debt.amount,
                                    0,
                                ) || 0

                            // Calculate debt (total - payment)
                            const totalAmount =
                                sale?.net_price?.reduce(
                                    (sum, debt) => sum + debt.amount,
                                    0,
                                ) || 0
                            const debtAmount = totalAmount - paymentTotal

                            return (
                                <div
                                    key={sale.id}
                                    className="border p-3 rounded-2xl cursor-pointer"
                                    onClick={() => goToSaleDetail(sale.id)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm text-gray-600">
                                            № {sale.number}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">
                                                {dayjs(sale.date).format(
                                                    'DD.MM.YYYY',
                                                )}
                                            </span>
                                            <Button
                                                variant="plain"
                                                size="xs"
                                                icon={
                                                    <MoreHorizontal size={20} />
                                                }
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">
                                                Сумма
                                            </span>
                                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                {sale.net_price?.map((crn) => (
                                                    <span
                                                        key={crn?.currency.id}
                                                        className="text-base font-bold text-gray-600"
                                                    >
                                                        {crn?.amount?.toLocaleString()}{' '}
                                                        {crn?.currency.name}
                                                    </span>
                                                )) ?? (
                                                    <>
                                                        <span className="text-base font-bold text-gray-600">
                                                            0
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">
                                                Оплата
                                            </span>
                                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                {sale.payment?.debt_states?.map(
                                                    (crn) => (
                                                        <span
                                                            key={
                                                                crn?.currency.id
                                                            }
                                                            className="text-base font-bold text-gray-600"
                                                        >
                                                            {crn?.amount?.toLocaleString()}{' '}
                                                            {crn?.currency.name}
                                                        </span>
                                                    ),
                                                ) ?? (
                                                    <>
                                                        <span className="text-base font-bold text-gray-600">
                                                            0
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <span className="text-sm text-gray-600">
                                            В долг:
                                        </span>
                                        <span className="text-base font-bold text-red-500">
                                            {debtAmount > 0 ? '-' : ''}
                                            {Math.abs(
                                                debtAmount,
                                            ).toLocaleString()}{' '}
                                            {sale.net_price[0]?.currency.name ||
                                                'UZS'}
                                        </span>
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
                            Общая сумма:
                        </span>
                        <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                            {total_currency_sum?.map((crn) => (
                                <span
                                    key={crn?.currency_name}
                                    className="text-sm font-semibold text-primary"
                                >
                                    {crn?.total_sum?.toLocaleString()}{' '}
                                    {crn?.currency_name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesPage
