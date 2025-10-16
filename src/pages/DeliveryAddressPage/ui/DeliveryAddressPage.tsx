import toast from 'react-hot-toast'
import { GoBack } from '@/shared/ui/kit-pro'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Plus } from 'lucide-react'
import { getDeliveryAddressMapPath } from '@/shared/config'
import { Alert, Button, Dropdown, Spinner } from '@/shared/ui/kit'
import {
    Location,
    useDeleteDeliveryAddress,
    useDeliveryAddresses,
} from '@/entities/deliveryAddress'

export const DeliveryAddressPage = () => {
    const navigate = useNavigate()

    // Fetch addresses
    const {
        data: addresses,
        isLoading,
        isError,
        error,
    } = useDeliveryAddresses()

    // Delete mutation
    const deleteLocation = useDeleteDeliveryAddress()

    const handleAddAddress = () => {
        navigate(getDeliveryAddressMapPath('new'))
    }

    const goToMap = (id: string) => {
        navigate(getDeliveryAddressMapPath(id))
    }

    const handleDelete = (address: Location) => {
        if (window.confirm('Вы действительно хотите удалить этот адрес?')) {
            deleteLocation.mutate(
                {
                    id: address.id!,
                    data: address,
                },
                {
                    onSuccess: () => {
                        toast.success('Адрес удален!')
                    },
                    onError: (error) => {
                        toast.error(`Ошибка: ${error.message}`)
                    },
                },
            )
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
                                className="bg-white rounded-2xl gap-3 border py-4 px-4 flex items-center justify-between"
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
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Dropdown
                                        renderTitle={<MoreVertical size={20} />}
                                    >
                                        <Dropdown.Item
                                            eventKey="Ўчириш"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(address)
                                            }}
                                        >
                                            Ўчириш
                                        </Dropdown.Item>
                                    </Dropdown>
                                </div>
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
