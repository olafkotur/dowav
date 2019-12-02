import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, ActivityIndicator } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';
import { useSelector } from 'react-redux';

import theme from '../theme';
import { Zone, ZoneData, GraphState, GlobalState, Sensor } from '../types';
import ErrorMessage from './ErrorMessage';

interface Props {
  sensor: Sensor,
  zone?: Zone,
  hidden?: boolean,
  style?: ViewStyle,
}

// Function which maps live data to charts on a graph
const mapDataToCharts = (data: ZoneData[], zone: Zone) => {
  const gridSvgStyle = {
    stroke: 'grey',
  };

  const chartCount = (zone ? 1 : 3);
  const chartData: number[][] = [];
  for (let i = 0; i < chartCount; i++) {
    chartData[i] = data.map(zoneData => zoneData[zone ? (zone - 1) : i].value);
  }

  const charts = chartData.map((curData, i) => {
    const chartSvgStyle = {
      stroke: theme.graph.chartColors[zone ? (zone - 1) : i % 3],
      strokeWidth: theme.graph.lineWidth,
    };

    return <LineChart
      data={curData}
      style={StyleSheet.absoluteFill}
      svg={chartSvgStyle}
      yMin={Math.min(...curData) - 1}
      yMax={Math.max(...curData) + 1}
      key={i}
    >
      {i === 0 ? (
        <Grid svg={gridSvgStyle} />
      ) : null}
    </LineChart>
  });

  return charts;
}

const LiveGraph = (props: Props) => {
  const { sensor, zone, hidden, style } = props;
  let liveData = useSelector((store: GlobalState) => store.liveData);

  const graphStyle: ViewStyle = {
    display: hidden ? 'none' : 'flex',
    flex: 1,
    ...style,
  };

  if (liveData.length) {
    return (
      <View style={graphStyle}>
        {mapDataToCharts(liveData, zone)}
      </View>
    );
  }

  return (
    <ErrorMessage dataType={`live ${sensor}`} />
  );
}

LiveGraph.defaultProps = {
  zone: null,
  hidden: false,
  style: {},
}

export default LiveGraph;
