export function createRecord<TKey extends string | number | symbol, TValue>(
    keys: TKey[],
    defaultValue: TValue | ((key: TKey) => TValue)
): Record<TKey, TValue> {
    const result = {} as Record<TKey, TValue>;
    keys.forEach(key =>
        result[key] = defaultValue instanceof Function
            ? defaultValue(key)
            : defaultValue
    );

    return result;
}

export function createMappedRecord<T, TKey extends string | number | symbol, TValue>(
    input: T[],
    mapKeys: (value: T) => TKey,
    defaultValue: TValue | ((value: T) => TValue)
): Record<TKey, TValue> {
    const result = {} as Record<TKey, TValue>;
    input.forEach(i => {
        const key = mapKeys(i);

        result[key] = defaultValue instanceof Function
            ? defaultValue(i)
            : defaultValue
    });

    return result;
}