import { useCallback } from 'react'
import useDarkMode from '@/shared/lib/hooks/useDarkMode'
import { Switcher } from '@/shared/ui/kit'

const ModeSwitcher = () => {
    const [isDark, setIsDark] = useDarkMode()

    const onSwitchChange = useCallback(
        (checked: boolean) => {
            setIsDark(checked ? 'dark' : 'light')
        },
        [setIsDark],
    )

    return (
        <div>
            <Switcher
                defaultChecked={isDark}
                onChange={(checked) => onSwitchChange(checked)}
            />
        </div>
    )
}

export default ModeSwitcher
