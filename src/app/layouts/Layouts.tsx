import { Suspense } from 'react'
import PreLoginLayout from './PreLoginLayout'
import PostLoginLayout from './PostLoginLayout'
import Loading from '@/shared/ui/kit-pro/Loading'
import type { CommonProps } from '@/@types/common'
import { useThemeStore } from '@/shared/model/themeStore'

const Layout = ({ children }: CommonProps) => {
    const layoutType = useThemeStore((state) => state.layout.type)
    // const tg = useTelegram()

    // const { authenticated } = useUserStore()
    const { authenticated } = { authenticated: true }

    // useEffect(() => {
    //     tg?.ready()
    //     tg?.expand()
    //     tg?.enableClosingConfirmation()
    // }, [tg])

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            {authenticated ? (
                <PostLoginLayout layoutType={layoutType}>
                    {children}
                </PostLoginLayout>
            ) : (
                <PreLoginLayout>{children}</PreLoginLayout>
            )}
        </Suspense>
    )
}

export default Layout
