import React from 'react'

export const ReconciliationActPage = () => {
    const sales = [
        {
            id: 1,
            number: '№ 1654872',
            date: '15.09.2025',
            totalAmount: '500 000 сум',
            paidAmount: '300 000 сум',
            debt: '- 200 000 сум',
        },
        {
            id: 2,
            number: '№ 1654872',
            date: '15.09.2025',
            totalAmount: '500 000 сум',
            paidAmount: '300 000 сум',
            debt: '- 200 000 сум',
        },
        {
            id: 3,
            number: '№ 1654872',
            date: '15.09.2025',
            totalAmount: '500 000 сум',
            paidAmount: '300 000 сум',
            debt: '- 200 000 сум',
        },
        {
            id: 4,
            number: '№ 1654872',
            date: '15.09.2025',
            totalAmount: '500 000 сум',
            paidAmount: '300 000 сум',
            debt: '- 200 000 сум',
        },
    ]
    return (
        <div className="pb-16">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">АКТ сверка</h2>
                </div>

                <div className="space-y-4 mb-4 overflow-y-auto">
                    {sales.map((sale) => (
                        <div key={sale.id} className="border p-3 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm text-gray-600">
                                    {sale.number}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {sale.date}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">
                                        Сумма
                                    </span>
                                    <span className="text-base font-bold text-gray-600">
                                        {sale.totalAmount}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">
                                        Оплата
                                    </span>
                                    <span className="text-base font-bold text-gray-600">
                                        {sale.paidAmount}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t">
                                <span className="text-sm text-gray-600">
                                    В долг:
                                </span>
                                <span className="text-base font-bold text-red-500">
                                    {sale.debt}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
