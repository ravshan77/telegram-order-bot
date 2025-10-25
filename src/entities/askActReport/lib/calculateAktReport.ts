import { operationTypes } from '@/shared/config/constants/operationTypes.constant'
import { ActReport, DebtState, DebtViwe } from '../model/types'

export function isDebitOperation(type: number) {
    // OperationTypePayout = 2,
    // OperationTypeSale = 3,
    // OperationTypeReturn 6
    return type === 2 || type === 3 || type === 6
}
export function isCreditOperation(type: number) {
    // OperationTypePayment = 1
    // OperationTypePurchase = 4
    // OperationTypeRefund = 5
    return type === 1 || type === 4 || type === 5
}

export const calculateTotalByCurrency = (arr: DebtState[]) => {
    const totals: Record<string, number> = {}

    arr.forEach((debt) => {
        const currencyName = debt.currency.name
        if (!totals[currencyName]) {
            totals[currencyName] = 0
        }
        totals[currencyName] += debt.amount
    })

    return Object.entries(totals).map(([currency, amount]) => ({
        currency,
        amount,
    }))
}

export function totalDebitAmount(dataAkt?: ActReport) {
    if (!dataAkt) return []
    const debitOperations = dataAkt.operations.filter((operation) =>
        isDebitOperation(operation.type),
    )
    const debitOperationDebts = debitOperations.map(
        (operation) => operation.debt_states,
    )
    const debts = debitOperationDebts.reduce(
        (array, debt) => array.concat(debt),
        [],
    )

    return calculateTotalByCurrency(debts)
}

export function totalCreditAmount(dataAkt?: ActReport) {
    if (!dataAkt) return []
    const debitOperations = dataAkt.operations.filter((operation) =>
        isCreditOperation(operation.type),
    )
    const debitOperationDebts = debitOperations.map(
        (operation) => operation.debt_states,
    )
    const debts = debitOperationDebts.reduce(
        (array, debt) => array.concat(debt),
        [],
    )

    return calculateTotalByCurrency(debts)
}

export function totalDifference(
    separableArr: DebtViwe[],
    separateArr: DebtViwe[],
) {
    const result = separableArr.map((item1) => {
        const match = separateArr.find(
            (item2) => item2.currency === item1.currency,
        )
        return {
            currency: item1.currency,
            amount: match ? item1.amount - match.amount : item1.amount,
        }
    })

    return result
}

export const findOperationType = (type: number) =>
    operationTypes.find((operation) => operation?.value === type)
