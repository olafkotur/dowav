import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import { HistoricData, Sensor, Zone, SensorData } from '../types';
import theme from '../theme';

interface Props {
  sensor: Sensor,
  zone?: Zone,
  hidden?: boolean,
  style?: ViewStyle,
}

// moisture?from=1&to=1573149830&zone=1
const HISTORIC_ENDPOINT = 'https://danmiz.net/api/historic.json';
const svgStyle = {
  stroke: theme.accentColor,
  strokeWidth: theme.graph.lineWidth,
}

const HistoricGraph = (props: Props) => {
  // Alias props
  const { sensor, zone, hidden, style } = props;

  // Initialise state
  const [ data, setData ] = useState([]) as [ HistoricData, Function ];
  const [ loading, setLoading ] = useState(true);

  // On mount, fetch data for given sensor and filter by zone if specified
  useEffect(() => {
    let doUpdate = true;
    const toTime = Date.now();
    const fromTime = toTime - (5 * 60 * 1000);

    // let endpoint = `${HISTORIC_ENDPOINT}${sensor}?from=${fromTime}&to=${toTime}`;
    let endpoint = HISTORIC_ENDPOINT; // TESTING
    // if (zone) endpoint += `&zone=${zone}`;
    const pData = fetch(endpoint);

    pData.then(res => {
      if (res && doUpdate) {
        res.json().then((histData: HistoricData) => {
          if (histData) {
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
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
    display: hidden ? 'none' : 'flex',
  }
  const displayStyle: ViewStyle = {
    position: 'relative',
    flex: 1,
    ...style,
    display: hidden ? 'none' : 'flex',
  }

  if (loading) {
    return (
      <View style={loadingStyle}>
        <Text style={{ fontSize: 24 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={displayStyle}>
      {data.map((zoneData: Array<SensorData>, i) => {
        const graphData = zoneData.map(point => point.value);
        
        return (
          <LineChart
            data={graphData}
            style={StyleSheet.absoluteFill}
            svg={svgStyle}
            key={i}
          >
            {i === 0 ? (
              <Grid />
            ) : null}
          </LineChart>
        );
      })}
    </View>
  );
}

HistoricGraph.defaultProps = {
  zone: null,
  hidden: false,
  style: {},
}

export default HistoricGraph;
