import React from 'react'
import AppNavigator from '../navigation/AppNavigator'
import { SafeAreaView, StatusBar } from 'react-native'
import { useThemeContext } from '../theme/ThemeProvider'

const Main = () => {
  const {theme}=useThemeContext()
  return (
    <SafeAreaView  style={{flex:1, }}>
       <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      <AppNavigator/>
    </SafeAreaView>
  )
}

export default Main