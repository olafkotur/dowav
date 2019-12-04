import React, { useState, useEffect } from "react";
import Select from "react-select";
import Checkbox from "./control/Checkbox";
import Range from "./control/Range";
import { PlantSettings } from "../types";
import { toast } from "react-toastify";
import StringInput from "./control/StringInput";
import ColorPicker from "./control/ColorPicker";

const typeToLabel: { [key: string]: string } = {
  zone: "Zone",
  shouldSendTweets: "Should send Tweets",
  minTemperature: "Temperature minimum threshold",
  maxTemperature: "Temperature maximum threshold",
  minMoisture: "Moisture minimum threshold",
  maxMoisture: "Moisture maximum threshold",
  minLight: "Light minimum threshold",
  maxLight: "Light maximum threshold",
  bulbBrightness: "Bulb Brightness",
  bulbColor: "Bulb Color"
};

type ServerSettingsProps = {
  settings: PlantSettings[];
  reload: any;
};

function createControls(settings: PlantSettings | null, set: any) {
  if (!settings) return null;
  const keys = Object.keys(settings);
  const isZone = keys.includes("zone");
  if (!isZone) {
    keys.push("zone");
  }
  return keys
    .map(k => {
      const t = settings[k];
      if (k === "zone" && t === undefined) {
        return (
          <Range
            key={k}
            value={0}
            label={typeToLabel.zone}
            onChange={(newVal: any) => set(+newVal, k)}
          />
        );
      }
      if (k === "plant") {
        return undefined;
      }
      switch (typeof t) {
        case "boolean": {
          return (
            <Checkbox
              key={k}
              value={settings[k]}
              label={typeToLabel[k]}
              onChange={(newVal: any) => set(newVal, k)}
            />
          );
        }
        case "number": {
          return (
            <Range
              key={k}
              value={settings[k]}
              label={typeToLabel[k]}
              onChange={(newVal: any) => set(+newVal, k)}
            />
          );
        }
        case "string": {
          return (
            <ColorPicker
              key={k}
              value={settings[k]}
              label={typeToLabel[k]}
              onChange={(newVal: any) => set(newVal, k)}
            />
          );
        }
        default: {
          return undefined;
        }
      }
    })
    .filter(k => k);
}

const ServerSettings: React.FC<ServerSettingsProps> = ({
  settings,
  reload
}) => {
  const [tempState, setTempState] = useState(settings);
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);
  const selected = selectedPlant
    ? tempState.filter(d => d.plant === selectedPlant.value)[0]
    : null;

  useEffect(() => {
    setTempState(settings);
  }, [settings]);

  console.log(settings);
  console.log(tempState);
  return (
    <>
      <Select
        value={selectedPlant}
        className="select-setting"
        onChange={setSelectedPlant}
        options={[
          ...tempState.map(s => {
            return {
              value: s.plant,
              label: s.plant + (s.zone ? " - Zone " + s.zone : "")
            };
          }),
          { value: "New", label: "New" }
        ]}
      />
      {selectedPlant && selectedPlant.value === "New" ? (
        <StringInput reload={reload} />
      ) : selected ? (
        <>
          {createControls(selected, (val: any, key: string) => {
            const copy = [...tempState];
            const num = copy.findIndex(c => c.plant === selected.plant);
            copy[num] = { ...copy[num], [key]: val };
            console.log(val, key);
            setTempState(copy);
          })}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            {JSON.stringify(tempState) !== JSON.stringify(settings) ? (
              <button
                onClick={async () => {
                  const response = await fetch(
                    "https://dowav-api.herokuapp.com/api/setting",
                    {
                      method: "POST",
                      body: JSON.stringify([selected])
                    }
                  );
                  if (response.status === 200) {
                    toast("Settings successfully saved.", {
                      type: "success"
                    });
                    reload();
                  } else {
                    toast("Something wrong", {
                      type: "error"
                    });
                  }
                }}
              >
                Save
              </button>
            ) : null}

            <button
              className="delete"
              onClick={async () => {
                // eslint-disable-next-line no-restricted-globals
                const r = confirm(
                  "Are you sure you want to delete " + selected.plant
                );
                if (r) {
                  const response = await fetch(
                    "https://dowav-api.herokuapp.com/api/setting/delete/" +
                      selected.plant
                  );
                  if (response.status === 200) {
                    toast("Successfully deleted.", {
                      type: "success"
                    });
                    reload();
                  } else {
                    toast("Can't delete. Someting went wrong.", {
                      type: "error"
                    });
                  }
                }
              }}
            >
              Delete
            </button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ServerSettings;
