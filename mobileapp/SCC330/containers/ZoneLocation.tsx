import React, { useState, useEffect } from 'react';
import { SensorData, GraphState } from '../types';
import { Text, TextStyle, ActivityIndicator } from 'react-native';
import theme from '../theme';
import ErrorMessage from './ErrorMessage';

const ENDPOINT = 'https://dowav-api.herokuapp.com/api/location/live';
const DELAY = 1000;

interface Props {
  textStyle?: TextStyle,
}

const ZoneLocation = (props: Props) => {
  const { textStyle } = props;

  const [ zone, setZone ] = useState(0);
  const [ screenState, setScreenState ] = useState('loading' as GraphState);

  useEffect(() => {
    let doUpdate = true;

    const interval = setInterval(() => {
      const pData = fetch(ENDPOINT);

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

  let component = <ActivityIndicator size="large" color={theme.accentColor} />;
  if (screenState === 'error') {
    component = <ErrorMessage dataType="movement" />;
  } else if (screenState === 'displaying') {
    const style = { ...textStyle, color: theme.inactiveColor };
    component = <Text style={style}>The user is {zone === 0 ? 'not online' : `in zone ${zone}`}</Text>
  }

  return component;
}

ZoneLocation.defaultProps = {
  textStyle: {},
}

export default ZoneLocation;
