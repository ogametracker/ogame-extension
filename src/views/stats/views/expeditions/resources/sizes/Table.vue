<template>
    <ranged-expedition-table
        :filter="(expo) => filterExpo(expo)"
        :items="items"
        show-percentage
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedExpeditionTable, { RangedExpeditionTableItem } from '@stats/components/expeditions/RangedExpeditionTable.vue';
    import { ExpeditionEvent, ExpeditionEventResources } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ExpeditionEventSize } from '@/shared/models/v1/expeditions/ExpeditionEventSize';

    @Component({
        components: {
            RangedExpeditionTable,
        },
    })
    export default class Table extends Vue {

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.resources;
        }

        private get items(): RangedExpeditionTableItem[] {
            return Object.values(ExpeditionEventSize).map(size => ({
                label: `LOCA: ${size}`,
                getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventResources[])
                    .filter(expo => expo.size == size)
                    .length,
            }));
        }
    }
</script>