import React, { useState, useEffect } from "react";
import "./main.scss";
import Dashboard from "./components/Dashboard";
import NavigationContext from "./context/NavigationContext";
import SettingsContext from "./context/SettingsContext";
import { SettingsState } from "./types";
import initialSettings, { cacheKey } from "./constants/SettingsContstants";
import {
  TEMPERATURE,
  TWITTER,
  SETTINGS
} from "./constants/MenuOptionConstants";

function getSettings(): SettingsState {
  let cache = window.localStorage.getItem(cacheKey);
  if (!cache) {
    window.localStorage.setItem(cacheKey, JSON.stringify(initialSettings));
    return initialSettings;
  } else {
    return JSON.parse(cache);
  }
}

const App: React.FC = () => {
  const [navigation, setNavigation] = useState(SETTINGS);
  const [settings, setSettings] = useState<SettingsState>(getSettings());

  useEffect(() => {}, []);

  return (
    <NavigationContext.Provider
      value={{
        currentOption: navigation,
        setCurrentOption: s => {
          setNavigation(s);
        }
      }}
    >
      <SettingsContext.Provider
        value={{
          settings,
          setSettings: (key, value) => {
            const newState = {
              ...settings,
              [key]: { ...settings[key], value: value }
            };
            setSettings(newState);
            window.localStorage.setItem(cacheKey, JSON.stringify(newState));
          }
        }}
      >
        <Dashboard />
      </SettingsContext.Provider>
    </NavigationContext.Provider>
  );
};

export default App;
