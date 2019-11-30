import React from 'react';
import { StyleSheet, View } from 'react-native';

import ZoneLocation from '../containers/ZoneLocation';
import theme from '../theme';

const MovScreen = () => (
  <View style={styles.container}>
    <ZoneLocation textStyle={styles.text} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
  },
  text: theme.text,
});

export default MovScreen;
