import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { askActReportApi } from './askActReportApi'
import { ActReport, ActReportFilters } from '../model/types'

export const ASK_ACT_REPORT_KEYS = {
    all: ['ask_act_reports'] as const,
    lists: () => [...ASK_ACT_REPORT_KEYS.all, 'list'] as const,
    list: (filters?: ActReportFilters) =>
        [...ASK_ACT_REPORT_KEYS.lists(), filters] as const,
}

export const useAskActReports = (
    filters?: ActReportFilters,
    options?: Omit<UseQueryOptions<ActReport, Error>, 'queryKey' | 'queryFn'>,
) => {
    return useQuery<ActReport, Error>({
        queryKey: ASK_ACT_REPORT_KEYS.list(filters),
        queryFn: () => askActReportApi.getAskActReports(filters),
        staleTime: 2 * 60 * 1000,
        ...options,
    })
}

export const useRegisterOrder = () => {
    const queryClient = useQueryClient()

    return useMutation<ActReport, Error, ActReportFilters>({
        mutationFn: (filters) => askActReportApi.getAskActReports(filters),
        onSuccess: (newOrder) => {
            // Update not approved order cache
            queryClient.setQueryData(ASK_ACT_REPORT_KEYS.list(), newOrder)
            queryClient.invalidateQueries({
                queryKey: ASK_ACT_REPORT_KEYS.list(),
            })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Ошибка загрузки отчета')
        },
    })
}
