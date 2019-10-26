import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const TempScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView
        style={{ height: '50%' }}
        contentContainerStyle={styles.graphSetContainer}
        horizontal
      >
        <View style={styles.graph}>
          <Text>Graph 1</Text>
        </View>
        <View style={styles.graph}>
          <Text>Graph 2</Text>
        </View>
        <View style={styles.graph}>
          <Text>Graph 3</Text>
        </View>
      </ScrollView>

      <View style={styles.mainGraph}>
        <Text>Main Graph</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  graphSetContainer: {
    flex: 1,
    width: 300,
    height: 300,
    backgroundColor: 'red',
  },
  mainGraph: {
    flex: 1,
    backgroundColor: 'green',
  },
  graph: {
    width: '50%',
    height: '100%',
    backgroundColor: 'yellow',
  },
});

export default TempScreen;
