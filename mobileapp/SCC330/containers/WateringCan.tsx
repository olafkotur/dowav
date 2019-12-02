import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Svg, Rect } from 'react-native-svg';

import ErrorMessage from './ErrorMessage';
import { GlobalState } from '../types';
import { openWebSocket } from '../actions';
import theme from '../theme';
import Loader from './Loader';

const WATER_ENDPOINT = 'ws://dowav-api.herokuapp.com/api/water';

const WateringCan = () => {
  useEffect(() => {
    const waterSocket = openWebSocket(WATER_ENDPOINT);

    return () => {
      waterSocket.close();
    };
  }, []);

  const waterData = useSelector((store: GlobalState) => store.waterData);
  const tilt = waterData ? waterData.tilt % 360 : 0;
  const volume = waterData ? waterData.volume : 0;

  if (waterData === null) {
    return <Loader />;
  } else if (waterData === false) {
    return <ErrorMessage dataType="water" />;
  } else if (waterData) {
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

  return <ErrorMessage dataType="water" />;
}

export default WateringCan;
