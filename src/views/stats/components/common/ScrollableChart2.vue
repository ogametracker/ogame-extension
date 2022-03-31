<template>
    <div class="scrollable-chart">
        <div class="chart-container" :class="{ 'no-legend': noLegend }">
            <div class="svg-container" ref="svg-container">
                <svg v-if="isReady && internalDatasets.length > 0">
                    <g class="grid-lines">
                        <!-- vertical grid lines -->
                        <line
                            v-for="(x, i) in xValues"
                            :key="`x-${i}`"
                            :x1="x * width"
                            :y1="0"
                            :x2="x * width"
                            :y2="height + 10"
                            class="x-grid-line"
                        />
                        <!-- horizontal grid lines -->
                        <line
                            v-for="(yData, y) in yGridLines"
                            :key="`y-${y}`"
                            :x1="-10"
                            :y1="yData.svg"
                            :x2="width"
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
                            :_debug="dataset.key"
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
                                'dataset-line--average': dataset.dashed,
                            }"
                            :style="{ stroke: dataset.color }"
                            :_debug="dataset.key"
                        />
                        <path
                            v-for="dataset in reversedDatasets"
                            v-show="dataset.visible"
                            :key="`line-average-${dataset.key}`"
                            :d="dataset.paths.averageLine"
                            class="dataset-line dataset-line--average"
                            :style="{ stroke: dataset.color }"
                            :_debug="`${dataset.key}-average`"
                        />
                    </g>

                    <g class="points">
                        <g
                            v-for="(x, i) in xValues"
                            :key="`point-group-${x}`"
                            class="dataset-point-group"
                            @mouseenter="activeX = x"
                        >
                            <template v-for="dataset in reversedDatasets">
                                <circle
                                    v-if="
                                        dataset.normalizedValuesByX[x] != null
                                    "
                                    :key="`point-${dataset.key}-${x}`"
                                    v-show="
                                        dataset.visible && !dataset.hidePoints
                                    "
                                    class="dataset-point"
                                    :cx="x * width"
                                    :cy="
                                        height *
                                        (1 - dataset.normalizedValuesByX[x])
                                    "
                                    :style="{ fill: dataset.color }"
                                    :_debug-x="x"
                                    :_debug-y="dataset.normalizedValuesByX[x]"
                                />
                            </template>

                            <rect
                                class="dataset-point-group-rect"
                                :x="width * (x + (xValues[i - 1] || 0)) / 2"
                                y="0"
                                :width="width * getRectWidth(i)"
                                :height="height"
                                :_debug-left-x="xValues[i - 1] || 0"
                                :_debug-x="x || 0"
                                :_debug-right-x="xValues[i + 1] || 0"
                                :_debug-width="getRectWidth(i)"
                            />
                        </g>
                    </g>
                </svg>

                <!-- <div
                    class="chart-tooltip"
                    v-if="activeX != null"
                    :style="{
                        '--ticks': ticks,
                        '--x': activeX,
                    }"
                >
                    <div
                        v-text="xLabelFormatter(activeX + tickOffset)"
                        class="chart-tooltip-header"
                    />

                    <div
                        v-for="dataset in internalDatasets"
                        v-show="dataset.visible"
                        :key="`tooltip-${dataset.key}`"
                        class="chart-tooltip-item"
                        :class="{
                            zero: getValue(dataset, activeX + tickOffset) == 0,
                        }"
                    >
                        <span
                            class="chart-tooltip-item-color"
                            :style="{ color: dataset.color }"
                        />
                        <span
                            class="chart-tooltip-item-value"
                            v-text="
                                tooltipValueFormatter(
                                    getValue(dataset, activeX + tickOffset)
                                )
                            "
                        />
                        <span
                            class="chart-tooltip-item-label"
                            v-text="dataset.label"
                        />
                    </div>

                    <div class="chart-tooltip-footer">
                        <template v-if="tooltipFooterProvider != null">
                            <div
                                v-for="(footer, i) in footerTexts"
                                :key="`footer-texts-${i}`"
                                v-text="footer"
                            />
                        </template>
                        <slot
                            v-else
                            name="tooltip-footer"
                            :datasets="footerSlotDatasets"
                        />
                    </div>
                </div> -->
            </div>

            <div class="chart-y-axis">
                <div
                    v-for="(yData, y) in yGridLines"
                    :key="`y-grid-line-${y}`"
                    class="y-axis-label"
                    :style="{ bottom: `${yData.fraction * 100}%` }"
                    v-text="$number(y)"
                />
            </div>
            <div class="chart-x-axis">
                <div
                    v-for="x in xAxisTicks"
                    :key="`x-grid-line-${x}`"
                    class="x-axis-label"
                    :style="{ left: `${x * 100}%` }"
                    v-text="xLabelFormatter(x)"
                />
            </div>

            <div class="chart-legend" v-if="!noLegend">
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

            <div
                class="scrollbar-container"
                ref="scrollbar-container"
                @scroll="updateTickOffset()"
            >
                <!-- <div :style="{ width: `${(100 * maxX) / (ticks - 1)}%` }" /> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator';
    import { Localization } from '../../i18n/Localization';

    function findPrevious<T>(array: T[], maxIndex: number, predicate: (item: T) => boolean): T | null {
        for (let i = Math.min(maxIndex, array.length - 1); i >= 0; i--) {
            const item = array[i];
            if (predicate(item)) {
                return item;
            }
        }

        return null;
    }

    export interface ScrollableChart2Dataset {
        key: string | number;
        values: Point[];
        color: string;
        label: string;
        filled: boolean;
        stack: boolean;
        hidePoints: boolean;
        average?: number;
    }

    interface ScrollableChart2InternalDataset extends ScrollableChart2Dataset {
        visible: boolean;
        svgPoints: Point[];
        normalizedValues: Point[];
        normalizedValuesByX: Record<number, number>;
        paths: {
            line: string;
            averageLine: string;
            background: string;
        };
    }

    type YGridLineData = Record<number, { svg: number; fraction: number }>;

    export interface ScollableChartFooterDataset {
        key: string | number;
        label: string;
        visible: boolean;
        color: string;
        value: number;
    }

    interface Point {
        x: number;
        y: number;
    }

    @Component({})
    export default class ScrollableChart2 extends Vue {
        @Ref('svg-container')
        private svgContainer!: HTMLElement;

        @Ref('scrollbar-container')
        private scrollbarContainer!: HTMLElement;

        @Prop({ required: true, type: Array as PropType<ScrollableChart2Dataset[]> })
        private datasets!: ScrollableChart2Dataset[];

        @Prop({ required: false, type: Array as PropType<number[]>, default: () => [] })
        private ticks!: number[];

        @Prop({ required: false, type: Boolean })
        private noLegend!: boolean;

        @Prop({ required: false, type: Function as PropType<(value: number) => string>, default: (value: number) => Localization.formatNumber(value) })
        private xLabelFormatter!: (value: number) => string;

        @Prop({ required: false, type: Function as PropType<(value: number) => string>, default: (value: number) => Localization.formatNumber(value) })
        private tooltipValueFormatter!: (value: number) => string;

        // @Prop({ required: false, type: Function as PropType<(values: Record<string, number>) => string | string[]>, default: null })
        // private tooltipFooterProvider!: ((values: Record<string, number>) => string | string[]) | null;

        private internalDatasets: ScrollableChart2InternalDataset[] = [];
        private xRange = { min: 0, max: 0 };
        private yRange = { min: 0, max: 0 };

        private yGridRange = { min: 0, max: 0 };
        private yGridLines: YGridLineData = {};
        private readonly resizeObserver = new ResizeObserver(() => this.onResize());

        // private get footerTexts(): string[] {
        //     const x = this.activeX;
        //     if (this.tooltipFooterProvider == null || x == null) {
        //         return [];
        //     }

        //     const values: Record<string, number> = this.internalDatasets.reduce((acc, dataset) => {
        //         acc[dataset.key] = this.getValue(dataset, x + this.tickOffset);
        //         return acc;
        //     }, {} as Record<string, number>);

        //     const footer = this.tooltipFooterProvider(values);
        //     if (footer instanceof Array) {
        //         return footer;
        //     }

        //     return [footer];
        // }

        // private get footerSlotDatasets(): ScollableChartFooterDataset[] {
        //     return this.internalDatasets.map(dataset => ({
        //         key: dataset.key,
        //         label: dataset.label,
        //         visible: dataset.visible,
        //         color: dataset.color,
        //         value: this.getValue(dataset, (this.activeX ?? 0) + this.tickOffset),
        //     }));
        // }

        @Watch('datasets')
        private onDatasetsChanged() {
            const internalDatasets: ScrollableChart2InternalDataset[] = this.datasets.map((dataset, i) => ({
                ...dataset,
                normalizedValues: [],
                normalizedValuesByX: {},
                svgPoints: [],
                paths: {
                    line: '',
                    averageLine: '',
                    background: '',
                },
                visible: true,
            }));


            this.internalDatasets = internalDatasets;
            if (this.internalDatasets.length == 0) {
                return;
            }

            this.updateXAndYRange();
            this.updateNormalizedValues();

            this.updateYGridLines();
            this.updatePaths();

            this.$nextTick(() => {
                this.scrollbarContainer.scrollLeft = this.scrollbarContainer.scrollWidth - this.scrollbarContainer.clientWidth;
            });
        }

        private get xAxisTicks() {
            return [];
            // return this.ticks
            //     .filter(x => x >= this.xRangeMin && x <= this.xRangeMax)
            //     .map(x => (x - this.xRangeMin) / (this.xRangeMax - this.xRangeMin));
        }

        private get xValues() {
            const result = new Set(this.internalDatasets.flatMap(d => d.normalizedValues.map(p => p.x)));
            return [...result].sort((a, b) => a - b);
        }

        private get width() {
            return this.svgContainer.clientWidth;
        }

        private get height() {
            return this.svgContainer.clientHeight;
        }

        private updateYGridLines() {
            const maxY = this.yRange.max;
            const minY = this.yRange.min;
            const yGridConfig = this.internalConfig.grid.y;
            let step = 0;
            let stepCount = {
                positive: 0,
                negative: 0,
            };

            outerLoop:
            for (let stepFactor = 1; ; stepFactor *= yGridConfig.stepFactor) {
                for (let stepBase of yGridConfig.stepBases) {
                    let curStep = stepBase * stepFactor;

                    const positiveSteps = Math.ceil(maxY / curStep);
                    const negativeSteps = Math.ceil(-minY / curStep);
                    const steps = positiveSteps + negativeSteps;

                    if (steps >= yGridConfig.minLines && steps <= yGridConfig.maxLines) {
                        step = curStep;
                        stepCount = {
                            positive: positiveSteps,
                            negative: negativeSteps,
                        };
                        break outerLoop;
                    }
                }
            }


            const height = this.height;
            const lines: YGridLineData = {};
            const count = stepCount.positive + stepCount.negative;
            for (let c = 0; c <= count; c++) {
                const relativeC = (c - stepCount.negative);
                const y = step * relativeC;
                lines[y] = {
                    svg: height - height * c / count,
                    fraction: c / count,
                };
            }

            this.yGridLines = lines;
            this.yGridRange = {
                min: -stepCount.negative * step,
                max: stepCount.positive * step,
            };
        }

        private updateXAndYRange() {
            const yRange = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };
            const xRange = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };

            this.internalDatasets.forEach(dataset => {
                dataset.values.forEach(point => {
                    xRange.min = Math.min(point.x, xRange.min);
                    xRange.max = Math.max(point.x, xRange.max);

                    yRange.min = Math.min(point.y, yRange.min);
                    yRange.max = Math.max(point.y, yRange.max);
                });
            });

            this.xRange = xRange;
            this.yRange = yRange;
        }

        private get reversedDatasets() {
            return [...this.internalDatasets].reverse();
        }

        private updateNormalizedValues() {
            this.internalDatasets.forEach((internalDataset, i, internalDatasets) => {
                const previousVisibleAndStackedDataset = findPrevious(internalDatasets, i - 1, d => d.visible && d.stack);

                const normalizedValues = internalDataset.values.map((point, i) => {
                    let { x, y } = point;
                    x = (x - this.xRange.min) / (this.xRange.max - this.xRange.min);
                    y = (y - this.yRange.min) / (this.yRange.max - this.yRange.min);

                    if (internalDataset.stack) {
                        y += previousVisibleAndStackedDataset?.normalizedValues[i].y ?? 0;
                    }
                    return { x, y };
                });
                internalDataset.normalizedValues = normalizedValues;

                internalDataset.normalizedValuesByX = {};
                normalizedValues.forEach(point => internalDataset.normalizedValuesByX[point.x] = point.y);
            });
        }

        private toggleVisibility(dataset: ScrollableChart2InternalDataset) {
            dataset.visible = !dataset.visible;

            if (dataset.stack) {
                this.updateNormalizedValues();
                this.updatePaths();
            }
        }

        private onResize() {
            this.updateYGridLines();
            this.updatePaths();
        }

        private updatePaths() {
            const width = this.width;

            const zeroY = this.computeSvgValues([{ x: 0, y: 0 }])[0].y;

            this.internalDatasets = this.internalDatasets.map(dataset => {
                const svgPoints = this.computeSvgValues(dataset.normalizedValues);
                const linePath = this.getSvgPath(svgPoints);

                const bgPath = `M 0 ${zeroY} `
                    + `L${linePath.substring(1)} `
                    + `L ${width} ${zeroY}`;

                let avgLinePath = '';
                if (dataset.average != null) {
                    const avgSvgValue = this.computeSvgValues([{ x: 0, y: dataset.average }])[0].y;
                    avgLinePath = `M 0 ${avgSvgValue} L ${width} ${avgSvgValue}`;
                }

                const internalDataset: ScrollableChart2InternalDataset = {
                    ...dataset,

                    svgPoints: svgPoints,
                    paths: {
                        line: linePath,
                        averageLine: avgLinePath,
                        background: bgPath,
                    },
                };
                return internalDataset;
            });
        }

        private isReady = false;

        private async mounted() {
            this.isReady = true;

            this.onDatasetsChanged();

            await this.$nextTick();
            this.resizeObserver.observe(this.svgContainer);
        }

        private destroyed() {
            this.resizeObserver.disconnect();
        }

        private getSvgPath(values: Point[], close = false) {
            const svgCommands = values.map((point, i) => `${i == 0 ? 'M' : 'L'} ${point.x} ${point.y}`);
            return svgCommands.join(' ') + (close ? ' Z' : '');
        }

        private computeSvgValues(values: Point[]): Point[] {
            const width = this.width;
            const height = this.height;

            return values.map(point => {
                const x = width * point.x;
                const y = height * (1 - point.y);
                return { x, y };
            });
        }

        private readonly internalConfig = {
            grid: {
                y: {
                    minLines: 5,
                    maxLines: 10,

                    stepBases: [1, 2, 5],
                    stepFactor: 10,
                },
            },
        };

        private getRectWidth(xIndex: number) {
            const xValues = this.xValues;
            const leftX = xValues[xIndex - 1] ?? 0;
            const x = xValues[xIndex];
            const rightX = xValues[xIndex + 1] ?? 1;

            const width = (x - leftX) / 2 + (rightX - x) / 2;
            return width;
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

        &--average {
            stroke-dasharray: 5px;
            stroke-width: 1px;
        }
    }

    .dataset-point {
        stroke: rgba(black, 0.5);
        r: 3px;
        stroke-width: 1px;
    }

    .dataset-point-group {
        .dataset-point-group-rect {
            fill: transparent;
        }

        &:hover > .dataset-point {
            stroke: rgba(black, 0.5);
            r: 4px;
        }
    }

    .chart-container {
        display: grid;
        grid-template-columns: 100px 1fr 200px;
        grid-template-rows: 1fr 100px;

        &.no-legend {
            grid-template-columns: 100px 1fr;
            padding-right: 16px; // necessary because overflow of last x-axis label will cause a scrollbar if there is no legend
        }
    }

    .svg-container {
        grid-row: 1;
        grid-column: 2;
        min-height: 250px;
        min-width: 500px;
        position: relative;
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

        position: relative;

        > .y-axis-label {
            position: absolute;
            right: 0;
            transform: translate(-15px, 50%);
            white-space: pre;
            color: #888;
            font-size: 12px;

            &:last-of-type {
                transform: translate(-15px, 100%);
            }
        }
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
        cursor: pointer;
        padding: 4px 8px;

        &:hover {
            background-color: rgba(var(--color), 0.1);
            border-radius: 4px;
        }

        &-hidden {
            text-decoration: line-through;
            opacity: 0.4;

            .legend-item-color {
                filter: grayscale(100%);
            }
        }
    }

    .legend-item-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background: currentColor;
        margin-right: 4px;
    }

    .chart-tooltip {
        position: absolute;
        top: 0;
        border: 1px solid rgba(var(--color), 0.5);
        background-color: rgba(black, 0.9);
        background-image: linear-gradient(
            to right,
            rgba(var(--color), 0.2),
            rgba(var(--color), 0.2)
        );

        padding: 12px;
        border-radius: 4px;
        left: calc(100% * var(--x) / (var(--ticks) - 1));
        transform: translateX(calc(-100% * var(--x) / (var(--ticks) - 1)));
        white-space: pre;
        line-height: 1;

        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: 2px 6px;
        align-items: center;
        width: max-content;
        font-size: 0.75rem;
        pointer-events: none;

        &-item {
            display: contents;

            &.zero > * {
                opacity: 0.4;
            }

            &-color {
                display: inline-block;
                width: 9px;
                height: 9px;
                border-radius: 2px;
                background: currentColor;
            }
            &-value {
                text-align: right;
                font-weight: bold;
            }
        }

        &-header,
        &-footer {
            grid-column: 1 / span 3;
            font-weight: bold;
        }

        &-header {
            margin-bottom: 4px;
        }
        &-footer {
            margin-top: 4px;
        }
    }

    .scrollbar-container {
        grid-column: 2;
        overflow-x: auto;

        > div {
            height: 1px;
        }
    }
</style>