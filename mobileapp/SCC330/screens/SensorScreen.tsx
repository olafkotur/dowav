import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import HistoricGraph from '../containers/HistoricGraph';
import LiveGraph from '../containers/LiveGraph';
import GraphSet from '../containers/GraphSet';
import GraphButton from '../containers/GraphButton';

import theme from '../theme';
import { Sensor } from '../types';
import { fetchLiveData } from '../actions';

interface Props {
  sensor: Sensor,
}
const LIVE_DATA_FETCH_DELAY = 1000; // 5000 for dev, 1000 for production

const SensorScreen = (props: Props) => {
  const { sensor } = props;

  const [ isLive, setIsLive ] = useState(false) as [ boolean, Function ];

  useEffect(() => {
    const liveDataInterval = setInterval(() => {
      fetchLiveData(sensor);
    }, LIVE_DATA_FETCH_DELAY);

    return () => {
      clearInterval(liveDataInterval);
    }
  }, []);

  return (
    <View style={styles.container}>

      <GraphSet
        sensor={sensor}
        style={styles.graphSet}
      />

      <View style={theme.liveBtnContainer}>
        <GraphButton
          active={isLive}
          label="Live"
          style={theme.btnStyle}
          onPress={() => setIsLive(!isLive)}
        />
        <Text style={styles.graphTitle}>All Zones</Text>
        <View style={{ marginLeft: 43 }}></View>
      </View>

      {isLive ? (
        <LiveGraph
          sensor={sensor}
          style={styles.mainGraphContainer}
        />
      ) : (
        <HistoricGraph
          sensor={sensor}
          style={styles.mainGraphContainer}
        />
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
    backgroundColor: theme.backgroundColor,
  },
  graphSet: {
    flex: 2,
    marginBottom: '2.5%',
  },
  mainGraphContainer: {
    flex: 3,
  },
  graphTitle: {
    ...theme.text,
    fontSize: 18,
  },
});

export default SensorScreen;
