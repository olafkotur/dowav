import React from 'react';
import { DASHBOARD } from '../constants/MenuOptionConstants';

type NavigationContext = {
    currentOption: string;
    setCurrentOption(option: string): void;
};

export default React.createContext<NavigationContext>({
    currentOption: DASHBOARD,
    setCurrentOption: n => {
        throw new Error('setCurrentOption() not implemented.');
    }
});
