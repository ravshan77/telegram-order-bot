import appConfig from '@/app/config/app.config'
import { REDIRECT_URL_KEY } from '@/shared/config/constants/app.constant'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
// import { UserLoadState, useUserStore } from '@/entities/User'
import { useEffect } from 'react'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
    // const { authenticated, getMe, loadState } = useUserStore()

    const { pathname } = useLocation()

    const getPathName =
        pathname === '/' ? '' : `?${REDIRECT_URL_KEY}=${location.pathname}`

    useEffect(() => {
        // getMe().then()
    }, [])

    // if (loadState !== UserLoadState.LOADED) {
    //     return <>Loading...</>
    // }

    const authenticated = true

    if (!authenticated) {
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}${getPathName}`}
            />
        )
    }

    return <Outlet />
}

export default ProtectedRoute
