import React, { useRef, useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { IViewport, LocationData } from "../../types";
import HistoryList from "../HistoryList";
import Lab3DModel from "../Lab3DModel";
import LocationDataContext from "../../context/LocationDataContext";
import Loader from "../styled/Loader";
import ErrorMessage from "../../errors/ErrorMessage";

const MovementView: React.FC = () => {
  const [count, setCount] = useState(0);
  const [savedData, setSavedData] = useState<LocationData[]>([]);
  const [size, setSize] = useState<IViewport | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { loading, data, error } = useFetch({
    useCache: false,
    query: {
      endpoint: `/api/location/historic`
    },
    refetch: count
  });
  const updateSize = () => {
    if (ref.current) {
      let viewport = ref.current.getBoundingClientRect();
      setSize({ width: viewport.width, height: viewport.height });
    }
  };

  useEffect(() => {
    if (ref.current) {
      updateSize();
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [ref.current]);

  useEffect(() => {
    if (data) {
      setSavedData(data);
    }
  }, [data]);

  return (
    <div ref={ref} className="movement-view">
      {size ? (
        <>
          <LocationDataContext.Provider
            value={{
              data: savedData,
              appendData: d => {
                if (savedData.length === 0) {
                  setSavedData(prev => {
                    return [...prev, d];
                  });
                } else {
                  let last = savedData[savedData.length - 1];
                  if (last.time < d.time) {
                    setSavedData(prev => {
                      return [...prev, d];
                    });
                  }
                }
              }
            }}
          >
            <Lab3DModel viewport={{ ...size, width: size.width - 250 }} />
            {loading ? (
              <Loader size={{ width: 250, height: "100%" }} />
            ) : error ? (
              <ErrorMessage
                error={{
                  title: "Something bad happened.",
                  message:
                    "We can't get location data at the moment. Please try later."
                }}
                size={{ width: 250, height: "100%" }}
              />
            ) : data ? (
              <HistoryList />
            ) : null}
          </LocationDataContext.Provider>
        </>
      ) : null}
    </div>
  );
};

export default MovementView;
