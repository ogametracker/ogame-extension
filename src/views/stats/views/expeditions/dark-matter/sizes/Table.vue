<template>
    <div>
        <ranged-expedition-table
            :filter="(expo) => filterExpo(expo)"
            :items="items"
            show-percentage
        />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedExpeditionTable, { RangedExpeditionTableItem } from '@stats/components/expeditions/RangedExpeditionTable.vue';
    import { ExpeditionEvent, ExpeditionEventDarkMatter } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ExpeditionEventSize } from '@/shared/models/v1/expeditions/ExpeditionEventSize';

    @Component({
        components: {
            RangedExpeditionTable,
        },
    })
    export default class Table extends Vue {

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.darkMatter;
        }

        private get items(): RangedExpeditionTableItem[] {
            return Object.values(ExpeditionEventSize).map(size => ({
                label: `LOCA: ${size}`,
                getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventDarkMatter[])
                    .filter(expo => expo.size == size)
                    .length,
            }));
        }
    }
</script>