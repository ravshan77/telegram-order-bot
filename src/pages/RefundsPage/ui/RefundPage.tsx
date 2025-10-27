import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import { useRefunds } from '@/entities/refund'
import { getRefundDetailPath } from '@/shared/config'
import { Spinner, Alert, Input } from '@/shared/ui/kit'
import { useCallback, useEffect, useState } from 'react'
import { numericFormat } from '@/shared/lib/numericFormat'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
                            maxDate={dayjs().toDate()}
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
                            maxDate={dayjs().toDate()}
                            minDate={dayjs(filters?.date_time_start).toDate()}
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
                            return (
                                <div
                                    key={sale.id}
                                    className="bg-white border rounded-lg shadow-sm p-3"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded ${
                                                sale.is_approved
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-50 text-yellow-400'
                                            }`}
                                        >
                                            {sale.is_approved
                                                ? 'Подтверждён'
                                                : 'Не подтверждён'}
                                        </span>

                                        <span className="font-medium text-black">
                                            {dayjs(sale?.date).format(
                                                'DD.MM.YYYY',
                                            )}
                                        </span>
                                    </div>

                                    <div
                                        className="space-y-2 text-sm cursor-pointer"
                                        onClick={() =>
                                            goToRefundDetail(sale?.id)
                                        }
                                    >
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Оплата:
                                            </span>
                                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                {sale.payment?.debt_states?.map(
                                                    (crn) => (
                                                        <span
                                                            key={
                                                                crn?.currency.id
                                                            }
                                                            className="font-medium text-black"
                                                        >
                                                            {numericFormat(
                                                                crn?.amount,
                                                            )}{' '}
                                                            {crn?.currency.name}
                                                        </span>
                                                    ),
                                                ) ?? (
                                                    <>
                                                        <span className="font-medium text-black">
                                                            0
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                В долг:
                                            </span>
                                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                {sale.net_price?.map((crn) => (
                                                    <span
                                                        key={crn?.currency.id}
                                                        className="font-medium text-red-500"
                                                    >
                                                        {numericFormat(
                                                            crn?.amount,
                                                        )}{' '}
                                                        {crn?.currency.name}
                                                    </span>
                                                )) ?? (
                                                    <>
                                                        <span className="font-medium text-black">
                                                            0
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

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
                                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                {sale.net_price.map(
                                                    (pric, ind) => {
                                                        return (
                                                            <span
                                                                key={`${pric?.currency}-${ind}`}
                                                                className="font-bold text-black"
                                                            >
                                                                {numericFormat(
                                                                    pric.amount,
                                                                )}{' '}
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
