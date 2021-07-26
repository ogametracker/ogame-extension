export default function getNumericEnumValues<T>(enumObj: any): T[] {
    return Object.values(enumObj)
        .filter(value => typeof value === 'number')
        .map(value => <T>value);
}