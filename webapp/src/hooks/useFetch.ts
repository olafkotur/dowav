import React, { useEffect, useState } from 'react';
import { UseFetchState } from '../types/index';
import data from '../data/mockdata';
import { fetchErrorMessages } from '../errors/errors';
import FetchConstants from '../constants/FetchConstants';

function checkCache(key: string): any | null {
    const cache = window.localStorage.getItem(key);
    if (cache) return JSON.parse(cache);
    return null;
}

type Params = {
    [key: string]: string | number;
};

type Options = {
    useCache: boolean;
    query: {
        endpoint: string;
        params: Params;
    }[];
    refetch: number;
};

function generateQueryString(params: Params): string {
    const keys = Object.keys(params);
    if (keys.length === 0) return '';
    let string = '?';
    for (let i = 0; i < keys.length; i++) {
        string += `${keys[i]}=${params[keys[i]]}${
            i === keys.length - 1 ? '' : '&'
        }`;
    }
    return string;
}

export default function useFetch(options: Options): UseFetchState {
    const cache = options.useCache ? checkCache('zoneA') : null;
    const [state, setState] = useState<UseFetchState>({
        loading: cache ? false : true,
        data: cache || null,
        error: null
    });

    function fetchData() {
        new Promise((resolve, reject) => {
            setTimeout(() => {
                (Promise as any).allSettled(
                    options.query.map(d =>
                        fetch(
                            `${FetchConstants.hostname}${
                                d.endpoint
                            }${generateQueryString(d.params)}`
                        )
                    )
                );

                resolve(data);
            }, 500);
            setTimeout(() => {
                reject(fetchErrorMessages.timeout);
            }, 10000);
        })
            .then(d => {
                setState({
                    loading: false,
                    data: d,
                    error: null
                });
            })
            .catch(error => {
                setState({
                    loading: false,
                    error,
                    data: null
                });
            });
    }

    useEffect(() => {
        if (options.refetch !== 0) {
            setState({ loading: true, data: null, error: null });
            fetchData();
        }
    }, [options.refetch]);

    useEffect(() => {
        fetchData();
    }, []);
    return { ...state };
}
