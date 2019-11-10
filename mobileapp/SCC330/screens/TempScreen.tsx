import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import HistoricGraph from '../containers/HistoricGraph';
import GraphSet from '../containers/GraphSet';
import theme from '../theme';
import { LineChart, Grid } from 'react-native-svg-charts';

const TempScreen = () => (
  <View style={styles.container}>
    <GraphSet
      sensor="temperature"
      style={styles.graphSet}
    />

    <HistoricGraph
      sensor="temperature"
      style={styles.mainGraphContainer}
    />
  </View>
);

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
  }
});

export default TempScreen;
