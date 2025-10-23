// import { Sale } from '@/entities/sales'
import { BaseRestClient } from '@/shared/api/ApiService'
import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
import { ActReport, ActReportFilters, DowlandExcelFilter } from '../model/types'

class AskActReportApi extends BaseRestClient {
    constructor() {
        super(API_BASE_URL)
    }

    async getAskActReports(filters?: ActReportFilters): Promise<ActReport> {
        return this.get<ActReport>(API_ENDPOINTS.askActReport.getAll, {
            params: filters,
        })
    }

    async downloadAskActReportExcel(
        filters: DowlandExcelFilter,
    ): Promise<Blob> {
        return this.download(API_ENDPOINTS.askActReport.downloadExcel(filters))
    }
}

export const askActReportApi = new AskActReportApi()

// import { BaseRestClient } from '@/shared/api/ApiService'
// import { API_ENDPOINTS, API_BASE_URL } from '@/shared/api/config'
// import { ActReport, ActReportFilters, DowlandExcelFilter } from '../model/types'

// class AskActReportApi extends BaseRestClient {
//     constructor() {
//         super(API_BASE_URL)
//     }

//     async getAskActReports(filters?: ActReportFilters): Promise<ActReport> {
//         return this.post<ActReport>(API_ENDPOINTS.askActReport.getAll, filters)
//     }

//     async downloadAskActReportExcel(
//         filters: DowlandExcelFilter,
//     ): Promise<Blob> {
//         return this.download(API_ENDPOINTS.askActReport.downloadExcel(filters))
//     }
// }

// export const askActReportApi = new AskActReportApi()
