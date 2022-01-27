<template>
    <ranged-expedition-table
        :filter="(expo) => filterExpo(expo)"
        :items="items"
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedExpeditionTable, { RangedExpeditionTableItem } from '@stats/components/expeditions/RangedExpeditionTable.vue';
    import { ExpeditionEvent, ExpeditionEventDarkMatter } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';

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
            return [{
                label: 'LOCA: dark matter',
                getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventDarkMatter[])
                    .reduce((acc, expo) => acc + expo.darkMatter, 0),
            }];
        }
    }
</script>