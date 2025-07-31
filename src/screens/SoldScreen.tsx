import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useThemeContext } from '../theme/ThemeProvider';

const SoldScreen = () => {
  const {colors}=useThemeContext()
  const styles=getStyles(colors)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sold Products</Text>
      <Text style={styles.subtitle}>No products have been sold yet.</Text>
    </View>
  );
};

export default SoldScreen;

const getStyles=(colors:any)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});
