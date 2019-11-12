import React, { useState } from "react";
import "./main.scss";
import Dashboard from "./components/Dashboard";
import NavigationContext from "./context/NavigationContext";
import { TEMPERATURE } from "./constants/MenuOptionConstants";

const App: React.FC = () => {
  const [navigation, setNavigation] = useState(TEMPERATURE);

  return (
    <NavigationContext.Provider
      value={{
        currentOption: navigation,
        setCurrentOption: s => {
          setNavigation(s);
        }
      }}
    >
      <Dashboard />
    </NavigationContext.Provider>
  );
};

export default App;
