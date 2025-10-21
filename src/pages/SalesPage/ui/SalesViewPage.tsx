import dayjs from 'dayjs'
import React from 'react'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import { useSale } from '@/entities/sales'
import { useParams } from 'react-router-dom'
import { GoBack } from '@/shared/ui/kit-pro'
import { Alert, Button, Spinner } from '@/shared/ui/kit'
import { salesApi } from '@/entities/sales/api/salesApi'
// import { getSalesPath } from '@/shared/config'

export const SalesViewPage: React.FC = () => {
    const { saleId } = useParams<{ saleId: string }>()
    // const navigate = useNavigate()
    // const [searchParams] = useSearchParams()

    const { data: sale, isLoading, isError, error } = useSale(saleId!)

    const handleDownloadExcel = async () => {
        try {
            const blob = await salesApi.downloadSaleExcel(saleId!)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `sale_${sale?.number || saleId}.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('Файл успешно загружен')
        } catch (err: any) {
            toast.error(err.message || 'Ошибка при скачивании файла')
        }
    }

    // const handleGoBack = () => {
    //     const dateStart = searchParams.get('date_start')
    //     const dateEnd = searchParams.get('date_end')
    //     navigate(getSalesPath(dateStart || undefined, dateEnd || undefined))
    // }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    if (isError || !sale) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки продажи: {error?.message}
                </Alert>
            </div>
        )
    }

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-US').replace(/,/g, ' ')
    }

    // Umumiy summalarni hisoblash
    const totalAmount = sale.totals.reduce(
        (sum, total) => sum + total.amount,
        0,
    )
    const discountAmount = sale.exact_discounts.reduce(
        (sum, discount) => sum + discount.amount,
        0,
    )
    const paymentAmount =
        sale.payment?.debt_states.reduce((sum, debt) => sum + debt.amount, 0) ||
        0
    const debtAmount = sale.debts.reduce((sum, debt) => sum + debt.amount, 0)

    return (
        <div className="pb-32">
            <div>
                {/* Header */}
                <div className="bg-white w-full">
                    <GoBack navigatePath={-1} />
                </div>

                {/* Content */}
                <div className="py-4">
                    {/* Status Card */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm border">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-base font-semibold">
                                Продажа № {sale.number}
                            </h2>
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    sale.is_approved
                                        ? 'bg-green-50 text-green-500'
                                        : 'bg-red-50 text-red-500'
                                }`}
                            >
                                {sale.is_approved
                                    ? 'Подтвержден'
                                    : 'Не подтвержден'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Дата продажи:
                                </p>
                                <p className="text-sm font-medium">
                                    {dayjs(sale.date).format('DD.MM.YYYY')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Дата создания:
                                </p>
                                <p className="text-sm font-medium">
                                    {dayjs(sale.created_at).format(
                                        'DD.MM.YYYY HH:mm',
                                    )}
                                </p>
                            </div>
                        </div>

                        {sale.approved_at && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-1">
                                    Дата подтверждения:
                                </p>
                                <p className="text-sm font-medium">
                                    {dayjs(sale.approved_at).format(
                                        'DD.MM.YYYY HH:mm',
                                    )}
                                </p>
                            </div>
                        )}

                        {sale.payment?.notes && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-1">
                                    Информация:
                                </p>
                                <p className="text-sm font-medium">
                                    {sale.payment.notes}
                                </p>
                            </div>
                        )}

                        {/* PDF Download Button */}
                        <Button
                            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                            onClick={handleDownloadExcel}
                        >
                            <Download size={18} />
                            Excel скачать
                        </Button>
                    </div>

                    {/* Product Cards */}
                    {sale.items
                        .filter((item) => !item.is_deleted)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-4 mb-3 shadow-sm border"
                            >
                                {/* Header - Quantity Info */}
                                <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                                    <span>Количество: {item.quantity} шт.</span>
                                </div>

                                {/* Product Name */}
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 leading-snug">
                                    {item.warehouse_item.name}
                                </h3>

                                {/* Price Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Цена:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {formatNumber(item.price.amount)}{' '}
                                            {item.price.currency.name}
                                        </span>
                                    </div>
                                    {item.discount && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Скидка:
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {item.discount.value}%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Цена со скидкой:
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {formatNumber(
                                                        item.net_price.amount /
                                                            item.quantity,
                                                    )}{' '}
                                                    {
                                                        item.net_price.currency
                                                            .name
                                                    }
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Итого:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {formatNumber(
                                                item.net_price.amount,
                                            )}{' '}
                                            {item.net_price.currency.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Fixed Footer - Summary */}
                {/* <div className="fixed bottom-0 h-40 left-0 right-0 bg-white border-t shadow-2xl">
                    <div className="px-4 py-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Общая сумма:
                            </span>
                            <span className="text-sm font-semibold">
                                {formatNumber(totalAmount)}{' '}
                                {sale.totals[0]?.currency.name || 'UZS'}
                            </span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Скидка:
                                </span>
                                <span className="text-sm font-semibold">
                                    {formatNumber(discountAmount)}{' '}
                                    {sale.exact_discounts[0]?.currency.name ||
                                        'UZS'}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Оплата:
                            </span>
                            <span className="text-sm font-semibold">
                                {formatNumber(paymentAmount)}{' '}
                                {sale.payment?.debt_states[0]?.currency.name ||
                                    'UZS'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Долг:</span>
                            <span className="text-sm font-semibold">
                                {formatNumber(debtAmount)}{' '}
                                {sale.debts[0]?.currency.name || 'UZS'}
                            </span>
                        </div>
                    </div>
                </div> */}

                <div className="fixed bottom-0 h-40 left-0 right-0 bg-white border-t shadow-2xl">
                    <div className="m-4 px-4 py-4 space-y-3 rounded-md bg-primary-subtle">
                        <div className="flex justify-between">
                            <div className="flex flex-col items-start justify-between w-1/2">
                                <span className="text-xs text-gray-600">
                                    Общая сумма:
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                    {formatNumber(totalAmount)}{' '}
                                    {sale.totals[0]?.currency.name || 'UZS'}
                                </span>
                            </div>
                            <div className="flex flex-col items-start justify-between w-1/2">
                                <span className="text-xs text-gray-600">
                                    Скидка:
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                    {formatNumber(discountAmount)}{' '}
                                    {sale.exact_discounts[0]?.currency.name ||
                                        'UZS'}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col items-start justify-between w-1/2">
                                <span className="text-xs text-gray-600">
                                    Оплата:
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                    {formatNumber(paymentAmount)}{' '}
                                    {sale.payment?.debt_states[0]?.currency
                                        .name || 'UZS'}
                                </span>
                            </div>
                            <div className="flex flex-col items-start justify-between w-1/2">
                                <span className="text-xs text-gray-600">
                                    Долг:
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                    {formatNumber(debtAmount)}{' '}
                                    {sale.debts[0]?.currency.name || 'UZS'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesViewPage
