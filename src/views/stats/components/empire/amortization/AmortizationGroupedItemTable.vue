<template>
    <div>
        <div v-for="item in groupedItems" :key="`${item.type}-${item.planetId || 0}`">
            <template v-if="'planetId' in item">
                <span />
                <span v-if="item.planetId > 0">
                    <span v-text="getPlanetName(item.planetId)" />
                    <span v-text="formatPlanetCoordinates(item.planetId)" />
                </span>
                <span v-else>
                    <span v-text="`${$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.planetId}`" />
                    <span v-text="`[-:-:${newColonyPosition}]`" />
                </span>
            </template>

            <div v-if="item.type == 'plasma-technology'">TODO:</div>
            <template v-else>
                <template v-if="item.astrophysicsLevels.length > 0">
                    <o-research :research="ResearchType.astrophysics" size="36px" />
                    <span class="name-and-level">
                        <span v-text="buildableTranslations[ResearchType.astrophysics]" />
                        <span v-if="item.astrophysicsLevels.length == 1" v-text="item.astrophysicsLevels[0]" />
                        <span v-else v-text="`${item.astrophysicsLevels[0]} - ${item.astrophysicsLevels[item.astrophysicsLevels.length - 1]}`" />
                    </span>
                </template>

                <template v-for="lfBuilding in LifeformBuildingTypes">
                    <template v-if="item.lifeformBuildings[lfBuilding].length > 0">
                        <o-lifeform-building :building="lfBuilding" size="36px" :key="`image-${lfBuilding}`" />
                        <span class="name-and-level" :key="`level-${lfBuilding}`">
                            <span v-text="buildableTranslations[lfBuilding]" />
                            <span v-if="item.lifeformBuildings[lfBuilding].length == 1" v-text="item.lifeformBuildings[lfBuilding][0]" />
                            <span
                                v-else
                                v-text="
                                    `${item.lifeformBuildings[lfBuilding][0]} - ${
                                        item.lifeformBuildings[lfBuilding][item.lifeformBuildings[lfBuilding].length - 1]
                                    }`
                                "
                            />
                        </span>
                    </template>
                </template>

                <template v-for="mine in mineBuildingTypes">
                    <template v-if="item.mines[mine].length > 0">
                        <o-building :building="mine" size="36px" :key="`image-${mine}`" />
                        <span class="name-and-level" :key="`level-${mine}`">
                            <span v-text="buildableTranslations[mine]" />
                            <span v-if="item.mines[mine].length == 1" v-text="item.mines[mine][0]" />
                            <span v-else v-text="`${item.mines[mine][0]} - ${item.mines[mine][item.mines[mine].length - 1]}`" />
                        </span>
                    </template>
                </template>

                <template v-for="lfTech in LifeformTechnologyTypes">
                    <template v-if="item.lifeformTechnologies[lfTech].length > 0">
                        <o-lifeform-technology :technology="lfTech" size="36px" :key="`image-${lfTech}`" />
                        <span class="name-and-level" :key="`level-${lfTech}`">
                            <span v-text="buildableTranslations[lfTech]" />
                            <span v-if="item.lifeformTechnologies[lfTech].length == 1" v-text="item.lifeformTechnologies[lfTech][0]" />
                            <span
                                v-else
                                v-text="
                                    `${item.lifeformTechnologies[lfTech][0]} - ${
                                        item.lifeformTechnologies[lfTech][item.lifeformTechnologies[lfTech].length - 1]
                                    }`
                                "
                            />
                        </span>
                    </template>
                </template>
            </template>
        </div>

        <button v-text="'LOCA: Show original table'" @click="$emit('close')" />
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GroupedAmortizationItem } from '@stats/models/empire/amortization';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { MineBuildingType } from '@/shared/models/empire/amortization/models';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { LifeformBuildingTypes } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologyTypes } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';

    @Component({})
    export default class AmortizationGroupedItemTable extends Vue {
        @Prop({ required: true, type: Array as PropType<GroupedAmortizationItem[]> })
        private groupedItems!: GroupedAmortizationItem[];

        @Prop({ required: true, type: Number })
        private newColonyPosition!: number;

        private readonly ResearchType = ResearchType;
        private readonly mineBuildingTypes: MineBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
        private readonly LifeformBuildingTypes = LifeformBuildingTypes;
        private readonly LifeformTechnologyTypes = LifeformTechnologyTypes;


        private getPlanetName(id: number): string {
            return EmpireDataModule.empire.planets[id]?.name
                ?? `${this.$i18n.$t.empire.amortization.saveLoad.abandonedPlanet} (${id})`;
        }
        private formatPlanetCoordinates(id: number): string {
            const coordinates = EmpireDataModule.empire.planets[id]?.coordinates as Coordinates | undefined;
            if (coordinates == null) {
                return '';
            }

            return this.formatCoordinates(coordinates);
        }

        private formatCoordinates(coordinates: Coordinates): string {
            return `[${coordinates.galaxy}:${coordinates.system}:${coordinates.position}]`;
        }
    }
</script>