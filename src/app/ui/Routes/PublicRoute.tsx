import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '@/app/config/app.config'
// import { useUserStore } from '@/entities/User'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    // const { authenticated } = useUserStore()
    const authenticated = true

    return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
