import classNames from '@/shared/lib/classNames'
import { Card } from '@/shared/ui/kit'
import type { CardProps } from '@/shared/ui/kit'
import useLayout from '@/shared/lib/hooks/useLayout'

type AdaptableCardProps = CardProps

const AdaptiveCard = (props: AdaptableCardProps) => {
    const { adaptiveCardActive } = useLayout()

    const { className, bodyClass, ...rest } = props

    return (
        <Card
            className={classNames(
                className,
                adaptiveCardActive && 'border-none dark:bg-transparent',
            )}
            bodyClass={classNames(bodyClass, adaptiveCardActive && 'p-0')}
            {...rest}
        />
    )
}

export default AdaptiveCard
