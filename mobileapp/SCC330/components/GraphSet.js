import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';

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
        <View style={styles.buttonContainer}>
          {this.props.data.map((dataSet, i) => (
            <Button
              title={`Graph ${i+1}`}
              key={i}
              onPress={() => this.setState({ graph: i })}
              color={this.state.graph === i ? 'orange' : '#2c5364'}
            />
          ))}
        </View>

        <View style={styles.graphContainer}>
          {this.props.data.map((dataSet, i) => (
            <LineChart
              style={this._graphStyle(i)}
              data={dataSet}
              svg={{
                stroke: this.props.lineColor,
                strokeWidth: 3,
              }}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: '5%',
  },
  graphContainer: {
    flex: 1,
  },
});

export default GraphSet;
