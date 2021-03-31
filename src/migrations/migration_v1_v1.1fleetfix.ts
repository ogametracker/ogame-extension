import ExpoEvent, { ExpoEventBase, ExpoEventFleet, ExpoFindableFleet, ExpoSizeableEvent } from '@/models/expeditions/ExpoEvent';
import ExpoType from "@/models/expeditions/ExpoType";
import ExpoSize from "@/models/expeditions/ExpoSize";
import asyncChromeStorage from "@/utils/asyncChromeStorage";
import ExpoModule from "@/store/modules/ExpoModule";
import OgameMetaData from "@/models/ogame/OgameMetaData";
import Ship from '@/models/Ship';

interface ExpoEventFleet_kaputt extends ExpoEventBase, ExpoSizeableEvent {
    type: ExpoType.fleet;
    fleet: {
        lightFighter: number;
        heavyFighter: number;
        cruiser: number;
        battleship: number;
        battlecruiser: number;
        bomber: number;
        destroyer: number;
        espionageProbe: number;
        largeCargo: number;
        pathfinder:number;
        reaper: number;
        smallCargo: number;
    };
}

function migrateExpo_v1_v1_1_fleetfix(expoEvent: ExpoEventFleet_kaputt): void {
    const fixedFleet: ExpoFindableFleet = {
        [Ship.lightFighter]: expoEvent.fleet.lightFighter,
        [Ship.heavyFighter]: expoEvent.fleet.heavyFighter,
        [Ship.cruiser]: expoEvent.fleet.cruiser,
        [Ship.battleship]: expoEvent.fleet.battleship,
        [Ship.battlecruiser]: expoEvent.fleet.battlecruiser,
        [Ship.bomber]: expoEvent.fleet.bomber,
        [Ship.destroyer]: expoEvent.fleet.destroyer,
        [Ship.espionageProbe]: expoEvent.fleet.espionageProbe,
        [Ship.largeCargo]: expoEvent.fleet.largeCargo,
        [Ship.pathfinder]: expoEvent.fleet.pathfinder,
        [Ship.reaper]: expoEvent.fleet.reaper,
        [Ship.smallCargo]: expoEvent.fleet.smallCargo,
    };

    (expoEvent as ExpoEventFleet).fleet = fixedFleet;
}


export default async function migration_v1_v1_1() {
    const expos = ExpoModule.expos;
    expos.forEach(expo => {
        if(expo.type != ExpoType.fleet)
            return;
        
        migrateExpo_v1_v1_1_fleetfix(expo as ExpoEventFleet_kaputt);
    });

    ExpoModule.save();
}