import Chart, { Point } from "chart.js";

Chart.Tooltip.positioners.top = (elements: any[], eventPosition: Point): Point => {
    return {
        x: eventPosition.x,
        y: 0,
    };
};