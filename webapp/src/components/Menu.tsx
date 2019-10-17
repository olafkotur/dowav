import React from 'react';
import { MdDashboard, MdSettings } from 'react-icons/md';
import { FaTemperatureLow, FaTwitter } from 'react-icons/fa';
import { IoIosWater } from 'react-icons/io';
import { GoPerson, GoLightBulb } from 'react-icons/go';

interface IMenuOption {
    name: string;
    indented: boolean;
    icon: any;
}

const iconColor = 'white';

const menuOptions: Array<IMenuOption> = [
    {
        name: 'Dashboard',
        indented: false,
        icon: <MdDashboard size={20} color={iconColor} />
    },
    {
        name: 'Temperature',
        indented: true,
        icon: <FaTemperatureLow size={20} color={iconColor} />
    },
    {
        name: 'Moisture',
        indented: true,
        icon: <IoIosWater size={20} color={iconColor} />
    },
    {
        name: 'Light',
        indented: true,
        icon: <GoLightBulb size={20} color={iconColor} />
    },
    {
        name: 'Movement',
        indented: true,
        icon: <GoPerson size={20} color={iconColor} />
    },
    {
        name: 'Twitter',
        indented: false,
        icon: <FaTwitter size={20} color={iconColor} />
    },
    {
        name: 'Settings',
        indented: false,
        icon: <MdSettings size={20} color={iconColor} />
    }
];

const Menu: React.FC = () => {
    return (
        <div className="menu">
            {menuOptions.map((option: IMenuOption) => {
                return (
                    <div className="item">
                        <div
                            className={`icon ${
                                option.indented ? 'indent' : ''
                            }`}
                        >
                            {option.icon}
                        </div>
                        <div className="text">{option.name}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Menu;
