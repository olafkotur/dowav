import React from 'react';

type ControlPaneProps = {
    shouldRenderLive: boolean;
    live: boolean;
    setLive(): void;
};

const ControlPane: React.FC<ControlPaneProps> = ({
    live,
    setLive,
    shouldRenderLive
}) => {
    return (
        <div className="control-pane">
            {shouldRenderLive ? (
                <button className={`${live ? 'live' : ''}`} onClick={setLive}>
                    Live
                </button>
            ) : null}
        </div>
    );
};

export default ControlPane;
