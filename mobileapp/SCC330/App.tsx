import React from 'react';
import { StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { createAppContainer, NavigationRoute, NavigationParams } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, NavigationStackProp } from 'react-navigation-stack';
import { Icon, IconProps } from 'react-native-elements';
import { Provider } from 'react-redux';

import TempScreen from './screens/TempScreen';
import MoistureScreen from './screens/MoistureScreen';
import LightScreen from './screens/LightScreen';
import MovScreen from './screens/MovScreen';
import SettingsScreen from './screens/SettingsScreen';
import theme from './theme';
import store from './reducers';
import WaterScreen from './screens/WaterScreen';

interface ScreenIcons<T> {
  [key: string]: T
}
interface SettingsIconProps {
  navigation: NavigationStackProp<NavigationRoute<NavigationParams>, any>
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
  Water: {
    name: 'water-pump',
    type: 'material-community',
  },
  Movement: {
    name: 'location-searching',
    type: 'material',
  },
}

const SettingsIcon = ({ navigation }: SettingsIconProps) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Settings')}
    hitSlop={{
      top: 20,
      bottom: 20,
    }}
    style={{
      paddingRight: 15,
      paddingLeft: 15,
    }}
  >
    <Icon
      name="settings"
      color="white"
      size={30}
    />
  </TouchableOpacity>
);

const getHeaderTitle = (state: any): string => (
  state.routeName === 'Root' ? state.routes[state.index].routeName : state.routeName
);

const TabNavigator = createBottomTabNavigator({
  Temperature: TempScreen,
  Moisture: MoistureScreen,
  Light: LightScreen,
  Water: WaterScreen,
  Movement: MovScreen,
}, {
  initialRouteName: 'Temperature',
  tabBarOptions: {
    activeBackgroundColor: theme.accentColor,
    activeTintColor: 'black',
    inactiveBackgroundColor: theme.backgroundColor,
    inactiveTintColor: 'white',
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon
        {...tabIcons[navigation.state.routeName]}
        color={tintColor}
      />
    ),
  }),
});

const RootStack = createStackNavigator({
  Root: {
    screen: TabNavigator,
    navigationOptions: ({ navigation }) => ({
      headerRight: <SettingsIcon navigation={navigation} />,
    }),
  },
  Settings: {
    screen: SettingsScreen,
  },
}, {
  initialRouteName: 'Root',
  defaultNavigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: theme.headerColor,
    },
    headerTintColor: 'white',
    headerTitle: getHeaderTitle(navigation.state),
    headerTitleStyle: {
      color: 'white',
      fontWeight: 'bold',
    },
  }),
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
