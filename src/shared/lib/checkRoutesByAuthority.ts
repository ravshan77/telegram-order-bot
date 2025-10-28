import { NavigationTree } from '@/@types/navigation'
import { BotConfigurations } from '@/entities/botConfiguration'

export function checkRoutesByAuthority(
    routes: NavigationTree[],
    config: BotConfigurations,
): NavigationTree[] {
    return routes.filter((route) => {
        // Agar authority bo‘sh bo‘lsa, uni o‘tkazamiz (hamma uchun ruxsat)
        if (!route.authority || route.authority.length === 0) return true

        // authority ichidagi kamida bitta key config ichida true bo‘lsa, route’ni saqlaymiz
        return route.authority.every(
            (key) => config[key as keyof BotConfigurations] == true,
        )
    })
}
