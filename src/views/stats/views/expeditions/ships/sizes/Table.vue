<template>
    <ranged-expedition-table
        :filter="(expo) => filterExpo(expo)"
        :items="items"
        :footerItems="footerItems"
        show-percentage
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedExpeditionTable, { RangedExpeditionTableItem } from '@stats/components/expeditions/RangedExpeditionTable.vue';
    import { ExpeditionEvent, ExpeditionEventFleet } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ExpeditionEventSize } from '@/shared/models/v1/expeditions/ExpeditionEventSize';

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
            return Object.values(ExpeditionEventSize).map(size => ({
                label: `LOCA: ${size}`,
                getValue: expos => (expos as ExpeditionEventFleet[])
                    .filter(expo => expo.size == size)
                    .length,
            }));
        }

        private get footerItems(): RangedExpeditionTableItem[] {
            return [{
                label: `LOCA: Total`,
                getValue: expos => expos.length,
            }];
        }
    }
</script>