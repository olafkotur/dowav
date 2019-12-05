import React from 'react';
import { StatusBar, View, TouchableOpacity, Insets, TouchableOpacityProps, GestureResponderEvent } from 'react-native';
import { createAppContainer, NavigationRoute, NavigationParams } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, NavigationStackProp } from 'react-navigation-stack';
import { Icon, IconProps } from 'react-native-elements';
import { Provider } from 'react-redux';

import TempScreen from './screens/TempScreen';
import MoistureScreen from './screens/MoistureScreen';
import LightScreen from './screens/LightScreen';
import MovScreen from './screens/MovScreen';
import PlantsScreen from './screens/PlantsScreen';
import theme from './theme';
import store from './reducers';
import WaterScreen from './screens/WaterScreen';
import TwitterScreen from './screens/TwitterScreen';

interface ScreenIcons<T> {
  [key: string]: T,
}

interface HeaderIconProps {
  navigation: NavigationStackProp<NavigationRoute<NavigationParams>, any>,
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

const HeaderIcons = ({ navigation }: HeaderIconProps) => {
  const { navigate } = navigation;
  const hitSlop: Insets = {
    top: 20,
    bottom: 20,
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => navigate('Twitter Feed')}
        hitSlop={hitSlop}
        style={{
          paddingLeft: 10,
          paddingRight: 15,
        }}
      >
        <Icon
          name="twitter"
          type="material-community"
          color="white"
          size={30}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigate('My Plants')}
        hitSlop={hitSlop}
        style={{
          paddingLeft: 10,
          paddingRight: 25,
        }}
      >
        <Icon
          name="flower"
          type="material-community"
          color="white"
          size={30}
        />
      </TouchableOpacity>
    </>
  );
}

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
      headerRight: <HeaderIcons navigation={navigation} />,
    }),
  },
  'Twitter Feed': TwitterScreen,
  'My Plants': PlantsScreen,
}, {
  initialRouteName: 'Root',
  defaultNavigationOptions: ({ navigation }) => ({
    headerTintColor: 'white',
    headerTitle: getHeaderTitle(navigation.state),
    headerStyle: { backgroundColor: theme.headerColor },
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

// Utility function used in multiple components
export const parseDate = (dateTime: Date, divider = ' • ') => {
  const addZero = (n: number) => n === 0 ? '00' : (n < 10 ? `0${n}` : n.toString());

  const time = `${addZero(dateTime.getHours())}:${addZero(dateTime.getMinutes())}`;
  const date = dateTime.toDateString();

  return `${time}${divider}${date}`;
}

export default App;
