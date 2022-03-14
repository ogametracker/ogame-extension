class OgameMetaData {
    public get universe() {
        const value = (document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement)?.content;
        if (value == null)
            throw new Error();

        return value;
    }

    public get universeShort() {
        const value = (document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement)?.content;
        if (value == null)
            throw new Error();

        return value.split('.')[0];
    }

    public get universeName() {
        const value = (document.querySelector('meta[name="ogame-universe-name"]') as HTMLMetaElement)?.content;
        if (value == null)
            throw new Error();

        return value;
    }

    public get universeSpeed() {
        const value = (document.querySelector('meta[name="ogame-universe-speed"]') as HTMLMetaElement)?.content;
        if (value == null)
            throw new Error();

        return parseInt(value, 10);
    }

    public get locale() {
        const value = (document.querySelector('meta[name="ogame-language"]') as HTMLMetaElement)?.content;
        if (value == null)
            throw new Error();

        return value;
    }

    public get playerId() {
        const value = (document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement)?.content;
        if (value == null)
            throw new Error();

        return parseInt(value, 10);
    }

    public get planetId() {
        const value = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement)?.content;
        if (value == null)
            throw new Error();

        return parseInt(value, 10);
    }

    /** {universe-name}-{playerID} */
    public get storageKeyPrefix() {
        return `${this.universeShort}-${this.playerId}`;
    }
}

export default new OgameMetaData();