import { ZoneData, LiveDataAction, Sensor } from './types';
import { ActionCreator } from 'redux';
import store from './reducers';

// Action creators
export const liveDataReceived: ActionCreator<LiveDataAction> = (payload: ZoneData) => ({
  type: 'LIVE_DATA_RECV',
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
        store.dispatch(liveDataReceived(data));
      }
    }).catch(() => {
      //dispatch(liveDataFailed);
    });
}
