import React from 'react';
import { StatusBar, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon, IconProps } from 'react-native-elements';
import { Provider } from 'react-redux';

import TempScreen from './screens/TempScreen';
import MoistureScreen from './screens/MoistureScreen';
import LightScreen from './screens/LightScreen';
import MovScreen from './screens/MovScreen';
import theme from './theme';
import store from './reducers';

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
    activeBackgroundColor: theme.accentColor,
    activeTintColor: 'black',
    inactiveBackgroundColor: theme.backgroundColor,
    inactiveTintColor: 'white',
  },
});

const AppContainer = createAppContainer(RootStack);

const App: React.FunctionComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={theme.statusBarColor} />
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </View>
  );
};

export default App;
