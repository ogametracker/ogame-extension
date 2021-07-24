export class QueryParameters {
    private readonly _values: Record<string, string> = {};

    public add(key: string, value: string) {
        this._values[key] = value;
    }

    public has(key: string, value: string): boolean {
        return this._values[key] == value;
    }

    public get(key: string): string | null {
        return this._values[key] ?? null;
    }
}

export default function getQueryParameters(location: Location): QueryParameters {
    let query = location.search;
    if (query.startsWith('?')) {
        query = query.substr(1);
    }

    const pairs = query.split('&');
    const result = new QueryParameters();
    pairs.forEach(pair => {
        const split = pair.split('=');
        result.add(split[0], split[1]);
    });
    return result;
}

