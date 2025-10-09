import React from "react";
import NumericInput, { NumericInputProps } from '@/shared/ui/kit-pro/NumericInput'
import classNames from '@/shared/lib/classNames'
import type { TypeAttributes } from '@/shared/ui/kit/@types/common'

type AmountInputProps = Omit<NumericInputProps, "value" | "thousandSeparator" | "decimalScale" | "decimalSeparator" | "allowedDecimalSeparators"> & {
    size?: TypeAttributes.ControlSize
    value?: string | number | null;
}

export function AmountInput({ className, ref, value, allowNegative = true, onBlur, onValueChange, size }: AmountInputProps) {
    return (
        <NumericInput
            ref={ref}
            allowNegative={allowNegative}
            type="text"
            size={size}
            thousandSeparator={" "}
            autoComplete="off"
            placeholder="0.00000"
            decimalScale={5}
            decimalSeparator={"."}
            allowedDecimalSeparators={[
                ",",
                ".",
            ]}
            className={classNames("rounded-none text-end", className)}
            value={value ?? ""}
            onBlur={onBlur}
            onValueChange={onValueChange}
        />
    )
}
