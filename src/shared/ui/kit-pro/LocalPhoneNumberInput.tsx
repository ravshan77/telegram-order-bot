import PatternInput, { PatternInputProps } from './PatternInput'
import type { TypeAttributes } from '@/shared/ui/kit/@types/common'

type LocalPhoneNumberInputProps = Omit<PatternInputProps, 'size' | 'format' | 'prefix' | 'startSuffixClassName'> & {
    size?: TypeAttributes.ControlSize;
}

export const LocalPhoneNumberInput = ({ size, ...props }: LocalPhoneNumberInputProps) => {
    return (
        <PatternInput
            {...props}
            size={size as any}
            startSuffixClassName={'font-semibold text-gray-800'}
            inputPrefix="+998"
            format="## ### ## ##"
        />
    )
}
