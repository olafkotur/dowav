import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import useFetch from '../hooks/useFetch';
import ErrorMessage from './ErrorMessage';
import LabZone from './LabZone';
import Loader from './Loader';
import { PlantSetting } from '../types';
import theme from '../theme';
import store from '../reducers';
import { changeSettings, openWebSocket } from '../actions';

const SETTINGS_ENDPOINT = 'https://dowav-api.herokuapp.com/api/setting/all';
const SETTINGS_SOCKET_ENDPOINT = 'wss://dowav-api.herokuapp.com/api/setting';

const MyPlants = () => {
  const [ data, error, loading ] = useFetch<PlantSetting[]>(SETTINGS_ENDPOINT);

  useEffect(() => {
    const settingsSocket = openWebSocket<PlantSetting[]>(SETTINGS_SOCKET_ENDPOINT, changeSettings);

    return () => {
      settingsSocket.close();
    };
  }, []);

  if (loading) {
    return (
      <>
        <Text style={styles.loadingText}>Fetching plants from the server...</Text>
        <Loader />
      </>
    );
  }

  if (error) {
    return <ErrorMessage dataType="plant settings" />;
  }

  if (data) {
    store.dispatch(changeSettings(data));

    return (
      <View style={styles.container}>
        <LabZone zone={1} />
        <LabZone zone={2} />
        <LabZone
          zone={3}
          borderBottom
        />
      </View>
    );
  }

  return <ErrorMessage dataType="plant settings" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  loadingText: {
    color: theme.inactiveColor,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});

export default MyPlants;
