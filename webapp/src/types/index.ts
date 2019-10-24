export interface IViewport {
    width: number;
    height: number;
}

export interface IMargin {
    top: number;
    bottom: number;
    right: number;
    left: number;
}

export interface IHistoryData {
    time: number;
    avg: number;
    min: number;
    max: number;
}

export type MultipleHistoryData = {
    [key: string]: IHistoryData[];
};

export type HistoryData = IHistoryData[] | MultipleHistoryData;

export type GraphConfiguration = {
    title?: string;
    name: string;
    id: string;
};
