import { _logDebug } from "../utils/_log";
import { MigrationFunction } from "./models";

const migrate_v0_to_v1: MigrationFunction = () => {
    _logDebug('migrating from v0 to v1');
    // no migration from v0 to v1 because v0 was not public and supported data for only a single player
};
export default migrate_v0_to_v1;