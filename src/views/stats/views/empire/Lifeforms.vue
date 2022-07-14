<template>
    <grid-table :columns="columns" :items="items" class="lifeform-table">
        <template #cell-planet="{ value }">
            <span v-text="value.name" />
            &nbsp;
            <span v-text="value.coordinates" />
        </template>

        <template #cell-lifeform="{ value }">
            <o-lifeform :lifeform="value.type" size="48px" />
            <div class="level-list">
                <span v-text="`LOCA: Level ${value.level}`" />
                <span v-text="`LOCA: Experience ${$i18n.$n(value.levelExperience)}`" />
                <span v-text="`LOCA: Total Experience ${$i18n.$n(value.totalExperience)}`" />
            </div>
        </template>

        <template #cell-lifeformTechsTier1="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology v-if="tech != null" :key="`icon-${i}`" :technology="tech" size="40px" :disabled="item.lifeformTechnologies[tech] == 0" />
                    <span v-else :key="`icon-${i}`" />
                </template>
                <span v-for="(tech, i) in value" :key="`level-${i}`" v-text="item.lifeformTechnologies[tech]" />
            </div>
        </template>
        <template #cell-lifeformTechsTier2="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology v-if="tech != null" :key="`icon-${i}`" :technology="tech" size="40px" :disabled="item.lifeformTechnologies[tech] == 0" />
                    <span v-else :key="`icon-${i}`" />
                </template>
                <span v-for="(tech, i) in value" :key="`level-${i}`" v-text="item.lifeformTechnologies[tech]" />
            </div>
        </template>
        <template #cell-lifeformTechsTier3="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology v-if="tech != null" :key="`icon-${i}`" :technology="tech" size="40px" :disabled="item.lifeformTechnologies[tech] == 0" />
                    <span v-else :key="`icon-${i}`" />
                </template>
                <span v-for="(tech, i) in value" :key="`level-${i}`" v-text="item.lifeformTechnologies[tech]" />
            </div>
        </template>
    </grid-table>
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

        lifeformTechnologies: Record<LifeformTechnologyType, number>;
    }

    @Component({})
    export default class Lifeforms extends Vue {

        private get columns(): GridTableColumn<keyof PlanetLifeformItem>[] {
            return [
                {
                    key: 'planet',
                    label: 'LOCA: Planet',
                    size: '200px',
                },
                {
                    key: 'lifeform',
                    label: 'LOCA: Lifeform',
                    size: '1fr',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'left-text',
                    class: 'left-text',
                },
                {
                    key: 'lifeformTechsTier1',
                    label: 'LOCA: Techs (Tier 1)',
                    size: '276px',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
                },
                {
                    key: 'lifeformTechsTier2',
                    label: 'LOCA: Techs (Tier 2)',
                    size: '276px',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
                },
                {
                    key: 'lifeformTechsTier3',
                    label: 'LOCA: Techs (Tier 3)',
                    size: '276px',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
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
                    lifeformTechnologies: planet.lifeformTechnologies,
                };
                return result;
            });
        }

        private formatCoordinates(coords: Coordinates) {
            return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
        }
    }
</script>
<style lang="scss" scoped>
    .lifeform-tech-table {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        column-gap: 4px;
        justify-items: center;
    }

    .level-list {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        justify-items: start;
        margin-left: 8px;
        line-height: 1.1;
    }

    .lifeform-table::v-deep {
        .left-text {
            justify-content: start;
        }

        .center-text {
            justify-content: center;
        }
    }
</style>