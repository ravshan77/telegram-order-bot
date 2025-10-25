import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import { useEffect, useState } from 'react'
import { usePayouts } from '@/entities/payout'
import type { Payment } from '@/entities/payment'
import { useSearchParams } from 'react-router-dom'
import { Button, Alert, Spinner, Input } from '@/shared/ui/kit'
import { PaymentViewBottomSheet } from '@/pages/PaymentsPage/ui/PaymentViewBottomSheet'
import { numericFormat } from '@/shared/lib/numericFormat'

type FilterKey = 'date_start' | 'date_end'

export const PayoutsPage = () => {
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
        date_start: filters.date_start,
        date_end: filters.date_end,
    }

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

    const shouldFetch =
        !!filters.date_start &&
        !!filters.date_end &&
        dayjs(filters.date_start).isValid() &&
        dayjs(filters.date_end).isValid()

    const {
        data: payments,
        isLoading,
        isError,
        error,
    } = usePayouts(apiParams, {
        enabled: shouldFetch,
    })

    const handleCardClick = (payment: Payment) => {
        setSelectedPayment(payment)
        setIsDrawerOpen(true)
    }

    const handleShowAllClick = () => {
        setSelectedPayment(null)
        setIsDrawerOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-72">
                <Spinner size={40} />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки выплат: {error?.message}
                </Alert>
            </div>
        )
    }

    const calculateTotalByCurrency = () => {
        const totals: Record<string, number> = {}

        payments?.forEach((payment) => {
            payment.debt_states.forEach((debt) => {
                const currencyName = debt.currency.name
                if (!totals[currencyName]) {
                    totals[currencyName] = 0
                }
                totals[currencyName] += debt.amount
            })
        })

        return Object.entries(totals).map(([currency, amount]) => ({
            currency,
            amount,
        }))
    }

    const totals = calculateTotalByCurrency()

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
            <PaymentViewBottomSheet
                isOpen={isDrawerOpen}
                setIsOpen={setIsDrawerOpen}
                payment={selectedPayment}
                allPayments={payments || []}
            />

            <div>
                <div className="mb-3">
                    <h2 className="text-lg font-semibold pb-2">Выплаты</h2>
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
                    {!payments || payments.length === 0 ? (
                        <div className="h-72 flex flex-col items-center justify-center">
                            <p className="text-gray-500">
                                У вас пока нет выплат
                            </p>
                        </div>
                    ) : (
                        payments.map((payment) => {
                            return (
                                <div
                                    key={payment.id}
                                    className="border p-3 rounded-2xl cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => handleCardClick(payment)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-sm text-gray-600">
                                            {payment.contractor.name}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {dayjs(payment.date).format(
                                                'DD.MM.YYYY',
                                            )}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500 block mb-1">
                                                Погашение долга:
                                            </span>
                                            <div className="flex flex-col items-end">
                                                {payment.debt_states.map(
                                                    (debt, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-base font-bold text-black"
                                                        >
                                                            {numericFormat(
                                                                debt.amount,
                                                            )}{' '}
                                                            {debt.currency.name}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="pt-3 border-t border-dashed"
                                        style={{
                                            borderImage:
                                                'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">
                                                Закрытая задолженность:
                                            </span>

                                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                                {payment?.debt_states?.map(
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
                                </div>
                            )
                        })
                    )}
                </div>

                {!isDrawerOpen && payments && payments.length > 0 && (
                    <div className="w-full bg-white fixed z-0 flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-4 border-t">
                        <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                            <span className="text-sm font-semibold">
                                Общая сумма:
                            </span>
                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {totals.map((total) => (
                                    <span
                                        key={total.currency}
                                        className="text-sm font-semibold text-primary"
                                    >
                                        {numericFormat(total.amount)}{' '}
                                        {total.currency}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <Button
                            variant="solid"
                            className="w-full"
                            onClick={handleShowAllClick}
                        >
                            Подробнее
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
