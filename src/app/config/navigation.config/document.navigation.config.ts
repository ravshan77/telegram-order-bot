import { NavigationTree } from '@/@types/navigation'
import {
    getApprovalDocumentPath,
    getDraftDocumentsPath,
    getIncomingDocumentsPath,
    getOutgoingDocumentsPath,
    getTaskPath,
} from '@/shared/config'
import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_TITLE,
} from '@/shared/config/constants/navigation.constant'

const documentNavigationConfig: NavigationTree[] = [
    {
        key: 'documents',
        path: `documents`,
        title: 'Документы',
        translateKey: 'nav.documents.documents',
        icon: 'documents',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            // {
            //     key: 'home',
            //     path: '/home',
            //     title: 'Статистика',
            //     translateKey: 'nav.home.statistic',
            //     icon: 'statistic',
            //     type: NAV_ITEM_TYPE_ITEM,
            //     authority: [],
            //     subMenu: [],
            // },
            {
                key: 'documents/incoming',
                path: getIncomingDocumentsPath(),
                title: 'Входящие',
                translateKey: 'nav.documents.incoming',
                icon: 'documentsIncoming',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'documents/outgoing',
                path: getOutgoingDocumentsPath(),
                title: 'Исходящие',
                translateKey: 'nav.documents.outgoing',
                icon: 'documentsOutgoing',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'documents/draft',
                path: getDraftDocumentsPath(),
                title: 'Черновик',
                translateKey: 'nav.documents.draft',
                icon: 'documentsDraft',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'documents/approval',
                path: getApprovalDocumentPath(),
                title: 'Cогласований',
                translateKey: 'nav.documents.approval',
                icon: 'documentsApproval',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'documents/task',
                path: getTaskPath(),
                title: 'Задачи',
                translateKey: 'nav.groupMenu.single',
                icon: 'documentsTasks',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default documentNavigationConfig
