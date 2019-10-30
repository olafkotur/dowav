import React from 'react';
import { StatusBar, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TempScreen from './screens/TempScreen';
import MoistureScreen from './screens/MoistureScreen';
import LightScreen from './screens/LightScreen';
import MovScreen from './screens/MovScreen';

const RootStack = createBottomTabNavigator({
  Temperature: TempScreen,
  Moisture: MoistureScreen,
  Light: LightScreen,
  Movement: MovScreen,
}, {
  initialRouteName: 'Temperature',
  tabBarOptions: {
    activeBackgroundColor: 'orange',
    activeTintColor: 'black',
    inactiveBackgroundColor: '#2c5364',
    inactiveTintColor: 'white',
  }
});

const AppContainer = createAppContainer(RootStack);

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#1f404f" />
      <AppContainer />
    </View>
  );
};

export default App;
