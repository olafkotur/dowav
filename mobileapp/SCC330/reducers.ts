import { createStore, Reducer } from 'redux';
import { GlobalState, IAction, ILiveDataAction } from './types';

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
      newState.settings = action.payload;
      break;
    case 'WATER_DATA_RECV':
      newState.waterData = action.payload;
      break;
    case 'WATER_DATA_FAIL':
      newState.waterData = action.payload;
      break;
    case 'WATER_DATA_CLOSE':
      newState.waterData = action.payload;
    default:
      return state;
  }

  return newState;
}

const store = createStore(reducer);

export default store;
