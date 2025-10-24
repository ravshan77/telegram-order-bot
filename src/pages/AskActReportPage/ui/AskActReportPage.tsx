import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import DatePicker from 'react-datepicker'
import { useSearchParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Input, Spinner } from '@/shared/ui/kit'
import { askActReportApi, useAskActReports } from '@/entities/askActReport'
import { operationTypes } from '@/shared/config/constants/operationTypes.constant'

type FilterKey = 'date_start' | 'date_end'

export const AskActReportPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const today = dayjs().format('YYYY-MM-DD')
    const urlDateStart = searchParams.get('date_start')
    const urlDateEnd = searchParams.get('date_end')
    const initialDateStart = urlDateStart ?? today
    const initialDateEnd = urlDateEnd ?? today

    const [filters, setFilters] = useState({
        date_start: initialDateStart,
        date_end: initialDateEnd,
    })

    useEffect(() => {
        const params: Record<string, string> = {}

        if (filters.date_start) {
            params.date_start = dayjs(filters.date_start).format('YYYY-MM-DD')
        }

        if (filters.date_end) {
            params.date_end = dayjs(filters.date_end).format('YYYY-MM-DD')
        }

        setSearchParams(params)
    }, [filters, setSearchParams])

    const apiParams = {
        date_start: filters.date_start,
        date_end: filters.date_end,
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
    } = useAskActReports(apiParams, {
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
                    Ошибка загрузки отчета: {error?.message}
                </Alert>
            </div>
        )
    }

    const handleDownloadExcel = async () => {
        try {
            await askActReportApi.downloadAskActReportExcel({
                date_start: filters.date_start!,
                date_end: filters.date_end!,
            })

            toast.success('Файл успешно загружен')
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleFilter = (date: Date | null, name: string) =>
        setFilters((prev) => ({
            ...prev,
            [name]: dayjs(date).format('YYYY-MM-DD'),
        }))
    const selected = (name: FilterKey) =>
        filters[name] ? dayjs(filters[name], 'YYYY-MM-DD').toDate() : null
    const date_value = (name: FilterKey) =>
        dayjs(filters[name]).format('DD.MM.YYYY')

    return (
        <div className="pb-32">
            {/* Header */}
            <div className="mb-3">
                <h2 className="text-lg font-semibold pb-2">АКТ сверка</h2>
                <div className="flex items-center justify-between gap-2 text-sm">
                    <DatePicker
                        selected={selected('date_start')}
                        dateFormat="dd.MM.yyyy"
                        name="date_start"
                        disabledKeyboardNavigation={true}
                        placeholderText="от"
                        popperPlacement="bottom-end"
                        customInput={
                            <Input
                                readOnly
                                value={date_value('date_start')}
                                inputMode="none"
                                onFocus={(e) => e.target.blur()}
                            />
                        }
                        onChange={(date) => handleFilter(date, 'date_start')}
                    />

                    <DatePicker
                        selected={selected('date_end')}
                        dateFormat="dd.MM.yyyy"
                        disabledKeyboardNavigation={true}
                        placeholderText="до"
                        popperPlacement="bottom-start"
                        customInput={
                            <Input
                                readOnly
                                value={date_value('date_end')}
                                inputMode="none"
                                onFocus={(e) => e.target.blur()}
                            />
                        }
                        onChange={(date) => handleFilter(date, 'date_end')}
                    />
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm border ">
                <div className="flex justify-between">
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">
                            Общая разница:
                        </p>
                        <p className="text-sm font-medium">{'dataAkt.'}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Итого:</p>
                        <p className="text-sm font-medium">{'dataAkt.'}</p>
                    </div>
                </div>

                <Button
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={handleDownloadExcel}
                >
                    <Download size={18} />
                    Excel скачать
                </Button>
            </div>

            {/* Transaction Cards - Scrollable */}
            <div className="px-0 py-4 space-y-3">
                {dataAkt?.operations?.map((oprs) => (
                    <div
                        key={oprs.id}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                                {oprs.contractor.name}
                            </span>
                            <span className="text-xs text-gray-400">
                                {oprs.date}
                            </span>
                        </div>

                        <div className="mb-3">
                            <span className="text-base text-gray-900">
                                {
                                    operationTypes?.find(
                                        (opt_t) => opt_t?.value === oprs?.type,
                                    )?.label
                                }
                            </span>
                        </div>

                        <div className="text-right flex gap-1 justify-end [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                            {oprs.debt_states?.map((crn) => {
                                return (
                                    <span
                                        key={crn?.currency.id}
                                        className="text-lg font-semibold flex text-primary"
                                    >
                                        {crn?.amount?.toLocaleString()}{' '}
                                        {crn?.currency.name}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* fixed bar */}
            <div className="w-full bg-white fixed flex flex-col justify-between items-start bottom-0 left-0 right-0 py-2 pb-6 px-4 border-t">
                <div className="w-full h-10 my-2 px-3 flex justify-between items-center rounded-md bg-primary-subtle">
                    <span className="text-sm font-semibold">
                        Нач. задолженности:
                    </span>
                    <div className="text-right flex gap-1 [&>*:not(:last-child)]:after:content-['|'] [&>*:not(:last-child)]:after:mx-1">
                        {dataAkt?.before_debts?.map((crn) => {
                            return (
                                <span
                                    key={crn?.currency.id}
                                    className="text-sm font-semibold flex text-primary"
                                >
                                    {crn?.amount?.toLocaleString()}{' '}
                                    {crn?.currency.name}
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
                        {dataAkt?.after_debts?.map((crn) => {
                            return (
                                <span
                                    key={crn?.currency.id}
                                    className="text-sm font-semibold flex text-primary"
                                >
                                    {crn?.amount?.toLocaleString()}{' '}
                                    {crn?.currency?.name}
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AskActReportPage
