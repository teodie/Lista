import { View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import React from 'react'
import {useNetInfo} from '@react-native-community/netinfo'

const NoInternet = () => {
  const {isConnected } = useNetInfo()
  const theme = useTheme()

  return (
    <>
    {
      !isConnected && <View style={{borderWidth: 1, alignItems: 'center', height: 30, width: '95%', alignSelf: 'center', borderRadius: 5, marginVertical: 5, justifyContent: 'center', borderColor: theme.colors.error}}>
      <Text style={{color: theme.colors.error, fontWeight: 300}}>No Internet Connection</Text>
    </View>
    }
    </>
    
  )
}

export default NoInternet