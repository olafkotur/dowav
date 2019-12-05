import { ViewStyle, TextStyle } from "react-native";

const liveBtnContainer: ViewStyle = {
  marginBottom: '2.5%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const btnStyle: ViewStyle = {
  borderRadius: 3,
  borderColor: 'orange',
  borderWidth: 1,
};
const text: TextStyle = {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
};

const theme = {
  backgroundColor: '#2c5364',
  headerColor: '#1f404f',
  statusBarColor: '#0e2c38',
  accentColor: '#ffa500',
  inactiveAccentColor: '#fc8a00',
  inactiveColor: '#ddd',
  graph: {
    lineWidth: 3,
    chartColors: ['#ff3d3d', '#ff7521', 'orange'],
  },
  text,
  liveBtnContainer,
  btnStyle,
};

export default theme;
