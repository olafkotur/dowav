import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Menu from "./Menu";
import Switch from "./Switch";
import { Notification } from "../types";
import "react-toastify/dist/ReactToastify.css";

const Dashboard: React.FC = () => {
  useEffect(() => {
    let ws = new WebSocket("ws://localhost:8080/api/notifications");

    ws.onmessage = function(event) {
      let json: Notification = JSON.parse(event.data);
      toast(json.message, {
        type: json.type
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="dashboard">
      <Menu />
      <Switch />
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
