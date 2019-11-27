import React, { useContext, useState, useEffect } from "react";
import { SettingsState } from "../../types";
import Checkbox from "../control/Checkbox";
import SettingsContext from "../../context/SettingsContext";
import useFetch from "../../hooks/useFetch";
import Range from "../control/Range";
import { toast } from "react-toastify";

type FetchedSettings = { time: number; type: string; value: any };

const typeToLabel: { [key: string]: string } = {
  minTemperature: "Temperature minimum threshold",
  maxTemperature: "Temperature maximum threshold",
  minMoisture: "Moisture minimum threshold",
  maxMoisture: "Moisture maximum threshold",
  minLight: "Light minimum threshold",
  maxLight: "Light maximum threshold"
};

function compare(
  initial: FetchedSettings[],
  newState: SettingsState,
  callback?: any
) {
  let result = true;

  initial.forEach(i => {
    const val =
      i.value === "true"
        ? true
        : i.value === "false"
        ? false
        : parseInt(i.value);
    if (newState[i.type].value !== val) {
      result = false;
      if (callback !== undefined) {
        callback(i.type, newState[i.type].value);
      }
    }
  });
  return result;
}

const Settings: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const { settings, setSettings } = useContext(SettingsContext);
  const [serverSettings, setServerSettings] = useState<SettingsState | null>(
    null
  );
  const { data } = useFetch({
    useCache: false,
    query: { endpoint: "/api/setting/all" },
    refetch: counter
  });

  function createControls(settings: SettingsState | null, set: any) {
    if (!settings) return null;
    const keys = Object.keys(settings);

    return keys.map(k => {
      const t = settings[k].type;
      switch (t) {
        case "checkbox": {
          return (
            <Checkbox
              value={settings[k].value}
              label={settings[k].label}
              onChange={(newVal: any) => set(k, newVal)}
            />
          );
        }
        case "range": {
          return (
            <Range
              label={settings[k].label}
              value={settings[k].value}
              onChange={(newVal: any) => set(k, +newVal)}
            />
          );
        }
      }
    });
  }

  useEffect(() => {
    if (data) {
      const newObj = {};
      (data as FetchedSettings[]).forEach((f: FetchedSettings) => {
        switch (f.type) {
          case "shouldSendTweets": {
            Object.assign(newObj, {
              [f.type]: {
                value: f.value === "true",
                type: "checkbox",
                label: "Server sends Tweets"
              }
            });
            break;
          }
          default: {
            Object.assign(newObj, {
              [f.type]: {
                value: parseInt(f.value),
                type: "range",
                label: typeToLabel[f.type]
              }
            });
          }
        }
      });
      setServerSettings(newObj as SettingsState);
    }
  }, [data]);

  return (
    <div className="settings">
      <div className="column">
        <h2>Web Application</h2>
        {createControls(settings, setSettings)}
      </div>
      <div className="column">
        <h2>Server Side</h2>
        {serverSettings ? (
          <>
            {createControls(serverSettings, (key: any, value: any) => {
              const newState = {
                ...serverSettings,
                [key]: { ...serverSettings[key], value: value }
              };
              setServerSettings(newState);
            })}
            <button
              onClick={e => {
                compare(
                  data,
                  serverSettings,
                  async (key: string, value: any) => {
                    const data = new URLSearchParams();
                    data.append("type", key);
                    data.append("value", value);
                    const response = await fetch(
                      "https://dowav-api.herokuapp.com/api/setting",
                      { method: "POST", body: data }
                    );
                    if (response.status === 200) {
                      toast(`${key} field was successfully saved.`, {
                        type: "success"
                      });
                    } else {
                      toast("Something wrong", {
                        type: "error"
                      });
                    }
                  }
                );
              }}
              disabled={compare(data, serverSettings)}
            >
              Save
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Settings;
