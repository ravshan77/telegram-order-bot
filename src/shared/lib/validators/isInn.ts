export const isINN = (identifier : string | null) => {
    if (!identifier || !identifier.length) return false;

    const INNFormatRegEx = /^\d{9}$/
    return INNFormatRegEx.test(identifier);
};
