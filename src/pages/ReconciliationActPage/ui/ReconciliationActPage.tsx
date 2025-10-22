import dayjs from 'dayjs'
import { usePayouts } from '@/entities/payout'
import React, { ChangeEvent, useState } from 'react'
import { Alert, Input, Spinner } from '@/shared/ui/kit'

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
    const today = dayjs().startOf('day').format('YYYY-MM-DD')
    const [filters, setFilters] = useState<{
        date_start: string | null
        date_end: string | null
    }>({
        date_start: today,
        date_end: today,
    })

    const params: Record<string, string> = {}

    if (filters?.date_start && dayjs(filters.date_start).isValid()) {
        params.date_start = dayjs(filters.date_start).format('YYYY-MM-DD')
    }

    if (filters?.date_end && dayjs(filters.date_end).isValid()) {
        params.date_end = dayjs(filters.date_end).format('YYYY-MM-DD')
    }

    const shouldFetch =
        !!filters.date_start &&
        !!filters.date_end &&
        dayjs(filters.date_start).isValid() &&
        dayjs(filters.date_end).isValid()

    const {
        data: dataAkt,
        isLoading,
        isError,
        error,
    } = usePayouts(params, {
        enabled: shouldFetch,
    })

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

    const total_currency_sum: any[] = []

    const handleFilter = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        if (e.target.name === 'date_start') {
            setFilters({ date_start: e.target.value, date_end: null })
            return
        }
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // ------ old codes -------
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

    const formatNumber = (num: number) =>
        num.toLocaleString('en-US').replace(/,/g, ' ')

    return (
        <div className="pb-32">
            {/* Header */}
            <div className="mb-3">
                <h2 className="text-lg font-semibold pb-2">АКТ сверка</h2>
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

            {/* Transaction Cards - Scrollable */}
            {/* <div className="px-0 py-4 space-y-3">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                                {transaction.company}
                            </span>
                            <span className="text-xs text-gray-400">
                                {transaction.date} · {transaction.time}
                            </span>
                        </div>

                        <div className="mb-3">
                            <span className="text-base text-gray-900">
                                {transaction.type}
                            </span>
                        </div>

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
            </div> */}

            {/* New fixed bar */}
            <div className="w-full bg-white fixed flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-4 border-t">
                <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                    <span className="text-sm font-semibold">
                        Нач. задолженности:
                    </span>
                    <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
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

                <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                    <span className="text-sm font-semibold">
                        Kон.задолженность:
                    </span>
                    <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
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
    )
}

export default ReconciliationActPage
