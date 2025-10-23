import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@/shared/ui/kit'
import Header from '@/shared/ui/template/Header'
import { useTelegram } from '@/shared/lib/hooks'
import SideNav from '@/shared/ui/template/SideNav'
import type { CommonProps } from '@/@types/common'
import MobileNav from '@/shared/ui/template/MobileNav'
import { useNotApprovedOrder } from '@/entities/order'
import LayoutBase from '@/shared/ui/template/LayoutBase'
import { Search, ShoppingCart, User } from 'lucide-react'
import { HeaderSearchSheet } from '@/widgets/HeaderSearch'
import useResponsive from '@/shared/lib/hooks/useResponsive'
import SideNavToggle from '@/shared/ui/template/SideNavToggle'
import { getBasketPath, getProfilePath } from '@/shared/config'
// import { useHeaderSearchStore } from '@/shared/store/useHeaderSearch'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/shared/config/constants/theme.constant'

const CollapsibleSide = ({ children }: CommonProps) => {
    const tg = useTelegram()
    const { larger, smaller } = useResponsive()
    const { data: order } = useNotApprovedOrder()
    const cart = order?.items?.filter((item) => !item?.is_deleted) || []
    // const { searchItemName, setSearchItemName } = useHeaderSearchStore(
    //     (store) => store,
    // )
    const totalItems = cart?.length

    const [searchItemName, setSearchItemName] = useState('')
    const [isOpenSheet, setIsopenSheet] = useState(false)

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
                                        value={searchItemName}
                                        onChange={(e) =>
                                            setSearchItemName(e.target.value)
                                        }
                                        onFocus={() => setIsopenSheet(true)}
                                        onBlur={() => setIsopenSheet(false)}
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
                    <HeaderSearchSheet
                        open={isOpenSheet}
                        onOpenChange={setIsopenSheet}
                        // isOpen={isOpenSheet}
                        // setIsOpen={setIsopenSheet}
                        // searchItemName={searchItemName}
                    />
                </div>
            </div>
        </LayoutBase>
    )
}

export default CollapsibleSide
