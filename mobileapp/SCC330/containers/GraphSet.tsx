import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import Graph from './Graph';
import GraphButtonSet from './GraphButtonSet';

interface Props {
  data: Array<Array<number>>,
  style?: ViewStyle,
}

// Map given data onto graph components
const mapDataToGraphs = (data: Array<Array<number>>, activeGraph: number) => {
  return data.map((dataSet: Array<number>, i: number) => (
    <Graph
      data={dataSet}
      hidden={activeGraph !== i}
      key={i}
    />
  ));
}

const GraphSet = (props: Props) => {
  const [ activeGraph, setActiveGraph ] = useState(0);
  const { data, style } = props;

  return (
    <View style={style}>
      <GraphButtonSet
        count={props.data.length}
        activeGraph={activeGraph}
        onPress={(g: number) => setActiveGraph(g)}
      />

      <View style={styles.graphContainer}>
        {mapDataToGraphs(data, activeGraph)}
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
