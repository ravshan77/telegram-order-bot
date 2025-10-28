import { BotConfigurations } from '@/entities/botConfiguration'
import { getOrdersPath } from '@/shared/config'

export const ROUTE_PERMISSIONS = {
    [getOrdersPath()]: 'allow_orders',
    // '/products': 'allow_products',
    // '/statistics': 'allow_statistics',
    // '/settings': 'allow_settings',
} as const

export const isRouteAllowed = (
    path: string,
    config: BotConfigurations | null,
): boolean => {
    if (!config) return false

    const permission = ROUTE_PERMISSIONS[path as keyof typeof ROUTE_PERMISSIONS]
    if (!permission) return true

    return config[permission as keyof BotConfigurations] === true
}
