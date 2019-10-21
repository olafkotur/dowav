import React, { useEffect, useRef, useState } from 'react';
import { IViewport, HistoryData } from '../../types';
import * as d3 from 'd3';
import ControlPane from '../ControlPane';
import D3Graph from '../../d3/d3Graph';

type GraphView = {
    viewport: IViewport;
    name: string;
    data: HistoryData;
    control?: {
        shouldRenderLive: boolean;
    };
};

const Graph: React.FC<GraphView> = ({
    viewport,
    name,
    data,
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
            let el = document.getElementById(name);
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
                    .attr('id', name)
                    .attr('width', viewport.width)
                    .attr('height', viewport.height);
                const svg = document.getElementById(name);
                svg && setD3chart(new D3Graph({ svg, viewport, data }));
            }
        }
    }, [container.current]);

    useEffect(() => {
        if (container.current) {
            const svg = document.getElementById(name);
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
        <div ref={container} className={`graph ${live ? 'live' : ''}`}>
            <ControlPane
                shouldRenderLive={control.shouldRenderLive}
                live={live}
                setLive={() => setLive(!live)}
            />
        </div>
    );
};

export default Graph;
