import React from "react";

type RangeProps = {
  value: number;
  label: string;
  onChange: any;
};

const Range: React.FC<RangeProps> = ({ value, label, onChange }) => {
  return (
    <div className="checkbox-bar">
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default Range;
