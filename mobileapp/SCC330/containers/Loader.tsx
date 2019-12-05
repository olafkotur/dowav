import React from 'react';
import { ActivityIndicator } from 'react-native';

import theme from '../theme';

const Loader = () => (
  <ActivityIndicator size="large" color={theme.accentColor} />
);

export default Loader;
