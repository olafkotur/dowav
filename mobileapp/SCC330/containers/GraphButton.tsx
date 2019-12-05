import React from 'react';

import theme from '../theme';
import { Text, TouchableOpacity, ViewStyle, GestureResponderEvent } from 'react-native';

interface Props {
  active?: boolean,
  label?: string,
  style?: ViewStyle,
  onPress?: (e: GestureResponderEvent) => void,
};

const GraphButton = (props: Props) => {
  const { active, label, style, onPress } = props;

  const btnStyle: ViewStyle = {
    backgroundColor: active ? theme.accentColor : 'transparent',
    padding: 6,
    paddingLeft: 8,
    paddingRight: 8,
    ...style,
  };
  const textStyle = {
    color: active ? 'black' : 'white',
  };

  return (
    <TouchableOpacity
      style={btnStyle}
      onPress={onPress}
      hitSlop={{
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      }}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

GraphButton.defaultProps = {
  active: false,
  label: '',
  style: {},
  onPress: () => {},
}

export default GraphButton;
