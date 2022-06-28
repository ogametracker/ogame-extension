<template>
    <div>
        <h3>(DE) Daten-Export für Beta-Version</h3>
        <h3>(EN) Export data for beta version</h3>

        <button @click="exportData()">Export</button>
    </div>
</template>

<script lang="ts">
    import BattleReport from '@/models/battles/BattleReport';
    import DebrisFieldReport from '@/models/debrisFields/DebrisFieldReport';
    import ExpoEvent from '@/models/expeditions/ExpoEvent';
import { LocalPlayerData } from '@/store/modules/LocalPlayerModule';
import download from '@/utils/download';
    import { Component, Prop, Vue } from 'vue-property-decorator';


    export interface V1ToV2ExportedAccount {
        language: string;
        serverId: number;
        playerId: number;

        universeName: string;
        playerName: string;

        data: {
            expeditions: Record<number, ExpoEvent>;
            combatReports: Record<number, BattleReport>;
            debrisFieldReports: Record<number, DebrisFieldReport>;
        };
    }

    export interface V1ToV2Export {
        type: 'v1-to-v2-export';
        accounts: V1ToV2ExportedAccount[];
    }

    @Component({})
    export default class BetaExport extends Vue {

        private async exportData() {
            const allData = await new Promise<any>(resolve => chrome.storage.local.get(items => resolve(items)));
            const keys = Object.keys(allData)
                .filter(key => key.endsWith('-version') && allData[key] == '1.1')
                .map(key => key.replace(/-version$/, ''));

            const exportData: V1ToV2Export = {
                type: 'v1-to-v2-export',
                accounts: [],
            };

            keys.forEach(key => {
                const { serverId, language, playerId } = key.match(/s(?<serverId>\d+)-(?<language>\w+)-(?<playerId>\d+)$/)!.groups!;

                const account: V1ToV2ExportedAccount = {
                    language,
                    serverId: parseInt(serverId),
                    playerId: parseInt(playerId),
                    universeName: `${language.toUpperCase()} ${serverId}`,
                    playerName: playerId,
                    data: {
                        expeditions: allData[`${key}-expoEvents`] ?? {},
                        combatReports: allData[`${key}-battleReports`] ?? {},
                        debrisFieldReports: allData[`${key}-debrisFieldReports`] ?? {},
                    },
                };

                const localPlayerData: LocalPlayerData | undefined = allData[`${key}-local-player`];
                if(localPlayerData != null) {
                    account.playerName = localPlayerData.name ?? account.playerName;
                    account.universeName = localPlayerData.universeName ?? account.universeName;
                }


                exportData.accounts.push(account);
            });

            download('OGame Tracker Beta-Export.json', JSON.stringify(exportData));
        }
    }
</script>