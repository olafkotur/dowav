import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';
import GraphSet from '../components/GraphSet';

const TempScreen = () => {
  const data = [
    [43, 45, 56, 42, 34, 39],
    [63, 75, 23, 54, 24, 54],
    [45, 63, 64, 27, 54, 53],
  ];
  const mainData = [35, 54, 54, 12, 64, 25];

  return (
    <View style={styles.container}>
      <GraphSet
        data={data}
        style={styles.graphSet}
        lineColor="orange"
      />

      <LineChart
        style={styles.mainGraphContainer}
        data={mainData}
        svg={{ stroke: 'orange', strokeWidth: 3, }}
      >
        <Grid />
      </LineChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
    backgroundColor: '#2c5364',
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
