export const ApprovedStatus: Record<
    number,
    {
        label: string
        bgClass: string
        textClass: string
    }
> = {
    1: {
        label: 'Подтверждён',
        bgClass: 'bg-success-subtle',
        textClass: 'text-success',
    },
    0: {
        label: 'Не подтверждён',
        bgClass: 'bg-warning-subtle',
        textClass: 'text-warning',
    },
}
