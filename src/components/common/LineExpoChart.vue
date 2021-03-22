<script lang="ts">
    import ExpoEvent from '@/models/expeditions/ExpoEvent';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { VueLineChart } from '@/types/chartjs';
    import { defaultMixColor, HexColor } from '@/utils/colors';
    import { sub, startOfDay, format, isSameDay } from 'date-fns';
    import { PropType } from 'vue';
    import { Component, Prop } from 'vue-property-decorator';

    export interface LineExpoChartDataset {
        label: string;
        name?: string;
        color: HexColor;
        fill?: boolean;
        aggregator: (expos: ExpoEvent[]) => number;
    }

    @Component({})
    export default class LineExpoChart extends VueLineChart {
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

        private get chartOptions(): Chart.ChartOptions {
            return {
                legend: {
                    display: !this.hideLegend,
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

        private get chartDatasets(): Chart.ChartDataSets[] {
            const expos = this.expoModule.expos.filter((d) =>
                this.days.includes(startOfDay(d.date).getTime())
            );
            return this.datasets.map(dataset => ({
                name: dataset.name,
                label: dataset.label,
                fill: dataset.fill ?? true,
                lineTension: 0,
                borderWidth: 2,
                pointRadius: 3,
                borderColor: dataset.color,
                backgroundColor: defaultMixColor(dataset.color),
                data: this.days.map((day, x) => ({
                    x,
                    y: dataset.aggregator(expos.filter(expo => isSameDay(expo.date, day)))
                }))
            }));
        }

        private days = [...new Array(this.settingsModule.settings.charts.days)]
            .map((_, i) => {
                return sub(startOfDay(new Date()), {
                    days: this.settingsModule.settings.charts.days - i - 1,
                }).getTime();
            });

        private chartData: Chart.ChartData = {
            labels: this.days.map((day) => this.$d(day, 'short')),
            datasets: this.chartDatasets,
        };

        private mounted() {
            this.dispatchRender();
        }

        private dispatchRender() {
            setTimeout(() => {
                this.renderChart(this.chartData, this.chartOptions);
                this.$emit('render');
            }, 100);
        }
    }
</script>