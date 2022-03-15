<template>
    <div class="planet-settings">
        <div class="header">
            <span v-text="settings.name" />
            <span v-if="settings.coordinates != null">
                [{{ settings.coordinates.galaxy }}:{{
                    settings.coordinates.system
                }}:{{ settings.coordinates.position }}]
            </span>
        </div>

        <div class="body">
            <template v-if="toggleable">
                <span style="grid-column: 1 / span 2">
                    <checkbox
                        v-model="settings.show"
                        :label="'LOCA: Show in result'"
                    />
                </span>
            </template>

            <span>LOCA: Position</span>
            <span>
                <input
                    type="number"
                    v-model.number="settings.position"
                    min="1"
                    max="15"
                    step="1"
                />
            </span>

            <span>LOCA: Temperature</span>
            <span>
                <input
                    type="number"
                    v-model.number="settings.maxTemperature"
                    min="-130"
                    max="260"
                    step="1"
                />
            </span>

            <span>LOCA: Items</span>
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

            <span>LOCA: Crawlers</span>
            <span>
                <o-ship ship="crawler" :disabled="settings.crawlers.enabled" />
                <checkbox-button v-model="settings.crawlers.overload">
                    LOCA: Overload
                </checkbox-button>

                <button :value="settings.crawlers.count == 'max'">
                    LOCA: Max-Count
                </button>
                <input
                    type="number"
                    :value="settings.crawlers.count"
                    v-if="settings.crawlers.count != 'max'"
                />
            </span>

            <template v-if="settings.mineLevels != null">
                <span>LOCA: Mine Levels</span>
                <span class="mine-grid">
                    <o-building building="metal-mine" />
                    <input
                        type="number"
                        v-model="settings.mineLevels.metalMine"
                    />

                    <o-building building="crystal-mine" />
                    <input
                        type="number"
                        v-model="settings.mineLevels.crystalMine"
                    />

                    <o-building building="deuterium-synthesizer" />
                    <input
                        type="number"
                        v-model="settings.mineLevels.deuteriumSynthesizer"
                    />
                </span>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import { PropType } from 'vue';
    import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

    export interface AmortizationPlanetSettings {
        show: boolean;
        id: number;
        name: string;
        coordinates?: Coordinates;
        position: number;
        maxTemperature: number;

        activeItems: ItemHash[];
        crawlers: {
            enabled: boolean;
            overload: boolean;
            count: 'max' | number;
        };

        mineLevels?: {
            metalMine: number;
            crystalMine: number;
            deuteriumSynthesizer: number;
        };
    }

    @Component({})
    export default class AmortizationPlanetSettingsInputs extends Vue {
        @VModel({ required: true, type: Object as PropType<AmortizationPlanetSettings> })
        private settings!: AmortizationPlanetSettings;

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

        private get activeBooster() {
            return {
                metal: this.boosterItems.metal.find(item => this.settings.activeItems.includes(item)),
                crystal: this.boosterItems.crystal.find(item => this.settings.activeItems.includes(item)),
                deuterium: this.boosterItems.deuterium.find(item => this.settings.activeItems.includes(item)),
            };
        }

        private toggleBooster(item: ItemHash, exclude: ItemHash[]) {
            const active = this.settings.activeItems.filter(i => i == item || !exclude.includes(i));

            if (this.settings.activeItems.includes(item)) {
                this.settings.activeItems = active.filter(i => i != item);
            } else {
                this.settings.activeItems = [...active, item];
            }
        }
    }
</script>
<style lang="scss" scoped>
    .planet-settings {
        border: 1px solid rgba(var(--color), 0.5);
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        overflow: hidden;
        width: max-content;
    }

    .header {
        background: black
            linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.5));
        text-align: center;
    }

    .header,
    .body {
        padding: 8px;
    }

    .body {
        display: grid;
        grid-template-columns: auto 1fr;
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

        .o-building {
            cursor: pointer;
        }
    }
</style>