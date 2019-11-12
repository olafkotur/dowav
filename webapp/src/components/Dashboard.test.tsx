import React from 'react';
import { shallow } from 'enzyme';
import Dashboard from './Dashboard';
import Menu from './Menu';
import Switch from './Switch';

describe('<Dashboard/>', () => {
    it('Renders without crash', () => {
        const dashboard = shallow(<Dashboard />);
        expect(dashboard.find('div').children().length).toEqual(2);
        expect(dashboard.contains(<Menu />)).toEqual(true);
        expect(dashboard.contains(<Switch />)).toEqual(true);
    });
});
