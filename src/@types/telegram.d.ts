export {}

export interface TelegramUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    allows_write_to_pm?: boolean
    photo_url?: string
}

interface TelegramWebApp {
    ready: () => void
    expand: () => void
    close: () => void
    enableClosingConfirmation: () => void
    onEvent(
        eventType: 'viewportChanged',
        callback: (data: { isStateStable: boolean; height: number }) => void,
    ): void
    initData?: string
    initDataUnsafe?: {
        user?: TelegramUser
        query_id?: string
        auth_date?: string
        hash?: string
        [key: string]: any
    }
    MainButton?: {
        text: string
        color?: string
        textColor?: string
        isVisible: boolean
        isActive: boolean
        setText: (text: string) => void
        show: () => void
        hide: () => void
        enable: () => void
        disable: () => void
        onClick: (cb: () => void) => void
    }
}

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp
        }
    }
}
