import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import HistoricGraph from './HistoricGraph';
import GraphButton from './GraphButton';
import { Sensor, Zone } from '../types';

import theme from '../theme';

interface Props {
  sensor: Sensor,
  style?: ViewStyle,
};
const BTN_BORDER_RADIUS = 4;

const renderButtons = (activeGraph: number, onPress: Function) => {
  const btnStyles: ViewStyle[] = [{
    borderTopLeftRadius: BTN_BORDER_RADIUS,
    borderBottomLeftRadius: BTN_BORDER_RADIUS,
  }, {}, {
    borderTopRightRadius: BTN_BORDER_RADIUS,
    borderBottomRightRadius: BTN_BORDER_RADIUS,
  }];

  return btnStyles.map((style, i) => (
    <GraphButton
      active={activeGraph === i}
      label={`Zone ${i + 1}`}
      style={style}
      onPress={() => onPress(i)}
      key={i}
    />
  ));
}

const renderGraphs = (sensor: Sensor, activeGraph: number) => {
  const graphs = [];

  for (let i = 0; i < 3; i++) {
    const zone = i + 1;

    graphs.push(
      <HistoricGraph
        sensor={sensor}
        zone={zone as Zone}
        hidden={activeGraph !== i}
        key={i}
      />
    );
  }

  return graphs;
}

// Renders 3 toggle-able graphs, with buttons, for the given sensor
const GraphSet = (props: Props) => {
  const [ activeGraph, setActiveGraph ] = useState(0);
  const { sensor, style } = props;

  return (
    <View style={style}>
      <View style={styles.btnContainerOuter}>
        <View style={styles.btnContainer}>
          {renderButtons(activeGraph, setActiveGraph)}
        </View>
      </View>

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
  btnContainerOuter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    borderColor: theme.accentColor,
    borderWidth: 1,
    borderRadius: BTN_BORDER_RADIUS + 1,
  },
});

GraphSet.defaultProps = {
  style: {},
};

export default GraphSet;
