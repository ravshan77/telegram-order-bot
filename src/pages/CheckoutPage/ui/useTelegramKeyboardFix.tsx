import { useEffect, useState } from 'react'

export const useTelegramKeyboardFix = () => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp

            tg.onEvent('viewportChanged', ({ isStateStable }) => {
                if (!isStateStable) {
                    setIsKeyboardOpen(true)
                } else {
                    setIsKeyboardOpen(false)
                }
            })
        }
    }, [])

    return { isKeyboardOpen }
}
