import type { NavigationTree } from '@/@types/navigation'
// import documentNavigationConfig from './document.navigation.config'
// import managementNavigationConfig from './management.navigation.config'
import mainNavigationConfig from './main.navigation.config'

const navigationConfig: NavigationTree[] = [
    ...mainNavigationConfig,
    // ...documentNavigationConfig,
    // ...managementNavigationConfig
]

export default navigationConfig
