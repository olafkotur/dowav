import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { PlantSetting } from '../types';

interface Props {
  name: PlantSetting['plant'],
  color: PlantSetting['bulbColor'],
  onPress: Function,
}

const LabPlant = ({ name, color, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.plantContainer}
      onPress={() => onPress(name)}
      activeOpacity={1}
    >
      <Icon
        name="flower"
        type="material-community"
        color={color}
      />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 1,
  },
  plantContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginTop: 3,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LabPlant;
