import React, { useRef, useState, useLayoutEffect } from 'react';
import { IViewport } from '../../types';
import Graph from './Graph';
import data from '../../data/mockdata';

type GraphViewProps = {
    currentOption: string;
};

const GraphView: React.FC<GraphViewProps> = ({ currentOption }) => {
    const [size, setSize] = useState<IViewport | null>(null);
    const graphRef = useRef<HTMLDivElement>(null);
    const updateSize = () => {
        if (graphRef.current) {
            let viewport = graphRef.current.getBoundingClientRect();
            setSize({ width: viewport.width, height: viewport.height });
        }
    };

    useLayoutEffect(() => {
        if (graphRef.current) {
            updateSize();
        }
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [graphRef.current]);

    return (
        <div ref={graphRef} className="graph-view">
            {size ? (
                <>
                    <div className="graph-view-row">
                        <Graph
                            data={data}
                            viewport={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 100) / 2
                            }}
                            name="first"
                        />
                        <Graph
                            data={data.slice(30)}
                            viewport={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 100) / 2
                            }}
                            name="second"
                        />
                        <Graph
                            data={data.slice(20, 40)}
                            viewport={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 100) / 2
                            }}
                            name="third"
                        />
                    </div>
                    <div className="graph-view-row">
                        <Graph
                            data={{
                                zoneA: data,
                                zoneB: data.slice(30).map(d => ({
                                    ...d,
                                    avg: d.avg + Math.random() * 5 - 3
                                })),
                                zoneC: data.slice(20, 40).map(d => ({
                                    ...d,
                                    avg: d.avg + Math.random() * 5 - 6
                                }))
                            }}
                            control={{ shouldRenderLive: false }}
                            viewport={{
                                width: size.width - 10,
                                height: (size.height - 100) / 2
                            }}
                            name="fourth"
                        />
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default GraphView;
