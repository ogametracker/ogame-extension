<template>
    <div class="scrollable-chart">
        <div class="chart-container" ref="svg-container">
            <svg>
                <g v-if="filled">
                    <path
                        v-for="dataset in internalDatasets"
                        :key="`background-${dataset.key}`"
                        :d="dataset.paths.background"
                        class="dataset-background"
                        :style="{ fill: dataset.color }"
                    />
                </g>
                <g>
                    <path
                        v-for="dataset in internalDatasets"
                        :key="`line-${dataset.key}`"
                        :d="dataset.paths.line"
                        class="dataset-line"
                        :style="{ stroke: dataset.color }"
                    />
                </g>
                <g>
                    <!-- TODO: one single group per x-axis position for hover events -->
                    <g
                        v-for="dataset in internalDatasets"
                        :key="`points-${dataset.key}`"
                    >
                        <circle
                            v-for="(point, i) in dataset.linePoints"
                            :key="i"
                            class="dataset-point"
                            :cx="point.x"
                            :cy="point.y"
                            :style="{ fill: dataset.color }"
                        />
                    </g>
                </g>
            </svg>
        </div>

        <div class="scrollbar-container" />
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

    interface Point {
        x: number;
        y: number;
    }

    export interface ScrollableChartDataset {
        key: string | number;
        points: Point[];
        color: string;
        label: string;
    }

    interface ScrollableChartInternalDataset extends ScrollableChartDataset {
        linePoints: Point[];
        paths: {
            line: string;
            background: string;
        };
    }

    @Component({})
    export default class ScrollableChart extends Vue {
        @Ref('svg-container')
        private svgContainer!: HTMLElement;

        @Prop({ required: true, type: Array as PropType<ScrollableChartDataset[]> })
        private datasets!: ScrollableChartDataset[];

        @Prop({ required: false, type: Boolean })
        private stacked!: boolean;

        @Prop({ required: false, type: Boolean })
        private filled!: boolean;

        private internalDatasets: ScrollableChartInternalDataset[] = [];
        private readonly resizeObserver = new ResizeObserver(() => this.onDatasetsChanged());

        @Watch('datasets')
        private onDatasetsChanged() {
            const height = this.svgContainer.clientHeight;

            let maxY = 0;

            const mappedDatasets: ScrollableChartDataset[] = [];
            this.datasets.forEach((dataset, i) => {
                const points = dataset.points.map(p => {
                    if (!this.stacked) {
                        maxY = Math.max(p.y, maxY);
                        return p;
                    }

                    const y = p.y + (mappedDatasets[i - 1]?.points.find(pt => pt.x == p.x)?.y ?? 0);
                    maxY = Math.max(y, maxY);

                    return {
                        x: p.x,
                        y,
                    };
                });

                mappedDatasets.push({
                    ...dataset,
                    points,
                });
            });

            const internalDatasets: ScrollableChartInternalDataset[] = mappedDatasets.map(dataset => {
                const linePoints = this.computePathPoints(dataset.points, maxY);

                return {
                    ...dataset,
                    linePoints,
                    paths: {
                        line: this.getSvgPath(linePoints),
                        background: this.getSvgPath([
                            { x: 0, y: height },
                            ...linePoints,
                            { x: linePoints[linePoints.length - 1].x, y: height },
                        ]),
                    },
                };
            });
            this.internalDatasets = internalDatasets.reverse();
        }


        private mounted() {
            this.resizeObserver.observe(this.svgContainer);

            this.onDatasetsChanged();
        }

        private destroyed() {
            this.resizeObserver.disconnect();
        }

        private getSvgPath(points: Point[], close = false) {
            const svgCommands = points.map((p, i) => `${i == 0 ? 'M' : 'L'} ${p.x} ${p.y}`);
            return svgCommands.join(' ') + (close ? ' Z' : '');
        }

        private computePathPoints(points: Point[], maxY: number) {
            const width = this.svgContainer.clientWidth;
            const height = this.svgContainer.clientHeight;

            const sections = points.length - 1;
            const svgPoints: Point[] = points.map(p => ({
                x: width * p.x / sections,
                y: height * (1 - p.y / maxY),
            }));

            return svgPoints;
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
    }

    .dataset-background {
        stroke: none;
        opacity: 0.8;
        filter: brightness(0.8);
    }

    .dataset-line {
        fill: none;
        stroke-width: 2px;
    }

    .dataset-point {
        will-change: r;
        transition: r 0.3s ease-in-out;
        r: 3px;

        &:hover {
            r: 5px;
        }
    }
</style>