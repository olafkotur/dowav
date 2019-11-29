import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import HistoricGraph from '../containers/HistoricGraph';
import LiveGraph from '../containers/LiveGraph';
import GraphSet from '../containers/GraphSet';
import GraphButton from '../containers/GraphButton';

import theme from '../theme';
import { Sensor, ZoneData } from '../types';
import { fetchLiveData } from '../actions';

interface Props {
  sensor: Sensor,
}
const LIVE_DATA_FETCH_DELAY = 1000;

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
          style={theme.liveBtnStyle}
          onPress={() => setIsLive(!isLive)}
        />
        <Text style={styles.title}>All Zones</Text>
        <View></View>
      </View>

      {isLive ? (
        <LiveGraph
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
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default SensorScreen;
