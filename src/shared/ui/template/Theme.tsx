import { ConfigProvider } from '@/shared/ui/kit'
import { themeConfig } from '@/app/config/theme.config'
import useDarkMode from '@/shared/lib/hooks/useDarkMode'
import useThemeSchema from '@/shared/lib/hooks/useThemeSchema'
import useLocale from '@/shared/lib/hooks/useLocale'
import useDirection from '@/shared/lib/hooks/useDirection'
import type { CommonProps } from '@/@types/common'

const Theme = (props: CommonProps) => {
    useThemeSchema()
    useDarkMode()
    useDirection()

    const { locale } = useLocale()

    return (
        <ConfigProvider
            value={{
                locale: locale,
                ...themeConfig,
            }}
        >
            {props.children}
        </ConfigProvider>
    )
}

export default Theme
