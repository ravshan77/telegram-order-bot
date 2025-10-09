import { useEffect, useState } from 'react'
import { Input, Segment } from '@/shared/ui/kit'
import { LocalPhoneNumberInput } from './LocalPhoneNumberInput'
import { isEmail } from '@/shared/lib/validators/isEmail'
import type { SegmentValue } from '@/shared/ui/kit/Segment/context'
import type { TypeAttributes } from '@/shared/ui/kit/@types/common'

export type PhoneEmailInputType = 'phone' | 'email'

export interface PhoneEmailInputProps  {
    size?: TypeAttributes.ControlSize;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onChangeType?: (type: PhoneEmailInputType) => void;
}

export const PhoneEmailInput = ({
    defaultValue = '',
    onChange,
    onChangeType,
    ...props
}: PhoneEmailInputProps) => {
    const [inputType, setInputType] = useState<PhoneEmailInputType>("phone")
    const [inputValue, setInputValue] = useState<string>("")

    useEffect(() => {
        const initialInputType = isEmail(defaultValue) ? 'email' : 'phone'
        setInputValue(defaultValue)
        setInputType(initialInputType)
        onChangeType?.(initialInputType)
    }, [])

    const handleInputTypeChange = (value: SegmentValue) => {
        if (value === 'phone' || value === 'email') {
            setInputType(value)
            onChangeType?.(value)
            setInputValue('')
            onChange?.('')
        }
    }

    const handleValueChange = (value: string) => {
        setInputValue(value)
        onChange?.(value)
    }

    return (
        <div>
            {inputType === 'phone'
                ? <LocalPhoneNumberInput
                    placeholder="-- --- -- --"
                    autoComplete="off"
                    value={inputValue}
                    onValueChange={({ value }) => handleValueChange(value)}
                    {...props}
                />
                : <Input
                    type="email"
                    placeholder="example@mail.com"
                    autoComplete="off"
                    value={inputValue}
                    onChange={(e) => handleValueChange(e.target.value)}
                    {...props}
                />}
            <div className="mt-2">
                <Segment value={inputType} size="xs" onChange={handleInputTypeChange}>
                    <Segment.Item value="phone" className="text-gray-800 dark:text-white">Номер телефон</Segment.Item>
                    <Segment.Item value="email" className="text-gray-800 dark:text-white">Электронная почта</Segment.Item>
                </Segment>
            </div>
        </div>
    )
}
