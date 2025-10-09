import { Button } from '@/shared/ui/kit'
import { InputGroup } from '@/shared/ui/kit'
import useDirection from '@/shared/lib/hooks/useDirection'
import { THEME_ENUM } from '@/shared/config/constants/theme.constant'
import type { Direction } from '@/@types/theme'

const dirList = [
    { value: THEME_ENUM.DIR_LTR, label: 'LTR' },
    { value: THEME_ENUM.DIR_RTL, label: 'RTL' },
]

const DirectionSwitcher = ({
    callBackClose,
}: {
    callBackClose?: () => void
}) => {
    const [direction, setDirection] = useDirection()

    const onDirChange = (val: Direction) => {
        setDirection(val)
        callBackClose?.()
    }

    return (
        <InputGroup size="sm">
            {dirList.map((dir) => (
                <Button
                    key={dir.value}
                    active={direction === dir.value}
                    onClick={() => onDirChange(dir.value)}
                >
                    {dir.label}
                </Button>
            ))}
        </InputGroup>
    )
}

export default DirectionSwitcher
