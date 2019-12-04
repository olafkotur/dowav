import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../styled/Loader";
import ErrorMessage from "../../errors/ErrorMessage";
import moment from "moment";

type Notification = {
  type: string;
  message: string;
  time: number;
};

const Notifications: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const { data, loading, error } = useFetch({
    query: { endpoint: "/api/notification/all" },
    refetch: counter,
    useCache: false
  });

  return (
    <div className="notification-list">
      {loading ? (
        <Loader size={{ width: "100%", height: "200" }} />
      ) : error ? (
        <ErrorMessage
          error={{
            title: "Something happened.",
            message: "Please try later.",
            actions: ["refetch"]
          }}
          onRefetch={setCounter}
        />
      ) : data !== null && data.length > 0 ? (
        data.reverse().map((d: Notification) => {
          return (
            <div className={`notification-box ${d.type}`}>
              <h4 style={{ textTransform: "capitalize", marginTop: 0 }}>
                {d.type}
              </h4>
              <p>{d.message}</p>
              <p
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 0
                }}
              >
                {moment(d.time * 1000).fromNow()}
              </p>
            </div>
          );
        })
      ) : (
        <h1>No data at the moment</h1>
      )}
    </div>
  );
};

export default Notifications;
