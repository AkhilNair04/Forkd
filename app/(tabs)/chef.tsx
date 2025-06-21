import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChefScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Fork&apos;d!</Text>
      <Text style={styles.subtext}>Chefffffff</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C67C4E',
    textAlign: 'center',
  },
  subtext: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
