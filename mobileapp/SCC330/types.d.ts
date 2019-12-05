import { Action } from 'redux';

export type Sensor = 'temperature' | 'moisture' | 'light';
export type Zone = 1 | 2 | 3 | null | undefined;

// Structure of redux store
export type GlobalState = {
  liveData: {
    [key in Sensor]: ZoneData[]
  },
  location: SensorData,
  settings: PlantSetting[] | null,
  waterData: WaterData | false | null,
};

// Action interfaces
export interface IAction extends Action {
  type: 'LIVE_DATA_RECV' | 'LOCATION_DATA_RECV' | 'CHANGE_SETTINGS' | 'WATER_DATA_RECV' | 'WATER_DATA_FAIL' | 'WATER_DATA_CLOSE',
  payload: any,
}
export interface ILiveDataAction extends IAction {
  type: 'LIVE_DATA_RECV',
  payload: {
    sensor: Sensor,
    data: ZoneData,
  },
}
export interface IWaterDataAction extends IAction {
  type: 'WATER_DATA_RECV',
  payload: WaterData,
}
export interface ISettingsAction extends IAction {
  type: 'CHANGE_SETTINGS',
  payload: PlantSetting[],
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

export type Tweet = {
  text: string,
  'created_at': string,
};

export type PlantSetting = {
  zone: Zone,
  plant: string,
  shouldSendTweets: boolean,
  minTemperature: number,
  maxTemperature: number,
  minLight: number,
  maxLight: number,
  minMoisture: number,
  bulbColor: string,
  bulbBrightness: number,
  lastUpdate?: number,
};
export type PlantHealth = {
  plant: string,
  time: number,
  soil: string,
  stem: string,
  leaf: string,
};
