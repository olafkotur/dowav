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
import moment from 'moment';
import d3Colors from './d3Colors';

type D3GraphProps = {
    viewport: IViewport;
    svg: HTMLElement;
    data: HistoryData;
    conf: GraphConfiguration & { timePeriod: TimePeriod };
};

const colors = ['#ffa500', '#ff2929', '#7a7aed'];

export default class D3Graph {
    private svgHTML: any;
    private svg: any;
    private viewport: IViewport;
    private margin: IMargin;
    // TODO CHANGE ANY
    private data: HistoryData;
    private liveData: IHistoryData[];
    private xScale: any;
    private yScale: any;
    private conf: GraphConfiguration & { timePeriod: TimePeriod };
    private tooltip: any;
    private line: any;
    private xAxis: any;
    private yAxis: any;
    private clip: any;
    private dashedLines: any;
    public constructor(options: D3GraphProps) {
        this.svgHTML = options.svg;
        this.margin = { top: 40, bottom: 40, left: 40, right: 40 };
        this.viewport = {
            width:
                options.viewport.width - this.margin.left - this.margin.right,
            height:
                options.viewport.height - this.margin.top - this.margin.bottom
        };
        this.svg = d3
            .select(options.svg)
            .append('g')
            .attr(
                'transform',
                `translate(${this.margin.left}, ${this.margin.right})`
            );
        this.conf = options.conf;
        this.data = this.scaleData(options.data);
        this.liveData = [];
        this.getXScale(this.data);
        this.getYScale(this.data);
        this.tooltip = d3
            .select(this.svgHTML.parentNode as any)
            .append('div')
            .attr('class', 'tooltip');
        if (
            this.conf.name === MENU_OPTIONS.TEMPERATURE ||
            this.conf.name === MENU_OPTIONS.MOISTURE ||
            this.conf.name === MENU_OPTIONS.LIGHT
        ) {
            d3LineGradients.drawGradient(
                d3.select(options.svg),
                this.viewport,
                this.conf.name
            );
        }
        // Add html
        if (this.data instanceof Array) {
            this.line = this.svg.append('path').attr('class', 'line');
        } else if (typeof this.data === 'object') {
            let keys = Object.keys(this.data);
            this.line = [];
            for (let i = 0; i < keys.length; i++) {
                this.line.push(
                    this.svg
                        .append('path')
                        .attr('class', 'line')
                        .attr('stroke', colors[i])
                );
            }
        }

        this.clip = this.svg
            .append('g')
            .attr('class', 'clip')
            .append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', this.viewport.width)
            .attr('height', this.viewport.height);
        this.xAxis = d3
            .select(this.svgHTML)
            .append('g')
            .attr('class', 'x-axis');
        this.yAxis = d3
            .select(this.svgHTML)
            .append('g')
            .attr('class', 'y-axis')
            .attr(
                'transform',
                `translate(${this.margin.left}, ${this.margin.top})`
            );
        this.dashedLines = this.svg.append('g').classed('dashed-line-g', true);
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
        if (timePeriod.timePeriod === 5) {
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
            const length = Math.ceil(data.length / k);
            for (let i = 0; i < length - 1; i++) {
                let tempAvg = 0;
                let tempTime = 0;
                for (let j = 0; j < k; j++) {
                    const index = i * k + j;
                    tempAvg =
                        j === 0
                            ? data[index].value
                            : (tempAvg + data[index].value) / 2;
                    if (j === 0) tempTime = data[index].time;
                }
                newData.push({
                    time: tempTime,
                    value: tempAvg
                });
            }
            // for (let i = 0; i < data.length; i++) {
            //     if (i % k === k - 1 || i === data.length - 1) {
            //         tempAvg += data[i].value;

            //         const divider = i % k === k - 1 ? k : data.length % k;
            //         newData.push({
            //             time: tempTime,
            //             value: tempAvg / divider,
            //             min: 0,
            //             max: 0
            //         });

            //         tempAvg = 0;
            //         tempTime = 0;
            //     } else {
            //         tempAvg += data[i].value;
            //         if (i % k === 0) tempTime = data[i].time;
            //     }
            // }
            return [...newData];
        } else if (typeof data === 'object') {
            const newObj: any = {};
            for (let key in data) {
                const zoneData = data[key];
                let newData = [];
                const length = Math.ceil(zoneData.length / k);
                for (let i = 0; i < length - 1; i++) {
                    let tempAvg = 0;
                    let tempTime = 0;
                    for (let j = 0; j < k; j++) {
                        const index = i * k + j;
                        tempAvg =
                            j === 0
                                ? zoneData[index].value
                                : (tempAvg + zoneData[index].value) / 2;
                        if (j === 0) tempTime = zoneData[index].time;
                    }
                    newData.push({
                        time: tempTime,
                        value: tempAvg
                    });
                }
                newObj[key] = newData;
            }
            return newObj;
        }
        return data;
    }

