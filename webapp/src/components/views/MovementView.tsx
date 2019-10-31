import React, { useRef, useState, useLayoutEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import { IViewport } from '../../types';
import HistoryList from '../HistoryList';
import Lab3DModel from '../Lab3DModel';

const MovementView: React.FC = () => {
    const [count, setCount] = useState(0);
    const [size, setSize] = useState<IViewport | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const { loading, data, error } = useFetch({
        useCache: true,
        refetch: count
    });
    const updateSize = () => {
        if (ref.current) {
            let viewport = ref.current.getBoundingClientRect();
            setSize({ width: viewport.width, height: viewport.height });
        }
    };

    useLayoutEffect(() => {
        if (ref.current) {
            updateSize();
        }
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [ref.current]);

    return (
        <div ref={ref} className="movement-view">
            {size ? (
                <>
                    <Lab3DModel
                        viewport={{ ...size, width: size.width - 200 }}
                    />
                    <HistoryList />
                </>
            ) : null}
        </div>
    );
};

export default MovementView;
