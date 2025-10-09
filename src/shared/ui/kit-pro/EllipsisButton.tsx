import { Button, ButtonProps } from '@/shared/ui/kit'
import { TbDots } from 'react-icons/tb'

type EllipsisButtonProps = ButtonProps

const EllipsisButton = (props: EllipsisButtonProps) => {
    const { shape = 'circle', variant = 'plain', size = 'xs' } = props

    return (
        <Button
            shape={shape}
            variant={variant}
            size={size}
            icon={<TbDots />}
            {...props}
        />
    )
}

export default EllipsisButton
