<template>
    <expo-ranged-table :items="items" />
</template>

<script lang="ts">
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


        private readonly sizes: ExpoSize[] = [
            ExpoSize.small,
            ExpoSize.medium,
            ExpoSize.large,
        ];

        private readonly items: ExpoRangeTableItem[] = this.sizes.map(size => ({
            label: this.$t(`expoSizes['${size}']`) as string,
            getValue: expos => expos.filter(expo => expo.type == this.type && expo.size! == size).length,
        }));
    }
</script>