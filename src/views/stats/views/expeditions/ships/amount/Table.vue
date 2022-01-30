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
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';

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
            return getNumericEnumValues(ExpeditionFindableShipType).map(ship => ({
                label: `LOCA: ${ship}`,
                getValue: expos => (expos as ExpeditionEventFleet[])
                    .reduce((acc, expo) => acc + (expo.fleet[ship] ?? 0), 0),
            }));
        }

        private get footerItems(): RangedExpeditionTableItem[] {
            return [{
                label: `LOCA: Total`,
                getValue: expos => (expos as ExpeditionEventFleet[]).reduce(
                    (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + (expo.fleet[ship] ?? 0)
                        , 0)
                    , 0),
            }];
        }
    }
</script>