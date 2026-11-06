import { toRaw } from 'vue';

// These database records use plain objects and arrays. A shallow spread can still contain Vue proxies.
export function toDatabaseRecord<T>(value: T): T {
    if (value == null || typeof value !== 'object') {
        return value;
    }

    const raw = toRaw(value);
    if (Array.isArray(raw)) {
        return raw.map(item => toDatabaseRecord(item)) as T;
    }
    if (Object.getPrototypeOf(raw) === Object.prototype) {
        return Object.fromEntries(Object.entries(raw).map(([key, item]) => [key, toDatabaseRecord(item)])) as T;
    }
    return raw;
}
