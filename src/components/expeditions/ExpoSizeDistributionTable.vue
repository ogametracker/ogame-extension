<template>
    <expo-ranged-table :items="items" show-total />
</template>

<script lang="ts">
    import i18n from '@/i18n';
    import { ExpoSizeableEvent } from '@/models/expeditions/ExpoEvent';
    import ExpoSize from '@/models/expeditions/ExpoSize';
    import ExpoType from '@/models/expeditions/ExpoType';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ExpoRangedTable, { ExpoRangeTableItem } from './ExpoRangedTable.vue';

    @Component({
        components: {
            ExpoRangedTable,
        },
    })
    export default class ExpoSizeDistributionTable extends Vue {
        @Prop({ required: true, type: String as PropType<ExpoType> })
        private type!: string;

        private readonly items: ExpoRangeTableItem[] = Object.keys(ExpoSize).map(sizeName => {
            const size = sizeName as ExpoSize;
            return {
                label: this.$ogame.$t.expoSizes[size],
                getValue: expos => (expos.filter(expo => expo.type == this.type) as ExpoSizeableEvent[])
                    .filter(expo => expo.size == size).length,
            };
        });
    }
</script>