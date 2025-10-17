export default function capitalize(value: string) {
    return typeof value !== 'string'
        ? ''
        : value.charAt(0).toUpperCase() + value.slice(1)
}

export function capitalizeFirstLetter(value: string) {
    if (!value) return ''
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}
