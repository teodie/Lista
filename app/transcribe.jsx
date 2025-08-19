import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { useAudioRecorder, AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorderState } from 'expo-audio'
import { cacheDirectory, documentDirectory } from 'expo-file-system'

const API_CONFIG = {
    DEV_BASE_API: 'http://192.168.100.11:3500/transcribe',
    PROD_BASE_URL: 'https://Lista.net',
}

const transcriber = async (audioUri) => {
    const audioFileName = audioUri.split("/").pop()
    
    const formData = new FormData()
    formData.append('title', 'audio');
    formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name:  audioFileName,
    });

    const response = await fetch(API_CONFIG.DEV_BASE_API, {
        method: 'POST',
        body: formData,
    })

    return await response.json()

}

const Transcribe = () => {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
    const recorderState = useAudioRecorderState(audioRecorder)

    const [transcribeTxt, setTranscribeTxt] = useState('')

    const record = async () => {
        await audioRecorder.prepareToRecordAsync()
        audioRecorder.record()
    }

    const stopRecording = async () => {
        await audioRecorder.stop()

        try {
            const data = await transcriber(audioRecorder.uri)
            setTranscribeTxt(JSON.stringify(data))
        } catch (e) {
            console.log('Failed connecting to the server.')
        }
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

            <TouchableOpacity style={styles.recordBtn} onPress={handleRecordPress} >
                <View>
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
        position: 'relative',
    },
    txtContainer: {
        borderWidth: 1,
        height: 200,
        minWidth: 400,
        maxWidth: '90%',
        borderRadius: 20,
        padding: 10,

    },
    recordBtn: {
        // borderWidth: 1,
        borderRadius: '50%',
        padding: 10,
        backgroundColor: "#5959B2",
        position: 'absolute',
        bottom: 35,
        right: 35,
    }

})