import { ZoneData, ILiveDataAction, Sensor, IWaterDataAction, WaterData, IAction, SensorData, ISettingsAction, PlantSetting } from './types';
import { ActionCreator } from 'redux';
import store from './reducers';

const { dispatch } = store;

// Action creators
export const liveDataReceived: ActionCreator<ILiveDataAction> = (sensor: Sensor, data: ZoneData) => ({
  type: 'LIVE_DATA_RECV',
  payload: { sensor, data }
});
export const locationDataReceived: ActionCreator<IAction> = (payload: SensorData) => ({
  type: 'LOCATION_DATA_RECV',
  payload,
});
export const waterDataReceived: ActionCreator<IWaterDataAction> = (payload: WaterData) => ({
  type: 'WATER_DATA_RECV',
  payload,
});
export const changeSettings: ActionCreator<ISettingsAction> = (payload: PlantSetting[]) => ({
  type: 'CHANGE_SETTINGS',
  payload,
});
export const waterDataFailed: IAction = {
  type: 'WATER_DATA_FAIL',
  payload: null,
};
export const waterDataClosed: IAction = {
  type: 'WATER_DATA_CLOSE',
  payload: false,
};

export const fetchLiveData = (sensor: Sensor) => {
  // const LIVE_ENDPOINT = 'https://danmiz.net/api/dowavlive.php'; FOR DEBUG
  const LIVE_ENDPOINT = `https://dowav-api.herokuapp.com/api/live/${sensor}`;

  fetch(LIVE_ENDPOINT)
    .then(async res => {
      const data: ZoneData = await res.json();
      dispatch(liveDataReceived(sensor, data));
    }).catch(() => {});
}

export const fetchLocationData = () => {
  const LOCATION_ENDPOINT = 'https://dowav-api.herokuapp.com/api/location/live';

  fetch(LOCATION_ENDPOINT)
    .then(async res => {
      const data: ZoneData = await res.json();
      dispatch(locationDataReceived(data));
    }).catch(() => {});
}

export function openWebSocket<D>(url: string, successAction: ActionCreator<IAction>, failedAction?: IAction, closedAction?: IAction) {
  const ws = new WebSocket(url);

  ws.onmessage = (ev) => {
    if (ev.data) {
      try {
        const data = JSON.parse(ev.data) as D;
        dispatch(successAction(data));
      } catch(e) {
        if (failedAction) {
          dispatch(failedAction);
        }
      }
    }
  }

  ws.onerror = () => {
    if (failedAction) {
      dispatch(failedAction);
    }
  }

  ws.onclose = () => {
    if (closedAction) {
      dispatch(closedAction);
    }
  }

  return { close: () => ws.close() };
}
