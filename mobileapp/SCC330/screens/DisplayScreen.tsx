import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../theme';

interface Props {
  children: JSX.Element,
}

const DisplayScreen = (props: Props) => (
  <View style={styles.container}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    paddingBottom: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
  },
});

export default DisplayScreen;
