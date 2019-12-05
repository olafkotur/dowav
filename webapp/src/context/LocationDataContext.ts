import React from "react";
import { LocationData } from "../types";

type LocationDataContext = {
  data: LocationData[];
  appendData(data: LocationData): void;
};

export default React.createContext<LocationDataContext>({
  data: [],
  appendData: n => {
    throw new Error("appenData() not implemented.");
  }
});
