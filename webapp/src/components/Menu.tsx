import React, { useContext } from "react";
import { MdDashboard, MdSettings, MdLocationSearching } from "react-icons/md";
import { FaTemperatureLow, FaTwitter } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { GoLightBulb } from "react-icons/go";
import { GiWateringCan } from "react-icons/gi";
import * as MENU_OPTIONS from "../constants/MenuOptionConstants";
import NavigationContext from "../context/NavigationContext";

interface IMenuOption {
  name: string;
  indented: boolean;
  icon: any;
}

const iconColor = "white";

export const menuOptions: Array<IMenuOption> = [
  {
    name: MENU_OPTIONS.DASHBOARD,
    indented: false,
    icon: <MdDashboard size={20} color={iconColor} />
  },
  {
    name: MENU_OPTIONS.TEMPERATURE,
    indented: true,
    icon: <FaTemperatureLow size={20} color={iconColor} />
  },
  {
    name: MENU_OPTIONS.MOISTURE,
    indented: true,
    icon: <IoIosWater size={20} color={iconColor} />
  },
  {
    name: MENU_OPTIONS.LIGHT,
    indented: true,
    icon: <GoLightBulb size={20} color={iconColor} />
  },
  {
    name: MENU_OPTIONS.MOVEMENT,
    indented: true,
    icon: <MdLocationSearching size={20} color={iconColor} />
  },
  {
    name: MENU_OPTIONS.WATERING_CAN,
    indented: true,
    icon: <GiWateringCan size={20} color={iconColor} />
  },
  {
    name: MENU_OPTIONS.TWITTER,
    indented: false,
    icon: <FaTwitter size={20} color={iconColor} />
  },
  {
    name: MENU_OPTIONS.SETTINGS,
    indented: false,
    icon: <MdSettings size={20} color={iconColor} />
  }
];

const Menu: React.FC = () => {
  const { currentOption, setCurrentOption } = useContext(NavigationContext);
  return (
    <div className="menu">
      {menuOptions.map((option: IMenuOption) => {
        return (
          <div
            key={option.name}
            className={`item  ${
              option.name === currentOption ? "selected" : ""
            }`}
            onClick={() => {
              if (currentOption !== option.name) setCurrentOption(option.name);
            }}
          >
            <div className={`icon ${option.indented ? "indent" : ""}`}>
              {option.icon}
            </div>
            <div className={`text`}>{option.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
