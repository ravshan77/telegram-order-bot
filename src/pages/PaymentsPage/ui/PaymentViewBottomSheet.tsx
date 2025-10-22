import {
    Drawer,
    DrawerTitle,
    DrawerHeader,
    DrawerContent,
} from '@/shared/ui/kit/Sheet'
import type { Payment } from '@/entities/payment'
import { paymentOptions } from '@/shared/config/constants/paymentTypes.constant'

interface PaymentViewBottomSheetProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    payment: Payment | null
    allPayments: Payment[]
}

interface PaymentTypeTotal {
    payment_type: number
    label: string
    amount: number
    currency: string
}

export function PaymentViewBottomSheet({
    isOpen,
    setIsOpen,
    payment,
    allPayments,
}: PaymentViewBottomSheetProps) {
    const getSinglePaymentData = (payment: Payment): PaymentTypeTotal[] => {
        const result: PaymentTypeTotal[] = []

        paymentOptions.forEach((option) => {
            const paymentType = parseInt(option.value)

            const cashBoxState = payment.cash_box_states.find(
                (state) => state.payment_type === paymentType,
            )

            result.push({
                payment_type: paymentType,
                label: option.label,
                amount: cashBoxState?.amount || 0,
                currency: cashBoxState?.currency.name || 'UZS',
            })
        })

        return result
    }

    const getAllPaymentsData = (payments: Payment[]): PaymentTypeTotal[] => {
        const totalsMap = new Map<
            number,
            { amount: number; currency: string }
        >()

        payments.forEach((payment) => {
            payment.cash_box_states.forEach((state) => {
                const existing = totalsMap.get(state.payment_type)
                if (existing) {
                    existing.amount += state.amount
                } else {
                    totalsMap.set(state.payment_type, {
                        amount: state.amount,
                        currency: state.currency.name,
                    })
                }
            })
        })

        const result: PaymentTypeTotal[] = []
        paymentOptions.forEach((option) => {
            const paymentType = parseInt(option.value)
            const data = totalsMap.get(paymentType)

            result.push({
                payment_type: paymentType,
                label: option.label,
                amount: data?.amount || 0,
                currency: data?.currency || 'UZS',
            })
        })

        return result
    }

    const paymentData = payment
        ? getSinglePaymentData(payment)
        : getAllPaymentsData(allPayments)

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent className="bg-white">
                <div className="mx-auto w-full px-4">
                    <DrawerHeader className="p-0">
                        <DrawerTitle className="text-start text-xl">
                            {payment ? 'Детали оплаты' : 'Все оплаты'}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-8">
                        <div>
                            {paymentData.map((item, index) => (
                                <div
                                    key={item.payment_type}
                                    className={`flex justify-between items-center py-4 ${
                                        index < paymentData.length - 1
                                            ? 'border-b border-dashed'
                                            : ''
                                    }`}
                                    style={
                                        index < paymentData.length - 1
                                            ? {
                                                  borderImage:
                                                      'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                              }
                                            : undefined
                                    }
                                >
                                    <span className="text-gray-700">
                                        {item.label}
                                    </span>
                                    <span className="font-semibold text-black">
                                        {item.amount.toLocaleString()}{' '}
                                        {item.currency}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
