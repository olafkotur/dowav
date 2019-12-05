import React, { useState } from "react";
import { toast } from "react-toastify";

const StringInput: React.FC<{ reload: any }> = ({ reload }) => {
  const [name, setName] = useState("");
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "15px",
          background: "rgba(0, 0, 0, 0.1)",
          alignItems: "center"
        }}
      >
        <label>Plant Name</label>
        <input
          type="text"
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
        />
      </div>
      <button
        onClick={async () => {
          const response = await fetch(
            "https://dowav-api.herokuapp.com/api/setting/create",
            {
              method: "POST",
              body: JSON.stringify({
                zone: 1,
                plant: name,
                shouldSendTweets: true,
                minTemperature: 18,
                maxTemperature: 35,
                minLight: 20,
                maxLight: 225,
                minMoisture: 50,
                bulbBrightness: 255,
                bulbColor: "#fff"
              })
            }
          );
          if (response.status === 200) {
            toast("Plant successfully created.", {
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
        Create
      </button>
    </>
  );
};

export default StringInput;
