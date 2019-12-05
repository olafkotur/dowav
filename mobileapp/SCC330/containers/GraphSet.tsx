import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import HistoricGraph from './HistoricGraph';
import GraphButton from './GraphButton';
import { Sensor, Zone } from '../types';

import theme from '../theme';
import LiveGraph from './LiveGraph';

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

const renderGraphs = (sensor: Sensor, activeGraph: number, liveStates: boolean[], setOneLiveState: Function) => {
  const graphs = [];

  for (let i = 0; i < 3; i++) {
    const zone = (i + 1) as Zone;

    graphs.push(
      <View
        style={{ flex: 1, display: activeGraph === i ? 'flex' : 'none' }}
        key={i}
      >
        <View style={{ flexDirection: 'row' }}>
          <GraphButton
            active={liveStates[i]}
            label="Live"
            style={theme.btnStyle}
            onPress={() => setOneLiveState(i, !liveStates[i])}
          />
        </View>
        {liveStates[i] ? (
          <LiveGraph
            sensor={sensor}
            zone={zone}
          />
        ) : (
          <HistoricGraph
            sensor={sensor}
            zone={zone}
          />
        )}
      </View>
    );
  }

  return graphs;
}

// Renders 3 toggle-able graphs, with buttons, for the given sensor
const GraphSet = (props: Props) => {
  const { sensor, style } = props;

  const [ activeGraph, setActiveGraph ] = useState(0);
  const [ liveStates, setLiveStates ] = useState([false, false, false]);

  const setOneLiveState = (graphIndex: number, value: boolean) => {
    const newLiveStates = Array.from(liveStates);
    newLiveStates[graphIndex] = value;
    setLiveStates(newLiveStates);
  }

  return (
    <View style={style}>
      <View style={styles.btnContainerOuter}>
        <View style={styles.btnContainer}>
          {renderButtons(activeGraph, setActiveGraph)}
        </View>
      </View>

      <View style={styles.graphContainer}>
        {renderGraphs(sensor, activeGraph, liveStates, setOneLiveState)}
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
