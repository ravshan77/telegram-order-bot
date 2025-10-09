import Header from '@/shared/ui/template/Header'
import HeaderLogo from '@/shared/ui/template/HeaderLogo'
import MobileNav from '@/shared/ui/template/MobileNav'
import HorizontalNav from '@/shared/ui/template/HorizontalNav'
import LayoutBase from '@/shared/ui/template/LayoutBase'
import useResponsive from '@/shared/lib/hooks/useResponsive'
import { LAYOUT_TOP_BAR_CLASSIC } from '@/shared/config/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import { UserProfileDropdown } from '@/entities/User'
import { TaskNotificationList } from '@/features/TaskNotificationList'

const TopBarClassic = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()

    return (
        <LayoutBase
            type={LAYOUT_TOP_BAR_CLASSIC}
            className="app-layout-top-bar-classic flex flex-auto flex-col min-h-screen"
        >
            <div className="flex flex-auto min-w-0">
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        container
                        className="shadow dark:shadow-2xl"
                        headerStart={
                            <>
                                {smaller.lg && <MobileNav />}
                                <HeaderLogo />
                            </>
                        }
                        headerMiddle={<>{larger.lg && <HorizontalNav />}</>}
                        headerEnd={
                            <>
                                <TaskNotificationList />
                                <UserProfileDropdown hoverable={false} />
                            </>
                        }
                    />
                    {children}
                </div>
            </div>
        </LayoutBase>
    )
}

export default TopBarClassic
