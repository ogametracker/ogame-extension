<template>
    <div ref="rootElement" class="item-chart" :style="{ '--ticks': ticks }">
        <div class="day-column" v-for="(itemHashes, x) in itemsPerDays" :key="x">
            <div class="day-items">
                <OItem v-for="(item, j) in itemHashes" :key="j" :item="item" />
            </div>

            <div class="day-label">
                <span v-text="formatEventDate(x)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import OItem from '@ogame-tracker/view-shared/components/ogame/OItem.vue';
import { computed, onMounted, useTemplateRef } from 'vue';
import { formatDate } from '@stats/i18n';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import { startOfDay, subDays } from 'date-fns';
import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/esm/addDays/index';
import { ItemHash } from '@ogame-tracker/shared/models/ogame/items/ItemHash';

const expeditionStore = useExpeditionStore();

const rootElement = useTemplateRef<HTMLElement>('rootElement');

const ticks = 30;

const minDay = computed(() => {
    const firstDay = expeditionStore.firstDay;
    const today = startOfDay(Date.now());
    return Math.min(firstDay, subDays(today, ticks - 1).getTime());
});

const itemsPerDays = computed<ItemHash[][]>(() => {
    const perDay = expeditionStore.dailyResults;
    const firstDay = minDay.value;
    const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
    const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

    const itemsPerDay = days.map(day => (perDay[day] ?? null)?.findings.items ?? []);
    while (itemsPerDay.length < ticks) {
        itemsPerDay.push([]);
    }

    return itemsPerDay;
});

function formatEventDate(x: number): string {
    const firstDay = minDay.value;
    const day = addDays(firstDay, x);

    return formatDate(day, 'date');
}

onMounted(() => {
    rootElement.value!.scrollLeft = rootElement.value!.scrollWidth - rootElement.value!.clientWidth;
});
</script>

<style lang="scss" scoped>
.item-chart {
    width: 100%;
    height: 310px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-left: 16px; // to leave some space to the left for the x-label

    .day-column {
        height: 100%;
        min-width: calc(100% / var(--ticks));
        max-width: calc(100% / var(--ticks));
        display: grid;
        grid-template-rows: 1fr 100px;

        .day-items {
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            row-gap: 2px;
            // vertical line in center
            background-image: linear-gradient(
                to right,
                transparent 0%,
                transparent calc(50% - 1px),
                rgba(255, 255, 255, 0.1) calc(50% - 1px),
                rgba(255, 255, 255, 0.1) calc(50% + 1px),
                transparent calc(50% + 1px),
                transparent 100%
            );
        }

        .day-label {
            position: relative;
            overflow: visible;

            > span {
                position: absolute;
                top: 0;
                left: 50%;
                transform-origin: top right;
                transform: translateX(-100%) translateY(4px) rotate(-45deg);
                white-space: pre;
                color: #888;
                font-size: 12px;
            }
        }
    }
}
</style>
