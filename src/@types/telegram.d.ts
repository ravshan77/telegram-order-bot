export {}

declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                ready: () => void
                expand: () => void
                close: () => void
                enableClosingConfirmation: () => void
                onEvent(
                    eventType: 'viewportChanged',
                    callback: (data: {
                        isStateStable: boolean
                        height: number
                    }) => void,
                ): void
                initData?: string
                initDataUnsafe?: Record<string, unknown>
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
        }
    }
}
