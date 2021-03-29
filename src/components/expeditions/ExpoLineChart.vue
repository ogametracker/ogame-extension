<template>
    <div class="line-chart" :class="{ 'no-legend': hideLegend }">
        <div class="scrollable-chart">
            <div class="chart-container">
                <canvas ref="canvas" />
            </div>
            <div class="chart-scrollbar-container">
                <div
                    class="chart-scrollbar"
                    ref="scrollbar"
                    @scroll="updateScroll()"
                >
                    <div
                        class="thumb"
                        :style="{
                            width:
                                (100 * allDays.length) /
                                    settingsModule.settings.charts.days +
                                '%',
                        }"
                    />
                </div>
            </div>
        </div>

        <div v-if="!hideLegend && chart != null" class="legend">
            <div
                v-for="(dataset, index) in datasets"
                :key="dataset.label"
                class="dataset-label"
                :class="{
                    'dataset-label-hidden':
                        chart &&
                        chart.data &&
                        chart.data.datasets &&
                        chart.data.datasets[index].hidden,
                }"
                @click.prevent.stop="toggleDataset(index)"
            >
                <span
                    class="dataset-color"
                    :style="{ 'background-color': dataset.color }"
                />
                {{ dataset.label }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import ExpoEvent from '@/models/expeditions/ExpoEvent';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { defaultMixColor, HexColor } from '@/utils/colors';
    import { sub, startOfDay, add } from 'date-fns';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Chart from 'chart.js';
    import i18n from '@/i18n';

    export interface ExpoLineChartDataset {
        label: string;
        color: HexColor;
        fill: boolean;
        aggregator: (expos: ExpoEvent[]) => number;
    }

    @Component({})
    export default class ExpoLineChart extends Vue {
        @Prop({ required: true, type: Array as PropType<ExpoLineChartDataset[]>, default: [] })
        private datasets!: ExpoLineChartDataset[];

        @Prop({ required: false, type: Boolean, default: false })
        private hideLegend!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private stacked!: boolean;

        @Prop({ required: false, type: Boolean, default: true })
        private hideZerosInTooltip!: boolean;

        @Prop({ required: false, type: Function as PropType<(value: any, index: number, values: any[]) => any>, default: null })
        private yTickFormatter!: ((value: any, index: number, values: any[]) => any) | undefined;

        @Prop({ required: false, type: Function as PropType<(tooltipItem: any, data: any) => string>, default: undefined })
        private tooltipLabel!: ((tooltipItem: any, data: any) => string) | undefined;

        @Prop({ required: false, type: Function as PropType<(items: any[]) => string>, default: undefined })
        private tooltipFooter!: ((items: any[]) => string) | undefined;

        private readonly expoModule = ExpoModule;
        private readonly settingsModule = SettingsModule;
        private chart: Chart | null = null;

        private readonly labels: string[] = [];
        private readonly datasetsData: { x: number; y: number }[][] = [];
        private readonly datasetsInternal: Chart.ChartDataSets[] = [];

        private readonly fullDatasetsData: number[][] = [];

        private daysOffset = 0;


        private get context() {
            return (this.$refs.canvas as HTMLCanvasElement).getContext('2d')!;
        }

        private get chartOptions(): Chart.ChartOptions {
            return {
                legend: {
                    display: false,
                },
                responsive: true,
                responsiveAnimationDuration: 0,
                maintainAspectRatio: false,
                aspectRatio: 2,
                animation: {
                    duration: 0,
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        stacked: this.stacked,
                        afterFit: (scaleInstance) => {
                            scaleInstance.width = 100; //sets width of y-axis labels to 100px
                        },
                        ticks: {
                            callback: this.yTickFormatter ?? ((value) => value),
                            min: 0,
                            max: this.maxValue,
                            precision: 0,
                        },
                    }],
                    xAxes: [{
                        gridLines: {
                            color: 'rgba(255, 255, 255, 0.02)'
                        },
                    }],
                },
                tooltips: {
                    mode: 'x-axis',
                    callbacks: {
                        label: this.tooltipLabel ?? ((item, data) => `${item.value} ${data.datasets![item.datasetIndex!].label}`),
                        footer: this.tooltipFooter ?? (() => null!),
                    },
                    filter: (tooltipItem) =>  {
                        return !this.hideZerosInTooltip || tooltipItem.yLabel != 0;
                    },
                    position: 'top',
                },
                hover: {
                    animationDuration: 0,
                },
            };
        }

        private readonly chartData: Chart.ChartData = {
            labels: this.labels,
            datasets: this.datasetsInternal,
        };

        private maxValue = 1;
        private readonly allDays: Date[] = [];

        private init() {
            this.initData();

            this.datasetsInternal.push(
                ...this.datasets.map((dataset, i) => ({
                    label: dataset.label,
                    fill: dataset.fill ?? true,
                    hidden: false,
                    lineTension: 0,
                    borderWidth: 2,
                    pointRadius: 3,
                    borderColor: dataset.color,
                    backgroundColor: defaultMixColor(dataset.color),
                    data: this.datasetsData[i],
                }))
            );
        }

        private initData() {
            const firstTrackedDay = this.expoModule.firstExpo?.date;
            const xDaysAgo = startOfDay(sub(new Date(), { days: this.settingsModule.settings.charts.days - 1 }));
            const firstDay = firstTrackedDay == null || startOfDay(firstTrackedDay) > xDaysAgo
                ? xDaysAgo
                : startOfDay(firstTrackedDay);

            let currentDay = firstDay;
            const today = startOfDay(new Date());
            while (currentDay <= today) {
                this.allDays.push(currentDay);
                currentDay = add(currentDay, { days: 1 });
            }

            const exposByDay = this.expoModule.byDay;

            this.fullDatasetsData.push(
                ...this.datasets.map(
                    dataset => this.allDays.map(
                        day => dataset.aggregator(exposByDay[day.getTime()] ?? [])
                    )
                )
            );

            this.updateMaxValue();
            this.updateDataAndLabels();
        }

        private updateMaxValue() {
            this.maxValue = 1;

            const datasets = this.chart?.data.datasets;

            //find cumulative max
            this.allDays.forEach((_, i) => {
                const max = this.fullDatasetsData.reduce((acc, data, datasetIndex) => {
                    if (datasets?.[datasetIndex].hidden) {
                        return acc;
                    }

                    if (this.stacked) {
                        return acc + data[i];
                    }
                    return Math.max(acc, data[i]);
                }, 0);

                if (max > this.maxValue) {
                    this.maxValue = max;
                }
            });
            //round up to nicer value
            const power = Math.max(0, Math.floor(this.maxValue).toString().length - 1);
            this.maxValue = (Math.floor(this.maxValue / 10 ** power) + 1) * 10 ** power;
        }

        private updateDataAndLabels() {
            const count = this.settingsModule.settings.charts.days;
            const startIndex = this.allDays.length - this.daysOffset - count;
            const indices: number[] = [];
            for (let i = 0; i < count; i++) {
                indices.push(i + startIndex);
            }

            if (this.datasetsData.length == 0) {
                this.datasetsData.push(
                    ...this.datasets.map(
                        () => indices.map(index => ({
                            x: index - startIndex,
                            y: 0,
                        }))
                    )
                );
            }

            this.datasetsData.forEach((data, datasetIndex) => {
                indices.forEach((totalIndex, i) => {
                    data[i].y = this.fullDatasetsData[datasetIndex][totalIndex] ?? 0;
                });
            });

            this.labels.splice(0);
            this.labels.push(
                ...indices.map((index) => i18n.formatDate(this.allDays[index], 'short'))
            );
        }

        private mounted() {
            this.init();
            this.renderOrUpdate();
        }

        private renderOrUpdate() {
            if (this.chart == null) {
                this.chart = new Chart(this.context, {
                    type: 'line',
                    data: this.chartData,
                    options: this.chartOptions,
                });
            } else {
                this.chart.options = this.chartOptions;
                this.chart.update();
            }
        }

        private toggleDataset(index: number) {
            this.chart!.data.datasets![index].hidden = !this.chart!.data.datasets![index].hidden;

            this.updateMaxValue();
            this.renderOrUpdate();
        }

        private get scrollbar(): HTMLDivElement {
            return this.$refs.scrollbar as HTMLDivElement;
        }

        private updateScroll() {
            const scroll = 1 + (this.scrollbar.scrollLeft / (this.scrollbar.scrollWidth - this.scrollbar.clientWidth));

            const daysOffset = this.allDays.length
                - this.settingsModule.settings.charts.days
                - Math.round(scroll * (this.allDays.length - this.settingsModule.settings.charts.days));

            if (daysOffset != this.daysOffset) {
                this.daysOffset = daysOffset;
                this.updateDataAndLabels();
                this.renderOrUpdate();
            }
        }
    }
</script>