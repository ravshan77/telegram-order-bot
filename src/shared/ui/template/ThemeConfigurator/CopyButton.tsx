import { Notification, Button, toast } from '@/shared/ui/kit'
import { themeConfig } from '@/app/config/theme.config'
import { useThemeStore } from '@/shared/model/themeStore'

const CopyButton = () => {
    const theme = useThemeStore((state) => state)

    const handleCopy = () => {
        const config = {
            ...themeConfig,
            ...theme,
            layout: {
                type: theme.layout.type,
                sideNavCollapse: theme.layout.sideNavCollapse,
            },
            panelExpand: false,
        }

        navigator.clipboard.writeText(`
            
export const themeConfig: ThemeConfig = ${JSON.stringify(config, null, 2)}
`)

        toast.push(
            <Notification title="Copy Success" type="success">
                {`Please replace themeConfig in 'src/configs/theme.config.ts'`}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <Button block variant="solid" onClick={handleCopy}>
            Copy config
        </Button>
    )
}

export default CopyButton
