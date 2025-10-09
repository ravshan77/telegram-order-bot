import { Input, InputProps } from '@/shared/ui/kit'
import useDebounce from '@/shared/lib/hooks/useDebounce'
import type { ChangeEvent, Ref } from 'react'

type DebounceInputProps = InputProps & {
    wait?: number
    ref?: Ref<HTMLInputElement>
}

const DebounceInput = (props: DebounceInputProps) => {
    const { wait = 500, ref, ...rest } = props

    function handleDebounceFn(value: ChangeEvent<HTMLInputElement>) {
        props.onChange?.(value)
    }

    const debounceFn = useDebounce(handleDebounceFn, wait)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e)
    }

    return <Input ref={ref} {...rest} onChange={handleInputChange} />
}

export default DebounceInput
