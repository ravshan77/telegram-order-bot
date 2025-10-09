import ThemeConfigurator from '@/shared/ui/template/ThemeConfigurator'
import type { ThemeConfiguratorProps } from '@/shared/ui/template/ThemeConfigurator'

export type SidePanelContentProps = ThemeConfiguratorProps

const SidePanelContent = (props: SidePanelContentProps) => {
    return <ThemeConfigurator {...props} />
}

export default SidePanelContent
