import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GraphButtonSet = props => {
  const { activeGraph, count, onPress } = props;

  const buttonSet = [];
  for (let i = 0; i < count; i++) {
    const isFirst = i === 0;
    const isLast = i === count - 1;

    const thisStyle = [ styles.globalBtn ];
    if (activeGraph === i) thisStyle.push(styles.activeBtn);

    if (isFirst) thisStyle.push(styles.firstBtn);
    else if (isLast) thisStyle.push(styles.lastBtn);

    buttonSet.push(
      <TouchableOpacity
        style={thisStyle}
        onPress={onPress.bind(null, i)}
        key={i}
      >
        <Text style={styles.title}>{`Device ${i + 1}`}</Text>
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
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS + 1,
  },
  globalBtn: {
    backgroundColor: 'transparent',
    padding: 5,
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
    backgroundColor: 'orange',
  },
  title: {
    color: 'white',
  },
});

GraphButtonSet.defaultProps = {
  count: 3,
  onPress: () => {},
}

export default GraphButtonSet;
