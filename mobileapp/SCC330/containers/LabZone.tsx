import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { Zone, PlantSetting } from '../types';
import LabPlant from './LabPlant';
import PlantSettings from './PlantSettings';
import GraphButton from './GraphButton';
import theme from '../theme';

interface Props {
  zone: Zone,
  initSettings: PlantSetting[],
}

const POST_SETTINGS_ENDPOINT = 'https://dowav-api.herokuapp.com/api/setting';

const mapSettingsToPlants = (settings: PlantSetting[], onPress: Function) => {
  return settings.map((setting, i) => {
    return (
      <LabPlant
        name={setting.plant}
        color={setting.bulbColor}
        onPress={onPress}
        key={i}
      />
    );
  });
}

const postSettings = (settings: PlantSetting[], setPlant: Function) => {
  fetch(POST_SETTINGS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(settings),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).finally(() => setPlant(''));
}

const LabZone = ({ zone, initSettings }: Props) => {
  const zoneSettings = initSettings.filter(setting => setting.zone === zone);

  const [ plant, setPlant ] = useState('');
  const [ settings, setSettings ] = useState(initSettings);

  const setNewSettings = (newSetting: PlantSetting) => {
    const newSettings = [ ...settings ];
    const settingIndex = settings.findIndex(setting => setting.plant === newSetting.plant);

    if (settingIndex > -1) {
      newSettings[settingIndex] = newSetting;
    }

    setSettings(newSettings);
  }
  const showSettings = plant !== '';

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{showSettings ? `Settings for ${plant}` : `Zone ${zone}`}</Text>
        {showSettings ? (
          <GraphButton
            label="Save"
            style={{ ...theme.btnStyle, padding: 2 }}
            onPress={() => postSettings(settings, setPlant)}
          />
        ) : null}
      </View>

      {showSettings ? (
        <View style={styles.settingsContainer}>
          <PlantSettings
            settings={zoneSettings.filter(setting => setting.plant === plant)[0]}
            onSettingChange={setNewSettings}
          />
        </View>
      ) : (
        <View style={styles.plantsContainer}>
          {zoneSettings.length ? (
            mapSettingsToPlants(zoneSettings, setPlant)
          ) : (
            <Text style={{ ...theme.text, color: theme.inactiveColor }}>No plants in zone {zone}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    borderColor: 'white',
    borderWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  title: {
    marginLeft: 3,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsContainer: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  plantsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default LabZone;
