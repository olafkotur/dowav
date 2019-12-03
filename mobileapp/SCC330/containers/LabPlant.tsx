import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { PlantSetting } from '../types';

interface Props {
  name: PlantSetting['plant'],
  color: PlantSetting['bulbColor'],
}

const LabPlant = (props: Props) => {
  const { name, color } = props;

  return (
    <View style={styles.container}>
      <Icon
        name="flower"
        type="material-community"
        color={color}
      />
      <Text style={{ color: 'white' }}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LabPlant;
