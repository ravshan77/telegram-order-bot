import dayjs from 'dayjs'
import { useState } from 'react'
import type { Payment } from '@/entities/payment'
import { Button, Alert, Spinner } from '@/shared/ui/kit'
// import { PayoutViewDrawer } from './PayoutViewDrawer'
import DatePickerRange from '@/shared/ui/kit/DatePicker/DatePickerRange'
import { usePayouts } from '@/entities/payout'
import { PaymentViewBottomSheet } from '@/pages/PaymentsPage/ui/PaymentViewBottomSheet'

export const PayoutsPage = () => {
    const today = dayjs().toDate()
    const [filters, setFilters] = useState<{
        date_start: Date | null
        date_end: Date | null
    }>({
        date_start: today,
        date_end: today,
    })

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

    const params: Record<string, string> = {}

    if (filters?.date_start && dayjs(filters.date_start).isValid()) {
        params.date_start = dayjs(filters.date_start).format('YYYY-MM-DD')
    }

    if (filters?.date_end && dayjs(filters.date_end).isValid()) {
        params.date_end = dayjs(filters.date_end).format('YYYY-MM-DD')
    }

    const { data: payments, isLoading, isError, error } = usePayouts(params)

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
                    Ошибка загрузки оплат: {error?.message}
                </Alert>
            </div>
        )
    }

    // Umumiy summani hisoblash
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

    return (
        <div className="pb-32">
            <PaymentViewBottomSheet
                isOpen={isDrawerOpen}
                setIsOpen={setIsDrawerOpen}
                payment={selectedPayment}
                allPayments={payments || []}
            />

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Выплаты</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <DatePickerRange
                            value={[filters?.date_start, filters?.date_end]}
                            singleDate={true}
                            onChange={(e) => {
                                if (e[0] && e[1]) {
                                    setFilters({
                                        date_start: e[0],
                                        date_end: e[1],
                                    })
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-4 mb-4 overflow-y-auto">
                    {!payments || payments.length === 0 ? (
                        <div className="h-72 flex flex-col items-center justify-center">
                            <p className="text-gray-500">
                                У вас пока нет оплат
                            </p>
                        </div>
                    ) : (
                        payments.map((payment) => {
                            const totalDebtAmount = payment.debt_states.reduce(
                                (sum, debt) => sum + debt.amount,
                                0,
                            )

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
                                                            {debt.amount.toLocaleString()}{' '}
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
                                            <span className="text-sm font-medium text-end">
                                                {totalDebtAmount.toLocaleString()}{' '}
                                                {
                                                    payment.debt_states[0]
                                                        ?.currency.name
                                                }
                                            </span>
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
                            <div className="flex gap-4">
                                {totals.map((total) => (
                                    <span
                                        key={total.currency}
                                        className="text-sm font-semibold text-primary"
                                    >
                                        {total.amount.toLocaleString()}{' '}
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
                            Показать
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// import dayjs from 'dayjs'
// import { useState } from 'react'
// import { Dot } from 'lucide-react'
// import { Button } from '@/shared/ui/kit'
// import { PayoutViewDrawer } from './PayoutViewDrawer'
// import DatePickerRange from '@/shared/ui/kit/DatePicker/DatePickerRange'

// const payments = [
//     {
//         id: 1,
//         number: '№ 1654872',
//         date: '15.09.2025',
//         debtPayment: '3 250 000 сум',
//         debtPaymentUsd: '100$',
//         closedDebt: '5 500 000 сум',
//     },
//     {
//         id: 2,
//         number: '№ 1654872',
//         date: '15.09.2025',
//         debtPayment: '2 250 000 сум',
//         closedDebtUsd: '100$',
//         closedDebt: '5 500 000 сум',
//     },
//     {
//         id: 3,
//         number: '№ 1654872',
//         date: '15.09.2025',
//         debtPayment: '3 250 000 сум',
//         debtPaymentUsd: '100$',
//         closedDebt: '5 500 000 сум',
//     },
//     {
//         id: 4,
//         number: '№ 1654872',
//         date: '15.09.2025',
//         debtPayment: '3 250 000 сум',
//         debtPaymentUsd: '100$',
//         closedDebt: '5 500 000 сум',
//     },
//     {
//         id: 5,
//         number: '№ 1654872',
//         date: '15.09.2025',
//         debtPayment: '3 250 000 сум',
//         debtPaymentUsd: '100$',
//         closedDebt: '5 500 000 сум',
//     },
// ]

// export const PayoutsPage = () => {
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false)

//     const today = dayjs().toDate()
//     const deafult_value: [Date, Date] = [today, today]

//     return (
//         <div className="pb-32">
//             <PayoutViewDrawer
//                 isOpen={isDrawerOpen}
//                 setIsOpen={setIsDrawerOpen}
//             />
//             <div>
//                 <div className="flex items-center justify-between mb-3">
//                     <h2 className="text-lg font-semibold">Выплаты</h2>
//                     <div className="flex items-center gap-2 text-sm">
//                         <DatePickerRange defaultValue={deafult_value} />
//                     </div>
//                 </div>
//                 <div className="space-y-4 mb-4 overflow-y-auto">
//                     {payments.map((payment) => (
//                         <div
//                             key={payment.id}
//                             className="border p-3 rounded-2xl"
//                         >
//                             <div className="flex justify-between items-start mb-3">
//                                 <span className="text-sm text-gray-600">
//                                     {payment.number}
//                                 </span>
//                                 <span className="text-sm text-gray-600">
//                                     {payment.date}
//                                 </span>
//                             </div>

//                             <div className="mb-3">
//                                 <div className="flex justify-between">
//                                     <span className="text-xs text-gray-500 block mb-1">
//                                         Погашение долга:
//                                     </span>
//                                     <span className="text-base font-bold text-black">
//                                         {payment.debtPayment}
//                                     </span>
//                                 </div>
//                                 <div className="flex flex-col items-end">
//                                     {payment.debtPaymentUsd && (
//                                         <span className="text-base font-bold text-black">
//                                             {payment.debtPaymentUsd}
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="pt-3 border-t">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-sm text-gray-600">
//                                         Закрытая задолженность:
//                                     </span>
//                                     <div className="gap-1">
//                                         <p className="text-sm font-medium text-end">
//                                             {payment.closedDebt}
//                                         </p>
//                                         {payment.closedDebtUsd && (
//                                             <>
//                                                 <p className="text-sm font-medium text-end">
//                                                     {payment.closedDebtUsd}
//                                                 </p>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {!isDrawerOpen && (
//                     <div className="w-full bg-white fixed -z-0 flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-4 border-t">
//                         <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
//                             <span className="text-sm font-semibold">
//                                 Общая разница:
//                             </span>
//                             <span className="text-sm font-semibold flex text-primary">
//                                 100$ <Dot /> 1 250 000 cум
//                             </span>
//                         </div>
//                         <Button
//                             variant="solid"
//                             className="w-full"
//                             onClick={() => setIsDrawerOpen(true)}
//                         >
//                             Показать
//                         </Button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }
