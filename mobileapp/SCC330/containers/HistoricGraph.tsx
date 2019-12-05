import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import { HistoricData, Sensor, Zone, ZoneData } from '../types';
import theme from '../theme';
import ErrorMessage from './ErrorMessage';
import useFetch from '../hooks/useFetch';
import Loader from './Loader';

interface Props {
  sensor: Sensor,
  zone?: Zone,
  hidden?: boolean,
  style?: ViewStyle,
}

const BASE_ENDPOINT = 'https://dowav-api.herokuapp.com/api/historic/';
const HISTORIC_MINS = 60;
const gridSvgStyle = {
  stroke: 'grey',
};

// Function which maps historic data to charts on a graph
const mapDataToCharts = (data: HistoricData, zone: Zone) => {
  let renderGrid = true;

  return data.map((zoneData: ZoneData | null, i) => {
    if (zoneData) {
      const chartData = zoneData.map(point => point.value);
      const chartSvgStyle = {
        stroke: theme.graph.chartColors[zone ? (zone - 1) : i % 3],
        strokeWidth: theme.graph.lineWidth,
      };
      
      if (chartData.length > 1 && renderGrid) {
        renderGrid = false;

        return (
          <LineChart
            data={chartData}
            style={StyleSheet.absoluteFill}
            svg={chartSvgStyle}
            animate
            yMin={Math.min(...chartData) - 0.2}
            yMax={Math.max(...chartData) + 0.2}
            key={i}
          >
            <Grid svg={gridSvgStyle} />
          </LineChart>
        );
      } else {
        return (
          <LineChart
            data={chartData}
            style={StyleSheet.absoluteFill}
            svg={chartSvgStyle}
            animate
            yMin={Math.min(...chartData) - 0.2}
            yMax={Math.max(...chartData) + 0.2}
            key={i}
          />
        );
      }
    } else {
      return null;
    }
  });
}

const HistoricGraph = (props: Props) => {
  // Alias props
  const { sensor, zone, hidden, style } = props;

  // On mount, fetch data for given sensor
  const toTime = Math.floor(Date.now() / 1000);
  const fromTime = toTime - (HISTORIC_MINS * 60);

  //const endpoint = 'https://danmiz.net/api/historic.json';
  const endpoint = `${BASE_ENDPOINT}${sensor}?from=${fromTime}&to=${toTime}`;
  let [ data, error, pending ] = useFetch<HistoricData>(endpoint);
  
  let component: JSX.Element | JSX.Element[];

  if (pending) {
    component = <Loader />;
  } else if (error) {
    component = <ErrorMessage dataType={sensor} />;
  } else if (data) {
    if (zone) {
      data = data.filter((zoneData, i) => i === (zone - 1));
    }

    if (data.some(d => d && d !== null)) {
      component = mapDataToCharts(data, zone);
    } else {
      component = <ErrorMessage dataType={sensor} />;
    }
  } else {
    component = <ErrorMessage dataType={sensor} />;
  }

  const containerStyle: ViewStyle = {
    flex: 1,
    display: hidden ? 'none' : 'flex',
    ...style,
  }

  return (
    <View style={containerStyle}>
      {component}
    </View>
  );
}

HistoricGraph.defaultProps = {
  zone: null,
  hidden: false,
  style: {},
}

export default HistoricGraph;
