import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import useFetch from '../hooks/useFetch';
import ErrorMessage from './ErrorMessage';
import LabZone from './LabZone';
import Loader from './Loader';
import { PlantSetting } from '../types';
import theme from '../theme';
import store from '../reducers';
import { changeSettings } from '../actions';

const SETTINGS_ENDPOINT = 'https://dowav-api.herokuapp.com/api/setting/all';

const MyPlants = () => {
  const [ data, error, loading ] = useFetch<PlantSetting[]>(SETTINGS_ENDPOINT);

  if (loading) {
    return (
      <>
        <Text style={styles.loadingText}>Fetching latest plants from the server...</Text>
        <Loader />
      </>
    );
  }

  if (error) {
    return <ErrorMessage dataType="plant" />;
  }

  if (data) {
    store.dispatch(changeSettings(data));

    return (
      <View style={styles.container}>
        <LabZone zone={1} />
        <LabZone zone={2} />
        <LabZone zone={3} />
      </View>
    );
  }

  return <ErrorMessage dataType="plant" />;
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
  }
});

export default MyPlants;
