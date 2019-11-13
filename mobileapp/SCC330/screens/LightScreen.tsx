import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../theme';
import GraphSet from '../containers/GraphSet';
import HistoricGraph from '../containers/HistoricGraph';

const LightScreen = () => (
  <View style={styles.container}>
    <GraphSet
      sensor="light"
      style={styles.graphSet}
    />

    <HistoricGraph
      sensor="light"
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
  },
});

export default LightScreen;
