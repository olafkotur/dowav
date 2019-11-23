import React, { useContext } from "react";
import NavigationContext from "../context/NavigationContext";
import * as MENU_OPTIONS from "../constants/MenuOptionConstants";
import DashboardView from "./views/DashboardView";
import GraphView from "./views/GraphView";
import TwitterBoard from "./views/TwitterBoard";
import MovementView from "./views/MovementView";
import { IoIosConstruct } from "react-icons/io";

const Switch: React.FC = () => {
  const { currentOption } = useContext(NavigationContext);

  let component = null;
  switch (currentOption) {
    // case MENU_OPTIONS.DASHBOARD:
    //   component = <DashboardView />;
    //   break;
    case MENU_OPTIONS.TEMPERATURE:
    case MENU_OPTIONS.MOISTURE:
    case MENU_OPTIONS.LIGHT:
      component = (
        <GraphView key={currentOption} currentOption={currentOption} />
      );
      break;
    case MENU_OPTIONS.MOVEMENT:
      component = <MovementView />;
      break;
    case MENU_OPTIONS.TWITTER:
      component = <TwitterBoard />;
      break;
    default:
      component = (
        <div className="not-implemented">
          <h1>This page is under construction</h1>
          <IoIosConstruct size={180} />
        </div>
      );
  }

  return <div className="switch">{component}</div>;
};

export default Switch;
