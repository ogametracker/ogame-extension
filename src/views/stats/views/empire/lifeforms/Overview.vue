<template>
    <grid-table :columns="columns" :items="items" class="lifeform-table" sticky="100%">
        <template #cell-planet="{ value }">
            <span v-text="value.name" />
            &nbsp;
            <span v-text="value.coordinates" />
        </template>

        <template #cell-lifeform="{ value }">
            <span v-text="$i18n.$t.ogame.lifeforms[value]" class="mr-2" />
            <o-lifeform :lifeform="value" size="48px" />
        </template>

        <template #cell-buildings="{ value, item }">
            <div class="building-levels">
                <span v-for="building in value" :key="building">
                    <o-lifeform-building :building="building" :disabled="item.buildingLevels[building] == 0" />
                    <span v-text="item.buildingLevels[building]" :class="{ fade: item.buildingLevels[building] == 0 }" />
                </span>
            </div>
        </template>

        <template #cell-lifeformTechsTier1="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology v-if="tech != null" :key="`icon-${i}`" :technology="tech" :disabled="item.lifeformTechnologies[tech] == 0" />
                    <span v-else :key="`icon-${i}`" />
                </template>
                <span
                    v-for="(tech, i) in value"
                    :key="`level-${i}`"
                    v-text="item.lifeformTechnologies[tech]"
                    :class="{ fade: item.lifeformTechnologies[tech] == 0 }"
                />
            </div>
        </template>
        <template #cell-lifeformTechsTier2="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology v-if="tech != null" :key="`icon-${i}`" :technology="tech" :disabled="item.lifeformTechnologies[tech] == 0" />
                    <span v-else :key="`icon-${i}`" />
                </template>
                <span
                    v-for="(tech, i) in value"
                    :key="`level-${i}`"
                    v-text="item.lifeformTechnologies[tech]"
                    :class="{ fade: item.lifeformTechnologies[tech] == 0 }"
                />
            </div>
        </template>
        <template #cell-lifeformTechsTier3="{ value, item }">
            <div class="lifeform-tech-table">
                <template v-for="(tech, i) in value">
                    <o-lifeform-technology v-if="tech != null" :key="`icon-${i}`" :technology="tech" :disabled="item.lifeformTechnologies[tech] == 0" />
                    <span v-else :key="`icon-${i}`" />
                </template>
                <span
                    v-for="(tech, i) in value"
                    :key="`level-${i}`"
                    v-text="item.lifeformTechnologies[tech]"
                    :class="{ fade: item.lifeformTechnologies[tech] == 0 }"
                />
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
        lifeform: LifeformType;
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
                    label: this.$i18n.$t.extension.empire.lifeforms.planet,
                    size: '200px',
                },
                {
                    key: 'lifeform',
                    label: this.$i18n.$t.extension.empire.lifeforms.lifeform,
                    size: '1fr',
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'left-text',
                    class: 'left-text',
                },
                {
                    key: 'buildings',
                    label: this.$i18n.$t.extension.empire.lifeforms.buildings,
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
                },
                {
                    key: 'lifeformTechsTier1',
                    label: `${this.$i18n.$t.extension.empire.lifeforms.technologies} (${this.$i18n.$t.extension.empire.lifeforms.tier} 1)`,
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
                },
                {
                    key: 'lifeformTechsTier2',
                    label: `${this.$i18n.$t.extension.empire.lifeforms.technologies} (${this.$i18n.$t.extension.empire.lifeforms.tier} 2)`,
                    style: {
                        'justify-items': 'start',
                    },
                    headerClass: 'center-text',
                },
                {
                    key: 'lifeformTechsTier3',
                    label: `${this.$i18n.$t.extension.empire.lifeforms.technologies} (${this.$i18n.$t.extension.empire.lifeforms.tier} 3)`,
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

            //TODO: don't show lifeform level+exp (shown in progress view), show total possible population (T1/T2/T3) instead (take food into account!)
            return planets.map<PlanetLifeformItem>(planet => {
                const lfExp = lifeformExperience[planet.activeLifeform] ?? 0;
                const lfLevel = getLifeformLevel(lfExp);

                const result: PlanetLifeformItem = {
                    planet: {
                        name: planet.name,
                        coordinates: this.formatCoordinates(planet.coordinates),
                    },
                    lifeform: planet.activeLifeform,
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
                grid-template-columns: repeat(12, 1fr);
                gap: 4px;

                > span {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
            }

            .fade {
                opacity: 0.1;
            }
        }
    }
</style>