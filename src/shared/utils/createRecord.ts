export function createRecord<TKey extends string | number | symbol, TValue>(keys: TKey[], defaultValue: TValue | ((key: TKey) => TValue)): Record<TKey, TValue> {
    const result = {} as Record<TKey, TValue>;
    keys.forEach(key =>
        result[key] = defaultValue instanceof Function
            ? defaultValue(key)
            : defaultValue
    );

    return result;
}