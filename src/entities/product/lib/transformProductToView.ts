import { Items, ProductView } from '../model/types'

// Product ni ProductView ga o'zgartirish helper function
export const transformProductToView = (product: Items): ProductView => {
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
        price: product?.price?.common_price?.amount,
        currency: product?.price?.common_price?.currency,
        stock: totalStock,
    }
}
