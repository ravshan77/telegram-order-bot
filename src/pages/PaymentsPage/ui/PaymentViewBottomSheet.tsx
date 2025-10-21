import {
    Drawer,
    DrawerTitle,
    DrawerHeader,
    DrawerContent,
} from '@/shared/ui/kit/Sheet'
import { paymentOptions } from '@/shared/config/constants/paymentTypes.constant'
import type { Payment } from '@/entities/payment'

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
    // Bitta payment uchun
    const getSinglePaymentData = (payment: Payment): PaymentTypeTotal[] => {
        const result: PaymentTypeTotal[] = []

        // Barcha payment_type'larni iterate qilamiz
        paymentOptions.forEach((option) => {
            const paymentType = parseInt(option.value)

            // cash_box_states'dan shu payment_type'ni topamiz
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

    // Barcha payments uchun umumiy
    const getAllPaymentsData = (payments: Payment[]): PaymentTypeTotal[] => {
        const totalsMap = new Map<
            number,
            { amount: number; currency: string }
        >()

        // Har bir payment'ning cash_box_states'ini yig'amiz
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

        // Barcha payment_type'lar uchun natija
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

// // import { paymentOptions } from '@/shared/config/constants/paymentTypes.constant'
// import {
//     Drawer,
//     DrawerTitle,
//     DrawerHeader,
//     DrawerContent,
// } from '@/shared/ui/kit/Sheet'

// interface BottomSheetProps {
//     isOpen: boolean
//     setIsOpen: (prev: boolean) => void
// }

// export function PaymentViewBottomSheet({
//     isOpen,
//     setIsOpen,
// }: BottomSheetProps) {
//     // paymentOptions
//     return (
//         <Drawer open={isOpen} onOpenChange={(prew) => setIsOpen(prew)}>
//             <DrawerContent className="bg-white">
//                 <div className="mx-auto w-full px-4">
//                     <DrawerHeader className="p-0">
//                         <DrawerTitle className="text-start text-xl">
//                             Оформление заказа
//                         </DrawerTitle>
//                     </DrawerHeader>
//                     <div className="px-4 pb-8">
//                         <div>
//                             <div
//                                 className="flex justify-between items-center py-4 border-b border-dashed"
//                                 style={{
//                                     borderImage:
//                                         'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
//                                 }}
//                             >
//                                 <span className="text-gray-700">Наличный</span>
//                                 <span className="font-semibold text-black">
//                                     146 000 сум
//                                 </span>
//                             </div>

//                             <div
//                                 className="flex justify-between items-center py-4 border-b border-dashed"
//                                 style={{
//                                     borderImage:
//                                         'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
//                                 }}
//                             >
//                                 <span className="text-gray-700">Uzcard</span>
//                                 <span className="font-semibold text-black">
//                                     20 000 сум
//                                 </span>
//                             </div>

//                             <div
//                                 className="flex justify-between items-center py-4 border-b border-dashed"
//                                 style={{
//                                     borderImage:
//                                         'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
//                                 }}
//                             >
//                                 <span className="text-gray-700">Humo</span>
//                                 <span className="font-semibold text-black">
//                                     150 000 сум
//                                 </span>
//                             </div>

//                             <div
//                                 className="flex justify-between items-center py-4 border-b border-dashed"
//                                 style={{
//                                     borderImage:
//                                         'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
//                                 }}
//                             >
//                                 <span className="text-gray-700">
//                                     Перечисления
//                                 </span>
//                                 <span className="font-semibold text-black">
//                                     75 000 сум
//                                 </span>
//                             </div>

//                             <div
//                                 className="flex justify-between items-center py-4 border-b border-dashed"
//                                 style={{
//                                     borderImage:
//                                         'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
//                                 }}
//                             >
//                                 <span className="text-gray-700">Click</span>
//                                 <span className="font-semibold text-black">
//                                     210 000 сум
//                                 </span>
//                             </div>

//                             <div
//                                 className="flex justify-between items-center py-4 border-b border-dashed"
//                                 style={{
//                                     borderImage:
//                                         'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
//                                 }}
//                             >
//                                 <span className="text-gray-700">Payme</span>
//                                 <span className="font-semibold text-black">
//                                     15 000 сум
//                                 </span>
//                             </div>

//                             <div className="flex justify-between items-center py-4">
//                                 <span className="text-gray-700">Visa</span>
//                                 <span className="font-semibold text-black">
//                                     50$
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </DrawerContent>
//         </Drawer>
//     )
// }
