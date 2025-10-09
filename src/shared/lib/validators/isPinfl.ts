export const isPINFL = (identifier : string | null) => {
    if (!identifier || !identifier.length) return false;

    const PINFLFormatRegEx = /^\d{14}$/
    return PINFLFormatRegEx.test(identifier);
};
