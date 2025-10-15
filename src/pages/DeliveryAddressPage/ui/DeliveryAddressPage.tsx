import { useState } from 'react'
import { Alert, Button, Spinner } from '@/shared/ui/kit'
import { GoBack } from '@/shared/ui/kit-pro'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Plus } from 'lucide-react'
import { getDeliveryAddressMapPath } from '@/shared/config'
import {
    useDeleteDeliveryAddress,
    useDeliveryAddresses,
} from '@/entities/deliveryAddress'
import toast from 'react-hot-toast'

export const DeliveryAddressPage = () => {
    const navigate = useNavigate()

    // Fetch addresses
    const {
        data: addresses,
        isLoading,
        isError,
        error,
    } = useDeliveryAddresses()

    // const [addresses] = useState([
    //     {
    //         id: 1,
    //         city: 'Ташкент город',
    //         street: 'проспект мустақиллик',
    //         building: '17 дом',
    //     },
    //     {
    //         id: 2,
    //         city: 'Самарқанд город',
    //         street: 'проспект мустақиллик',
    //         building: '17 дом',
    //     },
    // ])

    const [showMenu, setShowMenu] = useState<string | null>(null)

    // Delete mutation
    const deleteLocation = useDeleteDeliveryAddress()

    const handleAddAddress = () => {
        navigate(getDeliveryAddressMapPath())
    }

    const toggleMenu = (id: string | null) => {
        setShowMenu(showMenu === id ? null : id)
    }

    const goToMap = (id: string) => {
        navigate(getDeliveryAddressMapPath(id))
    }

    const handleDelete = (id: string) => {
        if (confirm('Вы действительно хотите удалить этот адрес?')) {
            deleteLocation.mutate(id, {
                onSuccess: () => {
                    toast.success('Адрес удален!')
                    setShowMenu(null)
                },
                onError: (error) => {
                    toast.error(`Ошибка: ${error.message}`)
                },
            })
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    // Error state
    if (isError) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки адресов: {error?.message}
                </Alert>
            </div>
        )
    }

    return (
        <div className="">
            <div>
                {/* Header */}
                <div>
                    <GoBack text="Адрес" />
                </div>

                {/* Address List */}
                <div className="space-y-3 mt-2">
                    {addresses && addresses.length > 0 ? (
                        addresses.map((address, index) => (
                            <div
                                key={address.id}
                                className="bg-white rounded-2xl gap-3 border py-4 px-4 flex items-start justify-between"
                                onClick={() => goToMap(address.id)}
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
                                        {address.name}
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
                                        <button
                                            className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
                                            disabled={deleteLocation.isPending}
                                            onClick={() =>
                                                handleDelete(address.id)
                                            }
                                        >
                                            Ўчириш
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Адресов нет</p>
                        </div>
                    )}
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
