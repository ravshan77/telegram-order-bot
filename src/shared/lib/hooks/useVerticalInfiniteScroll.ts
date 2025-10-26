import { useRef, useEffect, useState } from 'react'

interface UseVerticalInfiniteScrollProps {
    onLoadMore: () => Promise<void> | void
    isLoading?: boolean
    threshold?: number // 0 dan 1 gacha (masalan 0.1)
}

export const useVerticalInfiniteScroll = ({
    onLoadMore,
    isLoading = false,
    threshold = 0.1,
}: UseVerticalInfiniteScrollProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const isLoadingRef = useRef(isLoading)
    const [isDesktop, setIsDesktop] = useState(false)

    // Qurilma turini aniqlaymiz
    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobile =
            /iphone|ipad|android|mobile|ipod/.test(userAgent) ||
            window.innerWidth < 768
        setIsDesktop(!isMobile)
    }, [])

    // Loading holatini ref orqali kuzatamiz
    useEffect(() => {
        isLoadingRef.current = isLoading
    }, [isLoading])

    // Asosiy intersection kuzatuvchi
    useEffect(() => {
        const container = scrollContainerRef.current
        const sentinel = sentinelRef.current

        // DOM hali tayyor bo‘lmasa — qaytib chiqamiz
        if (!container || !sentinel) return

        // Eski observerni tozalaymiz
        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        // Agar threshold yaroqsiz bo‘lsa — default 0.1 qo‘llaymiz
        const validThreshold =
            typeof threshold === 'number' && threshold >= 0 && threshold <= 1
                ? threshold
                : 0.1

        const observer = new IntersectionObserver(
            async (entries) => {
                const [entry] = entries
                if (entry.isIntersecting && !isLoadingRef.current) {
                    isLoadingRef.current = true
                    try {
                        await onLoadMore()
                    } finally {
                        // 100ms kechiktirish bilan qayta chaqiruvga ruxsat beramiz
                        setTimeout(() => {
                            isLoadingRef.current = false
                        }, 100)
                    }
                }
            },
            {
                root: container,
                rootMargin: '0px',
                threshold: validThreshold,
            },
        )

        observer.observe(sentinel)
        observerRef.current = observer

        return () => {
            observer.disconnect()
        }
    }, [onLoadMore, threshold])

    // DOM to‘liq render bo‘lgach yana bir marta observerni refresh qilamiz
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                scrollContainerRef.current &&
                sentinelRef.current &&
                !observerRef.current
            ) {
                const validThreshold =
                    typeof threshold === 'number' &&
                    threshold >= 0 &&
                    threshold <= 1
                        ? threshold
                        : 0.1

                const observer = new IntersectionObserver(
                    async (entries) => {
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
                    },
                    {
                        root: scrollContainerRef.current,
                        rootMargin: '0px',
                        threshold: validThreshold,
                    },
                )
                observer.observe(sentinelRef.current)
                observerRef.current = observer
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    return {
        scrollContainerRef,
        sentinelRef,
        isDesktop,
    }
}

// import { useRef, useEffect, useState } from 'react'

// interface UseVerticalInfiniteScrollProps {
//     onLoadMore: () => Promise<void> | void
//     isLoading?: boolean
//     threshold?: number
// }

// export const useVerticalInfiniteScroll = ({
//     onLoadMore,
//     isLoading = false,
//     // threshold = 0.2,
// }: UseVerticalInfiniteScrollProps) => {
//     const scrollContainerRef = useRef<HTMLDivElement>(null)
//     const observerRef = useRef<IntersectionObserver | null>(null)
//     const sentinelRef = useRef<HTMLDivElement>(null)
//     const isLoadingRef = useRef(false)

//     const [isDesktop, setIsDesktop] = useState(false)

//     useEffect(() => {
//         const userAgent = navigator.userAgent.toLowerCase()
//         const isMobile =
//             /iphone|ipad|android|mobile|ipod/.test(userAgent) ||
//             window.innerWidth < 768

//         setIsDesktop(!isMobile)
//     }, [])

//     useEffect(() => {
//         isLoadingRef.current = isLoading
//     }, [isLoading])

//     useEffect(() => {
//         if (!sentinelRef.current || !scrollContainerRef.current) return

//         const handler = async (entries: IntersectionObserverEntry[]) => {
//             const [entry] = entries

//             if (entry.isIntersecting && !isLoadingRef.current) {
//                 isLoadingRef.current = true
//                 try {
//                     await onLoadMore()
//                 } finally {
//                     setTimeout(() => {
//                         isLoadingRef.current = false
//                     }, 100)
//                 }
//             }
//         }

//         observerRef.current = new IntersectionObserver(handler, {
//             root: scrollContainerRef?.current || null,
//             threshold: 0.1,
//         })

//         observerRef.current.observe(sentinelRef.current)

//         return () => {
//             if (observerRef.current) {
//                 observerRef.current.disconnect()
//             }
//         }
//     }, [onLoadMore])

//     return {
//         scrollContainerRef,
//         sentinelRef,
//         isDesktop,
//     }
// }
