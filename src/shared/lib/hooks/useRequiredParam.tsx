import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

/**
 * Majburiy URL parametrlari uchun hook
 * Param topilmasa avtomatik `/404` sahifasiga yo‘naltiradi.
 */
export function useRequiredParam(paramKey: string): string {
    const params = useParams<Record<string, string | undefined>>()
    const navigate = useNavigate()
    const value = params[paramKey]

    useEffect(() => {
        if (!value) {
            navigate('/404', { replace: true })
        }
    }, [value, navigate])

    return value ?? ''
}
