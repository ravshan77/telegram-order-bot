import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import React, { useEffect } from 'react'
import { useSale } from '@/entities/sales'
import { useParams } from 'react-router-dom'
import { GoBack } from '@/shared/ui/kit-pro'
import { Alert, Button, Spinner } from '@/shared/ui/kit'
import { salesApi } from '@/entities/sales/api/salesApi'
import { numericFormat } from '@/shared/lib/numericFormat'
import { DiscountType } from '@/shared/config'

export const SalesViewPage: React.FC = () => {
    const { saleId } = useParams<{ saleId: string }>()

    const { data: sale, isLoading, isError, error } = useSale(saleId!)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [saleId])

    const handleDownloadExcel = async () => {
        try {
            await salesApi.downloadSaleExcel(saleId!)
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

    if (isError || !sale) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки продажи: {error?.message}
                </Alert>
            </div>
        )
    }

    const is_excat_discount =
        sale.exact_discounts.length > 0 || Number(sale?.percent_discount) > 0

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

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">
                                Информация:
                            </p>
                            <p className="text-sm font-medium">
                                {sale?.payment?.notes || 'Не введено'}
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

                    {sale.items
                        .filter((item) => !item.is_deleted)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-4 mb-3 shadow-sm border"
                            >
                                <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                                    <span>Количество: {item.quantity} шт.</span>
                                </div>

                                <h3 className="text-sm font-semibold text-gray-900 mb-3 leading-snug">
                                    {item.warehouse_item.name}
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Цена:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {numericFormat(item.price.amount)}{' '}
                                            {item.price.currency.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Скидка:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {item?.discount?.value}{' '}
                                            {item?.discount?.type &&
                                            item?.discount?.value
                                                ? DiscountType[
                                                      item?.discount?.type
                                                  ]?.label
                                                : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Цена со скидкой:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {numericFormat(
                                                item.net_price.amount /
                                                    item.quantity,
                                            )}{' '}
                                            {item.net_price.currency.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Итого:
                                        </span>
                                        <span className="text-sm font-medium">
                                            {numericFormat(
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

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl">
                    <div className="m-4 px-4 py-4 space-y-3 rounded-md bg-primary-subtle">
                        <div className="flex items-start justify-between">
                            <span className="text-xs text-gray-600">
                                Общая сумма:
                            </span>

                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {sale.totals.length ? (
                                    sale.totals?.map((crn) => (
                                        <span
                                            key={crn?.currency.id}
                                            className="text-base font-bold text-gray-600"
                                        >
                                            {numericFormat(crn?.amount)}{' '}
                                            {crn?.currency.name}
                                        </span>
                                    ))
                                ) : (
                                    <>
                                        <span className="text-base font-bold text-gray-600">
                                            0
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start justify-between">
                            <span className="text-xs text-gray-600">
                                Скидка:
                            </span>

                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {sale.exact_discounts.length ? (
                                    sale.exact_discounts?.map((crn) => (
                                        <span
                                            key={crn?.currency.id}
                                            className="text-base font-bold text-gray-600"
                                        >
                                            {numericFormat(crn?.amount)}{' '}
                                            {crn?.currency.name}
                                        </span>
                                    ))
                                ) : (
                                    <>
                                        <span className="text-base font-bold text-gray-600">
                                            {sale?.percent_discount ? (
                                                <>
                                                    {numericFormat(
                                                        sale?.percent_discount,
                                                    )}{' '}
                                                    %
                                                </>
                                            ) : (
                                                0
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {is_excat_discount ? (
                            <div className="flex items-start justify-between">
                                <span className="text-xs text-gray-600">
                                    Цена со скидкой:
                                </span>

                                <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                    {sale.percent_discount
                                        ? sale.after_exact_discounts_and_percent_discount?.map(
                                              (crn) => (
                                                  <span
                                                      key={crn?.currency.id}
                                                      className="text-base font-bold text-gray-600"
                                                  >
                                                      {numericFormat(
                                                          crn?.amount,
                                                      )}{' '}
                                                      {crn?.currency.name}
                                                  </span>
                                              ),
                                          )
                                        : sale.totals_after_exact_discount?.map(
                                              (crn) => (
                                                  <span
                                                      key={crn?.currency.id}
                                                      className="text-base font-bold text-gray-600"
                                                  >
                                                      {numericFormat(
                                                          crn?.amount,
                                                      )}{' '}
                                                      {crn?.currency.name}
                                                  </span>
                                              ),
                                          )}
                                </div>
                            </div>
                        ) : null}

                        <div className="flex items-start justify-between">
                            <span className="text-xs text-gray-600">
                                Оплата:
                            </span>

                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {sale.payment?.debt_states.length ? (
                                    sale.payment?.debt_states?.map((crn) => (
                                        <span
                                            key={crn?.currency.id}
                                            className="text-base font-bold text-gray-600"
                                        >
                                            {numericFormat(crn?.amount)}{' '}
                                            {crn?.currency.name}
                                        </span>
                                    ))
                                ) : (
                                    <>
                                        <span className="text-base font-bold text-gray-600">
                                            0
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start justify-between">
                            <span className="text-xs text-gray-600">Долг:</span>

                            <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                                {sale.debts.length ? (
                                    sale.debts?.map((crn) => (
                                        <span
                                            key={crn?.currency.id}
                                            className="text-base font-bold text-red-500"
                                        >
                                            {numericFormat(crn?.amount)}{' '}
                                            {crn?.currency.name}
                                        </span>
                                    ))
                                ) : (
                                    <>
                                        <span className="text-base font-bold text-gray-600">
                                            0
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesViewPage
