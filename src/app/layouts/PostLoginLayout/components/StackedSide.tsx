import Header from '@/shared/ui/template/Header'
import MobileNav from '@/shared/ui/template/MobileNav'
import LayoutBase from '@/shared/ui/template/LayoutBase'
import useResponsive from '@/shared/lib/hooks/useResponsive'
import { LAYOUT_STACKED_SIDE } from '@/shared/config/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
// import { UserProfileDropdown } from '@/entities/User'
import StackedSideNav from '@/shared/ui/template/StackedSideNav'
// import { TaskNotificationList } from '@/features/TaskNotificationList'

const StackedSide = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()

    return (
        <LayoutBase
            type={LAYOUT_STACKED_SIDE}
            className="app-layout-stacked-side flex flex-auto flex-col"
        >
            <div className="flex flex-auto min-w-0">
                {larger.lg && <StackedSideNav />}
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={<>{smaller.lg && <MobileNav />}</>}
                        headerEnd={
                            <>
                                {/* <TaskNotificationList />
                                <UserProfileDropdown hoverable={false} /> */}
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

export default StackedSide
