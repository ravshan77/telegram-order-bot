export const Piece = 0
export const Kilogram = 1
export const Meter = 2
export const Litre = 3
export const MeterKv = 4

export const MeasurementType: Record<
    number,
    {
        label: string
        value: number
    }
> = {
    [Piece]: {
        label: 'шт',
        value: Piece,
    },
    [Kilogram]: {
        label: 'кг',
        value: Kilogram,
    },
    [Meter]: {
        label: 'м',
        value: Meter,
    },
    [Litre]: {
        label: 'л',
        value: Litre,
    },
    [MeterKv]: {
        label: 'кв.м',
        value: MeterKv,
    },
}
