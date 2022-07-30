<template>
    <div>
        <h2 v-text="'LOCA: Excel Export'" />
        <span v-text="'LOCA: Choose below what data you want to export:'" />

        <div class="export-settings">
            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="'LOCA: Expeditions'" />
                </div>
                <div class="fake-table-body">
                    <checkbox v-model="exportOptions.expeditions.rawData" :label="'LOCA: Raw Data (includes all tracked expedition data)'" />

                    <checkbox v-model="exportOptions.expeditions.overviewPerDay" :label="'LOCA: Overview of results per day'" />

                    <checkbox v-model="exportOptions.expeditions.resourcesPerDay.amount" :label="'LOCA: Found resources per day'" />
                    <checkbox v-model="exportOptions.expeditions.resourcesPerDay.sizes" :label="'LOCA: Sizes of resource findings per day'" />

                    <checkbox v-model="exportOptions.expeditions.shipsPerDay.amount" :label="'LOCA: Found ships per day'" />
                    <checkbox v-model="exportOptions.expeditions.shipsPerDay.sizes" :label="'LOCA: Sizes of fleet findings per day'" />

                    <checkbox v-model="exportOptions.expeditions.darkMatterPerDay.amount" :label="'LOCA: Found dark matter per day'" />
                    <checkbox v-model="exportOptions.expeditions.darkMatterPerDay.sizes" :label="'LOCA: Sizes of dark matter findings per day'" />
                </div>
            </div>

            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="'LOCA: Combats'" />
                </div>
                <div class="fake-table-body">
                    <checkbox v-model="exportOptions.combats.rawData" :label="'LOCA: Raw Data (includes all tracked combat data)'" />

                    <checkbox v-model="exportOptions.combats.overviewPerDay" :label="'LOCA: Combat results per day'" />
                    <checkbox v-model="exportOptions.combats.lootBalancePerDay" :label="'LOCA: Loot balance per day'" />
                    <checkbox v-model="exportOptions.combats.lostShipsPerDay" :label="'LOCA: Lost ships per day'" />
                </div>
            </div>

            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="'LOCA: Debris Fields'" />
                </div>
                <div class="fake-table-body">
                    <checkbox v-model="exportOptions.debrisFields.rawData" :label="'LOCA: Raw Data (includes all tracked debris field report data)'" />

                    <checkbox v-model="exportOptions.debrisFields.resourcesPerDay" :label="'LOCA: Harvested resources per day'" />
                </div>
            </div>
        </div>

        <div class="export-area">
            <button v-text="'LOCA: Generate Excel file'" @click="generateExport()" :disabled="!isAnyOptionSet || isExporting" />
            <loading-spinner v-if="isExporting" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ExcelExport as Export, ExcelExportOptions } from '@/views/stats/models/excel-export';
    import { format } from 'date-fns';

    @Component({})
    export default class ExcelExport extends Vue {
        private readonly exportOptions: ExcelExportOptions = {
            expeditions: {
                rawData: false,
                overviewPerDay: false,

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
        };

        private isExporting = false;

        private get isAnyOptionSet() {
            const isSet = (obj: Record<string, any>): boolean => {
                return Object.values(obj).some(value => {
                    if(typeof value === 'boolean') {
                        return value;
                    }
                    return isSet(value);
                });
            }

            return isSet(this.exportOptions);
        }


        private async generateExport() {
            this.isExporting = true;
            await Export.create(this.exportOptions, `OGame Tracker ${format(Date.now(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`);
            this.isExporting = false;
        }
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