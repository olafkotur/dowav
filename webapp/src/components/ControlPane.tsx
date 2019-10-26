import React from 'react';
import { GraphConfiguration, TimePeriod } from '../types';

type ControlPaneProps = {
    shouldRenderLive: boolean;
    live: boolean;
    setLive(): void;
    setTimePeriod: any;
    conf: GraphConfiguration & { timePeriod: TimePeriod[] };
};

const ControlPane: React.FC<ControlPaneProps> = ({
    live,
    setLive,
    setTimePeriod,
    shouldRenderLive,
    conf
}) => {
    return (
        <div className="control-pane">
            <div className={`${conf.name} time-button-group`}>
                {conf.timePeriod.map((t: TimePeriod) => {
                    return (
                        <div
                            key={t.timePeriod}
                            className={`time-button ${
                                t.selected ? 'selected' : ''
                            }`}
                            onClick={() => {
                                if (!t.selected)
                                    setTimePeriod(
                                        conf.timePeriod.map(
                                            (ti: TimePeriod) => {
                                                if (ti === t) {
                                                    return {
                                                        ...ti,
                                                        selected: !ti.selected
                                                    };
                                                } else {
                                                    return {
                                                        ...ti,
                                                        selected: false
                                                    };
                                                }
                                            }
                                        )
                                    );
                            }}
                        >
                            {`${t.timePeriod}m`}
                        </div>
                    );
                })}
            </div>
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
