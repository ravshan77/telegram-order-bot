import React from 'react'
import { Button } from '@/shared/ui/kit'
import { GoBack } from '@/shared/ui/kit-pro'
import { useTelegram } from '@/shared/lib/hooks'
import { Settings, MessageCircle, User } from 'lucide-react'

export const ProfilePage: React.FC = () => {
    const tg = useTelegram()
    const tg_user = tg?.initDataUnsafe?.user

    const last_name = tg_user?.last_name ? tg_user?.last_name : ''
    const photo_url = tg_user?.photo_url ? tg_user?.photo_url : null
    const username = tg_user?.username ? tg_user?.username : ''
    const first_name = tg_user?.first_name ? tg_user?.first_name : "Noma'lum"

    const handleSettings = () => {
        console.log('Navigate to settings')
        alert('Настройка page opening...')
    }

    const handleChatId = () => {
        console.log('Navigate to chat ID')
        alert('Чат ID page opening...')
    }

    return (
        <div className="">
            <div className="bg-white w-full">
                <GoBack />
            </div>

            <div className="py-4">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        {photo_url ? (
                            <img
                                src={photo_url}
                                alt={username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={80} />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                            {first_name} {last_name}
                        </h2>
                        <p className="text-sm text-gray-600">{username}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="plain"
                        shape="round"
                        className="p-6 h-40 flex flex-col items-center justify-center gap-3 shadow-sm border"
                        onClick={handleSettings}
                    >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Settings size={24} className="text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            Настройка
                        </span>
                    </Button>

                    <Button
                        variant="plain"
                        shape="round"
                        className="p-6 h-40 flex flex-col items-center justify-center gap-3 shadow-sm border"
                        onClick={handleChatId}
                    >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <MessageCircle
                                size={24}
                                className="text-gray-600"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            Чат ID
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
