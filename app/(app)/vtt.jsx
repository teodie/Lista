import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import CustomButton from '@/components/CustomButton';
import * as FileSystem from 'expo-file-system';
export default function App() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // const status = useAudioRecorderState(audioRecorder);

  const [audioFileUri, setAudioFileUri] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const [playbackPosition, setPlaybackPosition] = useState(0);

  // console.log('status: ', status);
  // console.log('audioRecorder: ', audioRecorder);

  const handleStartRecording = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();

    setIsRecording(true);
    setAudioFileUri('');
    setTranscription('');
  };

  const handleStopRecording = async () => {
    await audioRecorder.stop();

    if (audioRecorder.uri) {
      setAudioFileUri(audioRecorder.uri);
    }

    setIsRecording(false);
    console.log('audioRecorder: ', audioRecorder.uri);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  const handleConvert = async () => {
    console.log("This runs")
    if (!audioFileUri) {
      Alert.alert('No audio file to convert');
      return;
    }

    const base64Audio = await FileSystem.readAsStringAsync(audioFileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await fetch('https://69392d8300291995b0e0.syd.appwrite.run/stt', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ base64Audio }),
    });

    console.log({response})
    const data = await response.json()
    console.log('data: ', data);
    setTranscription(data.transcription);
  };


  return (
    <View style={styles.container}>
      {isRecording ? (
        <Pressable
          onPress={handleStopRecording}
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: 100,
            backgroundColor: 'crimson',
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}
        />
      ) : (
        <Pressable
          onPress={handleStartRecording}
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: 100,
            backgroundColor: 'gainsboro',
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}
        />
      )}

      {audioFileUri && (
        <View>
          <AudioPlayer
            uri={audioFileUri}
            onPlaybackPositionChange={setPlaybackPosition}
          />
          <CustomButton title='Convert to text' onPress={handleConvert} />
        </View>
      )}

      {transcription && (
        <View>
          {/* <Text>{transcription.text}</Text> */}
          <Text>position: {playbackPosition}</Text>
          <Text style={{ fontSize: 20, fontWeight: '600', lineHeight: 30 }}>
            {transcription.words.map((word, index) => (
              <Text
                key={index}
                style={{
                  backgroundColor:
                    playbackPosition > word.start && playbackPosition < word.end
                      ? 'pink'
                      : 'transparent',
                }}
              >
                {word.text}
              </Text>
            ))}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    gap: 10,
  },
});