<template>
    <div class="line-expo-chart" :class="{ 'no-legend': hideLegend }">
        <div style="position: relative">
            <canvas ref="canvas" />
        </div>

        <div v-if="!hideLegend && chart != null" class="legend">
            <div
                v-for="(dataset, index) in datasets"
                :key="dataset.label"
                class="dataset-label"
                :class="{ hidden: chart.data.datasets[index].hidden }"
                @click="toggleDataset(index)"
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
    import { sub, startOfDay, isSameDay } from 'date-fns';
    import { PropType } from 'vue';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import Chart from 'chart.js';

    export interface LineExpoChartDataset {
        label: string;
        color: HexColor;
        fill: boolean;
        aggregator: (expos: ExpoEvent[]) => number;
    }

    @Component({})
    export default class LineExpoChart extends Vue {
        @Prop({ required: true, type: Array as PropType<LineExpoChartDataset[]>, default: [] })
        private datasets!: LineExpoChartDataset[];

        @Prop({ required: false, type: Boolean, default: false })
        private hideLegend!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private stacked!: boolean;

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
                    duration: 150,
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
                            callback: this.yTickFormatter ?? ((value) => value)
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            color: 'rgba(255, 255, 255, 0.02)'
                        },
                    }],
                },
                tooltips: {
                    mode: "index",
                    callbacks: {
                        label: this.tooltipLabel ?? ((item, data) => `${item.value} ${data.datasets![item.datasetIndex!].label}`),
                        footer: this.tooltipFooter ?? (() => null!),
                    },
                },
            };
        }

        private get days() {
            return [...new Array(this.settingsModule.settings.charts.days)]
                .map((_, i) => {
                    return sub(startOfDay(new Date()), {
                        days: this.settingsModule.settings.charts.days - i - 1,
                    }).getTime();
                });
        }

        private readonly chartData: Chart.ChartData = {
            labels: this.labels,
            datasets: this.datasetsInternal,
        };

        private init() {
            this.updateDataAndLabels();

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

        private updateDataAndLabels() {
            const expos = this.expoModule.expos.filter((d) =>
                this.days.includes(startOfDay(d.date).getTime())
            );

            this.datasetsData.splice(0);
            this.datasetsData.push(
                ...this.datasets.map(
                    dataset => this.days.map((day, x) => ({
                        x,
                        y: dataset.aggregator(expos.filter(expo => isSameDay(expo.date, day)))
                    }))
                )
            );

            this.labels.splice(0);
            this.labels.push(
                ...this.days.map((day) => this.$d(day, 'short'))
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
                this.chart.update();
            }
        }

        private toggleDataset(index: number) {
            this.chart!.data.datasets![index].hidden = !this.chart!.data.datasets![index].hidden;

            this.renderOrUpdate();
        }
    }
</script>
<style lang="scss" scoped>
    .line-expo-chart {
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-columns: 1fr 200px;

        &.no-legend {
            grid-template-columns: 1fr;
        }
    }

    .dataset-label {
        padding: 8px;
        display: flex;
        flex-direction: row;
        cursor: pointer;

        .dataset-color {
            width: 16px;
            height: 16px;
            display: inline-block;
            border-radius: 3px;
            margin-right: 4px;
        }

        &.hidden {
            text-decoration: line-through;
            opacity: 0.4;

            .dataset-color {
                filter: grayscale(100%);
            }
        }
    }
</style>