    public setViewport(viewport: IViewport) {
        d3.select(this.svgHTML)
            .attr('width', viewport.width)
            .attr('height', viewport.height);
        this.viewport = {
            width: viewport.width - this.margin.left - this.margin.right,
            height: viewport.height - this.margin.top - this.margin.bottom
        };
        this.resize();
    }

    public setData(data: HistoryData) {
        this.data = data;
        this.resize();
    }

    // Graphs with one source only could be live
    // Add if statements if that have been changed.
    public goLive(): void {
        this.dashedLines.html('');
        this.xAxis.html('');
        this.yAxis.html('');
        this.line.remove();
        this.line = this.svg
            .append('path')
            .attr('clip-path', 'url(#clip)')
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
        this.liveData = [];
        d3.select(this.svgHTML).on('mousemove', null);
        d3.select(this.svgHTML).on('mouseleave', null);
    }

    public addLiveData(data: IHistoryData) {
        this.liveData.push(data);
        this.plotLive();
    }

    private plotLive() {
        function getTranslate(this: D3Graph): number {
            if (this.liveData.length >= 30) {
                let n =
                    this.xScale(this.liveData[0].time) -
                    this.xScale(this.liveData[1].time);
                return n;
            } else {
                return 0;
            }
        }
        // y axis
        if (this.liveData.length > 2) {
            this.getYScale(this.liveData.slice(1, this.liveData.length - 1));
            const axisLeft = d3
                .axisLeft(this.yScale)
                .ticks(Math.floor(this.viewport.height / 20));
            this.yAxis
                .transition()
                .duration(400)
                .call(axisLeft);
            // x-axis
            this.getXScale(this.liveData);
            const axisBottom = d3
                .axisBottom(this.xScale)
                .ticks(Math.floor(this.viewport.height / 40));
            this.xAxis
                .transition()
                .duration(400)
                .call(axisBottom);

            let line = d3
                .line()
                .x((d: any) => this.xScale(new Date(d.time)))
                .y((d: any) => this.yScale(d.value))
                .curve(d3.curveMonotoneX);

            this.line
                .datum(this.liveData.slice(1))
                .attr('d', line)
                .style('transform', null)
                .transition()
                .duration(300)
                .attr(
                    'stroke',
                    this.conf.name === MENU_OPTIONS.TEMPERATURE ||
                        this.conf.name === MENU_OPTIONS.MOISTURE ||
                        this.conf.name === MENU_OPTIONS.LIGHT
                        ? 'url(#linegradient)'
                        : colors[0]
                    // d3Colors[this.conf.name][1]
                )
                .style(
                    'transform',
                    `translate(${getTranslate.bind(this)()}px, 0)`
                );
            if (this.liveData.length >= 30) {
                this.liveData.shift();
            }
        }
    }

