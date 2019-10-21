import React, { useState } from 'react';
import './main.scss';
import Dashboard from './components/Dashboard';
import NavigationContext from './context/NavigationContext';
import { DASHBOARD } from './constants/MenuOptionConstants';

const App: React.FC = () => {
    const [navigation, setNavigation] = useState(DASHBOARD);

    return (
        <NavigationContext.Provider
            value={{
                currentOption: navigation,
                setCurrentOption: s => {
                    setNavigation(s);
                }
            }}
        >
            <Dashboard />
        </NavigationContext.Provider>
    );
};

export default App;
