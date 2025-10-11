import { Button, Drawer } from '@/shared/ui/kit'
import DatePickerRange from '@/shared/ui/kit/DatePicker/DatePickerRange'
import { Dot } from 'lucide-react'
import { useState } from 'react'

export const AccountsPayable = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const payments = [
        {
            id: 1,
            number: '№ 1654872',
            date: '15.09.2025',
            debtPayment: '3 250 000 сум',
            debtPaymentUsd: '100$',
            closedDebt: '5 500 000 сум',
        },
        {
            id: 2,
            number: '№ 1654872',
            date: '15.09.2025',
            debtPayment: '2 250 000 сум',
            closedDebtUsd: '100$',
            closedDebt: '5 500 000 сум',
        },
        {
            id: 3,
            number: '№ 1654872',
            date: '15.09.2025',
            debtPayment: '3 250 000 сум',
            debtPaymentUsd: '100$',
            closedDebt: '5 500 000 сум',
        },
        {
            id: 4,
            number: '№ 1654872',
            date: '15.09.2025',
            debtPayment: '3 250 000 сум',
            debtPaymentUsd: '100$',
            closedDebt: '5 500 000 сум',
        },
        {
            id: 5,
            number: '№ 1654872',
            date: '15.09.2025',
            debtPayment: '3 250 000 сум',
            debtPaymentUsd: '100$',
            closedDebt: '5 500 000 сум',
        },
    ]

    return (
        <div className="pb-32">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Оплаты</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <DatePickerRange />
                    </div>
                </div>

                <div className="space-y-4 mb-4 overflow-y-auto">
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="border p-3 rounded-2xl"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-sm text-gray-600">
                                    {payment.number}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {payment.date}
                                </span>
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500 block mb-1">
                                        Погашение долга:
                                    </span>
                                    <span className="text-base font-bold text-black">
                                        {payment.debtPayment}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    {payment.debtPaymentUsd && (
                                        <span className="text-base font-bold text-black">
                                            {payment.debtPaymentUsd}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-3 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Закрытая задолженность:
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {payment.closedDebtUsd && (
                                            <>
                                                <span className="text-sm font-medium text-black">
                                                    {payment.closedDebtUsd}
                                                </span>
                                            </>
                                        )}
                                        <span className="text-sm font-medium text-black">
                                            {payment.closedDebt}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!isDrawerOpen && (
                    <div className="w-full bg-white fixed flex justify-between items-start bottom-0 left-0 right-0 py-2 pb-4 px-4 border-t">
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-700 font-medium">
                                    Общая сумма:
                                </span>
                                <span className="text-sm font-bold flex items-center text-black">
                                    100$ <Dot /> 1 250 000 сум
                                </span>
                            </div>
                            <Button
                                variant="solid"
                                className="w-full"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                Показать
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <Drawer
                isOpen={isDrawerOpen}
                placement="bottom"
                title="Подробности"
                closable={true}
                height="auto"
                bodyClass="p-0"
                // headerClass="border border-red-500"
                className={'overflow-hidden rounded-lg'}
                onClose={() => setIsDrawerOpen(false)}
            >
                <div className="px-4 pb-6">
                    <div>
                        <div
                            className="flex justify-between items-center py-3 border-b border-dashed"
                            style={{
                                borderImage:
                                    'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                            }}
                        >
                            <span className="text-gray-700">Наличный</span>
                            <span className="font-semibold text-black">
                                146 000 сум
                            </span>
                        </div>

                        <div
                            className="flex justify-between items-center py-3 border-b border-dashed"
                            style={{
                                borderImage:
                                    'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                            }}
                        >
                            <span className="text-gray-700">Uzcard</span>
                            <span className="font-semibold text-black">
                                20 000 сум
                            </span>
                        </div>

                        <div
                            className="flex justify-between items-center py-3 border-b border-dashed"
                            style={{
                                borderImage:
                                    'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                            }}
                        >
                            <span className="text-gray-700">Humo</span>
                            <span className="font-semibold text-black">
                                150 000 сум
                            </span>
                        </div>

                        <div
                            className="flex justify-between items-center py-3 border-b border-dashed"
                            style={{
                                borderImage:
                                    'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                            }}
                        >
                            <span className="text-gray-700">Перечисления</span>
                            <span className="font-semibold text-black">
                                75 000 сум
                            </span>
                        </div>

                        <div
                            className="flex justify-between items-center py-3 border-b border-dashed"
                            style={{
                                borderImage:
                                    'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                            }}
                        >
                            <span className="text-gray-700">Click</span>
                            <span className="font-semibold text-black">
                                210 000 сум
                            </span>
                        </div>

                        <div
                            className="flex justify-between items-center py-3 border-b border-dashed"
                            style={{
                                borderImage:
                                    'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                            }}
                        >
                            <span className="text-gray-700">Payme</span>
                            <span className="font-semibold text-black">
                                15 000 сум
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-700">Visa</span>
                            <span className="font-semibold text-black">
                                50$
                            </span>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}
