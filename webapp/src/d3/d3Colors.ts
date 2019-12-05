import * as MENU_OPTIONS from "../constants/MenuOptionConstants";

interface ID3Colors {
  [key: string]: string[];
}

const d3Colors: ID3Colors = {
  [MENU_OPTIONS.TEMPERATURE]: ["#FF3D3D", "#ff7521", "#ffa500"],
  [MENU_OPTIONS.MOISTURE]: ["#125D92", "#3AD8FC", "#88F9FE"],
  [MENU_OPTIONS.LIGHT]: ["#EFEFEF", "#D1D1D1", "#574A4B"],
  ["water-data"]: ["#125D92", "#3AD8FC", "#88F9FE"]
};

export default d3Colors;
