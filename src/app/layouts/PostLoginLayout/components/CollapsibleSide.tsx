import { Link } from 'react-router-dom'
import { Button, Input } from '@/shared/ui/kit'
import Header from '@/shared/ui/template/Header'
import { getBasketPath } from '@/shared/config'
import SideNav from '@/shared/ui/template/SideNav'
import type { CommonProps } from '@/@types/common'
import { Search, ShoppingCart } from 'lucide-react'
import MobileNav from '@/shared/ui/template/MobileNav'
import LayoutBase from '@/shared/ui/template/LayoutBase'
import { useCartStore } from '@/shared/store/useCartStore'
import useResponsive from '@/shared/lib/hooks/useResponsive'
import SideNavToggle from '@/shared/ui/template/SideNavToggle'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/shared/config/constants/theme.constant'

const CollapsibleSide = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()

    const totalItems = useCartStore((state) =>
        state.cart.reduce((sum, item) => sum + item.quantity, 0),
    )

    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex flex-auto flex-col bg-white"
        >
            <div className="flex flex-auto min-w-0">
                {larger.lg && <SideNav />}
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={
                            <>
                                {smaller.lg && <MobileNav />}
                                {larger.lg && <SideNavToggle />}
                            </>
                        }
                        headerMiddle={
                            <>
                                <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3">
                                    <Search
                                        size={20}
                                        className="text-gray-400"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Поиск"
                                        className="h-full bg-transparent flex-1 outline-none focus:outline-none focus:ring-0"
                                    />
                                </div>
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
                                    <div className="w-8 h-8 flex justify-center items-center text-base rounded-full bg-gray-300">
                                        RF
                                    </div>
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