    public goHistory(): void {
        this.getXScale(this.data);
        this.getYScale(this.data);
        this.line.remove();
        this.line = this.svg
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
        let dot = this.svg.select('circle');
        if (
            offsetX > this.margin.left &&
            offsetX < this.viewport.width + this.margin.left &&
            offsetY > this.margin.top &&
            offsetY < this.viewport.height + this.margin.top
        ) {
            let x = this.xScale.invert(offsetX - this.margin.left);
            if (this.data instanceof Array) {
                let index = this.data.findIndex(d => d.time > x);
                let sX = this.xScale(this.data[index].time);
                if (dot.empty()) {
                    this.svg
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
                                    this.margin.top -
                                    3
                            ) + 'px'
                        )
                        .style(
                            'left',
                            Math.floor(sX + this.margin.left + 5) + 'px'
                        )
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
        // Events
        if (this.data instanceof Array && this.data.length > 1) {
            d3.select(this.svgHTML).on('mousemove', () => this.showTip());
            d3.select(this.svgHTML).on('mouseleave', () => {
                this.svg.select('circle').remove();
                this.tooltip.classed('show', false);
            });
        }
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
        const bottomAxis = d3
            .axisBottom(this.xScale)
            .ticks(Math.floor(this.viewport.width / 60));
        this.xAxis
            .attr(
                'transform',
                `translate(${this.margin.left}, ${this.viewport.height +
                    this.margin.top})`
            )
            .call(bottomAxis);
        // y axis
        const axisLeft = d3
            .axisLeft(this.yScale)
            .ticks(Math.floor(this.viewport.height / 20));
        this.yAxis.call(axisLeft);
        this.dashedLines.html('');
        (axisLeft.scale() as any)
            .ticks(Math.floor(this.viewport.height / 20))
            .forEach((d: number[]) => {
                this.dashedLines
                    .append('line')
                    .classed('dashed-line', true)
                    .attr('x1', 0)
                    .attr('y1', this.yScale(d))
                    .attr('x2', this.viewport.width)
                    .attr('y2', this.yScale(d));
            });
        if (this.data instanceof Array) {
            //path
            this.line
                .datum(this.data)
                .attr('d', line as any)
                .attr(
                    'stroke',
                    // this.conf.name === MENU_OPTIONS.TEMPERATURE ||
                    //     this.conf.name === MENU_OPTIONS.MOISTURE ||
                    //     this.conf.name === MENU_OPTIONS.LIGHT
                    //     ? 'url(#linegradient)'
                    //     : colors[0]
                    d3Colors[this.conf.name][1]
                );
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
                this.svg
                    .attr('opacity', 0)
                    .transition(t as any)
                    .attr('opacity', 1);
            }
            // circles
            this.svg.selectAll('.dot');
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
                    this.svg
                        .attr('opacity', 0)
                        .transition(<any>t)
                        .attr('opacity', 1);
                }
                // circles
                this.svg.selectAll('.dot');
                i++;
            }
        }
    }

    public clean() {
        delete this.svg;
        delete this.svgHTML;
        delete this.viewport;
        delete this.margin;
        delete this.data;
        delete this.liveData;
        delete this.yScale;
        delete this.xScale;
        delete this.conf;
        delete this.tooltip;
        delete this.line;
        delete this.xAxis;
        delete this.yAxis;
        delete this.clip;
        delete this.dashedLines;
    }

    public resize() {
        this.getXScale(this.data);
        this.getYScale(this.data);
        if (
            this.conf.name === MENU_OPTIONS.TEMPERATURE ||
            this.conf.name === MENU_OPTIONS.MOISTURE ||
            this.conf.name === MENU_OPTIONS.LIGHT
        ) {
            d3LineGradients.drawGradient(
                this.svg,
                this.viewport,
                this.conf.name
            );
        }
        this.clip
            .attr('width', this.viewport.width)
            .attr('height', this.viewport.height);
        if (this.liveData.length !== 0) {
            this.plotLive();
        } else {
            this.plot();
        }
    }

    private getXScale(data: HistoryData) {
        if (data instanceof Array) {
            this.xScale = d3
                .scaleTime()
                .domain([
                    new Date(data[0].time),
                    new Date(data[data.length - 1].time)
                ])
                .range([0, this.viewport.width]);
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
                .range([0, this.viewport.width]);
        }
    }

    private getYScale(data: HistoryData) {
        if (data instanceof Array) {
            this.yScale = d3
                .scaleLinear()
                .domain(<[number, number]>d3.extent(data, d => d.value))
                .range([this.viewport.height, 0]);
        } else if (typeof data === 'object') {
            let minmax: (number | undefined)[] = [];
            for (let key in data) {
                minmax.push(...d3.extent(data[key], d => d.value));
            }
            this.yScale = d3
                .scaleLinear()
                .domain(d3.extent(minmax as any) as any)
                .range([this.viewport.height, 0]);
        }
    }
}
