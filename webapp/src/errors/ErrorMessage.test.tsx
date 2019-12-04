import React from 'react';
import ErrorMessages from './ErrorMessage';
import { shallow } from 'enzyme';

describe('<ErrorMessages />', () => {
    it('Renders showing specified error', () => {
        const wrapper = shallow(
            <ErrorMessages
                error={{ title: 'BIG error', message: 'GO and PANIC' }}
            />
        );
        expect(wrapper.find('h1').text()).toEqual('BIG error');
        expect(wrapper.find('p').text()).toEqual('GO and PANIC');
    });
    it('Reders reftech icon if refetch action was passed', () => {
        const wrapper = shallow(
            <ErrorMessages
                error={{
                    title: 'BIG error',
                    message: 'GO and PANIC',
                    actions: ['refetch']
                }}
            />
        );
        expect(wrapper.find('.refetch-icon').length).toEqual(1);
    });
    it('Calls passed function if icon is clicked', () => {
        const mockFn = jest.fn();
        const wrapper = shallow(
            <ErrorMessages
                error={{
                    title: 'BIG error',
                    message: 'GO and PANIC',
                    actions: ['refetch']
                }}
                onRefetch={mockFn}
            />
        );
        wrapper.find('.refetch-icon').simulate('click');
        expect(mockFn).toBeCalledTimes(1);
    });
});
