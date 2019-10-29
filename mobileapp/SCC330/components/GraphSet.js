import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import GraphButtonSet from './GraphButtonSet';

class GraphSet extends React.Component {
  state = {
    graph: 0,
  }

  _graphStyle(i) {
    return {
      display: (this.state.graph === i ? 'flex' : 'none'),
      height: '100%',
    };
  }

  render() {
    return (
      <View style={this.props.style}>
        <GraphButtonSet
          count={this.props.data.length}
          activeGraph={this.state.graph}
          onPress={graph => this.setState({ graph })}
        />

        <View style={styles.graphContainer}>
          {this.props.data.map((dataSet, i) => (
            <LineChart
              style={this._graphStyle(i)}
              data={dataSet}
              svg={{ stroke: this.props.lineColor, strokeWidth: 3 }}
              key={i}
            >
              <Grid />
            </LineChart>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  graphContainer: {
    flex: 1,
    marginTop: '2.5%',
  },
});

export default GraphSet;
