<template>
    <div class="scrollable-chart" :style="`--chart-x-translation: ${-leftX * width}px`">
        <div class="chart-container" :class="{ 'no-legend': noLegend }">
            <div class="chart-content" v-if="isReady">
                <div class="svg-container" ref="svg-container" @mouseleave="activeXNormalized = null">
                    <ScrollableChartSvg
                        v-if="internalDatasets.length > 0"
                        :width="width"
                        :height="height"
                        v-model:active-x-normalized="activeXNormalized"
                        :xValuesNormalized="xValuesNormalized"
                        :xAxisTicksNormalized="xAxisTicksNormalized"
                        :maxXNormalized="maxXNormalized"
                        :yGridLines="yGridLines"
                        :reversedDatasets="reversedDatasets"
                        :showXValuesInGrid="showXValuesInGrid"
                    />

                    <div
                        class="chart-tooltip"
                        v-if="activeXNormalized != null"
                        :style="{
                            '--x': activeXNormalized - leftX,
                        }"
                    >
                        <div v-text="xValueTooltipFormatter(activeX ?? 0)" class="chart-tooltip-header" />

                        <div
                            v-for="dataset in internalDatasets"
                            v-show="dataset.visible"
                            :key="`tooltip-${dataset.key}`"
                            class="chart-tooltip-item"
                            :class="{
                                zero: getLastValue(dataset, activeXNormalized) == 0,
                            }"
                        >
                            <span class="chart-tooltip-item-color" :style="{ color: dataset.color }" />
                            <span
                                class="chart-tooltip-item-value"
                                v-text="tooltipValueFormatter(getLastValue(dataset, activeXNormalized))"
                            />
                            <span class="chart-tooltip-item-label" v-text="dataset.label" />
                        </div>

                        <div class="chart-tooltip-footer" v-if="hasTooltipFooter">
                            <template v-if="tooltipFooterProvider != null">
                                <div v-for="(footer, i) in footerTexts" :key="`footer-texts-${i}`" v-text="footer" />
                            </template>
                            <slot v-else name="tooltip-footer" :datasets="footerSlotDatasets" />
                        </div>
                    </div>
                </div>

                <div class="chart-y-axis">
                    <div
                        v-for="(yData, y) in yGridLines"
                        :key="`y-grid-label-${y}`"
                        class="y-axis-label"
                        :style="{ bottom: `${yData.fraction * 100}%` }"
                        v-text="formatNumber(Number(y))"
                    />
                </div>

                <ScrollableChartXAxisLabels
                    :width="width"
                    :maxXNormalized="maxXNormalized"
                    :xAxisTicks="xAxisTicks"
                    :xAxisTicksNormalized="xAxisTicksNormalized"
                    :xLabelFormatter="xLabelFormatter"
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
                    <div class="legend-item-color" :style="{ color: dataset.color }" />
                    <div class="legend-item-label" v-text="dataset.label" />
                </div>
            </div>

            <div class="scrollbar-container" ref="scrollbar-container" @scroll="updateTickOffset()">
                <div
                    :style="{
                        width: `${(100 * (xRange.max - xRange.min)) / (tickInterval * visibleTickCount)}%`,
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
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
    values: Point[];
    color: string;
    dashed?: boolean;
    label: string;
    filled: boolean;
    stack: boolean;
    hidePoints: boolean;
    average?: number;
}

export interface ScrollableChartInternalDataset extends ScrollableChartDataset {
    visible: boolean;
    internalValues: Point[];
    originalValuesByX: Record<number, number>;
    originalValuesByNormalizedX: Record<number, number>;
    valuesByX: Record<number, number>;
    valuesByNormalizedX: Record<number, number>;
    normalizedValues: Point[];
    normalizedValuesByNormalizedX: Record<number, number>;
    normalizedAverage: number | null;
    paths: {
        line: string;
        averageLine: string;
        background: string;
    };
}

export type YGridLineData = Record<number, { svg: number; fraction: number }>;

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
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useSlots, useTemplateRef, watch } from 'vue';
import { formatNumber } from '@stats/i18n';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import type { PropType } from 'vue';
import ScrollableChartSvg from './ScrollableChartSvg.vue';
import ScrollableChartXAxisLabels from './ScrollableChartXAxisLabels.vue';

