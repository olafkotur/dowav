import React, { useEffect, useState } from 'react';
import { UseFetchState } from '../types/index';
import data from '../data/mockdata';
import { fetchErrorMessages } from '../errors/errors';

function checkCache(key: string): any | null {
    const cache = window.localStorage.getItem(key);
    if (cache) return JSON.parse(cache);
    return null;
}

type Options = {
    useCache: boolean;
    refetch: number;
};

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
