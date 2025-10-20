import { SelectOption } from '@/shared/types'

export const paymentOptions: SelectOption<string>[] = [
    { value: '1', label: 'Наличные' },
    { value: '2', label: 'UzCard' },
    { value: '3', label: 'Humo' },
    { value: '4', label: 'Перечисление' },
    { value: '5', label: 'Click' },
    { value: '6', label: 'Payme' },
    { value: '7', label: 'Visa' },
    // { value: '', label: 'Другое' },
]
