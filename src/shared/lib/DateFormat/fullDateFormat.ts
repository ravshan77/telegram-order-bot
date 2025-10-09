import dayjs from 'dayjs'

export function fullDateFormat(date?: Date | string | null, defaultValue?: string): string{
    if(!date) return defaultValue || "";

    return dayjs(date).format('YYYY-MM-DD');
}
