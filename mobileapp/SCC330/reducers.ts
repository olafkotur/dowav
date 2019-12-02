import { createStore, Reducer, combineReducers } from 'redux';
import { GlobalState, IDataAction, IAction } from './types';

const initialState: GlobalState = {
  liveData: [],
  waterData: null,
}

const reducer: Reducer<GlobalState, IAction> = (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case 'WATER_DATA_FAIL':
      newState.waterData = false;
      break;
    default:
      return state;
  }

  return newState;
}

const dataReducer: Reducer<GlobalState, IDataAction> = (state = initialState, action) => {
  const { liveData } = state;
  const newState = { ...state };

  switch (action.type) {
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

const store = createStore(combineReducers({ reducer, dataReducer }));

export default store;
