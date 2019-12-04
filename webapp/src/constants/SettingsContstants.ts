import { SettingsState } from "../types";

const initialSettings: SettingsState = {
  showNotifications: {
    value: true,
    label: "Show notifications",
    type: "checkbox"
  }
};

export const cacheKey = "dowav-settings-v1.0.0";

export default initialSettings;
