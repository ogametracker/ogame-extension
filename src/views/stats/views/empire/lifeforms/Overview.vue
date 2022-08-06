<template>
    <grid-table :columns="columns" :items="items" class="lifeform-table" sticky>
        <template #cell-planet="{ value }">
            <span v-text="value.name" />
            &nbsp;
            <span v-text="value.coordinates" />
        </template>

        <template #cell-lifeform="{ value }">
            <o-lifeform :lifeform="value.type" size="64px" />
            <div class="level-list">
                <span v-text="$i18n.$t.lifeforms[value.type]" :class="value.type" />
                <span v-text="`${$i18n.$t.empire.lifeforms.lifeformLevel}: ${value.level}`" />
                <span v-text="`${$i18n.$t.empire.lifeforms.lifeformExperience}: ${$i18n.$n(value.levelExperience)}/${$i18n.$n(value.totalLevelExperience)}`" />
                <span v-text="`${$i18n.$t.empire.lifeforms.totalLifeformExperience}: ${$i18n.$n(value.totalExperience)}`" />
            </div>
        </template>

        <template #cell-buildings="{ value, item }">
            <div class="building-levels">
                <span v-for="building in value" :key="building">
                    <o-lifeform-building :building="building" size="28px" :disabled="item.buildingLevels[building] == 0" />
                    <span v-text="item.buildingLevels[building]" />
                </span>
            </div>
        </template>

        <template #cell-lifeformTechsTier1="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology
                        v-if="tech != null"
                        :key="`icon-${i}`"
                        :technology="tech"
                        :disabled="item.lifeformTechnologies[tech] == 0"
                        size="40px"
                    />
                    <span v-else :key="`icon-${i}`" />
                </template>
                <span v-for="(tech, i) in value" :key="`level-${i}`" v-text="item.lifeformTechnologies[tech]" />
            </div>
        </template>
        <template #cell-lifeformTechsTier2="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology
                        v-if="tech != null"
                        :key="`icon-${i}`"
                        :technology="tech"
                        :disabled="item.lifeformTechnologies[tech] == 0"
                        size="40px"
                    />
                    <span v-else :key="`icon-${i}`" />
                </template>
                <span v-for="(tech, i) in value" :key="`level-${i}`" v-text="item.lifeformTechnologies[tech]" />
            </div>
        </template>
        <template #cell-lifeformTechsTier3="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology
                        v-if="tech != null"
                        :key="`icon-${i}`"
                        :technology="tech"
                        :disabled="item.lifeformTechnologies[tech] == 0"
                        size="40px"
                    />
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
    import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologySlots, LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '@stats/components/common/GridTable.vue';
    import { EmpireDataModule } from '@stats/data/EmpireDataModule';

    interface PlanetLifeformItem {
        planet: {
            name: string;
            coordinates: string;
        };
        lifeform: {
            type: LifeformType;
            level: number;
            levelExperience: number;
            totalLevelExperience: number;
            totalExperience: number;
        };
        buildings: LifeformBuildingType[];
        buildingLevels: Record<LifeformBuildingType, number>;
        lifeformTechsTier1: (LifeformTechnologyType | null)[];
        lifeformTechsTier2: (LifeformTechnologyType | null)[];
        lifeformTechsTier3: (LifeformTechnologyType | null)[];

        lifeformTechnologies: Record<LifeformTechnologyType, number>;
    }

    @Component({})
    export default class Overview extends Vue {

        private get columns(): GridTableColumn<keyof PlanetLifeformItem>[] {
            return [
                {
                    key: 'planet',
                    label: this.$i18n.$t.empire.lifeforms.planet,
                    size: '200px',
                },
                {
                    key: 'lifeform',
                    label: this.$i18n.$t.empire.lifeforms.lifeform,
                    size: 'auto',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'left-text',
                    class: 'left-text',
                },
                {
                    key: 'buildings',
                    label: this.$i18n.$t.empire.lifeforms.buildings,
                    size: '1fr',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
                },
                {
                    key: 'lifeformTechsTier1',
                    label: `${this.$i18n.$t.empire.lifeforms.technologies} (${this.$i18n.$t.empire.lifeforms.tier} 1)`,
                    size: '276px',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
                },
                {
                    key: 'lifeformTechsTier2',
                    label: `${this.$i18n.$t.empire.lifeforms.technologies} (${this.$i18n.$t.empire.lifeforms.tier} 2)`,
                    size: '276px',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
                },
                {
                    key: 'lifeformTechsTier3',
                    label: `${this.$i18n.$t.empire.lifeforms.technologies} (${this.$i18n.$t.empire.lifeforms.tier} 3)`,
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
                        levelExperience: Math.max(0, lfExp - getLifeformExperienceNeededForLevel(lfLevel)),
                        totalLevelExperience: getLifeformExperienceNeededForLevel(lfLevel + 1) - getLifeformExperienceNeededForLevel(lfLevel),
                        totalExperience: lfExp,
                    },
                    buildings: LifeformBuildingTypesByLifeform[planet.activeLifeform],
                    buildingLevels: planet.lifeformBuildings,
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

    .lifeform-table {
        max-height: 100%;

        &::v-deep {
            .left-text {
                text-align: left;
                justify-content: start;
            }

            .center-text {
                text-align: center;
                justify-content: center;
            }

            .building-levels {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                grid-template-rows: repeat(2, 1fr);
                gap: 4px;

                > span {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }

    .humans {
        color: #7ec000;
        font-weight: bold;
    }
    .rocktal {
        color: #df6642;
        font-weight: bold;
    }
    .mechas {
        color: #4b91e7;
        font-weight: bold;
    }
    .kaelesh {
        color: #9863e9;
        font-weight: bold;
    }
</style>