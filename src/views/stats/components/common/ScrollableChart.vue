<template>
    <div class="scrollable-chart">
        <div class="chart-container" :class="{ 'no-legend': noLegend }">
            <div
                class="svg-container"
                ref="svg-container"
                @mouseleave="activeX = null"
            >
                <svg v-if="isReady && internalDatasets.length > 0">
                    <g class="grid-lines">
                        <!-- vertical grid lines -->
                        <line
                            v-for="x in ticks"
                            :key="x"
                            :x1="xPositions[x - 1]"
                            :y1="0"
                            :x2="xPositions[x - 1]"
                            :y2="svgContainer.clientHeight + 10"
                            class="x-grid-line"
                            :class="{
                                'x-grid-line-active': x - 1 == activeX,
                                'x-grid-line--first': x == 1,
                            }"
                        />
                        <!-- horizontal grid lines -->
                        <line
                            v-for="(yData, y) in yGridLines"
                            :key="y"
                            :x1="-10"
                            :y1="yData.svg"
                            :x2="svgContainer.clientWidth"
                            :y2="yData.svg"
                            class="y-grid-line"
                            :class="{ 'y-grid-line--first': y == 1 }"
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
                            v-for="x in ticks"
                            :key="`point-group-${x}`"
                            class="dataset-point-group"
                            @mouseenter="activeX = x - 1"
                        >
                            <circle
                                v-for="dataset in reversedDatasets"
                                v-show="dataset.visible && !dataset.hidePoints"
                                :key="`point-${dataset.key}-${x}`"
                                class="dataset-point"
                                :cx="xPositions[x - 1]"
                                :cy="dataset.svgValues[x - 1]"
                                :style="{ fill: dataset.color }"
                                :_debug="dataset.key"
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

                <div
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
                                :key="i"
                                v-text="footer"
                            />
                        </template>
                        <slot
                            v-else
                            name="tooltip-footer"
                            :datasets="footerSlotDatasets"
                        />
                    </div>
                </div>
            </div>

            <div class="chart-y-axis">
                <div
                    v-for="(yData, y) in yGridLines"
                    :key="y"
                    class="y-axis-label"
                    :style="{ bottom: `${yData.fraction * 100}%` }"
                    v-text="$number(y)"
                />
            </div>
            <div class="chart-x-axis">
                <div
                    v-for="x in ticks"
                    :key="x"
                    class="x-axis-label"
                    :style="{ left: `${((x - 1) * 100) / (ticks - 1)}%` }"
                    v-text="xLabelFormatter(x - 1 + tickOffset)"
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
                <div :style="{ width: `${(100 * maxX) / (ticks - 1)}%` }" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
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

    export interface ScrollableChartDataset {
        key: string | number;
        values: number[];
        color: string;
        label: string;
        filled: boolean;
        stack: boolean;
        hidePoints: boolean;
        average?: number;
    }

    interface ScrollableChartInternalDataset extends ScrollableChartDataset {
        visible: boolean;
        transformedValues: number[];
        svgValues: number[];
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

    @Component({})
    export default class ScrollableChart extends Vue {
        @Ref('svg-container')
        private svgContainer!: HTMLElement;

        @Ref('scrollbar-container')
        private scrollbarContainer!: HTMLElement;

        @Prop({ required: true, type: Array as PropType<ScrollableChartDataset[]>, validator: (value: ScrollableChartDataset[]) => value.length > 0 })
        private datasets!: ScrollableChartDataset[];

        @Prop({ required: false, type: Number, default: 30 })
        private ticks!: number;

        @Prop({ required: false, type: Boolean })
        private noLegend!: boolean;

        @Prop({ required: false, type: Function as PropType<(value: number) => string>, default: (value: number) => Localization.formatNumber(value) })
        private xLabelFormatter!: (value: number) => string;

        @Prop({ required: false, type: Function as PropType<(value: number) => string>, default: (value: number) => Localization.formatNumber(value) })
        private tooltipValueFormatter!: (value: number) => string;

        @Prop({ required: false, type: Function as PropType<(values: Record<string, number>) => string | string[]>, default: null })
        private tooltipFooterProvider!: ((values: Record<string, number>) => string | string[]) | null;


        private activeX: number | null = null;
        private tickOffset = 0;
        private internalDatasets: ScrollableChartInternalDataset[] = [];
        private xPositions: number[] = [];
        private yGridLines: YGridLineData = {};
        private yRange = { min: 0, max: 0 };
        private maxX = 0;
        private yGridRange = { min: 0, max: 0 };
        private readonly resizeObserver = new ResizeObserver(() => this.onResize());

        private get footerTexts(): string[] {
            const x = this.activeX;
            if (this.tooltipFooterProvider == null || x == null) {
                return [];
            }

            const values: Record<string, number> = this.internalDatasets.reduce((acc, dataset) => {
                acc[dataset.key] = this.getValue(dataset, x + this.tickOffset);
                return acc;
            }, {} as Record<string, number>);

            const footer = this.tooltipFooterProvider(values);
            if (footer instanceof Array) {
                return footer;
            }

            return [footer];
        }

        private get footerSlotDatasets(): ScollableChartFooterDataset[] {
            return this.internalDatasets.map(dataset => ({
                key: dataset.key,
                label: dataset.label,
                visible: dataset.visible,
                color: dataset.color,
                value: this.getValue(dataset, (this.activeX ?? 0) + this.tickOffset),
            }));
        }

        @Watch('datasets')
        private onDatasetsChanged() {
            const internalDatasets: ScrollableChartInternalDataset[] = this.datasets.map((dataset, i) => ({
                ...dataset,
                transformedValues: [],
                svgValues: [],
                paths: {
                    line: '',
                    averageLine: '',
                    background: '',
                },
                visible: true,
            }));


            this.internalDatasets = internalDatasets;
            this.updateTransformedValues();

            this.updateYRange();
            this.updateYGridLines();
            this.updatePaths();

            this.tickOffset = Math.max(0, this.maxTickOffset);
            this.scrollbarContainer.scrollLeft = this.scrollbarContainer.scrollWidth - this.scrollbarContainer.clientWidth;
        }

        private updateYGridLines() {
            //TODO: adjust for negative y-values
            const maxY = this.yRange.max;
            const yGridConfig = this.internalConfig.grid.y;
            let step = 0;

            outerLoop:
            for (let stepFactor = 1; ; stepFactor *= yGridConfig.stepFactor) {
                for (let stepBase of yGridConfig.stepBases) {
                    let curStep = stepBase * stepFactor;

                    let curMin = curStep * yGridConfig.minLines;
                    let curMax = curStep * yGridConfig.maxLines;
                    if (curMin < maxY && curMax >= maxY) {
                        step = curStep;
                        break outerLoop;
                    }
                }
            }
            const height = this.svgContainer.clientHeight;
            const lines: YGridLineData = {};
            const count = Math.ceil(maxY / step) + 1;
            for (let c = 0; c <= count; c++) {
                const y = step * c;
                lines[y] = {
                    svg: height - height * c / count,
                    fraction: c / count,
                };
            }

            this.yGridLines = lines;
            this.yGridRange = {
                min: 0,
                max: step * count,
            };
        }

        private updateYRange() {
            const yRange = { min: 0, max: 10 };

            this.internalDatasets.forEach(dataset => {
                dataset.transformedValues.forEach(y => {
                    yRange.min = Math.min(y, yRange.min);
                    yRange.max = Math.max(y, yRange.max);
                });
            });

            this.yRange = yRange;
        }

        private get reversedDatasets() {
            return [...this.internalDatasets].reverse();
        }

        private updateTransformedValues() {
            let maxX = 0;

            this.internalDatasets.forEach((internalDataset, i, internalDatasets) => {
                const previousVisibleAndStackedDataset = findPrevious(internalDatasets, i - 1, d => d.visible && d.stack);

                const transformedValues = internalDataset.values.map((y, x) => {
                    if (internalDataset.stack) {
                        y += previousVisibleAndStackedDataset?.transformedValues[x] ?? 0;
                    }
                    return y;
                });
                maxX = Math.max(maxX, transformedValues.length - 1);
                internalDataset.transformedValues = transformedValues;
            });

            this.maxX = maxX;
        }

        private toggleVisibility(dataset: ScrollableChartInternalDataset) {
            dataset.visible = !dataset.visible;
            this.updateTransformedValues();
            this.updatePaths();
        }

        private get maxTickOffset() {
            return this.maxX - this.ticks + 1;
        }

        private updateTickOffset() {
            const scrollableDistance = this.scrollbarContainer.scrollWidth - this.scrollbarContainer.clientWidth;
            if (scrollableDistance == 0) {
                this.tickOffset = 0;
                return;
            }

            const scrolledFraction = this.scrollbarContainer.scrollLeft / scrollableDistance;
            const tickOffset = Math.round(scrolledFraction * (this.maxX - this.ticks + 1));
            this.tickOffset = tickOffset;
        }

        @Watch('tickOffset')
        private onTickOffsetChanged() {
            this.$nextTick(() => this.updatePaths());
        }

        private onResize() {
            this.updateYGridLines();
            this.updatePaths();
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

                let avgLinePath = '';
                if (dataset.average != null) {
                    const [avgSvgValue] = this.computeSvgValues([dataset.average]);
                    avgLinePath = `M 0 ${avgSvgValue} L ${width} ${avgSvgValue}`;
                }

                const internalDataset: ScrollableChartInternalDataset = {
                    ...dataset,
                    svgValues,
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

        private getSvgPath(values: number[], close = false) {
            const svgCommands = values.map((y, x) => `${x == 0 ? 'M' : 'L'} ${this.xPositions[x]} ${y}`);
            return svgCommands.join(' ') + (close ? ' Z' : '');
        }

        private computeSvgValues(values: number[]): number[] {
            const height = this.svgContainer.clientHeight;

            return Array.from({ length: this.ticks })
                .map((_, x) => {
                    const y = values[x + this.tickOffset] ?? 0;
                    return height * (1 - y / this.yGridRange.max);
                });
        }

        private readonly internalConfig = {
            grid: {
                y: {
                    minLines: 3,
                    maxLines: 6,

                    stepBases: [1, 2, 5],
                    stepFactor: 10,
                },
            },
        };

        private getValue(dataset: ScrollableChartInternalDataset, x: number) {
            return dataset.values[x] ?? 0;
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