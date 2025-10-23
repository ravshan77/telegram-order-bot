import type {
    Order,
    OrderFilters,
    DeleteOrderRequest,
    OrderErrorResponse,
    AddOrderItemRequest,
    ApproveOrderRequest,
    RegisterOrderRequest,
    DeleteOrderItemRequest,
    UpdateOrderItemRequest,
} from '../model/types'
import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'

class OrderApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getOrders(filters?: OrderFilters): Promise<Order[]> {
        return this.get<Order[]>(API_ENDPOINTS.orders.getAll, {
            params: filters,
        })
    }

    async getOrdersCount(): Promise<number> {
        return this.get<number>(API_ENDPOINTS.orders.getCount)
    }

    async getNotApprovedOrder(): Promise<Order | null> {
        try {
            return await this.get<Order>(API_ENDPOINTS.orders.getNotApproved)
        } catch (error: any) {
            this.handleOrderError(error)
            // throw new Error(error)
        }
    }

    async getOrderById(id: string): Promise<Order> {
        return this.get<Order>(API_ENDPOINTS.orders.getById(id))
    }

    async registerOrder(data: RegisterOrderRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.register, data)
        } catch (error: any) {
            this.handleOrderError(error)
            // throw error
        }
    }

    async addOrderItem(data: AddOrderItemRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.addItem, data)
        } catch (error: any) {
            this.handleOrderError(error)
            // throw error
        }
    }

    async updateOrderItem(data: UpdateOrderItemRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.updateItem, data)
        } catch (error: any) {
            this.handleOrderError(error)
            // throw error
        }
    }

    async deleteOrderItem(data: DeleteOrderItemRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.deleteItem, data)
        } catch (error: any) {
            this.handleOrderError(error)
            // throw error
        }
    }

    async approveOrder(data: ApproveOrderRequest): Promise<Order> {
        try {
            return await this.post<Order>(API_ENDPOINTS.orders.approve, data)
        } catch (error: any) {
            this.handleOrderError(error)
            // throw error
        }
    }

    async deleteOrder(data: DeleteOrderRequest): Promise<void> {
        try {
            await this.post<void>(API_ENDPOINTS.orders.delete, data)
        } catch (error: any) {
            this.handleOrderError(error)
            // throw error
        }
    }

    /**
     * Handle order errors
     */
    private handleOrderError(error: any): never {
        const response = (error?.response?.data as OrderErrorResponse) || error

        if (response) {
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

        // other errors
        throw new Error(
            error?.response?.data?.message ||
                error?.message ||
                'Ошибка при создании заказа',
        )
    }
}

export const orderApi = new OrderApi()
