// src/shared/lib/maps/YandexMapWrapper.tsx
import React, { useEffect, useRef, useState, ReactNode } from 'react'

declare global {
    interface Window {
        ymaps: any
    }
}

interface YandexMapWrapperProps {
    apiKey: string
    center?: [number, number]
    zoom?: number
    width?: string | number
    height?: string | number
    onClick?: (coords: [number, number], address: string) => void
    children?: ReactNode
}

const YandexMapWrapper: React.FC<YandexMapWrapperProps> = ({
    apiKey,
    center = [41.311081, 69.240562],
    zoom = 12,
    width = '100%',
    height = '400px',
    onClick,
    children,
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<any>(null)

    // Yandex Maps API script yuklash
    useEffect(() => {
        if (window.ymaps) {
            initMap()
        } else {
            const script = document.createElement('script')
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
            script.async = true
            script.onload = () => {
                window.ymaps.ready(initMap)
            }
            document.head.appendChild(script)
        }

        function initMap() {
            if (!mapContainerRef.current) return
            const ymaps = window.ymaps
            const myMap = new ymaps.Map(mapContainerRef.current, {
                center: center,
                zoom: zoom,
                controls: ['zoomControl', 'searchControl'],
            })
            setMap(myMap)

            // klik event
            myMap.events.add('click', (e: any) => {
                const coords: [number, number] = e.get('coords')
                if (onClick) {
                    ymaps.geocode(coords).then((res: any) => {
                        const firstGeoObject = res.geoObjects.get(0)
                        const address = firstGeoObject?.getAddressLine?.() ?? ''
                        onClick(coords, address)
                    })
                }
            })
        }

        // clean-up
        return () => {
            if (map) {
                map.destroy()
            }
        }
    }, [apiKey])

    return (
        <div style={{ width: width, height: height }} ref={mapContainerRef}>
            {children}
        </div>
    )
}

export default YandexMapWrapper
