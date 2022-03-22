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
                <span v-text="'LOCA: Show in result'" />
                <checkbox v-model="settings.show" />
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
            <span class="crawler-grid">
                <div class="crawler-grid-row">
                    <o-ship
                        ship="crawler"
                        :disabled="settings.crawlers.enabled"
                        @click="
                            settings.crawlers.enabled =
                                !settings.crawlers.enabled
                        "
                    />
                    <checkbox-button
                        v-model="settings.crawlers.overload"
                        color="#00ff00"
                    >
                        LOCA: Overload
                    </checkbox-button>
                </div>
                <div class="crawler-grid-row">
                    <checkbox-button
                        v-model="settings.crawlers.max"
                        :unchecked-color="null"
                        :style="{
                            '--color': settings.crawlers.max
                                ? '0, 255, 0'
                                : null,
                        }"
                    >
                        <span
                            v-if="settings.crawlers.max"
                            v-text="'LOCA: Max-Count'"
                        />
                        <span v-else v-text="'LOCA: Fix Count'" />
                    </checkbox-button>
                    <input
                        type="number"
                        :value="settings.crawlers.count"
                        :disabled="settings.crawlers.max"
                    />
                </div>
            </span>

            <template v-if="settings.mines != null">
                <span>LOCA: Mines</span>
                <span class="mine-grid">
                    <o-building
                        building="metal-mine"
                        :disabled="!settings.mines.metalMine.show"
                        @click="
                            settings.mines.metalMine.show =
                                !settings.mines.metalMine.show
                        "
                    />
                    <input
                        type="number"
                        v-model="settings.mines.metalMine.level"
                    />

                    <o-building
                        building="crystal-mine"
                        :disabled="!settings.mines.crystalMine.show"
                        @click="
                            settings.mines.crystalMine.show =
                                !settings.mines.crystalMine.show
                        "
                    />
                    <input
                        type="number"
                        v-model="settings.mines.crystalMine.level"
                    />

                    <o-building
                        building="deuterium-synthesizer"
                        :disabled="!settings.mines.deuteriumSynthesizer.show"
                        @click="
                            settings.mines.deuteriumSynthesizer.show =
                                !settings.mines.deuteriumSynthesizer.show
                        "
                    />
                    <input
                        type="number"
                        v-model="settings.mines.deuteriumSynthesizer.level"
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

    interface MineSettings {
        level: number;
        show: boolean;
    }

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
            count: number;
            max: boolean;
        };

        mines?: {
            metalMine: MineSettings;
            crystalMine: MineSettings;
            deuteriumSynthesizer: MineSettings;
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

    .crawler-grid {
        display: grid;
        gap: 4px;

        &-row {
            display: flex;
            column-gap: 4px;
            height: 32px;
        }
    }
</style>