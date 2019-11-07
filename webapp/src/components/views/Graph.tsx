import React, { useEffect, useRef, useState } from 'react';
import {
    IViewport,
    HistoryData,
    IHistoryData,
    GraphConfiguration,
    TimePeriod
} from '../../types';
import * as d3 from 'd3';
import ControlPane from '../ControlPane';
import D3Graph from '../../d3/d3Graph';

type GraphProps = {
    viewport: IViewport;
    data: HistoryData;
    conf: GraphConfiguration;
    control?: {
        shouldRenderLive: boolean;
    };
};

const Graph: React.FC<GraphProps> = ({
    viewport,
    data,
    conf,
    control = { shouldRenderLive: true }
}) => {
    const container = useRef<HTMLDivElement>(null);
    const [live, setLive] = useState<boolean>(false);
    const [timePeriod, setTimePeriod] = useState<TimePeriod[]>([
        { timePeriod: 5, selected: true },
        { timePeriod: 15, selected: false },
        { timePeriod: 30, selected: false }
    ]);
    const [d3chart, setD3chart] = useState<D3Graph | null>(null);

    useEffect(() => {
        if (data && d3chart) {
            d3chart.setData(data);
        }
    }, [data]);

    useEffect(() => {
        if (d3chart) {
            d3chart.setConf(
                {
                    ...conf,
                    timePeriod: timePeriod.filter(
                        (t: TimePeriod) => t.selected
                    )[0]
                },
                data
            );
        }
    }, [timePeriod]);

    useEffect(() => {
        if (d3chart) {
            d3chart.plot('start');
        }
    }, [d3chart]);

    useEffect(() => {
        return () => {
            let el = document.getElementById(conf.id);
            if (el && container.current) {
                container.current.removeChild(el);
            }
        };
    }, []);
    useEffect(() => {
        if (container.current) {
            let el = container.current;
            if (el.childNodes.length === 1) {
                d3.select(el)
                    .append('svg')
                    .attr('id', conf.id)
                    .attr('width', viewport.width)
                    .attr('height', viewport.height);
                const svg = document.getElementById(conf.id);
                svg &&
                    setD3chart(
                        new D3Graph({
                            svg,
                            viewport,
                            data,
                            conf: {
                                ...conf,
                                timePeriod: timePeriod.filter(
                                    (t: TimePeriod) => t.selected
                                )[0]
                            }
                        })
                    );
            }
        }
    }, [container.current]);

    useEffect(() => {
        if (container.current) {
            const svg = document.getElementById(conf.id);
            if (svg) {
                const rect = svg.getBoundingClientRect();
                if (
                    rect.height !== viewport.height ||
                    rect.width !== viewport.width
                ) {
                    if (d3chart) {
                        d3chart.setViewport(viewport);
                    }
                }
            }
        }
    }, [viewport]);

    useEffect(() => {
        if (d3chart) {
            if (live) {
                const socket = new WebSocket('ws://localhost:8080');
                socket.addEventListener('open', function(event) {
                    console.log('Successfull connection');
                });

                socket.addEventListener('error', function(event) {
                    console.log(event);
                });

                socket.addEventListener('message', function(event) {
                    console.log(event);
                });

                socket.addEventListener('close', function(event) {
                    console.log('Closed');
                });

                d3chart.goLive();
                const id = setInterval(() => {
                    d3chart.addLiveData({
                        value: Math.random() * 5 + 17,
                        time: Date.now()
                    });
                }, 1000);
                return () => {
                    console.log('CLOSING');
                    socket.close();
                    clearInterval(id);
                };
            }
        }
    }, [d3chart, live]);

    return (
        <div className={`graph ${conf.name} ${live ? 'live' : ''}`}>
            <div ref={container}>
                <ControlPane
                    shouldRenderLive={control.shouldRenderLive}
                    live={live}
                    setLive={() => {
                        if (live && d3chart) {
                            d3chart.goHistory();
                        }
                        setLive(!live);
                    }}
                    setTimePeriod={setTimePeriod}
                    conf={{ ...conf, timePeriod: timePeriod }}
                />
            </div>
        </div>
    );
};

export default Graph;
