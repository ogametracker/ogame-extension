<template>
    <div class="amortization">
        <div class="amortization-container">
            <div class="amortization-settings" :style="{ overflow: showSettings ? 'auto' : null }">
                <div class="amortization-settings-header">
                    <button @click="toggleSettings()">
                        <span class="mdi mdi-cogs" />
                        <span class="mdi mdi-menu-down" v-if="!showSettings" />
                        <span class="mdi mdi-menu-up" v-else />

                        <span v-if="!showSettings" v-text="$i18n.$t.empire.amortization.settings.header" />
                        <span v-else v-text="$i18n.$t.empire.amortization.settings.applyAndClose" />
                    </button>

                    <div class="generating-count">
                        <span
                            v-if="generatingItemCount != null"
                            v-text="`${$i18n.$t.empire.amortization.info.generatingItems}: ${generatingItemCount.count}/${generatingItemCount.total}`"
                        />
                        <button
                            :disabled="generatingItemCount != null || items.length == 0 || showSettings"
                            class="mr-1"
                            v-text="'LOCA: save calculated amortization results (will overwrite existing save)'"
                            @click="saveItems()"
                        />
                        <button
                            :disabled="generatingItemCount != null || !hasSavedAmortizationItems"
                            v-text="'LOCA: load calculated amortization results'"
                            @click="loadItems()"
                        />
                    </div>

                    <floating-menu v-model="showInfoMenu" left>
                        <template #activator>
                            <button @click="showInfoMenu = !showInfoMenu">
                                <span class="mdi mdi-help" />
                            </button>
                        </template>

                        <div class="infos">
                            <span v-text="$i18n.$t.empire.amortization.info.slowCalculation" />
                            <span v-text="$i18n.$t.empire.amortization.info.ctrlClick" />
                        </div>
                    </floating-menu>

                    <floating-menu v-model="showSettingsMenu" left>
                        <template #activator>
                            <button @click="showSettingsMenu = !showSettingsMenu">
                                <span class="mdi mdi-cog" />
                            </button>
                        </template>

                        <show-converted-resources-in-cells-settings>
                            <div class="msu-settings-amortization-info">
                                <span class="mdi mdi-alert" />
                                <span v-text="$i18n.$t.settings.showConvertedUnitsInTables.infoAmortization" />
                            </div>
                        </show-converted-resources-in-cells-settings>
                    </floating-menu>
                </div>

                <div v-show="showSettings" class="amortization-settings-container">
                    <div class="flex-settings">
                        <div>
                            <h3 v-text="$i18n.$t.empire.amortization.settings.playerSettings.header" />
                            <amortization-player-settings-inputs v-model="playerSettings" />
                        </div>

                        <div>
                            <h3 v-text="$i18n.$t.empire.amortization.settings.astrophysicsSettings.header" />
                            <div class="astrophysics-settings">
                                <checkbox
                                    v-model="astrophysicsSettings.show"
                                    :label="$i18n.$t.empire.amortization.settings.astrophysicsSettings.showAstrophysics"
                                />

                                <amortization-planet-settings-inputs v-model="astrophysicsSettings.planet" />
                            </div>
                        </div>

                        <div>
                            <h3 v-text="$i18n.$t.empire.amortization.settings.plasmatechSettings.header" />
                            <div class="plasma-tech-settings">
                                <checkbox v-model="showPlasmaTechnology" :label="$i18n.$t.empire.amortization.settings.plasmatechSettings.showPlasmatech" />
                            </div>
                        </div>

                        <div>
                            <h3 v-text="$i18n.$t.empire.amortization.settings.planetSettings.header" />
                            <div style="display: flex; gap: 8px; flex-wrap: wrap">
                                <amortization-planet-settings-inputs
                                    v-for="planetSetting in planetSettingsSorted"
                                    :key="planetSetting.id"
                                    v-model="planetSettings[planetSetting.id]"
                                    toggleable
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="amortization-table" v-if="!showSettings">
                <grid-table
                    :items="items"
                    :columns="columns"
                    :footerItems="footerItems"
                    sticky="100%"
                    sticky-footer
                    :cellClassProvider="cellClassProvider"
                    row-borders
                >
                    <template #header-checkbox>
                        <checkbox
                            :value="selectedItemIndizes.length == items.length"
                            @input="toggleItemSelection()"
                            check-color="rgb(var(--color))"
                            color="white"
                        />
                    </template>

                    <template #header-cost>
                        <div class="cost-grid">
                            <span v-text="$i18n.$t.empire.amortization.table.cost" style="grid-column: 2" />
                            <o-resource resource="metal" style="grid-column: 1" />
                            <o-resource resource="crystal" />
                            <o-resource resource="deuterium" />
                        </div>
                    </template>

                    <template #cell-checkbox="{ index }">
                        <checkbox :value="selectedItemIndizes.includes(index)" @input-extended="toggleItemSelection(index, $event.ctrl)" />
                    </template>
                    <template #cell-what="{ item, index }">
                        <div
                            v-if="item.type == 'mine' || item.type == 'lifeform-building' || item.type == 'lifeform-technology'"
                            class="what-cell"
                            :class="`what-cell--${item.type}`"
                        >
                            <span v-if="item.planetId > 0" class="planet">
                                <span v-text="empire.planets[item.planetId].name" />
                                <span v-text="formatCoordinates(empire.planets[item.planetId].coordinates)" />
                            </span>
                            <span v-else class="planet">
                                <span v-text="`${$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.planetId}`" />
                                <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                            </span>

                            <div class="levels">
                                <template v-for="(additionalLifeformBuilding, i) in item.additionalLifeformBuildings">
                                    <o-lifeform-building :key="`icon-${i}`" :building="additionalLifeformBuilding.building" size="36px" />
                                    <span class="name-and-level" :key="`name-level-${i}`">
                                        <span v-text="buildableTranslations[additionalLifeformBuilding.building]" />
                                        <span
                                            v-if="additionalLifeformBuilding.levels.from != additionalLifeformBuilding.levels.to"
                                            v-text="`${additionalLifeformBuilding.levels.from} - ${additionalLifeformBuilding.levels.to}`"
                                        />
                                        <span v-else v-text="additionalLifeformBuilding.levels.from" />
                                    </span>
                                </template>

                                <template v-if="item.type == 'mine'">
                                    <o-building :building="item.mine" size="36px" />
                                    <span class="name-and-level">
                                        <span v-text="buildableTranslations[item.mine]" />
                                        <span v-text="item.level" />
                                    </span>
                                </template>
                                <template v-else-if="item.type == 'lifeform-building'">
                                    <o-lifeform-building :building="item.building" size="36px" />
                                    <span class="name-and-level">
                                        <span v-text="buildableTranslations[item.building]" />
                                        <span v-text="item.level" />
                                    </span>
                                </template>
                                <template v-else-if="item.type == 'lifeform-technology'">
                                    <o-lifeform-technology :technology="item.technology" size="36px" />
                                    <span class="name-and-level">
                                        <span v-text="buildableTranslations[item.technology]" />
                                        <span v-text="item.level" />
                                    </span>
                                </template>
                                <span v-else v-text="'??? contact developer'" />
                            </div>
                        </div>
                        <div v-else-if="item.type == 'plasma-technology'" class="what-cell what-cell--plasma-technology">
                            <div
                                v-for="(additionalLifeformStuffGroup, i) in getAdditionalLifeformStuffGroups(item.additionalLifeformStuff)"
                                :key="i"
                                style="display: contents"
                            >
                                <template v-if="additionalLifeformStuffGroup.planetIds.size > 1">
                                    <span
                                        class="mdi expand-amortization-group"
                                        :class="showAmotizationGroup[`item-${index}_group-${i}`] ? 'mdi-menu-up' : 'mdi-menu-down'"
                                        @click="toggleAmortizationGroup(`item-${index}_group-${i}`)"
                                    />

                                    <o-lifeform-building
                                        v-if="additionalLifeformStuffGroup.building != null"
                                        :building="additionalLifeformStuffGroup.building"
                                        size="36px"
                                    />
                                    <o-lifeform-technology v-else :technology="additionalLifeformStuffGroup.technology" size="36px" />

                                    <span class="name-and-level">
                                        <i v-text="buildableTranslations[additionalLifeformStuffGroup.building || additionalLifeformStuffGroup.technology]" />
                                        <i
                                            v-text="
                                                $i18n.$t.empire.amortization.table.levelsOnPlanets(
                                                    additionalLifeformStuffGroup.totalLevels,
                                                    additionalLifeformStuffGroup.planetIds.size
                                                )
                                            "
                                        />
                                    </span>
                                </template>

                                <div
                                    :style="{
                                        display:
                                            additionalLifeformStuffGroup.planetIds.size == 1 || showAmotizationGroup[`item-${index}_group-${i}`]
                                                ? 'contents'
                                                : 'none',
                                    }"
                                >
                                    <div v-for="(additionalLifeformStuff, i) in additionalLifeformStuffGroup.items" :key="i" style="display: contents">
                                        <span v-if="additionalLifeformStuff.planetId > 0" class="planet">
                                            <span v-text="empire.planets[additionalLifeformStuff.planetId].name" />
                                            <span v-text="formatCoordinates(empire.planets[additionalLifeformStuff.planetId].coordinates)" />
                                        </span>
                                        <span v-else class="planet">
                                            <span
                                                v-text="
                                                    `${
                                                        $i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony
                                                    } ${-additionalLifeformStuff.planetId}`
                                                "
                                            />
                                            <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                                        </span>

                                        <o-lifeform-building
                                            v-if="additionalLifeformStuff.building != null"
                                            :building="additionalLifeformStuff.building"
                                            size="36px"
                                        />
                                        <o-lifeform-technology v-else :technology="additionalLifeformStuff.technology" size="36px" />

                                        <span class="name-and-level">
                                            <span v-text="buildableTranslations[additionalLifeformStuff.building || additionalLifeformStuff.technology]" />
                                            <span
                                                v-if="additionalLifeformStuff.levels.from != additionalLifeformStuff.levels.to"
                                                v-text="`${additionalLifeformStuff.levels.from} - ${additionalLifeformStuff.levels.to}`"
                                            />
                                            <span v-else v-text="additionalLifeformStuff.levels.from" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <span />
                            <o-research :research="ResearchType.plasmaTechnology" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations[item.type]" />
                                <span v-text="item.level" />
                            </span>
                        </div>
                        <div v-else-if="item.type == 'astrophysics-and-colony'" class="what-cell what-cell--colony">
                            <span style="display: contents">
                                <o-research :research="ResearchType.astrophysics" :disabled="item.levels.length == 0" size="36px" style="grid-column: 2" />
                                <span class="name-and-level">
                                    <span v-text="buildableTranslations['astrophysics-colony']" />

                                    <span v-if="item.levels.length == 0" v-text="'-'" />
                                    <span v-else-if="item.levels.length == 1" v-text="item.levels[0]" />
                                    <span v-else v-text="`${item.levels[0]} + ${item.levels[1]}`" />
                                </span>
                            </span>

                            <span class="planet" style="align-self: start; grid-row: 2">
                                <span v-text="`${$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.newPlanetId}`" />
                                <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                            </span>

                            <span class="colony-mines" style="display: contents">
                                <template v-for="building in mineBuildingTypes">
                                    <template v-if="item.builtLevels.mines[building] > 0">
                                        <o-building :key="`${building}-icon`" :building="building" size="36px" style="grid-column: 2" />
                                        <span :key="`${building}-name-level`" class="name-and-level">
                                            <span v-text="buildableTranslations[building]" />
                                            <span v-text="`0 - ${item.builtLevels.mines[building]}`" />
                                        </span>
                                    </template>
                                </template>
                            </span>
                            <span class="colony-lifeform-buildings" style="display: contents">
                                <template v-for="building in applicableLifeformBuildingTypes">
                                    <template v-if="item.builtLevels.lifeformBuildings[building] > 0">
                                        <o-lifeform-building :key="`${building}-icon`" :building="building" size="36px" style="grid-column: 2" />
                                        <span :key="`${building}-name-level`" class="name-and-level">
                                            <span v-text="buildableTranslations[building]" />
                                            <span v-text="`0 - ${item.builtLevels.lifeformBuildings[building]}`" />
                                        </span>
                                    </template>
                                </template>
                            </span>
                            <span class="colony-lifeform-technologies" style="display: contents">
                                <template v-for="tech in applicableLifeformTechnologyTypes">
                                    <template v-if="item.builtLevels.lifeformTechnologies[tech] > 0">
                                        <o-lifeform-technology :key="`${tech}-icon`" :technology="tech" size="36px" style="grid-column: 2" />
                                        <span :key="`${tech}-name-level`" class="name-and-level">
                                            <span v-text="buildableTranslations[tech]" />
                                            <span v-text="`0 - ${item.builtLevels.lifeformTechnologies[tech]}`" />
                                        </span>
                                    </template>
                                </template>
                            </span>
                        </div>
                        <div v-else v-text="'??? contact developer'" />
                    </template>

                    <template #cell-cost="{ value }">
                        <div class="cost-grid">
                            <span v-text="$i18n.$n(value.metal)" :class="{ zero: value.metal == 0 }" />
                            <span v-text="$i18n.$n(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                            <span v-text="$i18n.$n(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
                        </div>
                    </template>
                    <template #cell-costConverted="{ value }">
                        <span v-text="$i18n.$n(value)" />
                    </template>

                    <template #cell-productionDelta="{ value }">
                        <span v-text="$i18n.$n(value.metal + value.crystal + value.deuterium, numberFormat)" />
                    </template>
                    <template #cell-productionDeltaConverted="{ value }">
                        <span v-text="$i18n.$n(value, numberFormat)" />
                    </template>

                    <template #cell-timeInHours="{ value }">
                        <span v-text="$i18n.$timespan(value * 60 * 60)" />
                    </template>

                    <template #footer-cost="{ value }">
                        <div class="cost-grid">
                            <span v-text="$i18n.$n(value.metal)" :class="{ zero: value.metal == 0 }" />
                            <span v-text="$i18n.$n(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                            <span v-text="$i18n.$n(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
                        </div>
                    </template>
                    <template #footer-costConverted="{ value }">
                        <span v-text="$i18n.$n(value)" :class="{ zero: value == 0 }" />
                    </template>
                    <template #footer-productionDelta />
                    <template #footer-productionDeltaConverted />
                    <template #footer-timeInHours />
                </grid-table>

                <div style="display: flex; gap: 8px" v-if="generator != null">
                    <button
                        v-for="count in [25, 50, 100, 500]"
                        :key="count"
                        @click="insertNextAmortizationItems(count)"
                        :disabled="generatingItemCount != null"
                    >
                        <span class="mdi mdi-plus" />
                        <span v-text="$i18n.$t.empire.amortization.generateItems($i18n.$n(count))" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { BuildingType, BuildingTypes } from '@/shared/models/ogame/buildings/BuildingType';
    import { AllianceClass } from '@/shared/models/ogame/classes/AllianceClass';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import { addCost, Cost } from '@/shared/models/ogame/common/Cost';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { Component, Vue } from 'vue-property-decorator';
    import AmortizationPlanetSettingsInputs from '../../components/empire/amortization/AmortizationPlanetSettingsInputs.vue';
    import AmortizationPlayerSettingsInputs from '../../components/empire/amortization/AmortizationPlayerSettingsInputs.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { LifeformBuildingType, LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologyType, LifeformTechnologyTypes, LifeformTechnologyTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { _throw } from '@/shared/utils/_throw';
    import { getAverageTemperature } from '@/shared/models/ogame/resource-production/getAverageTemperature';
    import { AmortizationPlanetSettings } from '@/shared/models/empire/amortization/AmortizationPlanetSettings';
    import { AmortizationPlayerSettings } from '@/shared/models/empire/amortization/AmortizationPlayerSettings';
    import { AmortizationAstrophysicsSettings } from '@/shared/models/empire/amortization/AmortizationAstrophysicsSettings';
    import { AmortizationItem, BaseAmortizationItem, LifeformBuildingLevels, LifeformTechnologyLevels, MineBuildingType } from '@/shared/models/empire/amortization/models';
    import { AmortizationItemGenerator } from '@/shared/models/empire/amortization/AmortizationItemGenerator';
    import { LifeformTechnologyBonusLifeformBuildings, ResourceProductionBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { delay } from '@/shared/utils/delay';
    import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';
    import { UniverseSpecificSettingsDataModule } from '../../data/UniverseSpecificSettingsDataModule';

    interface AdditionalLifeformStuffGroup {
        items: (LifeformBuildingLevels | LifeformTechnologyLevels)[];
        totalLevels: number;
        planetIds: Set<number>;
        building?: LifeformBuildingType;
        technology?: LifeformTechnologyType;
    }

    @Component({
        components: {
            AmortizationPlanetSettingsInputs,
            AmortizationPlayerSettingsInputs,
            ShowConvertedResourcesInCellsSettings,
        },
    })
    export default class Amortization extends Vue {
        private readonly numberFormat: Intl.NumberFormatOptions = {
            maximumFractionDigits: 0,
        };

        private showSettingsMenu = false;
        private showInfoMenu = false;

        private readonly BuildingType = BuildingType;
        private readonly ResearchType = ResearchType;
        private readonly mineBuildingTypes: MineBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];

        private readonly applicableBuildingTypes = [
            ...ResourceProductionBonusLifeformBuildings,
            ...LifeformTechnologyBonusLifeformBuildings,
        ].map(b => b.type);

        private get applicableLifeformBuildingTypes(): LifeformBuildingType[] {
            const lfBuildings = LifeformBuildingTypesByLifeform[this.astrophysicsSettings.planet.lifeform];
            return lfBuildings.filter(building => this.applicableBuildingTypes.includes(building));
        }
        private readonly applicableLifeformTechnologyTypes = LifeformTechnologyTypes;

        private get hasSavedAmortizationItems() {
            const items = UniverseSpecificSettingsDataModule.settings.savedAmortizationItems ?? [];
            return items.length > 0;
        }

        private async saveItems() {
            await UniverseSpecificSettingsDataModule.updateSettings({
                ...UniverseSpecificSettingsDataModule.settings,
                savedAmortizationItems: this.items,
            });
        }

        private loadItems() {
            this.showSettings = false;
            this.generator = null;

            const items = UniverseSpecificSettingsDataModule.settings.savedAmortizationItems ?? [];
            this.amortizationItems = [...items];
        }

        /**********************************/
        /* START amortization calculation */
        /**********************************/
        private playerSettings: AmortizationPlayerSettings = {
            officers: {
                admiral: false,
                commander: false,
                engineer: false,
                geologist: false,
                technocrat: false,
            },
            playerClass: PlayerClass.none,
            allianceClass: AllianceClass.none,
            levelPlasmaTechnology: 0,
            levelAstrophysics: 0,
            numberOfUnusedRaidColonySlots: 0,
        };
        private planetSettings: Record<number, AmortizationPlanetSettings> = {};
        private astrophysicsSettings: AmortizationAstrophysicsSettings = {
            show: true,
            planet: {
                show: true,
                ignore: false,
                id: -1,
                name: '',
                position: 0,
                maxTemperature: 0,
                activeItems: [],
                crawlers: {
                    enabled: false,
                    overload: false,
                    count: 0,
                    max: false,
                },
                lifeform: LifeformType.rocktal,
                activeLifeformTechnologies: [...LifeformTechnologyTypesByLifeform[LifeformType.rocktal]],
            },
        };
        private showPlasmaTechnology = true;

        private showSettings = true;

        private readonly empire = EmpireDataModule.empire;
        private generator: AmortizationItemGenerator | null = null;
        private amortizationItems: AmortizationItem[] = [];
        private selectedItemIndizes: number[] = [];

        private generatingItemCount: { total: number; count: number } | null = null;

        private get planetSettingsSorted(): AmortizationPlanetSettings[] {
            return Object.values(this.planetSettings)
                .sort((a, b) => EmpireDataModule.empire.planetOrder.indexOf(a.id) - EmpireDataModule.empire.planetOrder.indexOf(b.id));
        }

        private mounted() {
            this.initSettings();
        }

        private toggleSettings() {
            if (!this.showSettings) {
                this.stopGenerating = true;
                this.showSettings = true;
            }
            else {
                this.stopGenerating = false;
                this.showSettings = false;
                this.initItems();
                this.selectedItemIndizes = [];

                void this.insertNextAmortizationItems(25);
            }
        }

        private clone<T>(data: T): T {
            return JSON.parse(JSON.stringify(data)) as T;
        }

        private initItems(): void {
            this.generator = new AmortizationItemGenerator({
                settings: {
                    player: this.clone(this.playerSettings),
                    planets: this.clone(this.planetSettings),
                    astrophysics: this.clone(this.astrophysicsSettings),
                    showPlasmaTechnology: this.clone(this.showPlasmaTechnology),
                },
                lifeformExperience: this.clone(this.empire.lifeformExperience),
                serverSettings: this.clone(ServerSettingsDataModule.serverSettings),
                getMsuOrDsu,
            });
            this.amortizationItems = [];
        }

        private stopGenerating = false;
        private async insertNextAmortizationItems(count: number): Promise<void> {
            if (this.generatingItemCount != null) {
                return;
            }

            this.generatingItemCount = { total: count, count: 0 };
            await this.$nextTick();

            while (count > 0) {
                const next = this.generator?.nextItem();

                if (next == null || this.stopGenerating) {
                    break;
                }

                this.amortizationItems.push(next);
                count--;

                this.generatingItemCount.count++;
                await this.$nextTick();
                await delay(10);
            }

            this.generatingItemCount = null;
        }

        private initSettings() {
            const empire = this.empire;

            this.playerSettings = {
                officers: { ...empire.officers },
                playerClass: empire.playerClass,
                allianceClass: empire.allianceClass,
                levelPlasmaTechnology: empire.research[ResearchType.plasmaTechnology],
                levelAstrophysics: empire.research[ResearchType.astrophysics],
                numberOfUnusedRaidColonySlots: 0,
            };

            this.planetSettings = (Object.values(empire.planets).filter(p => !p.isMoon) as PlanetData[])
                .reduce((acc, planet) => {
                    const settings: AmortizationPlanetSettings = {
                        show: true,
                        ignore: false,
                        id: planet.id,
                        name: planet.name,
                        maxTemperature: planet.maxTemperature,
                        coordinates: planet.coordinates,
                        position: planet.coordinates.position,
                        mines: {
                            metalMine: planet.buildings[BuildingType.metalMine],
                            crystalMine: planet.buildings[BuildingType.crystalMine],
                            deuteriumSynthesizer: planet.buildings[BuildingType.deuteriumSynthesizer],
                        },
                        activeItems: Object.keys(planet.activeItems) as ItemHash[],
                        crawlers: {
                            enabled: true,
                            overload: empire.playerClass == PlayerClass.collector && ServerSettingsDataModule.serverSettings.playerClasses.collector.crawlers.isOverloadEnabled,
                            count: planet.ships[ShipType.crawler],
                            max: empire.playerClass == PlayerClass.collector,
                        },
                        lifeform: planet.activeLifeform,
                        activeLifeformTechnologies: [...planet.activeLifeformTechnologies],
                        lifeformTechnologyLevels: { ...planet.lifeformTechnologies },
                        lifeformBuildingLevels: { ...planet.lifeformBuildings },
                    };
                    acc[planet.id] = settings;
                    return acc;
                }, {} as Record<number, AmortizationPlanetSettings>);

            this.astrophysicsSettings = {
                show: true,
                planet: {
                    show: true,
                    ignore: false,
                    id: -1,
                    name: this.$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony,
                    position: 8,
                    maxTemperature: getAverageTemperature(8),
                    activeItems: [],
                    crawlers: {
                        enabled: empire.playerClass == PlayerClass.collector,
                        overload: empire.playerClass == PlayerClass.collector && ServerSettingsDataModule.serverSettings.playerClasses.collector.crawlers.isOverloadEnabled,
                        count: 0,
                        max: empire.playerClass == PlayerClass.collector,
                    },
                    lifeform: LifeformType.rocktal,
                    activeLifeformTechnologies: [...LifeformTechnologyTypesByLifeform[LifeformType.rocktal]],
                },
            };
        }
        /**********************************/
        /*  END amortization calculation  */
        /**********************************/



        private get columns(): GridTableColumn<keyof BaseAmortizationItem | 'what' | 'checkbox'>[] {
            const showConversion = SettingsDataModule.settings.showCellsWithConvertedResourceUnits;

            const result: GridTableColumn<keyof BaseAmortizationItem | 'what' | 'checkbox'>[] = [
                { key: 'checkbox', size: 'auto' },
                { key: 'what', size: 'auto' },
                { key: 'cost', size: '3fr' },
            ];

            if (showConversion) {
                result.push({
                    key: 'costConverted',
                    label: `${this.$i18n.$t.empire.amortization.table.cost} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.common.msu : this.$i18n.$t.common.dsu})`,
                    size: '1fr',
                });
            }

            result.push({
                key: 'productionDelta',
                label: this.$i18n.$t.empire.amortization.table.productionPlus,
                size: '1fr',
            });

            if (showConversion) {
                result.push({
                    key: 'productionDeltaConverted',
                    label: `${this.$i18n.$t.empire.amortization.table.productionPlus} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.common.msu : this.$i18n.$t.common.dsu})`,
                    size: '1fr',
                });
            }

            result.push({
                key: 'timeInHours',
                label: this.$i18n.$t.empire.amortization.table.amortizationTime,
                size: '1fr',
            });

            return result;
        }

        private get items(): AmortizationItem[] {
            return this.amortizationItems;
        }

        private get footerItems(): BaseAmortizationItem[] {
            const zeroCost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            const cost = this.selectedItemIndizes
                .map(i => this.amortizationItems[i])
                .reduce<Cost>((total, cur) => addCost(total, cur.cost), zeroCost);

            return [{
                cost,
                costConverted: getMsuOrDsu(cost),
                productionDelta: zeroCost,
                productionDeltaConverted: 0,
                timeInHours: 0,
            }];
        }

        private formatCoordinates(coordinates: Coordinates): string {
            return `[${coordinates.galaxy}:${coordinates.system}:${coordinates.position}]`;
        }

        private get buildableTranslations() {
            const translations: Record<any, string> = {
                'plasma-technology': this.$i18n.$t.research[ResearchType.plasmaTechnology],
                'astrophysics-colony': this.$i18n.$t.research[ResearchType.astrophysics],
            };

            BuildingTypes.forEach(building => translations[building] = this.$i18n.$t.buildings[building]);
            LifeformBuildingTypes.forEach(building => translations[building] = this.$i18n.$t.lifeformBuildings[building]);
            LifeformTechnologyTypes.forEach(tech => translations[tech] = this.$i18n.$t.lifeformTechnologies[tech]);

            return translations;
        }

        private cellClassProvider(_: any, item: AmortizationItem): string {
            switch (item.type) {
                case 'astrophysics-and-colony': return 'astrophysics-cell';
                case 'plasma-technology': return 'plasmatech-cell';

                default: return '';
            }
        }

        private toggleItemSelection(index?: number, selectAllUntilIndex?: boolean) {
            if (index == null) {
                if (this.selectedItemIndizes.length == this.items.length) {
                    this.selectedItemIndizes = [];
                }
                else {
                    this.selectedItemIndizes = this.items.map((_, i) => i);
                }
                return;
            }

            const select = !this.selectedItemIndizes.includes(index);
            const min = selectAllUntilIndex ? 0 : index;
            const max = index;
            for (let index = min; index <= max; index++) {
                const selected = this.selectedItemIndizes.includes(index);
                if (!select && selected) {
                    this.selectedItemIndizes = this.selectedItemIndizes.filter(i => i != index);
                }
                else if (select && !selected) {
                    this.selectedItemIndizes.push(index);
                }
            }
        }

        private getAdditionalLifeformStuffGroups(additionalLifeformStuff: (LifeformBuildingLevels | LifeformTechnologyLevels)[]): AdditionalLifeformStuffGroup[] {
            const groups: AdditionalLifeformStuffGroup[] = [];
            const groupsByType: Record<number, AdditionalLifeformStuffGroup> = {};

            additionalLifeformStuff.forEach(stuff => {
                const type = 'building' in stuff ? stuff.building : stuff.technology;

                let group = groupsByType[type];
                if (group == null) {
                    group = groupsByType[type] = {
                        items: [],
                        planetIds: new Set<number>(),
                        building: 'building' in stuff ? stuff.building : undefined,
                        technology: 'technology' in stuff ? stuff.technology : undefined,
                        totalLevels: 0,
                    };
                    groups.push(group);
                }

                group.planetIds.add(stuff.planetId);
                group.items.push(stuff);
                group.totalLevels += stuff.levels.to - stuff.levels.from + 1;
            });

            return groups;
        }

        private readonly showAmotizationGroup: Partial<Record<string, boolean>> = {};

        private toggleAmortizationGroup(groupName: string) {
            if (this.showAmotizationGroup[groupName] == null) {
                this.$set(this.showAmotizationGroup, groupName, true);
            }
            else {
                this.showAmotizationGroup[groupName] = !this.showAmotizationGroup[groupName];
            }
        }
    }
</script>
<style lang="scss" scoped>
    .cost-grid {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(3, 1fr);
        justify-items: end;
    }

    .what-cell {
        display: grid;
        grid-template-columns: 150px 1fr;
        justify-items: center;
        align-items: center;
        column-gap: 8px;
        width: 100%;

        .planet {
            display: grid;
            justify-self: end;
        }

        &--colony .planet {
            grid-row: 1 / span 4;
        }

        &--plasma-technology,
        &--colony {
            grid-template-columns: 150px auto 1fr;
        }

        .levels {
            display: grid;
            grid-template-columns: auto 1fr;
            width: 100%;
            column-gap: 8px;
            row-gap: 4px;
            align-items: center;
            line-height: 1.1;
        }
    }

    .name-and-level {
        display: grid;
        text-align: left;
        justify-self: start;
    }

    .new-colony-mines {
        display: grid;
        grid-template-columns: repeat(3, auto);
        column-gap: 16px;
        align-items: center;
        justify-items: center;

        > * {
            display: grid;
            grid-template-columns: auto auto;
            column-gap: 8px;
            justify-items: start;
            align-items: center;
        }
    }

    .amortization {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;

        &-container {
            display: grid;
            grid-template-rows: auto 1fr;
            max-height: 100%;
            overflow: auto;
        }

        &-table {
            overflow: auto;
            min-height: 300px;
            display: grid;
            grid-template-rows: 1fr auto;
            gap: 8px;

            &::v-deep {
                .astrophysics-cell,
                .astrophysics-cell ~ .grid-table-cell {
                    background-color: rgba(64, 129, 152, 0.25) !important;
                }

                .plasmatech-cell,
                .plasmatech-cell ~ .grid-table-cell {
                    background-color: rgba(123, 255, 95, 0.1) !important;
                }
            }
        }

        &-settings {
            max-height: 100%;
            display: grid;
            grid-template-rows: auto 1fr;
            gap: 4px;
            justify-items: start;

            > button {
                margin-bottom: 4px;
            }
        }
    }

    .flex-settings {
        display: flex;
        flex-wrap: wrap;
        column-gap: 48px;
    }

    .zero {
        opacity: 0.4;
    }

    .amortization-settings-container {
        border: 1px solid rgba(var(--color), 0.25);
        padding: 12px;
        overflow: auto;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: rgba(var(--color), 0.05);
    }

    .amortization-settings-header {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: 8px;
        width: 100%;
    }

    .msu-settings-amortization-info {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 2px;
        border-top: 1px solid rgba(var(--color), 0.5);

        .mdi {
            font-size: 1.333rem;
        }
    }

    .expand-amortization-group {
        justify-self: end;
        font-size: 24px;
        cursor: pointer;
    }

    .infos {
        display: flex;
        flex-direction: column;
        gap: 8px;

        & > span {
            width: 450px;
            border: 1px solid rgba(var(--color), 0.5);
            border-radius: 4px;
            background: rgba(var(--color), 0.1);
            padding: 8px 16px;
        }
    }

    .generating-count {
        display: flex;
        align-items: center;
    }
</style>