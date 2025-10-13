import { GoBack } from '@/shared/ui/kit-pro'

export const OrderDetailsPage = () => {
    const orderInfo = {
        status: 'confirmed',
        createdDate: '16.03.2025',
        orderDate: '07.04.2025',
        confirmDate: '24.06.2025',
        type: 'Не определен',
    }

    const orderDescription = `Легкий вес — не утяжеляет смартфон.Прозрачный чехол для телефона — это не только защита, но и возможность подчеркнуть дизайн вашего смартфона. Силикон TPU приятен в сочетании с гибким силиконом придают чехлу высокую ударопрочность и удобную эластичность. Внутренние покрытие из микрофибры создает приятные ощущения при очистке, которая предотвращает появление царапин на вашем телефоне.`

    const products = [
        {
            id: 1,
            name: 'Блокнот А6 (Office time black)',
            quantity: 2,
            pricePerUnit: '6.0 USD',
            totalPrice: '16 USD',
        },
        {
            id: 2,
            name: 'Блокнот А6 (Art) 32',
            quantity: 2,
            pricePerUnit: '6.0 USD',
            totalPrice: '16 USD',
        },
        {
            id: 3,
            name: 'Блокнот А6 (Pans)',
            quantity: 2,
            pricePerUnit: '6.0 USD',
            totalPrice: '16 USD',
        },
    ]

    return (
        <div className="pb-16">
            <div>
                <div className="bg-white w-full">
                    <GoBack text={'Информация для заказа'} />
                </div>

                <div className="my-4">
                    <div className="mb-4">
                        <span
                            className={`text-xs font-semibold px-3 py-1 rounded ${
                                orderInfo.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {orderInfo.status === 'confirmed'
                                ? 'Подтвержден'
                                : 'Не подтвержден'}
                        </span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Дата создания:
                            </span>
                            <span className="font-medium text-black">
                                {orderInfo.createdDate}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Дата заказы:</span>
                            <span className="font-medium text-black">
                                {orderInfo.orderDate}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Дата подтверждена:
                            </span>
                            <span className="font-medium text-black">
                                {orderInfo.confirmDate}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Тип чехла:</span>
                            <span className="font-medium text-black">
                                {orderInfo.type}
                            </span>
                        </div>
                    </div>
                </div>
                <hr className="mb-4" />
                <div className="mb-4">
                    <h2 className="text-base font-semibold mb-3">
                        Информация о заказе
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {orderDescription}
                    </p>
                </div>
                <hr className="mb-4" />
                <div>
                    <h2 className="text-base font-semibold mb-4">Товары</h2>

                    <div className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border p-3 rounded-2xl"
                            >
                                <h3 className="font-semibold text-sm mb-3">
                                    {product.name}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Количество:
                                        </span>
                                        <span className="font-medium text-black">
                                            {product.quantity} шт
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Цена за единицу:
                                        </span>
                                        <span className="font-medium text-black">
                                            {product.pricePerUnit}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Стоимость:
                                        </span>
                                        <span className="font-semibold text-black">
                                            {product.totalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsPage
