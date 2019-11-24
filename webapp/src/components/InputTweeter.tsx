import React, { useState, useCallback } from "react";

function throtleOnChange() {
  let time = Date.now();
  let id = -1;
  return (
    e: React.ChangeEvent<HTMLInputElement>,
    setFilter: React.Dispatch<React.SetStateAction<Function | null>>
  ) => {
    const now = Date.now();

    function createFilterFunc() {
      const val = e.target.value;
      const arr = val
        .split(" ")
        .filter((d: string) => d.charAt(0) === "#")
        .map(str => str.slice(1));
      setFilter((prev: any) => (tweet: any) => {
        return tweet.entities.hashtags.some((tag: any) => {
          let regex = arr.map(str => new RegExp(str, "g"));
          return regex.some(reg => (tag.text as string).match(reg));
        });
      });
    }

    if (now - time > 300) {
      time = now;
      clearTimeout(id);
      createFilterFunc();
    } else {
      e.persist();
      clearTimeout(id);
      id = setTimeout(() => {
        time = Date.now();
        createFilterFunc();
      }, 300);
    }
  };
}

type InputTwitterProps = {
  setFilter: React.Dispatch<React.SetStateAction<Function | null>>;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
};

const InputTwitter: React.FC<InputTwitterProps> = ({
  setFilter,
  setCounter
}) => {
  const [value, setValue] = useState("");
  const [send, setSend] = useState(false);
  const onChange = useCallback(throtleOnChange(), []);
  return (
    <div className="input-bar">
      <input
        placeholder="Ask a question or filter using #"
        value={value}
        onChange={e => {
          const val = e.target.value;
          setValue(val);
          if (val.includes("#")) {
            onChange(e, setFilter);
            if (send) setSend(false);
          } else if (val.charAt(val.length - 1) === "?") {
            setSend(true);
          } else {
            if (send) setSend(false);
            setTimeout(() => setFilter(null), 300);
          }
        }}
      />
      <button
        className="question-send"
        disabled={!send}
        onClick={async () => {
          const data = new URLSearchParams();
          data.append("message", value);
          let response = await fetch(
            "https://dowav-api.herokuapp.com/api/tweet/question",
            {
              method: "POST",
              body: data
            }
          );
          if (response.status === 200) {
            setCounter(prev => prev + 1);
          } else {
            // TODO: error handler.
          }
        }}
      >
        Ask
      </button>
    </div>
  );
};

export default InputTwitter;
