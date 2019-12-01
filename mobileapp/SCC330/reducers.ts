import { createStore, Reducer } from 'redux';
import { GlobalState, IDataAction } from './types';

const initialState: GlobalState = {
  liveData: [],
  waterData: null,
}

const reducer: Reducer<GlobalState, IDataAction> = (state = initialState, action) => {
  const { liveData } = state;
  const newState = { ...state };

  switch(action.type) {
    case 'LIVE_DATA_RECV':
      if (liveData.length >= 10) {
        newState.liveData = [ ...liveData.slice(1), action.payload ];
      } else {
        newState.liveData = [ ...liveData, action.payload ];
      }
      break;
    case 'WATER_DATA_RECV':
      newState.waterData = action.payload;
      break;
    default:
      return state;
  }

  return newState;
}

const store = createStore(reducer);

export default store;
