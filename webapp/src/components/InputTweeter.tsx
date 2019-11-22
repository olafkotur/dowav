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

    if (now - time > 500) {
      time = now;
      clearTimeout(id);
      createFilterFunc();
    } else {
      e.persist();
      clearTimeout(id);
      id = setTimeout(() => {
        time = Date.now();
        createFilterFunc();
      }, 500);
    }
  };
}

type InputTwitterProps = {
  setFilter: React.Dispatch<React.SetStateAction<Function | null>>;
};

const InputTwitter: React.FC<InputTwitterProps> = ({ setFilter }) => {
  const [value, setValue] = useState("");
  const onChange = useCallback(throtleOnChange(), []);
  return (
    <input
      placeholder="Ask a question or filter using #"
      value={value}
      onChange={e => {
        const val = e.target.value;
        setValue(val);
        if (val === "") {
          setFilter(null);
        } else {
          onChange(e, setFilter);
        }
      }}
    />
  );
};

export default InputTwitter;
