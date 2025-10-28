import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GoBack } from '@/shared/ui/kit-pro'
import { Alert, Button, Spinner, Tag } from '@/shared/ui/kit'
import { refundsApi, useRefund } from '@/entities/refund'
import { numericFormat } from '@/shared/lib/numericFormat'
import { ApprovedStatus } from '@/shared/config'

export const RefundViewPage: React.FC = () => {
    const { refundId } = useParams<{ refundId: string }>()

    const { data: refund, isLoading, isError, error } = useRefund(refundId!)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [refundId])

    const handleDownloadExcel = async () => {
        try {
            await refundsApi.downloadRefundExcel(refundId!)
            toast.success('Файл успешно загружен')
        } catch (err: any) {
            toast.error(err.message)
        }
    }

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

    return (
        <div className="pb-44">
            <div>
                <div className="bg-white w-full">
                    <GoBack navigatePath={-1} />
                </div>

                <div className="py-4">
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm border">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-base font-semibold">
                                Возврат № {refund?.number}
                            </h2>

                            <Tag
                                className={
                                    ApprovedStatus[Number(refund?.is_approved)]
                                        .bgClass
                                }
                            >
                                <span
                                    className={`capitalize font-semibold ${ApprovedStatus[Number(refund?.is_approved)].textClass}`}
                                >
                                    {
                                        ApprovedStatus[
                                            Number(refund?.is_approved)
                                        ].label
                                    }
                                </span>
                            </Tag>
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

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">
                                Информация:
                            </p>
                            <p className="text-sm font-medium">
                                {refund?.notes || 'Не введено'}
                            </p>
                        </div>

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
                                    {/* <span>
                                        Количество упаковок: {item.quantity}
                                    </span> */}
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
                                            {numericFormat(item?.price?.amount)}{' '}
                                            {item?.price?.currency?.name}
                                        </span>
                                    </div>

                                    {/* <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Скидка:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {item?.discount?.value || 0}%
                                        </span>
                                    </div> */}
                                    {/* <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Цена со скидкой:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {numericFormat(
                                                item?.price?.amount /
                                                    item?.quantity,
                                            )}{' '}
                                            {item?.price?.currency?.name}
                                        </span>
                                    </div> */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Количество:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {numericFormat(
                                                item?.price?.amount *
                                                    item?.quantity,
                                            )}{' '}
                                            {item?.price?.currency?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Fixed Footer - Summary */}

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl">
                    <div className="m-4 px-4 py-4 space-y-2 rounded-md bg-primary-subtle">
                        {/* <div className="flex justify-between"> */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Общая сумма:
                            </span>
                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {refund?.net_price?.map((total) => (
                                    <span
                                        key={total?.currency?.id}
                                        className="text-sm font-semibold text-primary"
                                    >
                                        {numericFormat(total?.amount)}{' '}
                                        {total?.currency?.name}
                                    </span>
                                )) ?? 0}
                            </div>
                        </div>
                        {/* </div> */}
                        {/* <div className="flex justify-between"> */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Оплата:
                            </span>

                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {refund?.payout?.debt_states?.map((total) => (
                                    <span
                                        key={total?.currency?.id}
                                        className="text-sm font-semibold text-primary"
                                    >
                                        {numericFormat(total?.amount)}{' '}
                                        {total?.currency?.name}
                                    </span>
                                )) ?? 0}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Долг:</span>
                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {refund?.debts?.map((total) => (
                                    <span
                                        key={total?.currency?.id}
                                        className="text-sm font-semibold text-primary"
                                    >
                                        {numericFormat(total?.amount)}{' '}
                                        {total?.currency?.name}
                                    </span>
                                )) ?? 0}
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RefundViewPage
