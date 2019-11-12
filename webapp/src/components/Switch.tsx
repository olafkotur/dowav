import React, { useContext } from 'react';
import NavigationContext from '../context/NavigationContext';
import * as MENU_OPTIONS from '../constants/MenuOptionConstants';
import DashboardView from './views/DashboardView';
import GraphView from './views/GraphView';

const Switch: React.FC = () => {
    const { currentOption } = useContext(NavigationContext);

    let component = null;
    switch (currentOption) {
        case MENU_OPTIONS.DASHBOARD:
            component = <DashboardView />;
            break;
        case MENU_OPTIONS.TEMPERATURE:
        case MENU_OPTIONS.MOISTURE:
        case MENU_OPTIONS.LIGHT:
            component = (
                <GraphView key={currentOption} currentOption={currentOption} />
            );
            break;
        default:
            component = (
                <div className="not-implemented">
                    <h1>404</h1>
                    <p>Not implemented yet. Coming soon. </p>
                </div>
            );
    }

    return <div className="switch">{component}</div>;
};

export default Switch;
