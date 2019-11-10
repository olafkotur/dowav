import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import HistoricGraph from './HistoricGraph';
import GraphButtonSet from './GraphButtonSet';
import { Sensor } from '../types';

interface Props {
  sensor: Sensor,
  style?: ViewStyle,
}

const renderGraphs = (sensor: Sensor, activeGraph: number) => {
  const graphs = [];

  for (let i = 0; i < 3; i++) {
    graphs.push(
      <HistoricGraph
        sensor={sensor}
        hidden={activeGraph !== i}
        key={i}
      />
    );
  }

  return graphs;
}

// Renders 3 toggle-able graphs for the given sensor
const GraphSet = (props: Props) => {
  const [ activeGraph, setActiveGraph ] = useState(0);
  const { sensor, style } = props;

  return (
    <View style={style}>
      <GraphButtonSet
        count={3}
        activeGraph={activeGraph}
        onPress={(g: number) => setActiveGraph(g)}
      />

      <View style={styles.graphContainer}>
        {renderGraphs(sensor, activeGraph)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  graphContainer: {
    flex: 1,
    marginTop: '2.5%',
  },
});

GraphSet.defaultProps = {
  style: {},
};

export default GraphSet;
