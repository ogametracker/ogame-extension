import { createRecord } from '../../utils/createRecord';
import type { PlanetData } from '../empire/PlanetData';
import { PlayerClass } from '../ogame/classes/PlayerClass';
import type { LifeformTechnologyType } from '../ogame/lifeforms/LifeformTechnologyType';
import {
    ClassBonusLifeformTechnologies,
    ExpeditionBonusLifeformTechnologies,
} from '../ogame/lifeforms/technologies/LifeformTechnologies';
import { getLifeformTechnologyBonusBreakdown } from '../ogame/lifeforms/utils';
import { ExpeditionEventType } from './ExpeditionEventType';

export interface ExpeditionLifeformState {
    activeTechnologyLevels: Partial<Record<LifeformTechnologyType, number>>;
    lifeformTechnologyBoost: Record<LifeformTechnologyType, number>;
    lifeformExperienceBoost: number;
}

export function getActiveLifeformTechnologyLevels(
    planet: Pick<PlanetData, 'activeLifeformTechnologies' | 'lifeformTechnologies'>,
): ExpeditionLifeformState['activeTechnologyLevels'] {
    return createRecord(planet.activeLifeformTechnologies, technology => planet.lifeformTechnologies[technology] ?? 0);
}

export function getExpeditionLifeformBonuses(planets: readonly ExpeditionLifeformState[]) {
    return createRecord(
        [ExpeditionEventType.resources, ExpeditionEventType.fleet, ExpeditionEventType.darkMatter],
        event =>
            ExpeditionBonusLifeformTechnologies.reduce(
                (total, technology) =>
                    total
                    + sumTechnologyBonus(planets, technology.type, level =>
                        technology.getExpeditionBonus(event, level),
                    ),
                0,
            ),
    );
}

export function getDiscovererLifeformBonus(planets: readonly ExpeditionLifeformState[]): number {
    return ClassBonusLifeformTechnologies.reduce(
        (total, technology) =>
            total
            + sumTechnologyBonus(planets, technology.type, level =>
                technology.getClassBonus(PlayerClass.discoverer, level),
            ),
        0,
    );
}

function sumTechnologyBonus(
    planets: readonly ExpeditionLifeformState[],
    technology: LifeformTechnologyType,
    getBaseBonus: (level: number) => number,
): number {
    return planets.reduce((total, planet) => {
        const level = planet.activeTechnologyLevels[technology] ?? 0;
        if (level === 0) {
            return total;
        }
        return (
            total
            + getLifeformTechnologyBonusBreakdown(
                getBaseBonus(level),
                planet.lifeformTechnologyBoost[technology],
                planet.lifeformExperienceBoost,
            ).total
        );
    }, 0);
}
