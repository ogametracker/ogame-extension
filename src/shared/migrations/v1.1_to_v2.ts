//TODO: inline types

import { _logDebug } from "../utils/_log";
import { MigrationFunction } from "./models";


const migrate: MigrationFunction = async () => {
    _logDebug('migrating from v1 to v2');
    //TODO: migrate
};
export default migrate;