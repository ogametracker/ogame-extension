import ExpoType from '@/models/expeditions/ExpoType';
import Resource from '@/models/Resource';
import Settings from '@/models/settings/Settings';
import Ship from '@/models/Ship';
import asyncChromeStorage from '@/utils/asyncChromeStorage';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
class SettingsModule extends Vue {
    public settings: Settings = {
        tables: {
            ranges: [
                {
                    type: "day",
                    skip: 0,
                    take: 1,
                    label: "Heute",
                },
                {
                    type: "day",
                    skip: 1,
                    take: 1,
                    label: "Gestern",
                },
                {
                    type: "week",
                    skip: 0,
                    take: 1,
                    label: "Aktuelle Woche",
                },
                {
                    type: "week",
                    skip: 1,
                    take: 1,
                    label: "Letzte Woche",
                },
                {
                    type: "month",
                    skip: 0,
                    take: 1,
                    label: "Aktueller Monat",
                },
                {
                    type: "all",
                },
            ]
        },
        charts: {
            days: 31,
            colors: {
                overview: {
                    [ExpoType.nothing]: '#2472f3',
                    [ExpoType.resources]: '#c72525',
                    [ExpoType.fleet]: '#fbbc04',
                    [ExpoType.delay]: '#9ecc00',
                    [ExpoType.early]: '#00a95e',
                    [ExpoType.darkMatter]: '#075263',
                    [ExpoType.pirates]: '#de5200',
                    [ExpoType.aliens]: '#16a8d4',
                    [ExpoType.item]: '#ad135e',
                    [ExpoType.trader]: '#00708a',
                    [ExpoType.lostFleet]: '#ffffff',
                },
                resources: {
                    [Resource.metal]: '#de5200',
                    [Resource.crystal]: '#249df3',
                    [Resource.deuterium]: '#14bf73',
                },
                fleet: {
                    [Ship.lightFighter]: '#2472f3',
                    [Ship.heavyFighter]: '#c72525',
                    [Ship.cruiser]: '#fbbc04',
                    [Ship.battleship]: '#9ecc00',
                    [Ship.bomber]: '#00a95e',
                    [Ship.battlecruiser]: '#075263',
                    [Ship.destroyer]: '#de5200',
                    [Ship.reaper]: '#16a8d4',
                    [Ship.pathfinder]: '#ad135e',
                    [Ship.smallCargo]: '#00708a',
                    [Ship.largeCargo]: '#ffffff',
                    [Ship.espionageProbe]: '#4b17da',
                    [Ship.deathStar]: '#000000',
                    [Ship.recycler]: '#000000',
                    [Ship.colonyShip]: '#000000',
                    [Ship.crawler]: '#000000',
                }
            }
        },
    };

    private async created() {
        const settings = await asyncChromeStorage.get(this.storageKey);
        if(settings != null) {
            this.settings = settings;
        }
    }

    private get storageKey(): string {
        const serverMeta = document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement | null;
        const playerIdMeta = document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement | null;
        if(serverMeta == null || playerIdMeta == null)
            throw new Error();

        const server = serverMeta.content.split('.')[0];
        const playerId = playerIdMeta.content;
        return `${server}-${playerId}-settings`;
    }

    public async save() {
        await asyncChromeStorage.set(this.storageKey, this.settings);
    }
}

export default new SettingsModule();