import dayjs from 'dayjs'
import React from 'react'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { GoBack } from '@/shared/ui/kit-pro'
import { Alert, Button, Spinner } from '@/shared/ui/kit'
import { refundsApi, useRefund } from '@/entities/refund'

export const RefundViewPage: React.FC = () => {
    const { refundId } = useParams<{ refundId: string }>()

    const { data: refund, isLoading, isError, error } = useRefund(refundId!)

    // const handleDownloadExcel = async () => {
    //     try {
    //         const blob = await salesApi.downloadSaleExcel(refundId!)
    //         const url = window.URL.createObjectURL(blob)
    //         const link = document.createElement('a')
    //         link.href = url
    //         link.download = `sale_${sale?.number || refundId}.xlsx`
    //         document.body.appendChild(link)
    //         link.click()
    //         document.body.removeChild(link)
    //         window.URL.revokeObjectURL(url)
    //         toast.success('Файл успешно загружен')
    //     } catch (err: any) {
    //         toast.error(err.message || 'Ошибка при скачивании файла')
    //     }
    // }

    const handleDownloadExcel = async () => {
        try {
            const response = await refundsApi.downloadRefundExcel(refundId!)
            let base64: string | undefined

            if (response instanceof Blob) {
                base64 = await response.text()
            } else if (typeof response === 'string') {
                base64 = response
            } else if (response?.data) {
                base64 = response.data
            } else if (response?.base64) {
                base64 = response.base64
            }

            if (!base64) throw new Error('Server bo‘sh ma’lumot yubordi')
            const cleanBase64 = base64.replace(/\s|"/g, '')
            const binary = atob(cleanBase64)
            const bytes = new Uint8Array(binary.length)
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i)
            }

            const blob = new Blob([bytes], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `refound_${refundId}.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            toast.success('Файл успешно загружен')
        } catch (err: any) {
            console.error('Excel yuklab olishda xato:', err)
            toast.error(
                'Excel yuklab olishda xato: ' +
                    (err.message || 'noma’lum xato'),
            )
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

    if (isError || !refund) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки Возврат: {error?.message}
                </Alert>
            </div>
        )
    }

    const formatNumber = (num: number) => {
        return num?.toLocaleString('en-US')?.replace(/,/g, ' ')
    }

    // const totalAmount = refund?.totals?.reduce(
    //     (sum, total) => sum + total?.amount,
    //     0,
    // )
    // const discountAmount = refund?.exact_discounts?.reduce(
    //     (sum, discount) => sum + discount?.amount,
    //     0,
    // )
    // const paymentAmount =
    //     refund?.payment?.debt_states?.reduce(
    //         (sum, debt) => sum + debt?.amount,
    //         0,
    //     ) || 0
    // const debtAmount = refund?.debts?.reduce(
    //     (sum, debt) => sum + debt?.amount,
    //     0,
    // )

    return (
        <div className="pb-32">
            <div>
                <div className="bg-white w-full">
                    <GoBack navigatePath={-1} />
                </div>

                <div className="py-4">
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm border">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-base font-semibold">
                                Продажа № {refund?.number}
                            </h2>
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    refund?.is_approved
                                        ? 'bg-green-50 text-green-500'
                                        : 'bg-red-50 text-red-500'
                                }`}
                            >
                                {refund?.is_approved
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
                                    {dayjs(refund?.date).format('DD.MM.YYYY')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Дата создания:
                                </p>
                                <p className="text-sm font-medium">
                                    {dayjs(refund?.created_at)?.format(
                                        'DD.MM.YYYY HH:mm',
                                    )}
                                </p>
                            </div>
                        </div>

                        {refund.approved_at && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-1">
                                    Дата подтверждения:
                                </p>
                                <p className="text-sm font-medium">
                                    {dayjs(refund?.approved_at)?.format(
                                        'DD.MM.YYYY HH:mm',
                                    )}
                                </p>
                            </div>
                        )}

                        {refund?.payment?.notes && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-1">
                                    Информация:
                                </p>
                                <p className="text-sm font-medium">
                                    {refund?.payment?.notes}
                                </p>
                            </div>
                        )}

                        <Button
                            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                            onClick={handleDownloadExcel}
                        >
                            <Download size={18} />
                            Excel скачать
                        </Button>
                    </div>

                    {refund?.items
                        ?.filter((item) => !item?.is_deleted)
                        ?.map((item) => (
                            <div
                                key={item?.id}
                                className="bg-white rounded-2xl p-4 mb-3 shadow-sm border"
                            >
                                <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                                    <span>
                                        Количество: {item?.quantity} шт.
                                    </span>
                                </div>

                                <h3 className="text-sm font-semibold text-gray-900 mb-3 leading-snug">
                                    {item?.warehouse_item?.name}
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Цена:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {item?.price?.amount?.toLocaleString()}{' '}
                                            {item?.price?.currency?.name}
                                        </span>
                                    </div>
                                    {item?.discount && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Скидка:
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {item?.discount?.value}%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Цена со скидкой:
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {formatNumber(
                                                        item?.net_price
                                                            ?.amount /
                                                            item?.quantity,
                                                    )}{' '}
                                                    {
                                                        item?.net_price
                                                            ?.currency?.name
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
                                                item?.net_price?.amount,
                                            )}{' '}
                                            {item?.net_price?.currency?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Fixed Footer - Summary */}

                <div className="fixed bottom-0 h-40 left-0 right-0 bg-white border-t shadow-2xl">
                    <div className="m-4 px-4 py-4 space-y-3 rounded-md bg-primary-subtle">
                        <div className="flex justify-between">
                            <div className="flex flex-col items-start justify-between w-1/2">
                                <span className="text-xs text-gray-600">
                                    Общая сумма:
                                </span>
                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                    {refund?.totals?.map((total) => (
                                        <span
                                            key={total.currency.id}
                                            className="text-sm font-semibold text-primary"
                                        >
                                            {total.amount.toLocaleString()}{' '}
                                            {total.currency.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-between w-1/2">
                                <span className="text-xs text-gray-600">
                                    Скидка:
                                </span>

                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                    {refund?.exact_discounts?.map((total) => (
                                        <span
                                            key={total.currency.id}
                                            className="text-sm font-semibold text-primary"
                                        >
                                            {total.amount.toLocaleString()}{' '}
                                            {total.currency.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col items-start justify-between w-1/2">
                                <span className="text-xs text-gray-600">
                                    Оплата:
                                </span>

                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                    {refund?.payment?.debt_states?.map(
                                        (total) => (
                                            <span
                                                key={total.currency.id}
                                                className="text-sm font-semibold text-primary"
                                            >
                                                {total.amount.toLocaleString()}{' '}
                                                {total.currency.name}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-between w-1/2">
                                <span className="text-xs text-gray-600">
                                    Долг:
                                </span>
                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                    {refund?.debts?.map((total) => (
                                        <span
                                            key={total.currency.id}
                                            className="text-sm font-semibold text-primary"
                                        >
                                            {total.amount.toLocaleString()}{' '}
                                            {total.currency.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RefundViewPage
