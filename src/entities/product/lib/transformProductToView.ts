import useBotConfigStore from '@/shared/store/useBotConfigStore'
import { Items, ProductView } from '../model/types'

// Product ni ProductView ga o'zgartirish helper function
export const transformProductToView = (product: Items): ProductView => {
    const { botConfigs } = useBotConfigStore.getState()

    const totalStock = product?.warehouse_states?.warehouse_items.reduce(
        (itemSum, item) => {
            if (item.state <= 0) {
                return itemSum
            }
            return itemSum + item?.state
        },
        0,
    )

    return {
        ...product.item,
        price: botConfigs?.order_use_bulk_price
            ? product?.price?.bulk_price.amount
            : product?.price?.common_price?.amount,
        currency: botConfigs?.order_use_bulk_price
            ? product?.price?.bulk_price.currency
            : product?.price?.common_price?.currency,
        stock: totalStock,
    }
}
