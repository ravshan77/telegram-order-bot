import React, {FC} from "react";
import { NumericFormat as NumericFormatLib } from 'react-number-format'

interface NumericFormatProps {
    value: string | number;
    decimalScale?: number;
    className?: string;
}

export const DecimalScaleTwo = 2;
export const DecimalMarkDot = ".";
export const DecimalMarkComma  = ",";
export const ThousandSeparator = " ";

export const NumericFormat: FC<NumericFormatProps> = ({className, value, decimalScale = DecimalScaleTwo}) => {
    return(
        <NumericFormatLib
            className={className}
            displayType="text"
            value={value}
            thousandSeparator={ThousandSeparator}
            decimalScale={decimalScale}
            decimalSeparator={DecimalMarkDot}
            allowNegative={true}
            allowedDecimalSeparators={[DecimalMarkComma, DecimalMarkDot]}
        />
    )
}
