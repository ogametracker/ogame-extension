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
                    nothing: '#4285f4',
                    resources: '#c33737',
                    fleet: '#fbbc04',
                    delay: '#9ecc00',
                    early: '#34a875',
                    darkMatter: '#aaaaaa',
                    pirates: '#ff6d01',
                    aliens: '#46bdc6',
                    item: '#a72766',
                    trader: '#075263',
                    lostFleet: '#ffffff',
                },
                resources: {
                    metal: '#ff6d01',
                    crystal: '#4285f4',
                    deuterium: '#34a875',
                },
                darkMatter: '#075263',
                fleet: {
                    [Ship.lightFighter]: '#4285f4',
                    [Ship.heavyFighter]: '#c33737',
                    [Ship.cruiser]: '#fbbc04',
                    [Ship.battleship]: '#9ecc00',
                    [Ship.bomber]: '#34a875',
                    [Ship.battlecruiser]: '#aaaaaa',
                    [Ship.destroyer]: '#ff6d01',
                    [Ship.reaper]: '#46bdc6',
                    [Ship.pathfinder]: '#a72766',
                    [Ship.smallCargo]: '#075263',
                    [Ship.largeCargo]: '#ffffff',
                    [Ship.espionageProbe]: '#522eb3',
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