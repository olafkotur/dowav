import React, { useEffect, useRef, useState } from 'react';
import { IViewport, HistoryData, GraphConfiguration } from '../../types';
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
    const [d3chart, setD3chart] = useState<D3Graph | null>(null);

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
                            conf
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

    return (
        <div
            ref={container}
            className={`graph ${conf.name} ${live ? 'live' : ''}`}
        >
            <ControlPane
                shouldRenderLive={control.shouldRenderLive}
                live={live}
                setLive={() => setLive(!live)}
                conf={conf}
            />
        </div>
    );
};

export default Graph;
