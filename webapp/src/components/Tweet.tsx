import React, { ReactElement } from "react";
import moment from "moment";

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

type TweetProps = {
  data: any;
};

const Tweet: React.FC<TweetProps> = ({ data }) => {
  return (
    <div key={data.created_at} className="tweet">
      <div className="tweet-header">
        <img src={data.user.profile_image_url} width="24px" height="24px" />
        <h4>{data.user.name}</h4>
        <p>@{data.user.screen_name}</p>
      </div>
      <div className="body">
        <p>{highlightHashtags(data)}</p>
      </div>
      <div className="footer">
        <p className="time">{moment(data.created_at).fromNow()}</p>
      </div>
    </div>
  );
};

export default Tweet;
