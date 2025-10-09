import HorizontalMenuContent from './HorizontalMenuContent'
import { useRouteKeyStore } from '@/shared/model/routeKeyStore'
import { useSessionUser } from '@/shared/model/authStore'
import appConfig from '@/app/config/app.config'
import navigationConfig from '@/app/config/navigation.config'

const HorizontalNav = ({
    translationSetup = appConfig.activeNavTranslation,
}: {
    translationSetup?: boolean
}) => {
    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    return (
        <HorizontalMenuContent
            navigationTree={navigationConfig}
            routeKey={currentRouteKey}
            userAuthority={userAuthority || []}
            translationSetup={translationSetup}
        />
    )
}

export default HorizontalNav
