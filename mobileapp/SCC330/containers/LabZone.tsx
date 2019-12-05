import React, { useState } from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';

import { Zone, PlantSetting, GlobalState, PlantHealth } from '../types';
import store from '../reducers';
import LabPlant from './LabPlant';
import PlantSettings from './PlantSettings';
import GraphButton from './GraphButton';
import theme from '../theme';
import { changeSettings } from '../actions';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import useFetch from '../hooks/useFetch';

interface Props {
  zone: Zone,
  borderBottom?: boolean,
}

const HEALTH_ENDPOINT = 'https://dowav-api.herokuapp.com/api/health';
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
    newUserSettings[settingIndex] = { ...newUserSetting, lastUpdate: userSettings[settingIndex].lastUpdate };
  }

  setUserSettings(newUserSettings);
}

const updateGlobalSettings = (userSettings: PlantSetting[], plant: string, setLoading: Function, setPlant: Function, setError: Function) => {
  const newSetting = [ userSettings.find(s => s.plant === plant) ];

  if (newSetting[0]) {
    setLoading(true);
    newSetting[0].bulbBrightness--;

    fetch(POST_SETTINGS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(newSetting),
    }).then(() => {
      store.dispatch(changeSettings(userSettings));
      setPlant('');
    }).catch(() => {
      setError(true);
      setTimeout(() => {
        setError(false);
        setPlant('');
      }, 4000);
    }).finally(() => setLoading(false));
  }
}

const LabZone = ({ zone, borderBottom }: Props) => {
  const globalSettings = useSelector((store: GlobalState) => store.settings);
  const [ healthData ] = useFetch<PlantHealth[]>(HEALTH_ENDPOINT);

  const [ userSettings, setUserSettings ] = useState(globalSettings);
  const [ plant, setPlant ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);

  const resetUserSettings = () => {
    setUserSettings(globalSettings);
    setPlant('');
  }

  const containerStyle: ViewStyle = { ...styles.container, borderBottomWidth: borderBottom ? 1 : 0 };

  if (loading) {
    return (
      <View style={containerStyle}>
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View style={containerStyle}>
        <Text style={{ ...theme.text, color: theme.inactiveColor }}>Failed to update settings for {plant}, please try again later</Text>
      </View>
    );
  }
  
  if (globalSettings && userSettings) {
    const zoneSettings = globalSettings.filter(setting => setting.zone === zone);
    const showSettings = plant !== '';
    const plantSetting = userSettings.find(s => s.plant === plant);
    const plantGlobalSetting = globalSettings.find(s => s.plant === plant);

    return (
      <View style={containerStyle}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{showSettings ? plant : `Zone ${zone}`}</Text>
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
                onPress={() => updateGlobalSettings(userSettings, plant, setLoading, setPlant, setError)}
              />
            </View>
          ) : null}
        </View>

        {showSettings && plantSetting ? (
          <View style={styles.settingsContainer}>
            <PlantSettings
              userSettings={plantSetting}
              lastUpdate={plantGlobalSetting ? plantGlobalSetting.lastUpdate : undefined}
              healthData={healthData && healthData.length ? healthData.filter(d => d.plant === plant)[0] : undefined}
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
