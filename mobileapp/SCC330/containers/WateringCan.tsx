import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { Svg, Rect } from 'react-native-svg';

import ErrorMessage from './ErrorMessage';
import { GlobalState } from '../types';
import { startWaterData } from '../actions';
import theme from '../theme';

const WateringCan = () => {
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const stopWaterData = startWaterData();

    return () => {
      stopWaterData();
    };
  }, []);

  const waterData = useSelector((store: GlobalState) => store.waterData);
  const tilt = waterData ? waterData.tilt % 360 : 0;
  const volume = waterData ? waterData.volume : 0;

  if (loading && waterData) {
    setLoading(false);
  } else if (loading) {
    return <ActivityIndicator size="large" color={theme.accentColor} />
  } else if (!waterData) {
    return <ErrorMessage dataType="water" />
  }

  return (
    <Svg
    width="50%"
    height="50%"
    rotation={tilt}
    >
      <Rect
        fill="#40a4df"
        width="100%"
        height="100%"
      />
      <Rect
        fill={theme.backgroundColor}
        width="100%"
        height={`${100 - volume}%`}
      />
      <Rect
        fill="transparent"
        width="100%"
        height="100%"
        stroke="white"
        strokeWidth={3}
      />
    </Svg>
  );
}

export default WateringCan;
