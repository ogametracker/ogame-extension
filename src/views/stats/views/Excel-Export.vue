<template>
    <div>
        <h3 v-text="translations().extension.excelExport.header" />
        <span v-text="translations().extension.excelExport.chooseBelowMessage" />

        <div class="export-settings">
            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="translations().extension.excelExport.groups.expeditions.header" />
                </div>
                <div class="fake-table-body">
                    <Checkbox
                        v-model="exportOptions.expeditions.rawData"
                        :label="translations().extension.excelExport.groups.expeditions.rawData"
                    />

                    <Checkbox
                        v-model="exportOptions.expeditions.overviewPerDay"
                        :label="translations().extension.excelExport.groups.expeditions.dailyOverview"
                    />
                    <Checkbox
                        v-model="exportOptions.expeditions.depletionPerDay"
                        :label="translations().extension.excelExport.groups.expeditions.dailyDepletion"
                    />

                    <Checkbox
                        v-model="exportOptions.expeditions.resourcesPerDay.amount"
                        :label="translations().extension.excelExport.groups.expeditions.dailyResources"
                    />
                    <Checkbox
                        v-model="exportOptions.expeditions.resourcesPerDay.sizes"
                        :label="translations().extension.excelExport.groups.expeditions.dailyResourceSizes"
                    />

                    <Checkbox
                        v-model="exportOptions.expeditions.shipsPerDay.amount"
                        :label="translations().extension.excelExport.groups.expeditions.dailyShips"
                    />
                    <Checkbox
                        v-model="exportOptions.expeditions.shipsPerDay.sizes"
                        :label="translations().extension.excelExport.groups.expeditions.dailyShipSizes"
                    />

                    <Checkbox
                        v-model="exportOptions.expeditions.darkMatterPerDay.amount"
                        :label="translations().extension.excelExport.groups.expeditions.dailyDarkMatter"
                    />
                    <Checkbox
                        v-model="exportOptions.expeditions.darkMatterPerDay.sizes"
                        :label="translations().extension.excelExport.groups.expeditions.dailyDarkMatterSizes"
                    />
                </div>
            </div>

            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="translations().extension.excelExport.groups.combats.header" />
                </div>
                <div class="fake-table-body">
                    <Checkbox
                        v-model="exportOptions.combats.rawData"
                        :label="translations().extension.excelExport.groups.combats.rawData"
                    />

                    <Checkbox
                        v-model="exportOptions.combats.overviewPerDay"
                        :label="translations().extension.excelExport.groups.combats.dailyResults"
                    />
                    <Checkbox
                        v-model="exportOptions.combats.lootBalancePerDay"
                        :label="translations().extension.excelExport.groups.combats.dailyLoot"
                    />
                    <Checkbox
                        v-model="exportOptions.combats.lostShipsPerDay"
                        :label="translations().extension.excelExport.groups.combats.dailyLostShips"
                    />
                </div>
            </div>

            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="translations().extension.excelExport.groups.debrisFields.header" />
                </div>
                <div class="fake-table-body">
                    <Checkbox
                        v-model="exportOptions.debrisFields.rawData"
                        :label="translations().extension.excelExport.groups.debrisFields.rawData"
                    />

                    <Checkbox
                        v-model="exportOptions.debrisFields.resourcesPerDay"
                        :label="translations().extension.excelExport.groups.debrisFields.dailyResources"
                    />
                </div>
            </div>

            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="translations().extension.excelExport.groups.lifeformDiscoveries.header" />
                </div>
                <div class="fake-table-body">
                    <Checkbox
                        v-model="exportOptions.lifeformDiscoveries.rawData"
                        :label="translations().extension.excelExport.groups.lifeformDiscoveries.rawData"
                    />

                    <Checkbox
                        v-model="exportOptions.lifeformDiscoveries.experiencePerDay"
                        :label="translations().extension.excelExport.groups.lifeformDiscoveries.dailyExperience"
                    />
                </div>
            </div>
        </div>

        <div class="export-area">
            <button
                v-text="translations().extension.excelExport.generateButton"
                @click="generateExport()"
                :disabled="!isAnyOptionSet || isExporting"
            />
            <LoadingSpinner v-if="isExporting" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from '@stats/components/common/Checkbox.vue';
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import { ExcelExport as Export } from '@stats/models/excel-export';
import type { ExcelExportOptions } from '@stats/models/excel-export';
import { format } from 'date-fns';

const exportOptions = ref<ExcelExportOptions>({
    expeditions: {
        rawData: false,
        overviewPerDay: false,
        depletionPerDay: false,

        resourcesPerDay: {
            amount: false,
            sizes: false,
        },
        shipsPerDay: {
            amount: false,
            sizes: false,
        },
        darkMatterPerDay: {
            amount: false,
            sizes: false,
        },
    },

    combats: {
        rawData: false,
        overviewPerDay: false,
        lootBalancePerDay: false,
        lostShipsPerDay: false,
    },

    debrisFields: {
        rawData: false,
        resourcesPerDay: false,
    },

    lifeformDiscoveries: {
        rawData: false,
        experiencePerDay: false,
    },
});

const isExporting = ref(false);

const isAnyOptionSet = computed(() => {
    const isSet = (obj: Record<string, any>): boolean => {
        return Object.values(obj).some(value => {
            if (typeof value === 'boolean') {
                return value;
            }
            return isSet(value);
        });
    };

    return isSet(exportOptions.value);
});

async function generateExport() {
    isExporting.value = true;
    await Export.create(exportOptions.value, `OGame Tracker ${format(Date.now(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`);
    isExporting.value = false;
}
</script>

<style lang="scss" scoped>
.export-settings {
    display: flex;
    flex-direction: row;
    gap: 16px;
}

.export-area {
    margin-top: 8px;
    display: inline-flex;
    flex-direction: column;
}

.fake-table {
    max-width: 400px;
    border: 1px solid rgba(var(--color), 0.5);
    grid-template-rows: auto 1fr;
    border-radius: 4px;
    display: grid;
    width: fit-content;

    &-header {
        height: 100%;
        background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        justify-content: center;
        align-items: center;
        padding: 8px;
        display: flex;
    }

    &-body {
        height: 100%;
        padding: 8px;
        display: flex;
        flex-direction: column;
        justify-content: start;
    }
}
</style>
