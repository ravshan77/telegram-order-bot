import dayjs from 'dayjs'
import { useCallback } from 'react'
import { useOrders } from '@/entities/order'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getOrderDetailsPath } from '@/shared/config'
import { Button, Spinner, Alert } from '@/shared/ui/kit'

export const OrdersPage = () => {
    const navigate = useNavigate()

    const { data: orders, isLoading, isError, error } = useOrders()

    console.log(orders)

    const goToOrderDetails = useCallback(
        (orderId: string) => navigate(getOrderDetailsPath(orderId)),
        [navigate],
    )

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки заказов: {error?.message}
                </Alert>
            </div>
        )
    }

    // Filter only approved orders
    const approvedOrders = orders?.filter((order) => order.is_approved) || []

    if (orders?.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <p className="text-gray-500">У вас пока нет заказов</p>
            </div>
        )
    }

    return (
        <div className="pb-16">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Заказы</h2>
                </div>
                <div className="space-y-4 mb-4 overflow-y-auto">
                    {orders?.map((order) => {
                        const totalAmount = order.net_price[0]?.amount || 0
                        const currency =
                            order.net_price[0]?.currency.name || 'UZS'

                        return (
                            <div
                                key={order.id}
                                className="bg-white border rounded-lg shadow-sm p-3"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded ${
                                            order.is_approved
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {order.is_approved
                                            ? 'Подтверждён'
                                            : 'Не подтверждён'}
                                    </span>
                                    <Button
                                        variant="plain"
                                        size="xs"
                                        icon={<MoreHorizontal size={20} />}
                                    />
                                </div>

                                <h2 className="text-lg font-bold mb-3">
                                    {order.contractor?.name || 'Заказ'}
                                </h2>

                                <div
                                    className="space-y-2 text-sm cursor-pointer"
                                    onClick={() => goToOrderDetails(order.id)}
                                >
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Продажа:
                                        </span>
                                        <span className="font-medium text-black">
                                            {order.sale_info?.number || '-'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Дата заказа:
                                        </span>
                                        <span className="font-medium text-black">
                                            {dayjs(order.date).format(
                                                'DD.MM.YYYY',
                                            )}
                                        </span>
                                    </div>

                                    {order.approved_at && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Дата подтверждена:
                                            </span>
                                            <span className="font-medium text-black">
                                                {dayjs(
                                                    order.approved_at,
                                                ).format('DD.MM.YYYY')}
                                            </span>
                                        </div>
                                    )}

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
                                        <span className="font-bold text-black">
                                            {totalAmount.toLocaleString()}{' '}
                                            {currency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Total Summary */}
                <div className="w-full bg-white fixed flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-4 border-t">
                    <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                        <span className="text-sm font-semibold">
                            Всего заказов:
                        </span>
                        <span className="text-sm font-semibold flex text-primary">
                            {approvedOrders.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// import { useCallback } from 'react'
// import { Button } from '@/shared/ui/kit'
// import { useNavigate } from 'react-router-dom'
// import { Dot, MoreHorizontal } from 'lucide-react'
// import { getOrderDetailsPath } from '@/shared/config'

// export const OrdersPage = () => {
//     const navigate = useNavigate()
//     const orders = [
//         {
//             id: 1,
//             status: 'confirmed',
//             seller: 'Bakhrom Yuldasshaikhov',
//             salesCount: 980,
//             orderDate: '16.03.2025',
//             confirmDate: '24.06.2025',
//             totalAmount: '100$ • 1 250 000 uzs',
//         },
//         {
//             id: 2,
//             status: 'pending',
//             seller: 'Bakhrom Yuldasshaikhov',
//             salesCount: 980,
//             orderDate: '16.03.2025',
//             confirmDate: '24.06.2025',
//             totalAmount: '3 000 000 uzs',
//         },
//         {
//             id: 3,
//             status: 'confirmed',
//             seller: 'Bakhrom Yuldasshaikhov',
//             salesCount: 980,
//             orderDate: '16.03.2025',
//             confirmDate: '24.06.2025',
//             totalAmount: '100$ • 1 250 000 uzs',
//         },
//     ]

//     const goToOrderDetails = useCallback(
//         (orderId: number) => navigate(getOrderDetailsPath(orderId)),
//         [navigate],
//     )

//     return (
//         <div className="pb-16">
//             <div>
//                 <div className="flex items-center justify-between mb-3">
//                     <h2 className="text-lg font-semibold">Заказы</h2>
//                 </div>
//                 <div className="space-y-4 mb-4 overflow-y-auto">
//                     {orders.map((order) => (
//                         <div
//                             key={order.id}
//                             className="bg-white border rounded-lg shadow-sm p-3"
//                         >
//                             <div className="flex items-start justify-between mb-3">
//                                 <span
//                                     className={`text-xs font-semibold px-3 py-1 rounded ${
//                                         order.status === 'confirmed'
//                                             ? 'bg-green-100 text-green-700'
//                                             : 'bg-red-100 text-red-700'
//                                     }`}
//                                 >
//                                     {order.status === 'confirmed'
//                                         ? 'Подтверждён'
//                                         : 'Не подтверждён'}
//                                 </span>
//                                 <Button
//                                     variant="plain"
//                                     size="xs"
//                                     icon={<MoreHorizontal size={20} />}
//                                 />
//                             </div>

//                             <h2 className="text-lg font-bold mb-3">
//                                 {order.seller}
//                             </h2>

//                             <div
//                                 className="space-y-2 text-sm"
//                                 onClick={() => goToOrderDetails(order.id)}
//                             >
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-500">
//                                         Продажа:
//                                     </span>
//                                     <span className="font-medium text-black">
//                                         {order.salesCount}
//                                     </span>
//                                 </div>

//                                 <div className="flex justify-between">
//                                     <span className="text-gray-500">
//                                         Дата заказы:
//                                     </span>
//                                     <span className="font-medium text-black">
//                                         {order.orderDate}
//                                     </span>
//                                 </div>

//                                 <div className="flex justify-between">
//                                     <span className="text-gray-500">
//                                         Дата подтверждена:
//                                     </span>
//                                     <span className="font-medium text-black">
//                                         {order.confirmDate}
//                                     </span>
//                                 </div>

//                                 <div
//                                     className="flex justify-between pt-2 border-t border-dashed mt-3"
//                                     style={{
//                                         borderImage:
//                                             'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
//                                     }}
//                                 >
//                                     <span className="text-gray-500">
//                                         Общая сумма:
//                                     </span>
//                                     <span className="font-bold text-black">
//                                         {order.totalAmount}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="w-full bg-white fixed flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-4 border-t">
//                     <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
//                         <span className="text-sm font-semibold">
//                             Общая сумма:
//                         </span>
//                         <span className="text-sm font-semibold flex text-primary">
//                             100$ <Dot /> 1 250 000 cум
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
