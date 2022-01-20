<template>
    <div class="scrollable-chart">
        <div class="chart-container" :class="{ 'no-legend': noLegend }">
            <div class="svg-container" ref="svg-container">
                <svg v-if="isReady">
                    <g>
                        <!-- vertical grid lines -->
                        <line
                            v-for="x in ticks"
                            :key="x"
                            :x1="xPositions[x - 1]"
                            :y1="0"
                            :x2="xPositions[x - 1]"
                            :y2="svgContainer.clientHeight + 10"
                            class="x-grid-line"
                        />
                        <!-- 
                        TODO: horizontal grid lines
                        TODO: y-axis tick lines + labels
                        TODO: x-axis tick lines
                        -->
                    </g>

                    <g v-if="filled">
                        <path
                            v-for="dataset in reversedDatasets"
                            v-show="dataset.visible"
                            :key="`background-${dataset.key}`"
                            :d="dataset.paths.background"
                            class="dataset-background"
                            :style="{ fill: dataset.color }"
                        />
                    </g>

                    <g>
                        <path
                            v-for="dataset in reversedDatasets"
                            v-show="dataset.visible"
                            :key="`line-${dataset.key}`"
                            :d="dataset.paths.line"
                            class="dataset-line"
                            :style="{ stroke: dataset.color }"
                        />
                    </g>
                    <g>
                        <g
                            v-for="x in ticks"
                            :key="`point-group-${x}`"
                            class="dataset-point-group"
                        >
                            <circle
                                v-for="dataset in reversedDatasets"
                                v-show="dataset.visible"
                                :key="`point-${dataset.key}-${x}`"
                                class="dataset-point"
                                :cx="xPositions[x - 1]"
                                :cy="dataset.svgValues[x - 1]"
                                :style="{ fill: dataset.color }"
                            />

                            <rect
                                class="dataset-point-group-rect"
                                :x="
                                    Math.ceil(
                                        xPositions[x - 1] -
                                            (0.5 * svgContainer.clientWidth) /
                                                ticks
                                    )
                                "
                                y="0"
                                :width="1 + svgContainer.clientWidth / ticks"
                                :height="svgContainer.clientHeight"
                            />
                        </g>
                    </g>
                </svg>
            </div>

            <div class="chart-y-axis" />
            <div class="chart-x-axis">
                <div
                    v-for="x in ticks"
                    :key="x"
                    class="x-axis-label"
                    :style="{ left: `${((x - 1) * 100) / (ticks - 1)}%` }"
                    v-text="xLabelFormatter(x - 1 + tickOffset)"
                />
            </div>

            <div class="chart-legend">
                TODO: Legend
                <div
                    v-for="dataset in internalDatasets"
                    :key="`legend-item-${dataset.key}`"
                    class="legend-item"
                    :class="{
                        'legend-item-hidden': !dataset.visible,
                    }"
                    @click="toggleVisibility(dataset)"
                >
                    <div
                        class="legend-item-color"
                        :style="{ color: dataset.color }"
                    />
                    <div class="legend-item-label" v-text="dataset.label" />
                </div>
            </div>
        </div>

        <div class="scrollbar-container">
            <input
                type="range"
                min="0"
                :max="maxTickOffset"
                step="1"
                v-model.number="tickOffset"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

    function findPrevious<T>(array: T[], maxIndex: number, predicate: (item: T) => boolean): T | null {
        for (let i = Math.min(maxIndex, array.length - 1); i >= 0; i--) {
            const item = array[i];
            if (predicate(item)) {
                return item;
            }
        }

        return null;
    }

    export interface ScrollableChartDataset {
        key: string | number;
        values: number[];
        color: string;
        label: string;
    }

    interface ScrollableChartInternalDataset extends ScrollableChartDataset {
        visible: boolean;
        transformedValues: number[];
        svgValues: number[];
        paths: {
            line: string;
            background: string;
        };
    }

    @Component({})
    export default class ScrollableChart extends Vue {
        @Ref('svg-container')
        private svgContainer!: HTMLElement;

        @Prop({ required: true, type: Array as PropType<ScrollableChartDataset[]>, validator: (value: ScrollableChartDataset[]) => value.length > 0 })
        private datasets!: ScrollableChartDataset[];

        @Prop({ required: false, type: Boolean })
        private stacked!: boolean;

        @Prop({ required: false, type: Boolean })
        private filled!: boolean;

        @Prop({ required: false, type: Number, default: 30 })
        private ticks!: number;

        @Prop({ required: false, type: Boolean })
        private noLegend!: boolean;

        @Prop({ required: false, type: Function as PropType<(value: number) => string>, default: (value: number) => value.toString() })
        private xLabelFormatter!: (value: number) => string;

        private tickOffset = 0;
        private internalDatasets: ScrollableChartInternalDataset[] = [];
        private xPositions: number[] = [];
        private readonly resizeObserver = new ResizeObserver(() => this.updatePaths());
        private yRange = { min: 0, max: 0 };
        private maxX = 0;

        @Watch('datasets')
        private onDatasetsChanged() {
            const internalDatasets: ScrollableChartInternalDataset[] = this.datasets.map((dataset, i) => ({
                ...dataset,
                transformedValues: [],
                svgValues: [],
                paths: {
                    line: '',
                    background: '',
                },
                visible: true,
            }));

            this.updateYRange();

            this.internalDatasets = internalDatasets;
            this.updateTransformedValues();

            this.tickOffset = Math.max(0, this.maxTickOffset);
        }

        private updateYRange() {
            const yRange = { min: 0, max: 0 };

            this.datasets.forEach(dataset => {
                let datasetMin = 0;
                let datasetMax = 0;

                dataset.values.forEach(y => {
                    datasetMin = Math.min(y, datasetMin);
                    datasetMax = Math.max(y, datasetMax);
                });

                yRange.min = Math.min(datasetMin, yRange.min);
                if(this.stacked) {
                    yRange.max += datasetMax;
                } else {
                    yRange.max = Math.max(datasetMax);
                }
            });

            this.yRange = yRange;
        }

        private get reversedDatasets() {
            return [...this.internalDatasets].reverse();
        }

        private updateTransformedValues() {
            let maxX = 0;

            this.internalDatasets.forEach((internalDataset, i, internalDatasets) => {
                const previousVisibleDataset = findPrevious(internalDatasets, i - 1, d => d.visible);

                const transformedValues = internalDataset.values.map((y, x) => {
                    if (this.stacked) {
                        y += previousVisibleDataset?.transformedValues[x] ?? 0;
                    }
                    return y;
                });
                maxX = Math.max(maxX, transformedValues.length - 1);
                internalDataset.transformedValues = transformedValues;
            });

            this.maxX = maxX;

            this.updatePaths();
        }

        private toggleVisibility(dataset: ScrollableChartInternalDataset) {
            dataset.visible = !dataset.visible;
            this.updateTransformedValues();
        }

        private get maxTickOffset() {
            return this.maxX - this.ticks + 1;
        }

        @Watch('tickOffset')
        private onTickOffsetChanged() {
            this.$nextTick(() => this.updatePaths());
        }

        private updatePaths() {
            const sections = this.ticks - 1;
            const width = this.svgContainer.clientWidth;
            this.xPositions = Array.from({ length: this.ticks }).map((_, x) => width * x / sections);

            const height = this.svgContainer.clientHeight;

            this.internalDatasets = this.internalDatasets.map(dataset => {
                const svgValues = this.computeSvgValues(dataset.transformedValues);
                const linePath = this.getSvgPath(svgValues);
                const bgPath = `M 0 ${height} `
                    + `L${linePath.substring(1)} `
                    + `L ${this.xPositions[this.xPositions.length - 1]} ${height}`;

                const internalDataset: ScrollableChartInternalDataset = {
                    ...dataset,
                    svgValues,
                    paths: {
                        line: linePath,
                        background: bgPath,
                    },
                };
                return internalDataset;
            });
        }

        private isReady = false;

        private mounted() {
            this.isReady = true;
            this.resizeObserver.observe(this.svgContainer);

            this.onDatasetsChanged();
        }

        private destroyed() {
            this.resizeObserver.disconnect();
        }

        private getSvgPath(values: number[], close = false) {
            const svgCommands = values.map((y, x) => `${x == 0 ? 'M' : 'L'} ${this.xPositions[x]} ${y}`);
            return svgCommands.join(' ') + (close ? ' Z' : '');
        }

        private computeSvgValues(values: number[]): number[] {
            const height = this.svgContainer.clientHeight;

            return Array.from({ length: this.ticks })
                .map((_, x) => {
                    const y = values[x + this.tickOffset] ?? 0;
                    return height * (1 - y / this.yRange.max);
                });
        }
    }
