import { memo, useState } from 'react'
import { APP_CDN } from '@/shared/api'
import { Button } from '@/shared/ui/kit'
import { OrderItem } from '@/entities/order'
import { useItemMap } from '@/shared/lib/hooks'
import { useNavigate } from 'react-router-dom'
import { getProductPath } from '@/shared/config'
import { Minus, Plus, Trash2, Image } from 'lucide-react'
import { useCartStore } from '@/shared/store/useCartStore'
import { numericFormat } from '@/shared/lib/numericFormat'
import { transformProductToView } from '@/entities/product'
import { UpdateQuantityDrawer } from '@/widgets/UpdateQuantityDrawer'

interface BasketItemProps {
    item: OrderItem
    onRemove: (positionId: string) => void
    onUpdateQuantity: (
        positionId: string,
        itemId: string,
        newQty: number,
    ) => void
    updating?: boolean
    deleting?: boolean
}

export const BasketItem = ({
    item,
    onRemove,
    onUpdateQuantity,
}: BasketItemProps) => {
    const { getItemById } = useItemMap()
    const [isOpenSheet, setIsOpenSheet] = useState(false)
    const navigate = useNavigate()
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)

    const found_item = getItemById(item?.item?.id)

    const images = found_item?.item?.images?.map(
        (img) => `${APP_CDN}${img?.path}`,
    )

    const productView = () => transformProductToView(found_item!)

    const updateQuantity = (quantity: number) => {
        onUpdateQuantity(item?.id, item?.item?.id, quantity)
    }

    const goShowProduct = () => {
        setSelectedProduct(productView())
        navigate(getProductPath(item?.id))
    }

    return (
        <div className="bg-white rounded-2xl p-2 border cursor-pointer">
            {isOpenSheet && (
                <UpdateQuantityDrawer
                    isOpen={isOpenSheet}
                    quantity={item.quantity}
                    setIsOpen={setIsOpenSheet}
                    updateQuantity={updateQuantity}
                    package_measurements={
                        found_item?.item?.package_measurements ?? []
                    }
                />
            )}
            <div className="flex gap-3" onClick={() => goShowProduct()}>
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    {!images?.length ? (
                        <Image size={40} className="w-full h-full" />
                    ) : (
                        <img src={images[0]} alt="Mahsulot" />
                    )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-3">
                    {item?.item?.name}
                </h3>
            </div>
            <div className="flex-1 min-w-0 mt-3">
                <div className="gap-2">
                    <span className="border bg-gray-100 p-1 px-2 rounded-md inline-flex items-center">
                        {item?.quantity} шт
                    </span>
                    <span> x </span>
                    <span className="border bg-gray-100 p-1 px-2 rounded-md">
                        {numericFormat(item?.price?.amount)}{' '}
                        {item?.net_price?.currency?.name}
                    </span>
                    <span> = </span>

                    <span className="border bg-gray-100 p-1 px-2 rounded-md">
                        {numericFormat(item?.net_price.amount)}{' '}
                        {item?.net_price?.currency?.name}
                    </span>
                </div>
            </div>

            <div className="flex justify-between h-10 mt-3">
                <Button
                    variant="plain"
                    className="text-gray-400 h-full0 hover:text-red-500"
                    icon={<Trash2 size={20} />}
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove(item?.id)
                    }}
                />

                <div className="flex items-center justify-between border rounded overflow-hidden">
                    <Button
                        variant="plain"
                        className="w-12 h-full flex items-center justify-center border-none outline-none"
                        icon={<Minus size={16} className="text-gray-700" />}
                        onClick={(e) => {
                            e.stopPropagation()
                            onUpdateQuantity(
                                item?.id,
                                item?.item?.id,
                                item?.quantity - 1,
                            )
                        }}
                    />
                    <span
                        className="text-base font-medium w-8 text-center"
                        onClick={() => setIsOpenSheet(true)}
                    >
                        {item?.quantity}
                    </span>
                    <Button
                        variant="plain"
                        className="w-12 h-full flex items-center justify-center border-none outline-none"
                        icon={<Plus size={16} className="text-gray-700" />}
                        onClick={(e) => {
                            e.stopPropagation()
                            onUpdateQuantity(
                                item?.id,
                                item?.item?.id,
                                item?.quantity + 1,
                            )
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(BasketItem, (prev, next) => {
    // faqat quantity yoki narx o'zgarsa render qilamiz
    return (
        prev?.item?.quantity === next?.item?.quantity &&
        prev?.item?.net_price?.amount === next?.item?.net_price?.amount &&
        prev?.updating === next?.updating &&
        prev?.deleting === next?.deleting
    )
})
