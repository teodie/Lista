import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Image, FlatList, Pressable, Platform
} from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
import * as FileSystem from 'expo-file-system'
import { utangData } from '../constants/utangList';
import AddItems from '@/components/AddItems';
import { MODE } from '../constants/mode';
import UtangOverView from '@/components/UtangOverView';
import AsyncStorage from '@react-native-async-storage/async-storage';


const explore = () => {
  const [mode, setMode] = useState(MODE.IDLE)
  const [isRecording, setIsRecording] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [utang, setUtang] = useState([]);
  const [transcribedText, setTranscribedText] = useState('');

  const [currentPersonData, setcurrentPersonData] = useState(null);
  const [id, setId] = useState(null);

  const [search, onChangeSearch] = useState('');
  const [name, onChangeName] = useState('');

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const filterName = useMemo(() => utang.filter(items => search.toLowerCase() === '' ? items.name : items.name.toLowerCase().includes(search.toLowerCase())), [utang, search])

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('Listahan');
        const storageUtang = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (storageUtang && storageUtang.length) {
          setUtang(storageUtang.sort((a, b) => b.id - a.id))
        } else {
          setUtang(utangData.sort((a, b) => b.id - a.id))
        }

      } catch (e) {
        console.error('Error retrieving the data erro: ', e)
      }
    };


    const getPermission = async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission needed', 'This app needs access to your microphone to record audio.');
        }
      } catch (err) {
        console.error('Failed to get permission:', err);
      }
    };

    getData()
    getPermission();
  }, []);


  useEffect(() => {
    const storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('Listahan', jsonValue);
      } catch (e) {
        console.log('Error saving the data with error: ', e)
      }
    };

    storeData(utang)
  }, [utang])


  const createName = () => {
    if (name.trim()) {
      const newId = utang.length > 0 ? utang[0].id + 1 : 1;
      setUtang([{ id: newId, name: name.toUpperCase(), items: [] }, ...utang])
      onChangeName('')
    }
  };

  const updateName = (id) => {
    setUtang(utang.map(item => item.id === id ? { ...item, name: name } : item))
    console.log(id.toString() + " Has been Updated.")
  };

  const deleteName = (id) => {
    Alert.alert(
      'Deleting Client Data',
      'Client Data will be permanently deleted\nStill want to delete this client data?',
      [{ text: 'Cancel', style: 'cancel' }, {
        text: "Delete", onPress: () => {
          Alert.alert('Sure na Sure?', '', [
            { text: 'Hinde', style: 'cancel' },
            {
              text: 'Oo',
              onPress: () => {
                setUtang(utang.filter(item => item.id !== id))
              }, style: 'destructive'
            }])
        }, style: 'default'
      }],
      {cancelable: true},
    )

  };


  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const handleApiError = (error) => {
    if (error.response?.status === 429) {
      Alert.alert(
        'Rate Limit Reached',
        'You have reached your API quota limit. Please try again later.'
      );
    } else if (error.response?.status === 401) {
      Alert.alert(
        'Authentication Error',
        'Invalid API key or authentication failed.'
      );
    } else if (error.response?.status === 400) {
      Alert.alert(
        'Invalid Request',
        'There was a problem with the request. Please try again.'
      );
    } else {
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again later.'
      );
    }
  };

  const sendToWhisper = async (audioUri) => {
    try {
      setMode(MODE.PROCESSING);

      // Read the audio file as base64
      const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });
      formData.append('model', 'whisper-1');
      formData.append('language', 'tl'); // Filipino/Tagalog

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${'api for whisper'}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          response: {
            status: response.status,
            data: errorData
          }
        };
      }

      const data = await response.json();
      setTranscribedText(data.text);
      await parseTranscription(data.text);
    } catch (error) {
      console.error('Error sending to Whisper:', error);
      handleApiError(error);
    } finally {
      setMode(MODE.IDLE);
    }
  };

  const parseTranscription = async (text) => {
    try {
      setMode(MODE.PROCESSING);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${'api for whisper'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "You are a helper that converts Filipino/Tagalog sari-sari store orders into structured JSON. Extract customer name and items with quantities."
          }, {
            role: "user",
            content: text
          }],
          functions: [{
            name: "process_order",
            parameters: {
              type: "object",
              properties: {
                customer_name: { type: "string" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      item: { type: "string" },
                      quantity: { type: "number" }
                    }
                  }
                }
              }
            }
          }],
          function_call: { name: "process_order" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          response: {
            status: response.status,
            data: errorData
          }
        };
      }

      const data = await response.json();
      const parsedOrder = JSON.parse(data.choices[0].message.function_call.arguments);
      setParsedData(parsedOrder);
      console.log('Parsed order:', parsedOrder);
    } catch (error) {
      console.error('Error parsing with GPT:', error);
      handleApiError(error);
    } finally {
      setMode(MODE.IDLE);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);

      console.log('Recording saved at:', audioRecorder.uri);
      // Send to Whisper after recording stops
      await sendToWhisper(audioRecorder.uri);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAddPress = () => {

    switch (mode) {
      case MODE.ADD_NAME:
        setMode(MODE.IDLE)
        createName()
        break;
      case MODE.EDIT_NAME:
        setMode(MODE.IDLE)
        updateName(id)
        onChangeName('')
        setId(null)
        break;
      default:
        console.log("Unexpected Mode" + mode)
    }

  }

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>

        <Text style={styles.titleTxt}>Lista</Text>

        <View style={{ flexDirection: "row", margin: 10 }}>
          <TextInput
            style={styles.searchInput}
            onChangeText={onChangeSearch}
            placeholder='Search Here...'
            value={search}
          />
        </View>

      </View>

      <FlatList
        data={filterName}
        renderItem={({ item }) =>
          <UtangOverView
            person={item}
            setMode={setMode}
            setId={setId}
            onChangeName={onChangeName}
            deleteName={deleteName}
            setcurrentPersonData={setcurrentPersonData}
          />}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />

      {mode === MODE.PROCESSING && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#5959B2" />
          <Text style={styles.processingText}>Processing your request...</Text>
        </View>
      )}

      {mode === MODE.ADD_ITEM && currentPersonData &&
        < AddItems
          personData={currentPersonData}
          utang={utang}
          setUtang={setUtang}
          setMode={setMode}
        />
      }

      {(mode === MODE.ADD_NAME || mode === MODE.EDIT_NAME) && (
        <View style={styles.processingOverlay}>
          <TextInput style={{ height: 'auto', borderWidth: 1, borderColor: 'black', width: "70%", borderRadius: 5 }}
            onChangeText={onChangeName}
            placeholder='Type the name here....'
            value={name}
            autoFocus={true}
          />

          <TouchableOpacity style={styles.iconStyle} onPress={handleAddPress} >
            <MaterialIcons name='add' size={40} color="white" />
          </TouchableOpacity>

        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "center" }}>

        <TouchableOpacity
          style={[styles.iconStyle, mode === MODE.PROCESSING && styles.disabledButton]}
          onPress={handleRecordPress}
          disabled={mode === MODE.PROCESSING}
        >
          <MaterialIcons name={isRecording ? "stop" : "mic"} size={40} color="#E8E8E8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconStyle} onPress={() => { setMode(MODE.ADD_NAME) }} >
          <MaterialIcons name='add' size={40} color="#E8E8E8" />
        </TouchableOpacity>

      </View>


      {transcribedText ? (
        <View style={styles.resultContainer}>
          <Text style={styles.transcribedText}>{transcribedText}</Text>
          {parsedData && (
            <Text style={styles.parsedData}>
              {JSON.stringify(parsedData, null, 2)}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  )
}

export default explore

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'left',
  },
  iconStyle: {
    backgroundColor: '#5959B2',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingText: {
    marginTop: 10,
    color: '#5959B2',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 20,
    maxHeight: '50%',
  },
  transcribedText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  parsedData: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  headerContainer: {
    height: 150,
    backgroundColor: '#5959B2',
    justifyContent: "flex-end",
  },
  searchInput: {
    height: 40,
    flexGrow: 1,
    // borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  titleTxt: {
    fontSize: 40,
    marginLeft: 15,
    fontWeight: "bold",
    color: "white"
  }

})