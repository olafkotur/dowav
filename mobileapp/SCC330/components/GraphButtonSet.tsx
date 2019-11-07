import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import theme from '../theme';

interface Props {
  activeGraph: number,
  count: number,
  onPress?: Function,
}

const GraphButtonSet = (props: Props) => {
  const { activeGraph, count, onPress } = props;

  const buttonSet = [];
  for (let i = 0; i < count; i++) {
    const isFirst = i === 0;
    const isLast = i === count - 1;

    const thisStyle: Array<ViewStyle> = [ styles.everyBtn ];
    const textStyle: TextStyle = { color: 'white' };
    
    if (activeGraph === i) {
      thisStyle.push(styles.activeBtn);
      textStyle.color = 'black';
    }

    if (isFirst) thisStyle.push(styles.firstBtn);
    else if (isLast) thisStyle.push(styles.lastBtn);

    buttonSet.push(
      <TouchableOpacity
        style={thisStyle}
        onPress={onPress.bind(null, i)}
        key={i}
      >
        <Text style={textStyle}>{`Zone ${i + 1}`}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
      <View style={styles.container}>
        {buttonSet}
      </View>
    </View>
  );
}

const BORDER_RADIUS = 4;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: theme.accentColor,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS + 1,
  },
  everyBtn: {
    backgroundColor: 'transparent',
    padding: 6,
    paddingLeft: 8,
    paddingRight: 8,
  },
  firstBtn: {
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
  },
  lastBtn: {
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
  },
  activeBtn: {
    backgroundColor: theme.accentColor,
  },
});

GraphButtonSet.defaultProps = {
  onPress: () => {},
}

export default GraphButtonSet;
