import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet, Text, ScrollView } from 'react-native';
import { PlantSetting, GlobalState } from '../types';
import theme from '../theme';
import { Slider } from 'react-native-elements';
import { useSelector } from 'react-redux';

interface LabelledSliderProps {
  label: string,
  value: number,
  unit?: string,
  minVal: number,
  maxVal: number,
  setVal: (val: number) => void,
}

const LabelledSlider = ({ label, value, unit, minVal, maxVal, setVal }: LabelledSliderProps) => (
  <>
    <Text style={styles.label}>{label}: <Text style={{ fontWeight: 'bold' }}>{value}{unit}</Text></Text>
    <Slider
      value={value}
      step={1}
      minimumValue={minVal}
      maximumValue={maxVal}
      thumbTintColor={theme.accentColor}
      minimumTrackTintColor={theme.inactiveAccentColor}
      maximumTrackTintColor={theme.inactiveColor}
      onValueChange={(val) => setVal(val)}
    />
  </>
);

LabelledSlider.defaultProps = { unit: '' };

interface Props {
  userSettings: PlantSetting,
  onSettingChange: (newSetting: PlantSetting) => void,
}

const PlantSettings = ({ userSettings, onSettingChange }: Props) => {
  if (userSettings.minTemperature < 0) {
    userSettings.minTemperature = 0;
  }
  if (userSettings.maxTemperature > 50) {
    userSettings.maxTemperature = 50;
  }

  const [ shouldSendTweets, setShouldSendTweets ] = useState(userSettings.shouldSendTweets);
  const [ minTemperature, setMinTemperature ] = useState(userSettings.minTemperature);
  const [ maxTemperature, setMaxTemperature ] = useState(userSettings.maxTemperature);
  const [ minLight, setMinLight ] = useState(userSettings.minLight);
  const [ maxLight, setMaxLight ] = useState(userSettings.maxLight);
  const [ minMoisture, setMinMoisture ] = useState(userSettings.minMoisture);
  const [ bulbColor, setBulbColor ] = useState(userSettings.bulbColor);
  const [ bulbBrightness, setBulbBrightness ] = useState(userSettings.bulbBrightness);

  useEffect(() => {
    onSettingChange({
      plant: userSettings.plant,
      zone: userSettings.zone,
      shouldSendTweets,
      minTemperature, maxTemperature,
      minLight, maxLight,
      minMoisture,
      bulbColor, bulbBrightness,
    });
  }, [shouldSendTweets, minTemperature, maxTemperature, minLight, maxLight, minMoisture, bulbColor, bulbBrightness]);

  const toggleShouldTweet = () => {
    setShouldSendTweets(!shouldSendTweets);
  }

  return (
    <ScrollView style={styles.container}>

      <View style={{ flexDirection: 'row' }}>
        <Text
          onPress={toggleShouldTweet}
          style={{ ...styles.label, marginRight: 15 }}
        >Send alerts via Twitter</Text>
        <Switch
          value={shouldSendTweets}
          thumbColor={shouldSendTweets ? theme.accentColor : theme.inactiveColor}
          trackColor={{
            false: theme.inactiveColor,
            true: theme.inactiveAccentColor,
          }}
          onValueChange={toggleShouldTweet}
        />
      </View>

      <View style={styles.sliderPairContainer}>
        <View style={styles.sliderContainer}>
          <LabelledSlider
            label="Min temp"
            value={minTemperature}
            unit="°C"
            minVal={0}
            maxVal={maxTemperature}
            setVal={setMinTemperature}
          />
        </View>

        <View style={styles.sliderContainer}>
          <LabelledSlider
            label="Max temp"
            value={maxTemperature}
            unit="°C"
            minVal={minTemperature}
            maxVal={50}
            setVal={setMaxTemperature}
          />
        </View>
      </View>

      <View style={styles.sliderPairContainer}>
        <View style={styles.sliderContainer}>
          <LabelledSlider
            label="Min light level"
            value={minLight}
            minVal={0}
            maxVal={maxLight}
            setVal={setMinLight}
          />
        </View>

        <View style={styles.sliderContainer}>
          <LabelledSlider
            label="Max light level"
            value={maxLight}
            minVal={minLight}
            maxVal={255}
            setVal={setMaxLight}
          />
        </View>
      </View>

      <LabelledSlider
        label="Min moisture level"
        value={minMoisture}
        minVal={0}
        maxVal={255}
        setVal={setMinMoisture}
      />

      <LabelledSlider
        label="Light level"
        value={bulbBrightness}
        minVal={1}
        maxVal={255}
        setVal={setBulbBrightness}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: 'white',
    fontSize: 16,
  },
  sliderPairContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderContainer: {
    width: '45%',
  },
});

export default PlantSettings;
