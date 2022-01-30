<template>
    <ranged-expedition-table
        :filter="(expo) => filterExpo(expo)"
        :items="items"
        :footerItems="footerItems"
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedExpeditionTable, { RangedExpeditionTableItem } from '@stats/components/expeditions/RangedExpeditionTable.vue';
    import { ExpeditionEvent, ExpeditionEventFleet, ExpeditionFindableShipType } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { getResources } from './getResources';

    @Component({
        components: {
            RangedExpeditionTable,
        },
    })
    export default class Table extends Vue {

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.fleet;
        }

        private get items(): RangedExpeditionTableItem[] {
            return Object.values(ResourceType).map(resource => ({
                label: `LOCA: ${resource}`,
                getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventFleet[]).reduce(
                    (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + getResources(ship, expo.fleet[ship] ?? 0)[resource]
                    ), 0),
            }));
        }

        private get footerItems(): RangedExpeditionTableItem[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventFleet[]).reduce(
                        (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                            (acc, ship) => {
                                const res = getResources(ship, expo.fleet[ship] ?? 0);
                                return acc + res.metal + res.crystal + res.deuterium;
                            }), 0),
                },
                {
                    label: `LOCA: Total (MSU)`,
                    getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventFleet[]).reduce(
                        (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                            (acc, ship) => {
                                const res = getResources(ship, expo.fleet[ship] ?? 0);
                                return acc + res.metal + res.crystal * 2 + res.deuterium * 3; //TODO: MSU from settings
                            }), 0),
                },
            ];
        }
    }
</script>