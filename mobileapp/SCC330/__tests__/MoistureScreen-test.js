import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';
import MoistureScreen from '../screens/MoistureScreen';

it('renders temperature screen correctly', () => {
  const component = renderer.create(<MoistureScreen />).toJSON();
  expect(component).toMatchSnapshot();
});
