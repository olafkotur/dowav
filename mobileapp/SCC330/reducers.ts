import { createStore, Reducer } from 'redux';
import { GlobalState, IAction, ILiveDataAction, PlantSetting, WaterData } from './types';

const initialState: GlobalState = {
  liveData: {
    temperature: [],
    moisture: [],
    light: [],
  },
  location: {
    time: 0,
    value: 0,
  },
  settings: null,
  waterData: null,
}

const reducer: Reducer<GlobalState, IAction> = (state = initialState, action) => {
  const { liveData } = state;
  const newState = { ...state };

  switch (action.type) {
    case 'LIVE_DATA_RECV':
      const { sensor } = action.payload as ILiveDataAction['payload'];

      if (liveData[sensor].length >= 10) {
        newState.liveData[sensor] = [ ...liveData[sensor].slice(1), action.payload.data ];
      } else {
        newState.liveData[sensor] = [ ...liveData[sensor], action.payload.data ];
      }
      break;
    case 'LOCATION_DATA_RECV':
      newState.location = action.payload;
      break;
    case 'CHANGE_SETTINGS':
      if (state.settings && newState.settings) {
        const payload = action.payload as PlantSetting[];

        if (payload.length) {
          const newSetting = payload[0];
          const index = state.settings.findIndex(s => s.plant === newSetting.plant);

          newState.settings[index] = newSetting;
        }
      } else {
        newState.settings = action.payload;
      }
      break;
    case 'WATER_DATA_RECV':
    case 'WATER_DATA_FAIL':
    case 'WATER_DATA_CLOSE':
      const oldData = state.waterData;
      const newData = action.payload as WaterData;

      if (oldData && newData) {
        if (oldData.tilt !== newData.tilt || oldData.volume !== newData.volume || oldData.time !== newData.time) {
          newState.waterData = newData;
        }
      } else {
        newState.waterData = newData;
      }
      break;
    default:
      return state;
  }

  return newState;
}

const store = createStore(reducer);

export default store;
