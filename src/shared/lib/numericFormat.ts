import { numericFormatter } from 'react-number-format'
import { DecimalMarkComma, DecimalMarkDot, DecimalScaleTwo, ThousandSeparator } from '@/shared/ui/kit-pro/NumericFormat'

export const numericFormat = (value: string | number, decimalScale: number = DecimalScaleTwo): string => {
    return numericFormatter(String(value), {
        displayType: "text",
        thousandSeparator:ThousandSeparator,
        decimalScale: decimalScale,
        decimalSeparator: DecimalMarkDot,
        allowNegative: true,
        allowedDecimalSeparators: [DecimalMarkComma, DecimalMarkDot],
    })
}
