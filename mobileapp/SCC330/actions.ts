import { ZoneData, ILiveDataAction, Sensor, IWaterDataAction, WaterData } from './types';
import { ActionCreator } from 'redux';
import store from './reducers';

const { dispatch } = store;

// Action creators
export const liveDataReceived: ActionCreator<ILiveDataAction> = (payload: ZoneData) => ({
  type: 'LIVE_DATA_RECV',
  payload
});
export const waterDataReceived: ActionCreator<IWaterDataAction> = (payload: WaterData) => ({
  type: 'WATER_DATA_RECV',
  payload
});

export const fetchLiveData = (sensor: Sensor) => {
  // const LIVE_ENDPOINT = 'https://danmiz.net/api/dowavlive.php'; FOR DEBUG
  const LIVE_ENDPOINT = `https://dowav-api.herokuapp.com/api/live/${sensor}`

  fetch(LIVE_ENDPOINT)
    .then(async res => {
      if (res.status >= 400) {
        //dispatch(liveDataFailed);
      } else {
        const data: ZoneData = await res.json();
        dispatch(liveDataReceived(data));
      }
    }).catch(() => {
      //dispatch(liveDataFailed);
    });
}

export const startWaterData = () => {
  const ws = new WebSocket('ws://dowav-api.herokuapp.com/api/water');

  ws.onmessage = (ev) => {
    if (ev.data) {
      try {
        const data = JSON.parse(ev.data) as WaterData;
        dispatch(waterDataReceived(data));
      } catch(e) {
        //dispatch(waterDataFailed);
      }
    }
  }

  ws.onerror = () => {
    //dispatch(waterDataFailed);
  }

  ws.onclose = () => {
    //dispatch(waterDataEnd);
  }

  return () => {
    ws.close();
  };
}
