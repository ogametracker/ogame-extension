import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const pt: ShipTranslations =  {
    [ShipType.lightFighter]: 'Caça Ligeiro',
    [ShipType.heavyFighter]: 'Caça Pesado',
    [ShipType.cruiser]: 'Cruzador',
    [ShipType.battleship]: 'Nave de Batalha',
    [ShipType.battlecruiser]: 'Interceptor',
    [ShipType.bomber]: 'Bombardeiro',
    [ShipType.destroyer]: 'Destruidor',
    [ShipType.deathStar]: 'Estrela da Morte',
    [ShipType.reaper]: 'Ceifeira',
    [ShipType.pathfinder]: 'Exploradora',
    [ShipType.smallCargo]: 'Cargueiro Pequeno',
    [ShipType.largeCargo]: 'Cargueiro Grande',
    [ShipType.colonyShip]: 'Nave de Colonização',
    [ShipType.recycler]: 'Reciclador',
    [ShipType.espionageProbe]: 'Sonda de Espionagem',
    [ShipType.solarSatellite]: 'Satélite Solar',
    [ShipType.crawler]: 'Rastejador',
};