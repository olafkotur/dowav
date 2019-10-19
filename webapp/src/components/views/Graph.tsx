import React, { useEffect, useRef } from 'react';
import { IViewport } from '../../types';
import * as d3 from 'd3';

type GraphView = {
    viewport: IViewport;
    name: string;
};

const Graph: React.FC<GraphView> = ({ viewport, name }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return () => {
            let el = document.getElementById(name);
            if (el) {
                container.current!.removeChild(el);
            }
        };
    }, []);

    useEffect(() => {
        if (container.current) {
            let el = container.current;
            if (el.childNodes.length === 0) {
                d3.select(el)
                    .append('svg')
                    .attr('id', name)
                    .attr('width', viewport.width)
                    .attr('height', viewport.height);
            }
        }
    }, [container.current]);

    return <div ref={container} className="graph"></div>;
};

export default Graph;
