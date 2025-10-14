import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import { initWhisper } from 'whisper.rn'
import { View } from 'react-native'

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

  return (
    <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1, borderWidth: 1, gap: 20 }}>

      {
        transcribing
          ? <ActivityIndicator />
          : <Text>{text}</Text>
      }

      <Button
        mode='contained'
        onPress={transcribe}
      >Transcribe</Button>
    </SafeAreaView>
  )
}

export default record
