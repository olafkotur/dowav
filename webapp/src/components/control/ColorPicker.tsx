import React from "react";

type ColorPickerProps = {
  value: string;
  label: string;
  onChange: Function;
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange
}) => {
  return (
    <div className="checkbox-bar">
      <label>{label}</label>
      <input
        className="color-picker"
        type="color"
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default ColorPicker;
