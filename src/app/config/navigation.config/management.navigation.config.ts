import { NavigationTree } from "@/@types/navigation"
import { getContractorPath, getDocumentGroupListPath, getOrganizationUnitPath, getOrganizationUserPath } from "@/shared/config"
import { NAV_ITEM_TYPE_ITEM, NAV_ITEM_TYPE_TITLE } from "@/shared/config/constants/navigation.constant"

const managementNavigationConfig: NavigationTree[] = [
    {
        key: 'managements',
        path: 'managements',
        title: 'Управление',
        translateKey: 'nav.managements.management',
        icon: 'management',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'managements/document-group',
                path: getDocumentGroupListPath(),
                title: 'Папки',
                translateKey: 'nav.managements',
                icon: 'managementsFolders',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'managements/contractors',
                path: getContractorPath(),
                title: 'Контрагенты',
                translateKey: 'nav.managements.contractors',
                icon: 'managementsContractors',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'managements/organization-unit',
                path: getOrganizationUnitPath(),
                title: 'Филиалы',
                translateKey: 'nav.managements.organization-unit',
                icon: 'managementsBranches',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'managements/organization-user',
                path: getOrganizationUserPath(),
                title: 'Сотрудники',
                translateKey: 'nav.managements.organization-user',
                icon: 'managementsUsers',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default managementNavigationConfig