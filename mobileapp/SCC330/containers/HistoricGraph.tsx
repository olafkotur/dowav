import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import Loader from './Loader';
import { HistoricData, Sensor, Zone, ZoneData } from '../types';
import theme from '../theme';

interface Props {
  sensor: Sensor,
  zone?: Zone,
  hidden?: boolean,
  style?: ViewStyle,
}

const HISTORIC_ENDPOINT = 'https://dowav-api.herokuapp.com/api/historic/';

// Function which maps historic data to charts on a graph
const mapDataToCharts = (data: HistoricData, zone: Zone) => {
  return data.map((zoneData: ZoneData, i) => {
    const graphData = zoneData.map(point => point.value);
    const chartSvgStyle = {
      stroke: theme.graph.chartColors[zone ? (zone - 1) : i % 3],
      strokeWidth: theme.graph.lineWidth,
    };
    const gridSvgStyle = {
      stroke: 'grey',
    };
    
    return (
      <LineChart
        data={graphData}
        style={StyleSheet.absoluteFill}
        svg={chartSvgStyle}
        key={i}
      >
        {i === 0 ? (
          <Grid svg={gridSvgStyle} />
        ) : null}
      </LineChart>
    );
  });
}

const HistoricGraph = (props: Props) => {
  // Alias props
  const { sensor, zone, hidden, style } = props;

  // Initialise state
  const [ data, setData ] = useState([]) as [ HistoricData, Function ];
  const [ loading, setLoading ] = useState(true);

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

            // Update component
            setData(histData);
            setLoading(false);
          }
        });
      }
    }).catch(err => {
      console.log(err);
    });

    // Cancel updating component if unmounted mid network request
    return () => {
      doUpdate = false;
    };
  }, []);

  const loadingStyle: ViewStyle = {
    flex: 1,
    ...style,
    display: hidden ? 'none' : 'flex',
  }
  const displayStyle: ViewStyle = {
    flex: 1,
    position: 'relative',
    ...style,
    display: hidden ? 'none' : 'flex',
  }

  if (loading) {
    return (
      <View style={loadingStyle}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={displayStyle}>
      {mapDataToCharts(data, zone)}
    </View>
  );
}

HistoricGraph.defaultProps = {
  zone: null,
  hidden: false,
  style: {},
}

export default HistoricGraph;
