import React from 'react';
import { StatusBar, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon, IconProps } from 'react-native-elements';

import TempScreen from './screens/TempScreen';
import MoistureScreen from './screens/MoistureScreen';
import LightScreen from './screens/LightScreen';
import MovScreen from './screens/MovScreen';

interface ScreenIcons<T> {
  [key: string]: T
}

const tabIcons: ScreenIcons<IconProps> = {
  Temperature: {
    name: 'thermometer',
    type: 'feather',
  },
  Moisture: {
    name: 'ios-water',
    type: 'ionicon',
  },
  Light: {
    name: 'light-bulb',
    type: 'octicon',
  },
  Movement: {
    name: 'location-searching',
    type: 'material',
  },
}

const RootStack = createBottomTabNavigator({
  Temperature: TempScreen,
  Moisture: MoistureScreen,
  Light: LightScreen,
  Movement: MovScreen,
}, {
  initialRouteName: 'Temperature',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon
        {...tabIcons[navigation.state.routeName]}
        color={tintColor}
      />
    ),
  }),
  tabBarOptions: {
    activeBackgroundColor: 'orange',
    activeTintColor: 'black',
    inactiveBackgroundColor: '#2c5364',
    inactiveTintColor: 'white',
  },
});

const AppContainer = createAppContainer(RootStack);

const App: React.FunctionComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#1f404f" />
      <AppContainer />
    </View>
  );
};

export default App;