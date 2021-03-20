<script lang="ts">
    import { Component } from "vue-property-decorator";
    import { VueLineChart } from "@/types/chartjs";
    import ExpoType from "@/models/expeditions/ExpoType";
    import { isSameDay, startOfDay, sub, format } from "date-fns";
    import ExpoModule from "@/store/modules/ExpoModule";
    import SettingsModule from "@/store/modules/SettingsModule";
    import { defaultMixColor, HexColor } from "@/utils/colors";
    import Resource from "@/models/Resource";
    import { ExpoEventResources } from "@/models/expeditions/ExpoEvent";

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
                callbacks: {},
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

        private readonly colors: Record<Resource, HexColor> = {
            metal: '#ff6d01',
            crystal: '#4285f4',
            deuterium: '#34a875',
        };

        private update() {
            const testF = this.expoModule.expos.filter((d) =>
                this.days.includes(startOfDay(d.date).getTime())
                && d.type == ExpoType.resources
            ) as ExpoEventResources[];

            this.chartDatasets.splice(0);
            this.chartDatasets.push(
                ...Object.keys(Resource).map((resourceName) => {
                    const resource = resourceName as Resource;
                    return {
                        name: resourceName,
                        label: resourceName,
                        fill: true,
                        lineTension: 0,
                        borderWidth: 2,
                        pointRadius: 3,
                        backgroundColor: defaultMixColor(this.colors[resource]),
                        borderColor: this.colors[resource],
                        data: this.days.map((day, i) => ({
                            x: i,
                            y: testF.filter((ev) => isSameDay(ev.date, day))
                                .reduce((acc, cur) => acc + cur.resources[resource], 0),
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