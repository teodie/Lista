import React, { useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { IconButton } from 'react-native-paper'
import {requestAudioPermission} from 'expo-audio'

const getSttToken = async (urlEndpoint) => {
  try {
    const response = await fetch(urlEndpoint, {
      method: 'GET',
    })

    const token = await response.json()
    console.log(token)
  } catch (error) {
    console.log(error)
  }
}

const vtt = () => {
  const [text, setText] = useState()
  const tokenGenEndpoint = process.env.EXPO_PUBLIC_TOKEN_GENERATOR_END_POINT

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: 24 }}>
      <View style={{ width: '100%', alignItems: 'center',  }}>
        <View style={{width: '100%', borderWidth: 1, borderColor: 'gray', borderRadius: 10}}>
          <TextInput
            value={text}
            onChangeText={setText}
            multiline={true}
          />
        </View>
        <IconButton icon='microphone' onPress={async () => {
          console.log(await requestAudioPermission())
        }}/>
      </View>
    </View>
  )
}

export default vtt