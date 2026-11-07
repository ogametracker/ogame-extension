<template>
    <LifeformBonusesBreakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type {
    StatsBonus,
    StatsBonusLifeformTechnology,
} from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import { StatsBonusLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
import LifeformBonusesBreakdown from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type {
    LifeformBonusesBreakdownType,
    LifeformBonusesPlanetBreakdown,
} from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import { DefenseType } from '@ogame-tracker/shared/models/ogame/defenses/DefenseType';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';

type StatsBonuses = {
    armor: number;
    shield: number;
    damage: number;
};

type DefenseBonusBreakdown = {
    base: StatsBonuses;
    level: StatsBonuses;
    buildings: StatsBonuses;
    buildingsBoost: number;
    total: StatsBonuses;
};

const empireStore = useEmpireStore();

const bonusTypes: LifeformBonusesBreakdownType<keyof StatsBonuses>[] = [
    {
        key: 'armor',
        label: translations().extension.empire.lifeforms.researchBonuses.ships.armor,
    },
    {
        key: 'shield',
        label: translations().extension.empire.lifeforms.researchBonuses.ships.shield,
    },
    {
        key: 'damage',
        label: translations().extension.empire.lifeforms.researchBonuses.ships.damage,
    },
];

const technologies = StatsBonusLifeformTechnologies.filter(tech => tech.appliesTo(DefenseType.rocketLauncher));

const limits = computed<Record<keyof StatsBonuses, (value: number) => number>>(() => {
    const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.StatsBonus, tech: DefenseType.rocketLauncher });

    return {
        armor: value => (limit != null ? Math.min(value, limit) : value),
        shield: value => (limit != null ? Math.min(value, limit) : value),
        damage: value => (limit != null ? Math.min(value, limit) : value),
    };
});

const techs = computed<LifeformTechnologyType[]>(() => technologies.map(t => t.type));

const planets = computed<Record<number, LifeformBonusesPlanetBreakdown<keyof StatsBonuses>[]>>(() => {
    return createMappedRecord(
        empireStore.empire.planetOrder
            .map(id => empireStore.empire.planets[id])
            .filter(planet => !planet.isMoon) as PlanetData[],
        planet => planet.id,
        planet =>
            technologies.map<LifeformBonusesPlanetBreakdown<keyof StatsBonuses>>(tech => {
                const planetBonuses = getPlanetBonus(tech, planet);

                return {
                    planet,
                    technologyType: tech.type,
                    bonuses: createRecord<keyof StatsBonuses, LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                        ['armor', 'shield', 'damage'],
                        key => ({
                            base: planetBonuses.base[key],
                            buildings: planetBonuses.buildings[key],
                            level: planetBonuses.level[key],
                            total: planetBonuses.total[key],
                        }),
                    ),
                };
            }),
    );
});

const experience = computed(() => empireStore.lifeformExperience);

function getPlanetBonus(tech: StatsBonusLifeformTechnology, planet: PlanetData): DefenseBonusBreakdown {
    const result: DefenseBonusBreakdown = {
        base: { armor: 0, shield: 0, damage: 0 },
        level: { armor: 0, shield: 0, damage: 0 },
        buildings: { armor: 0, shield: 0, damage: 0 },
        buildingsBoost: 0,
        total: { armor: 0, shield: 0, damage: 0 },
    };

    if (planet.activeLifeform == LifeformType.none || !planet.activeLifeformTechnologies.includes(tech.type)) {
        return result;
    }

    const buildingsBoost = Math.min(
        getPlanetLifeformTechnologyBoost(planet)[tech.type],
        getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
    );
    result.buildingsBoost += buildingsBoost;

    const bonuses = tech.getStatsBonus(DefenseType.rocketLauncher, planet.lifeformTechnologies[tech.type]);

    const mapping: Record<keyof StatsBonuses, keyof StatsBonus> = {
        armor: 'armor',
        shield: 'shield',
        damage: 'damage',
    };
    (Object.entries(mapping) as [keyof StatsBonuses, keyof StatsBonus][]).forEach(pair => {
        const [bonusType, statsType] = pair;

        const baseBonus = bonuses[statsType];
        const lifeformLevelBonus =
            baseBonus * getLifeformLevelTechnologyBonus(experience.value[planet.activeLifeform as ValidLifeformType]);
        const lifeformBuildingBonus = baseBonus * buildingsBoost;

        const total = baseBonus + lifeformLevelBonus + lifeformBuildingBonus;

        result.base[bonusType] += baseBonus;
        result.level[bonusType] += lifeformLevelBonus;
        result.buildings[bonusType] += lifeformBuildingBonus;
        result.total[bonusType] += total;
    });

    return result;
}
</script>
