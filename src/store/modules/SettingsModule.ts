import ExpoType from '@/models/expeditions/ExpoType';
import OgameMetaData from '@/models/ogame/OgameMetaData';
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
                    [ExpoType.trader]: '#888888',
                    [ExpoType.lostFleet]: '#ffffff',
                },
                resources: {
                    [Resource.metal]: '#de5200',
                    [Resource.crystal]: '#249df3',
                    [Resource.deuterium]: '#14bf73',
                },
                ships: {
                    [Ship.lightFighter]: '#2472f3',
                    [Ship.heavyFighter]: '#c72525',
                    [Ship.cruiser]: '#fbbc04',
                    [Ship.battleship]: '#9ecc00',
                    [Ship.bomber]: '#00a95e',
                    [Ship.battlecruiser]: '#075263',
                    [Ship.destroyer]: '#de5200',
                    [Ship.reaper]: '#16a8d4',
                    [Ship.pathfinder]: '#ad135e',
                    [Ship.smallCargo]: '#888888',
                    [Ship.largeCargo]: '#ffffff',
                    [Ship.espionageProbe]: '#4b17da',
                    [Ship.deathStar]: '#250909',
                    [Ship.recycler]: '#8aff8e',
                    [Ship.colonyShip]: '#d7b58e',
                    [Ship.crawler]: '#94b4ff',
                    [Ship.solarSatellite]: '#dd94ff',
                },
                battleResults: {
                    draw: '#888888',
                    lost: '#c72525',
                    won: '#00a95e',
                },
            },
        },
    };

    private async created() {
        const settings = await asyncChromeStorage.get(this.storageKey);
        if (settings != null) {
            this.settings = settings;
        }
    }

    private get storageKey(): string {
        const server = OgameMetaData.universeShort;
        const playerId = OgameMetaData.playerId;
        return `${server}-${playerId}-settings`;
    }

    public async save() {
        await asyncChromeStorage.set(this.storageKey, this.settings);
    }
}

export default new SettingsModule();