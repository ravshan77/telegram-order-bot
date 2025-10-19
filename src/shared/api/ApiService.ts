import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export type BaseResponse<T> = {
    success: boolean
    data: T
}

export class BaseRestClient {
    private readonly axiosInstance: AxiosInstance

    constructor(baseURL: string, timeout: number = 1000000) {
        this.axiosInstance = axios.create({
            baseURL: baseURL || '/api',
            timeout: timeout,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-WEBAPP-BOT': 45,
                'X-WEBAPP-SESSION': '',
            },
        })
    }

    protected async get<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>('GET', url, undefined, config)
    }

    protected async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>('POST', url, data, config)
    }

    protected async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>('PUT', url, data, config)
    }

    protected async patch<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>('PATCH', url, data, config)
    }

    protected async delete<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>('DELETE', url, undefined, config)
    }

    protected prepareToken(token: string = ''): {
        headers: { Authorization: string }
    } {
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    }

    protected toFormData(data: object): FormData {
        const formData = new FormData()

        const appendFormData = (data: any, parentKey?: string) => {
            if (data instanceof File) {
                formData.append(parentKey!, data)
            } else if (data instanceof Date) {
                formData.append(parentKey!, data.toISOString())
            } else if (data && typeof data === 'object') {
                Object.entries(data).forEach(([key, value]) => {
                    const formKey = parentKey ? `${parentKey}[${key}]` : key
                    appendFormData(value, formKey)
                })
            } else if (data != null) {
                formData.append(parentKey!, String(data))
            }
        }

        appendFormData(data)

        return formData
    }

    protected async download(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<Blob> {
        const response: AxiosResponse<Blob> =
            await this.axiosInstance.request<Blob>({
                url,
                method: 'GET',
                responseType: 'blob',
                ...config,
            })
        return response.data
    }

    private async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.request(
                {
                    url,
                    method,
                    data,
                    ...config,
                },
            )
            return response.data
        } catch (error) {
            this.handleError(error)
        }
    }

    private handleError(error: unknown): never {
        console.log(error)

        if (axios.isAxiosError(error)) {
            // const err = error.response ? error : Error('Network Error')
            throw error
        }
        throw new Error(`Unexpected Error: ${error}`)
    }
}
