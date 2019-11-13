import React from "react";
import styled, { keyframes } from "styled-components";
import { IViewport } from "../../types";
import d3Colors from "../../d3/d3Colors";
import * as MENU_OPTIONS from "../../constants/MenuOptionConstants";

const rotate = keyframes`
    0%{
        stroke-dashoffset: 290;
    }
    50%{
        stroke-dashoffset: 50;
    }
    100%{
        stroke-dashoffset: 290;
    }
`;

const Circle = styled.circle`
  cx: 50%;
  cy: 50%;
  r: 50;
  fill: none;
  stroke-width: 10px;
  stroke-dasharray: 160;
  transform-origin: 50% 50%;
  animation: ${rotate} 2s ease infinite;
`;

type LoaderProps = {
  size: IViewport | { width: number | string; height: number | string };
  currentOption?: string;
};

const Loader: React.FC<LoaderProps> = ({
  size,
  currentOption = MENU_OPTIONS.LIGHT
}) => {
  return (
    <svg
      stroke={d3Colors[currentOption][1]}
      width={size.width}
      height={size.height}
      className="loader"
    >
      <Circle />
    </svg>
  );
};

export default Loader;
