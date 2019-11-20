import React, { useState, useEffect } from 'react';
import { SensorData, GraphState } from '../types';
import { Text, TextStyle } from 'react-native';
import Loader from '../containers/Loader';

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

  let component = <Loader />;
  if (screenState === 'error') {
    component = <Text style={textStyle}>No movement data was received from the server</Text>;
  } else if (screenState === 'displaying') {
    component = <Text style={textStyle}>The user is {zone === 0 ? 'not online' : `in zone ${zone}`}</Text>
  }

  return component;
}

ZoneLocation.defaultProps = {
  textStyle: {},
}

export default ZoneLocation;
