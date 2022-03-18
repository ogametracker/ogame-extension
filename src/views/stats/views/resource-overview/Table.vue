<template>
    <div class="table-container">
        <div>
            <ranged-stats-table
                :dataItems="events"
                :items="items"
                :footerItems="footerItems"
                show-average
            >
                <template #cell-label="{ value }">
                    <span v-text="value" />

                    <o-resource :resource="value" :size="resourceIconSize" />
                </template>
            </ranged-stats-table>
        </div>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <date-range-settings />
            <detailed-resource-balance-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
    import { ExpeditionEvent, ExpeditionFindableShipType } from '@/shared/models/expeditions/ExpeditionEvents';
    import { DebrisFieldReport } from '@/shared/models/debris-field-reports/DebrisFieldReport';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { getResources } from '../expeditions/ships/resources/getResources';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import DetailedResourceBalanceSettings from '@stats/components/settings/DetailedResourceBalanceSettings.vue';

    type EventType = 'expedition' | 'combat-report' | 'debris-field-report';
    type Event =
        | ({ eventType: 'expedition' } & ExpeditionEvent)
        | ({ eventType: 'combat-report' } & CombatReport)
        | ({ eventType: 'debris-field-report' } & DebrisFieldReport);

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            DetailedResourceBalanceSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get includeFoundShipsFactor(): Record<ResourceType, number> {
            const { factor, deuteriumFactor } = SettingsDataModule.settings.expeditionFoundShipsResourceUnits;
            return {
                [ResourceType.metal]: factor,
                [ResourceType.crystal]: factor,
                [ResourceType.deuterium]: deuteriumFactor,
            };
        }

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get events(): Event[] {
            return [
                ...CombatReportDataModule.reports.map<Event>(report => ({ ...report, eventType: 'combat-report' })),
                ...DebrisFieldReportDataModule.reports.map<Event>(report => ({ ...report, eventType: 'debris-field-report' })),
                ...ExpeditionDataModule.expeditions.map<Event>(expo => ({ ...expo, eventType: 'expedition' })),
            ];
        }

        private get showDetailedBreakdown() {
            return SettingsDataModule.settings.showDetailedResourceBalance;
        }

        private get resourceIconSize() {
            if (this.showDetailedBreakdown) {
                return '36px';
            }
            return '24px';
        }

        private get items(): RangedStatsTableItem<Event>[] {
            if (this.showDetailedBreakdown) {
                const types: Record<ResourceType, EventType[]> = {
                    [ResourceType.metal]: ['expedition', 'combat-report', 'debris-field-report'],
                    [ResourceType.crystal]: ['expedition', 'combat-report', 'debris-field-report'],
                    [ResourceType.deuterium]: ['expedition', 'combat-report'],
                };

                return Object.values(ResourceType).map(resource => ({
                    label: resource,
                    items: types[resource].map(eventType => ({
                        label: `LOCA: ${eventType}`,
                        getValue: events => events.filter(ev => ev.eventType == eventType).reduce((acc, ev) => acc + this.getEventResourceAmount(ev, resource), 0),
                    }))
                }));
            }

            return Object.values(ResourceType).map(resource => ({
                label: resource,
                getValue: events => events.reduce((acc, ev) => acc + this.getEventResourceAmount(ev, resource), 0),
            }));
        }

        private getEventResourceAmount(ev: Event, resource: ResourceType): number {
            switch (ev.eventType) {
                case 'expedition': return this.getExpoResourceAmount(ev, resource);

                case 'combat-report': return ev.loot[resource];

                case 'debris-field-report': {
                    if (resource == ResourceType.deuterium) {
                        return 0;
                    }
                    return ev[resource];
                }
            }
        }
        private getExpoResourceAmount(expo: ExpeditionEvent, resource: ResourceType): number {
            const includeFoundShipsFactor = this.includeFoundShipsFactor;

            switch (expo.type) {
                case ExpeditionEventType.resources: {
                    return expo.resources[resource];
                }

                case ExpeditionEventType.fleet: {

                    return getNumericEnumValues(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + getResources(ship, expo.fleet[ship] ?? 0)[resource] * this.includeFoundShipsFactor[resource],
                        0
                    );
                }

                default: return 0;
            }
        }

        private get footerItems(): RangedStatsTableItem<Event>[] {
            const msu: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                ...this.msuConversionRates,
            };

            return [
                {
                    label: `LOCA: Total`,
                    getValue: events => events.reduce(
                        (acc, ev) => acc + Object.values(ResourceType).reduce(
                            (acc, resource) => acc + this.getEventResourceAmount(ev, resource),
                            0
                        ),
                        0
                    ),
                },
                {
                    label: `LOCA: Total (MSU)`,
                    getValue: events => events.reduce(
                        (acc, ev) => acc + Object.values(ResourceType).reduce(
                            (acc, resource) => acc + this.getEventResourceAmount(ev, resource) * msu[resource],
                            0
                        ),
                        0
                    ),
                },
            ];
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
    }
</style>