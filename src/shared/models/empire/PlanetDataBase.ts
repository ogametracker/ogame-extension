import { Coordinates } from '../ogame/common/Coordinates';
import { PlanetActiveItems } from './PlanetActiveItems';
import { DefenseCount } from './DefenseCount';


export interface PlanetDataBase {
    id: number;
    name: string;
    coordinates: Coordinates;

    defense: DefenseCount;
    activeItems: PlanetActiveItems;
}