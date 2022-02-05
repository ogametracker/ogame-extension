<template>
    <ranged-expedition-table
        :filter="(expo) => filterExpo(expo)"
        :items="items"
        :footerItems="footerItems"
        show-percentage
        show-average
        :averageNumberFormatOptions="avgFormat"
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
        private avgFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private filterExpo(expo: ExpeditionEvent): boolean {
            return true;
        }

        private get items(): RangedExpeditionTableItem[] {
            return Object.keys(ExpeditionEventType).map(type => ({
                label: `LOCA: ${type}`,
                getValue: expos => expos.filter(expo => expo.type == type).length,
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