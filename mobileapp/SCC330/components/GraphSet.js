import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import GraphButtonSet from './GraphButtonSet';

class GraphSet extends React.Component {
  state = {
    graph: 0,
  }

  render() {
    const { graph } = this.state;
    const svgStyle = {
      stroke: this.props.lineColor,
      strokeWidth: 3,
    };

    return (
      <View style={this.props.style}>
        <GraphButtonSet
          count={this.props.data.length}
          activeGraph={this.state.graph}
          onPress={graph => this.setState({ graph })}
        />

        <View style={styles.graphContainer}>
          {this.props.data.map((dataSet, i) => {
            const graphStyle = {
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
}

const styles = StyleSheet.create({
  graphContainer: {
    flex: 1,
    marginTop: '2.5%',
  },
});

GraphSet.defaultProps = {
  data: [[]],
  style: {},
  lineColor: 'black',
}

export default GraphSet;
