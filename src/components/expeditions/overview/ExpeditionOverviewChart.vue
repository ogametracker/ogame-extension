<script lang="ts">
    import { Component } from "vue-property-decorator";
    import { VueLineChart } from "@/types/chartjs";
    import ExpoType from "@/models/expeditions/ExpoType";
    import { isSameDay, startOfDay, sub, format } from "date-fns";
    import ExpoModule from "@/store/modules/ExpoModule";
    import SettingsModule from "@/store/modules/SettingsModule";
    import { getDefaultChartColor } from "@/utils/colors";

    @Component({})
    export default class ExpeditionOverviewChart extends VueLineChart {
        private readonly expoModule = ExpoModule;
        private readonly settingsModule = SettingsModule;

        private chartOptions: Chart.ChartOptions = {
            responsive: true,
            responsiveAnimationDuration: 0,
            maintainAspectRatio: false,
            aspectRatio: 2,
            animation: {
                duration: 150,
            },
            scales: {
                yAxes: [
                    {
                        stacked: true,
                        afterFit: (scaleInstance) => {
                            scaleInstance.width = 100; //sets width of y-axis labels to 100px
                        },
                    },
                ],
            },
            tooltips: {
                mode: "index",
                callbacks: {
                    footer(items) {
                        const total = items.reduce((acc, cur) => acc + parseInt(cur.value!), 0);
                        return `${total} Expeditionen`;
                    },
                },
            },
        };

        private chartDatasets: Chart.ChartDataSets[] = [];
        private days = [...new Array(this.settingsModule.settings.charts.days)]
            .map((_, i) => {
                return sub(startOfDay(new Date()), {
                    days: this.settingsModule.settings.charts.days - i,
                }).getTime();
            });

        private chartData: Chart.ChartData = {
            labels: this.days.map((day) => format(day, "dd.MM.yyyy")),
            datasets: this.chartDatasets,
        };

        private update() {
            const testF = this.expoModule.expos.filter((d) =>
                this.days.includes(startOfDay(d.date).getTime())
            );

            this.chartDatasets.splice(0);
            this.chartDatasets.push(
                ...Object.keys(ExpoType).map((type, i) => {
                    const color = getDefaultChartColor(i);
                    return {
                        name: type,
                        label: type,
                        fill: true,
                        lineTension: 0,
                        borderWidth: 2,
                        pointRadius: 3,
                        backgroundColor: color.bg,
                        borderColor: color.border,
                        data: this.days.map((day, i) => ({
                            x: i,
                            y: testF.filter(
                                (ev) => ev.type == type && isSameDay(ev.date, day)
                            ).length,
                        })),
                    };
                })
            );

            this.dispatchRender();
        }

        private mounted() {
            this.update();
        }

        private dispatchRender() {
            setTimeout(() => {
                this.renderChart(this.chartData, this.chartOptions);
                this.$emit('render');
            }, 100);
        }
    }
</script>