</script>
<style lang="scss" scoped>
    .scrollable-chart {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 1fr auto;
    }

    svg {
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .x-grid-line {
        stroke: rgba(white, 0.1);
        stroke-width: 1px;
        fill: none;
    }

    .y-grid-line {
        stroke: rgba(white, 0.2);
        stroke-width: 1px;
        fill: none;
    }

    .dataset-background {
        stroke: none;
        opacity: 0.8;
    }

    .dataset-line {
        fill: none;
        stroke-width: 2px;
    }

    .dataset-point {
        stroke: rgba(black, 0.5);
        r: 3px;
        stroke-width: 0;
    }

    .dataset-point-group {
        .dataset-point-group-rect {
            fill: transparent;
        }

        &:hover > .dataset-point {
            r: 4px;
            stroke-width: 1px;
        }
    }

    .chart-container {
        display: grid;
        grid-template-columns: 100px 1fr 200px;
        grid-template-rows: 1fr 100px;

        &.no-legend {
            grid-template-columns: 100px 1fr;
        }
    }
    .svg-container {
        grid-row: 1;
        grid-column: 2;
    }

    .chart-x-axis {
        grid-row: 2;
        grid-column: 2;
        position: relative;

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

    .chart-y-axis {
        grid-row: 1;
        grid-column: 1;
    }

    .chart-legend {
        grid-row: 1 / span 2;
        grid-column: 3;
        padding: 0 12px;
    }

    .legend-item {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;

        &-hidden {
            filter: grayscale(1);
            text-decoration: line-through;
            color: #888;
        }
    }

    .legend-item-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background: currentColor;
        margin-right: 4px;
    }
</style>