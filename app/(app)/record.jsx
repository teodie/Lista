import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import { initWhisper } from 'whisper.rn'
import { PermissionsAndroid, View, Alert, Linking } from 'react-native'
import { useAudioRecorder, RecordingPresets } from 'expo-audio'


const record = () => {
  const [text, setText] = useState('Sample text')
  const [transcribing, setTranscribing] = useState(false)
  const [recordingPath, setRecordingPath] = useState(null)
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const [onGoingRecording, setOnGoingRecording] = useState(false)


  const realTimeTranscriber = async () => {
    const modelPath = require('@/assets/models/ggml-tiny.bin')

    const whisperContext = await initWhisper({
      filePath: modelPath,
    })

    const options = { language: null }

    const { stop, subscribe } = await whisperContext.transcribeRealtime(options)

    subscribe((evt) => {
      const { isCapturing, data, processTime, recordingTime } = evt
      console.log(
        `Realtime transcribing: ${isCapturing ? 'ON' : 'OFF'}\n` +
        `Result: ${data.result}\n\n` +
        `Process time: ${processTime}ms\n` +
        `Recording time: ${recordingTime}ms`,
      )
      if (!isCapturing) console.log('Finished realtime transcribing')
    })


  }

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

    if (audioRecordingPermitted) return "granted"

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

      return granted

    } catch (error) {
      console.log(error)
      return null
    }

  }

  const convertAudioM4aToWav = () => {

  }

  const startRecord = async () => {
    setOnGoingRecording(true)

    const result = await requestAudioPermission()

    if (result !== PermissionsAndroid.RESULTS.GRANTED) return changePermissionInSettings()

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

    }
  }

  const stopRecording = async () => {
    console.log(`Audio recording is available in ${audioRecorder.uri}`)
    setRecordingPath(audioRecorder.uri)
    await audioRecorder.stop();

    setOnGoingRecording(false)
  }

  const handleRecordPress = async () => {
    if (onGoingRecording) {
      await stopRecording()
    } else {
      await startRecord()
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, borderWidth: 1, gap: 20, paddingBottom: 50 }}>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {
          transcribing
            ? <ActivityIndicator />
            : <Text>{text}</Text>
        }
      </View>
      <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center' }}>
        <Button
          mode='contained'
          onPress={handleRecordPress}
        >{onGoingRecording ? "Stop" : "Record"}</Button>

        <Button
          mode='contained'
          onPress={realTimeTranscriber}
        >Transcribe</Button>
      </View>
    </SafeAreaView>
  )
}

export default record
