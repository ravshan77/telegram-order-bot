import { Suspense } from 'react'
import AllRoutes from './AllRoutes'
import type { LayoutType } from '@/@types/theme'
import Loading from '@/shared/ui/kit-pro/Loading'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

export const Routes = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} className="w-full" />}>
            <AllRoutes {...props} />
        </Suspense>
    )
}
