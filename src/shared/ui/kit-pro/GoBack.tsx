import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import classNames from '@/shared/lib/classNames'
import Button, { ButtonProps } from '../kit/Button'

interface GoBackProps extends ButtonProps {
    text?: string
    icon?: ReactNode
    iconSize?: string | number
    navigatePath?: string | number
}

export const GoBack = ({
    text = 'Назад',
    iconSize = 20,
    icon = <ArrowLeft size={iconSize} />,
    className,
    navigatePath = -1,
    ...buttonProps
}: GoBackProps) => {
    const navigate = useNavigate()

    const btnClass = classNames(
        'p-0 text-lg text-black font-semibold',
        className,
    )

    return (
        <Button
            variant="plain"
            size="xs"
            className={btnClass}
            icon={icon}
            onClick={() => {
                if (typeof navigatePath === 'number') navigate(navigatePath)
                else navigate(navigatePath)
            }}
            {...buttonProps}
        >
            {text}
        </Button>
    )
}
