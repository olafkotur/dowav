import React from 'react';
import { shallow } from 'enzyme';
import ControlPane from './ControlPane';

describe('<ControlPane />', () => {
    it('Renders without crash', () => {
        const wrapper = shallow(
            <ControlPane
                shouldRenderLive
                live={false}
                setLive={() => {}}
                setTimePeriod={() => {}}
                conf={{ name: 'Graph', id: '1', timePeriod: [] }}
            />
        );
        expect(wrapper.find('button').length).toEqual(1);
        expect(wrapper.find('.time-button-group').children().length).toEqual(0);
    });
    it('Renders correct amount of time period buttons', () => {
        const wrapper = shallow(
            <ControlPane
                shouldRenderLive
                live={false}
                setLive={() => {}}
                setTimePeriod={() => {}}
                conf={{
                    name: 'Graph',
                    id: '1',
                    timePeriod: [
                        { timePeriod: 30, selected: true },
                        { timePeriod: 45, selected: false }
                    ]
                }}
            />
        );
        expect(wrapper.find('.time-button-group').children().length).toEqual(2);
        expect(wrapper.find('.selected').length).toEqual(1);
        expect(wrapper.find('.selected').text()).toEqual('30m');
    });
    it('Triggers passed function on click', () => {
        const MockFn = jest.fn();
        const wrapper = shallow(
            <ControlPane
                shouldRenderLive
                live={false}
                setLive={MockFn}
                setTimePeriod={MockFn}
                conf={{
                    name: 'Graph',
                    id: '1',
                    timePeriod: [
                        { timePeriod: 30, selected: true },
                        { timePeriod: 45, selected: false }
                    ]
                }}
            />
        );
        wrapper.find('.time-button').forEach(item => {
            if (!item.hasClass('selected')) item.simulate('click');
        });
        expect(MockFn).toBeCalledTimes(1);
        wrapper.find('button').simulate('click');
        expect(MockFn).toBeCalledTimes(2);
    });
});
