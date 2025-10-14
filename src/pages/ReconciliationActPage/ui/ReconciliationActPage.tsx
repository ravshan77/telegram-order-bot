import dayjs from 'dayjs'
import React, { useState } from 'react'
import DatePickerRange from '@/shared/ui/kit/DatePicker/DatePickerRange'

interface Transaction {
    id: number
    company: string
    date: string
    time: string
    type: 'Продажа' | 'Оплата'
    uzs: number
    usd: number
}

export const ReconciliationActPage: React.FC = () => {
    const today = dayjs().toDate()
    const deafult_value: [Date, Date] = [today, today]
    const [transactions] = useState<Transaction[]>([
        {
            id: 1,
            company: 'Hippo uz',
            date: '15.09.2025',
            time: '16:07',
            type: 'Продажа',
            uzs: 1600000,
            usd: 200,
        },
        {
            id: 2,
            company: 'Hippo uz',
            date: '15.09.2025',
            time: '16:07',
            type: 'Оплата',
            uzs: 1600000,
            usd: 100,
        },
        {
            id: 3,
            company: 'Hippo uz',
            date: '15.09.2025',
            time: '16:07',
            type: 'Оплата',
            uzs: 1600000,
            usd: 200,
        },
        {
            id: 4,
            company: 'Hippo uz',
            date: '14.09.2025',
            time: '14:30',
            type: 'Продажа',
            uzs: 2500000,
            usd: 250,
        },
        {
            id: 5,
            company: 'Hippo uz',
            date: '14.09.2025',
            time: '12:15',
            type: 'Оплата',
            uzs: 800000,
            usd: 80,
        },
    ])

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-US').replace(/,/g, ' ')
    }

    return (
        <div className="pb-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">АКТ сверка</h2>
                <div className="flex items-center gap-2 text-sm">
                    <DatePickerRange defaultValue={deafult_value} />
                </div>
            </div>

            {/* Transaction Cards - Scrollable */}
            <div className="px-0 py-4 space-y-3">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                    >
                        {/* Company and DateTime */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                                {transaction.company}
                            </span>
                            <span className="text-xs text-gray-400">
                                {transaction.date} · {transaction.time}
                            </span>
                        </div>

                        {/* Transaction Type */}
                        <div className="mb-3">
                            <span className="text-base text-gray-900">
                                {transaction.type}
                            </span>
                        </div>

                        {/* Amounts */}
                        <div className="flex items-center justify-between">
                            <span
                                className={`text-lg font-semibold ${
                                    transaction.type === 'Продажа'
                                        ? 'text-red-500'
                                        : 'text-blue-500'
                                }`}
                            >
                                {transaction.type === 'Продажа'
                                    ? formatNumber(transaction.uzs)
                                    : `${transaction.usd}$`}
                            </span>
                            <span
                                className={`text-lg font-semibold ${
                                    transaction.type === 'Продажа'
                                        ? 'text-red-500'
                                        : 'text-blue-500'
                                }`}
                            >
                                {transaction.type === 'Продажа'
                                    ? `${transaction.usd}$`
                                    : `${formatNumber(transaction.uzs)} UZS`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fixed Footer - Summary */}
            <div className="fixed -z-0 bottom-0 min-h-56 left-0 right-0 bg-white border-t shadow-2xl">
                <div className="px-4 py-0 space-y-1">
                    {/* Starting Debt */}
                    <div className="flex items-center justify-between py-2 border-t ">
                        <span className="w-32 text-sm text-gray-600">
                            Начальная задолженность:
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900">
                                100$
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                                175 250 000 сум
                            </span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between py-2 border-t ">
                        <span className="w-32 text-sm text-gray-600">
                            Итого:
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900">
                                100$
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                                213 000 000 сум
                            </span>
                        </div>
                    </div>

                    {/* Difference */}
                    <div className="flex items-center justify-between py-2 border-t ">
                        <span className="w-32 text-sm text-gray-600">
                            Общая разница:
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900">
                                100$
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                                72 500 000 сум
                            </span>
                        </div>
                    </div>

                    {/* Final Debt */}
                    <div className="flex items-center justify-between py-2 border-t ">
                        <span className="w-32 text-sm text-gray-600">
                            Конечная задолженность:
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900">
                                100$
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                                20 000 000 сум
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReconciliationActPage
