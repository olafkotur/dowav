import React, { useState, useEffect } from 'react';
import { SensorData, GraphState } from '../types';
import { Text, TextStyle, ActivityIndicator } from 'react-native';
import theme from '../theme';
import ErrorMessage from './ErrorMessage';
import Loader from './Loader';

const LOCATION_ENDPOINT = 'https://dowav-api.herokuapp.com/api/location/live';
const DELAY = 1000;

const ZoneLocation = () => {
  const [ zone, setZone ] = useState(0);
  const [ screenState, setScreenState ] = useState('loading' as GraphState);

  useEffect(() => {
    let doUpdate = true;

    const interval = setInterval(() => {
      const pData = fetch(LOCATION_ENDPOINT);

      pData.then((res) => {
        if (res) {
          res.json().then((data: SensorData) => {
            if (doUpdate) {
              if (data) {
                setZone(data.value);
                setScreenState('displaying');
              } else {
                setScreenState('error');
              }
            }
          });
        } else {
          setScreenState('error');
        }
      }).catch((err) => {
        setScreenState('error');
        console.log(err);
      });
    }, DELAY);

    return () => {
      doUpdate = false;
      clearInterval(interval);
    }
  }, [zone]);

  let component = <Loader />;
  if (screenState === 'error') {
    component = <ErrorMessage dataType="movement" />;
  } else if (screenState === 'displaying') {
    const style = { ...theme.text, color: theme.inactiveColor };
    component = <Text style={style}>The user is {zone === 0 ? 'not online' : `in zone ${zone}`}</Text>
  }

  return component;
}

export default ZoneLocation;
