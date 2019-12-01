import { Action } from "redux";

export type Sensor = 'temperature' | 'moisture' | 'light';
export type Zone = 1 | 2 | 3 | null | undefined;
export type GraphState = 'loading' | 'displaying' | 'error';

// Structure of redux store
export type GlobalState = {
  liveData: ZoneData[],
  waterData: WaterData | null,
};

// Action interfaces
export interface IDataAction extends Action {
  type: 'LIVE_DATA_RECV' | 'WATER_DATA_RECV',
  payload: any,
}
export interface ILiveDataAction extends IDataAction {
  type: 'LIVE_DATA_RECV',
  payload: ZoneData,
}
export interface IWaterDataAction extends IDataAction {
  type: 'WATER_DATA_RECV',
  payload: WaterData,
}

// Data for one sensor in one zone
export type SensorData = {
  value: number,
  time: number,
};

// Zone data for a given sensor
// Each index represents a zone at the current point in time
export type ZoneData = SensorData[];

// Historic data for a given sensor
// Each index represents a zone
// Each sub-index represents a point in time
export type HistoricData = ZoneData[];

// Type of water data
export type WaterData = {
  time: number,
  volume: number,
  tilt: number,
};
