import React from 'react';
import { shallow } from 'enzyme';
import Loader from './Loader';
import * as MENU_OPTIONS from '../../constants/MenuOptionConstants';
import d3Colors from '../../d3/d3Colors';

describe('<Loader />', () => {
    it('Renders loader with temperature color', () => {
        const wrapper = shallow(
            <Loader
                size={{ width: 400, height: 400 }}
                currentOption={MENU_OPTIONS.TEMPERATURE}
            />
        );
        expect(wrapper.find('.loader').length).toEqual(1);
        expect(
            wrapper.find('svg').filterWhere(item => {
                return (
                    item.prop('stroke') ===
                    d3Colors[MENU_OPTIONS.TEMPERATURE][1]
                );
            }).length
        ).toEqual(1);
    });
    it('Loader has specified width and height', () => {
        const wrapper = shallow(
            <Loader
                size={{ width: 1000, height: 200 }}
                currentOption={MENU_OPTIONS.TEMPERATURE}
            />
        );
        expect(
            wrapper.find('svg').filterWhere(item => {
                return (
                    item.prop('height') === 200 && item.prop('width') === 1000
                );
            }).length
        ).toEqual(1);
    });
});
