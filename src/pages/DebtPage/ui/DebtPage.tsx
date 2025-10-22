import { Alert, Spinner } from '@/shared/ui/kit'
import { useDeliveryAddresses } from '@/entities/deliveryAddress'

export const DebtPage = () => {
    const {
        data: addresses,
        isLoading,
        isError,
        error,
    } = useDeliveryAddresses()

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
                    Ошибка загрузки адресов: {error?.message}
                </Alert>
            </div>
        )
    }

    const debts = addresses?.debts || []

    return (
        <div className="pb-16">
            <div>
                <div className="mb-3">
                    <h2 className="text-lg font-semibold">Задолженность</h2>
                </div>

                <div className="border p-4 rounded-2xl bg-white">
                    <h3 className="text-base font-medium mb-4 text-gray-900">
                        Ваша текущая задолжность
                    </h3>

                    <div className="space-y-3 ">
                        {debts?.map((debt, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center"
                            >
                                <span className="text-gray-500 text-sm">
                                    {debt.currency.name}
                                </span>
                                <span className="font-semibold text-black text-base">
                                    {debt.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
