import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';
import LightScreen from '../screens/LightScreen';

it('renders temperature screen correctly', () => {
  const component = renderer.create(<LightScreen />).toJSON();
  expect(component).toMatchSnapshot();
});
