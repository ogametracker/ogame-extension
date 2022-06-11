import { MigrationFunction } from "./models";
import v0_to_v1 from "./v0_to_v1";
import v1_to_v1_1 from "./v1_to_v1.1";
import v1_1_v2_0_to_v2_0_1 from "./v1.1_v2.0_to_v2.0.1";
import { openDB } from "idb";


export async function executeMigrations(): Promise<void> {
    let dbExists = false;
    try {
        await openDB('ogame-tracker', undefined, {
            upgrade(db, oldVersion, newVersion, transaction) {
                dbExists = oldVersion != 0;
                transaction.abort();
            },
        });
    } catch { 
        // intentionally do nothing because `transaction.abort()` will throw
    }
    console.log('does db exist?', dbExists);

    const migrations: MigrationFunction[] = [
        v1_1_v2_0_to_v2_0_1,
    ];

    if (!dbExists) {
        migrations.unshift(
            v0_to_v1,
            v1_to_v1_1,
        );
    }

    for (const migration of migrations) {
        await migration();
    }
}