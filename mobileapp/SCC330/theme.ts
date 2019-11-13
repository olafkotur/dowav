import { ViewStyle } from "react-native";

const liveBtnContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
}

const theme = {
  backgroundColor: '#2c5364',
  statusBarColor: '#1f404f',
  accentColor: 'orange',
  graph: {
    lineWidth: 3,
    chartColors: ['#ff3d3d', '#ff7521', '#ffa500'],
  },
  liveBtnContainer,
};

export default theme;
