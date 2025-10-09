import classNames from '@/shared/lib/classNames'
import { ScrollBar } from '@/shared/ui/kit'
import Logo from '@/shared/ui/template/Logo'
import VerticalMenuContent from '@/shared/ui/template/VerticalMenuContent'
import { useThemeStore } from '@/shared/model/themeStore'
import { useSessionUser } from '@/shared/model/authStore'
import { useRouteKeyStore } from '@/shared/model/routeKeyStore'
import navigationConfig from '@/app/config/navigation.config'
import appConfig from '@/app/config/app.config'
import { Link } from 'react-router-dom'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    // SIDE_NAV_CONTENT_GUTTER,
    HEADER_HEIGHT,
    // LOGO_X_GUTTER,
} from '@/shared/config/constants/theme.constant'
import type { Mode } from '@/@types/theme'

type SideNavProps = {
    translationSetup?: boolean
    background?: boolean
    className?: string
    contentClass?: string
    mode?: Mode
}

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = ({
    translationSetup = appConfig.activeNavTranslation,
    background = true,
    className,
    contentClass,
}: SideNavProps) => {
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            <Link
                to={appConfig.authenticatedEntryPath}
                className="side-nav-header flex flex-col justify-center"
                style={{ height: HEADER_HEIGHT }}
            >
                <Logo collapsed={sideNavCollapse} size={50} />
            </Link>
            <div className={classNames('side-nav-content', contentClass)}>
                <ScrollBar style={{ height: '100%' }} direction={direction}>
                    <VerticalMenuContent
                        collapsed={sideNavCollapse}
                        navigationTree={navigationConfig}
                        routeKey={currentRouteKey}
                        direction={direction}
                        translationSetup={translationSetup}
                        userAuthority={userAuthority || []}
                    />
                </ScrollBar>
            </div>
        </div>
    )
}

export default SideNav
