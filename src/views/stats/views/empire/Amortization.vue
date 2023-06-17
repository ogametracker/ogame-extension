<template>
    <div class="amortization">
        <div class="amortization-container">
            <div class="amortization-settings" :style="{ overflow: showSettings ? 'auto' : null }">
                <div class="amortization-settings-header">
                    <button @click="toggleSettings()">
                        <span class="mdi mdi-cogs" />
                        <span class="mdi mdi-menu-down" v-if="!showSettings" />
                        <span class="mdi mdi-menu-up" v-else />

                        <span v-if="!showSettings" v-text="$i18n.$t.extension.empire.amortization.settings.header" />
                        <span v-else v-text="$i18n.$t.extension.empire.amortization.settings.applyAndClose" />
                    </button>

                    <div class="generating-count">
                        <span
                            v-if="generatingItemCount != null"
                            v-text="`${$i18n.$t.extension.empire.amortization.info.generatingItems}: ${generatingItemCount.count}/${generatingItemCount.total}`"
                        />
                        <template v-if="saveStateDate == null">
                            <button
                                v-if="items.length > 0"
                                :disabled="generatingItemCount != null || items.length == 0 || showSettings"
                                class="mr-1"
                                v-text="$i18n.$t.extension.empire.amortization.saveLoad.saveButton"
                                @click="saveItems()"
                            />
                            <button
                                v-if="savedAmortization != null"
                                :disabled="generatingItemCount != null"
                                v-text="$i18n.$t.extension.empire.amortization.saveLoad.loadButton($i18n.$d(savedAmortization.date, 'datetime'))"
                                @click="loadItems()"
                            />
                        </template>
                        <span v-else v-text="$i18n.$t.extension.empire.amortization.saveLoad.loadedSave($i18n.$d(savedAmortization.date, 'datetime'), $i18n.$n(saveStateHiddenItems))" />
                    </div>

                    <floating-menu v-model="showInfoMenu" left>
                        <template #activator>
                            <button @click="showInfoMenu = !showInfoMenu">
                                <span class="mdi mdi-help" />
                            </button>
                        </template>

                        <div class="infos">
                            <span v-text="$i18n.$t.extension.empire.amortization.info.slowCalculation" />
                            <span v-text="$i18n.$t.extension.empire.amortization.info.ctrlClick" />
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
                                <span v-text="$i18n.$t.extension.settings.showConvertedUnitsInTables.infoAmortization" />
                            </div>
                        </show-converted-resources-in-cells-settings>
                    </floating-menu>
                </div>

                <div v-show="showSettings" class="amortization-settings-container">
                    <div class="flex-settings">
                        <div>
                            <h3 v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.header" />
                            <amortization-player-settings-inputs v-model="playerSettings" />
                        </div>

                        <div>
                            <h3
                                v-text="
                                    $i18n.$t.extension.empire.amortization.settings.astrophysicsSettings.header(
                                        $i18n.$t.ogame.research[ResearchType.astrophysics]
                                    )
                                "
                            />
                            <div class="astrophysics-settings">
                                <amortization-planet-settings-inputs v-model="astrophysicsSettings.planet" toggleable />
                            </div>
                        </div>

                        <div>
                            <h3
                                v-text="
                                    $i18n.$t.extension.empire.amortization.settings.plasmatechSettings.header(
                                        $i18n.$t.ogame.research[ResearchType.plasmaTechnology]
                                    )
                                "
                            />
                            <div class="plasma-tech-settings">
                                <checkbox
                                    v-model="includePlasmaTechnology"
                                    :label="
                                        $i18n.$t.extension.empire.amortization.settings.plasmatechSettings.includePlasmatech(
                                            $i18n.$t.ogame.research[ResearchType.plasmaTechnology]
                                        )
                                    "
                                />
                            </div>
                        </div>

                        <div>
                            <h3 v-text="$i18n.$t.extension.empire.amortization.settings.expeditionSettings.header" />
                            <div class="expeditionsettings">
                                <amortization-expedition-settings-inputs v-model="expeditionSettings" :playerSettings="playerSettings" />
                            </div>
                        </div>

                        <hr style="width: 100%" />

                        <div>
                            <h3 v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.header" />
                            <div class="global-planet-settings">
                                <button
                                    v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.global.deselectItems"
                                    @click="deselectAllItems()"
                                />
                                <button
                                    v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.global.ignoreInactiveLifeformTechnologySlots"
                                    @click="ignoreAllInactiveSlots()"
                                />
                            </div>

                            <div style="display: flex; gap: 8px; flex-wrap: wrap">
                                <amortization-planet-settings-inputs
                                    v-for="planetSetting in planetSettingsSorted"
                                    :key="planetSetting.id"
                                    v-model="planetSettings[planetSetting.id]"
                                    toggleable
                                    :planetData="empire.planets[planetSetting.id]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="amortization-table" v-if="!showSettings">
                <template>
                    <grid-table
                        v-show="!isGroupedItemsView"
                        :items="items"
                        :columns="columns"
                        :footerItems="footerItems"
                        sticky="100%"
                        sticky-footer
                        :cellClassProvider="cellClassProvider"
                        row-borders
                    >
                        <template #header-checkbox>
                            <checkbox :value="selectedCount == items.length" @input="toggleItemSelection()" check-color="rgb(var(--color))" color="white" />
                        </template>

                        <template #header-cost>
                            <div class="cost-grid">
                                <span v-text="$i18n.$t.extension.empire.amortization.table.cost" style="grid-column: 2" />
                                <o-resource resource="metal" style="grid-column: 1" />
                                <o-resource resource="crystal" />
                                <o-resource resource="deuterium" />
                            </div>
                        </template>

                        <template #cell-checkbox="{ index, item }">
                            <checkbox :value="item.selected" @input-extended="toggleItemSelection(item, index, $event.ctrl)" />
                        </template>
                        <template #cell-what="{ item, index }">
                            <div
                                v-if="item.type == 'mine' || item.type == 'lifeform-building' || item.type == 'lifeform-technology'"
                                class="what-cell"
                                :class="`what-cell--${item.type}`"
                            >
                                <span v-if="item.planetId > 0" class="planet">
                                    <span v-text="getPlanetName(item.planetId)" />
                                    <span v-text="formatPlanetCoordinates(item.planetId)" />
                                </span>
                                <span v-else class="planet">
                                    <span v-text="`${$i18n.$t.extension.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.planetId}`" />
                                    <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                                </span>

                                <div class="levels">
                                    <template v-for="(additionalLifeformBuilding, i) in item.additionalLifeformBuildings">
                                        <o-lifeform-building :key="`icon-${i}`" :building="additionalLifeformBuilding.building" size="36px" />
                                        <span class="name-and-level" :key="`name-level-${i}`">
                                            <span v-text="$i18n.$t.ogame.lifeformBuildings[additionalLifeformBuilding.building]" />
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
                                            <span v-text="$i18n.$t.ogame.buildings[item.mine]" />
                                            <span v-text="item.level" />
                                        </span>
                                    </template>
                                    <template v-else-if="item.type == 'lifeform-building'">
                                        <o-lifeform-building :building="item.building" size="36px" />
                                        <span class="name-and-level">
                                            <span v-text="$i18n.$t.ogame.lifeformBuildings[item.building]" />
                                            <span v-text="item.level" />
                                        </span>
                                    </template>
                                    <template v-else-if="item.type == 'lifeform-technology'">
                                        <o-lifeform-technology :technology="item.technology" size="36px" />
                                        <span class="name-and-level">
                                            <span v-text="$i18n.$t.ogame.lifeformTechnologies[item.technology]" />
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
                                            <i
                                                v-if="'building' in additionalLifeformStuffGroup"
                                                v-text="$i18n.$t.ogame.lifeformBuildings[additionalLifeformStuffGroup.building]"
                                            />
                                            <i v-else v-text="$i18n.$t.ogame.lifeformTechnologies[additionalLifeformStuffGroup.technology]" />

                                            <i
                                                v-text="
                                                    $i18n.$t.extension.empire.amortization.table.levelsOnPlanets(
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
                                                            $i18n.$t.extension.empire.amortization.settings.astrophysicsSettings.newColony
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
                                                <span
                                                    v-if="'building' in additionalLifeformStuffGroup"
                                                    v-text="$i18n.$t.ogame.lifeformBuildings[additionalLifeformStuffGroup.building]"
                                                />
                                                <span v-else v-text="$i18n.$t.ogame.lifeformTechnologies[additionalLifeformStuffGroup.technology]" />

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
                                    <span v-text="$i18n.$t.ogame.research[ResearchType.plasmaTechnology]" />
                                    <span v-text="item.level" />
                                </span>
                            </div>
                            <div v-else-if="item.type == 'astrophysics-and-colony'" class="what-cell what-cell--colony">
                                <span style="display: contents">
                                    <o-research :research="ResearchType.astrophysics" :disabled="item.levels.length == 0" size="36px" style="grid-column: 2" />
                                    <span class="name-and-level">
                                        <span v-text="$i18n.$t.ogame.research[ResearchType.astrophysics]" />

                                        <span v-if="item.levels.length == 0" v-text="'-'" />
                                        <span v-else-if="item.levels.length == 1" v-text="item.levels[0]" />
                                        <span v-else v-text="`${item.levels[0]} + ${item.levels[1]}`" />
                                    </span>
                                </span>

                                <span class="planet" style="align-self: start; grid-row: 2">
                                    <span v-text="`${$i18n.$t.extension.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.newPlanetId}`" />
                                    <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                                </span>

                                <span class="colony-mines" style="display: contents">
                                    <template v-for="building in mineBuildingTypes">
                                        <template v-if="item.builtLevels.mines[building] > 0">
                                            <o-building :key="`${building}-icon`" :building="building" size="36px" style="grid-column: 2" />
                                            <span :key="`${building}-name-level`" class="name-and-level">
                                                <span v-text="$i18n.$t.ogame.buildings[building]" />
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
                                                <span v-text="$i18n.$t.ogame.lifeformBuildings[building]" />
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
                                                <span v-text="$i18n.$t.ogame.lifeformTechnologies[tech]" />
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
                            <decimal-number :value="value" />
                        </template>

                        <template #cell-productionDelta="{ value }">
                            <div class="production-delta-grid">
                                <template v-if="value.metal > 0">
                                    <o-resource resource="metal" size="18px" />
                                    <decimal-number :value="value.metal" />
                                </template>
                                <template v-if="value.crystal > 0">
                                    <o-resource resource="crystal" size="18px" />
                                    <decimal-number :value="value.crystal" />
                                </template>
                                <template v-if="value.deuterium > 0">
                                    <o-resource resource="deuterium" size="18px" />
                                    <decimal-number :value="value.deuterium" />
                                </template>
                            </div>
                        </template>
                        <template #cell-productionDeltaConverted="{ value }">
                            <decimal-number :value="value" />
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
                            <decimal-number :value="value" />
                        </template>
                        <template #footer-productionDelta="{ value }">
                            <div class="production-delta-grid">
                                <template v-if="value.metal > 0">
                                    <o-resource resource="metal" size="18px" />
                                    <decimal-number :value="value.metal" />
                                </template>
                                <template v-if="value.crystal > 0">
                                    <o-resource resource="crystal" size="18px" />
                                    <decimal-number :value="value.crystal" />
                                </template>
                                <template v-if="value.deuterium > 0">
                                    <o-resource resource="deuterium" size="18px" />
                                    <decimal-number :value="value.deuterium" />
                                </template>
                            </div>
                        </template>
                        <template #footer-productionDeltaConverted="{ value }">
                            <decimal-number :value="value" />
                        </template>
                        <template #footer-timeInHours />
                    </grid-table>

                    <div style="display: flex; gap: 8px" v-if="generator != null" v-show="!isGroupedItemsView">
                        <button
                            v-for="count in [25, 50, 100, 500]"
                            :key="count"
                            @click="insertNextAmortizationItems(count)"
                            :disabled="generatingItemCount != null"
                        >
                            <span class="mdi mdi-plus" />
                            <span v-text="$i18n.$t.extension.empire.amortization.generateItems($i18n.$n(count))" />
                        </button>
                    </div>
                </template>

                <amortization-grouped-item-table
                    v-if="isGroupedItemsView"
                    :groupedItems="groupedItemsSorted"
                    :newColonyPosition="astrophysicsSettings.planet.position"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { AllianceClass } from '@/shared/models/ogame/classes/AllianceClass';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import { addCost, Cost } from '@/shared/models/ogame/common/Cost';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import AmortizationPlanetSettingsInputs from '../../components/empire/amortization/AmortizationPlanetSettingsInputs.vue';
    import AmortizationPlayerSettingsInputs from '../../components/empire/amortization/AmortizationPlayerSettingsInputs.vue';
    import AmortizationGroupedItemTable from '../../components/empire/amortization/AmortizationGroupedItemTable.vue';
    import AmortizationExpeditionSettingsInputs from '../../components/empire/amortization/AmortizationExpeditionSettingsInputs.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
    import { LifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { LifeformBuildingType, LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologySlots, LifeformTechnologyType, LifeformTechnologyTypes, LifeformTechnologyTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
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
    import { UniverseSpecificSettings } from '@/shared/models/universe-specific-settings/UniverseSpecificSettings';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { createRecord } from '@/shared/utils/createRecord';
    import { GroupedAmortizationItem, GroupedAmortizationItemGroup, GroupedPlasmaTechnologyItem } from '../../models/empire/amortization';
    import { getLifeformLevel } from '@/shared/models/ogame/lifeforms/experience';
    import { CrawlerProductionPercentage } from '@/shared/models/empire/CrawlerProductionPercentage';
    import { AmortizationExpeditionSettings } from '@/shared/models/empire/amortization/AmortizationExpeditionSettings';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { startOfToday, subDays } from 'date-fns';
    import { AmortizationExpeditionResultsBreakdown, AmortizationExpeditionResultsBreakdownOptions } from '@/shared/models/empire/amortization/AmortizationExpeditionResultsBreakdown';
    import { getItemSlotBonus } from '@/shared/models/ogame/expeditions/getItemSlotBonus';

    type AmortizationViewItem = AmortizationItem & {
        selected: boolean;
    };

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
            AmortizationGroupedItemTable,
            AmortizationExpeditionSettingsInputs,
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
        private readonly LifeformBuildingTypes = LifeformBuildingTypes;
        private readonly LifeformTechnologyTypes = LifeformTechnologyTypes;

        private readonly applicableBuildingTypes = [
            ...ResourceProductionBonusLifeformBuildings,
            ...LifeformTechnologyBonusLifeformBuildings,
        ].map(b => b.type);

        private get applicableLifeformBuildingTypes(): LifeformBuildingType[] {
            const lfBuildings = LifeformBuildingTypesByLifeform[this.astrophysicsSettings.planet.lifeform];
            return lfBuildings.filter(building => this.applicableBuildingTypes.includes(building));
        }
        private readonly applicableLifeformTechnologyTypes = LifeformTechnologyTypes.sort((a,b) => LifeformTechnologySlots[a] - LifeformTechnologySlots[b]); // sorted by slot

        private get savedAmortization() {
            return UniverseSpecificSettingsDataModule.settings.savedAmortization;
        }

        @Watch('playerSettings.playerClass')
        private onPlayerClassSelectionChanged(newClass: PlayerClass) {
            const isCollector = newClass == PlayerClass.collector;
            const percentage: CrawlerProductionPercentage = isCollector ? 150 : 100;

            this.planetSettingsSorted.forEach(p => {
                p.crawlers.percentage = percentage;
                p.crawlers.max = isCollector;
            });

            this.astrophysicsSettings.planet.crawlers.percentage = percentage;
            this.astrophysicsSettings.planet.crawlers.max = isCollector;
        }

        private async saveItems() {
            const savedAmortization: UniverseSpecificSettings['savedAmortization'] = {
                date: Date.now(),
                items: this.items,
            };

            await UniverseSpecificSettingsDataModule.updateSettings({
                ...UniverseSpecificSettingsDataModule.settings,
                savedAmortization,
            });
        }

        private loadItems() {
            const savedAmortization = UniverseSpecificSettingsDataModule.settings.savedAmortization;
            if (savedAmortization == null) {
                return;
            }

            this.showSettings = false;
            this.generator = null;
            this.selectedCount = 0;
            this.isGroupedItemsView = false;

            this.saveStateDate = savedAmortization.date;
            this.amortizationItems = savedAmortization.items
                .filter(item => !this.getIsDone(item))
                .map<AmortizationViewItem>(item => ({
                    ...item,
                    selected: false,
                }));
            this.saveStateHiddenItems = savedAmortization.items.length - this.amortizationItems.length;
        }

        private getIsDone(item: AmortizationItem): boolean {
            const itemType = item.type;
            switch (item.type) {
                case 'mine': {
                    if (item.planetId < 0) {
                        return false; //TODO: how to check if an item on a new planet was done?
                    }

                    const planet = this.empire.planets[item.planetId] as PlanetData | undefined;
                    return planet == null || planet.buildings[item.mine] >= item.level;
                }

                case 'plasma-technology': {
                    return this.empire.research[ResearchType.plasmaTechnology] >= item.level;
                }

                case 'astrophysics-and-colony': {
                    return false; //TODO: how to check if an astro+colony item was done?
                }

                case 'lifeform-building': {
                    if (item.planetId < 0) {
                        return false; //TODO: how to check if an item on a new planet was done?
                    }

                    const planet = this.empire.planets[item.planetId] as PlanetData | undefined;
                    return planet == null || planet.lifeformBuildings[item.building] >= item.level;
                }

                case 'lifeform-technology': {
                    if (item.planetId < 0) {
                        return false; //TODO: how to check if an item on a new planet was done?
                    }

                    const planet = this.empire.planets[item.planetId] as PlanetData | undefined;
                    return planet == null || planet.lifeformTechnologies[item.technology] >= item.level;
                }

                default: _throw(`Invalid amortization item type '${itemType}'`);
            }
        }

        private getPlanetName(id: number): string {
            return this.empire.planets[id]?.name
                ?? `${this.$i18n.$t.extension.empire.amortization.saveLoad.abandonedPlanet} (${id})`;
        }
        private formatPlanetCoordinates(id: number): string {
            const coordinates = this.empire.planets[id]?.coordinates as Coordinates | undefined;
            if (coordinates == null) {
                return '';
            }

            return this.formatCoordinates(coordinates);
        }

        private saveStateDate: number | null = null;
        private saveStateHiddenItems = 0;


        private playerSettings: AmortizationPlayerSettings = {
            optimizeForResources: [ResourceType.metal, ResourceType.crystal, ResourceType.deuterium],
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
            lifeformLevels: createRecord(ValidLifeformTypes, 0),
        };
        private planetSettings: Record<number, AmortizationPlanetSettings> = {};
        private astrophysicsSettings: AmortizationAstrophysicsSettings = {
            planet: {
                include: true,
                id: -1,
                name: '',
                position: 8,
                maxTemperature: getAverageTemperature(8),
                activeItems: [],
                crawlers: {
                    percentage: 100,
                    count: 0,
                    max: false,
                },
                ignoreEmptyLifeformTechnologySlots: false,
                lifeform: LifeformType.none,
                activeLifeformTechnologies: [],
            },
        };
        private includePlasmaTechnology = true;
        private expeditionSettings: AmortizationExpeditionSettings = {
            include: true,
            wavesPerDay: 8,
            items: [],
            fleetUnitsFactors: {
                metal: 0.35,
                crystal: 0.35,
                deuterium: 0.35,
            },
            serverSettings: {
                topScore: 100_000_001,
                economySpeed: 1,
                discovererExpeditionBonus: 0.5,
                discovererExpeditionSlotBonus: 2,
            },
        };

        private showSettings = true;

        private readonly empire = EmpireDataModule.empire;
        private generator: AmortizationItemGenerator | null = null;
        private amortizationItems: AmortizationViewItem[] = [];
        private selectedCount = 0;

        private generatingItemCount: { total: number; count: number } | null = null;

        private get planetSettingsSorted(): AmortizationPlanetSettings[] {
            return Object.values(this.planetSettings)
                .sort((a, b) => EmpireDataModule.empire.planetOrder.indexOf(a.id) - EmpireDataModule.empire.planetOrder.indexOf(b.id));
        }

        private mounted() {
            this.initSettings();
        }

        private toggleSettings() {
            this.saveStateDate = null;

            if (!this.showSettings) {
                this.stopGenerating = true;
                this.showSettings = true;
            }
            else {
                this.stopGenerating = false;
                this.showSettings = false;
                this.initItems();
                this.selectedCount = 0;
                this.isGroupedItemsView = false;

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
                    includePlasmaTechnology: this.clone(this.includePlasmaTechnology),
                    expeditions: this.clone(this.expeditionSettings),
                },
                lifeformExperience: this.clone(EmpireDataModule.lifeformExperience),
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

                this.amortizationItems.push({
                    ...next,
                    selected: false,
                });
                count--;

                this.generatingItemCount.count++;
                await this.$nextTick();
                await delay(10);
            }

            this.generatingItemCount = null;
        }

        private initSettings() {
            const empire = this.empire;
            const serverSettings = ServerSettingsDataModule.serverSettings;
            const settings = SettingsDataModule.settings;

            this.playerSettings = {
                ...this.playerSettings,

                lifeformLevels: createRecord(ValidLifeformTypes, lf => getLifeformLevel(EmpireDataModule.lifeformExperience[lf])),
                officers: { ...empire.officers },
                playerClass: empire.playerClass,
                allianceClass: empire.allianceClass,
                levelPlasmaTechnology: empire.research[ResearchType.plasmaTechnology],
                levelAstrophysics: empire.research[ResearchType.astrophysics],
            };

            this.planetSettings = (Object.values(empire.planets).filter(p => !p.isMoon) as PlanetData[])
                .reduce((acc, planet) => {
                    const settings: AmortizationPlanetSettings = {
                        include: true,
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
                            percentage: planet.productionSettings[ShipType.crawler],
                            count: planet.ships[ShipType.crawler],
                            max: empire.playerClass == PlayerClass.collector,
                        },
                        lifeform: planet.activeLifeform,
                        activeLifeformTechnologies: [...planet.activeLifeformTechnologies],
                        ignoreEmptyLifeformTechnologySlots: false,
                        lifeformTechnologyLevels: { ...planet.lifeformTechnologies },
                        lifeformBuildingLevels: { ...planet.lifeformBuildings },
                    };
                    acc[planet.id] = settings;
                    return acc;
                }, {} as Record<number, AmortizationPlanetSettings>);

            const astroLifeform = serverSettings.lifeforms.enabled ? LifeformType.rocktal : LifeformType.none;
            this.astrophysicsSettings = {
                planet: {
                    ...this.astrophysicsSettings.planet,
                    lifeform: astroLifeform,
                    activeLifeformTechnologies: [...LifeformTechnologyTypesByLifeform[astroLifeform]],

                    name: this.$i18n.$t.extension.empire.amortization.settings.astrophysicsSettings.newColony,
                    crawlers: {
                        percentage: empire.playerClass == PlayerClass.collector ? 150 : 100,
                        count: 0,
                        max: empire.playerClass == PlayerClass.collector,
                    },
                },
            };



            const expoSlotItems = Object.keys(Object.values(empire.planets)[0].activeItems) as ItemHash[];
            const bonusExpoSlots = getItemSlotBonus(createRecord(expoSlotItems, _ => 'permanent' as const));

            const days = Array.from({ length: 7 }).map((_, i) => subDays(startOfToday(), i + 1).getTime());
            const expoCounts = days.map(day => ExpeditionDataModule.dailyResults[day])
                .map(res => res == null
                    ? 0
                    : Object.values(res.events).reduce((total, cur) => total + cur, 0))
                .filter(res => res > 0);
            const avgExpos = expoCounts.reduce((total, cur) => total + cur, 0) / Math.max(1, expoCounts.length);
            const expoServerSettings: AmortizationExpeditionResultsBreakdownOptions['serverSettings'] = {
                topScore: serverSettings.topScore ?? 100_000_001,
                economySpeed: serverSettings.speed.economy,
                discovererExpeditionBonus: serverSettings.playerClasses.discoverer.expeditions.outcomeFactorBonus,
                discovererExpeditionSlotBonus: serverSettings.playerClasses.discoverer.bonusExpeditionSlots,
            };
            let avgWaves = avgExpos / new AmortizationExpeditionResultsBreakdown({
                playerClass: this.playerSettings.playerClass,
                admiral: this.playerSettings.officers.admiral,
                astrophysicsLevel: this.playerSettings.levelAstrophysics,
                itemBonusSlots: bonusExpoSlots,
                fleetFindsResourceFactors: {
                    metal: settings.expeditionFoundShipsResourceUnits.factor,
                    crystal: settings.expeditionFoundShipsResourceUnits.factor,
                    deuterium: settings.expeditionFoundShipsResourceUnits.deuteriumFactor,
                },
                serverSettings: expoServerSettings,
                planets: {},
            }).slots;
            avgWaves = Math.round(10 * avgWaves) / 10;

            this.expeditionSettings = {
                include: this.expeditionSettings.include,
                items: expoSlotItems,
                wavesPerDay: avgWaves,
                fleetUnitsFactors: {
                    metal: settings.expeditionFoundShipsResourceUnits.factor,
                    crystal: settings.expeditionFoundShipsResourceUnits.factor,
                    deuterium: settings.expeditionFoundShipsResourceUnits.deuteriumFactor,
                },
                serverSettings: expoServerSettings,
            };
        }

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
                    label: `${this.$i18n.$t.extension.empire.amortization.table.cost} (${SettingsDataModule.settings.conversionRates.mode == 'msu'
                        ? this.$i18n.$t.extension.common.msu
                        : this.$i18n.$t.extension.common.dsu
                        })`,
                    size: '1fr',
                });
            }

            result.push({
                key: 'productionDelta',
                label: this.$i18n.$t.extension.empire.amortization.table.productionPlus,
                size: '1fr',
            });

            if (showConversion) {
                result.push({
                    key: 'productionDeltaConverted',
                    label: `${this.$i18n.$t.extension.empire.amortization.table.productionPlus} (${SettingsDataModule.settings.conversionRates.mode == 'msu'
                        ? this.$i18n.$t.extension.common.msu
                        : this.$i18n.$t.extension.common.dsu
                        })`,
                    size: '1fr',
                });
            }

            result.push({
                key: 'timeInHours',
                label: this.$i18n.$t.extension.empire.amortization.table.amortizationTime,
                size: '1fr',
            });

            return result;
        }

        private get items(): AmortizationItem[] {
            return this.amortizationItems;
        }

        private get footerItems(): BaseAmortizationItem[] {
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
            let productionDelta: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
            let productionDeltaConverted = 0;

            this.amortizationItems.filter(i => i.selected).forEach(item => {
                cost = addCost(cost, item.cost);
                productionDelta = addCost(productionDelta, item.productionDelta);
                productionDeltaConverted += item.productionDeltaConverted;
            });

            return [{
                cost,
                costConverted: getMsuOrDsu(cost),
                productionDelta,
                productionDeltaConverted,
                timeInHours: 0,
            }];
        }

        private formatCoordinates(coordinates: Coordinates): string {
            return `[${coordinates.galaxy}:${coordinates.system}:${coordinates.position}]`;
        }

        private cellClassProvider(_: any, item: AmortizationViewItem): string {
            const classes: string[] = [];

            switch (item.type) {
                case 'astrophysics-and-colony': {
                    classes.push('astrophysics-cell');
                    break;
                }
                case 'plasma-technology': {
                    classes.push('plasmatech-cell');
                    break;
                }

                default: break;
            }

            return classes.join(' ');
        }

        private toggleItemSelection(item?: AmortizationViewItem, index?: number, selectAllUntilIndex?: boolean) {
            if (item == null || index == null) {
                const allSelected = this.selectedCount == this.amortizationItems.length;
                this.selectedCount = allSelected ? 0 : this.amortizationItems.length;
                this.amortizationItems.forEach(i => i.selected = !allSelected);
                return;
            }

            const select = !item.selected;
            const min = selectAllUntilIndex ? 0 : index;
            const max = index;
            for (let index = min; index <= max; index++) {
                const itemAtIndex = this.amortizationItems[index];

                if (!select && itemAtIndex.selected) {
                    itemAtIndex.selected = false;
                    this.selectedCount--;
                }
                else if (select && !itemAtIndex.selected) {
                    itemAtIndex.selected = true;
                    this.selectedCount++;
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

        private isGroupedItemsView = false;
        private groupedItems: GroupedAmortizationItemGroup = {};

        private showGroupedItems() {
            this.groupedItems = this.amortizationItems
                .filter(i => i.selected)
                .reduce<GroupedAmortizationItemGroup>((groups, cur) => {
                    const getPlanetItem = (id: number) => {
                        return (groups[id] ??= {
                            type: 'planet-item',
                            planetId: id,
                            astrophysicsLevels: [],
                            mines: createRecord(this.mineBuildingTypes, _ => []),
                            lifeformBuildings: createRecord(LifeformBuildingTypes, _ => []),
                            lifeformTechnologies: createRecord(LifeformTechnologyTypes, _ => []),
                        });
                    };
                    const getLevelRangeArray = (levels: { from: number; to: number } | number) => {
                        if (typeof levels === 'number') {
                            return Array.from({ length: levels }).map((_, i) => i + 1);
                        }

                        return Array.from({
                            length: levels.to - levels.from + 1,
                        }).map((_, i) => levels.from + i);
                    };

                    switch (cur.type) {
                        case 'plasma-technology': {
                            const groupItem = (groups.plasmaTechnology ??= {
                                type: 'plasma-technology',
                                levels: [],
                            });
                            groupItem.levels.push(cur.level);

                            cur.additionalLifeformStuff.forEach(lfStuff => {
                                const planetItem = getPlanetItem(lfStuff.planetId);
                                const levels = getLevelRangeArray(lfStuff.levels);
                                if ('building' in lfStuff) {
                                    planetItem.lifeformBuildings[lfStuff.building].push(...levels);
                                }
                                else {
                                    planetItem.lifeformTechnologies[lfStuff.technology].push(...levels);
                                }
                            });
                            return groups;
                        }

                        case 'mine': {
                            const item = getPlanetItem(cur.planetId);
                            item.mines[cur.mine].push(cur.level);

                            cur.additionalLifeformBuildings.forEach(add => {
                                const levels = getLevelRangeArray(add.levels);
                                item.lifeformBuildings[add.building].push(...levels);
                            });

                            return groups;
                        }

                        case 'astrophysics-and-colony': {
                            const item = getPlanetItem(cur.newPlanetId);
                            this.mineBuildingTypes.forEach(mine => {
                                const levels = getLevelRangeArray(cur.builtLevels.mines[mine]);
                                item.mines[mine].push(...levels);
                            });
                            LifeformBuildingTypes.forEach(b => {
                                const levels = getLevelRangeArray(cur.builtLevels.lifeformBuildings[b]);
                                item.lifeformBuildings[b].push(...levels);
                            });
                            LifeformTechnologyTypes.forEach(t => {
                                const levels = getLevelRangeArray(cur.builtLevels.lifeformTechnologies[t]);
                                item.lifeformTechnologies[t].push(...levels);
                            });
                            item.astrophysicsLevels.push(...cur.levels);

                            return groups;
                        }

                        case 'lifeform-building': {
                            const item = getPlanetItem(cur.planetId);
                            item.lifeformBuildings[cur.building].push(cur.level);
                            cur.additionalLifeformBuildings.forEach(b => {
                                const levels = getLevelRangeArray(b.levels);
                                item.lifeformBuildings[b.building].push(...levels);
                            });

                            return groups;
                        }

                        case 'lifeform-technology': {
                            const item = getPlanetItem(cur.planetId);
                            item.lifeformTechnologies[cur.technology].push(cur.level);
                            cur.additionalLifeformBuildings.forEach(b => {
                                const levels = getLevelRangeArray(b.levels);
                                item.lifeformBuildings[b.building].push(...levels);
                            });

                            return groups;
                        }

                        default: _throw('invalid type');
                    }
                }, {} as GroupedAmortizationItemGroup);

            this.isGroupedItemsView = true;
        }

        private get groupedItemsSorted(): GroupedAmortizationItem[] {
            const result = this.planetSettingsSorted
                .map(p => this.groupedItems[p.id])
                .filter(g => g != null) as GroupedAmortizationItem[];

            if (this.groupedItems.plasmaTechnology != null) {
                result.unshift(this.groupedItems.plasmaTechnology);
            }

            Object.keys(this.groupedItems)
                .map(i => parseInt(i))
                .filter(i => i < 0)
                .forEach(id => {
                    result.push(this.groupedItems[id]);
                });

            return result;
        }

        private showNormalItems() {
            this.isGroupedItemsView = false;
            this.groupedItems = {};
        }

        private deselectAllItems() {
            this.planetSettingsSorted.forEach(p => p.activeItems = []);
        }

        private ignoreAllInactiveSlots() {
            this.planetSettingsSorted.forEach(p => p.ignoreEmptyLifeformTechnologySlots = true);
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

    .production-delta-grid {
        display: inline-grid;
        align-items: center;
        grid-template-columns: 16px 1fr;
        justify-items: end;
        gap: 4px;
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
            grid-template-rows: auto auto 1fr;
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

        &-grouping {
            margin-bottom: 4px;
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

    .global-planet-settings {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 4px;
        gap: 8px;
    }
</style>