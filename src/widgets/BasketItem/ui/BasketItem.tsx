import { memo } from 'react'
import { APP_CDN } from '@/shared/api'
import { Button } from '@/shared/ui/kit'
import { OrderItem } from '@/entities/order'
import { useItemMap } from '@/shared/lib/hooks'
import { Minus, Plus, Trash2, Image, ArrowRight } from 'lucide-react'
import { numericFormat } from '@/shared/lib/numericFormat'

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

    const found_item = getItemById(item?.item?.id)

    const images = found_item?.item?.images?.map(
        (img) => `${APP_CDN}${img?.path}`,
    )

    return (
        <div className="bg-white rounded-2xl p-2 border cursor-pointer">
            <div className="flex gap-3">
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
                    <span className="border bg-gray-50 p-1 px-2 rounded-md inline-flex items-center">
                        {item?.quantity}(шт)
                        {found_item?.item.package_measurements[0]?.quantity ? (
                            <>
                                &ensp; <ArrowRight size={'14'} className="" />{' '}
                                &ensp;
                                {
                                    found_item?.item.package_measurements[0]
                                        ?.quantity
                                }
                                (
                                {found_item?.item.package_measurements[0]?.name}
                                )
                            </>
                        ) : null}
                    </span>
                    <span> x </span>
                    <span className="border bg-gray-50 p-1 px-2 rounded-md">
                        {numericFormat(item?.price?.amount)}{' '}
                        {item?.net_price?.currency?.name}
                    </span>
                    <p className="text-base font-bold mt-1">
                        = {numericFormat(item?.net_price.amount)}{' '}
                        {item?.net_price?.currency?.name}
                    </p>
                </div>
            </div>

            <div className="flex justify-between h-10">
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
                    <span className="text-base font-medium w-8 text-center">
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
