export function createRecord<TKey extends string | number | symbol, TValue>(keys: TKey[], defaultValue: TValue | (() => TValue)): Record<TKey, TValue> {
    const result = {} as Record<TKey, TValue>;
    keys.forEach(key =>
        result[key] = defaultValue instanceof Function
            ? defaultValue()
            : defaultValue
    );

    return result;
}