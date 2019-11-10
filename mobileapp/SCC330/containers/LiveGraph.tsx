import React from 'react';
import { ViewStyle } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import theme from '../theme';

interface Props {
  data: Array<number>,
  hidden?: boolean,
  style?: ViewStyle,
}

const svgStyle = {
  stroke: theme.accentColor,
  strokeWidth: theme.graph.lineWidth,
}

const DisplayGraph = (props: Props) => {
  const { data, hidden, style } = props;

  const graphStyle: ViewStyle = Object.assign({
    display: hidden ? 'none' : 'flex',
    flex: 1,
  }, style);

  return (
    <LineChart
      style={graphStyle}
      data={data}
      svg={svgStyle}
    >
      <Grid />
    </LineChart>
  );
}

DisplayGraph.defaultProps = {
  hidden: false,
  style: {},
}

export default DisplayGraph;
