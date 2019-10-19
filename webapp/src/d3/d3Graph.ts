import * as d3 from 'd3';
import { IViewport, IMargin, IHistoryData } from '../types';

type D3GraphProps = {
    viewport: IViewport;
    svg: HTMLElement;
    data: IHistoryData[];
};

export default class D3Graph {
    private svg: HTMLElement;
    private viewport: IViewport;
    private margin: IMargin;
    // TODO CHANGE ANY
    private data: any;
    private xScale: any;
    private yScale: any;
    public constructor(options: D3GraphProps) {
        this.svg = options.svg;
        this.viewport = options.viewport;
        this.margin = { top: 50, bottom: 50, left: 50, right: 50 };
        this.data = options.data;
        this.getXScale(this.data);
        this.getYScale(this.data);
    }

    public setViewport(viewport: IViewport) {
        d3.select(this.svg)
            .attr('width', viewport.width)
            .attr('height', viewport.height);
        this.viewport = viewport;
        this.resize();
    }

    public plot() {
        let svgLocal = d3.select(this.svg);

        let line = d3
            .line()
            .x((d: any) => this.xScale(new Date(d.time)))
            .y((d: any) => this.yScale(d.avg))
            .curve(d3.curveMonotoneX);

        // x axis
        svgLocal
            .append('g')
            .attr('class', 'x-axis')
            .attr(
                'transform',
                `translate(0, ${this.viewport.height - this.margin.bottom})`
            )
            .call(d3.axisBottom(this.xScale));
        // y axis
        svgLocal
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .call(d3.axisLeft(this.yScale));
        //path
        svgLocal
            .append('path')
            .attr('class', 'line')
            .datum(this.data)
            .attr('d', line);

        // circles
        svgLocal.selectAll('.dot');
    }

    public resize() {
        let svgLocal = d3.select(this.svg).html('');
        this.getXScale(this.data);
        this.getYScale(this.data);
        this.plot();
    }

    private getXScale(data: IHistoryData[]) {
        this.xScale = d3
            .scaleTime()
            .domain([new Date(data[0].time), new Date(data[59].time)])
            .range([this.margin.left, this.viewport.width - this.margin.right]);
    }

    private getYScale(data: IHistoryData[]) {
        this.yScale = d3
            .scaleLinear()
            .domain(<[number, number]>d3.extent(data, d => d.avg))
            .range([
                this.viewport.height - this.margin.top,
                this.margin.bottom
            ]);
    }
}
