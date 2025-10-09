import SideNav from '@/shared/ui/template/SideNav'
import Header from '@/shared/ui/template/Header'
import FrameLessGap from '@/shared/ui/template/FrameLessGap'
import SideNavToggle from '@/shared/ui/template/SideNavToggle'
import MobileNav from '@/shared/ui/template/MobileNav'
import LayoutBase from '@/shared/ui/template/LayoutBase'
import classNames from '@/shared/lib/classNames'
import useScrollTop from '@/shared/lib/hooks/useScrollTop'
import useResponsive from '@/shared/lib/hooks/useResponsive'
import { LAYOUT_FRAMELESS_SIDE } from '@/shared/config/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import type { FooterPageContainerType } from '@/shared/ui/template/Footer'
import { UserProfileDropdown } from '@/entities/User'
import { TaskNotificationList } from '@/features/TaskNotificationList'

const FrameLessSide = ({ children }: CommonProps) => {
    const { isSticky } = useScrollTop()

    const { larger, smaller } = useResponsive()

    return (
        <LayoutBase
            adaptiveCardActive
            type={LAYOUT_FRAMELESS_SIDE}
            className="app-layout-frameless-side flex flex-auto flex-col bg-gray-950"
            pageContainerReassemble={({
                pageContainerType,
                pageBackgroundType,
                pageContainerGutterClass,
                children,
                footer,
                header,
                defaultClass,
                pageContainerDefaultClass,
                PageContainerBody,
                PageContainerFooter,
                PageContainerHeader,
            }) => (
                <div
                    className={classNames(
                        defaultClass,
                        'rounded-2xl',
                        pageBackgroundType === 'plain' &&
                            'bg-white dark:bg-gray-900',
                    )}
                >
                    <main className="h-full">
                        <div
                            className={classNames(
                                pageContainerDefaultClass,
                                pageContainerType !== 'gutterless' &&
                                    pageContainerGutterClass,
                                pageContainerType === 'contained' &&
                                    'container mx-auto',
                                !footer && 'pb-0 sm:pb-0 md:pb-0',
                            )}
                        >
                            <PageContainerHeader
                                {...header}
                                gutterLess={pageContainerType === 'gutterless'}
                            />
                            <PageContainerBody
                                pageContainerType={pageContainerType}
                            >
                                {children}
                            </PageContainerBody>
                        </div>
                    </main>
                    <PageContainerFooter
                        footer={footer}
                        pageContainerType={
                            pageContainerType as FooterPageContainerType
                        }
                    />
                </div>
            )}
        >
            <div className="flex flex-auto min-w-0">
                {larger.lg && (
                    <SideNav
                        background={false}
                        className={classNames('dark pt-6')}
                        contentClass="h-[calc(100vh-8rem)]"
                        mode="dark"
                    />
                )}
                <FrameLessGap className="min-h-screen min-w-0 relative w-full">
                    <div className="bg-white dark:bg-gray-900 flex flex-col flex-1 h-full rounded-2xl">
                        <Header
                            className={classNames(
                                'rounded-t-2xl dark:bg-gray-900',
                                isSticky && 'shadow !rounded-none',
                            )}
                            headerStart={
                                <>
                                    {smaller.lg && <MobileNav />}
                                    {larger.lg && <SideNavToggle />}
                                </>
                            }
                            headerEnd={
                                <>
                                    <TaskNotificationList />
                                    <UserProfileDropdown hoverable={false} />
                                </>
                            }
                        />
                        <div className="h-full flex flex-auto flex-col">
                            {children}
                        </div>
                    </div>
                </FrameLessGap>
            </div>
        </LayoutBase>
    )
}

export default FrameLessSide
