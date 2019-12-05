import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet, Text, ScrollView } from 'react-native';
import { PlantSetting, PlantHealth } from '../types';
import theme from '../theme';
import { Slider } from 'react-native-elements';
import { parseDate } from '../App';

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
  lastUpdate: PlantSetting['lastUpdate'],
  healthData?: PlantHealth,
  onSettingChange: (newSetting: PlantSetting) => void,
}

const PlantSettings = ({ userSettings, lastUpdate, healthData, onSettingChange }: Props) => {
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

      {healthData && (healthData.soil || healthData.leaf || healthData.stem) ? (
        <View style={styles.healthContainer}>
          {healthData.soil ? <Text style={styles.infoText}>{healthData.soil}</Text> : null}
          {healthData.leaf ? <Text style={styles.infoText}>{healthData.leaf}</Text> : null}
          {healthData.stem ? <Text style={styles.infoText}>{healthData.stem}</Text> : null}
        </View>
      ) : null}

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

      {lastUpdate ? (
        <Text style={{ ...styles.infoText, textAlign: 'left' }}>Last interacted with: {parseDate(new Date(lastUpdate * 1000), ', ')}</Text>
      ) : null}

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
  healthContainer: {
    justifyContent: 'center',
    paddingBottom: 7,
    marginBottom: 7,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  infoText: {
    fontStyle: 'italic',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
