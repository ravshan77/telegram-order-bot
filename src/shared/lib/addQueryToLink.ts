export function addQueriesToURL(url: string, queries: object): string {
    let urlObj: URL;
    let isRelative = false;

    try {
        // Пробуем создать URL напрямую
        urlObj = new URL(url);
    } catch (_: unknown) {
        // Если URL относительный, добавляем временный базовый хост
        isRelative = true;
        urlObj = new URL('http://localhost' + (url.startsWith('/') ? url : '/' + url));
    }

    const queryObj = queries as Record<string, any>;

    // Добавляем параметры запроса
    for (const [key, value] of Object.entries(queryObj)) {
        const values = Array.isArray(value) ? value : [value];
        for (const val of values) {
            if (val != null) {
                urlObj.searchParams.append(key, String(val));
            }
        }
    }

    // Возвращаем результат в зависимости от типа URL
    if (isRelative) {
        return urlObj.pathname + urlObj.search;
    } else {
        return urlObj.toString();
    }
}