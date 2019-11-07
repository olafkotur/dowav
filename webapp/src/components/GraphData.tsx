import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import Graph from './views/Graph';
import Loader from './styled/Loader';
import { IViewport } from '../types';
import ErrorMessage from '../errors/ErrorMessage';

type GraphDataProps = {
    setGraphsData: Function;
    currentOption: string;
    zone: number;
    size: IViewport;
};

const GraphData: React.FC<GraphDataProps> = ({
    currentOption,
    zone,
    size,
    setGraphsData
}) => {
    const [count, setCount] = useState(0);
    const { loading, data, error } = useFetch({
        useCache: true,
        query: {
            endpoint: `/api/historic/${currentOption.toLowerCase()}`,
            params: {
                zone,
                from: 1,
                to: Math.floor(Date.now() / 1000)
            }
        },
        refetch: count
    });

    useEffect(() => {
        if (data) {
            setGraphsData((prev: any) => ({
                ...prev,
                [`zone${zone}`]: data
            }));
        }
    }, [data]);

    return (
        <>
            {loading ? (
                <Loader
                    size={{ ...size, height: size.height + 50 }}
                    currentOption={currentOption}
                />
            ) : error ? (
                <ErrorMessage
                    size={{ ...size, height: size.height + 50 }}
                    error={error}
                    onRefetch={() => setCount(count + 1)}
                />
            ) : (
                <Graph
                    data={data}
                    viewport={size}
                    //TODO think about id
                    conf={{ name: currentOption, id: currentOption + zone }}
                />
            )}
        </>
    );
};

export default GraphData;
