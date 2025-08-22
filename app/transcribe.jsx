import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState, useEffect, use } from 'react'
import { useAudioRecorder, AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorderState } from 'expo-audio'
import { cacheDirectory, documentDirectory } from 'expo-file-system'
import uuid from 'react-native-uuid';

const API_CONFIG = {
    DEV_BASE_API: 'http://192.168.100.11:3500/transcribe',
    PROD_BASE_URL: 'https://Lista.net',
}

export const converToObj = (txt) => {
    const txtArr = txt.split(' ')
    const item = []

    for(let i = 0; i < txtArr.length; i += 2){
        if(txtArr[i] && txtArr[i+1]){
            item.push({id: uuid.v4(), product: txtArr[i], price: Number(txtArr[i+1])})
        }
    }

    return item
}

const transcriber = async (audioUri) => {
    const audioFileName = audioUri.split("/").pop()

    const formData = new FormData()
    formData.append('title', 'audio');
    formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: audioFileName,
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

    const txt = 'Teodi kamatis 10 candy 10 dowee 12 mantika 40'

    const data = {
        'name': '', "items": [
            { "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "product": "sardines", "price": 28 },
            { "id": "b2c3d4e5-f6g7-8901-bcde-f23456789012", "product": "garlic", "price": 5 },
            { "id": "c3d4e5f6-g7h8-9012-cdef-345678901234", "product": "onion", "price": 12 },
            { "id": "d4e5f6g7-h8i9-0123-defa-456789012345", "product": "rice", "price": 45 }]
    }

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

            <Text style={styles.nameTxt}>{data.name}</Text>

            <TextInput
                style={styles.txtContainer}
                multiline={false}
                onChangeText={setTranscribeTxt}
                value={transcribeTxt}
                placeholder='Start talking...'
            />

            <TouchableOpacity style={styles.recordBtn} disabled={false} onPress={() => converToObj(txt)} >
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
        // height: 200,
        minWidth: 400,
        borderRadius: 20,
        padding: 10,
        textAlignVertical: 'top',

    },
    recordBtn: {
        // borderWidth: 1,
        borderRadius: '50%',
        padding: 10,
        backgroundColor: "#5959B2",
        position: 'absolute',
        bottom: 35,
        right: 35,
    },

})