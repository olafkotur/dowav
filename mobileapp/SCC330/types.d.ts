export type Sensor = 'temperature' | 'moisture' | 'light';
export type Zone = 1 | 2 | 3 | null | undefined;
export type GraphState = 'loading' | 'displaying' | 'error';

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