const props = defineProps({
    datasets: { required: true, type: Array as PropType<ScrollableChartDataset[]> },
    noLegend: { required: false, type: Boolean },
    showXValuesInGrid: { required: false, type: Boolean },
    continueLastValue: { required: false, type: Boolean },
    showZeroY: { required: false, type: Boolean, default: () => true },
    tickInterval: { required: false, type: Number, default: () => 1 },
    ticks: { required: false, type: Number, default: () => 30 },
    minTick: { required: false, type: Number as PropType<number | null>, default: () => null },
    maxTick: { required: false, type: Number as PropType<number | null>, default: () => null },
    tickList: { required: false, type: Array as PropType<number[] | null>, default: () => null },
    xLabelFormatter: {
        required: false,
        type: Function as PropType<(value: number) => string>,
        default: (value: number) => formatNumber(value),
    },
    tooltipValueFormatter: {
        required: false,
        type: Function as PropType<(value: number) => string>,
        default: (value: number) => formatNumber(value),
    },
    tooltipFooterProvider: {
        required: false,
        type: Function as PropType<((values: Record<string, number>) => string | string[]) | null>,
        default: null,
    },
    hideTooltipFooter: { required: false, type: Boolean, default: () => false },
    xLabelTooltipFormatter: { required: false, type: Function as PropType<(value: number) => string>, default: null },
});

const slots = useSlots();

const svgContainer = useTemplateRef<HTMLElement | null>('svg-container');

const scrollbarContainer = useTemplateRef<HTMLElement | null>('scrollbar-container');

const internalDatasets = ref<ScrollableChartInternalDataset[]>([]);

const xRange = ref({ min: 0, max: 0 });

const yRange = ref({ min: 0, max: 0 });

const leftX = ref(0);

const activeXNormalized = ref<number | null>(null);

const yGridRange = ref({ min: 0, max: 0 });

const yGridLines = ref<YGridLineData>({});

const isReady = ref(false);

const resizeObserver = new ResizeObserver(() => onResize());

const hasTooltipFooter = computed(() => {
    if (props.hideTooltipFooter) {
        return false;
    }

    return (
        props.tooltipFooterProvider != null || (footerSlotDatasets.value.length > 0 && slots['tooltip-footer'] != null)
    );
});

function getLastValue(dataset: ScrollableChartInternalDataset, xNormalized: number): number {
    const xs = xValuesNormalized.value;
    const index = xs.indexOf(xNormalized);

    for (let i = index; i >= 0; i--) {
        const value = dataset.originalValuesByNormalizedX[xs[i]];
        if (value != null) {
            return value;
        }
    }
    return 0;
}

const xValueTooltipFormatter = computed(() => props.xLabelTooltipFormatter ?? props.xLabelFormatter);

const activeX = computed(() => {
    if (activeXNormalized.value == null) {
        return null;
    }

    return xValuesByXNormalized.value[activeXNormalized.value];
});

const footerTexts = computed<string[]>(() => {
    const x = activeXNormalized.value;
    if (props.tooltipFooterProvider == null || x == null) {
        return [];
    }

    const values: Record<string, number> = internalDatasets.value.reduce(
        (acc, dataset) => {
            const y = dataset.originalValuesByNormalizedX[x];
            if (y != null) {
                acc[dataset.key] = y;
            }
            return acc;
        },
        {} as Record<string, number>,
    );

    const footer = props.tooltipFooterProvider(values);
    if (footer instanceof Array) {
        return footer;
    }

    return [footer];
});

const footerSlotDatasets = computed<ScollableChartFooterDataset[]>(() => {
    return internalDatasets.value.map(dataset => ({
        key: dataset.key,
        label: dataset.label,
        visible: dataset.visible,
        color: dataset.color,
        value: dataset.originalValuesByNormalizedX[activeXNormalized.value ?? props.minTick ?? 0],
    }));
});

