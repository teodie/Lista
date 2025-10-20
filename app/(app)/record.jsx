import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import { PermissionsAndroid, View, Alert, Linking } from 'react-native'
import { useAudioRecorder, RecordingPresets } from 'expo-audio'
import { FFmpegKit, ReturnCode } from 'kroog-ffmpeg-kit-react-native';
import { initWhisper, initWhisperVad } from 'whisper.rn'
import { AudioPcmStreamAdapter } from 'whisper.rn/realtime-transcription/adapters/AudioPcmStreamAdapter.js'
import * as RNFS from 'react-native-fs'
import { fileDir } from '@/app/(test)/util'
import { useRouter } from 'expo-router'
import { RealtimeTranscriber } from 'whisper.rn/realtime-transcription/RealtimeTranscriber.js'
import LiveAudioStream from '@fugood/react-native-audio-pcm-stream';

const record = () => {
  const router = useRouter()
  const [transcribingRealtime, setTranscribingRealtime] = useState(false)
  const [text, setText] = useState('')
  const [transcribing, setTranscribing] = useState(false)
  const [recordingPath, setRecordingPath] = useState('')
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const [onGoingRecording, setOnGoingRecording] = useState(false)
  const modelPath = `${fileDir}/ggml-medium-q8_0.bin`
  const sampleFilePath = require('@/assets/recordings/samples_jfk.wav')
  


  const RealTimeTranscribe = async () => {

    const whisperContext = await initWhisper({ filePath: modelPath })

    const vadContext = await initWhisperVad({
      filePath: require('@/assets/models/ggml-silero-v5.1.2.bin'), // VAD model file
      useGpu: true, // Use GPU acceleration (iOS only)
      nThreads: 2, // Number of threads for processing
    })

    const audioStream = new AudioPcmStreamAdapter()

    // Create transcriber
    const transcriber = new RealtimeTranscriber(
      { whisperContext, vadContext, audioStream, fs: RNFS },
      {
        audioSliceSec: 30,
        vadPreset: 'default',
        autoSliceOnSpeechEnd: true,
        transcribeOptions: { language: 'en' },
      },
      {
        onTranscribe: (event) => console.log('Transcription:', event.data?.result),
        onVad: (event) => console.log('VAD:', event.type, event.confidence),
        onStatusChange: (isActive) =>
          console.log('Status:', isActive ? 'ACTIVE' : 'INACTIVE'),
        onError: (error) => console.error('Error:', error),
      },
    )

    console.log("Inialization complete!")
  //  await transcriber.start()

    // setTimeout( async () => {
    //  await transcriber.stop()
    // }, 5000);

  }

  const convertM4AToWav = async (inputUri) => {
    const outputPath = inputUri.replace(/\.m4a$/i, '.wav');
    console.log("outPutPath: ", outputPath)
    // Build a command: e.g., convert with PCM 16-bit, 16000 Hz, mono for transcription
    const cmd = `-y -i "${inputUri}" -ac 1 -ar 16000 -sample_fmt s16 "${outputPath}"`;

    const session = await FFmpegKit.execute(cmd);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      console.log('Conversion succeeded:', outputPath);
      return outputPath;
    } else {
      const log = await session.getAllLogsAsString();
      console.error('Conversion failed. Return code:', returnCode, 'Log:', log);
      throw new Error('Audio conversion failed');
    }
  }


  const transcribe = async () => {
    setTranscribing(true)

    if(!(await RNFS.exists(modelPath))) return Alert.alert("Model medium-q8.bin doesnot exist") 
      
    const uri = await convertM4AToWav(audioRecorder.uri)
    const whisperContext = await initWhisper({ filePath: modelPath, })

    const options = { language: 'tl' }

    const { stop, promise } = whisperContext.transcribe(uri, options)

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
    <SafeAreaView style={{ flex: 1, gap: 20, paddingBottom: 50 }}>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <Text variant='headlineLarge'>Results</Text>
        <View style={{ borderWidth: 1, height: '50%', width: '90%', borderRadius: 10, padding: 5 }}>
          {
            transcribing
              ? <ActivityIndicator />
              : <Text>{text}</Text>
          }
        </View>
        <Button
          mode='contained'
          onPress={() => {
            setText('')
            setRecordingPath('')
          }}
        >Clear</Button>

        <Button
          mode='contained'
          onPress={() => router.push('/(test)/bench')}
        >Download model</Button>
        <Button
          mode='contained'
          onPress={() => router.push('/(test)/vad')}
        >Vad</Button>

      </View>
      <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          mode='contained'
          onPress={handleRecordPress}
        >{onGoingRecording ? "Stop" : "Record"}</Button>

        <Button
          mode='contained'
          disabled={recordingPath === '' ? true : false}
          onPress={() => transcribe()}
        >Transcribe</Button>

        <Button
          mode='contained'
          onPress={() => router.replace('/(test)/livestream')}
        >RealTime</Button>
      </View>
    </SafeAreaView>
  )
}

export default record
