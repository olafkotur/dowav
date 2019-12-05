import React, { useEffect, useState } from 'react';
import { Animated, Text, StyleSheet, Easing } from 'react-native';
import { useSelector } from 'react-redux';
import { Svg, Rect } from 'react-native-svg';

import ErrorMessage from './ErrorMessage';
import { GlobalState, WaterData } from '../types';
import { openWebSocket, waterDataReceived, waterDataFailed, waterDataClosed } from '../actions';
import theme from '../theme';
import Loader from './Loader';
import { parseDate } from '../App';

const WATER_ENDPOINT = 'wss://dowav-api.herokuapp.com/api/water';

const WateringCan = () => {
  useEffect(() => {
    const waterSocket = openWebSocket<WaterData>(WATER_ENDPOINT, waterDataReceived, waterDataFailed, waterDataClosed);

    return () => {
      waterSocket.close();
    };
  }, []);

  const waterData = useSelector((store: GlobalState) => store.waterData);
  const tilt = waterData ? waterData.tilt % 360 : 0;
  const volume = waterData ? waterData.volume : 0;

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const AnimatedRect = Animated.createAnimatedComponent(Rect);
  const [ aTilt ] = useState(new Animated.Value(tilt));
  const [ aVol ] = useState(new Animated.Value(volume));

  useEffect(() => {
    Animated.timing(aTilt, {
      toValue: tilt,
      duration: 1000,
      easing: Easing.linear,
    }).start();

    Animated.timing(aVol, {
      toValue: volume,
      duration: 1000,
      easing: Easing.linear,
    }).start();
  }, [tilt, volume]);

  if (waterData === null) {
    return <Loader />;
  } else if (waterData === false) {
    return <ErrorMessage dataType="water" />;
  } else if (waterData) {
    const aVolConfig: Animated.InterpolationConfigType = {
      inputRange: [ 0, 100 ],
      outputRange: [ '100%', '0%' ]
    };
    
    return (
      <>
        <AnimatedSvg
          width="50%"
          height="50%"
          rotation={aTilt}
        >
          <Rect
            fill="#40a4df"
            width="100%"
            height="100%"
          />
          <AnimatedRect
            fill={theme.backgroundColor}
            width="100%"
            height={aVol.interpolate(aVolConfig)}
          />
          <Rect
            fill="transparent"
            width="100%"
            height="100%"
            stroke="white"
            strokeWidth={3}
          />
        </AnimatedSvg>

        <Text style={styles.text}>Last interacted with: {parseDate(new Date(waterData.time), ', ')}</Text>
      </>
    );
  }

  return <ErrorMessage dataType="water" />;
}

const styles = StyleSheet.create({
  text: {
    bottom: -80,
    fontSize: 16,
    color: 'white',
  }
})

export default WateringCan;
