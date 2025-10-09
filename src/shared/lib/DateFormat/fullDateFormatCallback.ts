import { fullDateFormat } from '@/shared/lib/DateFormat/fullDateFormat'

export function fullDateFormatCallback(callback: (date: Date | string | null) => void): (date: Date | string | null) => void {
    return (date: Date | string | null) => {
        return callback(fullDateFormat(date));
    }
}
