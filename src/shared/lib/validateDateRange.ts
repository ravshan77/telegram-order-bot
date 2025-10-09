export const validateDateRange = (from?: string | number | Date, to?: string | number | Date) => {
    if (!from || !to) return true;
    return new Date(from) <= new Date(to);
};
