<template>
    <grid-table :columns="columns" :items="items"> </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { getLifeformExperienceNeededForLevel, getLifeformLevel } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologySlots, LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';

    interface PlanetLifeformItem {
        planet: {
            name: string;
            coordinates: string;
        };
        lifeform: {
            type: LifeformType;
            level: number;
            levelExperience: number;
            totalExperience: number;
        };
        lifeformTechsTier1: (LifeformTechnologyType | null)[];
        lifeformTechsTier2: (LifeformTechnologyType | null)[];
        lifeformTechsTier3: (LifeformTechnologyType | null)[];
    }

    @Component({})
    export default class Lifeforms extends Vue {

        private get columns(): GridTableColumn<keyof PlanetLifeformItem>[] {
            return [
                {
                    key: 'planet',
                    label: 'LOCA: Planet',
                },
                {
                    key: 'lifeform',
                    label: 'LOCA: Lifeform',
                },
                {
                    key: 'lifeformTechsTier1',
                    label: 'LOCA: Techs (Tier 1)',
                },
                {
                    key: 'lifeformTechsTier2',
                    label: 'LOCA: Techs (Tier 2)',
                },
                {
                    key: 'lifeformTechsTier3',
                    label: 'LOCA: Techs (Tier 3)',
                },
            ];
        }

        private get items(): PlanetLifeformItem[] {
            const player = EmpireDataModule.empire;

            const planets = player.planetOrder
                .map(planetId => player.planets[planetId])
                .filter(planet => !planet.isMoon) as PlanetData[];

            const lifeformExperience: Partial<Record<LifeformType, number>> = player.lifeformExperience;

            return planets.map<PlanetLifeformItem>(planet => {
                const lfExp = lifeformExperience[planet.activeLifeform] ?? 0;
                const lfLevel = getLifeformLevel(lfExp);

                const result: PlanetLifeformItem = {
                    planet: {
                        name: planet.name,
                        coordinates: this.formatCoordinates(planet.coordinates),
                    },
                    lifeform: {
                        type: planet.activeLifeform,
                        level: lfLevel,
                        levelExperience: lfExp - getLifeformExperienceNeededForLevel(lfLevel),
                        totalExperience: lfExp,
                    },
                    lifeformTechsTier1: Array.from({ length: 6 }).map(
                        (_, i) => planet.activeLifeformTechnologies.find(tech => LifeformTechnologySlots[tech] == i + 1 + 0 * 6)
                            ?? null
                    ),
                    lifeformTechsTier2: Array.from({ length: 6 }).map(
                        (_, i) => planet.activeLifeformTechnologies.find(tech => LifeformTechnologySlots[tech] == i + 1 + 1 * 6)
                            ?? null
                    ),
                    lifeformTechsTier3: Array.from({ length: 6 }).map(
                        (_, i) => planet.activeLifeformTechnologies.find(tech => LifeformTechnologySlots[tech] == i + 1 + 2 * 6)
                            ?? null
                    ),
                };
                return result;
            });
        }

        private formatCoordinates(coords: Coordinates) {
            return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
        }
    }
</script>