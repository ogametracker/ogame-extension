const metaUniverse = (document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement)?.content;
const metaUniverseName = (document.querySelector('meta[name="ogame-universe-name"]') as HTMLMetaElement)?.content;
const metaUniverseSpeed = (document.querySelector('meta[name="ogame-universe-speed"]') as HTMLMetaElement)?.content;
const metaUniverseLanguage = (document.querySelector('meta[name="ogame-universe-language"]') as HTMLMetaElement)?.content;
const metaUniversePlayerId = (document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement)?.content;

class OgameMetaData {
    private readonly _universe = metaUniverse; //"s146-de.ogame.gameforge.com"
    public get universe() {
        if (this._universe == null)
            throw new Error();

        return this._universe;
    }

    private readonly _universeShort = metaUniverse.split('.')[0]; // "s146-de"
    public get universeShort() {
        if (this._universeShort == null)
            throw new Error();

        return this._universeShort;
    }

    private readonly _universeName = metaUniverseName; // "Tarazed"
    public get universeName() {
        if (this._universeName == null)
            throw new Error();

        return this._universeName;
    }

    private readonly _universeSpeed = parseInt(metaUniverseSpeed); // 6
    public get universeSpeed() {
        if (this._universeSpeed == null)
            throw new Error();

        return this._universeSpeed;
    }

    private readonly _locale = metaUniverseLanguage; // "de"
    public get locale() {
        if (this._locale == null)
            throw new Error();

        return this._locale;
    }

    private readonly _playerId = parseInt(metaUniversePlayerId); // 123456
    public get playerId() {
        if (this._playerId == null)
            throw new Error();

        return this._playerId;
    }
}

export default new OgameMetaData();