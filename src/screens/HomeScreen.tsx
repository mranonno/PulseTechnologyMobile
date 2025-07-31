import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useThemeContext } from '../theme/ThemeProvider';

const HomeScreen = () => {
  const { colors } = useThemeContext();
    const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const getStyles=(colors:Colors)=> StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:colors.background
  }
})