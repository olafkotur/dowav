import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';
import MovScreen from '../screens/MovScreen';

it('renders temperature screen correctly', () => {
  const component = renderer.create(<MovScreen />).toJSON();
  expect(component).toMatchSnapshot();
});
