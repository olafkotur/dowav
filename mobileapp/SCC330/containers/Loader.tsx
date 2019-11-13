import React, { useEffect, useState } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';

import theme from '../theme';

interface Props {
  style?: ViewStyle,
}

const animConfig = (toValue: number): Animated.TimingAnimationConfig => ({
  toValue,
  duration: 1500,
  easing: Easing.linear,
});

const AnimatedProgressCircle = Animated.createAnimatedComponent(ProgressCircle);

const Loader = (props: Props) => {
  const { style } = props;

  const startAngle = new Animated.Value(0);
  const endAngle = new Animated.Value(Math.PI);

  const animate = () => {
    startAngle.setValue(0);
    endAngle.setValue(-Math.PI);

    Animated.timing(startAngle, animConfig(Math.PI * 2))
      .start(() => animate());
    Animated.timing(endAngle, animConfig(Math.PI))
      .start();
  }

  useEffect(() => {
    animate();
  }, []);

  return (
    <AnimatedProgressCircle
      style={{ flex: 1 }}
      progress={1}
      progressColor={theme.accentColor}
      startAngle={startAngle}
      endAngle={endAngle}
    />
  );
}

Loader.defaultProps = {
  style: {},
}

export default Loader;
