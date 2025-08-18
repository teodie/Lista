import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { useAudioRecorder, AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorderState} from 'expo-audio'
import { moveAsync, documentDirectory, cacheDirectory } from 'expo-file-system'

const Transcribe = () => {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
    const recorderState = useAudioRecorderState(audioRecorder)

    const [transcribeTxt, setTranscribeTxt] = useState('This is sample Transcribe Text!')

    const record = async () => {
        await audioRecorder.prepareToRecordAsync()
        audioRecorder.record()
    } 

    const stopRecording = async () => {
        await audioRecorder.stop()
    }

    const handleRecordPress = () => {
        !recorderState.isRecording
        ? record()
        : stopRecording()
    }


    return (

        <View style={styles.transcribeContainer} >

            <View style={styles.txtContainer}>
                <Text>{transcribeTxt}</Text>
            </View>

            <TouchableOpacity onPress={handleRecordPress} >
                <View style={styles.recordBtn}>
                    <MaterialIcons name={recorderState.isRecording ? 'stop' : 'mic'} size={40} color="white" />
                </View>
            </TouchableOpacity>

        </View>
    )
}

export default Transcribe

const styles = StyleSheet.create({
    transcribeContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    txtContainer: {
        borderWidth: 1,
        height: 200,
        width: 400,
        borderRadius: 20,
        padding: 10,
    },
    recordBtn: {
        // borderWidth: 1,
        borderRadius: '50%',
        padding: 10,
        backgroundColor: "#5959B2",
    }

})