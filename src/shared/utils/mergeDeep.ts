/** Merges two objects recursively. Will overwrite existing properties in a with the values in b. */
export function mergeDeep<T extends Record<string, any>>(a: T, b: T): T {
    const result = { ...a } as Record<string, any>;

    Object.keys(b).forEach(bKey => {
        const target = b[bKey];
        if(bKey in result) {
            const cur = result[bKey];

            if(typeof cur === 'object' && !(cur instanceof Array)) {
                result[bKey] = mergeDeep(cur, target);
                return;
            } 
        }

        result[bKey] = target;
    });

    return result as T;
}