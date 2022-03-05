<template>
    <div>
        <label>
            <input type="checkbox" v-model="showDetailedBreakdown" />
            LOCA: Show detailed breakdown
        </label>
        <ranged-stats-table
            :dataItems="events"
            :items="items"
            :footerItems="footerItems"
            show-average
        />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/v1/combat-reports/CombatReport';
    import { ExpeditionEvent, ExpeditionFindableShipType } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { DebrisFieldReport } from '@/shared/models/v1/debris-field-reports/DebrisFieldReport';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { getResources } from '../expeditions/ships/resources/getResources';

    type EventType = 'expedition' | 'combat-report' | 'debris-field-report';
    type Event =
        | ({ eventType: 'expedition' } & ExpeditionEvent)
        | ({ eventType: 'combat-report' } & CombatReport)
        | ({ eventType: 'debris-field-report' } & DebrisFieldReport);

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
        private get events(): Event[] {
            return [
                ...CombatReportDataModule.reports.map<Event>(report => ({ ...report, eventType: 'combat-report' })),
                ...DebrisFieldReportDataModule.reports.map<Event>(report => ({ ...report, eventType: 'debris-field-report' })),
                ...ExpeditionDataModule.expeditions.map<Event>(expo => ({ ...expo, eventType: 'expedition' })),
            ];
        }

        private showDetailedBreakdown = false;

        private get items(): RangedStatsTableItem<Event>[] {
            if (this.showDetailedBreakdown) {
                const types: Record<ResourceType, EventType[]> = {
                    [ResourceType.metal]: ['expedition', 'combat-report', 'debris-field-report'],
                    [ResourceType.crystal]: ['expedition', 'combat-report', 'debris-field-report'],
                    [ResourceType.deuterium]: ['expedition', 'combat-report'],
                };

                return Object.values(ResourceType).map(resource => ({
                    label: `LOCA: ${resource}`,
                    items: types[resource].map(eventType => ({
                        label: `LOCA: ${eventType}`,
                        getValue: events => events.filter(ev => ev.eventType == eventType).reduce((acc, ev) => acc + this.getEventResourceAmount(ev, resource), 0),
                    }))
                }));
            }

            return Object.values(ResourceType).map(resource => ({
                label: `LOCA: ${resource}`,
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
            const includeFoundShipsFactor: number = 0.35; //TODO: factor from settings

            switch (expo.type) {
                case ExpeditionEventType.resources: {
                    return expo.resources[resource];
                }

                case ExpeditionEventType.fleet: {
                    if (includeFoundShipsFactor == 0) {
                        return 0;
                    }

                    return includeFoundShipsFactor * getNumericEnumValues(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + getResources(ship, expo.fleet[ship] ?? 0)[resource],
                        0
                    );
                }

                default: return 0;
            }
        }

        private get footerItems(): RangedStatsTableItem<Event>[] {
            //TODO: MSU from setings
            const msu: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                [ResourceType.crystal]: 2,
                [ResourceType.deuterium]: 3,
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