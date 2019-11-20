import { ViewStyle } from "react-native";

const liveBtnContainer: ViewStyle = {
  marginBottom: '2.5%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}
const liveBtnStyle: ViewStyle = {
  borderRadius: 3,
  borderColor: 'orange',
  borderWidth: 1,
}

const theme = {
  backgroundColor: '#2c5364',
  statusBarColor: '#1f404f',
  accentColor: 'orange',
  graph: {
    lineWidth: 3,
    chartColors: ['#ff3d3d', '#ff7521', 'orange'],
  },
  liveBtnContainer,
  liveBtnStyle,
};

export default theme;
