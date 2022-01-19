<template>
    <div class="scrollable-chart">
        <div class="chart-container">
            <svg ref="svg">
                <template v-for="dataset in internalDatasets">
                    <path
                        :key="`background-${dataset.key}`"
                        :d="dataset.paths.background"
                        style="stroke: none; opacity: 0.5"
                        :style="{ fill: dataset.color }"
                    />
                    <path
                        :key="`line-${dataset.key}`"
                        :d="dataset.paths.line"
                        style="stroke-width: 2px; fill: none"
                        :style="{ stroke: dataset.color }"
                    />

                    <circle
                        v-for="(point, i) in dataset.linePoints"
                        :key="i"
                        :cx="point.x"
                        :cy="point.y"
                        :style="{ fill: dataset.color }"
                    />
                </template>
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
        @Ref('svg')
        private svg!: SVGElement;

        @Prop({ required: true, type: Array as PropType<ScrollableChartDataset[]> })
        private datasets!: ScrollableChartDataset[];

        private internalDatasets: ScrollableChartInternalDataset[] = [];

        @Watch('datasets', { immediate: true })
        private onDatasetsChanged() {
            this.internalDatasets = this.datasets.map(dataset => {
                const linePoints = this.computePathPoints(dataset.points);

                return {
                    ...dataset,
                    linePoints,
                    paths: {
                        line: this.getSvgPath(linePoints),
                        background: this.getSvgPath([
                            { x: 0, y: 0 },
                            ...linePoints,
                            { x: linePoints[linePoints.length - 1].x, y: 0 },
                        ]),
                    },
                };
            });
        }

        private mounted() {
            window.addEventListener('resize', () => this.onDatasetsChanged());
        }

        private getSvgPath(points: Point[], close = false) {
            const svgCommands = points.map((p, i) => `${i == 0 ? 'M' : 'L'} ${p.x} ${p.y}`);
            return svgCommands.join(' ') + (close ? ' Z' : '');
        }

        private computePathPoints(points: Point[]) {
            const width = this.svg.clientWidth;
            const height = this.svg.clientHeight;

            const sections = points.length - 1;
            const maxY = points.reduce((acc, cur) => Math.max(acc, cur.y), 0);
            const svgPoints: Point[] = points.map(p => ({
                x: width / sections * p.x,
                y: height * p.y / maxY,
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
        transform: scaleY(
            -1
        ); // flip axis so we don't have to flip the coordinates upside down
    }
</style>