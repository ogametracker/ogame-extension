<template>
    <g>
        <g class="grid-lines">
            <!-- x grid lines for exiting x-values -->
            <line
                v-for="x in xValuesNormalized"
                v-show="showXValuesInGrid || x == activeXNormalizedSync"
                :key="`x-tick-grid-${x}`"
                :x1="x * width"
                :y1="0"
                :x2="x * width"
                :y2="height + 10"
                class="x-tick-grid-line"
                :class="{
                    'x-tick-grid-line-active': x == activeXNormalizedSync,
                }"
            />

            <!-- vertical grid lines -->
            <line
                v-for="x in xAxisTicksNormalized"
                :key="`x-tick-line-${x}`"
                :x1="x * width"
                :y1="0"
                :x2="x * width"
                :y2="height + 10"
                class="x-grid-line"
                :class="{
                    'x-grid-line-active': x == activeXNormalizedSync,
                }"
            />
            <!-- horizontal grid lines -->
            <line
                v-for="(yData, y) in yGridLines"
                :key="`y-tick-line-${y}`"
                :x1="-10"
                :y1="yData.svg"
                :x2="width * maxXNormalized"
                :y2="yData.svg"
                class="y-grid-line"
                :class="{ 'y-grid-line--first': y == 0 }"
            />
        </g>

        <g class="background-paths">
            <path
                v-for="dataset in reversedDatasets"
                v-show="dataset.visible && dataset.filled"
                :key="`background-${dataset.key}`"
                :d="dataset.paths.background"
                class="dataset-background"
                :style="{ fill: dataset.color }"
            />
        </g>

        <g class="line-paths">
            <path
                v-for="dataset in reversedDatasets"
                v-show="dataset.visible"
                :key="`line-${dataset.key}`"
                :d="dataset.paths.line"
                class="dataset-line"
                :class="{
                    'dataset-line--dashed': dataset.dashed,
                }"
                :style="{ stroke: dataset.color }"
            />
            <path
                v-for="dataset in reversedDatasets"
                v-show="dataset.visible"
                :key="`line-average-${dataset.key}`"
                :d="dataset.paths.averageLine"
                class="dataset-line dataset-line--dashed"
                :style="{ stroke: dataset.color }"
            />
        </g>

        <g class="points">
            <g
                v-for="(x, i) in xValuesNormalized"
                :key="`point-group-${x}`"
                class="dataset-point-group"
                @mouseenter="activeXNormalizedSync = x"
            >
                <template v-for="dataset in reversedDatasets">
                    <circle
                        v-if="dataset.normalizedValuesByNormalizedX[x] != null"
                        :key="`point-${dataset.key}-${x}`"
                        v-show="dataset.visible && !dataset.hidePoints"
                        class="dataset-point"
                        :cx="x * width"
                        :cy="
                            height *
                            (1 - dataset.normalizedValuesByNormalizedX[x])
                        "
                        :style="{ fill: dataset.color }"
                    />
                </template>

                <rect
                    class="dataset-point-group-rect"
                    :x="(width * (x + (xValuesNormalized[i - 1] || 0))) / 2"
                    y="0"
                    :width="width * getRectWidth(i)"
                    :height="height"
                />
            </g>
        </g>
    </g>
</template>

<script lang="ts">
    import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ScrollableChartSvgGroup extends Vue {

        @Prop({ required: true, type: Boolean })
        private showXValuesInGrid!: boolean;

        @Prop({ required: true, type: Number })
        private width!: number;
        
        @Prop({ required: true, type: Number })
        private height!: number;
        
        @PropSync('activeXNormalized', { required: false, type: Number, default: () => null })
        private activeXNormalizedSync!: number | null;
        
        @Prop({ required: true, type: Number })
        private maxXNormalized!: number;
        
        @Prop({ required: true, type: Array })
        private xValuesNormalized!: number[];
        
        @Prop({ required: true, type: Array })
        private xAxisTicksNormalized!: number[];
        
        @Prop({ required: true, type: Object })
        private yGridLines!: any; //TODO

        
        @Prop({ required: true, type: Array })
        private reversedDatasets!: any[]; //TODO

        
        private getRectWidth(xIndex: number) {
            const xValuesNormalized = this.xValuesNormalized;
            const leftX = xValuesNormalized[xIndex - 1] ?? 0;
            const x = xValuesNormalized[xIndex];
            const rightX = xValuesNormalized[xIndex + 1] ?? this.maxXNormalized;

            const width = (x - leftX) / 2 + (rightX - x) / 2;
            return width;
        }
    }
</script>

<style lang="scss" scoped>
    .x-tick-grid-line {
        stroke: rgba(white, 0.0666);
        stroke-width: 1px;
        fill: none;

        &.x-tick-grid-line-active {
            stroke: rgba(white, 0.5);
            stroke-width: 3px;
        }
    }

    .x-grid-line {
        stroke: rgba(white, 0.15);
        stroke-width: 1px;
        fill: none;

        &.x-grid-line-active {
            stroke: rgba(white, 0.5);
            stroke-width: 3px;
        }
    }

    .y-grid-line {
        stroke: rgba(white, 0.2);
        stroke-width: 1px;
        fill: none;
    }

    .x-grid-line--first,
    .y-grid-line--first {
        stroke: rgba(white, 0.75);
    }

    .dataset-background {
        stroke: none;
    }

    .dataset-line {
        fill: none;
        stroke-width: 2px;
        filter: brightness(0.7);

        &--dashed {
            stroke-dasharray: 5px;
            stroke-width: 1px;
        }
    }

    .dataset-point-group {
        .dataset-point {
            stroke: rgba(black, 0.5);
            r: 3px;
            stroke-width: 1px;
        }

        .dataset-point-group-rect {
            fill: transparent;
        }

        &:hover > .dataset-point {
            stroke: rgba(black, 0.5);
            r: 4px;
        }
    }
</style>