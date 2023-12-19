<template>
    <div class="expedition-settings">
        <div class="header">
            <span v-text="$i18n.$t.extension.empire.amortization.settings.expeditionSettings.header" />
        </div>

        <div class="body">
            <span v-text="$i18n.$t.extension.empire.amortization.settings.expeditionSettings.averageWavesPerDay" />
            <span>
                <input type="number" v-model.number.lazy="settings.wavesPerDay" min="0" max="20" step="0.1" />
            </span>

            <span v-text="$i18n.$t.extension.empire.amortization.settings.expeditionSettings.items" />
            <span class="item-grid">
                <o-item v-for="item in slotItems" :key="item" :item="item" :disabled="!settings.items.includes(item)" @click="toggleItem(item)" />
            </span>

            <i v-text="$i18n.$t.extension.empire.amortization.settings.expeditionSettings.averageExpeditionsPerDay" />
            <i v-text="$i18n.$n(expeditionsPerDay)" />

            <span v-text="$i18n.$t.extension.empire.amortization.settings.expeditionSettings.shipUnitFactors" />
            <div class="resource-factors">
                <o-resource resource="metal" />
                <input type="number" v-model.number.lazy="settings.fleetUnitsFactors.metal" min="0" max="1" step="0.01" />

                <o-resource resource="crystal" />
                <input type="number" v-model.number.lazy="settings.fleetUnitsFactors.crystal" min="0" max="1" step="0.01" />

                <o-resource resource="deuterium" />
                <input type="number" v-model.number.lazy="settings.fleetUnitsFactors.deuterium" min="0" max="1" step="0.01" />
            </div>

            <span v-text="$i18n.$t.extension.empire.amortization.settings.expeditionSettings.topPlayerScore" />
            <span>
                <select v-model.number.lazy="settings.serverSettings.topScore">
                    <option v-for="(text, value) in topScores" :key="value" :value="value" v-text="text" />
                </select>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { AmortizationExpeditionSettings } from '@/shared/models/empire/amortization/AmortizationExpeditionSettings';
    import { Component, Prop, PropSync, Vue, VModel, Watch } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import { _throw } from '@/shared/utils/_throw';
    import { AmortizationExpeditionResultsBreakdown } from '@/shared/models/empire/amortization/AmortizationExpeditionResultsBreakdown';
    import { AmortizationPlayerSettings } from '@/shared/models/empire/amortization/AmortizationPlayerSettings';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import { getItemSlotBonus } from '@/shared/models/ogame/expeditions/getItemSlotBonus';
    import { createRecord } from '@/shared/utils/createRecord';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';

    @Component({})
    export default class AmortizationExpeditionSettingsInputs extends Vue {
        @VModel({ required: true, type: Object as PropType<AmortizationExpeditionSettings> })
        private settings!: AmortizationExpeditionSettings;

        @Prop({ required: true, type: Object as PropType<AmortizationPlayerSettings> })
        private playerSettings!: AmortizationPlayerSettings;

        @Prop({ required: true, type: Object as PropType<AmortizationExpeditionResultsBreakdown> })
        private breakdown!: AmortizationExpeditionResultsBreakdown;

        private get topScores(): Record<number, string> {
            return {
                0: `< ${this.$i18n.$n(100_000)}`,
                100_000: `< ${this.$i18n.$n(1_000_000)}`,
                1_000_000: `< ${this.$i18n.$n(5_000_000)}`,
                5_000_000: `< ${this.$i18n.$n(25_000_000)}`,
                25_000_000: `< ${this.$i18n.$n(50_000_000)}`,
                50_000_000: `< ${this.$i18n.$n(75_000_000)}`,
                75_000_000: `< ${this.$i18n.$n(100_000_000)}`,
                100_000_000: `≥ ${this.$i18n.$n(100_000_000)}`,
            };
        }

        private readonly slotItems: ItemHash[] = [
            ItemHash.expeditionslots_bronze_7days,
            ItemHash.expeditionslots_silver_7days,
            ItemHash.expeditionslots_gold_7days,
        ];

        private readonly slotItemsMap: Partial<Record<ItemHash, ItemHash>> = {
            [ItemHash.expeditionslots_bronze_7days]: ItemHash.expeditionslots_bronze_7days,
            [ItemHash.expeditionslots_bronze_7days_pts]: ItemHash.expeditionslots_bronze_7days,
            [ItemHash.expeditionslots_silver_7days]: ItemHash.expeditionslots_silver_7days,
            [ItemHash.expeditionslots_silver_7days_pts]: ItemHash.expeditionslots_silver_7days,
            [ItemHash.expeditionslots_gold_7days]: ItemHash.expeditionslots_gold_7days,
            [ItemHash.expeditionslots_gold_7days_pts]: ItemHash.expeditionslots_gold_7days,

            [ItemHash.expeditionslots_bronze_30days]: ItemHash.expeditionslots_bronze_7days,
            [ItemHash.expeditionslots_bronze_30days_pts]: ItemHash.expeditionslots_bronze_7days,
            [ItemHash.expeditionslots_silver_30days]: ItemHash.expeditionslots_silver_7days,
            [ItemHash.expeditionslots_silver_30days_pts]: ItemHash.expeditionslots_silver_7days,
            [ItemHash.expeditionslots_gold_30days]: ItemHash.expeditionslots_gold_7days,
            [ItemHash.expeditionslots_gold_30days_pts]: ItemHash.expeditionslots_gold_7days,

            [ItemHash.expeditionslots_bronze_90days]: ItemHash.expeditionslots_bronze_7days,
            [ItemHash.expeditionslots_bronze_90days_pts]: ItemHash.expeditionslots_bronze_7days,
            [ItemHash.expeditionslots_silver_90days]: ItemHash.expeditionslots_silver_7days,
            [ItemHash.expeditionslots_silver_90days_pts]: ItemHash.expeditionslots_silver_7days,
            [ItemHash.expeditionslots_gold_90days]: ItemHash.expeditionslots_gold_7days,
            [ItemHash.expeditionslots_gold_90days_pts]: ItemHash.expeditionslots_gold_7days,
        };

        @Watch('settings', { immediate: true, deep: true })
        @Watch('playerSettings', { immediate: true, deep: true })
        private onSettingsChanged() {
            const mapItems = (Object.keys(this.slotItemsMap) as ItemHash[]).filter(i => !this.slotItems.includes(i));
            mapItems.forEach(item => {
                const index = this.settings.items.indexOf(item);
                if (index < 0) {
                    return;
                }

                this.settings.items.splice(index, 1, this.slotItemsMap[item] ?? _throw(`missing item configuration for '${item}'`));
            });

            this.breakdown.options.playerClass = this.playerSettings.playerClass;
            this.breakdown.options.admiral = this.playerSettings.officers.admiral;
            this.breakdown.options.astrophysicsLevel = this.playerSettings.levelAstrophysics;
            this.breakdown.options.itemBonusSlots = getItemSlotBonus(createRecord(this.settings.items, _ => 'permanent' as const));
            this.breakdown.options.fleetFindsResourceFactors = this.settings.fleetUnitsFactors;
            this.breakdown.options.serverSettings = this.settings.serverSettings;

            if (this.topScores[this.settings.serverSettings.topScore] == null) {
                this.settings.serverSettings.topScore = Object.keys(this.topScores)
                    .map(k => parseIntSafe(k))
                    .sort((a, b) => b - a)
                    .find(score => score <= this.settings.serverSettings.topScore)
                    ?? _throw('failed to find matching top score');
            }
        }

        private get expeditionsPerDay() {
            return this.breakdown.slots * this.settings.wavesPerDay;
        }

        private toggleItem(item: ItemHash) {
            const index = this.settings.items.indexOf(item);
            if (index < 0) {
                this.settings.items.push(item);
            }
            else {
                this.settings.items.splice(index, 1);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .expedition-settings {
        width: 300px;
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

    .header,
    .body {
        padding: 8px;
    }
    .header {
        background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        text-align: center;
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

    .topScore {
        width: 100%;
    }

    .item-grid {
        display: grid;
        grid-template-columns: repeat(3, auto);
        width: max-content;
        gap: 4px;

        > .o-item {
            cursor: pointer;
        }
    }

    .resource-factors {
        display: grid;
        grid-template-columns: auto 1fr;
        width: max-content;
        gap: 4px;
    }
</style>