import { useState } from 'react'
import { Button } from '@/shared/ui/kit'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Plus } from 'lucide-react'
import { getDeliveryAddressMapPath } from '@/shared/config'

export const DeliveryAddressPage = () => {
    const navigate = useNavigate()
    const [addresses] = useState([
        {
            id: 1,
            city: 'Ташкент город',
            street: 'проспект мустақиллик',
            building: '17 дом',
        },
        {
            id: 2,
            city: 'Самарқанд город',
            street: 'проспект мустақиллик',
            building: '17 дом',
        },
    ])

    const [showMenu, setShowMenu] = useState<number | null>(null)

    const handleAddAddress = () => {
        alert('Янги адрес қўшиш формаси очилади')
        navigate(getDeliveryAddressMapPath())
    }

    const toggleMenu = (id: number | null) => {
        setShowMenu(showMenu === id ? null : id)
    }

    const goToMap = (id: number) => {
        navigate(getDeliveryAddressMapPath(id))
    }

    return (
        <div className="">
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Адрес</h2>
                </div>

                {/* Address List */}
                <div className="space-y-3">
                    {addresses.map((address, index) => (
                        <div
                            key={address.id}
                            className="bg-white rounded-2xl gap-3 border py-4 px-4 flex items-start justify-between"
                        >
                            <div className="flex items-center min-h-10">
                                <input
                                    defaultChecked={index === 0}
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 font-medium">
                                    {address.city}, {address.street},{' '}
                                    {address.building}
                                </p>
                            </div>
                            <button
                                className="ml-3 p-1 text-gray-400 hover:text-gray-600"
                                onClick={() => toggleMenu(address.id)}
                            >
                                <MoreVertical size={20} />
                            </button>

                            {showMenu === address.id && (
                                <div className="absolute right-8 mt-8 bg-white rounded-lg shadow-lg border py-2 z-10">
                                    <button
                                        className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                        onClick={() => goToMap(address.id)}
                                    >
                                        Тахрирлаш
                                    </button>
                                    <button className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600">
                                        Ўчириш
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Address Button - Fixed at bottom */}
                <div className="fixed bottom-0 left-0 right-0 h-20 py-2 px-4 bg-white border-t">
                    <Button
                        variant="solid"
                        shape="round"
                        className="w-full font-medium py-4 flex items-center justify-center gap-2"
                        onClick={handleAddAddress}
                    >
                        <Plus size={20} />
                        Добавить адрес
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DeliveryAddressPage
