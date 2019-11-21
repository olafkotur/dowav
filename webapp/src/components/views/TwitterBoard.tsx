import React, { ReactElement, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../styled/Loader";
import moment from "moment";
import InputTwitter from "../InputTweeter";

function highlightHashtags(data: any): ReactElement {
  const { hashtags } = data.entities;
  if (hashtags.length === 0) return data.text;

  let text: any[] = [];
  hashtags.forEach((d: any, i: number, arr: any[]) => {
    text.push(
      i === 0
        ? data.text.slice(0, d.indices[0])
        : data.text.slice(arr[i - 1].indices[1], d.indices[0])
    );
    text.push(
      <span className="hashtag">
        {data.text.slice(d.indices[0], d.indices[1])}
      </span>
    );
    if (i === arr.length - 1) text.push(data.text.slice(d.indices[1]));
  });
  return <span>{text}</span>;
}

const TwitterBoard: React.FC = () => {
  const { data, loading, error } = useFetch({
    query: {
      endpoint: "/api/tweets"
    },
    useCache: false,
    refetch: 0
  });
  const [filter, setFilter] = useState<Function | null>(null);
  if (filter) console.log(data.filter(filter));
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
            {data.map((d: any) => {
              return (
                <div key={d.created_at} className="tweet">
                  <div className="tweet-header">
                    <img
                      src={d.user.profile_image_url}
                      width="24px"
                      height="24px"
                    />
                    <h4>{d.user.name}</h4>
                    <p>@{d.user.screen_name}</p>
                  </div>
                  <div className="body">
                    <p>{highlightHashtags(d)}</p>
                  </div>
                  <div className="footer">
                    <p className="time">{moment(d.created_at).fromNow()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TwitterBoard;
