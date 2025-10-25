export interface OperationType {
    apiType: string
    label: string
    value: number
    textColor?: string
    upArrowIcon?: boolean
}

export const operationTypes: OperationType[] = [
    {
        apiType: 'OperationTypePayment',
        label: 'Оплаты',
        value: 1,
        textColor: '',
    },
    {
        apiType: 'OperationTypePayout',
        label: 'Выплаты',
        value: 2,
        textColor: 'text-red-300',
        upArrowIcon: true,
    },
    {
        apiType: 'OperationTypeSale',
        label: 'Продажи',
        value: 3,
        textColor: 'text-red-300',
        upArrowIcon: true,
    },
    {
        apiType: 'OperationTypePurchase',
        label: 'Приход',
        value: 4,
        textColor: '',
    },
    {
        apiType: 'OperationTypeRefund',
        label: 'Возврат',
        value: 5,
        textColor: '',
    },
    {
        apiType: 'OperationTypeReturn',
        label: 'Возврат',
        value: 6,
        textColor: 'text-red-300',
        upArrowIcon: true,
    },
]
