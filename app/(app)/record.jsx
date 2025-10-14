import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import { initWhisper } from 'whisper.rn'
import { PermissionsAndroid, View, Alert, Linking } from 'react-native'

const record = () => {
  const [text, setText] = useState('')
  const [transcribing, setTranscribing] = useState(false)

  const transcribe = async () => {
    setTranscribing(true)
    const modelPath = require('@/assets/models/ggml-tiny.bin')

    const whisperContext = await initWhisper({
      filePath: modelPath,
    })

    const soundWav = require('@/assets/recordings/samples_jfk.wav')
    const options = { language: 'en' }

    const { stop, promise } = whisperContext.transcribe(soundWav, options)

    const { result } = await promise

    setText(result)

    setTranscribing(false)
  }

  const changePermissionInSettings = () => {
    Alert.alert(
      'Audio Recording Permission',
      'Persmision is needed to use voice typing feature of the app.',
      [
        { text: 'Dismis', style: 'cancel' },
        {
          text: 'Open Settings',
          style: 'default',
          onPress: () => {
            Linking.openSettings()
          }
        },
      ]

    )
  }

  const requestAudioPermission = async () => {
    const audioRecordingPermitted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)

    console.log("Current Permission: ", audioRecordingPermitted)
    
    if(audioRecordingPermitted) return console.log("Permission already granted")

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Recording Permission',
          message:
            'Lista App needs access to your audio recording ' +
            'so you can use voice typing feature of the app.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )

      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        changePermissionInSettings()
      }

      return granted

    } catch (error) {
      console.log(error)
      return null
    }

  }

  const startRecord = async () => {
    
    
    const result = await requestAudioPermission()


  }

  return (
    <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1, borderWidth: 1, gap: 20 }}>

      {
        transcribing
          ? <ActivityIndicator />
          : <Text>{text}</Text>
      }

      <View style={{ flexDirection: 'row', gap: 20 }}>
        <Button
          mode='contained'
          onPress={startRecord}
        >Record</Button>

        <Button
          mode='contained'
          onPress={transcribe}
        >Transcribe</Button>
      </View>
    </SafeAreaView>
  )
}

export default record
