function setDeep(obj: any, keys: string[], value: any) {
    let cur = obj;
    while (keys.length > 0) {
        const key = keys.shift()!;

        if (cur[key] == null) {
            if (keys.length > 0) {
                cur[key] = {};
            }
            else {
                cur[key] = value;
            }
        }
        cur = cur[key];
    }
}

function transformRecursive(obj: any, keys: string[], output: any) {
    for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (typeof value !== 'object' || value instanceof RegExp || value instanceof Array) {
            setDeep(output, [key, ...keys], value);
        }
        else {
            transformRecursive(value, [...keys, key], output);
        }
    }
}

export default function topLevelKeys(obj: any) {
    const transformed = {};
    transformRecursive(obj, [], transformed);

    return transformed;
}