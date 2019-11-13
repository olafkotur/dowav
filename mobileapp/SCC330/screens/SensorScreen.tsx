import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import HistoricGraph from '../containers/HistoricGraph';
import LiveGraph from '../containers/LiveGraph';
import GraphSet from '../containers/GraphSet';
import GraphButton from '../containers/GraphButton';

import theme from '../theme';
import { Sensor } from '../types';

interface Props {
  sensor: Sensor,
}

const TempScreen = (props: Props) => {
  const { sensor } = props;

  const [ isLive, setIsLive ] = useState(false) as [ boolean, Function ];

  return (
    <View style={styles.container}>
      <GraphSet
        sensor={sensor}
        style={styles.graphSet}
      />

      <View style={styles.liveBtnContainer}>
        <GraphButton
          active={isLive}
          label="Live"
          onPress={() => setIsLive(!isLive)}
        />
        <Text style={styles.title}>All Zones</Text>
        <View></View>
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
  liveBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  }
});

export default TempScreen;
