import * as d3 from 'd3';
import {
    IViewport,
    IMargin,
    IHistoryData,
    MultipleHistoryData,
    HistoryData,
    GraphConfiguration,
    TimePeriod
} from '../types';
import * as MENU_OPTIONS from '../constants/MenuOptionConstants';
import d3LineGradients from '../d3/d3LineGradients';

type D3GraphProps = {
    viewport: IViewport;
    svg: HTMLElement;
    data: HistoryData;
    conf: GraphConfiguration & { timePeriod: TimePeriod };
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
    private conf: GraphConfiguration & { timePeriod: TimePeriod };
    private tooltip: any;
    public constructor(options: D3GraphProps) {
        this.svg = options.svg;
        this.viewport = options.viewport;
        this.margin = { top: 40, bottom: 40, left: 40, right: 40 };
        this.data = options.data;
        this.conf = options.conf;
        this.getXScale(this.data);
        this.getYScale(this.data);
        this.tooltip = d3
            .select(this.svg.parentNode as any)
            .append('div')
            .attr('class', 'tooltip');
    }

    public setViewport(viewport: IViewport) {
        d3.select(this.svg)
            .attr('width', viewport.width)
            .attr('height', viewport.height);
        this.viewport = viewport;
        this.resize();
    }

    public showTip() {
        const { offsetX, offsetY } = d3.event;
        let dot = d3.select(this.svg).select('circle');
        if (
            offsetX > this.margin.left &&
            offsetX < this.viewport.width - this.margin.right &&
            offsetY > this.margin.top &&
            offsetY < this.viewport.height - this.margin.bottom
        ) {
            console.log(d3.event);
            let x = this.xScale.invert(offsetX);
            if (this.data instanceof Array) {
                let index = this.data.findIndex(d => d.time > x);
                let sX = this.xScale(this.data[index].time);
                if (dot.empty()) {
                    d3.select(this.svg)
                        .append('circle')
                        .attr('cx', sX)
                        .attr('cy', this.yScale(this.data[index].avg))
                        .attr('r', 5)
                        .attr('fill', 'none')
                        .attr('stroke', 'white');
                } else {
                    dot.attr('cx', this.xScale(this.data[index].time)).attr(
                        'cy',
                        this.yScale(this.data[index].avg)
                    );
                    this.tooltip
                        .html(
                            `<p>${new Date(
                                this.data[index].time
                            ).toLocaleString()}</p><p>Value: ${this.data[
                                index
                            ].avg.toFixed(2)}</p>`
                        )
                        .classed('show', true)
                        .style(
                            'top',
                            Math.floor(
                                this.yScale(this.data[index].avg) +
                                    this.margin.top
                            ) + 'px'
                        )
                        .style('left', Math.floor(sX) + 'px')
                        .style(
                            'margin-left',
                            sX > this.viewport.width / 2 ? '-130px' : '0px'
                        );
                    console.log(sX > this.viewport.width / 2);
                }
                // tooltip
            }
        } else {
            if (!dot.empty()) {
                dot.remove();
            }
            this.tooltip.classed('show', false);
        }
    }

    public plot(on?: string) {
        let svgLocal = d3.select(this.svg);
        // Events
        svgLocal.on('mousemove', () => this.showTip());

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
        const availableWidth =
            this.viewport.width - this.margin.left - this.margin.right;
        const bottomAxis = d3
            .axisBottom(this.xScale)
            .ticks(Math.floor(availableWidth / 60));
        svgLocal
            .append('g')
            .attr('class', 'x-axis')
            .attr(
                'transform',
                `translate(0, ${this.viewport.height - this.margin.bottom})`
            )
            .call(bottomAxis);
        // y axis
        const axisLeft = d3.axisLeft(this.yScale);
        svgLocal
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .call(axisLeft);
        const dashedLines = svgLocal.append('g').classed('dashed-line-g', true);
        (axisLeft.scale() as any).ticks().forEach((d: number[]) => {
            dashedLines
                .append('line')
                .classed('dashed-line', true)
                .attr('x1', this.margin.left)
                .attr('y1', this.yScale(d))
                .attr('x2', this.viewport.width - this.margin.right)
                .attr('y2', this.yScale(d));
        });
        if (this.data instanceof Array) {
            if (
                this.conf.name === MENU_OPTIONS.TEMPERATURE ||
                this.conf.name === MENU_OPTIONS.MOISTURE ||
                this.conf.name === MENU_OPTIONS.LIGHT
            ) {
                d3LineGradients.drawGradient(
                    svgLocal,
                    this.viewport,
                    this.conf.name
                );
            }
            //path
            svgLocal
                .append('path')
                .attr('class', 'line')
                .attr(
                    'stroke',
                    this.conf.name === MENU_OPTIONS.TEMPERATURE ||
                        this.conf.name === MENU_OPTIONS.MOISTURE ||
                        this.conf.name === MENU_OPTIONS.LIGHT
                        ? 'url(#line-gradient)'
                        : colors[0]
                )
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
        } else if (typeof this.data === 'object') {
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
