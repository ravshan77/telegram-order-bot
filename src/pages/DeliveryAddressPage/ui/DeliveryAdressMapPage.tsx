import { useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import { YMaps, Map } from '@pbe/react-yandex-maps'

export const DeliveryAdressMapPage = () => {
    const [coords, setCoords] = useState<[number, number] | null>(null)
    const [address, setAddress] = useState<string>('')

    const handleMapClick = async (e: any) => {
        const clickedCoords = e.get('coords')
        setCoords(clickedCoords)

        // GeoCoder orqali manzilni olish
        // const geocoder = await window.ymaps.geocode(clickedCoords);
        // const firstGeoObject = geocoder.geoObjects.get(0);
        // const fullAddress = firstGeoObject?.getAddressLine();
        if (coords) {
            window.ymaps.geocode(coords).then((res: any) => {
                const firstGeoObject = res.geoObjects.get(0)
                const address = firstGeoObject?.getAddressLine()
                console.log('Manzil:', address)
                setAddress(address)
            })
        }
    }

    return (
        <YMaps query={{ apikey: '76b31853-7efc-4276-8ade-b32eadec4571' }}>
            <div>
                <Map
                    defaultState={{
                        center: [41.311158, 69.279737], // Toshkent markazi
                        zoom: 12,
                    }}
                    width="100%"
                    height="400px"
                    onClick={handleMapClick}
                />

                {coords && (
                    <div style={{ marginTop: '15px' }}>
                        <strong>Koordinatalar:</strong> {coords[0]}, {coords[1]}{' '}
                        <br />
                        <strong>Manzil:</strong> {address}
                    </div>
                )}
            </div>
        </YMaps>
    )
}

export default DeliveryAdressMapPage
