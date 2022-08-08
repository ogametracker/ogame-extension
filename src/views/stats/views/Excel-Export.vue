<template>
    <div>
        <h2 v-text="$i18n.$t.excelExport.header" />
        <span v-text="$i18n.$t.excelExport.chooseBelowMessage" />

        <div class="export-settings">
            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="$i18n.$t.excelExport.groups.expeditions.header" />
                </div>
                <div class="fake-table-body">
                    <checkbox v-model="exportOptions.expeditions.rawData" :label="$i18n.$t.excelExport.groups.expeditions.rawData" />

                    <checkbox v-model="exportOptions.expeditions.overviewPerDay" :label="$i18n.$t.excelExport.groups.expeditions.dailyOverview" />
                    <checkbox v-model="exportOptions.expeditions.depletionPerDay" :label="$i18n.$t.excelExport.groups.expeditions.dailyDepletion" />

                    <checkbox v-model="exportOptions.expeditions.resourcesPerDay.amount" :label="$i18n.$t.excelExport.groups.expeditions.dailyResources" />
                    <checkbox v-model="exportOptions.expeditions.resourcesPerDay.sizes" :label="$i18n.$t.excelExport.groups.expeditions.dailyResourceSizes" />

                    <checkbox v-model="exportOptions.expeditions.shipsPerDay.amount" :label="$i18n.$t.excelExport.groups.expeditions.dailyShips" />
                    <checkbox v-model="exportOptions.expeditions.shipsPerDay.sizes" :label="$i18n.$t.excelExport.groups.expeditions.dailyShipSizes" />

                    <checkbox v-model="exportOptions.expeditions.darkMatterPerDay.amount" :label="$i18n.$t.excelExport.groups.expeditions.dailyDarkMatter" />
                    <checkbox v-model="exportOptions.expeditions.darkMatterPerDay.sizes" :label="$i18n.$t.excelExport.groups.expeditions.dailyDarkMatterSizes" />
                </div>
            </div>

            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="$i18n.$t.excelExport.groups.combats.header" />
                </div>
                <div class="fake-table-body">
                    <checkbox v-model="exportOptions.combats.rawData" :label="$i18n.$t.excelExport.groups.combats.rawData" />

                    <checkbox v-model="exportOptions.combats.overviewPerDay" :label="$i18n.$t.excelExport.groups.combats.dailyResults" />
                    <checkbox v-model="exportOptions.combats.lootBalancePerDay" :label="$i18n.$t.excelExport.groups.combats.dailyLoot" />
                    <checkbox v-model="exportOptions.combats.lostShipsPerDay" :label="$i18n.$t.excelExport.groups.combats.dailyLostShips" />
                </div>
            </div>

            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="$i18n.$t.excelExport.groups.debrisFields.header" />
                </div>
                <div class="fake-table-body">
                    <checkbox v-model="exportOptions.debrisFields.rawData" :label="$i18n.$t.excelExport.groups.debrisFields.rawData" />

                    <checkbox v-model="exportOptions.debrisFields.resourcesPerDay" :label="$i18n.$t.excelExport.groups.debrisFields.dailyResources" />
                </div>
            </div>

            <div class="fake-table">
                <div class="fake-table-header">
                    <span v-text="$i18n.$t.excelExport.groups.lifeformDiscoveries.header" />
                </div>
                <div class="fake-table-body">
                    <checkbox v-model="exportOptions.lifeformDiscoveries.rawData" :label="$i18n.$t.excelExport.groups.lifeformDiscoveries.rawData" />

                    <checkbox v-model="exportOptions.lifeformDiscoveries.experiencePerDay" :label="$i18n.$t.excelExport.groups.lifeformDiscoveries.dailyExperience" />
                </div>
            </div>
        </div>

        <div class="export-area">
            <button v-text="$i18n.$t.excelExport.generateButton" @click="generateExport()" :disabled="!isAnyOptionSet || isExporting" />
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