import { _logDebug } from "../utils/_log";
import { MigrationFunction } from "./models";

const migrate_v0_to_v1: MigrationFunction = async () => {
    _logDebug('migrating from v0 to v1');
    // no actual migration from v0 to v1 because v0 was not public and supported data for only a single player
    
    // we only create a version key if it does not exists 
    const allData = await chrome.storage.local.get(null);
    const keyPrefixes = [
        ...new Set<string>(
            Object.keys(allData)
                .map(key => key.match(/^(?<prefix>s\d+-\w+-\d+)-.+$/)?.groups?.prefix)
                .filter(key => key != null) as string[]
        )
    ].filter(prefix => allData[`${prefix}-version`] == null);

    for (const prefix of keyPrefixes) {
        _logDebug(`migrating from v0 to v1: '${prefix}'`);

        await chrome.storage.local.set({
            [`${prefix}-version`]: '1.0',
        });
    }
};
export default migrate_v0_to_v1;