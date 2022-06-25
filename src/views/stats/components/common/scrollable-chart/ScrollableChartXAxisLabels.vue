<template>
    <div class="chart-x-axis">
        <div
            class="x-axis-labels"
            :style="{
                width: `${maxXNormalized * width}px`,
            }"
        >
            <div
                v-for="(x, i) in xAxisTicks"
                :key="`x-grid-label-${x}`"
                class="x-axis-label"
                :style="{
                    left: `${xAxisTicksNormalized[i] * width}px`,
                }"
                v-text="xLabelFormatter(x)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { $i18n } from '@/shared/i18n/extension/$i18n';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ScrollableChartXAxisLabels extends Vue {

        @Prop({ required: true, type: Number })
        private width!: number;

        @Prop({ required: true, type: Number })
        private maxXNormalized!: number;

        @Prop({ required: true, type: Array })
        private xAxisTicks!: number[];

        @Prop({ required: true, type: Array })
        private xAxisTicksNormalized!: number[];

        @Prop({ required: true, type: Function as PropType<(value: number) => string>, default: (value: number) => $i18n.$n(value) })
        private xLabelFormatter!: (value: number) => string;
    }
</script>

<style lang="scss" scoped>
    .chart-x-axis {
        grid-row: 2;
        grid-column: 1 / span 2;
        position: relative;
        overflow: hidden;
        clip-path: polygon(100px 0, 100% 0, 100% 100%, 0 100%);

        > .x-axis-labels {
            position: relative;
            margin-left: 100px;
            transform: translateX(var(--chart-x-translation));

            > .x-axis-label {
                position: absolute;
                top: 0;
                transform-origin: top right;
                transform: translateY(10px) translateX(-100%) translateX(-5px)
                    rotate(-45deg);
                white-space: pre;
                color: #888;
                font-size: 12px;
            }
        }
    }
</style>