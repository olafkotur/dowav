import React, { useEffect, useState } from 'react';

import { Sensor, ZoneData } from '../types';

const LIVE_ENDPOINT = 'https://dowav-api.herokuapp.com/api/live/';
const DELAY = 5000;

interface Props {
  sensor: Sensor,
  children: React.ReactNode,
}

const LiveDataContext = React.createContext([] as ZoneData);

// Component which starts polling server and provides latest data
const LiveDataWorker = (props: Props) => {
  // Alias props
  const { sensor } = props;

  // Initialise state
  const [ data, setData ] = useState([]) as [ ZoneData, Function ];

  // Upon mounting, start worker
  useEffect(() => {
    // Get new data every DELAY ms
    const worker = setInterval(() => {
      try {
        const pData = fetch(`${LIVE_ENDPOINT}${sensor}`);
  
        pData.then(res => {
          res.json().then((serverData: ZoneData) => {
            if (serverData) {
              setData([ ...data, ...serverData ]);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }, DELAY);

    // Upon unmounting, stop worker
    return () => clearInterval(worker);
  }, []);

  return (
    <LiveDataContext.Provider value={data}>
      { props.children }
    </LiveDataContext.Provider>
  );
}

export { LiveDataWorker, LiveDataContext };
