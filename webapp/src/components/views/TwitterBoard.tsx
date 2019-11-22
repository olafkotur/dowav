import React, { ReactElement, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../styled/Loader";
import moment from "moment";
import InputTwitter from "../InputTweeter";
import Tweet from "../Tweet";

const TwitterBoard: React.FC = () => {
  const { data, loading, error } = useFetch({
    query: {
      endpoint: "/api/tweets"
    },
    useCache: false,
    refetch: 0
  });
  const [filter, setFilter] = useState<Function | null>(null);
  console.log(filter);
  return (
    <div className="twitter-board">
      {loading ? (
        <Loader size={{ width: "100%", height: "100%" }} />
      ) : error ? null : data && data.length ? (
        <div className="tweets">
          <div className="control">
            <h2>Tweets</h2>
            <InputTwitter setFilter={setFilter} />
          </div>
          <div className="card-list">
            {filter
              ? data.filter(filter).map((d: any) => {
                  return <Tweet data={d} />;
                })
              : data.map((d: any) => {
                  return <Tweet data={d} />;
                })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TwitterBoard;
