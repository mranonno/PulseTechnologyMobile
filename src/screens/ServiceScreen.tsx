import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useThemeContext } from '../theme/ThemeProvider';

const ServiceScreen = () => {

  const { colors } = useThemeContext();
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Text>No service available</Text>
    </View>
  )
}

export default ServiceScreen
const getStyles=(colors:Colors)=> StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:colors.background
  }
})