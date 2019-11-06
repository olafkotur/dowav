import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MoistureScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Moisture</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c5364',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MoistureScreen;
