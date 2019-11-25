import React, { useContext } from "react";
import { SettingsState } from "../../types";
import Checkbox from "../control/Checkbox";
import SettingsContext from "../../context/SettingsContext";

const Settings: React.FC = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  function createControls(settings: SettingsState | null) {
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
              onChange={(newVal: any) => setSettings(k, newVal)}
            />
          );
        }
      }
    });
  }

  return <div className="settings">{createControls(settings)}</div>;
};

export default Settings;
