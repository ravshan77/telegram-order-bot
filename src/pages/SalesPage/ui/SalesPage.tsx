import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import { useSales } from '@/entities/sales'
import { ApprovedStatus, getSaleDetailPath } from '@/shared/config'
import { Spinner, Alert, Input, Tag } from '@/shared/ui/kit'
import { useCallback, useEffect, useState } from 'react'
import { numericFormat } from '@/shared/lib/numericFormat'
import { useNavigate, useSearchParams } from 'react-router-dom'

type FilterKey = 'date_start' | 'date_end'

export const SalesPage = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const today = dayjs().format('YYYY-MM-DD')
    const urlDateStart = searchParams.get('date_start')
    const urlDateEnd = searchParams.get('date_end')
    const initialDateStart = urlDateStart ?? today
    const initialDateEnd = urlDateEnd ?? today

    const [filters, setFilters] = useState({
        date_start: initialDateStart,
        date_end: initialDateEnd,
    })

    useEffect(() => {
        const params: Record<string, string> = {}

        if (filters.date_start) {
            params.date_start = dayjs(filters.date_start).format('YYYY-MM-DD')
        }

        if (filters.date_end) {
            params.date_end = dayjs(filters.date_end).format('YYYY-MM-DD')
        }

        setSearchParams(params)
    }, [filters, setSearchParams])

    const apiParams = {
        date_time_start: filters.date_start,
        date_time_end: filters.date_end,
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
                    <h2 className="text-lg font-semibold pb-2">Продажи</h2>
                    <div className="flex items-center justify-between gap-2 text-sm">
                        <DatePicker
                            selected={selected('date_start')}
                            dateFormat="dd.MM.yyyy"
                            name="date_start"
                            maxDate={dayjs().toDate()}
                            disabledKeyboardNavigation={true}
                            placeholderText="от"
                            popperPlacement="bottom-end"
                            customInput={
                                <Input
                                    readOnly
                                    value={date_value('date_start')}
                                    inputMode="none"
                                    onFocus={(e) => e.target.blur()}
                                />
                            }
                            onChange={(date) =>
                                handleFilter(date, 'date_start')
                            }
                        />

                        <DatePicker
                            selected={selected('date_end')}
                            dateFormat="dd.MM.yyyy"
                            disabledKeyboardNavigation={true}
                            placeholderText="до"
                            maxDate={dayjs().toDate()}
                            minDate={dayjs(filters?.date_start).toDate()}
                            popperPlacement="bottom-start"
                            customInput={
                                <Input
                                    readOnly
                                    value={date_value('date_end')}
                                    inputMode="none"
                                    onFocus={(e) => e.target.blur()}
                                />
                            }
                            onChange={(date) => handleFilter(date, 'date_end')}
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
                            const is_excat_discount =
                                sale.exact_discounts.length > 0 ||
                                Number(sale?.percent_discount) > 0
                            return (
                                <div
                                    key={sale.id}
                                    className="bg-white border rounded-lg shadow-sm p-3"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <Tag
                                            className={
                                                ApprovedStatus[
                                                    Number(sale?.is_approved)
                                                ].bgClass
                                            }
                                        >
                                            <span
                                                className={`capitalize font-semibold ${ApprovedStatus[Number(sale?.is_approved)].textClass}`}
                                            >
                                                {
                                                    ApprovedStatus[
                                                        Number(
                                                            sale?.is_approved,
                                                        )
                                                    ].label
                                                }
                                            </span>
                                        </Tag>

                                        <span className="font-medium text-black">
                                            {dayjs(sale?.date).format(
                                                'DD.MM.YYYY',
                                            )}
                                        </span>
                                    </div>

                                    <div
                                        className="space-y-2 text-sm cursor-pointer"
                                        onClick={() => goToSaleDetail(sale?.id)}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <span className="text-xs text-gray-600">
                                                    Общая сумма:
                                                </span>

                                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                    {sale.totals.length ? (
                                                        sale.totals?.map(
                                                            (crn) => (
                                                                <span
                                                                    key={
                                                                        crn
                                                                            ?.currency
                                                                            .id
                                                                    }
                                                                    className="text-sm font-bold text-gray-600"
                                                                >
                                                                    {numericFormat(
                                                                        crn?.amount,
                                                                    )}{' '}
                                                                    {
                                                                        crn
                                                                            ?.currency
                                                                            .name
                                                                    }
                                                                </span>
                                                            ),
                                                        )
                                                    ) : (
                                                        <>
                                                            <span className="text-sm font-bold text-gray-600">
                                                                0
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-start justify-between">
                                                <span className="text-xs text-gray-600">
                                                    Скидка:
                                                </span>

                                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                    {sale.exact_discounts
                                                        .length ? (
                                                        sale.exact_discounts?.map(
                                                            (crn) => (
                                                                <span
                                                                    key={
                                                                        crn
                                                                            ?.currency
                                                                            .id
                                                                    }
                                                                    className="text-sm font-bold text-gray-600"
                                                                >
                                                                    {numericFormat(
                                                                        crn?.amount,
                                                                    )}{' '}
                                                                    {
                                                                        crn
                                                                            ?.currency
                                                                            .name
                                                                    }
                                                                </span>
                                                            ),
                                                        )
                                                    ) : (
                                                        <>
                                                            <span className="text-sm font-bold text-gray-600">
                                                                {sale?.percent_discount ? (
                                                                    <>
                                                                        {numericFormat(
                                                                            sale?.percent_discount,
                                                                        )}{' '}
                                                                        %
                                                                    </>
                                                                ) : (
                                                                    0
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {is_excat_discount ? (
                                                <div className="flex items-start justify-between">
                                                    <span className="text-xs text-gray-600">
                                                        Цена со скидкой:
                                                    </span>

                                                    <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                        {sale.percent_discount
                                                            ? sale.after_exact_discounts_and_percent_discount?.map(
                                                                  (crn) => (
                                                                      <span
                                                                          key={
                                                                              crn
                                                                                  ?.currency
                                                                                  .id
                                                                          }
                                                                          className="text-sm font-bold text-gray-600"
                                                                      >
                                                                          {numericFormat(
                                                                              crn?.amount,
                                                                          )}{' '}
                                                                          {
                                                                              crn
                                                                                  ?.currency
                                                                                  .name
                                                                          }
                                                                      </span>
                                                                  ),
                                                              )
                                                            : sale.totals_after_exact_discount?.map(
                                                                  (crn) => (
                                                                      <span
                                                                          key={
                                                                              crn
                                                                                  ?.currency
                                                                                  .id
                                                                          }
                                                                          className="text-sm font-bold text-gray-600"
                                                                      >
                                                                          {numericFormat(
                                                                              crn?.amount,
                                                                          )}{' '}
                                                                          {
                                                                              crn
                                                                                  ?.currency
                                                                                  .name
                                                                          }
                                                                      </span>
                                                                  ),
                                                              )}
                                                    </div>
                                                </div>
                                            ) : null}

                                            <div className="flex items-start justify-between">
                                                <span className="text-xs text-gray-600">
                                                    Оплата:
                                                </span>

                                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                    {sale.payment?.debt_states
                                                        .length ? (
                                                        sale.payment?.debt_states?.map(
                                                            (crn) => (
                                                                <span
                                                                    key={
                                                                        crn
                                                                            ?.currency
                                                                            .id
                                                                    }
                                                                    className="text-sm font-bold text-gray-600"
                                                                >
                                                                    {numericFormat(
                                                                        crn?.amount,
                                                                    )}{' '}
                                                                    {
                                                                        crn
                                                                            ?.currency
                                                                            .name
                                                                    }
                                                                </span>
                                                            ),
                                                        )
                                                    ) : (
                                                        <>
                                                            <span className="text-sm font-bold text-gray-600">
                                                                0
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-start justify-between">
                                                <span className="text-xs text-gray-600">
                                                    Долг:
                                                </span>

                                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                    {sale.debts.length ? (
                                                        sale.debts?.map(
                                                            (crn) => (
                                                                <span
                                                                    key={
                                                                        crn
                                                                            ?.currency
                                                                            .id
                                                                    }
                                                                    className="text-sm font-bold text-red-500"
                                                                >
                                                                    {numericFormat(
                                                                        crn?.amount,
                                                                    )}{' '}
                                                                    {
                                                                        crn
                                                                            ?.currency
                                                                            .name
                                                                    }
                                                                </span>
                                                            ),
                                                        )
                                                    ) : (
                                                        <>
                                                            <span className="text-sm font-bold text-gray-600">
                                                                0
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
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

export default SalesPage

// import dayjs from 'dayjs'
// import DatePicker from 'react-datepicker'
// import { useSales } from '@/entities/sales'
// import { ApprovedStatus, getSaleDetailPath } from '@/shared/config'
// import { Spinner, Alert, Input, Tag } from '@/shared/ui/kit'
// import { useCallback, useEffect, useState } from 'react'
// import { numericFormat } from '@/shared/lib/numericFormat'
// import { useNavigate, useSearchParams } from 'react-router-dom'

// type FilterKey = 'date_start' | 'date_end'

// export const SalesPage = () => {
//     const navigate = useNavigate()
//     const [searchParams, setSearchParams] = useSearchParams()
//     const today = dayjs().format('YYYY-MM-DD')
//     const urlDateStart = searchParams.get('date_start')
//     const urlDateEnd = searchParams.get('date_end')
//     const initialDateStart = urlDateStart ?? today
//     const initialDateEnd = urlDateEnd ?? today

//     const [filters, setFilters] = useState({
//         date_start: initialDateStart,
//         date_end: initialDateEnd,
//     })

//     useEffect(() => {
//         const params: Record<string, string> = {}

//         if (filters.date_start) {
//             params.date_start = dayjs(filters.date_start).format('YYYY-MM-DD')
//         }

//         if (filters.date_end) {
//             params.date_end = dayjs(filters.date_end).format('YYYY-MM-DD')
//         }

//         setSearchParams(params)
//     }, [filters, setSearchParams])

//     const apiParams = {
//         date_time_start: filters.date_start,
//         date_time_end: filters.date_end,
//     }

//     const shouldFetch =
//         !!filters.date_start &&
//         !!filters.date_end &&
//         dayjs(filters.date_start).isValid() &&
//         dayjs(filters.date_end).isValid()

//     const {
//         data: sales,
//         isLoading,
//         isError,
//         error,
//     } = useSales(apiParams, {
//         enabled: shouldFetch,
//     })

//     const goToSaleDetail = useCallback(
//         (saleId: string) => {
//             const dateStart = filters.date_start
//                 ? dayjs(filters.date_start).format('YYYY-MM-DD')
//                 : undefined
//             const dateEnd = filters.date_end
//                 ? dayjs(filters.date_end).format('YYYY-MM-DD')
//                 : undefined

//             navigate(getSaleDetailPath(saleId, dateStart, dateEnd))
//         },
//         [navigate, filters],
//     )

//     if (isError) {
//         return (
//             <div className="p-4">
//                 <Alert showIcon type="danger">
//                     Ошибка загрузки продаж: {error?.message}
//                 </Alert>
//             </div>
//         )
//     }

//     const total_currency_sum = sales?.length
//         ? Object.values(
//               sales.reduce(
//                   (acc, order) => {
//                       order.net_price.forEach((net) => {
//                           const currencyName = net.currency.name
//                           const amount = net.amount

//                           if (!acc[currencyName]) {
//                               acc[currencyName] = {
//                                   currency_name: currencyName,
//                                   total_sum: 0,
//                               }
//                           }

//                           acc[currencyName].total_sum += amount
//                       })

//                       return acc
//                   },
//                   {} as Record<
//                       string,
//                       { currency_name: string; total_sum: number }
//                   >,
//               ),
//           )
//         : []

//     const handleFilter = (date: Date | null, name: string) =>
//         setFilters((prev) => ({
//             ...prev,
//             [name]: dayjs(date).format('YYYY-MM-DD'),
//         }))
//     const selected = (name: FilterKey) =>
//         filters[name] ? dayjs(filters[name], 'YYYY-MM-DD').toDate() : null
//     const date_value = (name: FilterKey) =>
//         dayjs(filters[name]).format('DD.MM.YYYY')

//     return (
//         <div className="pb-32">
//             <div>
//                 <div className="mb-3">
//                     <h2 className="text-lg font-semibold pb-2">Продажи</h2>
//                     <div className="flex items-center justify-between gap-2 text-sm">
//                         <DatePicker
//                             selected={selected('date_start')}
//                             dateFormat="dd.MM.yyyy"
//                             name="date_start"
//                             maxDate={dayjs().toDate()}
//                             disabledKeyboardNavigation={true}
//                             placeholderText="от"
//                             popperPlacement="bottom-end"
//                             customInput={
//                                 <Input
//                                     readOnly
//                                     value={date_value('date_start')}
//                                     inputMode="none"
//                                     onFocus={(e) => e.target.blur()}
//                                 />
//                             }
//                             onChange={(date) =>
//                                 handleFilter(date, 'date_start')
//                             }
//                         />

//                         <DatePicker
//                             selected={selected('date_end')}
//                             dateFormat="dd.MM.yyyy"
//                             disabledKeyboardNavigation={true}
//                             placeholderText="до"
//                             maxDate={dayjs().toDate()}
//                             minDate={dayjs(filters?.date_start).toDate()}
//                             popperPlacement="bottom-start"
//                             customInput={
//                                 <Input
//                                     readOnly
//                                     value={date_value('date_end')}
//                                     inputMode="none"
//                                     onFocus={(e) => e.target.blur()}
//                                 />
//                             }
//                             onChange={(date) => handleFilter(date, 'date_end')}
//                         />
//                     </div>
//                 </div>

//                 <div className="space-y-4 mb-4 overflow-y-auto">
//                     {isLoading && (
//                         <div className="flex justify-center items-center h-72">
//                             <Spinner size={40} />
//                         </div>
//                     )}

//                     {!isLoading && sales?.length === 0 ? (
//                         <div className="h-72 flex flex-col items-center justify-center">
//                             <p className="text-gray-500">
//                                 У вас пока нет продаж
//                             </p>
//                         </div>
//                     ) : (
//                         sales?.map((sale) => {
//                             return (
//                                 <div
//                                     key={sale.id}
//                                     className="bg-white border rounded-lg shadow-sm p-3"
//                                 >
//                                     <div className="flex items-start justify-between mb-3">
//                                         <Tag
//                                             className={
//                                                 ApprovedStatus[
//                                                     Number(sale?.is_approved)
//                                                 ].bgClass
//                                             }
//                                         >
//                                             <span
//                                                 className={`capitalize font-semibold ${ApprovedStatus[Number(sale?.is_approved)].textClass}`}
//                                             >
//                                                 {
//                                                     ApprovedStatus[
//                                                         Number(
//                                                             sale?.is_approved,
//                                                         )
//                                                     ].label
//                                                 }
//                                             </span>
//                                         </Tag>

//                                         <span className="font-medium text-black">
//                                             {dayjs(sale?.date).format(
//                                                 'DD.MM.YYYY',
//                                             )}
//                                         </span>
//                                     </div>

//                                     <div
//                                         className="space-y-2 text-sm cursor-pointer"
//                                         onClick={() => goToSaleDetail(sale?.id)}
//                                     >
//                                         <div className="flex justify-between">
//                                             <span className="text-gray-500">
//                                                 Оплата:
//                                             </span>
//                                             <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
//                                                 {sale.payment?.debt_states?.map(
//                                                     (crn) => (
//                                                         <span
//                                                             key={
//                                                                 crn?.currency.id
//                                                             }
//                                                             className="font-medium text-black"
//                                                         >
//                                                             {numericFormat(
//                                                                 crn?.amount,
//                                                             )}{' '}
//                                                             {crn?.currency.name}
//                                                         </span>
//                                                     ),
//                                                 ) ?? (
//                                                     <>
//                                                         <span className="font-medium text-black">
//                                                             0
//                                                         </span>
//                                                     </>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div className="flex justify-between">
//                                             <span className="text-gray-500">
//                                                 В долг:
//                                             </span>
//                                             <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
//                                                 {sale.net_price?.map((crn) => (
//                                                     <span
//                                                         key={crn?.currency.id}
//                                                         className="font-medium text-red-500"
//                                                     >
//                                                         {numericFormat(
//                                                             crn?.amount,
//                                                         )}{' '}
//                                                         {crn?.currency.name}
//                                                     </span>
//                                                 )) ?? (
//                                                     <>
//                                                         <span className="font-medium text-black">
//                                                             0
//                                                         </span>
//                                                     </>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div
//                                             className="flex justify-between pt-2 border-t border-dashed mt-3"
//                                             style={{
//                                                 borderImage:
//                                                     'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
//                                             }}
//                                         >
//                                             <span className="text-gray-500">
//                                                 Общая сумма:
//                                             </span>
//                                             <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
//                                                 {sale.net_price.map(
//                                                     (pric, ind) => {
//                                                         return (
//                                                             <span
//                                                                 key={`${pric?.currency}-${ind}`}
//                                                                 className="font-bold text-black"
//                                                             >
//                                                                 {numericFormat(
//                                                                     pric.amount,
//                                                                 )}{' '}
//                                                                 {
//                                                                     pric
//                                                                         .currency
//                                                                         .name
//                                                                 }
//                                                             </span>
//                                                         )
//                                                     },
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )
//                         })
//                     )}
//                 </div>

//                 {/* Total Summary */}
//                 <div className="w-full bg-white fixed flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-4 border-t">
//                     <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
//                         <span className="text-sm font-semibold">
//                             Общая сумма:
//                         </span>
//                         <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
//                             {total_currency_sum?.map((crn) => (
//                                 <span
//                                     key={crn?.currency_name}
//                                     className="text-sm font-semibold text-primary"
//                                 >
//                                     {numericFormat(crn?.total_sum)}{' '}
//                                     {crn?.currency_name}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SalesPage
