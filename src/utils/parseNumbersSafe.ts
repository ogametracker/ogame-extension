export function parseFloatSafe(input: string, defaultValue = 0): number {
    const x = parseFloat(input);
    return isNaN(x) ? defaultValue : x;
}

export function parseIntSafe(input: string, defaultValue = 0): number {
    const x = parseInt(input);
    return isNaN(x) ? defaultValue : x;
}