import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { Input } from '@/shared/ui/kit'
import type { ReactNode, ComponentType } from 'react'
import type { InputProps } from '@/shared/ui/kit'

interface InputAffix {
    inputSuffix?: string | ReactNode
    inputPrefix?: string | ReactNode
}

interface NumberInputProps extends Omit<InputProps, 'prefix' | 'suffix'>, InputAffix {}

interface NumberFormatInputProps extends Omit<NumericFormatProps, 'form' | 'size'>, InputAffix {}

export interface NumericInputProps extends NumberInputProps, Omit<NumberFormatInputProps, keyof NumberInputProps> {}

const NumberInput = ({
    inputSuffix,
    inputPrefix,
    ...props
}: NumberInputProps) => {
    return (
        <Input
            {...props}
            value={props.value}
            suffix={inputSuffix}
            prefix={inputPrefix}
        />
    )
}

const NumberFormatInput = ({
    onValueChange,
    ...rest
}: NumberFormatInputProps) => {
    return (
        <NumericFormat
            customInput={NumberInput as ComponentType}
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

const NumericInput = ({
    inputSuffix,
    inputPrefix,
    onValueChange,
    ...rest
}: NumericInputProps) => {
    return (
        <NumberFormatInput
            inputPrefix={inputPrefix}
            inputSuffix={inputSuffix}
            onValueChange={onValueChange}
            {...rest as NumberFormatInputProps}
        />
    )
}

export default NumericInput
