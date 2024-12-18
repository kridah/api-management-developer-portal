import * as ko from "knockout";
import { HealthCheckData, HealthCheck } from "../healthCheck";
import * as d3 from "d3";

export class HealthCheckViewModel {
    public healthCheckData: ko.Observable<HealthCheckData>;
    public uptimePercentage: ko.Observable<number>;
    public statusMessage: ko.Observable<string>;

    constructor(private readonly healthCheck: HealthCheck) {
        this.healthCheckData = ko.observable<HealthCheckData>();
        this.uptimePercentage = ko.observable<number>();
        this.statusMessage = ko.observable<string>();
    }

    public async loadHealthCheckData(): Promise<void> {
        const data = await this.healthCheck.fetchHealthCheckData();
        this.healthCheckData(data);
        this.uptimePercentage(data.uptimePercentage);
        this.statusMessage(data.message);
        this.renderGraph(data);
    }

    private renderGraph(data: HealthCheckData): void {
        const width = 700;
        const height = 380;
        const margin = { top: 20, right: 0, bottom: 30, left: 70 };
        const barWidth = 10;
        const fontSize = 15;

        const svg = d3
            .select("div[data-bind='barChart: healthCheckData']")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);

        const x = d3.scaleTime()
            .domain([new Date(data.timestamp.getTime() - 24 * 60 * 60 * 1000), data.timestamp])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = g => g
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .style("font-size", fontSize)
            .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .style("font-size", fontSize)
            .call(d3.axisLeft(y).ticks(5))
            .call(g => g.select(".domain").remove());

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        svg.append("g")
            .attr("fill", "#1786d8")
            .selectAll("rect")
            .data([data])
            .join("rect")
            .attr("x", d => x(d.timestamp) - barWidth / 2)
            .attr("y", d => y(d.uptimePercentage))
            .attr("height", d => y(0) - y(d.uptimePercentage))
            .attr("width", barWidth);
    }
}
