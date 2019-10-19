import React from 'react';
import Menu from './Menu';
import Switch from './Switch';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <Menu />
            <Switch />
        </div>
    );
};

export default Dashboard;
