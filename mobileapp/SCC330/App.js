import React from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TempScreen from './screens/TempScreen';

const MoistureScreen = () => {
  return (
    <Text>Moisture</Text>
  );
}
const LightScreen = () => {
  return (
    <Text>Light</Text>
  );
}
const MovScreen = () => {
  return (
    <Text>Movement</Text>
  );
}

const RootStack = createBottomTabNavigator({
  Temperature: TempScreen,
  Moisture: MoistureScreen,
  Light: LightScreen,
  Movement: MovScreen,
}, {
  initialRouteName: 'Temperature',
});

const AppContainer = createAppContainer(RootStack);

const App = () => {
  return (
    <AppContainer />
  );
};

export default App;
