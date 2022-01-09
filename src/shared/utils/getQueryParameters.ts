/** Returns an object with key-value-pairs representing the pairs of the query string.
 *  If there are multiple occurences of the same key, the last value will be selected
 */
export function getQueryParameters(query: string): Record<string, string> {
    const result: Record<string, string> = {};

    if (query.startsWith('?')) {
        query = query.substring(1);
    }

    query.split('&').forEach(pair => {
        const [ key, value ] = pair.split('=');
        result[key] = value;
    });

    return result;
}