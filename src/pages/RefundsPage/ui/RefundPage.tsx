import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import { MoreHorizontal } from 'lucide-react'
import { useRefunds } from '@/entities/refund'
import { getRefundDetailPath } from '@/shared/config'
import { useCallback, useEffect, useState } from 'react'
import { Button, Spinner, Alert, Input } from '@/shared/ui/kit'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { numericFormat } from '@/shared/lib/numericFormat'

type FilterKey = 'date_time_start' | 'date_time_end'

export const RefundsPage = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const today = dayjs().format('YYYY-MM-DD')
    const urlDateStart = searchParams.get('date_time_start')
    const urlDateEnd = searchParams.get('date_time_end')
    const initialDateStart = urlDateStart ?? today
    const initialDateEnd = urlDateEnd ?? today

    const [filters, setFilters] = useState({
        date_time_start: initialDateStart,
        date_time_end: initialDateEnd,
    })

    useEffect(() => {
        const params: Record<string, string> = {}

        if (filters.date_time_start) {
            params.date_time_start = dayjs(filters.date_time_start).format(
                'YYYY-MM-DD',
            )
        }

        if (filters.date_time_end) {
            params.date_time_end = dayjs(filters.date_time_end).format(
                'YYYY-MM-DD',
            )
        }

        setSearchParams(params)
    }, [filters, setSearchParams])

    const apiParams = {
        date_time_start: filters.date_time_start,
        date_time_end: filters.date_time_end,
    }

    const shouldFetch =
        !!filters.date_time_start &&
        !!filters.date_time_end &&
        dayjs(filters.date_time_start).isValid() &&
        dayjs(filters.date_time_end).isValid()

    const {
        data: refunds,
        isLoading,
        isError,
        error,
    } = useRefunds(apiParams, {
        enabled: shouldFetch,
    })

    const goToRefundDetail = useCallback(
        (returnId: string) => {
            const dateStart = filters.date_time_start
                ? dayjs(filters.date_time_start).format('YYYY-MM-DD')
                : undefined
            const dateEnd = filters.date_time_end
                ? dayjs(filters.date_time_end).format('YYYY-MM-DD')
                : undefined

            navigate(getRefundDetailPath(returnId, dateStart, dateEnd))
        },
        [navigate, filters],
    )

    if (isError) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки возврат: {error?.message}
                </Alert>
            </div>
        )
    }

    const total_currency_sum = refunds?.length
        ? Object.values(
              refunds.reduce(
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

    const handleFilter = (date: Date | null, name: string) =>
        setFilters((prev) => ({
            ...prev,
            [name]: dayjs(date).format('YYYY-MM-DD'),
        }))
    const selected = (name: FilterKey) =>
        filters[name] ? dayjs(filters[name], 'YYYY-MM-DD').toDate() : null
    const date_value = (name: FilterKey) =>
        dayjs(filters[name]).format('DD.MM.YYYY')

    return (
        <div className="pb-32">
            <div>
                <div className="mb-3">
                    <h2 className="text-lg font-semibold pb-2">Возврат</h2>
                    <div className="flex items-center justify-between gap-2 text-sm">
                        <DatePicker
                            selected={selected('date_time_start')}
                            dateFormat="dd.MM.yyyy"
                            name="date_time_start"
                            disabledKeyboardNavigation={true}
                            placeholderText="от"
                            popperPlacement="bottom-end"
                            customInput={
                                <Input
                                    readOnly
                                    value={date_value('date_time_start')}
                                    inputMode="none"
                                    onFocus={(e) => e.target.blur()}
                                />
                            }
                            onChange={(date) =>
                                handleFilter(date, 'date_time_start')
                            }
                        />

                        <DatePicker
                            selected={selected('date_time_end')}
                            dateFormat="dd.MM.yyyy"
                            disabledKeyboardNavigation={true}
                            placeholderText="до"
                            popperPlacement="bottom-start"
                            customInput={
                                <Input
                                    readOnly
                                    value={date_value('date_time_end')}
                                    inputMode="none"
                                    onFocus={(e) => e.target.blur()}
                                />
                            }
                            onChange={(date) =>
                                handleFilter(date, 'date_time_end')
                            }
                        />
                    </div>
                </div>

                <div className="space-y-4 mb-4 overflow-y-auto">
                    {isLoading && (
                        <div className="flex justify-center items-center h-72">
                            <Spinner size={40} />
                        </div>
                    )}

                    {!isLoading && refunds?.length === 0 ? (
                        <div className="h-72 flex flex-col items-center justify-center">
                            <p className="text-gray-500">
                                У вас пока нет возврат
                            </p>
                        </div>
                    ) : (
                        refunds?.map((sale) => {
                            // Calculate payment total
                            const paymentTotal =
                                sale?.payment?.debt_states.reduce(
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
                                    onClick={() => goToRefundDetail(sale.id)}
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
                                                        {numericFormat(
                                                            crn?.amount,
                                                        )}{' '}
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
                                                            {numericFormat(
                                                                crn?.amount,
                                                            )}{' '}
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
                                            {numericFormat(debtAmount)}{' '}
                                            {sale?.net_price[0]?.currency
                                                ?.name || 'UZS'}
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
                                    {numericFormat(crn?.total_sum)}{' '}
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

export default RefundsPage
