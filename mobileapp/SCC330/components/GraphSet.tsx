import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

import GraphButtonSet from './GraphButtonSet';

interface Props {
  data: Array<Array<number>>,
  style?: Object,
  lineColor?: string,
}
interface State {
  graph: number,
}

class GraphSet extends React.Component<Props, State> {
  public static defaultProps = {
    style: {},
    lineColor: 'black',
  }
  
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
          onPress={(graph: number) => this.setState({ graph })}
        />

        <View style={styles.graphContainer}>
          {this.props.data.map((dataSet: Array<number>, i: number) => {
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
}

const styles = StyleSheet.create({
  graphContainer: {
    flex: 1,
    marginTop: '2.5%',
  },
});

export default GraphSet;
