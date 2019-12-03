import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { Zone, PlantSetting } from '../types';
import LabPlant from './LabPlant';

interface Props {
  zone: Zone,
  settings: PlantSetting[],
}

const mapSettingsToPlants = (settings: PlantSetting[]) => {
  return settings.map((setting, i) => {
    return (
      <LabPlant
        name={setting.plant}
        color={setting.bulbColor}
        key={i}
      />
    );
  });
}

const LabZone = (props: Props) => {
  const { zone, settings } = props;
  const zoneSettings = settings.filter(setting => setting.zone === zone);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zone {zone}</Text>

      <View style={styles.plantsContainer}>
        {mapSettingsToPlants(zoneSettings)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 8,
    borderColor: 'white',
    borderWidth: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plantsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});

export default LabZone;
