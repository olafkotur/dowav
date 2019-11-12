import React, { useRef, useState, useEffect } from "react";
import { IViewport, IHistoryData, MultipleHistoryData } from "../../types";
import Graph from "./Graph";
import useFetch from "../../hooks/useFetch";
import Loader from "../styled/Loader";
import ErrorMessage from "../../errors/ErrorMessage";

type GraphViewProps = {
  currentOption: string;
};

const GraphView: React.FC<GraphViewProps> = ({ currentOption }) => {
  const [count, setCount] = useState<number>(0);
  const [size, setSize] = useState<IViewport | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const { loading, data, error } = useFetch({
    useCache: true,
    query: {
      endpoint: `/api/historic/${currentOption.toLowerCase()}`,
      params: {
        from: 1,
        to: Math.floor(Date.now() / 1000)
      }
    },
    refetch: count
  });

  const updateSize = () => {
    if (graphRef.current) {
      let viewport = graphRef.current.getBoundingClientRect();
      setSize({ width: viewport.width, height: viewport.height });
    }
  };

  useEffect(() => {
    if (graphRef.current) {
      updateSize();
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [graphRef.current]);
  return (
    <div ref={graphRef} className="graph-view">
      {size ? (
        <>
          {loading ? (
            <Loader size={size} currentOption={currentOption} />
          ) : error ? (
            <div className="error-message">
              <ErrorMessage
                error={error}
                onRefetch={() => {
                  setCount(count + 1);
                }}
              />
            </div>
          ) : (
            <>
              <div className="graph-view-row">
                <Graph
                  data={data[0]}
                  viewport={{
                    width: (size.width - 50) / 3,
                    height: (size.height - 100) / 2
                  }}
                  conf={{
                    name: currentOption,
                    id: currentOption + 1,
                    zone: 1
                  }}
                />
                <Graph
                  data={data[1]}
                  viewport={{
                    width: (size.width - 50) / 3,
                    height: (size.height - 100) / 2
                  }}
                  conf={{
                    name: currentOption,
                    id: currentOption + 2,
                    zone: 2
                  }}
                />
                <Graph
                  data={data[2]}
                  viewport={{
                    width: (size.width - 50) / 3,
                    height: (size.height - 100) / 2
                  }}
                  conf={{
                    name: currentOption,
                    id: currentOption + 3,
                    zone: 3
                  }}
                />
              </div>
              <div className="graph-view-row">
                <Graph
                  data={{
                    zoneA: data[0],
                    zoneB: data[1],
                    zoneC: data[2]
                  }}
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
              </div>
            </>
          )}
          {/* <div className="graph-view-row">
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
                        {[1, 2, 3].map((d: number) => (
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
                        ))}
                        {data ? (
                            <>
                                <Graph
                                    data={data[0]}
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
                                    data={data[1]}
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
                                    data={data[2]}
                                    viewport={{
                                        width: (size.width - 50) / 3,
                                        height: (size.height - 100) / 2
                                    }}
                                    conf={{
                                        name: currentOption,
                                        id: currentOption + 3
                                    }}
                                />
                            </>
                        ) : null}
                    </div>
                    <div className="graph-view-row">
                        {false ? (
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
                    </div> */}
        </>
      ) : null}
    </div>
  );
};

export default GraphView;
