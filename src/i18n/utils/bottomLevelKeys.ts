function setBottomLevelKey(bottomLevelKey: string, object: Record<string, any> | string): Record<string, any> {
    if (typeof object !== 'object' || object instanceof RegExp || object instanceof Array) {
        return { [bottomLevelKey]: object };
    }

    let result: Record<string, any> = {};

    for (const key of Object.keys(object)) {
        const value = object[key];
        const transformed = { [key]: setBottomLevelKey(bottomLevelKey, value) };
        result = {
            ...result,
            ...transformed,
        };
    }

    return result;
}

export default function bottomLevelKeys(object: Record<string, any>): Record<string, any> {
    const keys = Object.keys(object);
    let result: Record<string, any> = {};

    for (const key of keys) {
        const value = object[key];
        const transformed = setBottomLevelKey(key, value);
        result = {
            ...result,
            ...transformed,
        };
    }

    return result;
}