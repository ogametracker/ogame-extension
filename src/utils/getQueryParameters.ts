export default function getQueryParameters(location: Location): { key: string; value: string; }[] {
    let query = location.search;
    if(query.startsWith('?')) {
        query = query.substr(1);
    }

    const pairs = query.split('&');
    return pairs.map(pair => {
        const split = pair.split('=');
        return {
            key: split[0],
            value: split[1],
        };
    });
}

