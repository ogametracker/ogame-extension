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
                    [Ship.crawler]: undefined,
                    [Ship.colonyShip]: undefined,
                    [Ship.recycler]: undefined,
                    [Ship.deathStar]: undefined,
                }
            }
        },
    };

    private async created() {
        //TODO: load settings from chrome storage if exists
    }
}

export default new SettingsModule();