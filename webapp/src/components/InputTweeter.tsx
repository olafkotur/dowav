import React, { useState, useCallback } from "react";

function throtleOnChange() {
  let time = Date.now();
  let id = -1;
  return (
    e: React.ChangeEvent<HTMLInputElement>,
    setFilter: React.Dispatch<React.SetStateAction<Function | null>>
  ) => {
    const now = Date.now();
    if (now - time > 800) {
      time = now;
      clearTimeout(id);
      const val = e.target.value;
      const arr = val
        .split(" ")
        .filter((d: string) => d.charAt(0) === "#")
        .map(d => d.slice(1));
      setFilter((prev: any) => (d: any) => {
        return d.entities.hashtags.some((e: any) => arr.includes(e.text));
      });
    } else {
      e.persist();
      clearTimeout(id);
      id = setTimeout(() => {
        time = Date.now();
        const val = e.target.value;
        const arr = val
          .split(" ")
          .filter((d: string) => d.charAt(0) === "#")
          .map(d => d.slice(1));
        setFilter((prev: any) => (d: any) => {
          return d.entities.hashtags.some((e: any) => arr.includes(e.text));
        });
      }, 800);
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
        setValue(e.target.value);
        onChange(e, setFilter);
      }}
    />
  );
};

export default InputTwitter;