async function onDatasetsChanged(newValue: ScrollableChartDataset[], oldValue?: ScrollableChartDataset[]) {
    const localInternalDatasets: ScrollableChartInternalDataset[] = props.datasets.map((dataset, i) => ({
        ...dataset,
        originalValuesByX: {},
        originalValuesByNormalizedX: {},
        valuesByX: {},
        valuesByNormalizedX: {},
        internalValues: [],
        normalizedValues: [],
        normalizedValuesByNormalizedX: {},
        normalizedAverage: null,
        paths: {
            line: '',
            averageLine: '',
            background: '',
        },
        visible: true,
    }));

    internalDatasets.value = localInternalDatasets;
    if (internalDatasets.value.length == 0) {
        return;
    }

    updateValues();

    updateXAndYRange();
    updateYGridLines();

    updateNormalizedValues();
    updatePaths();
}

const xAxisTicks = computed<number[]>(() => {
    if (props.tickList != null) {
        return props.tickList;
    }

    const { min, max } = xRange.value;
    const result: number[] = [];

    for (let x = min; x <= max; x += props.tickInterval) {
        result.push(x);
    }
    return result;
});

const xAxisTicksNormalized = computed<number[]>(() => {
    const { min } = xRange.value;
    return xAxisTicks.value.map(x => (x - min) / (props.tickInterval * visibleTickCount.value));
});

const xValues = computed(() => {
    const result = new Set(internalDatasets.value.flatMap(d => d.internalValues.map(p => p.x)));
    return [...result].sort((a, b) => a - b);
});

const xValuesNormalized = computed(() =>
    xValues.value.map(x => (x - xRange.value.min) / (props.tickInterval * visibleTickCount.value)),
);

const xValuesByXNormalized = computed<Record<number, number>>(() => {
    const result: Record<number, number> = {};

    const x = xValues.value;
    const xNormalized = xValuesNormalized.value;
    for (let i = 0; i < x.length; i++) {
        result[xNormalized[i]] = x[i];
    }

    return result;
});

const width = ref(0);

const height = ref(0);

