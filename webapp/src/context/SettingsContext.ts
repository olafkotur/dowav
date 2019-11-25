import React from "react";
import { SettingsState } from "../types";
import initialSettings from "../constants/SettingsContstants";

type SettingsContext = {
  settings: SettingsState;
  setSettings(key: string, value: any): void;
};

export default React.createContext<SettingsContext>({
  settings: initialSettings,
  setSettings: n => {
    throw new Error("setSettings() not implemented.");
  }
});
