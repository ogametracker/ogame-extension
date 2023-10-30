<template>
    <div class="planet-settings" :class="{ disabled: settings.include == false }">
        <div class="header">
            <span v-text="settings.name" />
            <span v-if="settings.coordinates != null">
                [{{ settings.coordinates.galaxy }}:{{ settings.coordinates.system }}:{{ settings.coordinates.position }}]
            </span>
        </div>

        <div class="body">
            <template v-if="toggleable">
                <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.includeInResult" />
                <checkbox v-model="settings.include" />
            </template>

            <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.position" />
            <span>
                <input type="number" v-model.number="settings.position" min="1" max="15" step="1" />
            </span>

            <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.maxTemperature" />
            <span>
                <input type="number" v-model.number="settings.maxTemperature" min="-130" max="260" step="1" />
            </span>

            <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.activeItems" />
            <span class="item-grid">
                <o-item
                    v-for="item in boosterItems.metal"
                    :key="item"
                    :item="item"
                    :disabled="item != activeBooster.metal"
                    @click="toggleBooster(item, boosterItems.metal)"
                />
                <o-item
                    v-for="item in boosterItems.crystal"
                    :key="item"
                    :item="item"
                    :disabled="item != activeBooster.crystal"
                    @click="toggleBooster(item, boosterItems.crystal)"
                />
                <o-item
                    v-for="item in boosterItems.deuterium"
                    :key="item"
                    :item="item"
                    :disabled="item != activeBooster.deuterium"
                    @click="toggleBooster(item, boosterItems.deuterium)"
                />
            </span>

            <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.crawlers.title" />
            <span class="crawler-grid">
                <div class="crawler-grid-row">
                    <input type="number" v-model.number="settings.crawlers.percentage" step="10" min="0" max="150" />
                    <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.crawlers.percentage" />
                </div>
                <div class="crawler-grid-row">
                    <checkbox-button
                        v-model="settings.crawlers.max"
                        :unchecked-color="null"
                        :style="{
                            '--color': settings.crawlers.max ? '0, 255, 0' : null,
                        }"
                    >
                        <span v-if="settings.crawlers.max" v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.crawlers.maxCount" />
                        <span v-else v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.crawlers.fixCount" />
                    </checkbox-button>
                    <input type="number" v-model.number="settings.crawlers.count" :disabled="settings.crawlers.max" />
                </div>
            </span>

            <template v-if="settings.mines != null">
                <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.mines" />
                <span class="mine-grid">
                    <o-building :building="BuildingType.metalMine" />
                    <input type="number" v-model.number="settings.mines.metalMine" />

                    <o-building :building="BuildingType.crystalMine" />
                    <input type="number" v-model.number="settings.mines.crystalMine" />

                    <o-building :building="BuildingType.deuteriumSynthesizer" />
                    <input type="number" v-model.number="settings.mines.deuteriumSynthesizer" />
                </span>
            </template>

            <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.lifeform" />
            <span class="lifeform-grid">
                <o-lifeform
                    v-for="lifeform in lifeforms"
                    :key="lifeform"
                    :lifeform="lifeform"
                    :disabled="lifeform != settings.lifeform"
                    @click="toggleLifeform(lifeform)"
                />
            </span>

            <template v-if="planetData != null && !productionMode">
                <span />
                <span>
                    <checkbox
                        v-model="settings.ignoreEmptyLifeformTechnologySlots"
                        :label="$i18n.$t.extension.empire.amortization.settings.planetSettings.ignoreEmptySlots"
                    />
                </span>
            </template>

            <span />
            <span>
                <button class="toggle-lifeform-settings" @click="showLifeformSettings = !showLifeformSettings" :disabled="settings.lifeform == 'none'">
                    <span class="mdi" :class="showLifeformSettings ? 'mdi-menu-up' : 'mdi-menu-down'" />
                    <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.lifeformSettings" />
                </button>
            </span>

            <template v-if="showLifeformSettings">
                <template v-if="settings.lifeformTechnologyLevels != null">
                    <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.relevantLifeformBuildings" />
                    <span class="lifeform-building-grid">
                        <template v-for="building in applicableLifeformBuildings">
                            <o-lifeform-building :key="`${building}-icon`" :building="building" />
                            <input :key="`${building}-input`" type="number" v-model.number="settings.lifeformBuildingLevels[building]" />
                        </template>
                    </span>
                </template>

                <span v-text="$i18n.$t.extension.empire.amortization.settings.planetSettings.lifeformTechnologies" />
                <span>
                    <span class="lifeform-tech-grid">
                        <span v-for="slot in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]" :key="`slot-${slot}`" class="row">
                            <hr v-if="slot == 7 || slot == 13" />

                            <o-lifeform-technology
                                v-for="lifeform in lifeforms"
                                :key="lifeformTechBySlot[slot][lifeform]"
                                :technology="lifeformTechBySlot[slot][lifeform]"
                                :disabled="getSelectedLifeformTechBySlot(slot) != lifeformTechBySlot[slot][lifeform]"
                                @click="toggleLifeformTech(lifeformTechBySlot[slot][lifeform])"
                            />

                            <span v-if="settings.lifeformTechnologyLevels == null" />
                            <input
                                v-else-if="getSelectedLifeformTechBySlot(slot) != null"
                                type="number"
                                v-model.number="settings.lifeformTechnologyLevels[getSelectedLifeformTechBySlot(slot)]"
                            />
                            <input v-else type="number" disabled />
                        </span>
                    </span>
                </span>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import { AnyBuildingCostAndTimeReductionLifeformBuildings, LifeformTechnologyBonusLifeformBuildings, LifeformTechnologyResearchBuildings, ResourceProductionBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologySlots, LifeformTechnologyType, LifeformTechnologyTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { createRecord } from '@/shared/utils/createRecord';
    import { _throw } from '@/shared/utils/_throw';
    import { ServerSettingsDataModule } from '@/views/stats/data/ServerSettingsDataModule';
    import { PropType } from 'vue';
    import { Component, Prop, VModel, Vue, Watch } from 'vue-property-decorator';
    import { getAverageTemperature } from '@/shared/models/ogame/resource-production/getAverageTemperature';
    import { AmortizationPlanetSettings } from '@/shared/models/empire/amortization/AmortizationPlanetSettings';
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';

    @Component({})
    export default class AmortizationPlanetSettingsInputs extends Vue {
        private readonly ShipType = ShipType;
        private readonly BuildingType = BuildingType;
        private readonly lifeforms = ValidLifeformTypes;
        private readonly slots: number[] = Array.from({ length: 18 }).map((_, i) => i + 1);

        private readonly lifeformTechBySlot: Record<number, Record<ValidLifeformType, LifeformTechnologyType>> = createRecord(
            this.slots,
            slot => createRecord(
                ValidLifeformTypes,
                lf => LifeformTechnologyTypesByLifeform[lf].find(tech => LifeformTechnologySlots[tech] == slot) ?? _throw('invalid slot')
            )
        );

        private getSelectedLifeformTechBySlot(slot: number): LifeformTechnologyType | null {
            const techs = Object.values(this.lifeformTechBySlot[slot]);
            return techs.find(tech => this.settings.activeLifeformTechnologies.includes(tech)) ?? null;
        }

        private readonly applicableBuildingTypes = [
            ...ResourceProductionBonusLifeformBuildings.filter(b => ResourceTypes.some(resource => b.appliesTo(resource))),
            ...LifeformTechnologyBonusLifeformBuildings,
            ...AnyBuildingCostAndTimeReductionLifeformBuildings,
            ...LifeformTechnologyResearchBuildings,
        ].map(b => b.type);

        private get applicableLifeformBuildings(): LifeformBuildingType[] {
            const lfBuildings = LifeformBuildingTypesByLifeform[this.settings.lifeform];
            return lfBuildings.filter(building => this.applicableBuildingTypes.includes(building));
        }

        @VModel({ required: true, type: Object as PropType<AmortizationPlanetSettings> })
        private settings!: AmortizationPlanetSettings;

        @Prop({ required: false, type: Object as PropType<PlanetData> })
        private planetData!: PlanetData | null;

        @Prop({ required: false, type: Boolean })
        private productionMode!: boolean;

        @Watch('settings', { immediate: true, deep: true })
        private onSettingsChanged() {
            const lifeform = this.settings.lifeform;
            if (lifeform == LifeformType.none) {
                return;
            }

            const planetData = this.planetData;
            if (this.settings.ignoreEmptyLifeformTechnologySlots && planetData != null) {
                const remove = this.settings.activeLifeformTechnologies.filter(tech => {
                    const slot = LifeformTechnologySlots[tech];

                    return !planetData.activeLifeformTechnologies.some(planetTech => slot == LifeformTechnologySlots[planetTech]);
                });

                if (remove.length > 0) {
                    this.settings.activeLifeformTechnologies = this.settings.activeLifeformTechnologies.filter(tech => !remove.includes(tech));
                }
            }
            else {
                const usedSlots = new Set<number>();
                this.settings.activeLifeformTechnologies.forEach(tech => {
                    usedSlots.add(LifeformTechnologySlots[tech]);
                });

                this.slots.forEach(slot => {
                    if (usedSlots.has(slot)) {
                        return;
                    }

                    this.settings.activeLifeformTechnologies.push(this.lifeformTechBySlot[slot][lifeform]);
                });
            }
        }

        @Watch('settings.position')
        private onAstrophysicsSettingsPlanetPositionChanged(newPosition: number) {
            this.settings.maxTemperature = getAverageTemperature(newPosition);
        }

        @Prop({ required: false, type: Boolean })
        private toggleable!: boolean;

        private readonly boosterItems = {
            metal: [
                ItemHash.metalBooster_bronze_7days,
                ItemHash.metalBooster_silver_7days,
                ItemHash.metalBooster_gold_7days,
                ItemHash.metalBooster_platinum_7days,
            ],
            crystal: [
                ItemHash.crystalBooster_bronze_7days,
                ItemHash.crystalBooster_silver_7days,
                ItemHash.crystalBooster_gold_7days,
                ItemHash.crystalBooster_platinum_7days,
            ],
            deuterium: [
                ItemHash.deuteriumBooster_bronze_7days,
                ItemHash.deuteriumBooster_silver_7days,
                ItemHash.deuteriumBooster_gold_7days,
                ItemHash.deuteriumBooster_platinum_7days,
            ],
        };

        private readonly boosterItemsMap: Partial<Record<ItemHash, ItemHash>> = {
            //metal
            [ItemHash.metalBooster_bronze_7days]: ItemHash.metalBooster_bronze_7days,
            [ItemHash.metalBooster_silver_7days]: ItemHash.metalBooster_silver_7days,
            [ItemHash.metalBooster_gold_7days]: ItemHash.metalBooster_gold_7days,
            [ItemHash.metalBooster_platinum_7days]: ItemHash.metalBooster_platinum_7days,

            [ItemHash.metalBooster_silver_30days]: ItemHash.metalBooster_silver_7days,
            [ItemHash.metalBooster_gold_30days]: ItemHash.metalBooster_gold_7days,
            [ItemHash.metalBooster_platinum_30days]: ItemHash.metalBooster_platinum_7days,

            [ItemHash.metalBooster_silver_90days]: ItemHash.metalBooster_silver_7days,
            [ItemHash.metalBooster_gold_90days]: ItemHash.metalBooster_gold_7days,
            [ItemHash.metalBooster_platinum_90days]: ItemHash.metalBooster_platinum_7days,

            //crystal
            [ItemHash.crystalBooster_bronze_7days]: ItemHash.crystalBooster_bronze_7days,
            [ItemHash.crystalBooster_silver_7days]: ItemHash.crystalBooster_silver_7days,
            [ItemHash.crystalBooster_gold_7days]: ItemHash.crystalBooster_gold_7days,
            [ItemHash.crystalBooster_platinum_7days]: ItemHash.crystalBooster_platinum_7days,

            [ItemHash.crystalBooster_silver_30days]: ItemHash.crystalBooster_silver_7days,
            [ItemHash.crystalBooster_gold_30days]: ItemHash.crystalBooster_gold_7days,
            [ItemHash.crystalBooster_platinum_30days]: ItemHash.crystalBooster_platinum_7days,

            [ItemHash.crystalBooster_silver_90days]: ItemHash.crystalBooster_silver_7days,
            [ItemHash.crystalBooster_gold_90days]: ItemHash.crystalBooster_gold_7days,
            [ItemHash.crystalBooster_platinum_90days]: ItemHash.crystalBooster_platinum_7days,

            // deuterium
            [ItemHash.deuteriumBooster_bronze_7days]: ItemHash.deuteriumBooster_bronze_7days,
            [ItemHash.deuteriumBooster_silver_7days]: ItemHash.deuteriumBooster_silver_7days,
            [ItemHash.deuteriumBooster_gold_7days]: ItemHash.deuteriumBooster_gold_7days,
            [ItemHash.deuteriumBooster_platinum_7days]: ItemHash.deuteriumBooster_platinum_7days,

            [ItemHash.deuteriumBooster_silver_30days]: ItemHash.deuteriumBooster_silver_7days,
            [ItemHash.deuteriumBooster_gold_30days]: ItemHash.deuteriumBooster_gold_7days,
            [ItemHash.deuteriumBooster_platinum_30days]: ItemHash.deuteriumBooster_platinum_7days,

            [ItemHash.deuteriumBooster_silver_90days]: ItemHash.deuteriumBooster_silver_7days,
            [ItemHash.deuteriumBooster_gold_90days]: ItemHash.deuteriumBooster_gold_7days,
            [ItemHash.deuteriumBooster_platinum_90days]: ItemHash.deuteriumBooster_platinum_7days,
        };

        private showLifeformSettings = false;


        private get isCrawlerOverloadEnabled() {
            return ServerSettingsDataModule.serverSettings.playerClasses.collector.crawlers.isOverloadEnabled;
        }

        private get activeBooster() {
            return {
                metal: this.boosterItems.metal.find(item => this.settings.activeItems.map(item => this.boosterItemsMap[item]).includes(item)),
                crystal: this.boosterItems.crystal.find(item => this.settings.activeItems.map(item => this.boosterItemsMap[item]).includes(item)),
                deuterium: this.boosterItems.deuterium.find(item => this.settings.activeItems.map(item => this.boosterItemsMap[item]).includes(item)),
            };
        }

        private toggleBooster(item: ItemHash, exclude: ItemHash[]) {
            const active = this.settings.activeItems
                .map(i => this.boosterItemsMap[i] as ItemHash)
                .filter(i => i == item || !exclude.includes(i));

            if (active.includes(item)) {
                this.settings.activeItems = active.filter(i => i != item);
            } else {
                this.settings.activeItems = [...active, item];
            }
        }

        private toggleLifeform(lifeform: LifeformType) {
            if (this.settings.lifeform == lifeform) {
                this.settings.lifeform = LifeformType.none;
                this.settings.activeLifeformTechnologies = [];
                this.showLifeformSettings = false;
                return;
            }

            this.settings.lifeform = lifeform;
            this.settings.activeLifeformTechnologies = LifeformTechnologyTypesByLifeform[this.settings.lifeform];
        }

        private toggleLifeformTech(tech: LifeformTechnologyType) {
            if (this.settings.activeLifeformTechnologies.includes(tech)) {
                this.settings.activeLifeformTechnologies = this.settings.activeLifeformTechnologies.filter(t => t != tech);
            }
            else {
                this.settings.activeLifeformTechnologies = this.settings.activeLifeformTechnologies.filter(t => LifeformTechnologySlots[t] != LifeformTechnologySlots[tech]);
                this.settings.activeLifeformTechnologies.push(tech);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .planet-settings {
        width: 330px;
        border: 1px solid rgba(var(--color), 0.5);
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        overflow: hidden;

        &.disabled {
            --color: 80, 80, 80;
            backdrop-filter: grayscale(0.5);
        }
    }

    .header {
        background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        text-align: center;
    }

    .header,
    .body {
        padding: 8px;
    }

    .body {
        display: grid;
        grid-template-columns: minmax(auto, 100px) 1fr;
        align-items: center;
        gap: 8px 16px;
    }

    input[type="number"] {
        width: 60px;
    }

    .item-grid {
        display: grid;
        grid-template-columns: repeat(4, auto);
        width: max-content;
        gap: 4px;

        > .o-item {
            cursor: pointer;
        }
    }

    .mine-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        row-gap: 4px;
        align-items: stretch;
    }

    .crawler-grid {
        display: grid;
        gap: 4px;

        &-row {
            display: flex;
            column-gap: 4px;
            align-items: center;
        }
    }

    .lifeform-grid {
        display: grid;
        gap: 4px;
        grid-template-columns: repeat(4, auto);
        width: max-content;

        .o-lifeform {
            cursor: pointer;
        }
    }

    .lifeform-tech-grid {
        display: grid;
        grid-template-columns: repeat(4, auto) 1fr;
        width: max-content;
        gap: 4px;

        .row {
            display: contents;
        }

        hr {
            grid-column: 1 / 6;
            width: 100%;
        }

        .o-lifeform-technology {
            cursor: pointer;
        }

        input[type="number"] {
            width: 50px;
        }
    }

    .lifeform-building-grid {
        display: grid;
        grid-template-columns: repeat(2, auto);
        width: max-content;
        gap: 4px;
    }
</style>