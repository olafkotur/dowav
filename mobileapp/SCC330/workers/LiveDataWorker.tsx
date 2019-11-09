import React, { useEffect, useState } from 'react';

import { Sensor, Zone } from '../types';

const LIVE_ENDPOINT = 'https://dowav-api.herokuapp.com/api/live/';
const DELAY = 5000;

interface Props {
  zone: Zone,
  sensor: Sensor,
  children: React.ReactNode,
}

// Function which polls server for data every DELAY ms
const start = (zone: number, sensor: string, setData: Function) => {
  const interval = setInterval(() => {
    try {
      const pData = fetch(`${LIVE_ENDPOINT}${zone}`);

      pData.then(res => {
        res.json().then(serverData => {
          if (serverData[sensor]) {
            setData(serverData[sensor]);
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  }, DELAY);

  return interval;
};

const LiveDataContext = React.createContext(null);

// Component which starts polling server and provides latest data
const LiveDataWorker = (props: Props) => {
  const [ data, setData ] = useState(null);
  const { zone, sensor } = props;

  useEffect(() => {
    const worker = start(zone, sensor, setData);

    return () => {
      clearInterval(worker);
    };
  }, []);

  return (
    <LiveDataContext.Provider value={data}>
      { props.children }
    </LiveDataContext.Provider>
  );
}

export { LiveDataWorker, LiveDataContext };
