import dayjs from 'dayjs'

export function fullTimeFormat(date?: Date | string | number, defaultValue?: string): string{
    if(!date) return defaultValue || "";

    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}
