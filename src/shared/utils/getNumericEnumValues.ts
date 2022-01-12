export function getNumericEnumValues<TEnum extends number>(enumObj: any): TEnum[] {
    return Object.values(enumObj)
        .filter(value => typeof value === 'number')
        .map(value => value as any as TEnum);
}