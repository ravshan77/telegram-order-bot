import AppRoute from './AppRoute'
// import PublicRoute from './PublicRoute'
// import ProtectedRoute from './ProtectedRoute'
// import appConfig from '@/app/config/app.config'
import type { LayoutType } from '@/@types/theme'
import { Routes, Route, Navigate } from 'react-router-dom'
import PageContainer from '@/shared/ui/template/PageContainer'
import { protectedRoutes } from '@/app/config/routes.config'
import { checkRoutesByAuthority } from '@/shared/lib/checkRoutesByAuthority'
import useBotConfigStore from '@/shared/store/useBotConfigStore'
import navigationConfig from '@/app/config/navigation.config'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const AllRoutes = (props: AllRoutesProps) => {
    const { botConfigs } = useBotConfigStore()
    if (!botConfigs) return null

    const nr = checkRoutesByAuthority(navigationConfig, botConfigs)

    const defaultPath = nr?.[0]?.path || '/not-found'

    return (
        <Routes>
            <Route path="/" element={<Navigate replace to={defaultPath} />} />
            {protectedRoutes.map((route, index) => (
                <Route
                    key={route.key + index}
                    path={route.path}
                    element={
                        <PageContainer {...props} {...route.meta}>
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        </PageContainer>
                    }
                />
            ))}
            <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
    )
}

export default AllRoutes
