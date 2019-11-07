import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import GraphButtonSet from './GraphButtonSet';

interface Props {
  data: Array<Array<number>>,
  style?: Object,
  lineColor?: string,
}

const GraphSet = (props: Props) => {
  const [ graph, setGraph ] = useState(0);

  const svgStyle = {
    stroke: props.lineColor,
    strokeWidth: 3,
  };

  return (
    <View style={props.style}>
      <GraphButtonSet
        count={props.data.length}
        activeGraph={graph}
        onPress={(g: number) => setGraph(g)}
      />

      <View style={styles.graphContainer}>
        {props.data.map((dataSet: Array<number>, i: number) => {
          const graphStyle: ViewStyle = {
            display: (graph === i ? 'flex' : 'none'),
            height: '100%',
          };

          return (
            <LineChart
              style={graphStyle}
              data={dataSet}
              svg={svgStyle}
              key={i}
            >
              <Grid />
            </LineChart>
          );
        })}
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

export default GraphSet;
