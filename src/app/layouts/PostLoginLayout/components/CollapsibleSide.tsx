import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/kit'
import Header from '@/shared/ui/template/Header'
import { useTelegram } from '@/shared/lib/hooks'
import { ShoppingCart, User } from 'lucide-react'
import SideNav from '@/shared/ui/template/SideNav'
import type { CommonProps } from '@/@types/common'
import MobileNav from '@/shared/ui/template/MobileNav'
import { useNotApprovedOrder } from '@/entities/order'
import LayoutBase from '@/shared/ui/template/LayoutBase'
import useResponsive from '@/shared/lib/hooks/useResponsive'
import SideNavToggle from '@/shared/ui/template/SideNavToggle'
import { getBasketPath, getProfilePath } from '@/shared/config'
// import useHeaderSearchStore from '@/shared/store/useHeaderSearch'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/shared/config/constants/theme.constant'

const CollapsibleSide = ({ children }: CommonProps) => {
    const tg = useTelegram()
    // const location = useLocation()
    const { larger, smaller } = useResponsive()
    const { data: order } = useNotApprovedOrder()
    // const isMainPage = location.pathname === getMainPath()
    const cart = order?.items?.filter((item) => !item?.is_deleted) || []
    const totalItems = cart?.length
    // const { setSearchItemName, searchItemName } = useHeaderSearchStore((store) => store)

    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex flex-auto flex-col bg-white"
        >
            <div className="flex flex-auto min-w-0">
                {larger.lg && <SideNav />}
                <div className="flex flex-col flex-auto min-h-screen min-w-0 w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={
                            <>
                                {smaller.lg && <MobileNav />}
                                {larger.lg && <SideNavToggle />}
                            </>
                        }
                        headerEnd={
                            <>
                                <div className="flex items-center gap-2">
                                    <Link to={getBasketPath()}>
                                        <Button
                                            id="cart-icon"
                                            variant="plain"
                                            className="p-2 relative"
                                        >
                                            <ShoppingCart size={24} />
                                            {totalItems > 0 && (
                                                <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {totalItems}
                                                </span>
                                            )}
                                        </Button>
                                    </Link>
                                    <Link to={getProfilePath()}>
                                        <div className="w-8 h-8 flex justify-center items-center text-base rounded-full overflow-hidden bg-gray-300">
                                            {tg?.initDataUnsafe?.user
                                                ?.photo_url ? (
                                                <img
                                                    loading="lazy"
                                                    src={
                                                        tg?.initDataUnsafe?.user
                                                            ?.photo_url
                                                    }
                                                />
                                            ) : (
                                                <User />
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            </>
                        }
                    />
                    <div className="h-full flex flex-auto flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default CollapsibleSide
