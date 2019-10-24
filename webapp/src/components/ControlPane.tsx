import React from 'react';
import { GraphConfiguration } from '../types';

type ControlPaneProps = {
    shouldRenderLive: boolean;
    live: boolean;
    setLive(): void;
    conf: GraphConfiguration;
};

const ControlPane: React.FC<ControlPaneProps> = ({
    live,
    setLive,
    shouldRenderLive,
    conf
}) => {
    return (
        <div className="control-pane">
            {shouldRenderLive ? (
                <button
                    className={`${conf.name} ${live ? 'live' : ''}`}
                    onClick={setLive}
                >
                    Live
                </button>
            ) : null}
        </div>
    );
};

export default ControlPane;
