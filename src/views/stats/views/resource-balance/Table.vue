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

            <msu-conversion-rate-settings />
            <show-msu-cells-settings />
            <hr class="two-column" />
            <expedition-ship-resource-units-factor-settings />
            <lost-ship-resource-units-factor-settings />
            <hr class="two-column" />
            <include-ships-found-on-expeditions-in-resource-balance-settings />
            <include-ships-lost-in-combats-in-resource-balance />
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
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
    import { addDays, differenceInDays, startOfDay } from 'date-fns';
    import ShowMsuCellsSettings from '@stats/components/settings/ShowMsuCellsSettings.vue';
    import IncludeShipsFoundOnExpeditionsInResourceBalanceSettings from '@/views/stats/components/settings/resource-balance/IncludeShipsFoundOnExpeditionsInResourceBalanceSettings.vue';
    import IncludeShipsLostInCombatsInResourceBalance from '@/views/stats/components/settings/resource-balance/IncludeShipsLostInCombatsInResourceBalance.vue';

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
            MsuConversionRateSettings,
            ExpeditionShipResourceUnitsFactorSettings,
            LostShipResourceUnitsFactorSettings,
            ShowMsuCellsSettings,
            IncludeShipsFoundOnExpeditionsInResourceBalanceSettings,
            IncludeShipsLostInCombatsInResourceBalance,
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
            return {
                [ResourceType.metal]: factor,
                [ResourceType.crystal]: factor,
                [ResourceType.deuterium]: deuteriumFactor,
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
            return {
                [ResourceType.metal]: factor,
                [ResourceType.crystal]: factor,
                [ResourceType.deuterium]: deuteriumFactor,
            };
        }

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {
                [this.$i18n.$t.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.resources.deuterium]: ResourceType.deuterium,
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
                    [ResourceType.deuterium]: ['expedition', 'combat-report', null],
                };

                return ResourceTypes.map<RangedStatsTableItem<DailyEvents>>(resource => ({
                    label: this.$i18n.$t.resources[resource],
                    items: types[resource].map(eventType => ({
                        label: eventType == null ? 'LOCA: Summe' : this.$i18n.$t.resourceBalance[eventType],
                        getValue: events => this.getResources(events, eventType, resource),
                        class: eventType == null ? 'sum-item' : '',
                        labelClass: eventType == null ? 'sum-item' : '',
                    })),
                }));
            }

            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.resources[resource],
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

            const includeFoundShipsFactor = this.includeFoundShips ? this.includeFoundShipsFactor[resource] : 0;
            const total = expeditions.findings.resources[resource]
                + expeditions.findings.fleetResourceUnits[resource] * includeFoundShipsFactor;

            return total;
        }

        private getCombatResourceAmount(dailyReports: DailyCombatReportResult | undefined, resource: ResourceType): number {
            if (dailyReports == null) {
                return 0;

            }
            const includeLostShipsFactor = this.includeLostShips ? this.includeLostShipsFactor[resource] : 0;

            const total = dailyReports.loot[resource]
                - (dailyReports.lostShips.onExpeditions.resourceUnits[resource]
                    + dailyReports.lostShips.againstPlayers.resourceUnits[resource]
                ) * includeLostShipsFactor;

            return total;
        }

        private getDebrisFieldResourceAmount(reports: DailyDebrisFieldReportResult | undefined, resource: ResourceType): number {
            if (reports == null) {
                return 0;
            }

            if (resource == ResourceType.deuterium) {
                return 0;
            }

            return reports[resource];
        }

        private get footerItems(): RangedStatsTableItem<DailyEvents>[] {
            const msu: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                ...this.msuConversionRates,
            };

            const result: RangedStatsTableItem<DailyEvents>[] = [
                {
                    label: this.$i18n.$t.common.resourceUnits,
                    getValue: events => ResourceTypes.reduce(
                        (total, resource) => total + EventTypes.reduce(
                            (total, eventType) => total + this.getResources(events, eventType, resource),
                            0
                        ),
                        0
                    ),
                },
            ];

            if (SettingsDataModule.settings.showMsuCells) {
                result.push({
                    label: this.$i18n.$t.common.resourceUnitsMsu,
                    getValue: events => ResourceTypes.reduce(
                        (total, resource) => total + EventTypes.reduce(
                            (total, eventType) => total + this.getResources(events, eventType, resource) * msu[resource],
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