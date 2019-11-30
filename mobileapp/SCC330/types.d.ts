export type Sensor = 'temperature' | 'moisture' | 'light';
export type Zone = 1 | 2 | 3 | null | undefined;
export type GraphState = 'loading' | 'displaying' | 'error';

export type GlobalState = {
  liveData: ZoneData[],
};

export type LiveDataAction = {
  type: 'LIVE_DATA_RECV',
  payload: ZoneData,
};

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

export type ServerSetting = {
  time: number,
  type: 'shouldSendTweets' | 'minTemperature' | 'minMoisture' | 'minLight' | 'maxTemperarure' | 'maxLight',
  value: string,
}

export type AppSetting = {
  value: boolean | number,
  time: number,
}
export type AppSettings = {
  shouldTweet: AppSetting,
  minTemp: AppSetting,
  maxTemp: AppSetting,
  minMoisture: AppSetting,
  minLight: AppSetting,
  maxLight: AppSetting,
}
