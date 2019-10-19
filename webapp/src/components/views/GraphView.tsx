import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { IViewport } from '../../types';
import Graph from './Graph';

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
                            viewport={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 10) / 2
                            }}
                            name="first"
                        />
                        <Graph
                            viewport={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 10) / 2
                            }}
                            name="second"
                        />
                        <Graph
                            viewport={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 10) / 2
                            }}
                            name="third"
                        />
                    </div>
                    <div className="graph-view-row">
                        <Graph
                            viewport={{
                                width: size.width,
                                height: (size.height - 10) / 2
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
