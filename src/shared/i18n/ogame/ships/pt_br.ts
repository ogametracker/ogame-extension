import { ShipType } from "../../../models/ogame/ships/ShipType";
import { ShipTranslations } from "./types";

export const pt_br: ShipTranslations =  {
    [ShipType.lightFighter]: 'Caça Ligeiro',
    [ShipType.heavyFighter]: 'Caça Pesado',
    [ShipType.cruiser]: 'Cruzador',
    [ShipType.battleship]: 'Nave de Batalha',
    [ShipType.battlecruiser]: 'Interceptador',
    [ShipType.bomber]: 'Bombardeiro',
    [ShipType.destroyer]: 'Destruidor',
    [ShipType.deathStar]: 'Estrela da Morte',
    [ShipType.reaper]: 'Ceifeira',
    [ShipType.pathfinder]: 'Explorador',
    [ShipType.smallCargo]: 'Cargueiro Pequeno',
    [ShipType.largeCargo]: 'Cargueiro Grande',
    [ShipType.recycler]: 'Nave Colonizadora',
    [ShipType.colonyShip]: 'Reciclador',
    [ShipType.espionageProbe]: 'Sonda de Espionagem',
    [ShipType.crawler]: 'Satélite Solar',
    [ShipType.solarSatellite]: 'Rastejador',
};