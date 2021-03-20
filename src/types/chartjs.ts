import { Component, Vue } from "vue-property-decorator";
import { Bar, Bubble, Doughnut, HorizontalBar, Line, Pie, PolarArea, Radar, Scatter } from 'vue-chartjs';

@Component({ extends: Bar })
export class VueBarChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}

@Component({ extends: Bubble })
export class VueBubbleChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}

@Component({ extends: Doughnut })
export class VueDoughnutChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}

@Component({ extends: HorizontalBar })
export class VueHorizontalBarChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}

@Component({ extends: Line })
export class VueLineChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}

@Component({ extends: Pie })
export class VuePieChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}

@Component({ extends: PolarArea })
export class VuePolarAreaChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}

@Component({ extends: Radar })
export class VueRadarChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}

@Component({ extends: Scatter })
export class VueScatterChart extends Vue {
    protected renderChart!: (chartData: Chart.ChartData, options?: Chart.ChartOptions) => void;
}