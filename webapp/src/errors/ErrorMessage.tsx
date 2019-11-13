import React from "react";
import { FetchError, IViewport } from "../types";
import { IoIosRefresh } from "react-icons/io";

const ErrorMessage: React.FC<{
  error: FetchError;
  onRefetch?: any;
  size?: { width: number | string; height: number | string };
}> = ({
  error,
  onRefetch = () => console.warn("You haven't passed a fucntion"),
  size = { width: "100%", height: "100%" }
}) => {
  return (
    <div className="error-box" style={{ ...size }}>
      <h1>{error.title}</h1>
      <p>{error.message}</p>
      {error && error.actions && error.actions.includes("refetch") ? (
        <div>
          <IoIosRefresh
            size="40"
            color="white"
            className="refetch-icon"
            onClick={onRefetch}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ErrorMessage;
