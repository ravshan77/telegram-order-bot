export function stringToCameCase(str: string): string {
    return str.replace(/\s\w|^\w/g, (c) => c.toUpperCase());
}
