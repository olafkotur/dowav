import React, { useRef, useState, useLayoutEffect } from 'react';
import { IViewport, IHistoryData, MultipleHistoryData } from '../../types';
import Graph from './Graph';
import GraphData from '../GraphData';

type GraphViewProps = {
    currentOption: string;
};

const GraphView: React.FC<GraphViewProps> = ({ currentOption }) => {
    const [size, setSize] = useState<IViewport | null>(null);
    const graphRef = useRef<HTMLDivElement>(null);
    const [graphsData, setGraphsData] = useState<MultipleHistoryData>({
        zone1: [],
        zone2: [],
        zone3: []
    });

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
    const keys = Object.keys(graphsData);
    let drawMultipleData = false;
    keys.forEach(key => {
        if (graphsData[key].length > 0) drawMultipleData = true;
    });
    return (
        <div ref={graphRef} className="graph-view">
            {size ? (
                <>
                    <div className="graph-view-row">
                        <GraphData
                            setGraphsData={setGraphsData}
                            currentOption={currentOption}
                            zone={1}
                            size={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 100) / 2
                            }}
                        />
                        <GraphData
                            setGraphsData={setGraphsData}
                            currentOption={currentOption}
                            zone={2}
                            size={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 100) / 2
                            }}
                        />
                        <GraphData
                            setGraphsData={setGraphsData}
                            currentOption={currentOption}
                            zone={3}
                            size={{
                                width: (size.width - 50) / 3,
                                height: (size.height - 100) / 2
                            }}
                        />
                        {/* {[1, 2, 3].map((d: number) => (
                            <GraphData
                                key={d}
                                setGraphsData={setGraphsData}
                                currentOption={currentOption}
                                zone={d}
                                size={{
                                    width: (size.width - 50) / 3,
                                    height: (size.height - 100) / 2
                                }}
                            />
                        ))} */}
                        {/* <Graph
                                    data={data}
                                    viewport={{
                                        width: (size.width - 50) / 3,
                                        height: (size.height - 100) / 2
                                    }}
                                    conf={{
                                        name: currentOption,
                                        id: currentOption + 1
                                    }}
                                />
                                <Graph
                                    data={data.slice(30)}
                                    viewport={{
                                        width: (size.width - 50) / 3,
                                        height: (size.height - 100) / 2
                                    }}
                                    conf={{
                                        name: currentOption,
                                        id: currentOption + 2
                                    }}
                                />
                                <Graph
                                    data={data.slice(20, 40)}
                                    viewport={{
                                        width: (size.width - 50) / 3,
                                        height: (size.height - 100) / 2
                                    }}
                                    conf={{
                                        name: currentOption,
                                        id: currentOption + 3
                                    }}
                                /> */}
                    </div>
                    <div className="graph-view-row">
                        {drawMultipleData ? (
                            <Graph
                                data={graphsData}
                                control={{ shouldRenderLive: false }}
                                viewport={{
                                    width: size.width - 10,
                                    height: (size.height - 100) / 2
                                }}
                                conf={{
                                    name: currentOption,
                                    id: currentOption + 4
                                }}
                            />
                        ) : null}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default GraphView;
