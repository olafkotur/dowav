import * as d3 from 'd3';
import {
    IViewport,
    IMargin,
    IHistoryData,
    MultipleHistoryData,
    HistoryData
} from '../types';

type D3GraphProps = {
    viewport: IViewport;
    svg: HTMLElement;
    data: HistoryData;
};

const colors = ['#ffa500', '#ff2929', '#7a7aed'];

export default class D3Graph {
    private svg: HTMLElement;
    private viewport: IViewport;
    private margin: IMargin;
    // TODO CHANGE ANY
    private data: HistoryData;
    private xScale: any;
    private yScale: any;
    public constructor(options: D3GraphProps) {
        this.svg = options.svg;
        this.viewport = options.viewport;
        this.margin = { top: 40, bottom: 40, left: 40, right: 40 };
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

    public plot(on?: string) {
        if (this.data instanceof Array) {
            let svgLocal = d3.select(this.svg);
            let t = d3
                .transition()
                .duration(500)
                .ease(d3.easeLinear);
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
                .attr('stroke', colors[0])
                .datum(this.data)
                .attr('d', <any>line);

            if (on === 'start') {
                svgLocal
                    .attr('opacity', 0)
                    .transition(<any>t)
                    .attr('opacity', 1);
            }

            // circles
            svgLocal.selectAll('.dot');
            //Dumy comment
        } else if (typeof this.data === 'object') {
            let svgLocal = d3.select(this.svg);
            let line = d3
                .line()
                .x((d: any) => this.xScale(new Date(d.time)))
                .y((d: any) => this.yScale(d.avg))
                .curve(d3.curveMonotoneX);
            let t = d3
                .transition()
                .duration(500)
                .ease(d3.easeLinear);
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

            let i = 0;
            for (let key in this.data) {
                //path
                svgLocal
                    .append('path')
                    .attr('class', 'line')
                    .attr('stroke', colors[i])
                    .datum(this.data[key])
                    .attr('d', <any>line);

                if (on === 'start') {
                    svgLocal
                        .attr('opacity', 0)
                        .transition(<any>t)
                        .attr('opacity', 1);
                }
                // circles
                svgLocal.selectAll('.dot');
                i++;
            }
        }
    }

    public resize() {
        let svgLocal = d3.select(this.svg).html('');

        this.getXScale(this.data);
        this.getYScale(this.data);
        this.plot();
    }

    private getXScale(data: HistoryData) {
        if (data instanceof Array) {
            this.xScale = d3
                .scaleTime()
                .domain([
                    new Date(data[0].time),
                    new Date(data[data.length - 1].time)
                ])
                .range([
                    this.margin.left,
                    this.viewport.width - this.margin.right
                ]);
        } else if (typeof data === 'object') {
            let minmax = [];
            for (let key in data) {
                minmax.push(...d3.extent(data[key], d => d.time));
            }
            minmax = d3.extent(minmax as any);
            this.xScale = d3
                .scaleTime()
                .domain([
                    new Date(minmax[0] as any),
                    new Date(minmax[1] as any)
                ])
                .range([
                    this.margin.left,
                    this.viewport.width - this.margin.right
                ]);
        }
    }

    private getYScale(data: HistoryData) {
        if (data instanceof Array) {
            this.yScale = d3
                .scaleLinear()
                .domain(<[number, number]>d3.extent(data, d => d.avg))
                .range([
                    this.viewport.height - this.margin.top,
                    this.margin.bottom
                ]);
        } else if (typeof data === 'object') {
            let minmax: (number | undefined)[] = [];
            for (let key in data) {
                minmax.push(...d3.extent(data[key], d => d.avg));
            }
            this.yScale = d3
                .scaleLinear()
                .domain(d3.extent(minmax as any) as any)
                .range([
                    this.viewport.height - this.margin.top,
                    this.margin.bottom
                ]);
        }
    }
}
