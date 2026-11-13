<template>
    <div class="expedition-settings">
        <div class="header">
            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.header" />
        </div>

        <div class="body">
            <span
                v-text="translations().extension.empire.amortization.settings.expeditionSettings.averageWavesPerDay"
            />
            <span>
                <input type="number" v-model.number.lazy="settings.wavesPerDay" min="0" max="20" step="0.1" />
            </span>

            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.slotItems" />
            <span class="item-grid">
                <OItem
                    v-for="item in slotItems"
                    :key="item"
                    :item="item"
                    :disabled="!settings.items.includes(item)"
                    @click="toggleItem(item)"
                />
            </span>

            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.resourceFindItems" />
            <label class="item-resource-boost">
                <input
                    type="number"
                    :value="settings.itemResourceBoost"
                    @input="setItemResourceBoost($event)"
                    min="0"
                    step="any"
                    :aria-label="
                        translations().extension.empire.amortization.settings.expeditionSettings.resourceFindItems
                    "
                />
                <span>%</span>
            </label>

            <span
                v-text="translations().extension.empire.amortization.settings.expeditionSettings.improvedChanceItems"
            />
            <span class="item-grid">
                <OItem
                    v-for="item in chanceBonusItems"
                    :key="item"
                    :item="item"
                    :disabled="!settings.items.includes(item)"
                    @click="toggleItem(item)"
                />
            </span>

            <i
                v-text="
                    translations().extension.empire.amortization.settings.expeditionSettings.averageExpeditionsPerDay
                "
            />
            <i v-text="formatNumber(expeditionsPerDay)" />

            <span v-text="translations().extension.empire.amortization.settings.expeditionSettings.shipUnitFactors" />
            <div class="resource-factors">
                <OResource :resource="ResourceType.metal" />
                <input
                    type="number"
                    v-model.number.lazy="settings.fleetUnitsFactors.metal"
                    min="0"
                    max="1"
                    step="0.01"
                />

                <OResource :resource="ResourceType.crystal" />
                <input
                    type="number"
                    v-model.number.lazy="settings.fleetUnitsFactors.crystal"
                    min="0"
                    max="1"
                    step="0.01"
                />

                <OResource :resource="ResourceType.deuterium" />
                <input
                    type="number"
                    v-model.number.lazy="settings.fleetUnitsFactors.deuterium"
                    min="0"
                    max="1"
                    step="0.01"
                />
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
import { Items, type ItemId } from '@ogame-tracker/shared/models/ogame/items/Items.generated';
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

const settings = defineModel<AmortizationExpeditionSettings>({
    required: true,
    type: Object as PropType<AmortizationExpeditionSettings>,
});

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

const slotItems: ItemId[] = [
    'expeditionslots_1slot_7days',
    'expeditionslots_2slots_7days',
    'expeditionslots_3slots_7days',
];

const chanceBonusItems: ItemId[] = ['expedition_improvedChances_7days'];

function onSettingsChanged() {
    const selected = settings.value.items.map(id => {
        const effect = Items[id]?.effect;
        if (effect?.type !== 'expeditionSlots') {
            return id;
        }
        const canonicalItem = slotItems.find(option => {
            const optionEffect = Items[option]?.effect;
            return optionEffect?.type === 'expeditionSlots' && optionEffect.value === effect.value;
        });
        return canonicalItem ?? id;
    });
    const unique = [...new Set(selected)];
    if (unique.length !== settings.value.items.length || unique.some((id, i) => id !== settings.value.items[i])) {
        settings.value.items = unique;
    }

    props.breakdown.options.playerClass = props.playerSettings.playerClass;
    props.breakdown.options.admiral = props.playerSettings.officers.admiral;
    props.breakdown.options.astrophysicsLevel = props.playerSettings.levelAstrophysics;
    props.breakdown.options.itemBonusSlots = getItemSlotBonus(
        createRecord(settings.value.items, _ => 'permanent' as const),
    );
    props.breakdown.options.fleetFindsResourceFactors = settings.value.fleetUnitsFactors;
    props.breakdown.options.itemResourceBoost = settings.value.itemResourceBoost;
    props.breakdown.options.improvedChancesItemActive = settings.value.items.some(
        id => Items[id]?.effect?.type === 'expeditionImprovedChances',
    );
    props.breakdown.options.serverSettings = settings.value.serverSettings;

    if (topScores.value[settings.value.serverSettings.topScore] == null) {
        settings.value.serverSettings.topScore =
            Object.keys(topScores.value)
                .map(k => parseIntSafe(k))
                .sort((a, b) => b - a)
                .find(score => score <= settings.value.serverSettings.topScore)
            ?? _throw('failed to find matching top score');
    }
}

const expeditionsPerDay = computed(() => props.breakdown.slots * settings.value.wavesPerDay);

function toggleItem(item: ItemId) {
    const index = settings.value.items.indexOf(item);
    if (index < 0) {
        settings.value.items.push(item);
        return true;
    } else {
        settings.value.items.splice(index, 1);
        return false;
    }
}

function setItemResourceBoost(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    settings.value.itemResourceBoost = Number.isFinite(value) ? Math.max(0, value) : 0;
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

input[type='number'] {
    width: 60px;
}

.topScore {
    width: 100%;
}

.item-resource-boost {
    display: flex;
    align-items: center;
    gap: 4px;
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
