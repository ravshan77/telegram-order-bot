import { FC, ReactNode, useState } from 'react'
import Loading from '@/shared/ui/kit-pro/Loading'
// import { useRoamingDistrictStore } from '@/entities/RoamingDistrict'
// import { useOrganizationUnitStore } from '@/entities/OrganizationUnit'
// import { useOrganizationUserStore } from '@/entities/OrganizationUser'
// import { useRoamingMeasurementStore } from '@/entities/RoamingMeasurement'
// import { useRoamingRegionStore } from '@/entities/RoamingRegion'
// import { useRoamingWaybillRegionStore } from '@/entities/RoamingWaybillRegion'
// import { useEImzoStore } from '@/entities/EImzo'
// import { useRoamingCompanyCatalogStore } from '@/entities/RoamingCompanyCatalog'

interface AppInitializerProps {
    children?: ReactNode;
}

export const AppInitializer: FC<AppInitializerProps> = ({ children }) => {
    const [ isLoading ] = useState<boolean>(false)
    // const { eImzoInitialize } = useEImzoStore();
    // const { loadRoamingWaybillRegions } = useRoamingWaybillRegionStore();
    // const { loadRoamingRegions } = useRoamingRegionStore();
    // const { loadRoamingDistricts } = useRoamingDistrictStore();
    // const { loadOrganizationUnitTree } = useOrganizationUnitStore();
    // const { loadOrganizationUnitUsers } = useOrganizationUserStore();
    // const { loadAllRoamingMeasurements } = useRoamingMeasurementStore();
    // const { loadAllProductCatalogCompany } = useRoamingCompanyCatalogStore()

    // const loadingAllData = async () => {
    //     setIsLoading(true)
    //     await Promise.allSettled([
    //         eImzoInitialize(),
    //         loadRoamingWaybillRegions(),
    //         loadRoamingRegions(),
    //         loadRoamingDistricts(),
    //         loadOrganizationUnitTree(),
    //         loadOrganizationUnitUsers(),
    //         loadAllRoamingMeasurements(),
    //         loadAllProductCatalogCompany(),
    //     ])
    //     setIsLoading(false)
    // }

    // useLayoutEffect(() => {
    //     loadingAllData().then()
    // }, [])

    return (
        <Loading loading={isLoading} className={"w-full min-h-screen h-full"}>
            {children}
        </Loading>
    )
}
