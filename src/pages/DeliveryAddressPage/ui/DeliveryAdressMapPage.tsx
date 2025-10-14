import { Check } from 'lucide-react'
import { Button } from '@/shared/ui/kit'
import { GoBack } from '@/shared/ui/kit-pro'
import React, { useEffect, useRef, useState } from 'react'

// TypeScript interfaces
interface LocationData {
    lat: number
    lng: number
    address: string
}

declare global {
    interface Window {
        ymaps: any
    }
}

export const DeliveryAddressMapPage: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const placemarkRef = useRef<any>(null)

    const [selectedLocation, setSelectedLocation] = useState<LocationData>({
        lat: 41.311151,
        lng: 69.279737,
        address: 'Выберите адрес на карте',
    })

    const [loading, setLoading] = useState(false)
    const [isMapReady, setIsMapReady] = useState(false)

    const API_KEY = '76b31853-7efc-4276-8ade-b32eadec4571' //!

    // Initialize Yandex Maps
    useEffect(() => {
        const loadYandexMaps = () => {
            if (window.ymaps) {
                initializeMap()
                return
            }

            const script = document.createElement('script')
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`
            script.async = true
            script.onload = () => {
                window.ymaps.ready(() => {
                    initializeMap()
                })
            }
            document.head.appendChild(script)
        }

        const initializeMap = () => {
            if (!mapContainerRef.current || mapInstanceRef.current) return

            const ymaps = window.ymaps

            // Create map
            const map = new ymaps.Map(
                mapContainerRef.current,
                {
                    center: [selectedLocation.lat, selectedLocation.lng],
                    zoom: 15,
                    controls: [],
                },
                {
                    // Bu sozlamalar POI tooltiplarini o'chiradi
                    suppressMapOpenBlock: true,
                    yandexMapDisablePoiInteractivity: true,
                    suppressObsoleteBrowserNotifier: true,
                },
            )

            mapInstanceRef.current = map

            // Create placemark (marker)
            const placemark = new ymaps.Placemark(
                [selectedLocation.lat, selectedLocation.lng],
                {
                    hintContent: '', // Hint'ni o'chirish
                    balloonContent: '', // Balloon'ni o'chirish
                },
                {
                    preset: 'islands#blueCircleDotIcon',
                    draggable: true,
                    hideIconOnBalloonOpen: false,
                    openEmptyBalloon: false,
                },
            )

            map.geoObjects.add(placemark)
            placemarkRef.current = placemark

            // Handle map click
            map.events.add('click', async (e: any) => {
                const coords = e.get('coords')
                await updateLocation(coords)
            })

            // Handle marker drag
            placemark.events.add('dragend', async () => {
                const coords = placemark.geometry.getCoordinates()
                await updateLocation(coords)
            })

            setIsMapReady(true)
        }

        const updateLocation = async (coords: number[]) => {
            setLoading(true)

            // Move placemark
            if (placemarkRef.current) {
                placemarkRef.current.geometry.setCoordinates(coords)
            }

            try {
                const ymaps = window.ymaps
                const result = await ymaps.geocode(coords)
                const firstGeoObject = result.geoObjects.get(0)

                const address = firstGeoObject
                    ? firstGeoObject.getAddressLine()
                    : `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`

                setSelectedLocation({
                    lat: coords[0],
                    lng: coords[1],
                    address: address,
                })
            } catch (error) {
                console.error('Geocoding error:', error)
                setSelectedLocation({
                    lat: coords[0],
                    lng: coords[1],
                    address: `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
                })
            } finally {
                setLoading(false)
            }
        }

        loadYandexMaps()

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy()
                mapInstanceRef.current = null
            }
        }
    }, [])

    // Get current location
    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation не поддерживается вашим браузером')
            return
        }

        setLoading(true)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = [
                    position.coords.latitude,
                    position.coords.longitude,
                ]

                // Center map
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter(coords, 16)
                }

                // Move marker
                if (placemarkRef.current) {
                    placemarkRef.current.geometry.setCoordinates(coords)
                }

                // Update address
                try {
                    const ymaps = window.ymaps
                    const result = await ymaps.geocode(coords)
                    const firstGeoObject = result.geoObjects.get(0)

                    const address = firstGeoObject
                        ? firstGeoObject.getAddressLine()
                        : `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`

                    setSelectedLocation({
                        lat: coords[0],
                        lng: coords[1],
                        address: address,
                    })
                } catch (error) {
                    console.error('Geocoding error:', error)
                } finally {
                    setLoading(false)
                }
            },
            (error) => {
                console.error('Geolocation error:', error)
                alert('Не удалось получить текущее местоположение')
                setLoading(false)
            },
        )
    }

    // Confirm and save
    const handleConfirm = () => {
        const savedData = {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            address: selectedLocation.address,
            timestamp: new Date().toISOString(),
        }

        console.log('Сохраненные данные:', savedData)

        // Save to localStorage
        try {
            const savedAddresses = JSON.parse(
                localStorage.getItem('deliveryAddresses') || '[]',
            )
            savedAddresses.push(savedData)
            localStorage.setItem(
                'deliveryAddresses',
                JSON.stringify(savedAddresses),
            )

            alert(
                `✅ Адрес успешно сохранен!\n\n${selectedLocation.address}\n\nLat: ${selectedLocation.lat.toFixed(6)}\nLng: ${selectedLocation.lng.toFixed(6)}`,
            )
        } catch (error) {
            console.error('LocalStorage error:', error)
        }
    }

    return (
        <div className="">
            <div className="">
                <div className="">
                    <GoBack text="Выберите адрес доставки" />
                </div>

                {/* Map Container */}
                <div className="relative flex-1 mt-3">
                    <div
                        ref={mapContainerRef}
                        // className="h-[calc(100vh-250px)]"
                        style={{ height: 'calc(100vh - 300px)' }}
                    />

                    {/* Loading indicator */}
                    {loading && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-gray-600">
                                    Загрузка...
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Current location button */}
                    <Button
                        disabled={loading || !isMapReady}
                        className="absolute bottom-12 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                        title="Моё местоположение"
                        onClick={handleCurrentLocation}
                    >
                        <div className="w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                    </Button>
                </div>

                {/* Confirm Button */}
                <div className="py-2 px-4 bg-white fixed bottom-0 left-0 right-0 w-full border-t h-[160px]">
                    <div className="flex-1 min-w-0 mb-2">
                        <p className="text-sm text-gray-500 mb-1">
                            Адрес доставки
                        </p>
                        <p className="text-base font-medium text-gray-900 break-words line-clamp-2">
                            {selectedLocation.address}
                        </p>
                    </div>
                    <Button
                        variant="solid"
                        shape="round"
                        className="w-full font-medium py-4 flex items-center justify-center gap-2"
                        disabled={loading || !isMapReady}
                        onClick={handleConfirm}
                    >
                        <Check size={20} />
                        Добавить адрес
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DeliveryAddressMapPage
