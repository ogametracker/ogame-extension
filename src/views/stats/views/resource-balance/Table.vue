<template>
    <div class="table-container">
        <div>
            <ranged-stats-table :dataItems="events" :items="items" :footerItems="footerItems" show-average :averageNumberFormatOptions="avgNumberFormat">
                <template #cell-label="{ value }">
                    <span v-text="value" class="mr-2" />

                    <o-resource :resource="resourceTypes[value]" :size="resourceIconSize" />
                </template>
            </ranged-stats-table>
        </div>

        <floating-menu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <conversion-rate-settings />
            <show-converted-resources-in-cells-settings />
            <hr class="two-column" />
            <expedition-ship-resource-units-factor-settings />
            <lost-ship-resource-units-factor-settings />
            <hr class="two-column" />
            <include-ships-found-on-expeditions-in-resource-balance-settings />
            <include-ships-lost-in-combats-in-resource-balance />
            <IncludeLostLootResourcesInResourceBalance />
            <hr class="two-column" />
            <detailed-resource-balance-settings />
            <hr class="two-column" />
            <date-range-settings class="two-column" />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import { DailyDebrisFieldReportResult, DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { DailyExpeditionResult, ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import DetailedResourceBalanceSettings from '@/views/stats/components/settings/resource-balance/DetailedResourceBalanceSettings.vue';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
    import { addDays, differenceInDays, startOfDay } from 'date-fns';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
    import IncludeShipsFoundOnExpeditionsInResourceBalanceSettings from '@/views/stats/components/settings/resource-balance/IncludeShipsFoundOnExpeditionsInResourceBalanceSettings.vue';
    import IncludeShipsLostInCombatsInResourceBalance from '@/views/stats/components/settings/resource-balance/IncludeShipsLostInCombatsInResourceBalance.vue';
    import IncludeLostLootResourcesInResourceBalance from '@/views/stats/components/settings/resource-balance/IncludeLostLootResourcesInResourceBalance.vue';
    import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';

    type EventType = 'expedition' | 'combat-report' | 'debris-field-report';
    const EventTypes: EventType[] = ['expedition', 'combat-report', 'debris-field-report'];

    interface DailyEvents {
        date: number;

        expeditions?: DailyExpeditionResult;
        combats?: DailyCombatReportResult;
        debrisFields?: DailyDebrisFieldReportResult;
    };

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            DetailedResourceBalanceSettings,
            ConversionRateSettings,
            ExpeditionShipResourceUnitsFactorSettings,
            LostShipResourceUnitsFactorSettings,
            ShowConvertedResourcesInCellsSettings,
            IncludeShipsFoundOnExpeditionsInResourceBalanceSettings,
            IncludeShipsLostInCombatsInResourceBalance,
            IncludeLostLootResourcesInResourceBalance,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get includeFoundShipsFactor(): Record<ResourceType, number> {
            const { factor, deuteriumFactor } = SettingsDataModule.settings.expeditionFoundShipsResourceUnits;
            const settingFactor = this.includeFoundShips ? 1 : 0;

            return {
                [ResourceType.metal]: factor * settingFactor,
                [ResourceType.crystal]: factor * settingFactor,
                [ResourceType.deuterium]: deuteriumFactor * settingFactor,
            };
        }

        private get includeFoundShips() {
            return SettingsDataModule.settings.resourceBalance.includeExpeditionFoundShipsResourceUnits;
        }

        private get includeLostShips() {
            return SettingsDataModule.settings.resourceBalance.includeLostShipsResourceUnits;
        }

        private get includeLostShipsFactor(): Record<ResourceType, number> {
            const { factor, deuteriumFactor } = SettingsDataModule.settings.lostShipsResourceUnits;
            const settingFactor = this.includeLostShips ? 1 : 0;

            return {
                [ResourceType.metal]: factor * settingFactor,
                [ResourceType.crystal]: factor * settingFactor,
                [ResourceType.deuterium]: deuteriumFactor * settingFactor,
            };
        }

        private get includeLostLoot() {
            return SettingsDataModule.settings.resourceBalance.includeLostLootResources;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {
                [this.$i18n.$t.extension.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.extension.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.extension.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get events(): DailyEvents[] {
            const minDay = Math.min(CombatReportDataModule.firstDay, DebrisFieldReportDataModule.firstDay, ExpeditionDataModule.firstDay);
            const dayCount = differenceInDays(startOfDay(Date.now()), minDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(minDay, add).getTime());

            return days.map<DailyEvents>(day => ({
                date: day,
                expeditions: ExpeditionDataModule.dailyResults[day],
                combats: CombatReportDataModule.dailyResults[day],
                debrisFields: DebrisFieldReportDataModule.dailyResults[day],
            })).filter(ev => (ev.expeditions ?? ev.combats ?? ev.debrisFields) != null);
        }

        private get settings() {
            return SettingsDataModule.settings.resourceBalance;
        }

        private get resourceIconSize() {
            if (this.settings.showDetailedBreakdown) {
                return '36px';
            }
            return '24px';
        }

        private get items(): RangedStatsTableItem<DailyEvents>[] {
            if (this.settings.showDetailedBreakdown) {
                const types: Record<ResourceType, (EventType | null)[]> = {
                    [ResourceType.metal]: ['expedition', 'combat-report', 'debris-field-report', null],
                    [ResourceType.crystal]: ['expedition', 'combat-report', 'debris-field-report', null],
                    [ResourceType.deuterium]: ['expedition', 'combat-report', 'debris-field-report', null],
                };

                return ResourceTypes.map<RangedStatsTableItem<DailyEvents>>(resource => ({
                    label: this.$i18n.$t.extension.resources[resource],
                    items: types[resource].map(eventType => ({
                        label: eventType == null ? this.$i18n.$t.extension.common.sum : this.$i18n.$t.extension.resourceBalance[eventType],
                        getValue: events => this.getResources(events, eventType, resource),
                        class: eventType == null ? 'sum-item' : '',
                        labelClass: eventType == null ? 'sum-item' : '',
                    })),
                }));
            }

            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.extension.resources[resource],
                getValue: events => this.getResources(events, null, resource),
            }));
        }

        private getResources(events: DailyEvents[], eventType: EventType | null, resource: ResourceType): number {
            return events.reduce((acc, event) => {
                switch (eventType) {
                    case 'expedition': return acc + this.getResource({ date: event.date, expeditions: event.expeditions }, resource);
                    case 'combat-report': return acc + this.getResource({ date: event.date, combats: event.combats }, resource);
                    case 'debris-field-report': return acc + this.getResource({ date: event.date, debrisFields: event.debrisFields }, resource);
                    case null: return acc + this.getResource(event, resource);
                }
            }, 0);
        }

        private getResource(dayEvents: DailyEvents, resource: ResourceType): number {
            return this.getExpeditionResourceAmount(dayEvents.expeditions, resource)
                + this.getCombatResourceAmount(dayEvents.combats, resource)
                + this.getDebrisFieldResourceAmount(dayEvents.debrisFields, resource);
        }

        private getExpeditionResourceAmount(expeditions: DailyExpeditionResult | undefined, resource: ResourceType): number {
            if (expeditions == null) {
                return 0;
            }

            const includeFoundShipsFactor = this.includeFoundShipsFactor[resource];
            const total = expeditions.findings.resources[resource]
                + expeditions.findings.fleetResourceUnits[resource] * includeFoundShipsFactor;

            return total;
        }

        private getCombatResourceAmount(dailyReports: DailyCombatReportResult | undefined, resource: ResourceType): number {
            if (dailyReports == null) {
                return 0;
            }

            const lostLootFactor = this.includeLostLoot ? 1 : 0;
            const lootResources = dailyReports.loot.lost[resource] * lostLootFactor
                + dailyReports.loot.gained[resource];

            const includeLostShipsFactor = this.includeLostShipsFactor[resource];
            const lostShipResourceUnits = (
                dailyReports.lostShips.onExpeditions.resourceUnits[resource]
                + dailyReports.lostShips.againstPlayers.resourceUnits[resource]
            ) * includeLostShipsFactor;

            const total = lootResources - lostShipResourceUnits;

            return total;
        }

        private getDebrisFieldResourceAmount(reports: DailyDebrisFieldReportResult | undefined, resource: ResourceType): number {
            if (reports == null) {
                return 0;
            }

            return reports.total[resource];
        }

        private get footerItems(): RangedStatsTableItem<DailyEvents>[] {
            const result: RangedStatsTableItem<DailyEvents>[] = [
                {
                    label: this.$i18n.$t.extension.common.resourceUnits,
                    getValue: events => ResourceTypes.reduce(
                        (total, resource) => total + EventTypes.reduce(
                            (total, eventType) => total + this.getResources(events, eventType, resource),
                            0
                        ),
                        0
                    ),
                },
            ];

            if (SettingsDataModule.settings.showCellsWithConvertedResourceUnits) {
                result.push({
                    label: `${this.$i18n.$t.extension.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.extension.common.msu : this.$i18n.$t.extension.common.dsu})`,
                    getValue: events => ResourceTypes.reduce(
                        (total, resource) => total + EventTypes.reduce(
                            (total, eventType) => total + getMsuOrDsu({
                                [resource]: this.getResources(events, eventType, resource)
                            }),
                            0
                        ),
                        0
                    ),
                });
            }

            return result;
        }
    }

</script>
<style lang="scss" scoped>
    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;

        &::v-deep {
            .sum-item {
                font-weight: bold;
                border-top: 1px solid rgba(var(--color), 0.5);
                margin-top: 1px;
            }
        }
    }

    .floating-settings::v-deep .floating-menu {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 8px;

        .two-column {
            grid-column: 1 / span 2;
        }

        hr {
            width: 100%;
        }
    }
</style>