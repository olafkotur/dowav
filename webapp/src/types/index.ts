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
    value: number;
    min?: number;
    max?: number;
}

export type MultipleHistoryData = {
    [key: string]: IHistoryData[];
};

export type HistoryData = IHistoryData[] | MultipleHistoryData;

export type GraphConfiguration = {
    title?: string;
    name: string;
    id: string;
    zone?: number;
};

export type TimePeriod = {
    timePeriod: number;
    selected: boolean;
};

export type FetchError = {
    title: string;
    message: string;
    actions?: string[];
};

export type ErrorMessages = {
    [key: string]: FetchError;
};

export type UseFetchState = {
    loading: boolean;
    data: any | null;
    error: FetchError | null;
};
