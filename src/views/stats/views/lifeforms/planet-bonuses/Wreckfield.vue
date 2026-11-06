<template>
    <lifeform-planet-bonuses-component
        :technologyBonuses="{}"
        no-technology-bonuses
        :types="bonusTypes"
        :buildings="buildings"
        :forceIncludeBuildings="[BuildingType.spaceDock]"
        :planets="planets"
        :limits="limits"
        research-bonus-breakdown-route-name="lifeforms/bonus-breakdown/resource-production"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import LifeformPlanetBonusesComponent from '@stats/components/lifeforms/LifeformPlanetBonuses.vue';
import type { LifeformPlanetBonusesType, LifeformPlanetBonuses } from '@stats/components/lifeforms/LifeformPlanetBonuses.vue';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';
import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformBuildingsByType, SpaceDockBonusLifeformBuildings } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import type { SpaceDockBonusLifeformBuilding } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/interfaces';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { SpaceDock } from '@ogame-tracker/shared/models/ogame/buildings/SpaceDock';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';

type Key = 'wreckfield';

const empireStore = useEmpireStore();

const serverSettingsStore = useServerSettingsStore();

const bonusTypes = computed<LifeformPlanetBonusesType<Key>[]>(() => {
    return [
        {
            key: 'wreckfield',
            label: translations().extension.empire.lifeforms.planetBonuses.wreckfield.header,
        },
    ];
});

const buildings: (LifeformBuildingType | BuildingType)[] = [
    SpaceDock.type,
    ...SpaceDockBonusLifeformBuildings.map(b => b.type),
];

const limits = computed<Record<Key, (value: number) => number>>(() => {
    const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.SpaceDockBonus });
    return {
        wreckfield: value => limit != null ? Math.min(value, limit) : value,
    };
});

const empirePlanets = computed(() => {
    return empireStore.empire.planetOrder
        .map(id => empireStore.empire.planets[id])
        .filter(planet => !planet.isMoon) as PlanetData[];
});

const planets = computed<Record<number, LifeformPlanetBonuses<Key>>>(() => {
    return createMappedRecord(
        empirePlanets.value,

        planet => planet.id,
        planet => {
            const activeBuildingTypes = (LifeformBuildingTypesByLifeform[planet.activeLifeform] as (LifeformBuildingType | BuildingType)[])
                .filter(b => buildings.includes(b))
                .concat(SpaceDock.type);

            const bonusByBuilding = createRecord<Key, Record<LifeformBuildingType | BuildingType, number>>(
                ['wreckfield'],
                () => createRecord(
                    activeBuildingTypes,
                    type => {
                        const dfSetting = serverSettingsStore.serverSettings.combats.debrisFieldFactors.ships;
                        const wfFactor = SpaceDock.getWreckfield(planet.buildings[BuildingType.spaceDock], dfSetting);

                        if (type == BuildingType.spaceDock) {
                            return wfFactor;
                        }

                        const lfBuildingType = type as LifeformBuildingType;
                        const bonus = (LifeformBuildingsByType[lfBuildingType] as SpaceDockBonusLifeformBuilding)
                            .getSpaceDockBonus(planet.lifeformBuildings[lfBuildingType])

                        return bonus * wfFactor;
                    },
                )
            );

            return {
                planet,
                bonusByBuilding,
            };
        }
    );
});
</script>
