<template>
    <div class="expedition-settings">
        <div class="header">
            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.header" />
        </div>

        <div class="body">
            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.averageWavesPerDay" />
            <span>
                <input type="number" v-model.number.lazy="settings.wavesPerDay" min="0" max="20" step="0.1" />
            </span>

            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.items" />
            <span class="item-grid">
                <OItem v-for="item in slotItems" :key="item" :item="item" :disabled="!settings.items.includes(item)" @click="toggleItem(item)" />
            </span>

            <i v-text="translations().extension.empire.amortization.settings.expeditionSettings.averageExpeditionsPerDay" />
            <i v-text="formatNumber(expeditionsPerDay)" />

            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.shipUnitFactors" />
            <div class="resource-factors">
                <OResource :resource="ResourceType.metal" />
                <input type="number" v-model.number.lazy="settings.fleetUnitsFactors.metal" min="0" max="1" step="0.01" />

                <OResource :resource="ResourceType.crystal" />
                <input type="number" v-model.number.lazy="settings.fleetUnitsFactors.crystal" min="0" max="1" step="0.01" />

                <OResource :resource="ResourceType.deuterium" />
                <input type="number" v-model.number.lazy="settings.fleetUnitsFactors.deuterium" min="0" max="1" step="0.01" />
            </div>

            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.topPlayerScore" />
            <span>
                <select v-model.number.lazy="settings.serverSettings.topScore">
                    <option v-for="(text, value) in topScores" :key="value" :value="value" v-text="text" />
                </select>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import OItem from '@ogame-tracker/view-shared/components/ogame/OItem.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import { computed, watch } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import type { AmortizationExpeditionSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationExpeditionSettings';
import type { PropType } from 'vue';
import { ItemHash } from '@ogame-tracker/shared/models/ogame/items/ItemHash';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { AmortizationExpeditionResultsBreakdown } from '@ogame-tracker/shared/models/empire/amortization/AmortizationExpeditionResultsBreakdown';
import type { AmortizationPlayerSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationPlayerSettings';
import { getItemSlotBonus } from '@ogame-tracker/shared/models/ogame/expeditions/getItemSlotBonus';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';

const props = defineProps({
    playerSettings: { required: true, type: Object as PropType<AmortizationPlayerSettings> },
    breakdown: { required: true, type: Object as PropType<AmortizationExpeditionResultsBreakdown> },
});

const settings = defineModel<AmortizationExpeditionSettings>({ required: true, type: Object as PropType<AmortizationExpeditionSettings> });

const topScores = computed<Record<number, string>>(() => {
    return {
        0: `< ${formatNumber(100_000)}`,
        100_000: `< ${formatNumber(1_000_000)}`,
        1_000_000: `< ${formatNumber(5_000_000)}`,
        5_000_000: `< ${formatNumber(25_000_000)}`,
        25_000_000: `< ${formatNumber(50_000_000)}`,
        50_000_000: `< ${formatNumber(75_000_000)}`,
        75_000_000: `< ${formatNumber(100_000_000)}`,
        100_000_000: `≥ ${formatNumber(100_000_000)}`,
    };
});

const slotItems: ItemHash[] = [
    ItemHash.expeditionslots_bronze_7days,
    ItemHash.expeditionslots_silver_7days,
    ItemHash.expeditionslots_gold_7days,
];

const slotItemsMap: Partial<Record<ItemHash, ItemHash>> = {
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

function onSettingsChanged() {
    const mapItems = (Object.keys(slotItemsMap) as ItemHash[]).filter(i => !slotItems.includes(i));
    mapItems.forEach(item => {
        const index = settings.value.items.indexOf(item);
        if (index < 0) {
            return;
        }

        settings.value.items.splice(index, 1, slotItemsMap[item] ?? _throw(`missing item configuration for '${item}'`));
    });

    props.breakdown.options.playerClass = props.playerSettings.playerClass;
    props.breakdown.options.admiral = props.playerSettings.officers.admiral;
    props.breakdown.options.astrophysicsLevel = props.playerSettings.levelAstrophysics;
    props.breakdown.options.itemBonusSlots = getItemSlotBonus(createRecord(settings.value.items, _ => 'permanent' as const));
    props.breakdown.options.fleetFindsResourceFactors = settings.value.fleetUnitsFactors;
    props.breakdown.options.serverSettings = settings.value.serverSettings;

    if (topScores.value[settings.value.serverSettings.topScore] == null) {
        settings.value.serverSettings.topScore = Object.keys(topScores.value)
            .map(k => parseIntSafe(k))
            .sort((a, b) => b - a)
            .find(score => score <= settings.value.serverSettings.topScore)
            ?? _throw('failed to find matching top score');
    }
}

const expeditionsPerDay = computed(() => props.breakdown.slots * settings.value.wavesPerDay);

function toggleItem(item: ItemHash) {
    const index = settings.value.items.indexOf(item);
    if (index < 0) {
        settings.value.items.push(item);
    }
    else {
        settings.value.items.splice(index, 1);
    }
}

watch(() => settings.value, onSettingsChanged, { immediate: true, deep: true });

watch(() => props.playerSettings, onSettingsChanged, { immediate: true, deep: true });
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
