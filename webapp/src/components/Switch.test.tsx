import React from 'react';
import { shallow, mount } from 'enzyme';
import Switch from './Switch';
import * as MENU_OPTIONS from '../constants/MenuOptionConstants';
import NavigationContext from '../context/NavigationContext';
import DashboardView from './views/DashboardView';
import GraphView from './views/GraphView';

describe('<Switch />', () => {
    it('Renders with no errors', () => {
        const wrapper = shallow(<Switch />);
        expect(wrapper.find('.switch').length).toEqual(1);
    });
    it('Renders DashboardView when it is selected', () => {
        const wrapper = mount(
            <NavigationContext.Provider
                value={{
                    currentOption: MENU_OPTIONS.DASHBOARD,
                    setCurrentOption: () => {}
                }}
            >
                <Switch />
            </NavigationContext.Provider>
        );
        expect(wrapper.contains(<DashboardView />)).toEqual(true);
    });
    it('Renders GraphView when Temperature is selected', () => {
        const wrapper = mount(
            <NavigationContext.Provider
                value={{
                    currentOption: MENU_OPTIONS.TEMPERATURE,
                    setCurrentOption: () => {}
                }}
            >
                <Switch />
            </NavigationContext.Provider>
        );
        console.log(wrapper.find('.switch').debug());
        expect(
            wrapper.contains(
                <GraphView currentOption={MENU_OPTIONS.TEMPERATURE} />
            )
        ).toEqual(true);
    });
    it('Renders not implemented message by default', () => {
        const wrapper = mount(
            <NavigationContext.Provider
                value={{
                    currentOption: 'foo',
                    setCurrentOption: () => {}
                }}
            >
                <Switch />
            </NavigationContext.Provider>
        );
        expect(wrapper.find('.not-implemented').length).toEqual(1);
    });
});
