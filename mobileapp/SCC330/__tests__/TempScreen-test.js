import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';
import TempScreen from '../screens/TempScreen';

it('renders temperature screen correctly', () => {
  const tempScreen = renderer.create(<TempScreen />).toJSON();
  expect(tempScreen).toMatchSnapshot();
});
