import ExpoSize from "@/models/expeditions/ExpoSize";
import ExpoType from "@/models/expeditions/ExpoType";
import Resource from "@/models/Resource";
import Ship from "@/models/Ship";

export default {
    de: {
        resources: {
            [Resource.metal]: 'Metall',
            [Resource.crystal]: 'Kristall',
            [Resource.deuterium]: 'Deuterium',
        },
        ships: {
            [Ship.lightFighter]: 'Leichter Jäger',
            [Ship.heavyFighter]: 'Schwerer Jäger',
            [Ship.cruiser]: 'Kreuzer',
            [Ship.battleship]: 'Schlachtschiff',
            [Ship.battlecruiser]: 'Schlachtkreuzer',
            [Ship.bomber]: 'Bomber',
            [Ship.destroyer]: 'Zerstörer',
            [Ship.deathStar]: 'Todesstern',
            [Ship.reaper]: 'Reaper',
            [Ship.pathfinder]: 'Pathfinder',
            [Ship.smallCargo]: 'Kleiner Transporter',
            [Ship.largeCargo]: 'Großer Transporter',
            [Ship.recycler]: 'Recycler',
            [Ship.colonyShip]: 'Kolonieschiff',
            [Ship.espionageProbe]: 'Spionagesonde',
            [Ship.crawler]: 'Crawler',
        },
        expoTypes: {
            [ExpoType.aliens]: 'Aliens',
            [ExpoType.pirates]: 'Piraten',
            [ExpoType.darkMatter]: 'Dunkle Materie',
            [ExpoType.delay]: 'Verspätung',
            [ExpoType.early]: 'Verfühung',
            [ExpoType.fleet]: 'Flotte',
            [ExpoType.item]: 'Item',
            [ExpoType.lostFleet]: 'Flottenverlust',
            [ExpoType.nothing]: 'Nichts',
            [ExpoType.resources]: 'Rohstoffe',
            [ExpoType.trader]: 'Händler',
        },
        expoSizes: {
            [ExpoSize.small]: 'Normal',
            [ExpoSize.medium]: 'Groß',
            [ExpoSize.large]: 'Riesig',
        },
        total: 'Gesamt',
        chart: 'Diagramm',
        tables: 'Tabellen',
        overview: 'Übersicht',
        expos: {
            overview: 'Übersicht',
            resources: 'Rohstofffunde',
            fleet: 'Flottenfunde',
            darkMatter: 'DM-Funde',
            item: 'Itemfunde',
            distribution: 'Verteilung',
        },
        expeditions: 'Expeditionen',
        attacks: 'Angriffe',
        since: 'Seit',
        darkMatter: 'Dunkle Materie',
    },
};