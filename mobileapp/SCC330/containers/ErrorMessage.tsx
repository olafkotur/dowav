import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../theme';

interface Props {
  dataType: string,
}

const ErrorMessage = ({ dataType }: Props) => (
  <View style={styles.container}>
    <Text style={styles.message}>No {dataType} data was received from the server, please try again later</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  message: {
    fontSize: 18,
    color: theme.inactiveColor,
    textAlign: 'center',
  },
});

export default ErrorMessage;
