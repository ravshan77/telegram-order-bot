import toast from 'react-hot-toast'
import { GoBack } from '@/shared/ui/kit-pro'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Plus } from 'lucide-react'
import { getDeliveryAddressMapPath } from '@/shared/config'
import { Alert, Button, Dropdown, Spinner } from '@/shared/ui/kit'
import {
    Location,
    useDeliveryAddresses,
    useUpdateDefaultLocation,
    useDeleteDeliveryAddress,
    useUpdateDeliveryAddress,
} from '@/entities/deliveryAddress'

export const DeliveryAddressPage = () => {
    const navigate = useNavigate()

    const {
        data: addresses,
        isLoading,
        isError,
        error,
    } = useDeliveryAddresses()

    const deleteLocation = useDeleteDeliveryAddress()
    const updateDefaultLocation = useUpdateDefaultLocation()
    const updateLocation = useUpdateDeliveryAddress()

    const handleAddAddress = () => {
        navigate(getDeliveryAddressMapPath('new'))
    }

    const goToMap = (id: string) => {
        navigate(getDeliveryAddressMapPath(id))
    }

    const handleDelete = (address: Location) => {
        if (window.confirm('Вы действительно хотите удалить этот адрес?')) {
            deleteLocation.mutate(
                { id: address.id, data: address },
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

    const handleCheckboxChange = (address: Location) => {
        const is_confirm = window.confirm('Изменить основной адрес?')
        if (!address.is_default && is_confirm) {
            updateLocation.mutate(
                { id: address.id, data: { ...address, is_default: true } },
                {
                    onSuccess: () => {
                        toast.success('Адрес установлен как основной!')
                    },
                    onError: (error) => {
                        toast.error(`Ошибка: ${error.message}`)
                    },
                },
            )
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

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
        <div>
            <div>
                <div>
                    <GoBack text="Адрес" />
                </div>

                <div className="space-y-3 mt-2 mb-28">
                    {addresses && addresses?.locations?.length > 0 ? (
                        addresses.locations.map((address) => (
                            <div
                                key={address.id}
                                className="bg-white rounded-2xl gap-3 border py-4 px-4 flex items-center justify-between"
                            >
                                <div className="flex items-center min-h-10">
                                    <input
                                        type="checkbox"
                                        checked={address?.is_default}
                                        className="w-5 h-5 rounded border-gray-300 cursor-pointer disabled:opacity-50"
                                        disabled={
                                            updateDefaultLocation.isPending
                                        }
                                        onChange={(e) => {
                                            e.stopPropagation()
                                            handleCheckboxChange(address)
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium">
                                        {address.name}
                                    </p>
                                </div>
                                <div
                                    className="relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Dropdown
                                        renderTitle={<MoreVertical size={20} />}
                                    >
                                        <Dropdown.Item
                                            eventKey="delete"
                                            disabled={deleteLocation.isPending}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(address)
                                            }}
                                        >
                                            Удалить
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            eventKey="edit"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                goToMap(address.id)
                                            }}
                                        >
                                            Редактировать
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
