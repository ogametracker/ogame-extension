import { ExpoFindableShips } from '@/models/expeditions/ExpoEvent';
import Settings from '@/models/settings/Settings';
import Ship from '@/models/Ship';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
class SettingsModule extends Vue {
    public readonly settings: Settings = {
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
                    nothing: '#2472f3',
                    resources: '#c72525',
                    fleet: '#fbbc04',
                    delay: '#9ecc00',
                    early: '#00a95e',
                    darkMatter: '#075263',
                    pirates: '#de5200',
                    aliens: '#16a8d4',
                    item: '#ad135e',
                    trader: '#00708a',
                    lostFleet: '#ffffff',
                },
                resources: {
                    metal: '#de5200',
                    crystal: '#249df3',
                    deuterium: '#14bf73',
                },
                darkMatter: '#075263',
                fleet: {
                    [ExpoFindableShips.lightFighter]: '#2472f3',
                    [ExpoFindableShips.heavyFighter]: '#c72525',
                    [ExpoFindableShips.cruiser]: '#fbbc04',
                    [ExpoFindableShips.battleship]: '#9ecc00',
                    [ExpoFindableShips.bomber]: '#00a95e',
                    [ExpoFindableShips.battlecruiser]: '#075263',
                    [ExpoFindableShips.destroyer]: '#de5200',
                    [ExpoFindableShips.reaper]: '#16a8d4',
                    [ExpoFindableShips.pathfinder]: '#ad135e',
                    [ExpoFindableShips.smallCargo]: '#00708a',
                    [ExpoFindableShips.largeCargo]: '#ffffff',
                    [ExpoFindableShips.espionageProbe]: '#4b17da',
                }
            }
        },
    };

    private async created() {
        //TODO: load settings from chrome storage if exists
    }
}

export default new SettingsModule();