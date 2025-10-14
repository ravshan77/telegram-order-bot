import { Suspense, useEffect } from 'react'
import Loading from '@/shared/ui/kit-pro/Loading'
import type { CommonProps } from '@/@types/common'
import { useThemeStore } from '@/shared/model/themeStore'
import PostLoginLayout from './PostLoginLayout'
import PreLoginLayout from './PreLoginLayout'
import { useTelegram } from '@/shared/lib/hooks'
// import { useUserStore } from '@/entities/User'

const Layout = ({ children }: CommonProps) => {
    const layoutType = useThemeStore((state) => state.layout.type)
    const tg = useTelegram()

    // const { authenticated } = useUserStore()
    const { authenticated } = { authenticated: true }

    useEffect(() => {
        if (!tg) return

        // Telegram ni sozlash
        tg.ready()
        tg.expand()
        tg.enableClosingConfirmation()

        // Keyboard tracking uchun initial heightlarni saqlash
        let initialVisualHeight =
            window.visualViewport?.height || window.innerHeight

        // Keyboard ochilganda fixed elementlarni yashirish
        const handleKeyboard = () => {
            const visualHeight =
                window.visualViewport?.height || window.innerHeight
            const heightDiff = initialVisualHeight - visualHeight

            // Fixed bottom elementlarni topish
            const fixedElements = document.querySelectorAll<HTMLElement>(
                '[class*="fixed"][class*="bottom"], [style*="position: fixed"][style*="bottom"]',
            )

            if (heightDiff > 150) {
                // Keyboard ochilgan - fixed elementlarni yashirish
                fixedElements.forEach((el) => {
                    el.style.display = 'none'
                })
            } else {
                // Keyboard yopilgan - fixed elementlarni ko'rsatish
                fixedElements.forEach((el) => {
                    el.style.display = ''
                })
            }
        }

        // Event listeners
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleKeyboard)
            window.visualViewport.addEventListener('scroll', handleKeyboard)
        }
        window.addEventListener('resize', handleKeyboard)

        // Cleanup
        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener(
                    'resize',
                    handleKeyboard,
                )
                window.visualViewport.removeEventListener(
                    'scroll',
                    handleKeyboard,
                )
            }
            window.removeEventListener('resize', handleKeyboard)
        }
    }, [tg])

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
