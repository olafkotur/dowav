import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { Zone, PlantSetting, GlobalState } from '../types';
import store from '../reducers';
import LabPlant from './LabPlant';
import PlantSettings from './PlantSettings';
import GraphButton from './GraphButton';
import theme from '../theme';
import { changeSettings } from '../actions';
import { useSelector } from 'react-redux';
import Loader from './Loader';

interface Props {
  zone: Zone,
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

const updateUserSettings = (userSettings: PlantSetting[], newUserSetting: PlantSetting, setUserSettings: Function) => {
  const newUserSettings = [ ...userSettings ];
  const settingIndex = newUserSettings.findIndex(userSetting => userSetting.plant === newUserSetting.plant);

  if (settingIndex > -1) {
    newUserSettings[settingIndex] = newUserSetting;
  }

  setUserSettings(newUserSettings);
}

const updateGlobalSettings = (settings: PlantSetting[], setLoading: Function, setPlant: Function, setError: Function) => {
  setLoading(true);

  fetch(POST_SETTINGS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(settings),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then(() => {
    store.dispatch(changeSettings(settings));
    setPlant('');
  }).catch(() => {
    setError(true);
    setTimeout(() => {
      setError(false);
      setPlant('');
    }, 4000);
  }).finally(() => setLoading(false));
}

const LabZone = ({ zone }: Props) => {
  const globalSettings = useSelector((store: GlobalState) => store.settings);

  const [ userSettings, setUserSettings ] = useState(globalSettings);
  const [ plant, setPlant ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);

  const resetUserSettings = () => {
    setUserSettings(globalSettings);
    setPlant('');
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ ...theme.text, color: theme.inactiveColor }}>Failed to update settings for {plant}, please try again later</Text>
      </View>
    );
  }
  
  if (globalSettings && userSettings) {
    const zoneSettings = globalSettings.filter(setting => setting.zone === zone);
    const showSettings = plant !== '';
    const plantSetting = userSettings.find(s => s.plant === plant);

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{showSettings ? `Settings for ${plant}` : `Zone ${zone}`}</Text>
          {showSettings ? (
            <View style={{ flexDirection: 'row' }}>
              <GraphButton
                label="Cancel"
                style={{ ...theme.btnStyle, padding: 2 }}
                onPress={resetUserSettings}
              />
              <GraphButton
                label="Save"
                active
                style={{ ...theme.btnStyle, marginLeft: 5, padding: 2 }}
                onPress={() => updateGlobalSettings(userSettings, setLoading, setPlant, setError)}
              />
            </View>
          ) : null}
        </View>

        {showSettings && plantSetting ? (
          <View style={styles.settingsContainer}>
            <PlantSettings
              userSettings={plantSetting}
              onSettingChange={(newSetting) => updateUserSettings(userSettings, newSetting, setUserSettings)}
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
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
