import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Drawer } from '@/shared/ui/kit'
import Loading from '../kit-pro/Loading'
import appConfig from '@/app/config/app.config'
import { useState, Suspense, lazy } from 'react'
import NavToggle from '@/shared/ui/kit-pro/NavToggle'
import { useSessionUser } from '@/shared/model/authStore'
import { useThemeStore } from '@/shared/model/themeStore'
import navigationConfig from '@/app/config/navigation.config'
import { useRouteKeyStore } from '@/shared/model/routeKeyStore'
import { DIR_RTL } from '@/shared/config/constants/theme.constant'
import LogoBrandImg from '../../../../public/hippo-logo-150x41.png'
import withHeaderItem, {
    WithHeaderItemProps,
} from '@/shared/lib/hoc/withHeaderItem'

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
        <div className="rounded-full">
            <img src={LogoBrandImg} className="w-30 h-8" />
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
                footer={
                    <div className="">
                        <span>Разработано: &ensp; </span>
                        <Link
                            to={'https://hippo.uz/uz/'}
                            className="text-primary"
                            target="_blank"
                        >
                            <span>Hippo.uz</span>
                        </Link>
                    </div>
                }
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
