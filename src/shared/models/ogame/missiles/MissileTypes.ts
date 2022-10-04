import { AntiBallisticMissile } from "./AntiBallisticMissile";
import { InterplanetaryMissile } from "./InterplanetaryMissile";
import { Missile } from "./Missile";
import { MissileType } from "./MissileType";

export const MissileTypes: MissileType[] = [
    MissileType.antiBallisticMissile,
    MissileType.interplanetaryMissile,
];


export const MissileByTypes: Record<MissileType, Missile> = {
    [MissileType.antiBallisticMissile]: AntiBallisticMissile,
    [MissileType.interplanetaryMissile]: InterplanetaryMissile,
};