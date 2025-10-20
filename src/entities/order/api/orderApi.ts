import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import type {
    RegisterOrderRequest,
    Order,
    AddOrderItemRequest,
    UpdateOrderItemRequest,
    DeleteOrderItemRequest,
    ApproveOrderRequest,
    DeleteOrderRequest,
    OrderErrorResponse,
    OrderFilters,
} from '../model/types'

class OrderApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    // Get all orders with optional count
    async getOrders(filters?: OrderFilters): Promise<Order[]> {
        return this.get<Order[]>(API_ENDPOINTS.orders.getAll, {
            params: filters,
        })
    }

    // Get orders count
    async getOrdersCount(): Promise<number> {
        return this.get<number>(API_ENDPOINTS.orders.getCount)
    }

    // Get not approved order (active cart/draft order)
    async getNotApprovedOrder(): Promise<Order | null> {
        try {
            return await this.get<Order>(API_ENDPOINTS.orders.getNotApproved)
        } catch (error: any) {
            // Agar order topilmasa, null qaytarish
            // if (error?.response?.status === 404) {
            //     return null
            // }
            console.log(error)

            this.handleOrderError(error)
            throw new Error(error)
        }
    }

    // Get order by ID
    async getOrderById(id: string): Promise<Order> {
        return this.get<Order>(API_ENDPOINTS.orders.getById(id))
    }

    // Register new order (create cart)
    async registerOrder(data: RegisterOrderRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.register, data)
        } catch (error: any) {
            this.handleOrderError(error)
            throw error
        }
    }

    // Add item to order
    async addOrderItem(data: AddOrderItemRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.addItem, data)
        } catch (error: any) {
            this.handleOrderError(error)
            throw error
        }
    }

    // Update order item
    async updateOrderItem(data: UpdateOrderItemRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.updateItem, data)
        } catch (error: any) {
            this.handleOrderError(error)
            throw error
        }
    }

    // Delete order item
    async deleteOrderItem(data: DeleteOrderItemRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.deleteItem, data)
        } catch (error: any) {
            this.handleOrderError(error)
            throw error
        }
    }

    // Approve order (checkout)
    async approveOrder(data: ApproveOrderRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.approve, data)
        } catch (error: any) {
            this.handleOrderError(error)
            throw error
        }
    }

    // Delete order (cancel)
    async deleteOrder(data: DeleteOrderRequest): Promise<void> {
        try {
            await this.post<void>(API_ENDPOINTS.orders.delete, data)
        } catch (error: any) {
            this.handleOrderError(error)
            throw error
        }
    }

    /**
     * Handle order-specific errors
     */
    private handleOrderError(error: any): never {
        const response = (error?.response?.data as OrderErrorResponse) || error

        if (response) {
            // Check each error type and throw appropriate message
            if (response.order_not_found) {
                throw new Error('Заказ не найден')
            }
            if (response.bot_user_not_found) {
                throw new Error('Пользователь бота не найден')
            }
            if (response.bot_configuration_not_found) {
                throw new Error('Конфигурация бота не найдена')
            }
            if (response.script_not_found) {
                throw new Error('Скрипт не найден')
            }
            if (response.register_order_not_allowed) {
                throw new Error('Регистрация заказа не разрешена')
            }
            if (response.allowed_contractors_only) {
                throw new Error('Только для разрешенных контрагентов')
            }
            if (response.has_order_acceptance_time) {
                throw new Error(
                    'Время приема заказов истекло. Попробуйте позже',
                )
            }
            if (response.not_approved_order_exist) {
                throw new Error(
                    'У вас уже есть неподтвержденный заказ. Дождитесь его подтверждения',
                )
            }
            if (response.enable_order_with_available_items) {
                throw new Error('Заказ возможен только с доступными товарами')
            }
        }

        // Generic error
        throw new Error(
            error?.response?.data?.message ||
                error?.message ||
                'Ошибка при создании заказа',
        )
    }
}

export const orderApi = new OrderApi()
