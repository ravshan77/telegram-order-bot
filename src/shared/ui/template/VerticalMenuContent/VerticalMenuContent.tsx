import { Menu } from '@/shared/ui/kit'
import { Direction } from '@/@types/theme'
import type { TraslationFn } from '@/@types/common'
import { ChevronRight, Loader } from 'lucide-react'
import { useTranslation } from '@/shared/lib/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, Fragment } from 'react'
import { themeConfig } from '@/app/config/theme.config'
import { getDeliveryAddressPath } from '@/shared/config'
import type { NavigationTree } from '@/@types/navigation'
import useMenuActive from '@/shared/lib/hooks/useMenuActive'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
import AuthorityCheck from '@/shared/ui/kit-pro/AuthorityCheck'
import { useDeliveryAddresses } from '@/entities/deliveryAddress'
import VerticalCollapsedMenuItem from './VerticalCollapsedMenuItem'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/shared/config/constants/navigation.constant'
import useResponsive from '@/shared/lib/hooks/useResponsive'

export interface VerticalMenuContentProps {
    collapsed?: boolean
    routeKey: string
    navigationTree?: NavigationTree[]
    onMenuItemClick?: () => void
    direction?: Direction
    translationSetup?: boolean
    userAuthority: string[]
}

const { MenuGroup } = Menu

const VerticalMenuContent = (props: VerticalMenuContentProps) => {
    const {
        collapsed,
        routeKey,
        navigationTree = [],
        onMenuItemClick,
        direction = themeConfig.direction,
        translationSetup,
        userAuthority,
    } = props

    const { data: addresses, isLoading } = useDeliveryAddresses()
    const { larger } = useResponsive()

    const { t } = useTranslation(!translationSetup)
    const navigate = useNavigate()

    const [defaulExpandKey, setDefaulExpandKey] = useState<string[]>([])
    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    useEffect(() => {
        if (activedRoute?.parentKey) {
            setDefaulExpandKey([activedRoute?.parentKey])
        }
    }, [activedRoute?.parentKey])

    const handleLinkClick = () => {
        onMenuItemClick?.()
    }

    const renderNavigation = (
        navTree: NavigationTree[],
        cascade: number = 0,
        indent?: boolean,
    ) => {
        const nextCascade = cascade + 1

        return (
            <>
                {navTree.map((nav) => (
                    <Fragment key={nav.key}>
                        {nav.type === NAV_ITEM_TYPE_ITEM && (
                            <VerticalSingleMenuItem
                                key={nav.key}
                                currentKey={activedRoute?.key}
                                parentKeys={defaulExpandKey}
                                nav={nav}
                                sideCollapsed={collapsed}
                                direction={direction}
                                indent={indent}
                                renderAsIcon={cascade <= 0}
                                showIcon={cascade <= 0}
                                userAuthority={userAuthority}
                                showTitle={
                                    collapsed ? cascade >= 1 : cascade <= 1
                                }
                                t={t as TraslationFn}
                                onLinkClick={handleLinkClick}
                            />
                        )}
                        {nav.type === NAV_ITEM_TYPE_COLLAPSE && (
                            <VerticalCollapsedMenuItem
                                key={nav.key}
                                currentKey={activedRoute?.key}
                                parentKeys={defaulExpandKey}
                                nav={nav}
                                sideCollapsed={collapsed}
                                direction={direction}
                                indent={nextCascade >= 2}
                                dotIndent={nextCascade >= 2}
                                renderAsIcon={nextCascade <= 1}
                                userAuthority={userAuthority}
                                t={t as TraslationFn}
                                onLinkClick={onMenuItemClick}
                            >
                                {nav.subMenu &&
                                    nav.subMenu.length > 0 &&
                                    renderNavigation(
                                        nav.subMenu,
                                        nextCascade,
                                        true,
                                    )}
                            </VerticalCollapsedMenuItem>
                        )}
                        {nav.type === NAV_ITEM_TYPE_TITLE && (
                            <AuthorityCheck
                                userAuthority={userAuthority}
                                authority={nav.authority}
                            >
                                <MenuGroup
                                    key={nav.key}
                                    label={t(nav.translateKey) || nav.title}
                                >
                                    {nav.subMenu &&
                                        nav.subMenu.length > 0 &&
                                        renderNavigation(
                                            nav.subMenu,
                                            cascade,
                                            false,
                                        )}
                                </MenuGroup>
                            </AuthorityCheck>
                        )}
                    </Fragment>
                ))}
            </>
        )
    }

    /// Custom Menu-Item (delivery-address)

    const handleNavigatePath = () => {
        navigate(getDeliveryAddressPath())
        handleLinkClick()
    }

    const address = addresses?.locations?.find((adrss) => adrss.is_default)

    return (
        <Menu
            className="px-4 pb-44 relative"
            sideCollapsed={collapsed}
            defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
            defaultExpandedKeys={defaulExpandKey}
            defaultCollapseActiveKeys={
                activedRoute?.parentKey ? [activedRoute.parentKey] : []
            }
        >
            {renderNavigation(navigationTree, 0)}
            <AuthorityCheck userAuthority={userAuthority} authority={[]}>
                <div
                    className={`fixed ${larger?.lg ? 'w-[260px]' : 'w-[300px]'} bottom-6 ${collapsed ? 'hidden' : ''}`}
                >
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <div
                            className="bg-gray-100 p-3 flex flex-col items-start rounded-lg overflow-hidden"
                            onClick={handleNavigatePath}
                        >
                            <div className="w-full flex justify-between items-center">
                                <span>Адрес доставки</span>
                                <ChevronRight size={24} />
                            </div>
                            <p className="pt-1 text-base text-black line-clamp-2">
                                {address?.name
                                    ? address?.name
                                    : 'Введите ваш основной адрес доставки'}
                            </p>
                        </div>
                    )}
                    <div className="pt-4">
                        <span>Разработано: &ensp; </span>
                        <Link
                            to={'https://hippo.uz/uz/'}
                            className="text-primary"
                            target="_blank"
                        >
                            <span>Hippo.uz</span>
                        </Link>
                    </div>
                </div>
            </AuthorityCheck>
        </Menu>
    )
}

export default VerticalMenuContent
