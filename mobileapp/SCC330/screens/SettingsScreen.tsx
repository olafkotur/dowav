import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { CheckBox, Slider } from 'react-native-elements';

import theme from '../theme';

const MIN_TEMP = 0;
const MAX_TEMP = 50;

const SettingsScreen = () => {
  const [ loading, setLoading ] = useState(false);
  const [ doTweet, setDoTweet ] = useState(false);
  const [ minTemp, setMinTemp ] = useState(20);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Settings</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.accentColor} />
      ) : (
        <View>

          <CheckBox
            title="Enable tweets"
            checked={doTweet}
            onPress={() => setDoTweet(!doTweet)}
          />

          <Slider
            minimumValue={MIN_TEMP}
            maximumValue={MAX_TEMP}
            value={minTemp}
            onValueChange={(temp) => setMinTemp(temp)}
            step={1}
          />
          <Text style={styles.caption}>{minTemp}°C</Text>

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundColor,
  },
  title: theme.text,
  caption: {
    fontSize: 14,
    color: theme.text.color
  }
});

export default SettingsScreen;
