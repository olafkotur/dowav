import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../theme';

const MovScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Movement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MovScreen;
