import { V1ToV2Export } from "./v1-to-v2";
import { V2Export } from "./v2";

export type VersionedDataExport = V1ToV2Export | V2Export;