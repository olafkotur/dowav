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
    private line: any;
    private xAxis: any;
    private yAxis: any;
    private dashedLines: any;
    public constructor(options: D3GraphProps) {
        this.svg = options.svg;
        this.viewport = options.viewport;
        this.margin = { top: 40, bottom: 40, left: 40, right: 40 };
        this.conf = options.conf;
        this.data = this.scaleData(options.data);
        this.getXScale(this.data);
        this.getYScale(this.data);
        this.tooltip = d3
            .select(this.svg.parentNode as any)
            .append('div')
            .attr('class', 'tooltip');
        // Add html
        if (this.data instanceof Array) {
            this.line = d3
                .select(this.svg)
                .append('path')
                .attr('class', 'line')
                .attr(
                    'stroke',
                    this.conf.name === MENU_OPTIONS.TEMPERATURE ||
                        this.conf.name === MENU_OPTIONS.MOISTURE ||
                        this.conf.name === MENU_OPTIONS.LIGHT
                        ? 'url(#line-gradient)'
                        : colors[0]
                );
        } else if (typeof this.data === 'object') {
            let keys = Object.keys(this.data);
            this.line = [];
            for (let i = 0; i < keys.length; i++) {
                this.line.push(
                    d3
                        .select(this.svg)
                        .append('path')
                        .attr('class', 'line')
                        .attr('stroke', colors[i])
                );
            }
        }
        this.xAxis = d3
            .select(this.svg)
            .append('g')
            .attr('class', 'x-axis')
            .attr(
                'transform',
                `translate(0, ${this.viewport.height - this.margin.bottom})`
            );
        this.yAxis = d3
            .select(this.svg)
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${this.margin.left}, 0)`);
        this.dashedLines = d3
            .select(this.svg)
            .append('g')
            .classed('dashed-line-g', true);
    }

    public setConf(
        conf: GraphConfiguration & { timePeriod: TimePeriod },
        data: HistoryData
    ) {
        this.conf = conf;
        this.data = this.scaleData(data);
        this.getXScale(this.data);
        this.getYScale(this.data);
        this.plot('update');
    }

    private scaleData(data: HistoryData): HistoryData {
        const { timePeriod } = this.conf;
        if (timePeriod.timePeriod / 5 === 1) {
            if (data instanceof Array) {
                return [...data];
            } else if (typeof data === 'object') {
                let obj: any = {};
                for (let keys in data) {
                    obj[keys] = [...data[keys]];
                }
                return obj;
            }
        } else {
            const k = timePeriod.timePeriod / 5;
            return this.computeData(data, k);
        }
        return data;
    }

    private computeData(data: HistoryData, k: number): HistoryData {
        if (data instanceof Array) {
            let newData = [];
            let tempAvg = 0;
            let tempTime = 0;
            for (let i = 0; i < data.length; i++) {
                if (i % k === k - 1 || i === data.length - 1) {
                    tempAvg += data[i].value;

                    const divider = i % k === k - 1 ? k : data.length % k;
                    newData.push({
                        time: tempTime,
                        value: tempAvg / divider,
                        min: 0,
                        max: 0
                    });

                    tempAvg = 0;
                    tempTime = 0;
                } else {
                    tempAvg += data[i].value;
                    if (i % k === 0) tempTime = data[i].time;
                }
            }
            return [...newData];
        } else if (typeof data === 'object') {
            const newObj: any = {};
            for (let key in data) {
                const zoneData = data[key];
                let newData = [];
                let tempAvg = 0;
                let tempTime = 0;
                for (let i = 0; i < zoneData.length; i++) {
                    if (i % k === k - 1 || i === zoneData.length - 1) {
                        tempAvg += zoneData[i].value;

                        const divider =
                            i % k === k - 1 ? k : zoneData.length % k;
                        newData.push({
                            time: tempTime,
                            value: tempAvg / divider,
                            min: 0,
                            max: 0
                        });

                        tempAvg = 0;
                        tempTime = 0;
                    } else {
                        tempAvg += zoneData[i].value;
                        if (i % k === 0) tempTime = zoneData[i].time;
                    }
                }
                newObj[key] = newData;
            }
            return newObj;
        }
        return data;
    }

    public setViewport(viewport: IViewport) {
        d3.select(this.svg)
            .attr('width', viewport.width)
            .attr('height', viewport.height);
        this.viewport = viewport;
        this.resize();
    }

    // Graphs with one source only could be live
    // Add if statements if that have been changed.
    public goLive(): void {
        this.dashedLines.html('');
        this.line.remove();
        this.xAxis.html('');
        this.yAxis.html('');
        this.line = d3
            .select(this.svg)
            .append('path')
            .attr('class', 'line')
            .attr(
                'stroke',
                this.conf.name === MENU_OPTIONS.TEMPERATURE ||
                    this.conf.name === MENU_OPTIONS.MOISTURE ||
                    this.conf.name === MENU_OPTIONS.LIGHT
                    ? 'url(#line-gradient)'
                    : colors[0]
            );
        // Data go here
    }

    public addLiveData(data: any) {
        this.data = data;
        this.getXScale(this.data);
        this.getYScale(this.data);
        this.plot('live');
    }

    public goHistory(data: HistoryData): void {
        this.data = this.scaleData(data);
        this.getXScale(this.data);
        this.getYScale(this.data);
        this.line.remove();
        this.line = d3
            .select(this.svg)
            .append('path')
            .attr('class', 'line')
            .attr(
                'stroke',
                this.conf.name === MENU_OPTIONS.TEMPERATURE ||
                    this.conf.name === MENU_OPTIONS.MOISTURE ||
                    this.conf.name === MENU_OPTIONS.LIGHT
                    ? 'url(#line-gradient)'
                    : colors[0]
            );
        this.plot('start');
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
            let x = this.xScale.invert(offsetX);
            if (this.data instanceof Array) {
                let index = this.data.findIndex(d => d.time > x);
                let sX = this.xScale(this.data[index].time);
                if (dot.empty()) {
                    d3.select(this.svg)
                        .append('circle')
                        .attr('cx', sX)
                        .attr('cy', this.yScale(this.data[index].value))
                        .attr('r', 5)
                        .attr('fill', 'none')
                        .attr('stroke', 'white');
                } else {
                    dot.attr('cx', this.xScale(this.data[index].time)).attr(
                        'cy',
                        this.yScale(this.data[index].value)
                    );
                    this.tooltip
                        .html(
                            `<p>${new Date(
                                this.data[index].time
                            ).toLocaleString()}</p><p>Value: ${this.data[
                                index
                            ].value.toFixed(2)}</p>`
                        )
                        .classed('show', true)
                        .style(
                            'top',
                            Math.floor(
                                this.yScale(this.data[index].value) +
                                    this.margin.top
                            ) + 'px'
                        )
                        .style('left', Math.floor(sX) + 'px')
                        .style(
                            'margin-left',
                            sX > this.viewport.width / 2 ? '-130px' : '0px'
                        );
                }
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
        svgLocal.on('mouseleave', () => {
            d3.select(this.svg)
                .select('circle')
                .remove();
            this.tooltip.classed('show', false);
        });

        let t = d3
            .transition()
            .duration(500)
            .ease(d3.easeLinear);
        let line = d3
            .line()
            .x((d: any) => this.xScale(new Date(d.time)))
            .y((d: any) => this.yScale(d.value))
            .curve(d3.curveMonotoneX);
        // x axis
        const availableWidth =
            this.viewport.width - this.margin.left - this.margin.right;
        const bottomAxis = d3
            .axisBottom(this.xScale)
            .ticks(Math.floor(availableWidth / 60));
        this.xAxis.call(bottomAxis);
        // y axis
        const axisLeft = d3.axisLeft(this.yScale);
        this.yAxis.call(axisLeft);
        this.dashedLines.html('');
        (axisLeft.scale() as any).ticks().forEach((d: number[]) => {
            this.dashedLines
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
            this.line.datum(this.data).attr('d', line as any);

            if (on === 'live') {
                this.line
                    .attr('transform', null)
                    .transition()
                    .attr('transform', 'translate("-20")');
            }

            if (on === 'update') {
                this.line
                    .attr(
                        'stroke-dasharray',
                        this.line.node().getTotalLength() +
                            ' ' +
                            this.line.node().getTotalLength()
                    )
                    .attr(
                        'stroke-dashoffset',
                        this.line.node().getTotalLength()
                    )
                    .transition()
                    .duration(700)
                    .attr('stroke-dashoffset', 0);
            }
            if (on === 'start') {
                svgLocal
                    .attr('opacity', 0)
                    .transition(t as any)
                    .attr('opacity', 1);
            }

            // circles
            svgLocal.selectAll('.dot');
        } else if (typeof this.data === 'object') {
            let i = 0;
            for (let key in this.data) {
                //path
                this.line[i].datum(this.data[key]).attr('d', <any>line);

                if (on === 'update') {
                    this.line[i]
                        .attr(
                            'stroke-dasharray',
                            this.line[i].node().getTotalLength() +
                                ' ' +
                                this.line[i].node().getTotalLength()
                        )
                        .attr(
                            'stroke-dashoffset',
                            this.line[i].node().getTotalLength()
                        )
                        .transition()
                        .duration(700)
                        .attr('stroke-dashoffset', 0);
                }
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
                .domain(<[number, number]>d3.extent(data, d => d.value))
                .range([
                    this.viewport.height - this.margin.top,
                    this.margin.bottom
                ]);
        } else if (typeof data === 'object') {
            let minmax: (number | undefined)[] = [];
            for (let key in data) {
                minmax.push(...d3.extent(data[key], d => d.value));
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
