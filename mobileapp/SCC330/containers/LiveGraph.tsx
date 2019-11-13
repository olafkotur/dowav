import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import theme from '../theme';
import { Sensor, Zone, ZoneData, GraphState } from '../types';
import Loader from './Loader';

interface Props {
  sensor: Sensor,
  zone?: Zone,
  hidden?: boolean,
  style?: ViewStyle,
}

const LIVE_ENDPOINT = 'https://dowav-api.herokuapp.com/api/live/';
const DELAY = 1000;

// Function which maps live data to charts on a graph
const mapDataToCharts = (data: ZoneData[], zone: Zone) => {
  const chartData: number[][] = [[], [], []];
  data.forEach(zoneData => {
    for (let i = 0; i < zoneData.length; i++) {
      const point = zoneData[i];

      if (zone && zone !== (i + 1)) continue;
      chartData[i].push(point.value);
    }
  });

  const gridSvgStyle = {
    stroke: 'grey',
  };

  const chartArray = chartData.map((curData, i) => {
    const chartSvgStyle = {
      stroke: theme.graph.chartColors[zone ? zone : i % 3],
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

  return chartArray;
}

const LiveGraph = (props: Props) => {
  const { sensor, zone, hidden, style } = props;

  const [ data, setData ] = useState([] as ZoneData[]);
  const [ graphState, setGraphState ] = useState('loading' as GraphState);

  // Upon mounting, start worker
  useEffect(() => {
    let doUpdate = true;

    // Get new data every DELAY ms
    const worker = setInterval(() => {
      try {
        const pData = fetch(`${LIVE_ENDPOINT}${sensor}`);
  
        pData.then(res => {
          res.json().then((serverData: ZoneData) => {
            if (serverData) {
              if (doUpdate) {
                if (data.length <= 15) {
                  setData([ ...data, serverData ]);
                } else {
                  setData([ ...data.slice(1), serverData ]);
                }
                setGraphState('displaying');
              }
            }
          });
        });
      } catch (err) {
        console.log(err);
        setGraphState('error');
      }
    }, DELAY);

    // Upon unmounting, stop worker
    return () => {
      doUpdate = false;
      clearInterval(worker);
    }
  }, [data]);

  const graphStyle: ViewStyle = {
    display: hidden ? 'none' : 'flex',
    flex: 1,
    ...style,
  };

  if (graphState === 'loading') {
    return (
      <Loader />
    );
  } else if (graphState === 'error') {
    return (
      <Text>An error occured, please try again</Text>
    );
  }

  return (
    <View style={graphStyle}>
      {mapDataToCharts(data, zone)}
    </View>
  );
}

LiveGraph.defaultProps = {
  zone: null,
  hidden: false,
  style: {},
}

export default LiveGraph;
