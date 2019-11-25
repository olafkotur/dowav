import React, { ReactElement, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../styled/Loader";
import moment from "moment";
import InputTwitter from "../InputTweeter";
import Tweet from "../Tweet";

const TwitterBoard: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const { data, loading, error } = useFetch({
    query: {
      endpoint: "/api/tweets"
    },
    useCache: false,
    refetch: counter
  });
  const [filter, setFilter] = useState<Function | null>(null);
  const filterData = filter
    ? data.filter(filter).map((d: any) => {
        return <Tweet key={d.time} data={d} />;
      })
    : null;
  return (
    <div className="twitter-board">
      {loading ? (
        <Loader size={{ width: "100%", height: "100%" }} />
      ) : error ? null : data && data.length ? (
        <div className="tweets">
          <div className="control">
            <h2>Tweets</h2>
            <InputTwitter setFilter={setFilter} setCounter={setCounter} />
            {filterData ? (
              <p className="stats">{`${filterData.length} out of ${data.length} shown.`}</p>
            ) : null}
          </div>
          <div className="card-list">
            {filterData
              ? filterData
              : data.map((d: any) => {
                  return <Tweet key={d.time} data={d} />;
                })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TwitterBoard;
