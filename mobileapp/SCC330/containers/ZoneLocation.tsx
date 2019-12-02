import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Text } from 'react-native';

import { GlobalState } from '../types';
import theme from '../theme';
import ErrorMessage from './ErrorMessage';
import { fetchLocationData } from '../actions';

const LOCATION_FETCH_DELAY = 1000;

const ZoneLocation = () => {
  useEffect(() => {
    fetchLocationData();

    const interval = setInterval(() => {
      fetchLocationData();
    }, LOCATION_FETCH_DELAY);

    return () => {
      clearInterval(interval);
    }
  }, []);

  const data = useSelector((store: GlobalState) => store.location);

  if (data) {
    const style = { ...theme.text, color: theme.inactiveColor };
    const zone = data.value;

    return <Text style={style}>The user is {zone === 0 ? 'not online' : `in zone ${zone}`}</Text>;
  }

  return <ErrorMessage dataType="movement" />;
}

export default ZoneLocation;
