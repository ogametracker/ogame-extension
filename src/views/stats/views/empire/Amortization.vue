<template>
    <div class="amortization">
        <div class="amortization-container">
            <div class="amortization-settings" :style="{ overflow: showSettings ? 'auto' : undefined }">
                <div class="amortization-settings-header">
                    <button @click="toggleSettings()">
                        <span class="mdi mdi-cogs" />
                        <span class="mdi mdi-menu-down" v-if="!showSettings" />
                        <span class="mdi mdi-menu-up" v-else />

                        <span v-if="!showSettings" v-text="translations().extension.empire.amortization.settings.header" />
                        <span v-else v-text="translations().extension.empire.amortization.settings.applyAndClose" />
                    </button>

                    <div class="generating-count">
                        <span
                            v-if="generatingItemCount != null"
                            v-text="`${translations().extension.empire.amortization.info.generatingItems}: ${generatingItemCount.count}/${generatingItemCount.total}`"
                        />
                        <template v-if="saveStateDate == null">
                            <button
                                v-if="items.length > 0"
                                :disabled="generatingItemCount != null || items.length == 0 || showSettings"
                                class="mr-1"
                                v-text="translations().extension.empire.amortization.saveLoad.saveButton"
                                @click="saveItems()"
                            />
                            <button
                                v-if="savedAmortization != null"
                                :disabled="generatingItemCount != null"
                                v-text="translations().extension.empire.amortization.saveLoad.loadButton(formatDate(savedAmortization.date, 'datetime'))"
                                @click="loadItems()"
                            />
                        </template>
                        <span v-else-if="savedAmortization" v-text="translations().extension.empire.amortization.saveLoad.loadedSave(formatDate(savedAmortization.date, 'datetime'), formatNumber(saveStateHiddenItems))" />
                    </div>

                    <FloatingMenu v-model="showInfoMenu" left>
                        <template #activator>
                            <button @click="showInfoMenu = !showInfoMenu">
                                <span class="mdi mdi-help" />
                            </button>
                        </template>

                        <div class="infos">
                            <span v-text="translations().extension.empire.amortization.info.slowCalculation" />
                            <span v-text="translations().extension.empire.amortization.info.ctrlClick" />
                        </div>
                    </FloatingMenu>

                    <FloatingMenu v-model="showSettingsMenu" left>
                        <template #activator>
                            <button @click="showSettingsMenu = !showSettingsMenu">
                                <span class="mdi mdi-cog" />
                            </button>
                        </template>

                        <ShowConvertedResourcesInCellsSettings>
                            <div class="msu-settings-amortization-info">
                                <span class="mdi mdi-alert" />
                                <span v-text="translations().extension.settings.showConvertedUnitsInTables.infoAmortization" />
                            </div>
                        </ShowConvertedResourcesInCellsSettings>
                    </FloatingMenu>
                </div>

                <div v-show="showSettings" class="amortization-settings-container">
                    <div class="flex-settings">
                        <div>
                            <h3 v-text="translations().extension.empire.amortization.settings.playerSettings.header" />
                            <AmortizationPlayerSettingsInputs v-model="playerSettings" />
                        </div>

                        <div>
                            <h3 v-text="translations().extension.empire.amortization.settings.includeSettings.header" />
                            <div class="include-settings">
                                <Checkbox
                                    v-model="includeSettings.mines"
                                    :label="translations().extension.empire.amortization.settings.includeSettings.mines"
                                />
                                <Checkbox
                                    v-model="includeSettings.expeditions"
                                >
                                    <template #label>
                                        <span v-text="translations().extension.empire.amortization.settings.includeSettings.expeditions" />
                                        <br/>
                                        <i v-text="translations().extension.empire.amortization.settings.includeSettings.expeditionsRequirement" />
                                    </template>
                                </Checkbox>

                                <Checkbox
                                    v-model="includeSettings.lifeformProductionBonusBuildings"
                                    :label="translations().extension.empire.amortization.settings.includeSettings.lifeformProductionBonusBuildings"
                                />
                                <Checkbox
                                    v-model="includeSettings.lifeformTechnologyBoostBuildings"
                                    :label="translations().extension.empire.amortization.settings.includeSettings.lifeformTechnologyBoostBuildings"
                                />
                                <Checkbox
                                    v-model="includeSettings.lifeformProductionBonusTechnologies"
                                    :label="translations().extension.empire.amortization.settings.includeSettings.lifeformProductionBonusTechnologies"
                                />
                                <Checkbox
                                    v-model="includeSettings.lifeformExpeditionBonusTechnologies"
                                    :label="translations().extension.empire.amortization.settings.includeSettings.lifeformExpeditionBonusTechnologies"
                                />

                                <Checkbox
                                    v-model="includeSettings.plasmaTechnology"
                                    :label="translations().ogame.research[ResearchType.plasmaTechnology]"
                                />
                                <Checkbox
                                    v-model="includeSettings.astrophysics"
                                >
                                    <template #label>
                                        <span v-text="translations().extension.empire.amortization.settings.includeSettings.astrophysicsAndColony" />
                                        <br/>
                                        <i v-text="translations().extension.empire.amortization.settings.includeSettings.astrophysicsPerformanceNote" />
                                    </template>
                                </Checkbox>
                            </div>
                        </div>

                        <div>
                            <h3
                                v-text="
                                    translations().extension.empire.amortization.settings.astrophysicsSettings.header(
                                        translations().ogame.research[ResearchType.astrophysics]
                                    )
                                "
                            />
                            <div class="astrophysics-settings">
                                <AmortizationPlanetSettingsInputs v-model="astrophysicsSettings" />
                            </div>
                        </div>

                        <div>
                            <h3 v-text="translations().extension.empire.amortization.settings.expeditionSettings.header" />
                            <div class="expeditionsettings">
                                <AmortizationExpeditionSettingsInputs
                                    v-model="expeditionSettings"
                                    :playerSettings="playerSettings"
                                    :breakdown="expoBreakdown"
                                />
                            </div>
                        </div>

                        <hr style="width: 100%" />

                        <div>
                            <h3 v-text="translations().extension.empire.amortization.settings.planetSettings.header" />
                            <div class="global-planet-settings">
                                <button
                                    v-text="translations().extension.empire.amortization.settings.planetSettings.global.deselectItems"
                                    @click="deselectAllItems()"
                                />
                                <button
                                    v-text="translations().extension.empire.amortization.settings.planetSettings.global.ignoreInactiveLifeformTechnologySlots"
                                    @click="ignoreAllInactiveSlots()"
                                />
                                <button
                                    v-text="translations().extension.empire.amortization.settings.planetSettings.global.deselectAllPlanets"
                                    @click="deselectAllPlanets()"
                                />
                            </div>

                            <div style="display: flex; gap: 8px; flex-wrap: wrap">
                                <AmortizationPlanetSettingsInputs
                                    v-for="planetSetting in planetSettingsSorted"
                                    :key="planetSetting.id"
                                    v-model="planetSettings[planetSetting.id]"
                                    toggleable
                                    :planet-data="empire.planets[planetSetting.id] as PlanetData"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="amortization-table" v-if="!showSettings">
                <template v-if="!isGroupedItemsView">
                    <GridTable

                        :items="items"
                        :columns="columns"
                        :footerItems="footerItems"
                        sticky="100%"
                        sticky-footer
                        :cellClassProvider="cellClassProvider"
                        row-borders
                    >
                        <template #header-checkbox>
                            <Checkbox :model-value="selectedCount == items.length" @update:model-value="toggleItemSelection()" check-color="rgb(var(--color))" color="white" />
                        </template>

                        <template #header-cost>
                            <div class="cost-grid">
                                <span v-text="translations().extension.empire.amortization.table.cost" style="grid-column: 2" />
                                <OResource :resource="ResourceType.metal" style="grid-column: 1" />
                                <OResource :resource="ResourceType.crystal" />
                                <OResource :resource="ResourceType.deuterium" />
                            </div>
                        </template>

                        <template #cell-checkbox="{ index, item }">
                            <Checkbox :model-value="item.selected" @input-extended="toggleItemSelection(item, index, $event.ctrl)" />
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
                                    <span v-text="`${translations().extension.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.planetId}`" />
                                    <span v-text="`[-:-:${astrophysicsSettings.position}]`" />
                                </span>

                                <div class="levels">
                                    <template v-for="(additionalLifeformBuilding, i) in item.additionalLifeformBuildings" :key="i">
                                        <OLifeformBuilding :building="additionalLifeformBuilding.building" size="36px" />
                                        <span class="name-and-level">
                                            <span v-text="translations().ogame.lifeformBuildings[additionalLifeformBuilding.building]" />
                                            <span
                                                v-if="additionalLifeformBuilding.levels.from != additionalLifeformBuilding.levels.to"
                                                v-text="`${additionalLifeformBuilding.levels.from} - ${additionalLifeformBuilding.levels.to}`"
                                            />
                                            <span v-else v-text="additionalLifeformBuilding.levels.from" />
                                        </span>
                                    </template>

                                    <template v-if="item.type == 'mine'">
                                        <OBuilding :building="item.mine" size="36px" />
                                        <span class="name-and-level">
                                            <span v-text="translations().ogame.buildings[item.mine]" />
                                            <span v-text="item.level" />
                                        </span>
                                    </template>
                                    <template v-else-if="item.type == 'lifeform-building'">
                                        <OLifeformBuilding :building="item.building" size="36px" />
                                        <span class="name-and-level">
                                            <span v-text="translations().ogame.lifeformBuildings[item.building]" />
                                            <span v-text="item.level" />
                                        </span>
                                    </template>
                                    <template v-else-if="item.type == 'lifeform-technology'">
                                        <OLifeformTechnology :technology="item.technology" size="36px" />
                                        <span class="name-and-level">
                                            <span v-text="translations().ogame.lifeformTechnologies[item.technology]" />
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

                                        <OLifeformBuilding
                                            v-if="additionalLifeformStuffGroup.building != null"
                                            :building="additionalLifeformStuffGroup.building"
                                            size="36px"
                                        />
                                        <OLifeformTechnology v-else-if="additionalLifeformStuffGroup.technology != null" :technology="additionalLifeformStuffGroup.technology" size="36px" />

                                        <span class="name-and-level">
                                            <i
                                                v-if="'building' in additionalLifeformStuffGroup"
                                                v-text="translations().ogame.lifeformBuildings[additionalLifeformStuffGroup.building!]"
                                            />
                                            <i v-else v-text="translations().ogame.lifeformTechnologies[additionalLifeformStuffGroup.technology!]" />

                                            <i
                                                v-text="
                                                    translations().extension.empire.amortization.table.levelsOnPlanets(
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
                                                            translations().extension.empire.amortization.settings.astrophysicsSettings.newColony
                                                        } ${-additionalLifeformStuff.planetId}`
                                                    "
                                                />
                                                <span v-text="`[-:-:${astrophysicsSettings.position}]`" />
                                            </span>

                                            <OLifeformBuilding
                                                v-if="'building' in additionalLifeformStuff"
                                                :building="additionalLifeformStuff.building"
                                                size="36px"
                                            />
                                            <OLifeformTechnology v-else :technology="additionalLifeformStuff.technology" size="36px" />

                                            <span class="name-and-level">
                                                <span
                                                    v-if="'building' in additionalLifeformStuffGroup"
                                                    v-text="translations().ogame.lifeformBuildings[additionalLifeformStuffGroup.building!]"
                                                />
                                                <span v-else v-text="translations().ogame.lifeformTechnologies[additionalLifeformStuffGroup.technology!]" />

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
                                <OResearch :research="ResearchType.plasmaTechnology" size="36px" />
                                <span class="name-and-level">
                                    <span v-text="translations().ogame.research[ResearchType.plasmaTechnology]" />
                                    <span v-text="item.level" />
                                </span>
                            </div>
                            <div v-else-if="item.type == 'astrophysics-and-colony'" class="what-cell what-cell--colony">
                                <span style="display: contents">
                                    <OResearch :research="ResearchType.astrophysics" :disabled="item.levels.length == 0" size="36px" style="grid-column: 2" />
                                    <span class="name-and-level">
                                        <span v-text="translations().ogame.research[ResearchType.astrophysics]" />

                                        <span v-if="item.levels.length == 0" v-text="'-'" />
                                        <span v-else-if="item.levels.length == 1" v-text="item.levels[0]" />
                                        <span v-else v-text="`${item.levels[0]} + ${item.levels[1]}`" />
                                    </span>
                                </span>

                                <span class="planet" style="align-self: start; grid-row: 2">
                                    <span v-text="`${translations().extension.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.newPlanetId}`" />
                                    <span v-text="`[-:-:${astrophysicsSettings.position}]`" />
                                </span>

                                <span class="colony-mines" style="display: contents">
                                    <template v-for="building in mineBuildingTypes">
                                        <template v-if="item.builtLevels.mines[building] > 0">
                                            <OBuilding :key="`${building}-icon`" :building="building" size="36px" style="grid-column: 2" />
                                            <span :key="`${building}-name-level`" class="name-and-level">
                                                <span v-text="translations().ogame.buildings[building]" />
                                                <span v-text="`0 - ${item.builtLevels.mines[building]}`" />
                                            </span>
                                        </template>
                                    </template>
                                </span>
                                <span class="colony-lifeform-buildings" style="display: contents">
                                    <template v-for="building in applicableLifeformBuildingTypes">
                                        <template v-if="item.builtLevels.lifeformBuildings[building] > 0">
                                            <OLifeformBuilding :key="`${building}-icon`" :building="building" size="36px" style="grid-column: 2" />
                                            <span :key="`${building}-name-level`" class="name-and-level">
                                                <span v-text="translations().ogame.lifeformBuildings[building]" />
                                                <span v-text="`0 - ${item.builtLevels.lifeformBuildings[building]}`" />
                                            </span>
                                        </template>
                                    </template>
                                </span>
                                <span class="colony-lifeform-technologies" style="display: contents">
                                    <template v-for="tech in applicableLifeformTechnologyTypes">
                                        <template v-if="item.builtLevels.lifeformTechnologies[tech] > 0">
                                            <OLifeformTechnology :key="`${tech}-icon`" :technology="tech" size="36px" style="grid-column: 2" />
                                            <span :key="`${tech}-name-level`" class="name-and-level">
                                                <span v-text="translations().ogame.lifeformTechnologies[tech]" />
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
                                <span v-text="formatNumber(value.metal)" :class="{ zero: value.metal == 0 }" />
                                <span v-text="formatNumber(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                                <span v-text="formatNumber(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
                            </div>
                        </template>
                        <template #cell-costConverted="{ value }">
                            <DecimalNumber :value="value" />
                        </template>

                        <template #cell-productionDelta="{ value }">
                            <div class="production-delta-grid">
                                <template v-if="value.metal > 0">
                                    <OResource :resource="ResourceType.metal" size="18px" />
                                    <DecimalNumber :value="value.metal" />
                                </template>
                                <template v-if="value.crystal > 0">
                                    <OResource :resource="ResourceType.crystal" size="18px" />
                                    <DecimalNumber :value="value.crystal" />
                                </template>
                                <template v-if="value.deuterium > 0">
                                    <OResource :resource="ResourceType.deuterium" size="18px" />
                                    <DecimalNumber :value="value.deuterium" />
                                </template>
                            </div>
                        </template>
                        <template #cell-productionDeltaConverted="{ value }">
                            <DecimalNumber :value="value" />
                        </template>

                        <template #cell-timeInHours="{ value }">
                            <span v-text="formatTimespan(value * 60 * 60)" />
                        </template>

                        <template #footer-cost="{ value }">
                            <div class="cost-grid">
                                <span v-text="formatNumber(value.metal)" :class="{ zero: value.metal == 0 }" />
                                <span v-text="formatNumber(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                                <span v-text="formatNumber(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
                            </div>
                        </template>
                        <template #footer-costConverted="{ value }">
                            <DecimalNumber :value="value" />
                        </template>
                        <template #footer-productionDelta="{ value }">
                            <div class="production-delta-grid">
                                <template v-if="value.metal > 0">
                                    <OResource :resource="ResourceType.metal" size="18px" />
                                    <DecimalNumber :value="value.metal" />
                                </template>
                                <template v-if="value.crystal > 0">
                                    <OResource :resource="ResourceType.crystal" size="18px" />
                                    <DecimalNumber :value="value.crystal" />
                                </template>
                                <template v-if="value.deuterium > 0">
                                    <OResource :resource="ResourceType.deuterium" size="18px" />
                                    <DecimalNumber :value="value.deuterium" />
                                </template>
                            </div>
                        </template>
                        <template #footer-productionDeltaConverted="{ value }">
                            <DecimalNumber :value="value" />
                        </template>
                        <template #footer-timeInHours />
                    </GridTable>

                    <div style="display: flex; gap: 8px" v-if="generator != null" v-show="!isGroupedItemsView">
                        <button
                            v-for="count in [25, 50, 100, 500]"
                            :key="count"
                            @click="insertNextAmortizationItems(count)"
                            :disabled="generatingItemCount != null"
                        >
                            <span class="mdi mdi-plus" />
                            <span v-text="translations().extension.empire.amortization.generateItems(formatNumber(count))" />
                        </button>
                    </div>
                </template>

                <AmortizationGroupedItemTable
                    v-if="isGroupedItemsView"
                    :groupedItems="groupedItemsSorted"
                    :newColonyPosition="astrophysicsSettings.position"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from '@stats/components/common/Checkbox.vue';
import DecimalNumber from '@stats/components/common/DecimalNumber.vue';
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import GridTable from '@stats/components/common/GridTable.vue';
import OBuilding from '@stats/components/ogame/OBuilding.vue';
import OLifeformBuilding from '@stats/components/ogame/OLifeformBuilding.vue';
import OLifeformTechnology from '@stats/components/ogame/OLifeformTechnology.vue';
import OResearch from '@stats/components/ogame/OResearch.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import { computed, nextTick, onMounted, ref, watch, reactive, shallowReactive, shallowRef } from 'vue';
import { translations, formatNumber, formatDate, formatTimespan } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { AllianceClass } from '@ogame-tracker/shared/models/ogame/classes/AllianceClass';
import { PlayerClass } from '@ogame-tracker/shared/models/ogame/classes/PlayerClass';
import { addCost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import type { Cost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import { ItemHash } from '@ogame-tracker/shared/models/ogame/items/ItemHash';
import { ResearchType } from '@ogame-tracker/shared/models/ogame/research/ResearchType';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import AmortizationPlanetSettingsInputs from '../../components/empire/amortization/AmortizationPlanetSettingsInputs.vue';
import AmortizationPlayerSettingsInputs from '../../components/empire/amortization/AmortizationPlayerSettingsInputs.vue';
import AmortizationGroupedItemTable from '../../components/empire/amortization/AmortizationGroupedItemTable.vue';
import AmortizationExpeditionSettingsInputs from '../../components/empire/amortization/AmortizationExpeditionSettingsInputs.vue';
import { useEmpireStore } from '../../data/EmpireDataModule';
import type { GridTableColumn } from '../../components/common/GridTable.vue';
import type { Coordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import { useSettingsStore } from '../../data/SettingsDataModule';
import { useServerSettingsStore } from '../../data/ServerSettingsDataModule';
import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import { LifeformType, ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { LifeformBuildingType, LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformTechnologySlots, LifeformTechnologyType, LifeformTechnologyTypes, LifeformTechnologyTypesByLifeform } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { getAverageTemperature } from '@ogame-tracker/shared/models/ogame/resource-production/getAverageTemperature';
import type { AmortizationPlanetSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationPlanetSettings';
import type { AmortizationPlayerSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationPlayerSettings';
import type { AmortizationItem, BaseAmortizationItem, LifeformBuildingLevels, LifeformTechnologyLevels, MineBuildingType } from '@ogame-tracker/shared/models/empire/amortization/models';
import { AmortizationItemGenerator } from '@ogame-tracker/shared/models/empire/amortization/AmortizationItemGenerator';
import type { AmortizationGenerationSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationItemGenerator';
import { LifeformTechnologyBonusLifeformBuildings, ResourceProductionBonusLifeformBuildings } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
import { delay } from '@ogame-tracker/shared/utils/delay';
import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';
import { useUniverseSpecificSettingsStore } from '../../data/UniverseSpecificSettingsDataModule';
import type { UniverseSpecificSettings } from '@ogame-tracker/shared/models/universe-specific-settings/UniverseSpecificSettings';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import type { GroupedAmortizationItem, GroupedAmortizationItemGroup } from '../../models/empire/amortization';
import { getLifeformExperienceNeededForLevel, getLifeformLevel } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import type { CrawlerProductionPercentage } from '@ogame-tracker/shared/models/empire/CrawlerProductionPercentage';
import type { AmortizationExpeditionSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationExpeditionSettings';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import { startOfToday, subDays } from 'date-fns';
import { AmortizationExpeditionResultsBreakdown } from '@ogame-tracker/shared/models/empire/amortization/AmortizationExpeditionResultsBreakdown';
import type { AmortizationExpeditionResultsBreakdownOptions } from '@ogame-tracker/shared/models/empire/amortization/AmortizationExpeditionResultsBreakdown';
import { getItemSlotBonus } from '@ogame-tracker/shared/models/ogame/expeditions/getItemSlotBonus';
import { getPlanetExpeditionState, getPlanetState } from '@ogame-tracker/shared/models/empire/amortization/utils';

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

const universeSpecificSettingsStore = useUniverseSpecificSettingsStore();

const empireStore = useEmpireStore();

const serverSettingsStore = useServerSettingsStore();

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const numberFormat: Intl.NumberFormatOptions = {
    maximumFractionDigits: 0,
};

const showSettingsMenu = ref(false);

const showInfoMenu = ref(false);

const mineBuildingTypes: MineBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];

const expoBreakdown = shallowRef(new AmortizationExpeditionResultsBreakdown(reactive({
    playerClass: PlayerClass.none,
    admiral: false,
    astrophysicsLevel: 0,
    itemBonusSlots: 0,
    expeditionBoostItems: [],
    fleetFindsResourceFactors: createRecord(ResourceTypes, () => 0),
    planets: {},
    serverSettings: {
        topScore: 0,
        economySpeed: 0,
        discovererExpeditionBonus: 0,
        discovererExpeditionSlotBonus: 0,
    },
})));

const applicableBuildingTypes = [
    ...ResourceProductionBonusLifeformBuildings,
    ...LifeformTechnologyBonusLifeformBuildings,
].map(b => b.type);

const applicableLifeformBuildingTypes = computed<LifeformBuildingType[]>(() => {
    const lfBuildings = LifeformBuildingTypesByLifeform[astrophysicsSettings.value.lifeform];
    return lfBuildings.filter(building => applicableBuildingTypes.includes(building));
});

const applicableLifeformTechnologyTypes = LifeformTechnologyTypes.sort((a, b) => LifeformTechnologySlots[a] - LifeformTechnologySlots[b]);

const savedAmortization = computed(() => universeSpecificSettingsStore.settings.savedAmortization);

function onPlayerClassSelectionChanged(newClass: PlayerClass) {
    const isCollector = newClass == PlayerClass.collector;
    const percentage: CrawlerProductionPercentage = isCollector ? 150 : 100;

    planetSettingsSorted.value.forEach(p => {
        p.crawlers.percentage = percentage;
        p.crawlers.max = isCollector;
    });

    astrophysicsSettings.value.crawlers.percentage = percentage;
    astrophysicsSettings.value.crawlers.max = isCollector;
}

async function saveItems() {
    const localSavedAmortization: UniverseSpecificSettings['savedAmortization'] = {
        date: Date.now(),
        items: items.value,
    };

    await universeSpecificSettingsStore.updateSettings({
        ...universeSpecificSettingsStore.settings,
        savedAmortization: localSavedAmortization,
    });
}

function loadItems() {
    const localSavedAmortization = universeSpecificSettingsStore.settings.savedAmortization;
    if (localSavedAmortization == null) {
        return;
    }

    showSettings.value = false;
    generator.value = null;
    selectedCount.value = 0;
    isGroupedItemsView.value = false;

    saveStateDate.value = localSavedAmortization.date;
    amortizationItems.value = shallowReactive(localSavedAmortization.items
        .filter(item => !getIsDone(item))
        .map(item => shallowReactive({ ...item, selected: false })));
    saveStateHiddenItems.value = localSavedAmortization.items.length - amortizationItems.value.length;
}

function getIsDone(item: AmortizationItem): boolean {
    const itemType = item.type;
    switch (item.type) {
        case 'mine': {
            if (item.planetId < 0) {
                return false; //TODO: how to check if an item on a new planet was done?
            }

            const planet = empire.planets[item.planetId] as PlanetData | undefined;
            return planet == null || planet.buildings[item.mine] >= item.level;
        }

        case 'plasma-technology': {
            return empire.research[ResearchType.plasmaTechnology] >= item.level;
        }

        case 'astrophysics-and-colony': {
            return false; //TODO: how to check if an astro+colony item was done?
        }

        case 'lifeform-building': {
            if (item.planetId < 0) {
                return false; //TODO: how to check if an item on a new planet was done?
            }

            const planet = empire.planets[item.planetId] as PlanetData | undefined;
            return planet == null || planet.lifeformBuildings[item.building] >= item.level;
        }

        case 'lifeform-technology': {
            if (item.planetId < 0) {
                return false; //TODO: how to check if an item on a new planet was done?
            }

            const planet = empire.planets[item.planetId] as PlanetData | undefined;
            return planet == null || planet.lifeformTechnologies[item.technology] >= item.level;
        }

        default: _throw(`Invalid amortization item type '${itemType}'`);
    }
}

function getPlanetName(id: number): string {
    return empire.planets[id]?.name
        ?? `${translations().extension.empire.amortization.saveLoad.abandonedPlanet} (${id})`;
}

function formatPlanetCoordinates(id: number): string {
    const coordinates = empire.planets[id]?.coordinates as Coordinates | undefined;
    if (coordinates == null) {
        return '';
    }

    return formatCoordinates(coordinates);
}

const saveStateDate = ref<number | null>(null);

const saveStateHiddenItems = ref(0);

const playerSettings = ref<AmortizationPlayerSettings>({
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
});

const planetSettings = ref<Record<number, AmortizationPlanetSettings>>({});

const astrophysicsSettings = ref<AmortizationPlanetSettings>({
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
});

const includeSettings = ref<AmortizationGenerationSettings['include']>({
    astrophysics: false,
    plasmaTechnology: true,
    expeditions: true,
    mines: true,

    lifeformProductionBonusBuildings: true,
    lifeformTechnologyBoostBuildings: true,
    lifeformProductionBonusTechnologies: true,
    lifeformExpeditionBonusTechnologies: true,
});

const expeditionSettings = ref<AmortizationExpeditionSettings>({
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
});

const showSettings = ref(true);

const empire = empireStore.empire;

const generator = shallowRef<AmortizationItemGenerator | null>(null);

const amortizationItems = shallowRef<AmortizationViewItem[]>(shallowReactive([]));

const selectedCount = ref(0);

const generatingItemCount = ref<{ total: number; count: number } | null>(null);

const planetSettingsSorted = computed<AmortizationPlanetSettings[]>(() => {
    return Object.values(planetSettings.value)
        .sort((a, b) => empireStore.empire.planetOrder.indexOf(a.id) - empireStore.empire.planetOrder.indexOf(b.id));
});

function toggleSettings() {
    saveStateDate.value = null;

    if (!showSettings.value) {
        stopGenerating.value = true;
        showSettings.value = true;
    }
    else {
        stopGenerating.value = false;
        showSettings.value = false;
        initItems();
        selectedCount.value = 0;
        isGroupedItemsView.value = false;

        void insertNextAmortizationItems(25);
    }
}

function clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data)) as T;
}

function initItems(): void {
    generator.value = new AmortizationItemGenerator({
        settings: {
            player: clone(playerSettings.value),
            planets: clone(planetSettings.value),
            astrophysics: clone(astrophysicsSettings.value),
            expeditions: clone(expeditionSettings.value),
            include: clone(includeSettings.value),
        },
        lifeformExperience: createRecord(
            ValidLifeformTypes,
            lifeform => getLifeformExperienceNeededForLevel(playerSettings.value.lifeformLevels[lifeform]),
        ),
        serverSettings: clone(serverSettingsStore.serverSettings),
        getMsuOrDsu,
    });
    amortizationItems.value = shallowReactive([]);
}

const stopGenerating = ref(false);

async function insertNextAmortizationItems(count: number): Promise<void> {
    if (generatingItemCount.value != null) {
        return;
    }

    generatingItemCount.value = { total: count, count: 0 };
    await nextTick();

    while (count > 0) {
        const next = generator.value?.nextItem();

        if (next == null || stopGenerating.value) {
            break;
        }

        amortizationItems.value.push(shallowReactive({
            ...next,
            selected: false,
        }));
        count--;

        generatingItemCount.value.count++;
        await nextTick();
        await delay(10);
    }

    generatingItemCount.value = null;
}

function initSettings() {
    const localEmpire = empire;
    const serverSettings = serverSettingsStore.serverSettings;
    const settings = settingsStore.settings;

    playerSettings.value = {
        ...playerSettings.value,

        lifeformLevels: createRecord(ValidLifeformTypes, lf => getLifeformLevel(empireStore.lifeformExperience[lf])),
        officers: { ...localEmpire.officers },
        playerClass: localEmpire.playerClass,
        allianceClass: localEmpire.allianceClass,
        levelPlasmaTechnology: localEmpire.research[ResearchType.plasmaTechnology],
        levelAstrophysics: localEmpire.research[ResearchType.astrophysics],
    };

    planetSettings.value = (Object.values(localEmpire.planets).filter(p => !p.isMoon) as PlanetData[])
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
                    max: localEmpire.playerClass == PlayerClass.collector,
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
    astrophysicsSettings.value = {
        ...astrophysicsSettings.value,
        lifeform: astroLifeform,
        activeLifeformTechnologies: [...LifeformTechnologyTypesByLifeform[astroLifeform]],

        name: translations().extension.empire.amortization.settings.astrophysicsSettings.newColony,
        crawlers: {
            percentage: localEmpire.playerClass == PlayerClass.collector ? 150 : 100,
            count: 0,
            max: localEmpire.playerClass == PlayerClass.collector,
        },
    };

    const expoSlotItems = Object.keys(Object.values(localEmpire.planets)[0].activeItems) as ItemHash[];
    const bonusExpoSlots = getItemSlotBonus(createRecord(expoSlotItems, _ => 'permanent' as const));

    const days = Array.from({ length: 7 }).map((_, i) => subDays(startOfToday(), i + 1).getTime());
    const expoCounts = days.map(day => expeditionStore.dailyResults[day])
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

    const lifeformExperience = createRecord(
        ValidLifeformTypes,
        lifeform => getLifeformExperienceNeededForLevel(playerSettings.value.lifeformLevels[lifeform]),
    );
    expoBreakdown.value = new AmortizationExpeditionResultsBreakdown(reactive({
        playerClass: playerSettings.value.playerClass,
        admiral: playerSettings.value.officers.admiral,
        astrophysicsLevel: playerSettings.value.levelAstrophysics,
        itemBonusSlots: bonusExpoSlots,
        expeditionBoostItems: expoSlotItems,
        fleetFindsResourceFactors: {
            metal: settings.expeditionFoundShipsResourceUnits.factor,
            crystal: settings.expeditionFoundShipsResourceUnits.factor,
            deuterium: settings.expeditionFoundShipsResourceUnits.deuteriumFactor,
        },
        serverSettings: expoServerSettings,
        planets: createMappedRecord(
            Object.values(planetSettings.value),
            planet => planet.id,
            planet => getPlanetExpeditionState(getPlanetState(planet, serverSettings, lifeformExperience)),
        ),
    }));
    const avgWaves = Math.round(10 * avgExpos / expoBreakdown.value.slots) / 10;

    expeditionSettings.value = {
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

const columns = computed<GridTableColumn<keyof BaseAmortizationItem | 'what' | 'checkbox'>[]>(() => {
    const showConversion = settingsStore.settings.showCellsWithConvertedResourceUnits;

    const result: GridTableColumn<keyof BaseAmortizationItem | 'what' | 'checkbox'>[] = [
        { key: 'checkbox', size: 'auto' },
        { key: 'what', size: 'auto' },
        { key: 'cost', size: '3fr' },
    ];

    if (showConversion) {
        result.push({
            key: 'costConverted',
            label: `${translations().extension.empire.amortization.table.cost} (${settingsStore.settings.conversionRates.mode == 'msu'
                ? translations().extension.common.msu
                : translations().extension.common.dsu
                })`,
            size: '1fr',
        });
    }

    result.push({
        key: 'productionDelta',
        label: translations().extension.empire.amortization.table.productionPlus,
        size: '1fr',
    });

    if (showConversion) {
        result.push({
            key: 'productionDeltaConverted',
            label: `${translations().extension.empire.amortization.table.productionPlus} (${settingsStore.settings.conversionRates.mode == 'msu'
                ? translations().extension.common.msu
                : translations().extension.common.dsu
                })`,
            size: '1fr',
        });
    }

    result.push({
        key: 'timeInHours',
        label: translations().extension.empire.amortization.table.amortizationTime,
        size: '1fr',
    });

    return result;
});

const items = computed(() => amortizationItems.value);

const footerItems = computed<BaseAmortizationItem[]>(() => {
    let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    let productionDelta: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    let productionDeltaConverted = 0;

    amortizationItems.value.filter(i => i.selected).forEach(item => {
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
});

function formatCoordinates(coordinates: Coordinates): string {
    return `[${coordinates.galaxy}:${coordinates.system}:${coordinates.position}]`;
}

function cellClassProvider(_: any, item: AmortizationViewItem): string {
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

function toggleItemSelection(item?: AmortizationViewItem, index?: number, selectAllUntilIndex?: boolean) {
    if (item == null || index == null) {
        const allSelected = selectedCount.value == amortizationItems.value.length;
        selectedCount.value = allSelected ? 0 : amortizationItems.value.length;
        amortizationItems.value.forEach(i => i.selected = !allSelected);
        return;
    }

    const select = !item.selected;
    const min = selectAllUntilIndex ? 0 : index;
    const max = index;
    for (let index = min;index <= max;index++) {
        const itemAtIndex = amortizationItems.value[index];

        if (!select && itemAtIndex.selected) {
            itemAtIndex.selected = false;
            selectedCount.value--;
        }
        else if (select && !itemAtIndex.selected) {
            itemAtIndex.selected = true;
            selectedCount.value++;
        }
    }
}

function deselectAllPlanets() {
    Object.values(planetSettings.value).forEach(planet => planet.include = false);
}

function getAdditionalLifeformStuffGroups(additionalLifeformStuff: (LifeformBuildingLevels | LifeformTechnologyLevels)[]): AdditionalLifeformStuffGroup[] {
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

const showAmotizationGroup = reactive<Partial<Record<string, boolean>>>({});

function toggleAmortizationGroup(groupName: string) {
    if (showAmotizationGroup[groupName] == null) {
        showAmotizationGroup[groupName] = true;
    }
    else {
        showAmotizationGroup[groupName] = !showAmotizationGroup[groupName];
    }
}

const isGroupedItemsView = ref(false);

const groupedItems = ref<GroupedAmortizationItemGroup>({});

function showGroupedItems() {
    groupedItems.value = amortizationItems.value
        .filter(i => i.selected)
        .reduce<GroupedAmortizationItemGroup>((groups, cur) => {
            const getPlanetItem = (id: number) => {
                return (groups[id] ??= {
                    type: 'planet-item',
                    planetId: id,
                    astrophysicsLevels: [],
                    mines: createRecord(mineBuildingTypes, _ => []),
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
                            planetItem.lifeformBuildings[lfStuff.building!].push(...levels);
                        }
                        else {
                            planetItem.lifeformTechnologies[lfStuff.technology!].push(...levels);
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
                    mineBuildingTypes.forEach(mine => {
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

    isGroupedItemsView.value = true;
}

const groupedItemsSorted = computed<GroupedAmortizationItem[]>(() => {
    const result = planetSettingsSorted.value
        .map(p => groupedItems.value[p.id])
        .filter(g => g != null) as GroupedAmortizationItem[];

    if (groupedItems.value.plasmaTechnology != null) {
        result.unshift(groupedItems.value.plasmaTechnology);
    }

    Object.keys(groupedItems.value)
        .map(i => parseInt(i))
        .filter(i => i < 0)
        .forEach(id => {
            result.push(groupedItems.value[id]);
        });

    return result;
});

function showNormalItems() {
    isGroupedItemsView.value = false;
    groupedItems.value = {};
}

function deselectAllItems() {
    planetSettingsSorted.value.forEach(p => p.activeItems = []);
}

function ignoreAllInactiveSlots() {
    planetSettingsSorted.value.forEach(p => p.ignoreEmptyLifeformTechnologySlots = true);
}

watch(() => playerSettings.value.playerClass, onPlayerClassSelectionChanged);

onMounted(() => {
    initSettings();
});
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

            :deep(.astrophysics-cell),
            :deep(.astrophysics-cell ~ .grid-table-cell) {
                background-color: rgba(64, 129, 152, 0.25) !important;
            }

            :deep(.plasmatech-cell),
            :deep(.plasmatech-cell ~ .grid-table-cell) {
                background-color: rgba(123, 255, 95, 0.1) !important;
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

    .include-settings {
        display: flex;
        flex-direction: column;
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