function updateYGridLines() {
    const maxY = yRange.value.max;
    const minY = yRange.value.min;
    if (minY == maxY) {
        return;
    }
    const yGridConfig = internalConfig.grid.y;
    let step = 0;
    let stepCount = {
        positive: 0,
        negative: 0,
    };

    outerLoop: for (let stepFactor = 1; ; stepFactor *= yGridConfig.stepFactor) {
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

    const localHeight = height.value;
    const lines: YGridLineData = {};
    const count = stepCount.positive + stepCount.negative;
    for (let c = 0; c <= count; c++) {
        const relativeC = c - stepCount.negative;
        const y = step * relativeC;
        lines[y] = {
            svg: localHeight - (localHeight * c) / count,
            fraction: c / count,
        };
    }

    yGridLines.value = lines;
    yGridRange.value = {
        min: -stepCount.negative * step,
        max: stepCount.positive * step,
    };

    yRange.value = {
        min: Math.min(yRange.value.min, yGridRange.value.min),
        max: Math.max(yRange.value.max, yGridRange.value.max),
    };
}

function updateXAndYRange() {
    const localXRange = {
        min: props.minTick ?? Number.MAX_SAFE_INTEGER,
        max: props.maxTick ?? Number.MIN_SAFE_INTEGER,
    };
    const localYRange = {
        min: props.showZeroY ? 0 : Number.MAX_SAFE_INTEGER,
        max: Number.MIN_SAFE_INTEGER,
    };

    internalDatasets.value.forEach(dataset => {
        dataset.internalValues.forEach(point => {
            localXRange.min = Math.min(point.x, localXRange.min);
            localXRange.max = Math.max(point.x, localXRange.max);

            localYRange.min = Math.min(point.y, localYRange.min);
            localYRange.max = Math.max(point.y, localYRange.max);
        });
    });

    xRange.value = localXRange;
    yRange.value = localYRange;

    if (yRange.value.max - yRange.value.min < internalConfig.grid.y.minLines) {
        yRange.value.max = yRange.value.min + internalConfig.grid.y.minLines;
    }
}

const reversedDatasets = computed(() => [...internalDatasets.value].reverse());

const visibleTickCount = computed(() =>
    Math.min(props.ticks, Math.ceil((xRange.value.max - xRange.value.min) / props.tickInterval)),
);

const maxXNormalized = computed(
    () => (xRange.value.max - xRange.value.min) / (props.tickInterval * visibleTickCount.value),
);

function updateValues() {
    internalDatasets.value.forEach(internalDataset => {
        internalDataset.values.forEach(point => (internalDataset.valuesByX[point.x] = point.y));
    });

    internalDatasets.value.forEach((internalDataset, i, nextInternalDatasets) => {
        const previousVisibleAndStackedDataset = findPrevious(nextInternalDatasets, i - 1, d => d.visible && d.stack);

        internalDataset.values.forEach(point => (internalDataset.originalValuesByX[point.x] = point.y));

        const values = internalDataset.values.map((point, i) => {
            let { x, y } = point;
            if (internalDataset.stack) {
                y += previousVisibleAndStackedDataset?.valuesByX[x] ?? 0;
            }
            return { x, y };
        });
        internalDataset.internalValues = values;
        internalDataset.valuesByX = values.reduce((acc, point) => {
            acc[point.x] = point.y;
            return acc;
        }, internalDataset.valuesByX);
    });
}

function updateNormalizedValues() {
    internalDatasets.value.forEach((internalDataset, i, nextInternalDatasets) => {
        const normalizedValues = internalDataset.internalValues.map((point, i) => {
            let { x, y } = point;
            x = (x - xRange.value.min) / (props.tickInterval * visibleTickCount.value);
            y = (y - yRange.value.min) / (yRange.value.max - yRange.value.min);

            return {
                xNormalized: x,
                yNormalized: y,
                y: point.y,
            };
        });
        internalDataset.normalizedValues = normalizedValues.map(p => ({ x: p.xNormalized, y: p.yNormalized }));

        if (internalDataset.average != null) {
            internalDataset.normalizedAverage =
                (internalDataset.average - yRange.value.min) / (yRange.value.max - yRange.value.min);
        }

        internalDataset.valuesByNormalizedX = {};
        internalDataset.normalizedValuesByNormalizedX = {};
        normalizedValues.forEach(point => {
            internalDataset.valuesByNormalizedX[point.xNormalized] = point.y;
            internalDataset.normalizedValuesByNormalizedX[point.xNormalized] = point.yNormalized;
        });

        Object.keys(internalDataset.originalValuesByX)
            .map(x => parseFloat(x))
            .forEach(x => {
                const normalizedX = (x - xRange.value.min) / (props.tickInterval * visibleTickCount.value);
                const y = internalDataset.originalValuesByX[x];
                internalDataset.originalValuesByNormalizedX[normalizedX] = y;
            });
    });
}

function toggleVisibility(dataset: ScrollableChartInternalDataset) {
    dataset.visible = !dataset.visible;

    if (dataset.stack) {
        updateValues();
        updateNormalizedValues();
        updatePaths();
    }
}

function onResize() {
    const svg = svgContainer.value;
    const scrollbar = scrollbarContainer.value;
    if (!svg || !scrollbar) {
        return;
    }
    width.value = svg.clientWidth;
    height.value = svg.clientHeight;

    updateYGridLines();
    updatePaths();

    scrollbar.scrollLeft = scrolledFraction.value * (scrollbar.scrollWidth - scrollbar.clientWidth);
}

function updatePaths() {
    const localWidth = width.value;

    const normalizedZeroY = -yRange.value.min / (yRange.value.max - yRange.value.min);
    const zeroY = computeSvgPathSegments([{ x: 0, y: normalizedZeroY }], [{ x: 0, y: normalizedZeroY }], false)[0][0].y;

    internalDatasets.value = internalDatasets.value.map(dataset => {
        const svgPathSegments = computeSvgPathSegments(dataset.normalizedValues, dataset.internalValues);
        if (
            props.continueLastValue &&
            dataset.normalizedValues[dataset.normalizedValues.length - 1].x < maxXNormalized.value
        ) {
            const lastSegment = svgPathSegments[svgPathSegments.length - 1];
            lastSegment.push({
                x: maxXNormalized.value * localWidth,
                y: lastSegment[lastSegment.length - 1].y,
            });
        }
        const linePath = getSvgPath(svgPathSegments);

        const bgPath =
            `M 0 ${zeroY} ` + `L${linePath.substring(1)} ` + `L ${localWidth * maxXNormalized.value} ${zeroY}`;

        let avgLinePath = '';
        if (dataset.normalizedAverage != null) {
            const avgSvgValue = computeSvgPathSegments(
                [{ x: 0, y: dataset.normalizedAverage }],
                [{ x: 0, y: normalizedZeroY }],
                false,
            )[0][0].y;
            avgLinePath = `M 0 ${avgSvgValue} L ${localWidth * maxXNormalized.value} ${avgSvgValue}`;
        }

        const internalDataset: ScrollableChartInternalDataset = {
            ...dataset,

            paths: {
                line: linePath,
                averageLine: avgLinePath,
                background: bgPath,
            },
        };
        return internalDataset;
    });
}

function getSvgPath(segments: Point[][]) {
    const svgCommands = segments.map(points =>
        points.map((point, i) => `${i == 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '),
    );
    return svgCommands.join(' ');
}

function computeSvgPathSegments(
    normalizedValues: Point[],
    values: Point[],
    splitSegmentsOnConsecutiveZeros = true,
): Point[][] {
    const localWidth = width.value;
    const localHeight = height.value;

    const segments: Point[][] = [];
    let currentSegment: Point[] = [];
    for (let i = 0; i < normalizedValues.length; i++) {
        const normalizedValue = normalizedValues[i];
        const value = values[i];
        const nextValue: Point | undefined = values[i + 1];
        const prevValue: Point | undefined = values[i - 1];

        if (value.y == 0 && splitSegmentsOnConsecutiveZeros) {
            if (prevValue?.y == 0 || (nextValue?.y ?? 0) == 0) {
                if (currentSegment.length > 0) {
                    currentSegment.push(normalizedValue);
                    segments.push(currentSegment);
                    currentSegment = [];
                }
            }
        }

        if (value.y != 0 || (nextValue?.y ?? 0) != 0 || !splitSegmentsOnConsecutiveZeros) {
            currentSegment.push(normalizedValue);
        }
    }
    if (currentSegment.length) {
        segments.push(currentSegment);
    }

    return segments.map(segment =>
        segment.map(point => {
            const x = localWidth * point.x;
            const y = localHeight * (1 - point.y);
            return { x, y };
        }),
    );
}

const internalConfig = {
    grid: {
        y: {
            minLines: 5,
            maxLines: 10,

            stepBases: [1, 2, 5],
            stepFactor: 10,
        },
    },
};

const scrolledFraction = ref(1);

function updateTickOffset() {
    if (scrollbarContainer.value! == null) {
        throw new Error('scrollbar container is null');
    }
    scrolledFraction.value =
        scrollbarContainer.value!.scrollLeft /
        (scrollbarContainer.value!.scrollWidth - scrollbarContainer.value!.clientWidth);
    leftX.value = (maxXNormalized.value - 1) * scrolledFraction.value;
}

watch(() => props.datasets, onDatasetsChanged, { immediate: true, deep: 1 });

onMounted(async () => {
    isReady.value = true;

    await nextTick();
    onResize();
    resizeObserver.observe(svgContainer.value! ?? _throw('svgContainer is null'));
    scrollbarContainer.value!.scrollLeft =
        scrollbarContainer.value!.scrollWidth - scrollbarContainer.value!.clientWidth;
});

onUnmounted(() => {
    resizeObserver.disconnect();
});
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

.chart-container {
    display: grid;
    grid-template-columns: 1fr 200px;
    grid-template-rows: 1fr auto;

    &.no-legend {
        grid-template-columns: 1fr;
        padding-right: 16px; // necessary because overflow of last x-axis label will cause a scrollbar if there is no legend
    }
}

.chart-content {
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-template-rows: 1fr 100px;
}

.svg-container {
    grid-row: 1;
    grid-column: 2;
    min-height: 250px;
    min-width: 500px;
    position: relative;
    overflow: hidden;
    margin-right: 10px;
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
    grid-column: 2;
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
    background-image: linear-gradient(to right, rgba(var(--color), 0.2), rgba(var(--color), 0.2));

    padding: 12px;
    border-radius: 4px;
    left: calc(100% * var(--x));
    transform: translateX(calc(-100% * var(--x)));
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
        padding-top: 4px;
        border-top: 1px solid rgba(var(--color), 0.5);
    }
}

.scrollbar-container {
    margin-left: 100px;
    overflow-x: auto;

    > div {
        height: 1px;
    }
}
</style>
