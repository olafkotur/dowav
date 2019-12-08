export interface ILiveData {
  zoneId: number,
  temperature: number,
  moisture: number,
  light: number,
  createdAt: Date,
}

export interface ISimpleResponse {
  time: number,
  value: number
}