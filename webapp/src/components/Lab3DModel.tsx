import React, { useRef, useState, useEffect } from 'react';
import { IViewport } from '../types';
import Lab3D from '../three/Lab3D';

type Lab3DModelProps = {
    viewport: IViewport;
};

const Lab3DModel: React.FC<Lab3DModelProps> = ({ viewport }) => {
    const container = useRef<HTMLDivElement>(null);
    const [lab3d, setLab3d] = useState<Lab3D | null>(null);

    useEffect(() => {
        if (container.current && !lab3d) {
            console.log('Creating new lab');
            setLab3d(new Lab3D({ viewport, container: container.current }));
        }
    }, [container.current]);

    return (
        <div
            ref={container}
            style={{
                width: viewport.width,
                height: viewport.height,
                outline: 'none'
            }}
        ></div>
    );
};

export default Lab3DModel;
