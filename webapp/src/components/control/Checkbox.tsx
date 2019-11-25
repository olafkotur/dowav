import React from "react";

type CheckboxProps = {
  value: boolean;
  label: string;
  onChange: Function;
};

const Checkbox: React.FC<CheckboxProps> = ({ value, label, onChange }) => {
  return (
    <div className="checkbox-bar">
      <label>{label}</label>
      <input
        className="switch-checkbox"
        type="checkbox"
        checked={value}
        onChange={e => {
          console.log(e.target.checked);
          onChange(e.target.checked);
        }}
      />
    </div>
  );
};

export default Checkbox;
