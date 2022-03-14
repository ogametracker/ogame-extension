import { MigrationFunction } from "./models";
import v0_to_v1 from "./v0_to_v1";
import v1_to_v1_1 from "./v1_to_v1.1";
import v1_1_to_v2 from "./v1.1_to_v2";

const migrations: MigrationFunction[] = [
    v0_to_v1,
    v1_to_v1_1,
    v1_1_to_v2,
];

export async function executeMigrations(): Promise<void> {
    for(const migration of migrations) {
        await migration();
    }
}