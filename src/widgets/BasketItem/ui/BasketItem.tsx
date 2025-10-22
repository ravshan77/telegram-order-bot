import { memo } from 'react'
import { Button } from '@/shared/ui/kit'
import { useItemMap } from '@/shared/lib/hooks'
import { OrderItem } from '@/entities/order/model'
import { Minus, Plus, Trash2, Image } from 'lucide-react'

interface BasketItemProps {
    item: OrderItem
    onRemove: (positionId: string) => void
    onUpdateQuantity: (
        positionId: string,
        itemId: string,
        newQty: number,
    ) => void
    updating: boolean
    deleting: boolean
}

const APP_CDN = import.meta.env.VITE_APP_CDN

export const BasketItem = ({
    item,
    onRemove,
    onUpdateQuantity,
    updating,
    deleting,
}: BasketItemProps) => {
    const { getItemById } = useItemMap()

    const found_item = getItemById(item.item.id)

    const images = found_item?.item.images.map((img) => `${APP_CDN}${img.path}`)

    return (
        <div className="bg-white rounded-2xl p-4 border cursor-pointer">
            <div className="flex gap-3">
                <div className="w-20 h-20 flex-shrink-0 border rounded-lg overflow-hidden">
                    {!images?.length ? (
                        <Image size={40} className="w-full h-full" />
                    ) : (
                        <img src={images[0]} alt="Mahsulot" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                        {item?.item?.name}
                    </h3>
                    <p className="text-sm font-bold text-primary mb-1">
                        {item?.net_price?.amount?.toLocaleString()}{' '}
                        {item?.net_price?.currency?.name}
                    </p>
                    <p className="text-xs text-gray-500">Цена продажи</p>
                </div>
            </div>

            <div className="flex items-center justify-evenly mt-4">
                <Button
                    variant="plain"
                    className="p-2 text-gray-400 hover:text-red-500"
                    disabled={deleting}
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove(item?.id)
                    }}
                >
                    <Trash2 size={20} />
                </Button>

                <div className="flex items-center gap-3">
                    <Button
                        className="w-8 h-8 rounded-lg flex items-center p-0 justify-center"
                        disabled={updating}
                        onClick={(e) => {
                            e.stopPropagation()
                            onUpdateQuantity(
                                item?.id,
                                item?.item.id,
                                item?.quantity - 1,
                            )
                        }}
                    >
                        <Minus size={16} className="text-gray-700" />
                    </Button>
                    <span className="text-base font-medium w-8 text-center">
                        {item?.quantity}
                    </span>
                    <Button
                        className="w-8 h-8 rounded-lg flex items-center p-0 justify-center"
                        disabled={updating}
                        onClick={(e) => {
                            e.stopPropagation()
                            onUpdateQuantity(
                                item?.id,
                                item?.item.id,
                                item?.quantity + 1,
                            )
                        }}
                    >
                        <Plus size={16} className="text-gray-700" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default memo(BasketItem, (prev, next) => {
    // faqat quantity yoki narx o'zgarsa render qilamiz
    return (
        prev.item.quantity === next.item.quantity &&
        prev.item.net_price.amount === next.item.net_price.amount &&
        prev.updating === next.updating &&
        prev.deleting === next.deleting
    )
})
