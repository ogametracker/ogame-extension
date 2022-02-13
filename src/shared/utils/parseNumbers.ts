export function parseIntSafe(text: string, radix: number): number {
    const value = parseInt(text, radix);
    if(isNaN(value)) {
        throw new Error(`'${text}' is not a valid integer value`);
    }

    return value;
}

export function parseFloatSafe(text: string): number {
    const value = parseFloat(text);
    if(isNaN(value)) {
        throw new Error(`'${text}' is not a valid integer value`);
    }

    return value;
}