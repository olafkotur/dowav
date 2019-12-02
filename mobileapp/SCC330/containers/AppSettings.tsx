import React from 'react';
import { Text, StyleSheet } from 'react-native';

import useFetch from '../hooks/useFetch';
import { PlantSetting } from '../types';
import Loader from './Loader';
import theme from '../theme';
import ErrorMessage from './ErrorMessage';

const SETTINGS_ENDPOINT = 'dowav-api.herokuapp.com/api/setting/all';

const AppSettings = () => {
  const [ data, error, loading ] = useFetch<PlantSetting[]>(SETTINGS_ENDPOINT);

  if (loading) {
    return (
      <>
        <Text style={styles.loadingText}>Fetching latest settings from the server...</Text>
        <Loader />
      </>
    );
  }

  if (error) {
    return <ErrorMessage dataType="settings" />;
  }

  if (data) {
    
  }

  return <ErrorMessage dataType="settings" />;
}

const styles = StyleSheet.create({
  loadingText: {
    color: theme.inactiveColor,
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default AppSettings;
