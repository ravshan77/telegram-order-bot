import axios from 'axios'
import { useTelegram } from '@/shared/lib/hooks'
import Loading from '@/shared/ui/kit-pro/Loading'
import { FC, ReactNode, useLayoutEffect, useState } from 'react'
import useBotConfigStore from '@/shared/store/useBotConfigStore'
import { botConfigurationsApi } from '@/entities/botConfiguration'

interface AppInitializerProps {
    children?: ReactNode
}

export const AppInitializer: FC<AppInitializerProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const tg = useTelegram()
    const { setBotConfigs } = useBotConfigStore((store) => store)

    const loadingConfigData = async () => {
        setIsLoading(true)
        try {
            const bConf = await botConfigurationsApi.getBotConfigurations()
            setBotConfigs(bConf)
        } catch (error) {
            console.error('Bot configuration yuklashda xato:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useLayoutEffect(() => {
        tg?.ready()
        tg?.expand()
        tg?.enableClosingConfirmation()

        const params = new URLSearchParams(window.location.search)
        let botID = params.get('bot_id')
        let session = window.Telegram?.WebApp?.initData || ''

        if (import.meta.env.MODE === 'development') {
            console.log('🧩 Development mode active')
            botID = import.meta.env.VITE_API_X_WEBAPP_BOT
            session = import.meta.env.VITE_API_X_WEBAPP_SESSION
        }
        console.log(botID)
        console.log(session)

        axios.defaults.headers.common['X-WEBAPP-BOT'] = botID
        axios.defaults.headers.common['X-WEBAPP-SESSION'] = session

        if (import.meta.env.VITE_API_BASE_URL) {
            axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
        }

        loadingConfigData()
    }, [])

    return (
        <Loading loading={isLoading} className={'w-full min-h-screen h-full'}>
            {children}
        </Loading>
    )
}
