import React from 'react';

import WateringCan from '../containers/WateringCan';
import { View, StyleSheet } from 'react-native';
import theme from '../theme';

const WaterScreen = () => (
  <View style={styles.container}>
    <WateringCan />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
  }
});

export default WaterScreen;
