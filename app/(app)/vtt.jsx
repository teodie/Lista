import React, { useState } from 'react'
import { View, Text, TextInput, Alert } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import {
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioPlayer,
} from 'expo-audio';

const vtt = () => {
  const [text, setText] = useState('')
  const [audioPath, setAudioPath] = useState('')
  const player = useAudioPlayer(audioPath);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const tokenGenEndpoint = process.env.EXPO_PUBLIC_TOKEN_GENERATOR_END_POINT

  const startRecording = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  }

  const stopRecording = async () => {
    await audioRecorder.stop();
    setAudioPath(audioRecorder.uri)
    console.log(`Recording is available on ${audioRecorder.uri}`)
  }

  const playSound = () => {
    console.log("Playing the sound")
    if(audioPath) return player.play();
  }

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

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: 24 }}>
      <View style={{ width: '100%', alignItems: 'center', }}>
        <View style={{ width: '100%', borderWidth: 1, borderColor: 'gray', borderRadius: 10 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            multiline={true}
          />
        </View>

        <View style={{
          padding: 3,
          borderRadius: '50%',
        }}>
          <IconButton icon='microphone' mode={recorderState.isRecording ? 'contained' : ''} onPress={async () => {
            const request = await requestRecordingPermissionsAsync()
            // {"canAskAgain": true, "expires": "never", "granted": true, "status": "granted"}
            if (request.status !== 'granted') return Alert.alert("Permission to record is needed")
            recorderState.isRecording ? stopRecording() : startRecording()
          }} />
        </View>

        {audioPath && <Button mode='contained' onPress={() => playSound()} >Play</Button>}

      </View>
    </View>
  )
}

export default vtt