import React from 'react';
import Menu, { menuOptions } from './Menu';
import { mount, shallow } from 'enzyme';
import NavigationContext from '../context/NavigationContext';
import * as MENU_OPTIONS from '../constants/MenuOptionConstants';

describe('<Menu />', () => {
    it('Renders without crash and with right amount of menu options', () => {
        const menu = shallow(<Menu />);
        expect(menu.find('.menu').length).toEqual(1);
        expect(menu.find('.item').length).toEqual(menuOptions.length);
    });
    it('Highlights menu option correctly', () => {
        const mockFun = jest.fn();
        const menu = mount(
            <NavigationContext.Provider
                value={{
                    currentOption: MENU_OPTIONS.DASHBOARD,
                    setCurrentOption: mockFun
                }}
            >
                <Menu />
            </NavigationContext.Provider>
        );

        expect(menu.find('.selected').length).toEqual(1);
        expect(menu.find('.selected .text').text()).toEqual(
            MENU_OPTIONS.DASHBOARD
        );
        menu.find('.item').forEach(node => {
            node.simulate('click');
        });
        expect(mockFun).toBeCalledTimes(menuOptions.length - 1);
    });
});
