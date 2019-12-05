import React, { useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import Menu from "./Menu";
import Switch from "./Switch";
import { Notification } from "../types";
import "react-toastify/dist/ReactToastify.css";
import SettingsContext from "../context/SettingsContext";

const Dashboard: React.FC = () => {
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    if (settings.showNotifications.value) {
      let ws = new WebSocket("ws://dowav-api.herokuapp.com/api/notifications");
      console.log(settings);
      if (ws) {
        ws.onmessage = function(event) {
          let json: Notification = JSON.parse(event.data);
          toast(json.message, {
            type: json.type
          });
        };
      }

      return () => {
        ws.close();
      };
    }
  }, [settings]);

  return (
    <div className="dashboard">
      <Menu />
      <Switch />
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
