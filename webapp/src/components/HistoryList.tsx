import React, { useContext } from "react";
import moment from "moment";
import LocationDataContext from "../context/LocationDataContext";

const HistoryList: React.FC = () => {
  const { data } = useContext(LocationDataContext);
  return (
    <div className="history-list">
      <h1>History</h1>
      <h4>Last 24 hours</h4>
      <div className="historic-item-list">
        {data.map((d, i) => {
          if (d.value === 0)
            return (
              <div
                key={d.time + " - " + i}
                className="historic-item"
                style={{ background: `rgb(120, 120, 120)` }}
              >{`${moment(d.time).format("D MMM HH:mm:ss")} - No Location
        `}</div>
            );
          let val = 255 - (d.value - 1) * 30;
          return (
            <div
              key={d.time + " - " + i}
              className="historic-item"
              style={{ background: `rgb(${val}, ${val}, ${val})` }}
            >{`${moment(d.time).format("D MMM HH:mm:ss")} - Zone ${
              d.value
            }`}</div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryList;
