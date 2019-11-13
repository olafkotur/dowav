import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import Loader from './Loader';
import { HistoricData, Sensor, Zone, ZoneData, GraphState } from '../types';
import theme from '../theme';

interface Props {
  sensor: Sensor,
  zone?: Zone,
  hidden?: boolean,
  style?: ViewStyle,
}

const HISTORIC_ENDPOINT = 'https://dowav-api.herokuapp.com/api/historic/';
const gridSvgStyle = {
  stroke: 'grey',
};
const errorMsgStyle: TextStyle = {
  color: 'white',
  fontSize: 18,
}

// Function which maps historic data to charts on a graph
const mapDataToCharts = (data: HistoricData, zone: Zone) => {
  return data.map((zoneData: ZoneData, i) => {
    if (zoneData) {
      const graphData = zoneData.map(point => point.value);
      const chartSvgStyle = {
        stroke: theme.graph.chartColors[zone ? (zone - 1) : i % 3],
        strokeWidth: theme.graph.lineWidth,
      };
      
      return (
        <LineChart
          data={graphData}
          style={StyleSheet.absoluteFill}
          svg={chartSvgStyle}
          animate
          yMin={Math.min(...graphData) - 0.2}
          yMax={Math.max(...graphData) + 0.2}
          key={i}
        >
          {i === 0 ? (
            <Grid svg={gridSvgStyle} />
          ) : null}
        </LineChart>
      );
    }

    return null;
  });
}

const HistoricGraph = (props: Props) => {
  // Alias props
  const { sensor, zone, hidden, style } = props;

  // Initialise state
  const [ data, setData ] = useState([]) as [ HistoricData, Function ];
  const [ graphState, setGraphState ] = useState('loading') as [ GraphState, Function ];

  // On mount, fetch data for given sensor
  useEffect(() => {
    // Init request
    let doUpdate = true;
    const toTime = Math.floor(Date.now() / 1000);
    const fromTime = toTime - (360 * 60);

    let endpoint = `${HISTORIC_ENDPOINT}${sensor}?from=${fromTime}&to=${toTime}`;
    const pData = fetch(endpoint);

    pData.then(res => {
      // Check request payload
      if (res && doUpdate) {
        res.json().then((histData: HistoricData) => {
          if (histData) {
            // Filter out unnecessary zones if zone prop specified
            if (zone) {
              histData = histData.filter((zoneData, i) => i === (zone - 1));
            }

            if (histData.some(d => d && d !== null)) {
              // Update component
              setData(histData);
              setGraphState('displaying');
            } else {
              setGraphState('error');
            }
          }
        });
      }
    }).catch(err => {
      console.log(err);
      setGraphState('error');
    });

    // Cancel updating component if unmounted mid network request
    return () => {
      doUpdate = false;
    };
  }, []);

  const containerStyle: ViewStyle = {
    flex: 1,
    display: hidden ? 'none' : 'flex',
    ...style,
  }

  let component = <Text style={errorMsgStyle}>No {sensor} data was received from the server, please try again later</Text>;
  if (graphState === 'loading') {
    component = <Loader />;
  } else if (graphState === 'displaying') {
    containerStyle.position = 'relative';
    component = (
      <View style={containerStyle}>
        {mapDataToCharts(data, zone)}
      </View>
    );
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
