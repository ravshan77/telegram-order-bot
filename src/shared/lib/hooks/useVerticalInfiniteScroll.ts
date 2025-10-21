import { useRef, useEffect, useState } from 'react'

interface UseVerticalInfiniteScrollProps {
    onLoadMore: () => Promise<void> | void
    isLoading?: boolean
    threshold?: number
}

export const useVerticalInfiniteScroll = ({
    onLoadMore,
    isLoading = false,
    // threshold = 300,
}: UseVerticalInfiniteScrollProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const isLoadingRef = useRef(false)

    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobile =
            /iphone|ipad|android|mobile|ipod/.test(userAgent) ||
            window.innerWidth < 768

        setIsDesktop(!isMobile)
    }, [])

    useEffect(() => {
        isLoadingRef.current = isLoading
    }, [isLoading])

    useEffect(() => {
        if (!sentinelRef.current || !scrollContainerRef.current) return

        const handler = async (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries

            if (entry.isIntersecting && !isLoadingRef.current) {
                isLoadingRef.current = true
                try {
                    await onLoadMore()
                } finally {
                    setTimeout(() => {
                        isLoadingRef.current = false
                    }, 100)
                }
            }
        }

        observerRef.current = new IntersectionObserver(handler, {
            root: scrollContainerRef.current,
            threshold: 0.1,
        })

        observerRef.current.observe(sentinelRef.current)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [onLoadMore])

    return {
        scrollContainerRef,
        sentinelRef,
        isDesktop,
    }
}
