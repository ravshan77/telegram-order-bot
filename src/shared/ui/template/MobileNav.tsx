import { useState, Suspense, lazy } from 'react'
import classNames from 'classnames'
import { Drawer } from '@/shared/ui/kit'
import NavToggle from '@/shared/ui/kit-pro/NavToggle'
import { DIR_RTL } from '@/shared/config/constants/theme.constant'
import withHeaderItem, {
    WithHeaderItemProps,
} from '@/shared/lib/hoc/withHeaderItem'
import navigationConfig from '@/app/config/navigation.config'
import appConfig from '@/app/config/app.config'
import { useThemeStore } from '@/shared/model/themeStore'
import { useRouteKeyStore } from '@/shared/model/routeKeyStore'
import { useSessionUser } from '@/shared/model/authStore'
import Loading from '../kit-pro/Loading'

const VerticalMenuContent = lazy(
    () => import('@/shared/ui/template/VerticalMenuContent'),
)

type MobileNavToggleProps = {
    toggled?: boolean
}

type MobileNavProps = {
    translationSetup?: boolean
}

const MobileNavToggle = withHeaderItem<
    MobileNavToggleProps & WithHeaderItemProps
>(NavToggle)

const NavTitle = () => {
    return (
        <div>
            <p>Время работы</p>
            <p className="text-base">07:00 - 24:00</p>
        </div>
    )
}

const MobileNav = ({
    translationSetup = appConfig.activeNavTranslation,
}: MobileNavProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpenDrawer = () => {
        setIsOpen(true)
    }

    const handleDrawerClose = () => {
        setIsOpen(false)
    }

    const direction = useThemeStore((state) => state.direction)
    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    return (
        <>
            <div className="text-2xl" onClick={handleOpenDrawer}>
                <MobileNavToggle toggled={isOpen} />
            </div>
            <Drawer
                title={<NavTitle />}
                isOpen={isOpen}
                bodyClass={classNames('p-0')}
                width={330}
                placement={direction === DIR_RTL ? 'right' : 'left'}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
            >
                <Suspense
                    fallback={<Loading loading={true} className="w-full" />}
                >
                    {isOpen && (
                        <VerticalMenuContent
                            collapsed={false}
                            navigationTree={navigationConfig}
                            routeKey={currentRouteKey}
                            userAuthority={userAuthority as string[]}
                            direction={direction}
                            translationSetup={translationSetup}
                            onMenuItemClick={handleDrawerClose}
                        />
                    )}
                </Suspense>
            </Drawer>
        </>
    )
}

export default MobileNav
