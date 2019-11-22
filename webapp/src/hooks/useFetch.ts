/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { UseFetchState } from "../types/index";
import { fetchErrorMessages } from "../errors/errors";
import FetchConstants from "../constants/FetchConstants";

function checkCache(key: string): any | null {
  const lastFetched = window.localStorage.getItem(key + "lastFetched");
  if (
    lastFetched &&
    moment(+lastFetched).isAfter(moment().add(-5, "minutes"))
  ) {
    const cache = window.localStorage.getItem(key);
    if (cache) return JSON.parse(cache);
  }
  return null;
}

type Params = {
  [key: string]: string | number;
};

type Options = {
  useCache: boolean;
  query: {
    endpoint: string;
    params?: Params;
  };
  refetch: number;
};

function generateQueryString(params: Params | undefined): string {
  if (params === undefined) return "";
  const keys = Object.keys(params);
  if (keys.length === 0) return "";
  let string = "?";
  for (let i = 0; i < keys.length; i++) {
    string += `${keys[i]}=${params[keys[i]]}${
      i === keys.length - 1 ? "" : "&"
    }`;
  }
  return string;
}

export default function useFetch(options: Options): UseFetchState {
  const cache = options.useCache ? checkCache(options.query.endpoint) : null;
  const [state, setState] = useState<UseFetchState>({
    loading: cache ? false : true,
    data: cache || null,
    error: null
  });

  function fetchData() {
    new Promise(async (resolve, reject) => {
      const time = Date.now();
      const id = setTimeout(() => {
        reject(fetchErrorMessages.timeout);
      }, 10000);
      try {
        const response = await fetch(
          `${FetchConstants.hostname}${
            options.query.endpoint
          }${generateQueryString(options.query.params)}`
        );
        const json = await response.json();
        clearTimeout(id);
        if (json === null) reject(fetchErrorMessages.noData);
        if (options.useCache) {
          window.localStorage.setItem(
            options.query.endpoint,
            JSON.stringify(json)
          );
          window.localStorage.setItem(
            options.query.endpoint + "lastFetched",
            Date.now() + ""
          );
        }
        if (Date.now() - time > 500) {
          resolve(json);
        } else {
          setTimeout(() => {
            resolve(json);
          }, Date.now() - time);
        }
      } catch (err) {
        reject(fetchErrorMessages.fetchFail);
      }
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
      if (options.useCache) {
        const data = checkCache(options.query.endpoint);
        if (data) {
          setState({ loading: false, data, error: null });
        } else {
          setState({ loading: true, data: null, error: null });
          fetchData();
        }
      } else {
        setState({ loading: true, data: null, error: null });
        fetchData();
      }
    }
    // eslint:
  }, [options.refetch]);

  useEffect(() => {
    if (!cache) {
      fetchData();
    }
  }, []);
  return { ...state };
}
