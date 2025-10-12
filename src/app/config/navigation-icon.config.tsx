import type { JSX } from 'react'
import { PiBookBookmarkDuotone, PiBagSimpleDuotone } from 'react-icons/pi'
import {
    LuFileChartLine,
    LuFileCheck2,
    LuFileDown,
    LuFileUp,
    LuFolders,
    LuListChecks,
    LuListTree,
    LuReceiptText,
    LuSquarePen,
    LuUsers,
} from 'react-icons/lu'
import {
    BookOpenCheck,
    Calculator,
    HandCoins,
    List,
    ShoppingCart,
    Tag,
    Wallet,
} from 'lucide-react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    statistic: <LuFileChartLine />,
    documentsIncoming: <LuFileDown />,
    documentsOutgoing: <LuFileUp />,
    documentsDraft: <LuSquarePen />,
    documentsApproval: <LuFileCheck2 />,
    documentsTasks: <LuListChecks />,
    managementsFolders: <LuFolders />,
    managementsContractors: <LuReceiptText />,
    managementsBranches: <LuListTree />,
    managementsUsers: <LuUsers />,

    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,

    // main icons
    mainProducts: <ShoppingCart />,
    mainOrders: <Tag />,
    mainSales: <List />,
    mainPayments: <Wallet />,
    mainPayouts: <HandCoins />,
    mainDebt: <Calculator />,
    reconciliationAct: <BookOpenCheck />,
}

export default navigationIcon
