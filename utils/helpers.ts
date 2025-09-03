export const toISO = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
};

export const getFutureDay = (offset: number): number => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.getDate();
};
