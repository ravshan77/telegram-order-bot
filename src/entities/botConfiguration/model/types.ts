export interface BotConfigurations {
    id: string
    bot_id: number
    allow_send_daily_report: boolean
    daily_report_hour: number
    allow_orders: boolean
    enable_order_with_available_items: boolean
    has_order_acceptance_time: boolean
    order_acceptance_time_hour_start: number
    order_acceptance_time_hour_end: number
    display_item_warehouse_states: boolean
    display_item_prices: boolean
    allow_orders_contractors_only: boolean
    order_min_before_days: number
    order_allowed_payment_types: any[]
    order_use_bulk_price: boolean
    notify_sale_events: boolean
    notify_payment_events: boolean
    notify_payout_events: boolean
    notify_cash_in_events: boolean
    notify_cash_out_events: boolean
    notify_expense_events: boolean
    notify_cash_transfer_events: boolean
    notify_contractor_state_events: boolean
    notify_telegram_order_bot_order_events: boolean
    contacts: string[]
}
