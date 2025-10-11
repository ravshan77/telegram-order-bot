export const DebtPage = () => {
    const currentDebt = [
        {
            currency: 'UZS',
            amount: '119 000',
        },
        {
            currency: 'USD',
            amount: '12,72$',
        },
    ]

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
                        {currentDebt.map((debt, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center"
                            >
                                <span className="text-gray-500 text-sm">
                                    {debt.currency}
                                </span>
                                <span className="font-semibold text-black text-base">
                                    {debt.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
